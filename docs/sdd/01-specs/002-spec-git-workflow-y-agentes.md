# Spec 02: Especificación Formal de la Skill de Git, Agente Git-Workflow-Guardian y Estrategia de Ramas SDD

- **Versión:** 1.0.0
- **Estado:** Activo / En Especificación
- **Autor:** SDD-Architect
- **Revisor:** Usuario / Evertec Placetopay Evaluation
- **Intent Asociado:** [`docs/sdd/00-intents/002-intent-git-workflow-y-agentes.md`](file:///C:/Users/USUARIO/prueba%20tecnica/docs/sdd/00-intents/002-intent-git-workflow-y-agentes.md)

---

## 1. Protocolo Operativo Canónico de Git (GIT-POL)

### GIT-POL-1: Aislamiento Estricto por Ramas
- Ningún cambio de código, documentación o configuración posterior al Spec-01 puede realizarse directamente sobre la rama `main`.
- La nomenclatura de ramas debe satisfacer la expresión regular:
  ```regex
  ^(feat|fix|chore|docs)\/spec-[0-9]{3}-[a-z0-9-]+$
  ```
- Ejemplo válido para este spec: `feat/spec-002-git-workflow-y-agentes`.

### GIT-POL-2: Prohibición Absoluta de Staging Ciego
- **PROHIBIDO:** `git add .`, `git add -A`, `git add *`.
- **MANDATORIO:** Especificación explícita de rutas de archivo individuales en el comando de stage:
  ```bash
  git add <ruta/exacta/archivo-1> <ruta/exacta/archivo-2>
  ```
- Cada archivo staged debe guardar coherencia con la responsabilidad única del commit en construcción.

### GIT-POL-3: Taxonomía de Commits Atómicos (Conventional Commits)
Cada commit debe encapsular una única intención lógica:
- `feat(scope)`: Introducción de nuevas capacidades, skills o reglas.
- `chore(scope)`: Configuración de herramientas, dependencias o parámetros del motor.
- `docs(scope)`: Artefactos del ciclo SDD (Intents, Specs, Planes, Agentests, Entregas) y bitácoras.
- `test(scope)`: Suites de pruebas automatizadas y scripts de validación.
- `fix(scope)`: Subsanación de errores o discrepancias.

### GIT-POL-4: Compuerta de Aprobación Humana (Merge Gate)
- La culminación de un spec (Agentest al 100% y emisión del acta de entrega en `04-entregas/`) **no autoriza al agente a realizar un merge automático**.
- El agente debe emitir un reporte final de entrega y solicitar formalmente la revisión del usuario.
- La incorporación hacia `main` se realiza únicamente por instrucción explícita del usuario:
  ```bash
  git checkout main
  git merge --no-ff feat/spec-002-git-workflow-y-agentes
  ```

---

## 2. Especificación de la Skill: `git-workflow`

- **Ubicación:** `.agents/skills/git-workflow/SKILL.md`
- **Frontmatter:**
  ```yaml
  name: git-workflow
  description: Procedimiento operativo canónico para la gestión atómica de Git, aislamiento por ramas y compuerta de aprobación de entrega.
  ```
- **Contenido Requerido:**
  - Guía paso a paso para creación de ramas por spec.
  - Validación de estado previo a staging (`git status -s`).
  - Procedimiento de agregación atómica de archivos por responsabilidad.
  - Verificación de identidad local (`git config --local user.name`).
  - Formato estandarizado de reporte de entrega para solicitud de merge humano.

---

## 3. Especificación del Agente: `Git-Workflow-Guardian`

- **Ubicación:** [`AGENTS.md`](file:///C:/Users/USUARIO/prueba%20tecnica/AGENTS.md)
- **Rol:** Custodio de la integridad de control de versiones y auditor de commits atómicos.
- **Responsabilidades:**
  - Validar que no se ejecuten comandos con comodines (`git add .`).
  - Organizar los cambios en bloques temáticos coherentes antes de confirmar.
  - Verificar que la rama activa coincida con el spec en desarrollo.
  - Auditar la ausencia de archivos sensibles o no deseados en el índice de Git.
  - Preparar el acta de entrega y la solicitud de merge humano.
- **Skills Consumidas:**
  - `git-workflow` (primaria)
  - `sdd-validator` (secundaria)

---

## 4. Script de Auditoría de Guardrails de Git

- **Ubicación:** `scripts/verify-git-guardrails.mjs`
- **Comprobaciones Automatizadas:**
  1. Rama actual no es `main` (está en una rama válida `feat/spec-XXX`).
  2. Nomenclatura de la rama cumple con el patrón regex de specs.
  3. No existen archivos staged con comodines o fuera de alcance.
  4. La skill `git-workflow` existe y define todos los procedimientos requeridos.
  5. El agente `Git-Workflow-Guardian` está registrado en `AGENTS.md`.
  6. La regla `branching-strategy.md` está activa en `.agents/rules/`.

---

## 5. Criterios de Aceptación (AC)

- **AC-1:** La skill `git-workflow` está creada y contiene todas las directivas de GIT-POL-1 a GIT-POL-4.
- **AC-2:** El agente `Git-Workflow-Guardian` está documentado e integrado en `AGENTS.md`.
- **AC-3:** El script `verify-git-guardrails.mjs` se ejecuta y valida que la rama actual cumple el formato formal.
- **AC-4:** Se mantiene actualizada la matriz en `DEUDAS_TECNICAS.md` y `LECCIONES_APRENDIDAS.md`.
- **AC-5:** La suite `Agentest 002` se ejecuta y aprueba al 100%.
- **AC-6:** La entrega en `04-entregas/` permanece bloqueada hasta la aprobación total de las pruebas.
