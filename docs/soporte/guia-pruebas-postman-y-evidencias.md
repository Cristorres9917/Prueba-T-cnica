# Guía de Pruebas en Postman & Registro de Evidencias Fotográficas (Placetopay Sandbox)

**Autor:** Analista de Implementaciones Nivel 1 (Placetopay / Evertec)  
**Proyecto:** Integración WebCheckout & API Gateway  
**Colección de Postman:** [`postman_collection.json`](../../postman_collection.json)  
**Carpeta de Capturas:** [`Evidencias fotograficas/`](../../Evidencias%20fotograficas/)  

---

## 💡 ¿De qué se trata esta guía? (En palabras simples)
Para demostrar que nuestra integración funciona en la vida real, ejecutamos una batería de pruebas directamente en **Postman** consumiendo los servidores de prueba (*Sandbox*) de **Placetopay**. 

Gracias al **Pre-request Script** que dejamos programado en la colección, Postman calcula en cada clic las contraseñas criptográficas seguras (`tranKey`, `seed` y `nonce`) en Base64/SHA-256. Así no tuvimos que calcular hashes a mano y pudimos probar los flujos reales de pago en segundos.

A continuación te explicamos de forma breve, humana y sin rodeos cada una de las **6 APIs probadas**, junto a su captura fotográfica correspondiente.

---

## 1. Crear Sesión en WebCheckout (`POST /api/session`)

- **¿Qué hace?:** Es la puerta de entrada. Le pide a Placetopay: *"Oye, este cliente quiere pagar un celular de $6.499.000 COP, créame una sesión segura y dame el enlace para enviarlo a pagar"*.
- **¿Qué enviamos?:** Las credenciales dinámicas en `auth`, los datos del comprador (Carlos Gómez, CC, email, celular y dirección) y el valor del pago.
- **¿Qué nos respondió Placetopay?:** Un código `200 OK` en **513 ms** con estado `"OK"`, asignándonos el identificador único **`requestId: 3875483`** y la URL segura de pago (`processUrl`).
- **Detalle clave:** Nuestro script en Postman capturó automáticamente ese `requestId` y lo guardó en las variables para que la siguiente consulta lo use sin copiar y pegar.

![Evidencia 1: Crear Sesión WebCheckout](../../Evidencias%20fotograficas/Screenshot%202026-10-02%20011855.png)

---

## 2. Consultar Estado de la Sesión WebCheckout (`POST /api/session/{{requestId}}`)

- **¿Qué hace?:** Permite a la tienda preguntar: *"¿Qué pasó con la sesión 3875483? ¿El cliente ya pagó o sigue en la pasarela?"*.
- **¿Qué enviamos?:** Solo las credenciales de autenticación en el cuerpo JSON y el `requestId` en la URL.
- **¿Qué nos respondió Placetopay?:** Respuesta `200 OK` en apenas **273 ms**. Nos confirma que el estado es **`PENDING`** con razón **`PC`** (*"La petición se encuentra activa"*), confirmando que la sesión está viva y lista en el banco a la espera de que el usuario digite su tarjeta.

![Evidencia 2: Consultar Estado de Sesión](../../Evidencias%20fotograficas/Screenshot%202026-10-02%20011953.png)

---

## 3. Pago Directo Aprobado en API Gateway (`POST /gateway/process`)

- **¿Qué hace?:** Simula un cobro directo con tarjeta de crédito desde una aplicación o sistema propio, sin redireccionar al cliente a otra página.
- **¿Cómo se probó?:** Enviamos una tarjeta Visa de pruebas de aprobación inmediata (`4111 1111 1111 1111`) por un valor de $5.899.000 COP.
- **¿Qué nos respondió Placetopay?:** Respuesta `200 OK` en **2.33 segundos**. Estado **`APPROVED`**, causal **`00`** (*"Aprobada"*), generando una referencia interna del procesador **`internalReference: 1599921884`** bajo la franquicia **`CR_VS` (Visa)**.

![Evidencia 3: Pago Directo Aprobado](../../Evidencias%20fotograficas/Screenshot%202026-10-02%20012054.png)

---

## 4. Consultar Transacción en Gateway Directo (`POST /gateway/query`)

