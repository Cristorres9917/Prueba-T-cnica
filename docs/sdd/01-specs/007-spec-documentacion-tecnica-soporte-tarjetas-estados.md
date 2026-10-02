# Spec 007 — Documentación Técnica del Proyecto, Matriz de Tarjetas por Estado, Respuestas Conceptuales y Casos de Soporte

## 1. Metadatos del Spec
- **ID:** SPEC-007
- **Fase:** 01-Specs
- **Título:** Documentación Integral, Tarjetas Sandbox por Estado, Respuestas Conceptuales y Gestión de Soporte Placetopay
- **Intent Asociado:** [INTENT-007](../00-intents/007-intent-documentacion-tecnica-soporte-tarjetas-estados.md)
- **Rama Asignada:** `feat/spec-007-documentacion-tecnica-soporte-tarjetas-estados`
- **Agentes Participantes:** `Support-Consultant`, `Integration-Engineer`, `Frontend-UX-Architect`, `Quality-Agentester`, `Git-Workflow-Guardian`

---

## 2. Requerimientos Funcionales y Estructurales

### 2.1. README.md Principal del Proyecto
Debe ubicarse en la raíz del repositorio y estructurarse conforme a los estándares de ingeniería de Evertec y Anthropic SDD:
1. **Badges e Información General:** Node.js v24+, PNPM, SDD Governance, SQLite, WCAG 2.1 AA.
2. **Descripción de la Solución:** Evertec PayShop (Mockup E-commerce de Smartphones) y motor de integración con Placetopay WebCheckout y API Gateway.
3. **Pila Tecnológica (Zero-Bloat):**
   - Backend: Node.js nativo (servidor HTTP, `node:sqlite` DatabaseSync, `node:crypto`).
   - Frontend: Vanilla JavaScript ES6+, CSS3 Moderno (CSS Grid/Flexbox), sin frameworks externos.
   - Seguridad: SHA-256 + Base64 tranKey generator (`.agents/skills/placetopay-auth`).
4. **Guía de Instalación y Ejecución:**
   - Comandos exactos: `pnpm install`, `pnpm start`.
   - Puerto por defecto: `http://localhost:3000`.
   - Variables de entorno y credenciales de Sandbox.
5. **Catálogo de Scripts y Pruebas Automatizadas:**
   - `pnpm test` (Suite global Agentest).
   - `pnpm run verify:guardrails` (Auditoría de políticas inmutables).
   - `pnpm run verify:git` (Aislamiento de ramas y prohibición de git add .).
   - `pnpm run test:spec6` (Sincronización transaccional, recibo y UI).
   - `pnpm run test:spec7` (Verificación de documentación, tarjetas y soporte).

### 2.2. Matriz Exhaustiva de Tarjetas de Prueba Sandbox (Placetopay)
Debe documentarse en tabla estructurada con los siguientes campos: `Franquicia`, `Número de Tarjeta`, `Exp / CVV`, `Estado Resultado`, `Código/Razón`, `Comportamiento / Uso`.
1. **Aprobadas (Frictionless / Sin Reto):**
   - Visa: `4111 1111 1111 1111` / `4110 7600 0000 0081` $\rightarrow$ `APPROVED` (Estado 00 / OK).
   - Mastercard: `5180 3000 0000 0005` $\rightarrow$ `APPROVED`.
   - American Express: `3435 7754 9670 001` $\rightarrow$ `APPROVED`.
   - Diners Club: `3654 5400 0000 08` $\rightarrow$ `APPROVED`.
2. **Rechazadas Generales:**
   - Visa: `4110 7600 0000 0016` / `4110 7600 0000 0073` $\rightarrow$ `REJECTED` (Denegada).
   - Mastercard: `5180 3000 0000 0062` $\rightarrow$ `REJECTED`.
   - Diners Club: `3654 5400 0000 248` $\rightarrow$ `REJECTED`.
3. **Fondos Insuficientes / Límite Excedido (Rechazo Financiero):**
   - Explicación del código `XA` ("Fondos insuficientes o monto no autorizado") en Placetopay AutoPay/Gateway.
   - Datos de tarjeta de simulación para rechazo por fondos.
4. **Pendiente / En Validación:**
   - Tarjeta `4048 3700 0000 0037` (Pendiente $\rightarrow$ En proceso bancario).
5. **Autenticación 3D-Secure con Desafío (Challenge OTP):**
   - Tarjeta en estado Challenge (C) con código OTP: `12345`.

### 2.3. Modal / Guía Accesible de Tarjetas en Frontend (`public/index.html` y `public/app.js`)
Para facilitar la evaluación interactiva de la tienda:
- Agregar en la barra de navegación superior (`header.main-header`) un botón accesible:
  `<button id="test-cards-btn" class="nav-btn-link" onclick="openTestCardsModal()">💳 Tarjetas Sandbox</button>`.
- Modal interactivo `#test-cards-modal` que despliega la matriz de tarjetas con botón "Copiar" que copia el número al portapapeles y notifica visualmente.
- Atributos ARIA (`role="dialog"`, `aria-modal="true"`, `aria-labelledby`).

