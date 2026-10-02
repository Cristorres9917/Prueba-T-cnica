# Intent 007 — Documentación Integral del Proyecto, Matriz de Tarjetas por Estado, Respuestas Conceptuales y Casos de Soporte

## 1. Problema de Negocio y Motivación
La prueba técnica para el rol de Analista de Implementaciones Nivel 1 (Placetopay / Evertec) exige no solamente una implementación funcional y robusta del mockup de tienda virtual con pasarela de pagos, sino una entrega documental de excelencia que sintetice el valor arquitectónico, provea una guía detallada de tarjetas de prueba sandbox para evaluar todos los estados transaccionales, resuelva las 7 preguntas conceptuales clave del ecosistema Placetopay y brinde respuestas asertivas a los 4 casos de soporte técnico y gestión con clientes (Sunshine y Claro).

Adicionalmente, se requiere que la tienda virtual cuente con una referencia accesible en la propia interfaz para que cualquier evaluador técnico pueda consultar y copiar con un clic las tarjetas de prueba para simular aprobaciones, rechazos y fondos insuficientes.

## 2. Objetivos Principales
1. **Documentación Central del Proyecto (`README.md`):** Consolidar la documentación ejecutiva y técnica de todo el repositorio, detallando la arquitectura, arnés SDD, guardrails inmutables, stack nativo (Node.js v24, SQLite, WebCheckout Placetopay) y guía paso a paso de ejecución.
2. **Matriz Exhaustiva de Tarjetas de Prueba (Sandbox):** Documentar las tarjetas para todos los estados requeridos (Aprobada, Rechazada, Fondos Insuficientes / Causal XA, Pendiente y Challenge 3DS con OTP `12345`), e integrar en el frontend un modal/acceso rápido ("💳 Tarjetas de Prueba") con botón de copiado al portapapeles.
3. **Resolución Rigurosa de las 7 Preguntas Conceptuales:** Elaborar un documento técnico maestro (`docs/sdd/04-entregas/007-respuestas-conceptuales-y-soporte.md`) que responda a cabalidad:
   - RequestId (definición, utilidad, no-repetición e idempotencia).
   - Estados de una transacción (APPROVED, PENDING, REJECTED, FAILED/ERROR).
   - Preautorización y hold de fondos con ejemplo en hotelería/rent-a-car.
   - Suscripción vs Recurrencia (fija vs variable).
   - API Gateway vs WebCheckout (PCI compliance, UX, control).
   - Dispersión de fondos (Marketplaces y liquidación multicuenta).
   - Notificaciones asíncronas / Webhooks.
4. **Resolución Estratégica de los 4 Casos de Soporte:** Detallar la gestión operativa, diagnóstico técnico (skills criptográficas) y redactar las cartas/respuestas formales y empáticas para:
   - Caso 1: Error 102 Autenticación fallida (cliente crítico en riesgo de churn).
   - Caso 2: Comercio CLARO - Error "Autenticación mal formada".
   - Caso 3: Comercio Sunshine - Confusión pedagógica y adopción de nuevas metodologías.
   - Caso 4: Comercio Sunshine - Escalamiento hostil, queja de incompetencia y amenaza de cancelación.
5. **Diagramas de Secuencia y Flujo Transaccional:** Diagramar mediante Mermaid los flujos WebCheckout, API Gateway y el ciclo de vida de estados transaccionales.

## 3. Criterios de Éxito
- `README.md` exhaustivo y profesional en la raíz del repositorio.
- Documento maestro de respuestas conceptuales y casos de soporte con diagramas de flujo Mermaid.
- Matriz completa de tarjetas de prueba documentada y accesible desde la interfaz web.
- Suite `AGENTEST-007` con 10/10 pruebas automatizadas superadas.
- Cumplimiento incondicional de los guardrails G-01 a G-07.
