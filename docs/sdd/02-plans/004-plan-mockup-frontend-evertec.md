# Plan 004: Plan de Trabajo para Mockup Frontend, A11y, SEO y Evidencias Transaccionales

- **Fase SDD:** 02-Plan
- **Autor / Rol:** SDD-Architect & Frontend-UX-Architect
- **Fecha:** 2026-10-01
- **Rama:** `feat/spec-004-mockup-frontend-evertec`
- **Spec Asociado:** [`docs/sdd/01-specs/004-spec-mockup-frontend-evertec.md`](file:///C:/Users/USUARIO/prueba%20tecnica/docs/sdd/01-specs/004-spec-mockup-frontend-evertec.md)

---

## 1. Desglose de Tareas de Implementación

| ID Tarea | Descripción Técnica | Responsable | Entregable |
| :--- | :--- | :--- | :--- |
| **TASK-4.1** | Creación de estructura frontend (`public/index.html`, `public/styles.css`, `public/app.js`) con branding Evertec. | Frontend-UX-Architect | `public/index.html`, `public/styles.css`, `public/app.js` |
| **TASK-4.2** | Implementación de estándares de accesibilidad WCAG 2.1 AA (contrastes, etiquetas, ARIA, teclado). | Frontend-UX-Architect | Reglas CSS accesibles y atributos ARIA en formularios. |
| **TASK-4.3** | Implementación de SEO técnico On-Page (Metadatos, OpenGraph, JSON-LD Schema.org de Productos). | Frontend-UX-Architect | Bloque `<head>` y `<script type="application/ld+json">`. |
| **TASK-4.4** | Servidor HTTP nativo en Node.js para servir estáticos y exponer endpoints API REST. | Integration-Engineer | `src/server.js` con rutas `/api/checkout/*` y `/api/transactions/*`. |
| **TASK-4.5** | Conexión del carrito y checkout con Placetopay WebCheckout y Gateway Direct. | Integration-Engineer | Controladores frontend y llamadas `fetch` con fallback SQLite. |
| **TASK-4.6** | Integración del visor de evidencias transaccionales (Aprobado, Pendiente, Rechazos bancarios). | Frontend-UX-Architect | Tabla reactiva con filtros de estado y modal de detalle. |
| **TASK-4.7** | Desarrollo de suite automatizada de pruebas Agentest 004 (A11y, SEO, Funcionalidad, API). | Quality-Agentester | `scripts/test-frontend-a11y-seo.mjs`. |
| **TASK-4.8** | Ejecución de pruebas, validación 10/10 PASS y emisión de acta de entrega para aprobación humana. | Quality-Agentester | `docs/sdd/04-entregas/004-entrega-mockup-frontend-evertec.md`. |

---

## 2. Gestión de Riesgos y Mitigación

1. **Riesgo:** Inclusión accidental de librerías CSS/JS con menos de 48 horas de publicación (violación G-02).
   - *Mitigación:* Se implementará frontend con **JavaScript nativo (ES6+) y CSS moderno puro** (CSS Grid, Flexbox, variables CSS), con **cero dependencias externas pesadas**, garantizando máximo rendimiento y seguridad absoluta de la cadena de suministro.
2. **Riesgo:** Contraste insuficiente en el botón primario naranja sobre fondo blanco.
   - *Mitigación:* Se utiliza `--color-primary-accessible: #D44A00` para componentes de texto mediano y `--color-navy: #0B192C` en encabezados para asegurar un contraste certificado superior a 4.5:1 (WCAG AA).
3. **Riesgo:** Violación de guardrail de compuerta humana (merge unilateral a main).
   - *Mitigación:* El agente culminará en el acta de entrega y esperará la autorización explícita del usuario mediante `git merge`.
