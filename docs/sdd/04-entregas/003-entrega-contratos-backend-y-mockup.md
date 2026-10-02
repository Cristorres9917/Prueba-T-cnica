# Acta de Entrega 003: Contratos Backend, Modelo de Datos para Mockup MVP y Persistencia SQLite

- **Fecha de Culminación:** 2026-10-01
- **Rama:** `feat/spec-003-contratos-backend-y-mockup`
- **Spec Asociado:** [`docs/sdd/01-specs/003-spec-contratos-backend-y-mockup.md`](file:///C:/Users/USUARIO/prueba%20tecnica/docs/sdd/01-specs/003-spec-contratos-backend-y-mockup.md)
- **Agentest Asociado:** [`docs/sdd/03-agentest/003-agentest-contratos-backend-y-mockup.md`](file:///C:/Users/USUARIO/prueba%20tecnica/docs/sdd/03-agentest/003-agentest-contratos-backend-y-mockup.md)
- **Auditor:** Quality-Agentester & Integration-Engineer
- **Estado de Entrega:** **APROBADA Y LISTA PARA REVISIÓN HUMANA (10/10 TESTS PASS)**

---

## 1. Resumen Ejecutivo de la Entrega

Se ha completado con éxito el **Spec-03**, estableciendo con total precisión y claridad los contratos de datos que conectan el backend con la pasarela de **Placetopay** (WebCheckout y API Gateway) y proporcionando el diccionario de campos necesario para la construcción del mockup/frontend del carrito de compras (MVP) solicitado en la prueba técnica.

Asimismo, se implementó el motor de persistencia relacional con **SQLite** nativo de Node.js v24 (`node:sqlite`), sin dependencias externas npm, registrando sesiones, transacciones con sus tres estados (**Aprobado**, **Pendiente**, **Rechazado**) y logs de auditoría completos.

---

## 2. Artefactos Entregados en este Spec

### 2.1. Servicios Backend y Persistencia Relacional
- [`src/database/schema.sql`](file:///C:/Users/USUARIO/prueba%20tecnica/src/database/schema.sql): Esquema DDL con las tablas `payment_sessions`, `transactions` y `audit_logs`.
- [`src/database/db.js`](file:///C:/Users/USUARIO/prueba%20tecnica/src/database/db.js): Conexión SQLite nativa y operaciones CRUD para sesiones, transacciones y auditoría.
- [`src/validators/mockup-contract.js`](file:///C:/Users/USUARIO/prueba%20tecnica/src/validators/mockup-contract.js): Validador de contrato del formulario de pago para el mockup MVP (buyer, payment, channel, card).
- [`src/services/placetopay.js`](file:///C:/Users/USUARIO/prueba%20tecnica/src/services/placetopay.js): Cliente transaccional oficial que encapsula firma SHA-256 (`seed`, `nonce`, `tranKey`), creación de sesión WebCheckout, consulta de estado y procesamiento Gateway con logging automático.

### 2.2. Cadena Documental SDD (Fase 003)
- [`docs/sdd/00-intents/003-intent-contratos-backend-y-mockup.md`](file:///C:/Users/USUARIO/prueba%20tecnica/docs/sdd/00-intents/003-intent-contratos-backend-y-mockup.md): Declaración de intención y foco en el entregable final.
- [`docs/sdd/01-specs/003-spec-contratos-backend-y-mockup.md`](file:///C:/Users/USUARIO/prueba%20tecnica/docs/sdd/01-specs/003-spec-contratos-backend-y-mockup.md): Especificación formal viva y diccionario de datos del mockup.
- [`docs/sdd/02-plans/003-plan-contratos-backend-y-mockup.md`](file:///C:/Users/USUARIO/prueba%20tecnica/docs/sdd/02-plans/003-plan-contratos-backend-y-mockup.md): Plan de trabajo desglosado.
- [`docs/sdd/03-agentest/003-agentest-contratos-backend-y-mockup.md`](file:///C:/Users/USUARIO/prueba%20tecnica/docs/sdd/03-agentest/003-agentest-contratos-backend-y-mockup.md): Matriz de pruebas de aceptación.

### 2.3. Suite Automatizada y Pruebas
- [`scripts/test-placetopay-contracts.mjs`](file:///C:/Users/USUARIO/prueba%20tecnica/scripts/test-placetopay-contracts.mjs): Suite de pruebas automatizadas que valida la comunicación en vivo con el sandbox de Placetopay y la base de datos SQLite.

---

## 3. Diccionario de Datos para el Mockup MVP

Para la siguiente etapa de diseño visual y frontend (Spec-04), el formulario de pago y carrito debe capturar:
1. **Comprador (`buyer`):** Nombre, Apellido, Email, Tipo de Documento (`CC`, `CE`, `NIT`, etc.), Número de Documento, Teléfono Móvil, Dirección y Ciudad.
2. **Pago (`payment`):** Referencia única, Descripción del pedido, Moneda (`COP`), Monto Total y desglose de Items del carrito.
3. **Canal (`channel`):** `WEBCHECKOUT` (Redirección con `processUrl`) o `GATEWAY_DIRECT` (Datos de tarjeta en el formulario: número, mes/año exp, CVV, cuotas).

---

## 4. Matriz de Motivos de Rechazo y Evidencias Transaccionales

En el ecosistema de pagos de Placetopay / Evertec, los rechazos no corresponden a una única causal ni a un simple error fortuito. Se clasifican rigurosamente por su origen de declinación:

1. **Causales del Banco Emisor / Red Financiera:**
   - `05` / `51` / `RM`: Fondos insuficientes o cupo excedido.
   - `14` / `54`: Tarjeta vencida o fecha de expiración incorrecta.
   - `55` / `82`: Código CVV / PIN de seguridad erróneo.
   - `12` / `57`: Tarjeta no habilitada para compras por internet o transacciones internacionales.
   - `04` / `41` / `43`: Tarjeta reportada como extraviada, robada o bloqueada.
   - `61`: Excede el monto límite permitido por operación o cupo diario.
2. **Causales del Pagador / Experiencia de Usuario:**
   - `?C`: Cancelación voluntaria por el usuario en la interfaz de WebCheckout ("Cancelar y volver al comercio").
   - `EX`: Expiración de la sesión de pago por inactividad (TTL de sesión superado).
3. **Causales de Antifraude y Gestión de Riesgo:**
   - `AF` / `RISK`: Declinación por motor de riesgo (Cybersource / RedShield) debido a scoring anómalo (IP bloqueada, velocidad de intentos, inconsistencia geográfica).
4. **Causales de Red / Telecomunicaciones:**
   - `91` / `TO` / `XN`: Time-out bancario / Entidad financiera o red adquirente no disponible.
5. **Causales Técnicas / Autenticación:**
   - `102`: Autenticación fallida (`tranKey` inválido, desincronización horaria o secretKey incorrecta).
   - `100`: Autenticación o mensaje mal formado.

La suite `TEST-3.8` registra y cataloga en SQLite estas causales para asegurar que el sistema almacene con total fidelidad el código de declinación (`statusReason`) y el mensaje descriptivo (`statusMessage`).

---

## 5. Resultados de Verificación (Agentest 003)

```
==============================================================
TOTAL TESTS: 10 | PASSED: 10 | FAILED: 0
==============================================================
✅ [TEST-3.1] Aislamiento en rama activa de spec (feat/spec-003-*): PASS
✅ [TEST-3.2] Creación e integridad del esquema relacional SQLite: PASS
✅ [TEST-3.3] Validación del diccionario de datos y contrato del Mockup: PASS
✅ [TEST-3.4] Cálculo algorítmico de credenciales y tranKey (SHA-256 + Base64): PASS
✅ [TEST-3.5] Consumo de WebCheckout sandbox (POST /api/session) con respuesta OK: PASS
✅ [TEST-3.6] Persistencia de sesión en tabla payment_sessions con status PENDING: PASS
✅ [TEST-3.7] Consulta de estado de sesión (POST /api/session/{requestId}) en sandbox: PASS
✅ [TEST-3.8] Persistencia de evidencias para los 3 estados transaccionales en SQLite (con 6 causales de rechazo): PASS
✅ [TEST-3.9] Trazabilidad y métricas de latencia en tabla audit_logs: PASS
✅ [TEST-3.10] Integridad de acta de entrega 003 (con compuerta de merge humano): PASS
```

---

## 6. Solicitud Formal de Aprobación de Merge (Human-in-the-Loop)

De acuerdo con el guardrail G-06 y la regla inmutable de la compuerta humana:
- El agente **NO realizará la fusión a `main` de manera automática**.
- Se solicita al usuario revisar los cambios de la rama `feat/spec-003-contratos-backend-y-mockup` y ordenar o ejecutar el merge formal:

```bash
git checkout main
git merge --no-ff feat/spec-003-contratos-backend-y-mockup
```
