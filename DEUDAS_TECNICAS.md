# Registro Vivo de Deudas Técnicas (SDD)

Este documento registra de forma transparente y continua las deudas técnicas identificadas durante la concepción, especificación e implementación del proyecto de integración Placetopay.

---

## Matriz de Deudas Técnicas

| ID | Categoría | Descripción de la Deuda | Impacto | Esfuerzo | Estado | Plan de Mitigación / Spec Asociado |
| :--- | :--- | :--- | :--- | :--- | :--- | :--- |
| **DT-001** | Infraestructura | Dependencia de conexión a internet para validar endpoints de sandbox de Placetopay (`checkout-test` y `api-test`). | Medio | Bajo | **Abierta** | En el Spec-03 se implementaron tests con la API sandbox real; se puede añadir mock offline opcional. |
| **DT-002** | Base de Datos | La estructura relacional de SQLite para el registro transaccional no está inicializada en el Spec-01. | Bajo | Medio | **Cerrada** | Implementado en Spec-03 con tablas `payment_sessions`, `transactions` y `audit_logs` vía `node:sqlite`. |
| **DT-003** | Frontend | La tienda y el carrito no disponen aún de interfaz gráfica en este spec de arnés. | Bajo | Medio | **Cerrada** | Resuelto en **Spec-04**: Evertec PayShop implementado con A11y WCAG 2.1 AA, SEO, carrito reactivo y visor de evidencias. |
| **DT-004** | Seguridad | Las credenciales de prueba (`login` y `secretKey`) provistas en el docx se mantendrán en variables de entorno o archivo de configuración local `.env`. | Medio | Bajo | **Mitigada** | Se añadieron `.env*` a `.gitignore` y el servicio transaccional admite variables de entorno `P2P_LOGIN`/`P2P_SECRET_KEY`. |
| **DT-005** | Control de Versiones | Los guardrails de Git se auditan mediante scripts ejecutables (`pnpm run verify:git`), sin hook nativo en `.git/hooks`. | Bajo | Bajo | **Abierta** | Evaluar la adición de un pre-commit hook nativo que ejecute `verify:git` automáticamente. |
| **DT-006** | Documentación / Soporte | Resolución de las 7 preguntas conceptuales y los 4 casos de soporte técnico (Sunshine y Claro) con diagramas de flujo. | Medio | Medio | **Cerrada** | Resuelto en **Spec-07**: Documentación técnica exhaustiva, casos de soporte, diagramas y matriz de tarjetas. |
| **DT-007** | Arquitectura / Webhooks | Notificación asíncrona de WebCheckout vía Webhook endpoint en tiempo real para transacciones de producción. | Bajo | Medio | **Abierta** | En el mockup se simula y consulta vía polling/status; para producción se recomienda agregar endpoint `/api/webhook/placetopay`. |
| **DT-008** | Sincronización WebCheckout | Estado de transacciones WebCheckout en SQLite permanecía en PENDING tras retorno del comprador. | Medio | Bajo | **Cerrada** | Resuelto en **Spec-06**: Sincronización automática de estado, recibo, código de autorización y datos de comprador en modal de detalle. |
| **DT-009** | Testing / Evidencias | Registro fotográfico y suite de pruebas para las APIs consumidas en Postman. | Bajo | Bajo | **Cerrada** | Resuelto en **Spec-08**: Colección Postman v2.1, pre-request scripts criptográficos y guía con 6 evidencias fotográficas. |

---

## Convenciones de Clasificación

- **Impacto:**
  - `Alto`: Bloquea flujos críticos o degrada severamente la seguridad.
  - `Medio`: Limita funcionalidades secundarias o añade fricción operativa.
  - `Bajo`: Mejora técnica, estética o de mantenibilidad.
- **Estado:**
  - `Identificada` / `Abierta` $\rightarrow$ `En Progreso` $\rightarrow$ `Mitigada` $\rightarrow$ `Cerrada`.
