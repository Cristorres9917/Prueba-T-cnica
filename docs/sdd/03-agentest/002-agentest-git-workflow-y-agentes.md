# Agentest 002: Batería de Pruebas de Aceptación para Git-Workflow y Agente Guardian

- **Spec Asociado:** [`docs/sdd/01-specs/002-spec-git-workflow-y-agentes.md`](file:///C:/Users/USUARIO/prueba%20tecnica/docs/sdd/01-specs/002-spec-git-workflow-y-agentes.md)
- **Ejecutor:** Quality-Agentester
- **Rama de Ejecución:** `feat/spec-002-git-workflow-y-agentes`
- **Estado Actual:** Listo para Implementación y Verificación

---

## 1. Matriz de Casos de Prueba

| Test ID | Área / Componente | Descripción de la Prueba | Comando o Procedimiento | Criterio de Éxito | Estado |
| :--- | :--- | :--- | :--- | :--- | :--- |
| **TEST-2.1** | Aislamiento | Validación de rama activa no es `main`. | `node scripts/verify-git-guardrails.mjs` | Rama actual es `feat/spec-002-git-workflow-y-agentes`. | Pendiente |
| **TEST-2.2** | Nomenclatura | Validación de regex de nombre de rama. | `node scripts/verify-git-guardrails.mjs` | Cumple patrón `^(feat\|fix\|chore\|docs)\/spec-[0-9]{3}-[a-z0-9-]+$`. | Pendiente |
| **TEST-2.3** | Skill | Existencia e integridad de `.agents/skills/git-workflow/SKILL.md`. | `node scripts/verify-git-guardrails.mjs` | Skill presente con frontmatter YAML y secciones requeridas. | Pendiente |
| **TEST-2.4** | Guardián | Registro del agente `Git-Workflow-Guardian` en `AGENTS.md`. | `node scripts/verify-git-guardrails.mjs` | Agente documentado con consumo de skill `git-workflow`. | Pendiente |
| **TEST-2.5** | Reglas | Presencia de regla `.agents/rules/branching-strategy.md`. | `node scripts/verify-git-guardrails.mjs` | Regla activa con trigger `always_on`. | Pendiente |
| **TEST-2.6** | Prohibición | Validación estricta de prohibición de `git add .`. | Verificación en código y directivas de arnés. | Prohibición documentada con consecuencias explícitas. | Pendiente |
| **TEST-2.7** | SDD Gate | Integridad de `docs/sdd/04-entregas/` para Spec-02. | `node scripts/verify-git-guardrails.mjs` | No existe `002-entrega-*.md` antes de culminar tests. | Pendiente |
| **TEST-2.8** | Trazabilidad | Registro de lección aprendida y deuda técnica de Git. | `node scripts/verify-git-guardrails.mjs` | `DEUDAS_TECNICAS.md` y `LECCIONES_APRENDIDAS.md` actualizados. | Pendiente |

---

## 2. Instrucciones de Ejecución

Para correr la suite de pruebas del Spec-02:
```powershell
node scripts/verify-git-guardrails.mjs
```

---

## 3. Puerta de Salida y Aprobación de Merge
- La suite debe reportar `Total Tests: 8`, `Passed: 8`, `Failed: 0`.
- Tras la aprobación de los tests, se genera `docs/sdd/04-entregas/002-entrega-git-workflow-y-agentes.md`.
- El agente **no fusiona a `main`**, sino que emite la solicitud de merge formal para el usuario.
