---
name: web-performance-best-practices
description: Directrices de alto rendimiento web, optimización de Core Web Vitals, minimización de dependencias y mejores prácticas de experiencia de usuario (UI/UX).
---

# Skill: Alto Rendimiento Web y Mejores Prácticas UI/UX

Esta skill gobierna la ingeniería de rendimiento, la responsividad y la usabilidad de la interfaz de la tienda virtual y pasarela Evertec.

---

## 1. Métricas Clave de Rendimiento (Core Web Vitals)

1. **LCP (Largest Contentful Paint): < 1.8 segundos.**
   - Logrado mediante renderizado nativo sin bundles pesados de JavaScript.
   - Recursos visuales e imágenes optimizados en SVG inline o WebP ligero.
2. **INP (Interaction to Next Paint): < 100 milisegundos.**
   - Manipulación directa y eficiente del DOM sin bloqueos de hilo principal.
   - Manejo de estado reactivo ligero para el carrito de compras.
3. **CLS (Cumulative Layout Shift): < 0.05.**
   - Espacios reservados y dimensiones explícitas (`width` y `height`) en imágenes y contenedores.
   - Sin inserciones dinámicas de contenido que desplacen el flujo visual.

---

## 2. Directrices de UI/UX para Checkout Transaccional

1. **Diseño Mobile-First y Responsivo:**
   - La interfaz se adapta fluidamente a pantallas móviles (320px - 480px), tablets (768px - 1024px) y escritorios (> 1200px).
2. **Feedback Inmediato al Usuario:**
   - Indicador visual de carga (spinners / skeleton loaders) al comunicarse con Placetopay.
   - Botones con estado de deshabilitado (`disabled`) durante el procesamiento para evitar doble envío accidental de transacciones.
3. **Formularios Guiados y Amigables:**
   - Formateo automático de número de tarjeta en bloques de 4 dígitos.
   - Detección visual automática de franquicia (Visa, Mastercard, Amex).
   - Formateo de fecha de vencimiento (`MM/YY`).
   - Validación reactiva en tiempo real antes de enviar el formulario.
4. **Claridad Transaccional:**
   - Desglose transparente de precios, impuestos e ítems en el carrito.
   - Resumen claro antes de la confirmación final de pago.
   - Presentación comprensible de los estados: **Aprobado** (con número de recibo y autorización), **Pendiente** (con instrucciones de seguimiento) y **Rechazado** (con motivo específico y botón de reintento).
