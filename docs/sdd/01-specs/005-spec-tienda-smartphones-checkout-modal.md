# Especificación Técnica 005 — Tienda de Smartphones de Gama Alta, Checkout Modal y Simplificación de Pasarela

## 1. Identificación y Control del Documento
- **Código:** SPEC-005
- **Versión:** 1.0.0
- **Fase SDD:** 01-specs
- **Rama Asociada:** `feat/spec-005-tienda-smartphones-checkout-modal`
- **Agentes Asignados:** `Frontend-UX-Architect`, `Integration-Engineer`, `Quality-Agentester`, `Git-Workflow-Guardian`
- **Revisión de Dependencias:** 0 dependencias npm externas añadidas (Stack Nativo Node.js v24).

---

## 2. Catálogo de Smartphones de Gama Alta (12 Productos)
Se define un catálogo interactivo de 12 dispositivos insignia con precios representativos de mercado en Colombia (COP), SKUs únicos, descripciones técnicas e iconos optimizados:

| ID | SKU | Nombre del Smartphone | Almacenamiento / Color | Precio COP |
| :--- | :--- | :--- | :--- | :--- |
| `prod-001` | `APL-IP16PM-256` | Apple iPhone 16 Pro Max | 256 GB / Titanio Desierto | $6.499.000 |
| `prod-002` | `SAM-S24U-512` | Samsung Galaxy S24 Ultra | 512 GB / Titanium Gray | $5.899.000 |
| `prod-003` | `SAM-ZFOLD6-256` | Samsung Galaxy Z Fold6 | 256 GB / Silver Shadow | $7.999.000 |
| `prod-004` | `GGL-PX9PXL-256` | Google Pixel 9 Pro XL | 256 GB / Obsidian | $4.990.000 |
| `prod-005` | `XIA-14U-512` | Xiaomi 14 Ultra Leica | 512 GB / Black Ceramic | $5.199.000 |
| `prod-006` | `HNR-MGK6P-512` | Honor Magic6 Pro | 512 GB / Epi Green | $4.799.000 |
| `prod-007` | `OPL-12-512` | OnePlus 12 Pro Edition | 512 GB / Silky Black | $4.299.000 |
| `prod-008` | `ASU-ROG8P-512` | ASUS ROG Phone 8 Pro | 512 GB / Phantom Black | $5.699.000 |
| `prod-009` | `MOT-ED50U-512` | Motorola Edge 50 Ultra | 512 GB / Nordic Wood | $3.899.000 |
| `prod-010` | `SNY-XP1VI-256` | Sony Xperia 1 VI | 256 GB / Platinum Silver | $5.890.000 |
| `prod-011` | `VIV-X100P-512` | Vivo X100 Pro Zeiss | 512 GB / Asteroid Black | $4.650.000 |
| `prod-012` | `APL-IP16PL-128` | Apple iPhone 16 Plus | 128 GB / Ultramarine | $4.699.000 |

### 2.1. Marcado Semántico JSON-LD Schema.org
El bloque `<script type="application/ld+json">` en `index.html` debe reflejar los 12 smartphones dentro de la lista estructurada `ItemList` con sus respectivos tipos `Product`, `offers`, `price`, `priceCurrency: COP` y `availability: InStock`.

---

## 3. Corrección y Resiliencia del Botón del Carrito (`#cart-toggle-btn`)
- **Problema previo:** El botón podía perder el evento click cuando el usuario interactuaba directamente con los elementos internos hijos (SVG, paths o spans de texto/badge).
- **Especificación:**
  - Aplicar `pointer-events: none;` en los elementos hijos del botón de carrito (`.cart-icon`, `.cart-text`, `.cart-badge`) para asegurar que el evento apunte siempre al elemento interactivo raíz.
  - Asegurar la apertura inmediata del drawer mediante remoción explícita del atributo `hidden` y establecimiento forzado de `style.display = 'flex'`.
  - Asegurar sincronización de accesibilidad con `aria-expanded="true"`, foco en el botón de cierre `#close-cart-btn`, y soporte para tecla `Escape`.

---

## 4. Modal de Checkout Accesible (`#checkout-modal`)
- **Arquitectura:**
  - Se elimina `#checkout-section` del flujo normal del cuerpo principal (`main`).
  - Se implementa el modal `#checkout-modal` acompañado de su overlay oscurecido `#checkout-modal-overlay`.
  - El modal se dispara automáticamente cuando el usuario hace clic en el botón **"Ir a Pagar"** (`#proceed-to-checkout-btn`) desde el drawer del carrito, cerrando el drawer y abriendo el modal con foco en `#buyer-name`.
  - También es accesible mediante el enlace de navegación "Checkout" del header.
