# Agentest 004: Suite de Pruebas de Aceptación para Mockup Frontend, A11y, SEO y Evidencias

- **Spec Asociado:** [`docs/sdd/01-specs/004-spec-mockup-frontend-evertec.md`](file:///C:/Users/USUARIO/prueba%20tecnica/docs/sdd/01-specs/004-spec-mockup-frontend-evertec.md)
- **Ejecutor:** Quality-Agentester & Frontend-UX-Architect
- **Rama de Ejecución:** `feat/spec-004-mockup-frontend-evertec`
- **Estado Actual:** Listo para Implementación y Verificación

---

## 1. Matriz de Casos de Prueba

| Test ID | Área | Descripción de la Prueba | Criterio de Éxito | Estado |
| :--- | :--- | :--- | :--- | :--- |
| **TEST-4.1** | Git Guardrails | Validación de aislamiento en rama `feat/spec-004-*`. | Rama activa cumple regex y no es `main`. | Verificado (PASS) |
| **TEST-4.2** | Evertec Branding | Paleta corporativa Evertec en tokens CSS (`#FF5900`, `#0B192C`, `#0077CC`). | Variables CSS definidas y aplicadas en componentes clave. | Verificado (PASS) |
| **TEST-4.3** | A11y WCAG 2.1 AA | Verificación de contrastes, etiquetas `for=id`, skip-link y ARIA landmarks. | Contraste >= 4.5:1, skip-link funcional, labels explícitos 100%. | Verificado (PASS) |
| **TEST-4.4** | SEO On-Page | Meta description, OpenGraph (`og:*`), Twitter Cards y jerarquía H1-H3. | Metadatos válidos, un único H1 y OpenGraph completo. | Verificado (PASS) |
| **TEST-4.5** | Schema.org JSON-LD | Validación sintáctica de bloque de datos estructurados para e-commerce. | Bloque JSON-LD con Organization e ItemList de Productos en COP. | Verificado (PASS) |
| **TEST-4.6** | Carrito y UX | Adición/eliminación de items y recálculo reactivo de subtotal en COP. | Carrito calcula totales exactos y expone estado. | Verificado (PASS) |
| **TEST-4.7** | Contrato Backend | Compatibilidad de formulario con `src/validators/mockup-contract.js`. | Payload de checkout supera validación del validador de Spec-03. | Verificado (PASS) |
| **TEST-4.8** | Servidor HTTP API | Servidor expone rutas estáticas y endpoints REST de checkout y evidencias. | Respuestas HTTP 200 en `GET /` y `GET /api/transactions/evidences`. | Verificado (PASS) |
| **TEST-4.9** | Visor de Evidencias | Consulta de transacciones con los tres estados y taxonomía de rechazos. | Retorna transacciones Aprobadas, Pendientes y Rechazos en SQLite. | Verificado (PASS) |
| **TEST-4.10** | Entrega Guardrail | Integridad de compuerta: verificación previa y solicitud de merge humano en entrega. | Acta `004-entrega-*.md` validada con compuerta `Human-in-the-Loop`. | Verificado (PASS) |

---

## 2. Instrucciones de Ejecución

Para correr la suite de pruebas del Spec-04:
```powershell
node scripts/test-frontend-a11y-seo.mjs
```

---

## 3. Criterio de Cierre y Aprobación de Merge
- La suite debe reportar `Total Tests: 10`, `Passed: 10`, `Failed: 0`.
- Cumplido el 100%, se emite el acta `docs/sdd/04-entregas/004-entrega-mockup-frontend-evertec.md`.
- El agente **no fusiona**, sino que solicita la revisión y aprobación formal del usuario humano.
