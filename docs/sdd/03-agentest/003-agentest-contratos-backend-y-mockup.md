# Agentest 003: Batería de Pruebas de Aceptación para Contratos Backend y Persistencia SQLite

- **Spec Asociado:** [`docs/sdd/01-specs/003-spec-contratos-backend-y-mockup.md`](file:///C:/Users/USUARIO/prueba%20tecnica/docs/sdd/01-specs/003-spec-contratos-backend-y-mockup.md)
- **Ejecutor:** Quality-Agentester
- **Rama de Ejecución:** `feat/spec-003-contratos-backend-y-mockup`
- **Estado Actual:** Listo para Implementación y Verificación

---

## 1. Matriz de Casos de Prueba

| Test ID | Área | Descripción de la Prueba | Criterio de Éxito | Estado |
| :--- | :--- | :--- | :--- | :--- |
| **TEST-3.1** | Git Guardrails | Validación de aislamiento en rama `feat/spec-003-*`. | Rama activa cumple regex y no es `main`. | Pendiente |
| **TEST-3.2** | SQLite DDL | Creación del esquema relacional en base de datos local. | Tablas `payment_sessions`, `transactions` y `audit_logs` existen. | Pendiente |
| **TEST-3.3** | Mockup Contract | Validación de esquema del formulario de pago (Buyer + Payment). | Validador rechaza payloads con campos mandatorios faltantes. | Pendiente |
| **TEST-3.4** | Autenticación | Cálculo de firma `tranKey` con `rawNonce`, `seed` y `secretKey`. | Hash Base64 válido de 44 caracteres derivado de SHA-256. | Pendiente |
| **TEST-3.5** | WebCheckout Client | Creación de sesión contra sandbox de Placetopay. | Respuesta HTTP 200 con `status: OK`, `requestId` y `processUrl`. | Pendiente |
| **TEST-3.6** | Persistencia Sesión | Almacenamiento de sesión en tabla `payment_sessions`. | Registro insertado en SQLite con `status = 'PENDING'`. | Pendiente |
| **TEST-3.7** | Consulta Sesión | Consulta de estado de sesión (`/api/session/{requestId}`). | Retorna estado válido (`PENDING`, `APPROVED` o `REJECTED`). | Pendiente |
| **TEST-3.8** | Evidencias Estados | Persistencia de transacciones con los tres estados clave. | Registros en `transactions` para APROBADO, PENDIENTE y RECHAZADO. | Pendiente |
| **TEST-3.9** | Auditoría Logs | Trazabilidad de latencia y payloads en `audit_logs`. | Registro guardado con URL, método, payload, código HTTP y latencia. | Pendiente |
| **TEST-3.10** | Entrega Guardrail | Integridad de compuerta: no existe entrega 003 antes de verificar. | Archivo `003-entrega-*.md` no existe antes de correr la suite. | Pendiente |

---

## 2. Instrucciones de Ejecución

Para correr la suite de pruebas del Spec-03:
```powershell
node scripts/test-placetopay-contracts.mjs
```

---

## 3. Criterio de Cierre y Aprobación de Merge
- La suite debe reportar `Total Tests: 10`, `Passed: 10`, `Failed: 0`.
- Cumplido el 100%, se emite el acta `docs/sdd/04-entregas/003-entrega-contratos-backend-y-mockup.md`.
- El agente **no fusiona**, sino que emite la solicitud formal para que el usuario humano apruebe el merge a `main`.
