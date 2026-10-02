# Intent 005 — Tienda de Smartphones de Gama Alta, Checkout Modal y Simplificación de Pasarela

## 1. Problema de Negocio y Motivación
En el MVP anterior (Spec-04), se implementó la arquitectura base del frontend interactivo de Evertec PayShop con identidad corporativa, accesibilidad WCAG 2.1 AA y auditoría SQLite. Sin embargo, para satisfacer los requerimientos clave de la prueba técnica y optimizar la experiencia de usuario (UX/UI):
1. **Catálogo no contextual:** El catálogo anterior contenía 4 productos orientados a hardware transaccional (POS y lectores) que no representan una tienda virtual atractiva para consumidores de comercio electrónico masivo. Se requiere un catálogo realista de **12 smartphones de alta gama** con precios y especificaciones reales del mercado colombiano (COP).
2. **Falla en la apertura del Carrito:** El botón superior `#cart-toggle-btn` presentaba problemas de interacción para desplegar el drawer lateral de forma confiable.
3. **Checkout intrusivo en el cuerpo:** El formulario de checkout estaba incrustado en el cuerpo de la página (`#checkout-section` en el `<main>`), obligando a un scroll forzado. Se requiere que el checkout se abra exclusivamente como un **modal interactivo y accesible** (`#checkout-modal`) al hacer clic en "Ir a Pagar" desde el carrito.
4. **Exposición innecesaria de canal y tarjeta:** El selector de canales exponía `API Gateway Directo` y campos de tarjeta de crédito/débito al usuario final. El usuario de negocio ha determinado que el canal debe ser **100% WebCheckout transparente**: el cliente nunca debe elegir el canal ni ingresar tarjetas directamente en la tienda; Placetopay WebCheckout se encarga de todo el flujo transaccional seguro.
5. **Auditoría visual y humanizada:** En la tabla de evidencias transaccionales, las columnas técnicas `Canal` y `Razón` sobrecargaban la vista principal. Además, el botón "Ver JSON" exponía una carga técnica árida. Se requiere un botón **"Ver Detalle"** con una vista amigable de recibo estructurado, preservando el JSON técnico de forma colapsable para la evaluación técnica.

## 2. Alcance (In Scope)
- **12 Smartphones de Gama Alta:** Reemplazar los 4 productos anteriores por 12 teléfonos móviles premium (Apple iPhone 16 Pro Max, Samsung Galaxy S24 Ultra, Google Pixel 9 Pro XL, Xiaomi 14 Ultra, etc.) con precios reales en COP, especificaciones detalladas y marcado JSON-LD Schema.org actualizado.
- **Corrección de Apertura del Carrito:** Garantizar que el botón `#cart-toggle-btn` y sus subelementos abran el drawer lateral en cualquier circunstancia.
- **Modal de Checkout Accesible:** Crear un modal accesible (`#checkout-modal`) para capturar los datos del comprador (`buyer`: nombres, apellidos, correo, documento, celular, dirección, ciudad) y presentar el resumen de la orden, retirando el formulario incrustado en el cuerpo de la página.
- **Canal Placetopay WebCheckout Transparente:** Eliminar el selector de canales y los campos de tarjeta directa. Enviar siempre `channel: 'WEBCHECKOUT'` al backend (`/api/checkout/session`).
- **Botón de Historial y Modal "Ver Detalle":**
  - Añadir enlace/botón directo "Historial" en la barra superior.
  - Limpiar la tabla de evidencias eliminando las columnas `Canal` y `Razón`.
  - Reemplazar "Ver JSON" por un botón "Ver Detalle" que abra un modal con el recibo de compra estructurado y datos del pagador.
- **Preservación de Guardrails SDD:** Respetar G-01 (pnpm), G-02 (cooldown 48h), G-06 (rama aislada), G-07 (prohibición de `git add .`) y compuerta de aprobación de merge.

## 3. Fuera de Alcance (Out of Scope)
- Integración de pasarelas de terceros distintas a Placetopay (Stripe, MercadoPago, etc.).
- Respuestas a preguntas conceptuales y casos de soporte (serán objeto del siguiente Spec-06).