- **Campos del Comprador (`buyer`):**
  - Nombre (`buyer-name`)
  - Apellido (`buyer-surname`)
  - Correo Electrónico (`buyer-email`)
  - Teléfono Móvil (`buyer-mobile`)
  - Tipo de Documento (`buyer-doc-type`: CC, CE, NIT, PPN, TI)
  - Número de Documento (`buyer-doc`)
  - Dirección (`buyer-street`)
  - Ciudad (`buyer-city`)
- **Resumen Transaccional en Modal:**
  - Muestra la lista de smartphones en el pedido, cantidades y precios.
  - Desglose de Subtotal, IVA (19%) y Total a Pagar en COP.

---

## 5. Canal Placetopay Transparente (Solo WebCheckout)
- **Regla Inmutable de UX:**
  - El cliente **NO DEBE** elegir el canal de pago.
  - Se eliminan por completo de la interfaz de usuario:
    - El grupo de radio buttons de selección de canal (`paymentChannel`).
    - Las opciones de "API Gateway Directo" y los campos de entrada de número de tarjeta, fecha de expiración, CVV y cuotas.
  - El backend siempre recibe de forma automática `channel: 'WEBCHECKOUT'`.
  - El envío del formulario despacha a `POST /api/checkout/session`.
  - La respuesta exitosa recibe `requestId` y `processUrl`, desplegando la confirmación y el botón oficial de redirección hacia Placetopay WebCheckout: `https://checkout-test.placetopay.com/session/...`.

---

## 6. Historial de Trazabilidad y Modal "Ver Detalle"
- **Navegación:**
  - Se incorpora el botón/enlace **"Historial"** en la barra superior de navegación (`#nav-history-btn`) que desplaza la pantalla a la sección de evidencias transaccionales (`#evidences-section`).
- **Simplificación de la Tabla de Evidencias:**
  - Se eliminan las columnas: `Canal` y `Razón`.
  - Se conserva la estructura limpia de 6 columnas:
    1. **Referencia** (`reference`)
    2. **Estado** (`status`: APROBADO, PENDIENTE, RECHAZADO con badge de color)
    3. **Mensaje Transaccional** (`status_message`)
    4. **Monto COP** (`amount` formateado en moneda colombiana)
    5. **Fecha / Hora** (`created_at` formateado en locale `es-CO`)
    6. **Acción** (Botón "Ver Detalle" `#btn-view-detail`)
- **Modal de Detalle de Compra (`#detail-modal`):**
  - Sustituye la visualización cruda de JSON por un recibo institucional Evertec.
  - Presenta:
    - Encabezado con logo y título: "Comprobante de Transacción — Evertec PayShop".
    - Resumen de la Orden (Referencia, Fecha, Canal interno WebCheckout, Estado con badge).
    - Datos del Pagador (Nombre, Documento, Email, Teléfono, Dirección).
    - Desglose Financiero (Subtotal, Impuestos, Monto Total).
    - Sección técnica colapsable `<details>`: "Inspección Técnica de Auditoría (Payload JSON)", permitiendo al evaluador técnico ver la estructura interna sin ensuciar la UX general.

---

## 7. Criterios de Aceptación Medibles
1. El catálogo de productos contiene exactamente 12 smartphones de alta gama con precios en COP > $3.000.000.
2. El script JSON-LD contiene los 12 smartphones en la colección `ItemList`.
3. El botón `#cart-toggle-btn` despliega el drawer del carrito al ser clickeado.
4. Al hacer clic en "Ir a Pagar", el drawer se cierra y se abre `#checkout-modal`.
5. No existen en la UI selectores de canal ni campos de captura de tarjeta de crédito.
6. El envío del formulario de checkout genera la sesión WebCheckout con `channel: 'WEBCHECKOUT'` y retorna `processUrl`.
7. La tabla de evidencias tiene exactamente 6 columnas (sin `Canal` ni `Razón`).
8. Cada fila cuenta con un botón "Ver Detalle" que abre `#detail-modal` mostrando la información estructurada de la compra.
9. Guardrails verificados al 100% y todos los tests de Agentest 005 en estado `PASS`.
