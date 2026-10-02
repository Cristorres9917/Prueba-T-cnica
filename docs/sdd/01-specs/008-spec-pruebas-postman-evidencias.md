# Spec 008 — Especificación y Documentación de Pruebas de API en Postman con Evidencias Fotográficas

## 1. Metadatos del Spec
- **ID:** SPEC-008
- **Fase:** 01-Specs
- **Título:** Especificación y Documentación de Pruebas de API en Postman con Evidencias Fotográficas
- **Intent Asociado:** [INTENT-008](../00-intents/008-intent-pruebas-postman-y-evidencias.md)
- **Rama Asignada:** `feat/spec-008-pruebas-postman-y-evidencias-fotograficas`
- **Agentes Participantes:** `Support-Consultant`, `Integration-Engineer`, `Quality-Agentester`, `Git-Workflow-Guardian`

---

## 2. Requerimientos Funcionales y Estructurales

### 2.1. Archivo de Colección de Postman ([`postman_collection.json`](../../postman_collection.json))
El archivo de colección debe permanecer en la raíz del repositorio cumpliendo con el esquema v2.1.0 de Postman y disponer de:
1. **Variables de Entorno y Colección:**
   - `checkoutUrl`: `https://checkout-test.placetopay.com`
   - `gatewayUrl`: `https://api-test.placetopay.com/rest`
   - `localApiUrl`: `http://localhost:3000`
   - `login`: `2d9eaf1e662518756a3d78806543af5b`
   - `secretKey`: `3YC5brb5eAR4xBGQ`
2. **Pre-request Scripts:** Cálculo automático en tiempo real de `seed`, `nonce` y `tranKey` en Base64/SHA-256 usando `CryptoJS`.

### 2.2. Registro Fotográfico de Evidencias (`Evidencias fotograficas/`)
Deben existir y estar indexadas las siguientes 6 capturas de pantalla tomadas durante la ejecución real de las pruebas:
1. `Screenshot 2026-10-02 011855.png`: Petición `POST /api/session` (Crear sesión WebCheckout, respuesta status OK, requestId: 3875483).
2. `Screenshot 2026-10-02 011953.png`: Petición `POST /api/session/{{requestId}}` (Consulta de sesión, status: PENDING, reason: PC).
3. `Screenshot 2026-10-02 012054.png`: Petición `POST /gateway/process` (Pago directo APROBADO con tarjeta Visa 4111, status: APPROVED, reason: 00).
4. `Screenshot 2026-10-02 012249.png`: Petición `POST /gateway/query` (Consulta directa en Gateway con internalReference 1599921884, status: APPROVED).
5. `Screenshot 2026-10-02 012339.png`: Petición `POST /gateway/process` (Pago directo RECHAZADO con tarjeta Visa 4110, status: REJECTED, reason: 05).
6. `Screenshot 2026-10-02 012414.png`: Petición `POST /gateway/process` (Pago directo Fondos Insuficientes / Causal XA, monto 99999999, status: REJECTED, reason: 05).

### 2.3. Documentación Humanizada y Concisa
Ubicación: [`docs/soporte/guia-pruebas-postman-y-evidencias.md`](../soporte/guia-pruebas-postman-y-evidencias.md).
- **Tono:** Humano, claro, empático, directo y profesional (como un analista explicando a un colega desarrollador).
- **Estructura por API:**
  - **¿Qué hace y para qué sirve?** (En 2-3 líneas).
  - **¿Cómo se probó en Postman?** (Método, endpoint y datos clave).
  - **¿Qué nos respondió Placetopay?** (Status, códigos de respuesta, tiempos de respuesta).
  - **Captura de Pantalla:** Imagen incrustada con enlace directo al archivo de evidencia.
- **Resumen Ejecutivo de Tiempos y Rendimiento:** Tabla comparativa con latencias y códigos HTTP.

---

## 3. Criterios de Aceptación (Agentest 008)
1. Aislamiento en rama `feat/spec-008-pruebas-postman-y-evidencias-fotograficas`.
2. Integridad del archivo `postman_collection.json` (JSON válido con las 3 carpetas y variables).
3. Las 6 imágenes existen en `Evidencias fotograficas/` y tienen tamaño > 0.
4. El documento `docs/soporte/guia-pruebas-postman-y-evidencias.md` explica cada una de las 6 APIs y vincula las 6 imágenes.
5. El documento está humanizado y mantiene un estilo conciso y directo.
6. `README.md` cuenta con una sección dedicada a la colección de Postman y la guía de evidencias.
7. Suite de pruebas `scripts/test-postman-evidences.mjs` con 10/10 tests PASS.
