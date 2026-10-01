# Plan de Trabajo 002: Implementación de la Skill Git-Workflow y Agente Guardian

- **Spec Asociado:** [`docs/sdd/01-specs/002-spec-git-workflow-y-agentes.md`](file:///C:/Users/USUARIO/prueba%20tecnica/docs/sdd/01-specs/002-spec-git-workflow-y-agentes.md)
- **Responsables:** SDD-Architect & Quality-Agentester
- **Rama de Trabajo:** `feat/spec-002-git-workflow-y-agentes`
- **Estado:** En Ejecución

---

## 1. Desglose de Tareas

| Tarea ID | Descripción | Agente Asignado | Estado |
| :--- | :--- | :--- | :--- |
| **T-2.1** | Crear Intent `002-intent-git-workflow-y-agentes.md`. | SDD-Architect | **Completada** |
| **T-2.2** | Crear Spec `002-spec-git-workflow-y-agentes.md`. | SDD-Architect | **Completada** |
| **T-2.3** | Redactar Plan `002-plan-git-workflow-y-agentes.md`. | SDD-Architect | **Completada** |
| **T-2.4** | Redactar Agentest `002-agentest-git-workflow-y-agentes.md`. | Quality-Agentester | **Completada** |
| **T-2.5** | Crear la skill `.agents/skills/git-workflow/SKILL.md`. | SDD-Architect | **Pendiente** |
| **T-2.6** | Registrar el agente `Git-Workflow-Guardian` en `AGENTS.md`. | SDD-Architect | **Pendiente** |
| **T-2.7** | Crear el script de validación `scripts/verify-git-guardrails.mjs`. | Quality-Agentester | **Pendiente** |
| **T-2.8** | Actualizar `package.json` con el script de verificación de Git. | Quality-Agentester | **Pendiente** |
| **T-2.9** | Actualizar `DEUDAS_TECNICAS.md` y `LECCIONES_APRENDIDAS.md`. | Quality-Agentester | **Pendiente** |
| **T-2.10** | Ejecutar suite `Agentest 002` y verificar 100% de éxito. | Quality-Agentester | **Pendiente** |
| **T-2.11** | Emitir documento de Entrega `002-entrega-git-workflow-y-agentes.md`. | Quality-Agentester | **Bloqueada hasta T-2.10** |
| **T-2.12** | Solicitar aprobación humana formal para el `git merge` a `main`. | SDD-Architect | **Bloqueada hasta T-2.11** |

---

## 2. Matriz de Riesgos

- **Riesgo:** Ejecución inadvertida de un commit en `main`.
  - *Mitigación:* Verificación de rama activa en `verify-git-guardrails.mjs` y regla activa en `.agents/rules/branching-strategy.md`.
- **Riesgo:** Agrupación accidental de archivos de distinta responsabilidad.
  - *Mitigación:* La skill `git-workflow` establece la lista de verificación previa al commit atómico.
