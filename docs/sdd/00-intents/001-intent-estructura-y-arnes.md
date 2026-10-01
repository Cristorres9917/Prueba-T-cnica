# Intent 001: Creación de la Estructura Base, Arnés Antigravity y Gobernanza SDD

## 1. Declaración de Intención
Establecer un ecosistema de desarrollo gobernado, seguro y metodológicamente estricto para abordar la prueba técnica de Analista de Implementación de Placetopay (Evertec). Este ecosistema adopta la filosofía **Spec-Driven Development (SDD)** promovida por Anthropic ("Specify-and-Verify") y adapta el arnés de Antigravity para orquestar agentes, skills, reglas y guardrails de seguridad.

---

## 2. Problema y Necesidad
1. **Riesgo de "Vibe Coding":** Sin una metodología formal, los desarrollos de pasarelas de pago y soporte tienden a fragmentarse, omitiendo criterios de seguridad, trazabilidad de deudas y validación de pruebas.
2. **Seguridad en la Cadena de Suministro:** Se requiere proteger activamente el proyecto contra la instalación de dependencias comprometidas o recién publicadas (menos de 48 horas de vida).
3. **Consistencia en Herramientas:** Es indispensable prohibir el uso disperso de gestores de paquetes como `npm` y asegurar el uso exclusivo de `pnpm`.
4. **Gobierno Transaccional Futuro:** Se requiere preparar el terreno para persistir evidencias de transacciones (Aprobado, Pendiente, Rechazado) en una base de datos relacional SQLite y resolver casos de soporte comercial.

---

## 3. Metas del Hito 001
- [x] Instituir la cultura SDD con ciclo formal: `Intent` $\rightarrow$ `Spec` $\rightarrow$ `Plan` $\rightarrow$ `Agentest` $\rightarrow$ `Entrega`.
- [x] Implementar guardrails técnicos que prohíban `npm install` y fuercen el uso de `pnpm`.
- [x] Configurar la directiva de cuarentena de 48 horas para nuevas librerías en `.npmrc` y `pnpm-workspace.yaml`.
- [x] Diseñar el arnés de Antigravity con roles de agentes (`SDD-Architect`, `Integration-Engineer`, `Support-Consultant`, `Quality-Agentester`) y skills asociadas (`sdd-validator`, `placetopay-auth`).
- [x] Establecer los registros vivos de `DEUDAS_TECNICAS.md` y `LECCIONES_APRENDIDAS.md`.
- [x] Establecer la suite de pruebas automatizadas `Agentest` que debe superarse antes de emitir la primera `Entrega`.

---

## 4. Criterios de Éxito
- La estructura de directorios y archivos refleja fielmente la taxonomía SDD.
- Si se intenta ejecutar `npm install`, el sistema lo rechaza de manera inmediata y controlada.
- Los scripts `verify:guardrails` y `agentest` verifican la conformidad al 100%.
- El archivo de Entrega solo se emite cuando la suite de pruebas reporta un estado 100% exitoso.