- **¿Qué hace?:** Sirve para verificar y conciliar una transacción directa server-to-server utilizando la referencia interna bancaria.
- **¿Cómo se probó?:** Enviamos la autenticación junto con `"internalReference": "1599921884"` generada en el paso anterior.
- **¿Qué nos respondió Placetopay?:** Respuesta `200 OK` en **674 ms**. Confirmó de manera idéntica que la transacción `1599921884` está efectivamente **`APPROVED`** con fecha, hora exacta y datos de franquicia Visa intactos.

![Evidencia 4: Consulta Directa en Gateway](../../Evidencias%20fotograficas/Screenshot%202026-10-02%20012249.png)

---

## 5. Pago Directo Rechazado / Tarjeta Denegada (`POST /gateway/process`)

- **¿Qué hace?:** Comprueba cómo reacciona el sistema cuando el banco emisor rechaza el cobro de la tarjeta.
- **¿Cómo se probó?:** Se envió la tarjeta de prueba denegada Visa (`4110 7600 0000 0016`) por $4.500.000 COP.
- **¿Qué nos respondió Placetopay?:** Respuesta `200 OK` en **1.63 segundos**. Estado **`REJECTED`**, código causal **`05`** con el mensaje: *"Negada, puede ser tarjeta bloqueada o timeout"*, asignando la referencia interna `1599921890`. Esto valida que nuestro flujo maneja los rechazos de forma limpia y transparente.

![Evidencia 5: Pago Rechazado Tarjeta Denegada](../../Evidencias%20fotograficas/Screenshot%202026-10-02%20012339.png)

---

## 6. Pago Rechazado por Fondos Insuficientes / Causal XA (`POST /gateway/process`)

- **¿Qué hace?:** Evalúa el comportamiento ante un rechazo de tipo financiero (fondos insuficientes o límite de cupo excedido).
- **¿Cómo se probó?:** Se disparó la transacción con un monto elevado que sobrepasa los umbrales de prueba ($99.999.999 COP) usando la tarjeta de prueba para causales de rechazo.
- **¿Qué nos respondió Placetopay?:** Respuesta `200 OK` en **1.45 segundos**. Estado **`REJECTED`**, código causal **`05` / `XA`** (*"Negada, puede ser tarjeta bloqueada o timeout"*), registrando la referencia interna `1599921891`. Queda demostrado el control de excepciones ante fondos no disponibles.

![Evidencia 6: Pago Fondos Insuficientes](../../Evidencias%20fotograficas/Screenshot%202026-10-02%20012414.png)

---

## 📊 Tabla Resumen de Rendimiento y Resultados en Postman

| # | Petición API en Postman | Método & Endpoint | Resultado Obtenido | Código / Causal | Latencia de Red | Evidencia Asociada |
| :---: | :--- | :--- | :---: | :---: | :---: | :--- |
| **1** | Crear Sesión WebCheckout | `POST /api/session` | **`OK`** (RequestId: 3875483) | `PC` | 513 ms | `Screenshot 2026-10-02 011855.png` |
| **2** | Consultar Estado WebCheckout | `POST /api/session/{{requestId}}` | **`PENDING`** (Sesión activa) | `PC` | 273 ms | `Screenshot 2026-10-02 011953.png` |
| **3** | Pago Directo Aprobado (Visa) | `POST /gateway/process` | **`APPROVED`** (IntRef: 1599921884) | `00` | 2.33 s | `Screenshot 2026-10-02 012054.png` |
| **4** | Consulta Gateway Directo | `POST /gateway/query` | **`APPROVED`** (Verificada) | `00` | 674 ms | `Screenshot 2026-10-02 012249.png` |
| **5** | Pago Directo Rechazado | `POST /gateway/process` | **`REJECTED`** (IntRef: 1599921890) | `05` | 1.63 s | `Screenshot 2026-10-02 012339.png` |
| **6** | Fondos Insuficientes (XA) | `POST /gateway/process` | **`REJECTED`** (IntRef: 1599921891) | `05` / `XA` | 1.45 s | `Screenshot 2026-10-02 012414.png` |

---

## 🎯 Conclusión
Todas las peticiones ejecutadas en Postman devolvieron códigos HTTP `200 OK` con estructuras JSON formalmente válidas, tiempos de respuesta ágiles (promedio inferior a 1.2 segundos) y validación criptográfica perfecta del `tranKey` en cada intento. La colección [`postman_collection.json`](../../postman_collection.json) queda lista para ser importada y probada por cualquier evaluador técnico.