### 2.4. Respuestas Conceptuales Exhaustivas (Preguntas 1 a 7)
Debe redactarse un documento maestro en `docs/sdd/04-entregas/007-respuestas-conceptuales-y-soporte.md`:
1. **RequestId:** Identificador único autoincremental/UUID generado por Placetopay para cada sesión de pago. Sirve para trazabilidad, consulta de estado y conciliación. No se repite entre sesiones distintas; una repetición intencional por parte del comercio debe ser rechazada por idempotencia.
2. **Estados Transaccionales:**
   - `APPROVED` (Aprobada / OK): Fondos capturados o autorizados exitosamente por el banco emisor.
   - `PENDING` (Pendiente / PC): En proceso de validación (redes financieras, PSE, efectivo) o sesión de WebCheckout activa en espera de pago del usuario.
   - `REJECTED` (Rechazada): Denegada por banco emisor, filtros anti-fraude, fondos insuficientes o tarjeta inválida.
   - `FAILED` / `ERROR`: Falla de comunicación, error de red o timeout de la sesión.
3. **Preautorización:** Bloqueo temporal (hold) del cupo en la tarjeta del cliente sin captura inmediata de fondos, liquidándose posteriormente con una captura (`capture`). Ejemplo detallado: Alquiler de vehículos (Rent-a-car) o reservas hoteleras.
4. **Suscripción vs Recurrencia:**
   - Suscripción: Cobro periódico fijo calendarizado (mismo monto, fecha fija).
   - Recurrencia: Cobro autorizado basado en tokenización donde el monto o la frecuencia varían según el consumo (servicios públicos, viajes en Uber, nube AWS).
5. **API Gateway vs WebCheckout:**
   - WebCheckout: Flujo hosted donde Placetopay aloja la pasarela. Menor esfuerzo técnico, cero alcance PCI-DSS para el comercio, redirección segura.
   - API Gateway: Conexión REST directa server-to-server. Requiere certificación PCI-DSS (SAQ A-EP o D), control total de UI/UX, tokens y procesamiento invisible.
6. **Dispersión de Fondos (Split Payment):** División automática de una recaudación entre múltiples cuentas bancarias beneficiarias (ideal para Marketplaces, plataformas de delivery y comisiones de intermediarios).
7. **Notificaciones Asíncronas (Webhooks):** Mecanismo server-to-server push donde Placetopay envía un POST HTTP con la firma criptográfica y el estado final de la transacción al endpoint del comercio, garantizando la actualización incluso si el pagador cierra el navegador.

### 2.5. Respuestas Asertivas a los 4 Casos de Soporte Técnico
1. **Caso 1: Error 102 Autenticación Fallida en Comercio Crítico (Riesgo Churn):**
   - Diagnóstico técnico de la causa raíz (discrepancia en cálculo de `tranKey`, Base64, formato de `seed` o desincronización horaria NTP > 5 minutos).
   - Estrategia de contención y acompañamiento en llamada prioritaria con validación de credenciales.
   - Redacción formal de respuesta al cliente (empática, transparente y resolutiva).
2. **Caso 2: Comercio CLARO - Error "Autenticación Mal Formada":**
   - Diagnóstico técnico (JSON inválido, ausencia de llaves requeridas, nonce no codificado en Base64 o seed no compatible ISO 8601).
   - Impacto y mitigación urgente con snippet de código verificado.
   - Redacción formal de respuesta a CLARO.
3. **Caso 3: Comercio Sunshine - Confusión Pedagógica:**
   - Enfoque pedagógico adaptativo: diagramas visuales, sesión de Pair Programming en Sandbox, documentación simplificada tipo "Cheat Sheet" y checklist de integración.
   - Redacción formal y motivadora para Sunshine.
4. **Caso 4: Comercio Sunshine - Escalamiento Hostil y Amenaza de Cancelación:**
   - Protocolo de desescalamiento emocional, escucha activa sin reactividad defensiva, asunción de responsabilidad institucional, asignación de Lead Técnico Senior y SLA de 24 horas con plan de acción correctivo.
   - Redacción diplomática de alta gerencia para restituir la confianza del cliente.

### 2.6. Diagramas de Flujo Mermaid
1. **Diagrama de Secuencia WebCheckout:** Usuario Final $\leftrightarrow$ Comercio $\leftrightarrow$ Placetopay.
2. **Diagrama de Secuencia API Gateway:** Flujo de captura y tokenización directa.
3. **Diagrama de Estados Transaccionales y Webhook.**

---

## 3. Criterios de Aceptación (Agentest 007)
1. `README.md` completo en la raíz con badges, guía de uso, comandos pnpm y arquitectura.
2. `docs/sdd/04-entregas/007-respuestas-conceptuales-y-soporte.md` contiene las 7 preguntas conceptuales, 4 casos de soporte y diagramas Mermaid.
3. Matriz de tarjetas de prueba documentada exhaustivamente para todos los estados (Aprobado, Rechazado, Fondos Insuficientes, Pendiente, 3DS).
4. Modal `#test-cards-modal` implementado en `public/index.html` y funcional en `public/app.js` con copiado rápido.
5. Suite `scripts/test-documentation-and-support.mjs` con 10/10 tests PASS.
