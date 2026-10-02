# Agentest 006 — Suite de Verificación Automatizada para Sincronización, Recibo, Fecha Local, Carrito Limpio y UI de Tarjetas

## 1. Control de Suite
- **Código:** AGENTEST-006
- **Spec Relacionado:** [SPEC-006](../../sdd/01-specs/006-spec-sincronizacion-estado-recibo-ui-smartphones.md)
- **Plan Técnico:** [PLAN-006](../../sdd/02-plans/006-plan-sincronizacion-estado-recibo-ui-smartphones.md)
- **Fase SDD:** 03-Agentest
- **Rama:** `feat/spec-006-sincronizacion-estado-recibo-ui-smartphones`
- **Script Ejecutor:** `scripts/test-sync-receipt-ui.mjs` (`pnpm run test:spec6`)

---

## 2. Matriz de Pruebas Automatizadas

| ID Test | Nombre de la Prueba | Criterio de Aceptación Evaluado |
| :--- | :--- | :--- |
| **TEST-6.1** | Aislamiento estricto de rama | Ejecución en rama `feat/spec-006-*` (no en `main`). |
| **TEST-6.2** | Deserialización de `raw_payload` en SQLite | `db.getTransactions()` entrega `raw_payload` como objeto con datos del comprador. |
| **TEST-6.3** | Método de actualización transaccional en SQLite | `db.updateTransactionByReference()` actualiza estado, autorización, recibo y fecha. |
| **TEST-6.4** | Sincronización de estado en `/api/checkout/status/:requestId` | Consultar estado actualiza la sesión y transacción en SQLite con datos de Placetopay. |
| **TEST-6.5** | Parámetros de retorno en `returnUrl` de sesión WebCheckout | `returnUrl` incluye `status=return`, `reference` y `requestId`. |
| **TEST-6.6** | Datos completos del cliente en modal de recibo | `openDetailModal()` extrae y valida `buyer.name`, `buyer.document`, `buyer.email`, etc. |
| **TEST-6.7** | Formateo horario local de Colombia (`America/Bogota`) | Fechas renderizadas con zona horaria de Colombia y sufijo ISO UTC 'Z'. |
| **TEST-6.8** | Limpieza de carrito tras pago (`cart.clearCart()`) | Método vacía items, borra `localStorage` y actualiza badges a 0. |
| **TEST-6.9** | Contención y prevención de desbordes en tarjetas de productos | `.product-card` con `overflow: hidden; box-sizing: border-box;` y `.product-footer` con `flex-wrap: wrap`. |
| **TEST-6.10** | Detección de retorno de pasarela en frontend | `app.js` detecta `status=return` en URL, sincroniza y abre modal de evidencias. |

---

## 3. Condiciones de Aprobación
- Se requiere el **100% de tests exitosos (10/10 PASS)** para habilitar la redacción del acta de entrega en `04-entregas/`.
