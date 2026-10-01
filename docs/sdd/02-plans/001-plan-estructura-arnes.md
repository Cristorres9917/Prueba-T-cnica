# Plan de Trabajo 001: Implementación de Estructura, Arnés y Guardrails

- **Spec Asociado:** [`docs/sdd/01-specs/001-spec-estructura-arnes-seguridad.md`](file:///C:/Users/USUARIO/prueba%20tecnica/docs/sdd/01-specs/001-spec-estructura-arnes-seguridad.md)
- **Responsable:** SDD-Architect & Quality-Agentester
- **Estado:** En Ejecución

---

## 1. Desglose de Tareas

| Tarea ID | Descripción | Agente Asignado | Estado |
| :--- | :--- | :--- | :--- |
| **T-1.1** | Configurar directivas de seguridad `.npmrc` (`minimum-release-age=2880`). | SDD-Architect | **Completada** |
| **T-1.2** | Configurar `pnpm-workspace.yaml` con regla de 48h. | SDD-Architect | **Completada** |
| **T-1.3** | Configurar `package.json` con `preinstall` guardrail contra `npm`. | SDD-Architect | **Completada** |
| **T-1.4** | Configurar `.gitignore` para dependencias, secretos y bases de datos locales. | SDD-Architect | **Completada** |
| **T-1.5** | Redactar `AGENTS.md` y `GEMINI.md` con roles y directivas inmutables. | SDD-Architect | **Completada** |
| **T-1.6** | Crear reglas `.agents/rules/guardrails.md` y `.agents/rules/sdd-lifecycle.md`. | SDD-Architect | **Completada** |
| **T-1.7** | Crear skills `.agents/skills/sdd-validator/` y `.agents/skills/placetopay-auth/`. | SDD-Architect | **Completada** |
| **T-1.8** | Inicializar `DEUDAS_TECNICAS.md` y `LECCIONES_APRENDIDAS.md`. | Quality-Agentester | **Completada** |
| **T-1.9** | Crear script automatizado `scripts/verify-guardrails.mjs`. | Quality-Agentester | **En Progreso** |
| **T-1.10** | Crear script ejecutor de tests `scripts/run-agentest.mjs`. | Quality-Agentester | **En Progreso** |
| **T-1.11** | Ejecutar suite de Agentest y verificar 100% de éxito. | Quality-Agentester | **Pendiente** |
| **T-1.12** | Emitir documento formal de Entrega `001-entrega-estructura-arnes.md`. | Quality-Agentester | **Bloqueada hasta T-1.11** |

---

## 2. Gestión de Riesgos y Mitigación

- **Riesgo:** Ejecución accidental de comandos con `npm`.
  - *Mitigación:* Validación doble en `package.json` (`preinstall`) y prueba unitaria en suite de Agentest.
- **Riesgo:** Pérdida de trazabilidad de acuerdos tomados durante el desarrollo.
  - *Mitigación:* Actualización obligatoria de `DEUDAS_TECNICAS.md` y `LECCIONES_APRENDIDAS.md` al cierre de cada tarea.
