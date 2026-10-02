# Bitácora de Lecciones Aprendidas (SDD)

Este documento recopila las lecciones aprendidas, patrones arquitectónicos consolidados y decisiones de diseño adoptadas a lo largo del ciclo de vida del proyecto.

---

## 1. Cultura Spec-Driven Development (Anthropic)
- **Lección 1: Separación Taxativa del Qué y el Cómo.**
  - *Contexto:* La tendencia natural en desarrollo asistido por IA ("vibe coding") es saltar a escribir código directamente en la terminal.
  - *Aprendizaje:* Al obligar al agente y al equipo a formalizar primero el `Intent` y el `Spec`, se eliminan ambigüedades sobre requerimientos críticos (como el uso estricto de pnpm o la regla de 48 horas de antigüedad en librerías).
- **Lección 2: La Entrega como Puerta Calificada (Gate).**
  - *Contexto:* Tradicionalmente se asume una entrega como finalizada tan pronto se compila el código.
  - *Aprendizaje:* Adoptar el principio de "No hay entrega sin Agentest" previene falsos positivos y garantiza que cada criterio de aceptación sea verificado por pruebas reproducibles.

---

## 2. Gobernanza y Cadena de Suministro (Supply-Chain Security)
- **Lección 3: Cuarentena de Paquetes en PNPM.**
  - *Contexto:* Se requería impedir la instalación de librerías publicadas hace menos de 48 horas para protegerse de ataques de supply-chain (ej. paquetes maliciosos de vida corta).
  - *Aprendizaje:* `pnpm` (a partir de v10.16/v11) ofrece soporte nativo mediante `minimum-release-age` (expresado en minutos). Configurar `minimum-release-age=2880` en `.npmrc` y `minimumReleaseAge: 2880` en `pnpm-workspace.yaml` ofrece un blindaje a nivel de motor sin sobrecargar el código de aplicación.
- **Lección 4: Restricción Determinista de NPM.**
  - *Contexto:* En Windows, los desarrolladores y agentes pueden accidentalmente invocar `npm install`.
  - *Aprendizaje:* El hook `preinstall` en `package.json` evaluando `process.env.npm_execpath` proporciona una intercepción temprana infalible antes de que se descargue cualquier byte.

---

## 3. Integración Transaccional Placetopay
- **Lección 5: Robustez en el Cálculo de Autenticación Criptográfica.**
  - *Contexto:* Los errores más comunes reportados en soporte ("Error 102" y "Autenticación mal formada") radican en la generación del digest `tranKey` y formato de `seed`/`nonce`.
  - *Aprendizaje:* Centralizar la lógica criptográfica en una skill reusable (`placetopay-auth`) garantiza que tanto la implementación del backend como los agentes de soporte utilicen la misma definición matemática exacta de `Base64(SHA256(rawNonce + seed + secretKey))`.

---

## 4. Control de Versiones Git y Ramas por Spec (Anthropic SDD)
- **Lección 6: Commits Atómicos por Responsabilidad y Prohibición de `git add .`.**
  - *Contexto:* El uso indiscriminado de `git add .` agrupa archivos de distintas responsabilidades en un solo commit, degradando la trazabilidad histórica y aumentando riesgos de filtración.
  - *Aprendizaje:* La segregación estricta de cambios por responsabilidad temática (`chore`, `feat`, `docs`, `test`, `fix`) con staging explícito archivo por archivo asegura claridad absoluta en las revisiones.
- **Lección 7: Compuerta de Aprobación Humana (Merge Gate).**
  - *Contexto:* Los agentes autónomos no deben realizar fusiones unilaterales a `main` sin verificación de los tomadores de decisión humanos.
  - *Aprendizaje:* Aislar cada spec en ramas `feat/spec-XXX-<slug>` y exigir la validación de los Agentests antes de que el usuario humano autorice y ejecute el `git merge` garantiza la máxima seguridad operativa en SDD.

---

## 5. Arquitectura Transaccional y Contratos del Mockup MVP (Spec-03)
- **Lección 8: Persistencia Nativa con Node.js 24 (`node:sqlite`).**
  - *Contexto:* Las librerías de SQLite tradicionales (`better-sqlite3`, `sqlite3`) requieren compilación binaria nativa (node-gyp, python, vs-build-tools), lo que genera fricciones en entornos Windows y riesgos de cuarentena de paquetes.
  - *Aprendizaje:* Node.js v24 incorpora `node:sqlite` (`DatabaseSync`), permitiendo ejecutar SQLite de manera estándar, síncrona y con rendimiento nativo, con cero dependencias externas de npm y cumpliendo al 100% los guardrails.
