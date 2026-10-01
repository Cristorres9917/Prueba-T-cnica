---
name: guardrails
description: Reglas de protección estricta de entorno, gestor de dependencias y cadena de suministro.
trigger: always_on
---

# Reglas de Guardrails del Repositorio

## 1. Gestor de Paquetes Exclusivo: PNPM
- Queda terminantemente prohibido proponer o ejecutar comandos que comiencen o contengan `npm install`, `npm i`, `npm add`, `yarn add`, `yarn install`.
- Cualquier comando para agregar, eliminar o actualizar dependencias debe emplear `pnpm` (ej. `pnpm add <pkg>`, `pnpm remove <pkg>`, `pnpm install`).

## 2. Política de Cuarentena de Cadena de Suministro (48 Horas)
- Todos los paquetes instalados deben tener una antigüedad mínima de 48 horas desde su publicación en npmjs.org.
- Está configurado `minimum-release-age=2880` en `.npmrc` y `minimumReleaseAge: 2880` en `pnpm-workspace.yaml`.
- Si se detecta un intento de bypass de esta regla, se debe abortar la operación y reportar la alerta de seguridad.

## 3. Sandboxing y Comandos Seguros
- No ejecutar comandos destructivos o que alteren configuraciones fuera del workspace local (`C:\Users\USUARIO\prueba tecnica`).
- Usar scripts estandarizados en `package.json` para validación y pruebas (`pnpm run verify:guardrails`, `pnpm run agentest`).
