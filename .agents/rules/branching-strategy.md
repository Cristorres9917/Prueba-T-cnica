---
name: branching-strategy
description: Estrategia de ramas por Spec y compuerta de aprobación humana vía Git Merge según principios de Anthropic.
trigger: always_on
---

# Reglas de Estrategia de Ramas y Aprobación de Entrega (Anthropic SDD)

## 1. Ramas Aisladas por Spec
- A partir del Spec-02, **está estrictamente prohibido** desarrollar directamente sobre la rama `main`.
- Cada nuevo ciclo de Spec debe iniciar con la creación de una rama dedicada:
  ```bash
  git checkout -b feat/spec-XXX-<slug-descriptivo>
  ```
- Todas las modificaciones de código, pruebas, esquemas de base de datos y documentación de esa etapa deben residir exclusivamente en su rama.

## 2. Prohibición de `git add .`
- Queda prohibido el uso de `git add .` o `git add -A`.
- Cada archivo debe ser agregado de manera explícita y atómica (ejemplo: `git add docs/sdd/01-specs/002-spec.md package.json`).
- Previene la incorporación accidental de credenciales, temporales o archivos fuera de alcance.

## 3. Puerta de Aprobación Humana (Human-in-the-Loop Merge Gate)
- La culminación exitosa de los `Agentest` (10/10) y la redacción del acta en `docs/sdd/04-entregas/` **NO autorizan** al agente a realizar un merge unilateral hacia `main`.
- El agente debe presentar el acta de entrega y solicitar formalmente la revisión y aprobación del usuario.
- La incorporación hacia `main` se realiza **únicamente** con la aprobación explícita del usuario mediante `git merge`:
  ```bash
  git checkout main
  git merge --no-ff feat/spec-XXX-<slug-descriptivo>
  ```
