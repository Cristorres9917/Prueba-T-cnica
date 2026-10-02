# Intent 002: Formalización del Sistema de Git, Skill Especializada y Agente de Control de Versiones (Anthropic SDD)

## 1. Declaración de Intención
Definir y estandarizar la gobernanza de control de versiones Git en el proyecto, creando una skill especializada (`git-workflow`) y un agente custodio (`Git-Workflow-Guardian`) bajo los principios de ingeniería de **Anthropic** y el ciclo **Spec-Driven Development (SDD)**. 

Este hito garantiza que toda interacción con Git sea atómica, organizada por responsabilidad, aislada en ramas dedicadas por spec y sujeta a una compuerta estricta de aprobación humana previa a cualquier merge en `main`.

---

## 2. Problema y Necesidad
1. **Riesgo de Commits Masivos e Indiscriminados:** La práctica común de agrupar decenas de archivos inconexos en un solo commit o recurrir a `git add .` oscurece la trazabilidad histórica y aumenta el riesgo de incorporar archivos no deseados o credenciales.
2. **Falta de Aislamiento por Funcionalidad:** Sin ramas dedicadas por cada spec, el trabajo en curso contamina la rama `main`, violando el principio de "especificar y verificar" antes de integrar.
3. **Ausencia de un Rol Especializado:** Los agentes generalistas requieren directivas operativas precisas y estandarizadas (skills) para manipular Git sin violar las políticas de seguridad del proyecto.
4. **Compuerta de Aprobación Humana (Merge Gate):** El agente de IA no debe decidir unilateralmente la fusión de código hacia la rama de producción (`main`). La aprobación final de cada entrega debe recaer explícitamente en el usuario humano mediante `git merge`.

---

## 3. Metas del Hito 002
- [ ] Desarrollar la skill `.agents/skills/git-workflow/SKILL.md` con los protocolos operativos canónicos de Git.
- [ ] Incorporar el rol del agente `Git-Workflow-Guardian` en `AGENTS.md` y `GEMINI.md`.
- [ ] Diseñar el script de validación `scripts/verify-git-guardrails.mjs` que audite nomenclatura de ramas, commits atómicos y ausencia de comandos prohibidos (`git add .`).
- [ ] Establecer la batería de pruebas `Agentest 002` que verifique la conformidad total de la skill y las reglas de Git.
- [ ] Condicionar la emisión del acta de Entrega 002 al 100% de éxito en los tests y preparar el merge hacia `main` para aprobación humana.

---

## 4. Criterios de Éxito
- La skill `git-workflow` documenta detalladamente el ciclo de ramas, staging explícito, commits atómicos y merge gate.
- La tabla de agentes en `AGENTS.md` incluye a `Git-Workflow-Guardian` con sus skills asignadas.
- La suite de Agentest 002 valida automáticamente las políticas de Git.
- No se emite la entrega 002 hasta superar las pruebas, y la integración en `main` se realiza únicamente con aprobación expresa del usuario.
