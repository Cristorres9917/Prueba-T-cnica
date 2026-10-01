# Registro Vivo de Deudas Técnicas (SDD)

Este documento registra de forma transparente y continua las deudas técnicas identificadas durante la concepción, especificación e implementación del proyecto de integración Placetopay.

---

## Matriz de Deudas Técnicas

| ID | Categoría | Descripción de la Deuda | Impacto | Esfuerzo | Estado | Plan de Mitigación / Spec Asociado |
| :--- | :--- | :--- | :--- | :--- | :--- | :--- |
| **DT-001** | Infraestructura | Dependencia de conexión a internet para validar endpoints de sandbox de Placetopay (`checkout-test` y `api-test`). | Medio | Bajo | **Abierta** | En el Spec-02 se implementarán mocks/stubs locales para permitir tests sin conectividad cuando sea necesario. |
| **DT-002** | Base de Datos | La estructura relacional de SQLite para el registro transaccional no está inicializada en el Spec-01. | Bajo | Medio | **Planificada** | Se formalizará y creará el esquema DDL y migraciones SQLite en el **Spec-02 (Integración Transaccional)**. |
| **DT-003** | Frontend | La tienda y el carrito no disponen aún de interfaz gráfica en este spec de arnés. | Bajo | Medio | **Planificada** | Se implementará la interfaz visual interactiva en el **Spec-03 (Tienda & Carrito)**. |
| **DT-004** | Seguridad | Las credenciales de prueba (`login` y `secretKey`) provistas en el docx se mantendrán en variables de entorno o archivo de configuración local `.env`. | Medio | Bajo | **Mitigada** | Se añadieron `.env*` a `.gitignore` y se proveerá plantilla `.env.example` en el Spec-02. |

---

## Convenciones de Clasificación

- **Impacto:**
  - `Alto`: Bloquea flujos críticos o degrada severamente la seguridad.
  - `Medio`: Limita funcionalidades secundarias o añade fricción operativa.
  - `Bajo`: Mejora técnica, estética o de mantenibilidad.
- **Estado:**
  - `Identificada` / `Abierta` $\rightarrow$ `En Progreso` $\rightarrow$ `Mitigada` $\rightarrow$ `Cerrada`.
