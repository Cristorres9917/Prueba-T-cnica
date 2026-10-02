# Plan Técnico 007 — Documentación Integral, Tarjetas Sandbox por Estado, Respuestas Conceptuales y Soporte

## 1. Desglose de Fases y Tareas Atómicas

### Fase 1: Creación del Documento Maestro de Soporte y Conceptos
- [ ] **Tarea 1.1:** Redactar `docs/sdd/04-entregas/007-respuestas-conceptuales-y-soporte.md` con las 7 respuestas conceptuales exhaustivas fundamentadas en la documentación de Placetopay.
- [ ] **Tarea 1.2:** Redactar la gestión operativa, diagnóstico técnico y cartas de respuesta para los 4 casos de soporte al comercio (Error 102, Claro, Sunshine pedagógico, Sunshine escalamiento hostil).
- [ ] **Tarea 1.3:** Incorporar los diagramas de secuencia Mermaid para WebCheckout, API Gateway y ciclo de vida de transacciones.
- [ ] **Tarea 1.4:** Incorporar la matriz técnica completa de tarjetas de prueba para todos los estados financieros.

### Fase 2: Implementación de la Modal de Tarjetas de Prueba en Frontend
- [ ] **Tarea 2.1:** Modificar `public/index.html` para agregar el botón `💳 Tarjetas Sandbox` en el header y el contenedor modal accesible `#test-cards-modal` con las tarjetas categorizadas por estado.
- [ ] **Tarea 2.2:** Actualizar `public/app.js` con las funciones `openTestCardsModal()`, `closeTestCardsModal()` y `copyCardNumber(num, btnElement)`.
- [ ] **Tarea 2.3:** Agregar estilos en `public/styles.css` para el modal de tarjetas sandbox (badges de estado, grid de tarjetas, botón de copiar con feedback).

### Fase 3: Redacción del `README.md` Principal del Proyecto
- [ ] **Tarea 3.1:** Crear `README.md` institucional con visión arquitectónica, badges, guía rápida (`pnpm install`, `pnpm start`), guardrails inmutables, catálogo de pruebas y referencia de tarjetas de prueba.

### Fase 4: Diseño y Ejecución de la Suite `AGENTEST-007`
- [ ] **Tarea 4.1:** Crear `docs/sdd/03-agentest/007-agentest-documentacion-tecnica-soporte-tarjetas-estados.md`.
- [ ] **Tarea 4.2:** Desarrollar el script de prueba automatizado `scripts/test-documentation-and-support.mjs`.
- [ ] **Tarea 4.3:** Registrar `"test:spec7": "node scripts/test-documentation-and-support.mjs"` en `package.json`.
- [ ] **Tarea 4.4:** Ejecutar y validar que los 10 tests pasen satisfactoriamente (10/10 PASS).

### Fase 5: Cierre, Entrega y Compuerta de Merge Humano
- [ ] **Tarea 5.1:** Actualizar `DEUDAS_TECNICAS.md` (cerrar DT-006) y `LECCIONES_APRENDIDAS.md`.
- [ ] **Tarea 5.2:** Emitir el Acta de Entrega en `docs/sdd/04-entregas/007-entrega-documentacion-tecnica-soporte-tarjetas-estados.md`.
- [ ] **Tarea 5.3:** Realizar commits atómicos sin `git add .` y solicitar aprobación al usuario para el merge a `main`.

---

## 2. Matriz de Riesgos y Mitigación
| Riesgo | Impacto | Mitigación |
| :--- | :--- | :--- |
| Explicaciones conceptuales vagas o genéricas | Alto | Contrastar cada respuesta con los contratos oficiales de Placetopay (`docs.placetopay.dev`) y referenciar campos reales de API. |
| Inaccesibilidad en modal de tarjetas | Medio | Emplear atributos ARIA, soporte para tecla Escape y foco visible conforme a WCAG 2.1 AA. |
| Violación de guardrail G-04 (Entrega anticipada) | Alto | No redactar el acta 007 hasta que `scripts/test-documentation-and-support.mjs` reporte 10/10 PASS. |
