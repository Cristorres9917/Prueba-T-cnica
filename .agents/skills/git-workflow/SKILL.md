---
name: git-workflow
description: Procedimiento operativo canónico para la gestión atómica de Git, aislamiento por ramas y compuerta de aprobación de entrega (Anthropic SDD).
---

# Git Workflow Skill (Anthropic SDD)

Esta skill define el procedimiento operacional estándar para interactuar con Git en este repositorio, garantizando el cumplimiento incondicional de los guardrails de aislamiento de ramas, commits atómicos y aprobación humana.

---

## 1. Ciclo de Vida de Ramas por Spec

### Creación de Rama de Spec:
- Antes de iniciar cualquier trabajo documental o de código para un nuevo Spec (`XXX`), se debe crear y cambiar a su rama dedicada:
  ```bash
  git checkout main
  git checkout -b feat/spec-XXX-<slug-descriptivo>
  ```
- **Convención Regex:** La rama debe cumplir estrictamente:
  `^(feat|fix|chore|docs)\/spec-[0-9]{3}-[a-z0-9-]+$`

---

## 2. Guardrails de Staging y Commits Atómicos

### Regla de Oro: Prohibición de Comodines
- **NUNCA** ejecutar:
  ```bash
  git add .
  git add -A
  git add *
  ```
- **SIEMPRE** agregar archivos individualmente especificando su ruta exacta:
  ```bash
  git add ruta/archivo-1.md ruta/archivo-2.mjs
  ```

### Procedimiento de Commit por Responsabilidad:
Antes de confirmar, clasificar los archivos modificados según su categoría y generar un commit independiente para cada grupo:

| Prefijo | Responsabilidad | Ejemplo de Archivos |
| :--- | :--- | :--- |
| `chore:` | Configuración de entorno, dependencias y guardrails | `.npmrc`, `pnpm-workspace.yaml`, `package.json`, `.gitignore` |
| `feat:` | Nuevas funcionalidades, agentes, reglas y skills | `AGENTS.md`, `.agents/rules/*.md`, `.agents/skills/*` |
| `docs:` | Artefactos SDD, deudas técnicas y lecciones aprendidas | `docs/sdd/**/*.md`, `DEUDAS_TECNICAS.md`, `LECCIONES_APRENDIDAS.md` |
| `test:` | Suites de pruebas y scripts de verificación | `scripts/*.mjs`, suites de Agentest |
| `fix:` | Subsanación de incidencias o discrepancias de tests | Archivos corregidos |

---

## 3. Protocolo de Compuerta de Aprobación Humana (Merge Gate)

1. **Condición Previa:** Los Agentests del spec activo deben haber reportado 100% aprobado.
2. **Generación del Acta:** Se redacta el documento `docs/sdd/04-entregas/XXX-entrega-*.md`.
3. **Prohibición de Merge Autónomo:** El agente tiene **estrictamente prohibido** ejecutar `git merge` hacia `main` por iniciativa propia.
4. **Solicitud de Merge al Usuario:** El agente emitirá un resumen ejecutivo con:
   - Resumen de commits atómicos en la rama.
   - Resultado de los Agentests.
   - Enlace al acta de Entrega.
   - Comando propuesto para que el usuario autorice o ejecute la fusión:
     ```bash
     git checkout main
     git merge --no-ff feat/spec-XXX-<slug>
     ```
