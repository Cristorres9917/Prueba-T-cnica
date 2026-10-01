---
name: sdd-validator
description: Procedimiento para validar la conformidad, estructura y cumplimiento de fases en Spec-Driven Development (SDD).
---

# SDD Validator Skill

Esta skill proporciona los criterios y pasos para auditar que cualquier fase o entrega dentro del proyecto respeta los estándares formales de SDD.

## Procedimiento de Validación

1. **Verificación de Correspondencia:**
   - Para cada número de spec (ej. `001`, `002`), debe existir su correspondiente documento en:
     - `docs/sdd/00-intents/XXX-intent-*.md`
     - `docs/sdd/01-specs/XXX-spec-*.md`
     - `docs/sdd/02-plans/XXX-plan-*.md`
     - `docs/sdd/03-agentest/XXX-agentest-*.md`

2. **Verificación de Puerta de Entrega:**
   - Comprobar que en `docs/sdd/04-entregas/` solo existan archivos cuya suite de `Agentest` haya reportado `PASS` completo.
   - Si una suite de pruebas no ha corrido o tiene fallos, el validador emite estado `BLOCKED`.

3. **Verificación de Registros Vivos:**
   - Confirmar que cualquier limitación o decisión temporal quede asentada en `DEUDAS_TECNICAS.md`.
   - Confirmar que los aprendizajes clave queden anotados en `LECCIONES_APRENDIDAS.md`.
