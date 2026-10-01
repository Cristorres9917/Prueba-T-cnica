---
name: placetopay-auth
description: Procedimiento canónico para la generación de credenciales y cálculo de tranKey en Placetopay WebCheckout y API Gateway.
---

# Placetopay Authentication Skill

Esta skill define el procedimiento criptográfico exacto requerido para autenticar peticiones contra los servicios de Placetopay (WebCheckout y API Gateway).

## Especificación del Algoritmo

Para cada solicitud enviada a Placetopay, se debe generar un objeto `auth` dinámico:

```json
{
  "auth": {
    "login": "<LOGIN_DEL_COMERCIO>",
    "tranKey": "<TRAN_KEY_BASE64>",
    "nonce": "<NONCE_BASE64>",
    "seed": "<FECHA_HORA_ISO8601>"
  }
}
```

### Pasos de Construcción Criptográfica:

1. **Seed:**
   - Cadena de texto con la fecha y hora actual en formato ISO 8601: `new Date().toISOString()`.
2. **Nonce Binario (`rawNonce`):**
   - Un vector de 16 bytes pseudoaleatorios criptográficamente seguros (`crypto.randomBytes(16)`).
3. **Nonce en Base64:**
   - La representación Base64 de dicho vector: `rawNonce.toString('base64')`.
4. **Cálculo de `tranKey`:**
   - Concatenar en binario: `Buffer.concat([rawNonce, Buffer.from(seed, 'utf8'), Buffer.from(secretKey, 'utf8')])`.
   - Calcular el hash `SHA-256` de dicha concatenación binaria.
   - Codificar el digest resultante en `Base64`.

### Implementación Canónica en Node.js (TypeScript/JavaScript):

```javascript
import crypto from 'node:crypto';

export function generatePlacetopayAuth(login, secretKey) {
  const seed = new Date().toISOString();
  const rawNonce = crypto.randomBytes(16);
  const nonce = rawNonce.toString('base64');
  
  const bufferToHash = Buffer.concat([
    rawNonce,
    Buffer.from(seed, 'utf8'),
    Buffer.from(secretKey, 'utf8')
  ]);
  
  const tranKey = crypto.createHash('sha256').update(bufferToHash).digest('base64');
  
  return {
    login,
    tranKey,
    nonce,
    seed
  };
}
```

### Causas Comunes de Errores de Autenticación:
- **Error 102 ("Autenticación fallida"):** Desincronización horaria en el `seed` (> 5-10 minutos de diferencia respecto al servidor), `secretKey` errónea o alteración de la secuencia de concatenación.
- **Error "Autenticación mal formada":** El `nonce` no es un Base64 válido, el `seed` no cumple ISO 8601 o alguno de los 4 campos del objeto `auth` falta o contiene tipos no válidos.
