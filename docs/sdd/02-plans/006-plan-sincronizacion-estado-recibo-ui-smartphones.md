# Plan Técnico 006 — Sincronización de Estado WebCheckout, Datos de Cliente en Recibo, Fecha Local, Carrito Limpio y UI de Productos Homogénea

## 1. Metadatos del Plan
- **Código:** PLAN-006
- **Spec Relacionado:** [SPEC-006](../../sdd/01-specs/006-spec-sincronizacion-estado-recibo-ui-smartphones.md)
- **Fase SDD:** 02-Plan
- **Rama:** `feat/spec-006-sincronizacion-estado-recibo-ui-smartphones`

---

## 2. Desglose de Tareas de Implementación

### Tarea 1: Base de Datos y Backend (Integration-Engineer)
- Modificar `src/database/db.js`:
  - `getTransactions()`: Deserializar `raw_payload` a objeto si es string antes de retornar.
  - Añadir método `updateTransactionBySessionId(sessionId, updateData)` o `updateTransactionByReference(ref, updateData)` para actualizar estado, autorización, recibo y fecha de pago.
- Modificar `src/server.js`:
  - En `/api/checkout/session`: Configurar `returnUrl` con `?status=return&reference=${ref}&requestId=${result.requestId}`.
  - En `/api/checkout/status/:requestId`: Al recibir respuesta de Placetopay, actualizar la sesión y la transacción asociada en SQLite con el estado bancario real.
  - En `/api/transactions/evidences`: Ejecutar auto-sincronización opcional de sesiones `PENDING` recientes antes de emitir la lista.

### Tarea 2: Frontend y Manejo de Retorno (Frontend-UX-Architect)
- En `public/app.js`:
  - Agregar método `cart.clearCart()` para vaciar items, limpiar `localStorage` y actualizar UI.
  - Al iniciar `DOMContentLoaded`, leer `window.location.search`. Si contiene `status=return` y `requestId`:
    - Consultar `/api/checkout/status/${reqId}`.
    - Vaciar el carrito (`cart.clearCart()`).
    - Desplegar notificación de confirmación de pago.
    - Abrir el modal de Historial para exhibir la transacción actualizada.
  - En `openDetailModal(tx)`: Normalizar defensivamente `tx.raw_payload` (parseando si viene como string) y renderizar todos los campos del comprador (nombre, documento, email, celular, dirección, ciudad).
  - Formatear fechas usando `timeZone: 'America/Bogota'` y parseo ISO estricto para evitar desfase de horario.

### Tarea 3: Ajustes Visuales CSS (Frontend-UX-Architect)
- En `public/styles.css`:
  - `.products-grid`: Asegurar `minmax(280px, 1fr)`.
  - `.product-card`: `box-sizing: border-box; overflow: hidden; padding: 1.25rem;`.
  - `.product-footer`: `gap: 0.65rem; flex-wrap: wrap;`.
  - `.product-price`: `font-size: 1.25rem; white-space: nowrap;`.
  - `.btn-add-cart`: `box-sizing: border-box; min-width: 105px; height: 42px; flex-shrink: 0;`.
  - Probar visualmente que ningún botón sobresalga de la tarjeta en resoluciones de 320px a 1440px.

### Tarea 4: Batería de Pruebas Automatizadas (Quality-Agentester)
- Crear `scripts/test-sync-receipt-ui.mjs` con la suite `AGENTEST-006` (10 pruebas automatizadas).
- Agregar script `test:spec6` en `package.json`.
- Validar `pnpm run test:spec6`, `pnpm run verify:guardrails` y `pnpm run verify:git`.

---

## 3. Matriz de Riesgos y Mitigaciones
| Riesgo Técnico | Severidad | Mitigación |
| :--- | :--- | :--- |
| Latencia en consulta asíncrona de estado de Placetopay | Media | Timeout controlado de 8 segundos y fallback al estado actual sin bloquear la UI. |
| Incompatibilidad de `Date` en navegadores antiguos | Baja | Parseo ISO con reemplazo de espacios por 'T' y sufijo 'Z'. |
| Desbordamiento en pantallas móviles muy estrechas (< 320px) | Media | Uso de `flex-wrap: wrap` en el footer de la tarjeta. |
