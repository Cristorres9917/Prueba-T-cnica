# Intent 003: Arquitectura Transaccional Backend, Contratos de Datos para Mockup MVP y Persistencia SQLite

## 1. Declaración de Intención
Establecer la arquitectura del backend transaccional y definir los contratos de datos necesarios para alimentar el mockup del formulario de pago y carrito (MVP), consumiendo los servicios de **WebCheckout** y **API Gateway** de Placetopay (Evertec) y persistiendo el ciclo de vida en una base de datos relacional **SQLite**. 

Este hito proporciona la especificación exacta de qué datos solicita y responde el backend, sirviendo de puente directo hacia la interfaz visual (tienda/mockup) y asegurando las evidencias exigidas por la prueba técnica para los estados **Aprobado**, **Pendiente** y **Rechazado**.

---

## 2. Problema y Necesidad
1. **Desalineación entre Frontend y Pasarela:** Para construir un mockup/MVP funcional y realista, el frontend debe conocer con precisión milimétrica los campos que exige Placetopay (datos del comprador, montos, referencias, URLs de retorno) y qué datos recibirá de vuelta (`processUrl`, `requestId`, estados de transacción).
2. **Consumo Dual de Servicios:** La prueba técnica solicita documentar y consumir tanto **WebCheckout** (`https://checkout-test.placetopay.com/`) como **API Gateway** (`https://api-test.placetopay.com/rest`). El backend debe encapsular ambos canales de manera transparente y desacoplada.
3. **Persistencia Relacional y Evidencias:** La prueba exige evidenciar los tres estados transaccionales finales (Aprobado, Pendiente, Rechazado). Se requiere un esquema en SQLite que registre sesiones, transacciones y logs de auditoría sin depender de archivos temporales dispersos.
4. **Foco en el Entregable:** Este spec no es solo un resumen teórico; es la especificación técnica viva que define los modelos de datos, validadores y endpoints para el MVP de la prueba técnica.

---

## 3. Metas del Hito 003
- [ ] Definir el diccionario completo de datos del mockup (datos del pagador `buyer`, datos de la orden `payment`, configuración de pasarela).
- [ ] Definir los contratos de API del Backend (WebCheckout session create & query, API Gateway direct process, evidencias).
- [ ] Diseñar el modelo relacional DDL de SQLite para sesiones, transacciones y trazabilidad (`audit_logs`).
- [ ] Formalizar la estrategia técnica para la captura y demostración de los tres estados: Aprobado, Pendiente y Rechazado.
- [ ] Establecer el suite de Agentest 003 para verificar la validez de los contratos y la persistencia antes de la entrega.

---

## 4. Criterios de Éxito
- La especificación describe exhaustivamente los tipos, longitudes, obligatoriedad y ejemplos de cada campo del formulario de pago/mockup.
- Los endpoints del backend para WebCheckout y Gateway quedan documentados con sus contratos de entrada y salida JSON.
- El esquema SQLite garantiza integridad referencial y almacenamiento de payloads crudos para auditoría.
- La suite de Agentest 003 valida la coherencia criptográfica y contratos de datos.
