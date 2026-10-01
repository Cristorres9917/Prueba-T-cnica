# Agentest 001: Batería de Pruebas de Aceptación para Estructura, Arnés y Guardrails

- **Spec Asociado:** [`docs/sdd/01-specs/001-spec-estructura-arnes-seguridad.md`](file:///C:/Users/USUARIO/prueba%20tecnica/docs/sdd/01-specs/001-spec-estructura-arnes-seguridad.md)
- **Ejecutor:** Quality-Agentester
- **Estado Actual:** Listo para Ejecución

---

## 1. Matriz de Casos de Prueba

| Test ID | Área / Componente | Descripción de la Prueba | Comando o Procedimiento | Criterio de Éxito | Estado |
| :--- | :--- | :--- | :--- | :--- | :--- |
| **TEST-01** | Guardrails | Validación de configuración `.npmrc` (`minimum-release-age=2880`). | `node scripts/verify-guardrails.mjs` | Parámetro presente con valor exacto 2880. | Pendiente |
| **TEST-02** | Guardrails | Validación de `pnpm-workspace.yaml` (`minimumReleaseAge: 2880`). | `node scripts/verify-guardrails.mjs` | Archivo YAML válido con parámetro 2880. | Pendiente |
| **TEST-03** | Guardrails | Bloqueo activo de `npm` vía script `preinstall`. | Simulación controlada de invocación con engine o script. | Terminación con código 1 y mensaje de error. | Pendiente |
| **TEST-04** | Arnés | Existencia y consistencia de `AGENTS.md` y `GEMINI.md`. | `node scripts/verify-guardrails.mjs` | Archivos no vacíos y con todas las secciones mandatorias. | Pendiente |
| **TEST-05** | Arnés | Existencia de reglas `.agents/rules/` (`guardrails.md`, `sdd-lifecycle.md`). | `node scripts/verify-guardrails.mjs` | Reglas válidas y con trigger configurado. | Pendiente |
| **TEST-06** | Arnés | Existencia de skills `.agents/skills/` (`sdd-validator`, `placetopay-auth`). | `node scripts/verify-guardrails.mjs` | Archivos `SKILL.md` presentes con frontmatter YAML. | Pendiente |
| **TEST-07** | Gobernanza | Estructura documental `docs/sdd/` completa. | `node scripts/verify-guardrails.mjs` | Presencia de Intent, Spec, Plan y Agentest. | Pendiente |
| **TEST-08** | Integridad | Verificación de que `docs/sdd/04-entregas/` está vacía. | `node scripts/verify-guardrails.mjs` | Cero archivos de entrega generados antes de validación. | Pendiente |
| **TEST-09** | Trazabilidad | Existencia de `DEUDAS_TECNICAS.md` y `LECCIONES_APRENDIDAS.md`. | `node scripts/verify-guardrails.mjs` | Documentos vivos presentes con tablas iniciales. | Pendiente |

---

## 2. Instrucciones de Ejecución

Para correr la suite de pruebas completa:
```powershell
pnpm run agentest
```

O alternativamente:
```powershell
node scripts/run-agentest.mjs
```

---

## 3. Puerta de Salida (Gate) para Emisión de Entrega
- **Condición Estricta:** La suite de pruebas debe finalizar con `Total Tests: 9`, `Passed: 9`, `Failed: 0`.
- **Acción Posterior:** Solo cuando el reporte refleje 100% aprobado, el agente `Quality-Agentester` redactará `docs/sdd/04-entregas/001-entrega-estructura-arnes.md`.
