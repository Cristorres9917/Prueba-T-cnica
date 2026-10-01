# DIRECTIVAS DE PROYECTO: SDD CON PLACETOPAY Y ANTIGRAVITY

Este repositorio se rige bajo la metodología **Spec-Driven Development (SDD)** inspirada en los principios de ingeniería de **Anthropic** y configurada en el arnés de **Antigravity**.

## Reglas Críticas e Inviolables

1. **Gestor de Paquetes:**
   - Usa **EXCLUSIVAMENTE `pnpm`**.
   - **PROHIBIDO** el uso de `npm install`, `npm i`, `npm add` o `yarn`.

2. **Seguridad de Dependencias (48 Horas Cooldown):**
   - No se permite la instalación de paquetes con menos de 48 horas de publicación (`minimum-release-age=2880` en `.npmrc` y `minimumReleaseAge: 2880` en `pnpm-workspace.yaml`).

3. **Ciclo de Vida SDD Obligatorio:**
   - Todo trabajo debe seguir el ciclo: `Intent` -> `Spec` -> `Plan` -> `Agentest` -> `Entrega`.
   - **NUNCA** generes archivos en `docs/sdd/04-entregas/` sin haber ejecutado y superado previamente todos los tests del correspondiente `docs/sdd/03-agentest/`.

4. **Persistencia:**
   - La persistencia transaccional y de evidencias se realizará utilizando la base de datos relacional **SQLite**.

5. **Estrategia de Ramas (Anthropic SDD) y Merge Humano:**
   - A partir de Spec-02, **nunca** trabajar directamente en `main`. Se debe crear una rama `feat/spec-XXX-<slug>`.
   - **NUNCA** ejecutar `git add .` ni `git add -A`. Agregar archivos atómicamente por su ruta exacta.
   - El merge hacia `main` requiere la aprobación explícita del usuario mediante `git merge`.

6. **Transparencia y Deuda Técnica:**
   - Cualquier compromiso técnico, asunción o limitación identificada debe registrarse de inmediato en `DEUDAS_TECNICAS.md`.
   - Los aprendizajes clave se registrarán en `LECCIONES_APRENDIDAS.md`.

Consulta `AGENTS.md` para más información sobre los roles de los agentes y las skills asignadas.