- **Lección 9: Desacoplamiento de Contratos de Datos para el Mockup MVP.**
  - *Contexto:* Para construir el mockup y carrito de compras sin sorpresas de integración, el frontend debe conocer con precisión los requerimientos de Placetopay.
  - *Aprendizaje:* Formalizar un diccionario de datos (`buyer`, `payment`, `channel`, `card`) y un validador estricto asegura que cuando se construya el mockup visual (Spec-04), todos los payloads hacia WebCheckout y API Gateway sean 100% compatibles desde el primer intento.

---

## 6. UI/UX, Design System Evertec, A11y WCAG 2.1 AA y SEO Técnico (Spec-04)
- **Lección 10: Armonización Cromática Evertec y Accesibilidad (WCAG 2.1 AA).**
  - *Contexto:* El color corporativo Naranja Evertec (`#FF5900`) posee un ratio de contraste de ~3.1:1 sobre blanco puro, lo cual no alcanza el umbral de 4.5:1 exigido por WCAG AA para textos normales pequeños.
  - *Aprendizaje:* Se definió una variante accesible `--color-primary-accessible: #D44A00` con contraste certificado de 4.65:1 (AA) para botones y textos interactivos sobre fondo blanco, reservando el `#FF5900` para acentos, bordes, badges y fondos oscuros como el Azul Marino Financiero (`#0B192C`), donde el contraste alcanza un sobresaliente 16.2:1 (AAA).
- **Lección 11: Cero Bloat y Rendimiento Web Extremo (Core Web Vitals).**
  - *Contexto:* La inclusión de frameworks pesados (React, Vue, Tailwind CDN) para un MVP e-commerce añade megabytes de sobrecarga y vulnerabilidades potenciales de cadena de suministro.
  - *Aprendizaje:* El uso de JavaScript nativo moderno (ES6+), CSS Grid/Flexbox nativo y servidor HTTP sin dependencias permite tiempos de Largest Contentful Paint (LCP) inferiores a 1.8 segundos y una interacción inmediata (INP < 100ms), facilitando una experiencia de usuario fluida y accesible.
- **Lección 12: Aislamiento de Ciclo de Vida libuv en Pruebas de Servidores (Windows).**
  - *Contexto:* Al levantar y destruir servidores HTTP efímeros en Node.js v24 sobre Windows mientras la base de datos `node:sqlite` se encuentra abierta, libuv puede disparar aserciones en `async.c`.
  - *Aprendizaje:* La orquestación mediante subprocesos (`spawn`) y el cierre explícito de los descriptores de base de datos (`db.close()`) garantizan una ejecución de pruebas limpia y determinista en entornos Windows.

---

## 7. Tienda de Smartphones, Checkout Modal y Simplificación de Pasarela (Spec-05)
- **Lección 13: Resiliencia de Eventos con `pointer-events: none` en Iconos de Botones.**
  - *Contexto:* En botones complejos con iconos SVG y textos anidados (como `#cart-toggle-btn`), los clics del usuario sobre los paths o spans hijos pueden interferir en la detección del evento click si el desarrollador consulta `event.target`.
  - *Aprendizaje:* Aplicar la regla CSS `.cart-btn * { pointer-events: none; }` canaliza de forma infalible todos los eventos de interacción al elemento raíz interactivo `<button>`, eliminando fallos intermitentes de apertura del drawer.
- **Lección 14: Encapsulación en Modal y Reducción de Fricción Cognitiva.**
  - *Contexto:* Desplazar al usuario por scroll a un formulario incrustado en el cuerpo de la página interrumpe la navegación y expone detalles técnicos innecesarios (como selectores de canal y datos de tarjeta directa).
  - *Aprendizaje:* Al mover el checkout a un modal interactivo (`#checkout-modal`) y predeterminar WebCheckout por debajo, el usuario solo diligencia los datos indispensables del comprador y es transferido a la pasarela bancaria oficial de Placetopay, cumpliendo los más altos estándares de UX e-commerce y seguridad PCI-DSS.
- **Lección 15: Tipado Estricto de Parámetros en Claves Foráneas de SQLite.**
  - *Contexto:* La normalización de contratos puede transformar primitivos numéricos en objetos (ej. `payment.amount` $\rightarrow$ `{ total, currency }`). Si un valor de tipo objeto se intenta vincular a un parámetro numérico en `node:sqlite` (`DatabaseSync`), la base de datos aborta con `Provided value cannot be bound to SQLite parameter`. Asimismo, asignar un `requestId` externo al campo `session_id` viola la restricción `FOREIGN KEY (session_id) REFERENCES payment_sessions(id)`.
  - *Aprendizaje:* La extracción explícita `typeof amount === 'object' ? amount.total : amount` y la resolución de la clave primaria autoincremental `sessionRecord.id` aseguran integridad referencial absoluta en SQLite.


