# Intent 006 — Sincronización de Estado WebCheckout, Datos de Cliente en Recibo, Fecha Local, Carrito Limpio y UI de Productos Homogénea

## 1. Declaración de Intención
Garantizar la consistencia transaccional y la excelencia en la experiencia de usuario (UX) en la integración con Placetopay WebCheckout:
1. **Sincronización Automática de Estado:** Tras completar el pago en Placetopay WebCheckout y retornar al comercio, el estado transaccional debe actualizarse en SQLite de `PENDING` a su estado real (`APPROVED`, `REJECTED`, etc.), reflejando el código de autorización y recibo bancario.
2. **Datos Completos del Cliente en "Ver Detalle":** Asegurar que el modal de recibo institucional muestre fidedignamente los datos del comprador (nombre completo, documento, email, teléfono, dirección y ciudad) resolviendo la deserialización del payload JSON en SQLite.
3. **Fecha y Hora Local Exacta:** Registrar y formatear la fecha y hora de la transacción en la zona horaria oficial de Colombia (`America/Bogota`, UTC-5) respetando la estampa de tiempo provista por Placetopay o el servidor.
4. **Homogeneidad Visual y Contención en Tarjetas de Productos:** Corregir el layout CSS de la cuadrícula de smartphones para que todas las tarjetas tengan exactamente la misma altura, proporciones uniformes y evitar desbordes del botón "+ Añadir".
5. **Limpieza Automática del Carrito de Compras:** Al completar el flujo de checkout y retornar con pago procesado (o tras confirmación del pago), el carrito de compras debe vaciarse automáticamente (`cart.clearCart()`) para permitir nuevas compras.

---

## 2. Alcance y Límites del Incremento
- **Dentro de Alcance:**
  - Endpoint de consulta y sincronización de estado (`/api/checkout/status/:requestId` y auto-sincronización en `/api/transactions/evidences`).
  - Detección de retorno de pasarela en URL (`?status=return&ref=...&reqId=...`) para sincronizar, notificar y vaciar carrito.
  - Corrección en la capa de datos SQLite (`db.js`) y vista (`app.js`) para parsear correctamente `raw_payload` (objeto vs string) y poblar datos del comprador en `openDetailModal()`.
  - Normalización y renderizado de fecha en formato local colombiano `es-CO` (`America/Bogota`).
  - Ajustes de estilo en `.product-card`, `.product-footer`, `.btn-add-cart` y `.products-grid` para evitar cualquier desborde.
  - Método `cart.clearCart()` y reseteo reactivo de interfaz.
- **Fuera de Alcance:**
  - Modificación de credenciales de Placetopay.
  - Reemplazo de base de datos SQLite por otro motor.
