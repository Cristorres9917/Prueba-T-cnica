# Intent 008 — Especificación y Documentación de Pruebas de API en Postman con Evidencias Fotográficas

## 1. Problema de Negocio y Motivación
Para completar con máxima rigurosidad técnica la entrega de la prueba de **Analista de Implementaciones Placetopay (Evertec)**, se ejecutó una batería de pruebas de integración directa en Postman utilizando la colección oficial [`postman_collection.json`](../../postman_collection.json). Las peticiones consumieron tanto el ambiente de **Placetopay WebCheckout** como el **API Gateway Sandbox** y el **Backend Local**, generando un registro fotográfico de 6 capturas de pantalla reales en la carpeta `Evidencias fotograficas/`.

Es necesario formalizar un spec y una guía documental técnica que explique cada una de las APIs probadas en Postman, correlacionando cada captura de pantalla con su propósito, payload enviado, respuesta obtenida y explicación conceptual humanizada, breve y directa.

## 2. Objetivos Principales
1. **Documentación Humanizada y Concisa:** Redactar [`docs/soporte/guia-pruebas-postman-y-evidencias.md`](../soporte/guia-pruebas-postman-y-evidencias.md) explicando de forma cercana y amigable cada API consumida en Postman, evitando tecnicismos innecesarios o exceso de relleno.
2. **Trazabilidad Fotográfica Completa (6/6 APIs):**
   - API 1: `POST /api/session` — Creación de sesión WebCheckout (`Screenshot 2026-10-02 011855.png`).
   - API 2: `POST /api/session/{{requestId}}` — Consulta de estado WebCheckout (`Screenshot 2026-10-02 011953.png`).
   - API 3: `POST /gateway/process` — Pago Directo Aprobado Visa 4111 (`Screenshot 2026-10-02 012054.png`).
   - API 4: `POST /gateway/query` — Consulta Directa en Gateway con Internal Reference (`Screenshot 2026-10-02 012249.png`).
   - API 5: `POST /gateway/process` — Pago Directo Rechazado Visa 4110 (`Screenshot 2026-10-02 012339.png`).
   - API 6: `POST /gateway/process` — Pago Directo Fondos Insuficientes / Causal XA (`Screenshot 2026-10-02 012414.png`).
3. **Colección de Postman y Automatizaciones:** Explicar el funcionamiento de los Pre-request Scripts que calculan `seed`, `nonce` y `tranKey` (SHA-256 + Base64) en tiempo de ejecución.
4. **Validación Automatizada (Agentest 008):** Crear `scripts/test-postman-evidences.mjs` con 10 pruebas automatizadas para garantizar la coherencia de archivos, rutas e integridad documental.

## 3. Criterios de Aceptación
- Documento `guia-pruebas-postman-y-evidencias.md` completo, humano y con enlaces a las 6 capturas de pantalla.
- `README.md` actualizado con referencia directa a las pruebas de Postman.
- 10/10 tests superados en `pnpm run test:spec8`.
- Cumplimiento incondicional de los guardrails SDD (G-01 a G-07).
