# Intent 004: Mockup Frontend E-Commerce con Identidad Evertec, A11y WCAG 2.1 AA, SEO y Alto Rendimiento

- **Fase SDD:** 00-Intent
- **Autor / Rol:** SDD-Architect & Frontend-UX-Architect
- **Fecha:** 2026-10-01
- **Rama:** `feat/spec-004-mockup-frontend-evertec`

---

## 1. Declaración del Problema de Negocio

La prueba técnica para el rol de Analista de Implementación / Desarrollador Placetopay (Evertec) exige la demostración práctica e interactiva de un e-commerce ("tienda virtual") con su carrito de compras y pasarela de pagos integrada. 

Para lograr un entregable de excelencia técnica, la solución no debe ser un prototipo superficial o genérico:
1. **Identidad Corporativa Evertec:** Debe reflejar fidedignamente los colores y diseño institucional de Evertec (*Evertec Orange* `#FF5900`, *Marino Financiero* `#0B192C` y *Azul Acento* `#0077CC`), transmitiendo solidez y confianza transaccional.
2. **Experiencia de Usuario (UI/UX):** El flujo de compra debe ser intuitivo, visualmente atractivo y mobile-first, permitiendo al usuario seleccionar productos, gestionar su carrito y pagar sin fricción.
3. **Accesibilidad Universal (A11y):** Debe apegarse a los estándares internacionales **WCAG 2.1 Nivel AA**, garantizando contrastes cromáticos de al menos 4.5:1, navegación completa por teclado, roles ARIA y compatibilidad con tecnologías de asistencia.
4. **Optimización SEO:** La tienda debe contar con marcado semántico HTML5, metadatos OpenGraph/Twitter Cards y datos estructurados Schema.org (`Product`, `Offer`, `Organization`) en formato JSON-LD.
5. **Rendimiento y Buenas Prácticas:** Debe satisfacer los estándares de **Core Web Vitals** (LCP < 1.8s, INP < 100ms, CLS < 0.05), prescindiendo de frameworks pesados e innecesarios que saturen el navegador.
6. **Conexión Funcional con Backend y Sandbox:** El checkout debe conectarse con los endpoints y contratos definidos en Spec-03, soportando tanto la redirección a **WebCheckout** de Placetopay como la captura y validación en **Gateway Direct**, con visor de evidencias en tiempo real para transacciones Aprobadas, Pendientes y Rechazadas por múltiples motivos.

---

## 2. Usuarios y Casos de Uso Clave

- **Comprador Final (Pagador):** Navega el catálogo, añade productos al carrito, ingresa sus datos y completa el pago de manera fluida y accesible.
- **Evaluador Técnico / Analista Evertec:** Interactúa con el MVP en vivo, prueba la responsividad, inspecciona el marcado accesible y SEO, verifica la integración con el sandbox de Placetopay y audita las evidencias registradas en SQLite.

---

## 3. Criterios de Éxito de la Intención

1. Disponer de una interfaz web completa servida localmente con Node.js (`pnpm run start:app` o script ligero).
2. Paleta corporativa Evertec aplicada armónicamente con contrastes contrastados y certificados WCAG AA.
3. Formulario de pago completo (comprador, dirección, documento, canal de pago) validado contra el contrato de Spec-03.
4. Suite automatizada de pruebas de aceptación que valide A11y, SEO, estructura y flujo transaccional.
