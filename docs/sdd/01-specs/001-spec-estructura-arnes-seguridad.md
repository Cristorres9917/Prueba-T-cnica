# Spec 01: Especificación Formal de Estructura de Proyecto, Arnés Antigravity y Seguridad de Dependencias

- **Versión:** 1.0.0
- **Estado:** Activo / Aprobado
- **Autor:** SDD-Architect
- **Revisor:** Usuario / Evertec Placetopay Evaluation
- **Intent Asociado:** [`docs/sdd/00-intents/001-intent-estructura-y-arnes.md`](file:///C:/Users/USUARIO/prueba%20tecnica/docs/sdd/00-intents/001-intent-estructura-y-arnes.md)

---

## 1. Arquitectura de Directorios y Archivos

El repositorio implementa la siguiente estructura física:

```
├── .agents/
│   ├── rules/
│   │   ├── guardrails.md
│   │   └── sdd-lifecycle.md
│   └── skills/
│       ├── placetopay-auth/
│       │   └── SKILL.md
│       └── sdd-validator/
│           └── SKILL.md
├── docs/
│   └── sdd/
│       ├── 00-intents/
│       │   └── 001-intent-estructura-y-arnes.md
│       ├── 01-specs/
│       │   └── 001-spec-estructura-arnes-seguridad.md
│       ├── 02-plans/
│       │   └── 001-plan-estructura-arnes.md
│       ├── 03-agentest/
│       │   └── 001-agentest-estructura-arnes.md
│       └── 04-entregas/
├── scripts/
│   ├── verify-guardrails.mjs
│   └── run-agentest.mjs
├── .gitignore
├── .npmrc
├── AGENTS.md
├── DEUDAS_TECNICAS.md
├── GEMINI.md
├── LECCIONES_APRENDIDAS.md
├── package.json
└── pnpm-workspace.yaml
```

---

## 2. Requerimientos de Seguridad y Guardrails (G-REQ)

### G-REQ-1: Exclusividad de PNPM
- El gestor de paquetes exclusivo es `pnpm`.
- Se implementa el script `preinstall` en `package.json` que valida `process.env.npm_execpath`.
- En caso de invocarse con `npm` o `yarn`, la instalación termina inmediatamente con error de salida 1.

### G-REQ-2: Cuarentena de Publicación de Librerías (48 Horas)
- Ninguna dependencia con fecha de publicación menor a 48 horas (2880 minutos) puede ser descargada ni resuelta por el gestor de paquetes.
- Implementación en `.npmrc`:
  ```ini
  minimum-release-age=2880
  ```
- Implementación en `pnpm-workspace.yaml`:
  ```yaml
  minimumReleaseAge: 2880
  ```

---

## 3. Especificación del Arnés Antigravity

### 3.1. Reglas Activas (`.agents/rules/`)
- `guardrails.md`: Bloquea comandos inseguros y protege contra manipulación de dependencias.
- `sdd-lifecycle.md`: Exige el avance secuencial `Intent` $\rightarrow$ `Spec` $\rightarrow$ `Plan` $\rightarrow$ `Agentest` $\rightarrow$ `Entrega`.

### 3.2. Catálogo de Skills (`.agents/skills/`)
- `sdd-validator`: Valida consistencia documental, integridad de carpetas y bloqueos de entrega.
- `placetopay-auth`: Define el algoritmo criptográfico canónico de autenticación Placetopay (`seed`, `nonce`, `tranKey`).

### 3.3. Cuadrilla de Agentes (`AGENTS.md`)
- `SDD-Architect`: Encargado de formular intents, specs y planes.
- `Integration-Engineer`: Responsable de la integración de WebCheckout y API Gateway con SQLite.
- `Support-Consultant`: Especialista en soporte técnico, diagnóstico de errores (102, auth mal formada) y pedagogía con comercios (Sunshine, Claro).
- `Quality-Agentester`: Asegura la calidad ejecutando los agentest y gobernando las deudas técnicas.

---

## 4. Criterios de Aceptación de este Spec

1. **AC-1:** Archivos de configuración `.npmrc`, `pnpm-workspace.yaml`, `package.json` y `.gitignore` existen y contienen las directivas exactas.
2. **AC-2:** El hook de `package.json` intercepta activamente llamadas con `npm`.
3. **AC-3:** `AGENTS.md`, `GEMINI.md`, rules y skills están completamente configurados y documentados.
4. **AC-4:** `DEUDAS_TECNICAS.md` y `LECCIONES_APRENDIDAS.md` están inicializados con las primeras entradas.
5. **AC-5:** El script `verify:guardrails.mjs` valida exitosamente todas las directivas de seguridad y estructura.
6. **AC-6:** La carpeta `docs/sdd/04-entregas/` permanece sin archivos hasta que el suite de pruebas de `Agentest` sea ejecutado y superado en su totalidad.
