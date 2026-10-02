# Plan Técnico 008 — Especificación y Documentación de Pruebas de API en Postman con Evidencias Fotográficas

## 1. Desglose de Fases y Tareas Atómicas

### Fase 1: Creación de la Guía Documental Humanizada
- [ ] **Tarea 1.1:** Redactar `docs/soporte/guia-pruebas-postman-y-evidencias.md` con lenguaje cercano, breve y profesional.
- [ ] **Tarea 1.2:** Detallar las 6 APIs probadas (WebCheckout Create, WebCheckout Query, Gateway Approved, Gateway Query, Gateway Rejected, Gateway Fondos Insuficientes).
- [ ] **Tarea 1.3:** Vincular las 6 capturas de pantalla de la carpeta `Evidencias fotograficas/`.
- [ ] **Tarea 1.4:** Añadir tabla resumen de latencias observadas en Postman (entre 273 ms y 2.33 s) y códigos HTTP.

### Fase 2: Actualización de Documentación Raíz (`README.md`)
- [ ] **Tarea 2.1:** Agregar en `README.md` la referencia directa a `postman_collection.json` y a `docs/soporte/guia-pruebas-postman-y-evidencias.md`.

### Fase 3: Arnés de Pruebas Automatizadas (Agentest 008)
- [ ] **Tarea 3.1:** Crear `docs/sdd/03-agentest/008-agentest-pruebas-postman-evidencias.md`.
- [ ] **Tarea 3.2:** Desarrollar `scripts/test-postman-evidences.mjs` con 10 aserciones automatizadas.
- [ ] **Tarea 3.3:** Registrar `"test:spec8": "node scripts/test-postman-evidences.mjs"` en `package.json`.
- [ ] **Tarea 3.4:** Ejecutar y validar que los 10 tests pasen satisfactoriamente (10/10 PASS).

### Fase 4: Cierre, Entrega y Compuerta de Merge Humano
- [ ] **Tarea 4.1:** Actualizar `DEUDAS_TECNICAS.md` y `LECCIONES_APRENDIDAS.md`.
- [ ] **Tarea 4.2:** Emitir el Acta de Entrega `docs/sdd/04-entregas/008-entrega-pruebas-postman-y-evidencias.md`.
- [ ] **Tarea 4.3:** Realizar commits atómicos sin `git add .` y solicitar aprobación al usuario para el merge a `main`.

---

## 2. Matriz de Riesgos y Mitigación
| Riesgo | Impacto | Mitigación |
| :--- | :--- | :--- |
| Explicaciones excesivamente largas o tediosas | Medio | Adoptar formato estructurado de 4 bullets por API: Qué es, Cómo se probó, Qué respondió y Foto. |
| Rutas rotas hacia las imágenes con espacios | Medio | Utilizar codificación `%20` o nombres exactos en Markdown (`../../Evidencias%20fotograficas/Screenshot...`). |
| Guardrail G-04 (Entrega sin verificación) | Alto | No crear archivo en `04-entregas/` hasta que `pnpm run test:spec8` reporte 10/10 PASS. |
