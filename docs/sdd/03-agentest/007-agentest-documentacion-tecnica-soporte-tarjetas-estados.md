# Agentest 007 — Batería de Pruebas de Aceptación para Documentación, Tarjetas Sandbox y Soporte

## 1. Definición del Arnés de Verificación
- **Código:** AGENTEST-007
- **Fase Asociada:** Spec-07
- **Rama:** `feat/spec-007-documentacion-tecnica-soporte-tarjetas-estados`
- **Script Ejecutor:** `scripts/test-documentation-and-support.mjs`
- **Comando:** `pnpm run test:spec7`

---

## 2. Matriz de Aserciones de Prueba

| ID | Nombre de la Prueba | Criterio de Aceptación |
| :--- | :--- | :--- |
| **TEST-7.1** | Aislamiento en rama activa de spec | La rama actual de git debe coincidir con `feat/spec-007-*`. |
| **TEST-7.2** | Existencia e integridad de `README.md` | El archivo `README.md` en raíz debe contener badges, arquitectura, guía de inicio rápido con pnpm y tabla de tarjetas. |
| **TEST-7.3** | Respuestas conceptuales completas (7/7) | `007-respuestas-conceptuales-y-soporte.md` debe resolver exhaustivamente RequestId, estados, preautorización, suscripción vs recurrencia, Gateway vs Webcheckout, dispersión y notificaciones. |
| **TEST-7.4** | Gestión y respuestas para los 4 casos de soporte | Se debe documentar la gestión y la redacción de respuesta para Error 102, Claro, Sunshine pedagógico y Sunshine escalamiento hostil. |
| **TEST-7.5** | Diagramas de secuencia y flujo Mermaid | El documento de soporte debe incluir al menos 3 diagramas Mermaid válidos (WebCheckout, Gateway y Ciclo de vida/Webhook). |
| **TEST-7.6** | Matriz de tarjetas para TODOS los estados en docs | Debe contener tarjetas para Aprobado (Visa/Mastercard/Amex/Diners), Rechazado, Fondos Insuficientes (XA), Pendiente y 3DS Challenge con OTP 12345. |
| **TEST-7.7** | Botón de acceso rápido a Tarjetas en Frontend | `public/index.html` debe incluir botón interactivo `#test-cards-btn` en el encabezado. |
| **TEST-7.8** | Modal accesible de Tarjetas Sandbox en HTML | `public/index.html` debe contener `#test-cards-modal` con roles y atributos ARIA de accesibilidad WCAG 2.1 AA. |
| **TEST-7.9** | Funciones de apertura, cierre y copiado al portapapeles | `public/app.js` debe exponer `openTestCardsModal()`, `closeTestCardsModal()` y `copyCardNumber()`. |
| **TEST-7.10** | Estilos visuales del modal y badges de estado en CSS | `public/styles.css` debe definir las clases `.test-cards-grid`, `.card-item`, badges por estado y feedback de copiado. |
