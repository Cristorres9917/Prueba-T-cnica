# Bitácora de Lecciones Aprendidas (SDD)

Este documento recopila las lecciones aprendidas, patrones arquitectónicos consolidados y decisiones de diseño adoptadas a lo largo del ciclo de vida del proyecto.

---

## 1. Cultura Spec-Driven Development (Anthropic)
- **Lección 1: Separación Taxativa del Qué y el Cómo.**
  - *Contexto:* La tendencia natural en desarrollo asistido por IA ("vibe coding") es saltar a escribir código directamente en la terminal.
  - *Aprendizaje:* Al obligar al agente y al equipo a formalizar primero el `Intent` y el `Spec`, se eliminan ambigüedades sobre requerimientos críticos (como el uso estricto de pnpm o la regla de 48 horas de antigüedad en librerías).
- **Lección 2: La Entrega como Puerta Calificada (Gate).**
  - *Contexto:* Tradicionalmente se asume una entrega como finalizada tan pronto se compila el código.
  - *Aprendizaje:* Adoptar el principio de "No hay entrega sin Agentest" previene falsos positivos y garantiza que cada criterio de aceptación sea verificado por pruebas reproducibles.

---

## 2. Gobernanza y Cadena de Suministro (Supply-Chain Security)
- **Lección 3: Cuarentena de Paquetes en PNPM.**
  - *Contexto:* Se requería impedir la instalación de librerías publicadas hace menos de 48 horas para protegerse de ataques de supply-chain (ej. paquetes maliciosos de vida corta).
  - *Aprendizaje:* `pnpm` (a partir de v10.16/v11) ofrece soporte nativo mediante `minimum-release-age` (expresado en minutos). Configurar `minimum-release-age=2880` en `.npmrc` y `minimumReleaseAge: 2880` en `pnpm-workspace.yaml` ofrece un blindaje a nivel de motor sin sobrecargar el código de aplicación.
- **Lección 4: Restricción Determinista de NPM.**
  - *Contexto:* En Windows, los desarrolladores y agentes pueden accidentalmente invocar `npm install`.
  - *Aprendizaje:* El hook `preinstall` en `package.json` evaluando `process.env.npm_execpath` proporciona una intercepción temprana infalible antes de que se descargue cualquier byte.

---

## 3. Integración Transaccional Placetopay
- **Lección 5: Robustez en el Cálculo de Autenticación Criptográfica.**
  - *Contexto:* Los errores más comunes reportados en soporte ("Error 102" y "Autenticación mal formada") radican en la generación del digest `tranKey` y formato de `seed`/`nonce`.
  - *Aprendizaje:* Centralizar la lógica criptográfica en una skill reusable (`placetopay-auth`) garantiza que tanto la implementación del backend como los agentes de soporte utilicen la misma definición matemática exacta de `Base64(SHA256(rawNonce + seed + secretKey))`.
