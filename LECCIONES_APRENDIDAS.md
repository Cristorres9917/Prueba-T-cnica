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
