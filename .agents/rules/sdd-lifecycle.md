---
name: sdd-lifecycle
description: Flujo de trabajo mandatorio basado en Spec-Driven Development (Anthropic / Antigravity).
trigger: always_on
---

# Reglas del Ciclo de Vida SDD

## 1. Secuencia de Artefactos Inmutable
Cada desarrollo o fase del proyecto debe avanzar estrictamente a través de los siguientes cinco estados:

1. **Intent (`docs/sdd/00-intents/`):**
   - Define el problema de negocio, la motivación, el alcance y las restricciones iniciales.
2. **Spec (`docs/sdd/01-specs/`):**
   - Especificación formal, viva y versionada. Detalla interfaces, esquemas de datos, flujos de autenticación y criterios de aceptación medibles.
3. **Plan (`docs/sdd/02-plans/`):**
   - Plan de trabajo técnico. Desglosa tareas atómicas, riesgos y mapeo de deudas técnicas.
4. **Agentest (`docs/sdd/03-agentest/`):**
   - Suite de pruebas automatizadas y criterios de verificación que los agentes y el código deben superar.
5. **Entrega (`docs/sdd/04-entregas/`):**
   - Documento final de cierre de fase. **PROHIBIDO** redactar o crear este archivo hasta que el 100% de los tests en `Agentest` hayan culminado y se encuentren verificados.

## 2. Manejo de Hallazgos y Modificaciones de Alcance
- Si durante la fase de `Agentest` se descubren fallos estructurales o el usuario solicita cambios sobre la marcha, se debe discutir la creación de un nuevo Spec o una versión mayor del Spec actual (v1.1, etc.).
- Bajo ninguna circunstancia se debe dar por terminada una fase si existen pruebas pendientes o fallidas.
