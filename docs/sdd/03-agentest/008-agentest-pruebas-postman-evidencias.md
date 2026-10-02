# Agentest 008 — Batería de Pruebas de Aceptación para Pruebas Postman y Evidencias Fotográficas

## 1. Definición del Arnés de Verificación
- **Código:** AGENTEST-008
- **Fase Asociada:** Spec-08
- **Rama:** `feat/spec-008-pruebas-postman-y-evidencias-fotograficas`
- **Script Ejecutor:** `scripts/test-postman-evidences.mjs`
- **Comando:** `pnpm run test:spec8`

---

## 2. Matriz de Aserciones de Prueba

| ID | Nombre de la Prueba | Criterio de Aceptación |
| :--- | :--- | :--- |
| **TEST-8.1** | Aislamiento en rama activa de spec | La rama actual de git debe coincidir con `feat/spec-008-*`. |
| **TEST-8.2** | Integridad y sintaxis de `postman_collection.json` | El archivo debe existir en raíz, ser JSON válido v2.1 y contener las 3 carpetas (WebCheckout, Gateway, Local). |
| **TEST-8.3** | Existencia física de las 6 capturas de pantalla | `Evidencias fotograficas/` debe contener los 6 archivos PNG especificados y con tamaño > 0 bytes. |
| **TEST-8.4** | Existencia e integridad de `guia-pruebas-postman-y-evidencias.md` | El documento debe ubicarse en `docs/soporte/` y contener los encabezados de las 6 APIs evaluadas. |
| **TEST-8.5** | Explicación humanizada y concisa de API 1 (Crear Sesión WebCheckout) | Debe explicar el propósito de `POST /api/session`, el pre-request criptográfico y vincular `Screenshot 2026-10-02 011855.png`. |
| **TEST-8.6** | Explicación de API 2 (Consultar Sesión WebCheckout) | Debe explicar `POST /api/session/{{requestId}}`, la captura del estado `PENDING` y vincular `Screenshot 2026-10-02 011953.png`. |
| **TEST-8.7** | Explicación de API 3 (Pago Directo Aprobado) | Debe explicar `POST /gateway/process` con tarjeta Visa 4111, respuesta `APPROVED` (código 00) y vincular `Screenshot 2026-10-02 012054.png`. |
| **TEST-8.8** | Explicación de API 4 (Consulta en Gateway Directo) | Debe explicar `POST /gateway/query` usando `internalReference`, respuesta `APPROVED` y vincular `Screenshot 2026-10-02 012249.png`. |
| **TEST-8.9** | Explicación de APIs 5 y 6 (Rechazos y Fondos Insuficientes) | Debe explicar `POST /gateway/process` con Visa 4110 (código 05) y fondos insuficientes (monto límite) vinculando los Screenshots 012339 y 012414. |
| **TEST-8.10** | Vinculación y actualización en `README.md` | `README.md` debe incluir una sección clara que invite a consultar la colección de Postman y la guía de evidencias fotográficas. |
