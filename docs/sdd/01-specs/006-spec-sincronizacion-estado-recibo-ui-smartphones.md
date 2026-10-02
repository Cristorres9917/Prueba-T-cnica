# Spec 006 — Sincronización de Estado WebCheckout, Datos de Cliente en Recibo, Fecha Local, Carrito Limpio y UI de Productos Homogénea

## 1. Metadatos del Spec
- **Código:** SPEC-006
- **Versión:** 1.0.0
- **Fecha:** 2026-10-01
- **Fase SDD:** 01-Spec
- **Rama Asociada:** `feat/spec-006-sincronizacion-estado-recibo-ui-smartphones`
- **Autores:** `Integration-Engineer`, `Frontend-UX-Architect`, `Support-Consultant`, `Quality-Agentester`, `Git-Workflow-Guardian`

---

## 2. Requerimientos Funcionales y Técnicos

### 2.1. Sincronización Automática de Estado Placetopay WebCheckout
- **Comportamiento Actual:** Al generar la sesión, la transacción se almacena como `PENDING`. Si el usuario paga exitosamente en Placetopay y es redirigido a `returnUrl`, el estado en SQLite no se actualiza, permaneciendo en `PENDING`.
- **Nuevo Comportamiento:**
  1. Al generar la sesión WebCheckout en `src/server.js`, la `returnUrl` debe incluir parámetros de trazabilidad:
     `returnUrl = http://${host}/?status=return&reference=${ref}&requestId=${result.requestId}`
  2. En el backend, al consultar `/api/checkout/status/:requestId`:
     - El servicio `placetopayService.getSessionStatus(requestId)` obtiene el estado real de Placetopay.
     - Si el estado de la sesión es `APPROVED` o `REJECTED`, el backend actualiza automáticamente tanto la tabla `payment_sessions` como la tabla `transactions` en SQLite (actualizando `status`, `status_reason`, `status_message`, `authorization_code`, `receipt`, y la fecha de actualización).
  3. En `/api/transactions/evidences`:
     - El backend debe auto-sincronizar transacciones que se encuentren en estado `PENDING` y cuenten con sesión activa en Placetopay, garantizando que el historial siempre refleje la verdad bancaria.
  4. En el frontend (`app.js`):
     - Al cargar la página con `?status=return`, detecta el retorno de la pasarela, consulta el estado más reciente, limpia el carrito, y si el pago fue aprobado, despliega un banner de confirmación y abre el modal de Historial para auditoría visual inmediata.

### 2.2. Datos Completos del Cliente en Modal "Ver Detalle"
- **Comportamiento Actual:** Al pulsar "Ver Detalle", los campos del comprador (Nombre, Documento, Email, Teléfono, Dirección) aparecen vacíos o incompletos porque SQLite almacena `raw_payload` como cadena de texto JSON y no se parseaba a objeto en la consulta ni en la vista.
- **Nuevo Comportamiento:**
  1. En `src/database/db.js`:
     - `getTransactions()` debe deserializar `raw_payload` si es string (`JSON.parse(row.raw_payload)`) antes de entregarlo a la API.
  2. En `public/app.js`:
     - `openDetailModal(tx)` debe normalizar defensivamente `tx.raw_payload`:
       ```javascript
       let raw = tx.raw_payload;
       if (typeof raw === 'string') {
         try { raw = JSON.parse(raw); } catch (e) { raw = {}; }
       }
       const buyer = raw.buyer || {};
       ```
     - Si `buyer` contiene `name`, `surname`, `email`, `documentType`, `document`, `mobile`, `address`, se deben renderizar todos sin omisiones.

### 2.3. Fecha y Hora Local de Colombia (America/Bogota)
- **Comportamiento Actual:** Se utiliza `new Date(tx.created_at).toLocaleString('es-CO')` sobre cadenas SQLite `YYYY-MM-DD HH:MM:SS` (UTC), lo que genera desfases de 5 horas o interpretaciones arbitrarias del navegador.
- **Nuevo Comportamiento:**
  1. Asegurar que las fechas UTC incluyan el sufijo `Z` o formato ISO 8601 (`created_at.replace(' ', 'T') + 'Z'`) o utilicen `status_date` devuelta por Placetopay (`status.date`).
  2. Formatear explícitamente en la zona horaria colombiana:
     `timeZone: 'America/Bogota'`, visualizando fecha completa y hora precisa (ej. `01/10/2026, 11:58:30 p. m.`).

### 2.4. Homogeneidad Visual y Contención en Tarjetas de Productos
- **Comportamiento Actual:** En algunas tarjetas de smartphones, el texto descriptivo o el precio de 7 cifras desplaza el pie de la tarjeta y hace que el botón "+ Añadir" se desborde o sobresalga del recuadro.
- **Nuevo Comportamiento:**
  1. `.products-grid`: Ancho de columna `minmax(280px, 1fr)` con espaciado consistente.
  2. `.product-card`: `box-sizing: border-box; overflow: hidden; display: flex; flex-direction: column; height: 100%; padding: 1.25rem;`.
  3. `.product-footer`: `display: flex; align-items: center; justify-content: space-between; gap: 0.75rem; flex-wrap: wrap; margin-top: auto;`.
  4. `.product-price`: `font-size: 1.25rem; font-weight: 800; white-space: nowrap;`.
  5. `.btn-add-cart`: `box-sizing: border-box; flex-shrink: 0; min-width: 105px; height: 42px;`.
  6. La descripción `.product-desc` mantendrá altura fija con `line-clamp: 3; overflow: hidden; text-overflow: ellipsis;`.

### 2.5. Limpieza Automática del Carrito tras Pago
- **Comportamiento Actual:** El carrito preserva los items en `localStorage` incluso después de enviar la orden de compra a Placetopay.
- **Nuevo Comportamiento:**
  1. Implementar método `cart.clearCart()` que reinicie `cart.items = []`, borre `localStorage.removeItem('evertec_cart')` y llame a `renderCart()`.
  2. Invocar `cart.clearCart()` tan pronto se redirige a Placetopay o cuando se detecta el retorno exitoso de la pasarela.

---

## 3. Criterios de Aceptación (Verificables mediante Agentest)
1. **CA-01:** Al crear una sesión WebCheckout, la `returnUrl` incluye los parámetros de retorno `status=return`, `reference` y `requestId`.
2. **CA-02:** Consultar `/api/checkout/status/:requestId` actualiza la sesión y la transacción asociada en SQLite con el estado devuelto por Placetopay.
3. **CA-03:** `/api/transactions/evidences` deserializa `raw_payload` entregando objetos estructurados JSON con los datos del comprador (`buyer`).
4. **CA-04:** El modal "Ver Detalle" muestra los datos completos del pagador (Nombre, Apellido, Documento, Correo, Celular y Dirección).
5. **CA-05:** La fecha y hora de la transacción se presenta en formato local de Colombia (`America/Bogota`).
6. **CA-06:** Todas las tarjetas de productos en la cuadrícula tienen `overflow: hidden; box-sizing: border-box;` y ningún botón `.btn-add-cart` se desborda.
7. **CA-07:** Al procesar el pago o retornar de la pasarela, el carrito queda en 0 productos y los botones de pagar se deshabilitan.
