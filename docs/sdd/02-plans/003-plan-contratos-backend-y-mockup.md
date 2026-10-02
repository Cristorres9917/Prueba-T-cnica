# Plan de Trabajo 003: Implementación de Contratos Backend, Persistencia SQLite y Preparación de Mockup

- **Spec Asociado:** [`docs/sdd/01-specs/003-spec-contratos-backend-y-mockup.md`](file:///C:/Users/USUARIO/prueba%20tecnica/docs/sdd/01-specs/003-spec-contratos-backend-y-mockup.md)
- **Responsables:** Integration-Engineer & Quality-Agentester
- **Rama de Trabajo:** `feat/spec-003-contratos-backend-y-mockup`
- **Estado:** En Ejecución

---

## 1. Desglose de Tareas

| Tarea ID | Descripción | Agente Asignado | Estado |
| :--- | :--- | :--- | :--- |
| **T-3.1** | Crear Intent `003-intent-contratos-backend-y-mockup.md`. | SDD-Architect | **Completada** |
| **T-3.2** | Crear Spec `003-spec-contratos-backend-y-mockup.md`. | SDD-Architect & Integration-Engineer | **Completada** |
| **T-3.3** | Redactar Plan `003-plan-contratos-backend-y-mockup.md`. | SDD-Architect | **Completada** |
| **T-3.4** | Redactar Agentest `003-agentest-contratos-backend-y-mockup.md`. | Quality-Agentester | **Completada** |
| **T-3.5** | Implementar módulo de persistencia SQLite y migraciones DDL (`src/database/`). | Integration-Engineer | **Pendiente** |
| **T-3.6** | Implementar cliente de integración Placetopay (`src/services/placetopay.js`). | Integration-Engineer | **Pendiente** |
| **T-3.7** | Crear script de verificación y pruebas automatizadas `scripts/test-placetopay-contracts.mjs`. | Quality-Agentester | **Pendiente** |
| **T-3.8** | Actualizar `DEUDAS_TECNICAS.md` y `LECCIONES_APRENDIDAS.md`. | Quality-Agentester | **Pendiente** |
| **T-3.9** | Ejecutar suite `Agentest 003` y verificar 100% PASS. | Quality-Agentester | **Pendiente** |
| **T-3.10** | Emitir documento formal de Entrega `003-entrega-contratos-backend-y-mockup.md`. | Quality-Agentester | **Bloqueada hasta T-3.9** |
| **T-3.11** | Solicitar aprobación de merge humano para incorporar a `main`. | Git-Workflow-Guardian | **Bloqueada hasta T-3.10** |

---

## 2. Puntos de Control y Mitigación de Riesgos

- **Riesgo:** Incompatibilidad de drivers SQLite nativos en Windows.
  - *Mitigación:* Se utiliza `node:sqlite` nativo de Node.js v24 (con el flag `--experimental-sqlite` o soporte estándar de Node 24), garantizando cero dependencias binarias externas y respetando plenamente los guardrails.
- **Riesgo:** Timeouts de red o latencia contra el sandbox de Placetopay en pruebas locales.
  - *Mitigación:* El cliente transaccional implementa reintentos exponenciales y validación estricta de payloads locales antes de la emisión HTTP.
