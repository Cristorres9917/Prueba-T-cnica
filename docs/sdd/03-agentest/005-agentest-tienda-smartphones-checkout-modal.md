# Matriz de Pruebas de Aceptación — Agentest 005: Tienda de Smartphones, Checkout Modal y Simplificación de Pasarela

## 1. Alcance de Verificación Automatizada
Esta suite de pruebas valida la conformidad de la interfaz y la integración técnica con Placetopay conforme a las especificaciones del Spec-05.

---

## 2. Matriz de Casos de Prueba (10/10)

| ID Test | Categoría | Descripción de la Prueba | Criterio de Éxito |
| :--- | :--- | :--- | :--- |
| **TEST-5.1** | Gobernanza Git | Verificación de aislamiento en rama de trabajo | La rama actual coincide con el patrón `feat/spec-005-*`. |
| **TEST-5.2** | Catálogo | 12 Smartphones de Gama Alta en Frontend | El array `PRODUCTS` en `app.js` contiene exactamente 12 elementos con categoría, SKU y precios reales en COP (> $3.000.000). |
| **TEST-5.3** | SEO & Schema.org | Marcado JSON-LD con los 12 Smartphones | El bloque JSON-LD `ItemList` en `index.html` contiene los 12 teléfonos como productos indexables. |
| **TEST-5.4** | Interacción Carrito | Accesibilidad y robustez del botón `#cart-toggle-btn` | El botón de carrito tiene `pointer-events: none` en hijos y función de despliegue confiable. |
| **TEST-5.5** | UI/UX Checkout | Formulario de pago encapsulado en Modal | `#checkout-modal` y su overlay existen en el DOM; no existe formulario incrustado en el cuerpo principal del documento. |
| **TEST-5.6** | Canal Transparente | Eliminación de selectores de canal y campos de tarjeta | La UI no contiene radios de selección de canal ni inputs de tarjeta directa (`cardNumber`, `cardCvv`, etc.). |
| **TEST-5.7** | Integración WebCheckout | Petición de Checkout genera sesión Placetopay | El endpoint `/api/checkout/session` procesa la orden, devuelve `processUrl` y registra la transacción en SQLite. |
| **TEST-5.8** | Trazabilidad & Nav | Enlace de Navegación "Historial" | La barra de navegación incluye un enlace directo `#nav-history-btn` hacia la sección de evidencias. |
| **TEST-5.9** | Tabla de Evidencias | Supresión de columnas `Canal` y `Razón` | La tabla de evidencias tiene exactamente 6 columnas y no incluye `Canal` ni `Razón`. |
| **TEST-5.10** | Detalle de Compra | Botón "Ver Detalle" y Modal de Recibo | La tabla genera botones con texto "Ver Detalle" que abren el modal `#detail-modal` con recibo estructurado y datos del pagador. |

---

## 3. Protocolo de Ejecución
- Script automatizado: `scripts/test-smartphones-checkout.mjs`
- Comando: `pnpm run test:spec-005`
- Requisito de Entrega: 10/10 pruebas en estado `PASS` antes de generar el acta en `04-entregas/`.
