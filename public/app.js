/**
 * Evertec PayShop — Lógica Reactiva Frontend & Integración Placetopay
 * Metodología: Spec-Driven Development (SDD) | WCAG 2.1 AA Compliant
 */

// 1. Catálogo Oficial de Productos Tecnológicos Evertec
const PRODUCTS = [
  {
    id: 'prod-001',
    sku: 'EVT-POS-001',
    name: 'Terminal POS Evertec SmartPay Pro',
    category: 'Hardware POS',
    price: 350000,
    desc: 'Terminal inteligente de alta velocidad para tarjetas de crédito y débito, pantalla táctil e impresora térmica.',
    icon: `<svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="#FF5900" stroke-width="1.8" aria-hidden="true"><rect x="4" y="2" width="16" height="20" rx="2"></rect><line x1="8" y1="6" x2="16" y2="6"></line><line x1="16" y1="14" x2="16" y2="18"></line><path d="M8 10h.01M12 10h.01M16 10h.01M8 14h.01M12 14h.01M8 18h.01M12 18h.01"></path></svg>`
  },
  {
    id: 'prod-002',
    sku: 'EVT-PIN-002',
    name: 'Lector PinPad Mobile Evertec Contactless',
    category: 'Mobile Payments',
    price: 180000,
    desc: 'Dispositivo ultra-portátil Bluetooth para cobros rápidos con tecnología chip y sin contacto (NFC).',
    icon: `<svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="#0077CC" stroke-width="1.8" aria-hidden="true"><rect x="5" y="2" width="14" height="20" rx="2"></rect><circle cx="12" cy="17" r="1"></circle><path d="M9 6h6M9 10h6"></path></svg>`
  },
  {
    id: 'prod-003',
    sku: 'EVT-GTW-003',
    name: 'Gateway E-Commerce Token Pro (Anual)',
    category: 'Software & API',
    price: 520000,
    desc: 'Integración API Gateway con tokenización segura, módulo antifraude Cybersource y recurrencia.',
    icon: `<svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="#166534" stroke-width="1.8" aria-hidden="true"><circle cx="12" cy="12" r="10"></circle><line x1="2" y1="12" x2="22" y2="12"></line><path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"></path></svg>`
  },
  {
    id: 'prod-004',
    sku: 'EVT-BIO-004',
    name: 'Lector Biométrico de Seguridad Financiera',
    category: 'Seguridad',
    price: 290000,
    desc: 'Lector biométrico de huella dactilar certificado para autenticación reforzada y prevención de suplantación.',
    icon: `<svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="#854D0E" stroke-width="1.8" aria-hidden="true"><path d="M12 2v4M12 18v4M4.93 4.93l2.83 2.83M16.24 16.24l2.83 2.83M2 12h4M18 12h4M4.93 19.07l2.83-2.83M16.24 7.76l2.83-2.83"></path></svg>`
  }
];

// 2. Estado Reactivo del Carrito
class CartState {
  constructor() {
    this.items = [];
    this.loadFromStorage();
  }

  loadFromStorage() {
    try {
      const stored = localStorage.getItem('evt_cart');
      if (stored) {
        this.items = JSON.parse(stored);
      } else {
        // Inicializar con 1 producto para demostración fluida
        this.items = [{ product: PRODUCTS[0], quantity: 1 }];
      }
    } catch (e) {
      this.items = [{ product: PRODUCTS[0], quantity: 1 }];
    }
  }

  saveToStorage() {
    try {
      localStorage.setItem('evt_cart', JSON.stringify(this.items));
    } catch (e) {}
  }

  addItem(productId) {
    const product = PRODUCTS.find(p => p.id === productId);
    if (!product) return;

    const existing = this.items.find(i => i.product.id === productId);
    if (existing) {
      existing.quantity += 1;
    } else {
      this.items.push({ product, quantity: 1 });
    }
    this.saveToStorage();
    this.notify();
  }

  removeItem(productId) {
    this.items = this.items.filter(i => i.product.id !== productId);
    this.saveToStorage();
    this.notify();
  }

  updateQuantity(productId, delta) {
    const item = this.items.find(i => i.product.id === productId);
    if (!item) return;

    item.quantity += delta;
    if (item.quantity <= 0) {
      this.removeItem(productId);
    } else {
      this.saveToStorage();
      this.notify();
    }
  }

  getTotals() {
    const totalItems = this.items.reduce((sum, i) => sum + i.quantity, 0);
    const totalAmount = this.items.reduce((sum, i) => sum + (i.product.price * i.quantity), 0);
    const subtotal = Math.round(totalAmount / 1.19);
    const tax = totalAmount - subtotal;

    return { totalItems, totalAmount, subtotal, tax };
  }

  notify() {
    renderCart();
    renderSummary();
  }
}

const cart = new CartState();

// 3. Formateador de Moneda en Pesos Colombianos (COP)
function formatCOP(amount) {
  return new Intl.NumberFormat('es-CO', {
    style: 'currency',
    currency: 'COP',
    maximumFractionDigits: 0
  }).format(amount);
}

// 4. Algoritmo de Luhn y Detección de Franquicia
function detectCardBrand(number) {
  const clean = number.replace(/\D/g, '');
  if (/^4/.test(clean)) return 'VISA';
  if (/^(5[1-5]|2[2-7])/.test(clean)) return 'MASTERCARD';
  if (/^3[47]/.test(clean)) return 'AMEX';
  if (/^3(0[0-5]|[68])/.test(clean)) return 'DINERS';
  return 'TARJETA';
}

function validateLuhn(number) {
  const clean = number.replace(/\D/g, '');
  if (clean.length < 13) return false;
  let sum = 0;
  let shouldDouble = false;
  for (let i = clean.length - 1; i >= 0; i--) {
    let digit = parseInt(clean.charAt(i), 10);
    if (shouldDouble) {
      digit *= 2;
      if (digit > 9) digit -= 9;
    }
    sum += digit;
    shouldDouble = !shouldDouble;
  }
  return (sum % 10) === 0;
}

// 5. Renderizado del Catálogo de Productos
function renderCatalog() {
  const container = document.getElementById('products-grid');
  if (!container) return;

  container.innerHTML = PRODUCTS.map(product => `
    <article class="product-card" aria-labelledby="title-${product.id}">
      <div class="product-badge-row">
        <span class="sku-tag">${product.sku}</span>
        <span class="stock-tag">En Stock</span>
      </div>
      <div class="product-icon-wrap">
        ${product.icon}
      </div>
      <h3 id="title-${product.id}" class="product-title">${product.name}</h3>
      <p class="product-desc">${product.desc}</p>
      <div class="product-footer">
        <span class="product-price">${formatCOP(product.price)}</span>
        <button class="btn-add-cart" data-id="${product.id}" aria-label="Añadir ${product.name} al carrito por ${formatCOP(product.price)}">
          <span>+ Añadir</span>
        </button>
      </div>
    </article>
  `).join('');

  // Vincular eventos de adición
  container.querySelectorAll('.btn-add-cart').forEach(btn => {
    btn.addEventListener('click', (e) => {
      const prodId = btn.getAttribute('data-id');
      cart.addItem(prodId);
      openCartDrawer();
    });
  });
}

// 6. Renderizado del Carrito Lateral y Resumen
function renderCart() {
  const { totalItems, totalAmount } = cart.getTotals();
  
  // Actualizar Badge del Header
  const badge = document.getElementById('cart-badge');
  const cartBtn = document.getElementById('cart-toggle-btn');
  if (badge) badge.textContent = totalItems;
  if (cartBtn) {
    cartBtn.setAttribute('aria-label', `Abrir carrito de compras. ${totalItems} productos añadidos`);
  }

  // Renderizar Items en Drawer
  const container = document.getElementById('cart-items-container');
  const drawerTotal = document.getElementById('drawer-total-amount');
  if (drawerTotal) drawerTotal.textContent = formatCOP(totalAmount);

  if (!container) return;

  if (cart.items.length === 0) {
    container.innerHTML = '<p class="empty-cart-msg">Tu carrito está vacío.</p>';
    return;
  }

  container.innerHTML = cart.items.map(item => `
    <div class="cart-item-row">
      <div class="cart-item-info">
        <span class="cart-item-title">${item.product.name}</span>
        <div class="cart-item-qty-row">
          <button class="qty-btn btn-qty-dec" data-id="${item.product.id}" aria-label="Reducir cantidad de ${item.product.name}">-</button>
          <span>${item.quantity}</span>
          <button class="qty-btn btn-qty-inc" data-id="${item.product.id}" aria-label="Aumentar cantidad de ${item.product.name}">+</button>
          <button class="btn-remove-item" data-id="${item.product.id}" aria-label="Eliminar ${item.product.name} del carrito">Quitar</button>
        </div>
      </div>
      <span class="cart-item-price">${formatCOP(item.product.price * item.quantity)}</span>
    </div>
  `).join('');

  // Eventos de botones de cantidad y eliminación en drawer
  container.querySelectorAll('.btn-qty-inc').forEach(btn => {
    btn.addEventListener('click', () => cart.updateQuantity(btn.dataset.id, 1));
  });
  container.querySelectorAll('.btn-qty-dec').forEach(btn => {
    btn.addEventListener('click', () => cart.updateQuantity(btn.dataset.id, -1));
  });
  container.querySelectorAll('.btn-remove-item').forEach(btn => {
    btn.addEventListener('click', () => cart.removeItem(btn.dataset.id));
  });
}

function renderSummary() {
  const { totalAmount, subtotal, tax } = cart.getTotals();
  const summaryItems = document.getElementById('summary-items');
  const summarySubtotal = document.getElementById('summary-subtotal');
  const summaryTax = document.getElementById('summary-tax');
  const summaryTotal = document.getElementById('summary-total');
  const btnAmount = document.getElementById('btn-amount');

  if (summarySubtotal) summarySubtotal.textContent = formatCOP(subtotal);
  if (summaryTax) summaryTax.textContent = formatCOP(tax);
  if (summaryTotal) summaryTotal.textContent = formatCOP(totalAmount);
  if (btnAmount) btnAmount.textContent = formatCOP(totalAmount);

  if (!summaryItems) return;

  if (cart.items.length === 0) {
    summaryItems.innerHTML = '<p class="empty-cart-msg">Tu carrito está vacío. Agrega productos desde el catálogo para continuar.</p>';
    return;
  }

  summaryItems.innerHTML = cart.items.map(item => `
    <div class="cart-item-row">
      <div class="cart-item-info">
        <span class="cart-item-title">${item.product.name}</span>
        <span class="field-hint">Cant: ${item.quantity} x ${formatCOP(item.product.price)}</span>
      </div>
      <span class="cart-item-price">${formatCOP(item.product.price * item.quantity)}</span>
    </div>
  `).join('');
}

// 7. Manejo del Drawer y Modales Accesibles
function openCartDrawer() {
  const drawer = document.getElementById('cart-drawer');
  const overlay = document.getElementById('cart-drawer-overlay');
  const toggleBtn = document.getElementById('cart-toggle-btn');
  if (drawer && overlay) {
    drawer.hidden = false;
    overlay.hidden = false;
    drawer.style.display = 'flex';
    overlay.style.display = 'block';
    if (toggleBtn) toggleBtn.setAttribute('aria-expanded', 'true');
    const closeBtn = document.getElementById('close-cart-btn');
    if (closeBtn) closeBtn.focus();
  }
}

function closeCartDrawer() {
  const drawer = document.getElementById('cart-drawer');
  const overlay = document.getElementById('cart-drawer-overlay');
  const toggleBtn = document.getElementById('cart-toggle-btn');
  if (drawer && overlay) {
    drawer.hidden = true;
    overlay.hidden = true;
    drawer.style.display = 'none';
    overlay.style.display = 'none';
    if (toggleBtn) {
      toggleBtn.setAttribute('aria-expanded', 'false');
      toggleBtn.focus();
    }
  }
}

function openPayloadModal(jsonObj) {
  const modal = document.getElementById('payload-modal');
  const overlay = document.getElementById('payload-modal-overlay');
  const content = document.getElementById('modal-json-content');
  if (modal && overlay && content) {
    content.textContent = typeof jsonObj === 'string' ? jsonObj : JSON.stringify(jsonObj, null, 2);
    modal.hidden = false;
    overlay.hidden = false;
    modal.style.display = 'flex';
    overlay.style.display = 'block';
    const closeBtn = document.getElementById('close-modal-btn');
    if (closeBtn) closeBtn.focus();
  }
}

function closePayloadModal() {
  const modal = document.getElementById('payload-modal');
  const overlay = document.getElementById('payload-modal-overlay');
  if (modal && overlay) {
    modal.hidden = true;
    overlay.hidden = true;
    modal.style.display = 'none';
    overlay.style.display = 'none';
  }
}

// 8. Carga y Filtros del Tablero de Evidencias Transaccionales
async function loadEvidences(filter = 'ALL') {
  const tbody = document.getElementById('evidences-tbody');
  if (!tbody) return;

  tbody.innerHTML = '<tr><td colspan="8" style="text-align:center; padding:1.5rem;">Cargando evidencias desde SQLite...</td></tr>';

  try {
    const url = filter === 'ALL' ? '/api/transactions/evidences' : `/api/transactions/evidences?status=${filter}`;
    const res = await fetch(url);
    const data = await res.json();

    if (!data.success || !data.transactions) {
      tbody.innerHTML = '<tr><td colspan="8" style="text-align:center; color:#991B1B;">Error al consultar SQLite</td></tr>';
      return;
    }

    const txs = data.transactions;

    // Actualizar contadores si la llamada es completa
    if (filter === 'ALL') {
      const allCount = txs.length;
      const appCount = txs.filter(t => t.status === 'APPROVED').length;
      const penCount = txs.filter(t => t.status === 'PENDING').length;
      const rejCount = txs.filter(t => t.status === 'REJECTED' || t.status === 'FAILED').length;

      const cAll = document.getElementById('count-all');
      const cApp = document.getElementById('count-approved');
      const cPen = document.getElementById('count-pending');
      const cRej = document.getElementById('count-rejected');
      if (cAll) cAll.textContent = allCount;
      if (cApp) cApp.textContent = appCount;
      if (cPen) cPen.textContent = penCount;
      if (cRej) cRej.textContent = rejCount;
    }

    if (txs.length === 0) {
      tbody.innerHTML = '<tr><td colspan="8" style="text-align:center; padding:1.5rem; color:#64748B;">No hay transacciones registradas con este filtro.</td></tr>';
      return;
    }

    tbody.innerHTML = txs.map(tx => {
      const dateStr = new Date(tx.created_at).toLocaleString('es-CO');
      const payloadSafe = JSON.stringify(tx.raw_payload || {}).replace(/'/g, '&apos;');
      return `
        <tr>
          <td><strong>${tx.reference}</strong></td>
          <td><span class="sku-tag">${tx.channel}</span></td>
          <td><span class="status-badge status-${tx.status}">${tx.status}</span></td>
          <td><code>${tx.status_reason || 'N/A'}</code></td>
          <td>${tx.status_message || 'Transacción procesada'}</td>
          <td><strong>${formatCOP(tx.amount)}</strong></td>
          <td style="font-size:0.8rem; color:#64748B;">${dateStr}</td>
          <td>
            <button class="btn btn-secondary btn-sm btn-view-payload" data-payload='${payloadSafe}' aria-label="Ver payload JSON de transacción ${tx.reference}">
              Ver JSON
            </button>
          </td>
        </tr>
      `;
    }).join('');

    // Asignar eventos de apertura de modal
    tbody.querySelectorAll('.btn-view-payload').forEach(btn => {
      btn.addEventListener('click', () => {
        try {
          const raw = JSON.parse(btn.getAttribute('data-payload'));
          openPayloadModal(raw);
        } catch (e) {
          openPayloadModal(btn.getAttribute('data-payload'));
        }
      });
    });

  } catch (err) {
    console.error('[EVIDENCES LOAD ERROR]', err);
    tbody.innerHTML = '<tr><td colspan="8" style="text-align:center; color:#991B1B;">Error de conexión con el servidor</td></tr>';
  }
}

// 9. Manejador del Formulario de Pago
function initCheckoutForm() {
  const form = document.getElementById('checkout-form');
  const channelInputs = document.querySelectorAll('input[name="paymentChannel"]');
  const gatewayFields = document.getElementById('gateway-card-fields');
  const cardNumberInput = document.getElementById('card-number');
  const cardExpInput = document.getElementById('card-exp');
  const cardBrandBadge = document.getElementById('card-brand-badge');
  const feedback = document.getElementById('checkout-feedback');
  const submitBtn = document.getElementById('submit-pay-btn');
  const spinner = document.getElementById('btn-spinner');
  const btnText = document.getElementById('btn-text');

  // Alternar entre WebCheckout y Gateway Directo
  channelInputs.forEach(radio => {
    radio.addEventListener('change', () => {
      document.querySelectorAll('.channel-card').forEach(c => c.classList.remove('active'));
      const parentLabel = radio.closest('.channel-card');
      if (parentLabel) parentLabel.classList.add('active');

      if (radio.value === 'GATEWAY_DIRECT') {
        gatewayFields.hidden = false;
      } else {
        gatewayFields.hidden = true;
      }
    });
  });

  // Formateador y Detección de Tarjeta
  if (cardNumberInput) {
    cardNumberInput.addEventListener('input', (e) => {
      let val = e.target.value.replace(/\D/g, '').substring(0, 16);
      const brand = detectCardBrand(val);
      if (cardBrandBadge) cardBrandBadge.textContent = brand;

      // Formatear bloques de 4 dígitos
      const formatted = val.match(/.{1,4}/g)?.join(' ') || val;
      e.target.value = formatted;
    });
  }

  // Formateador de Fecha de Expiración (MM/YY)
  if (cardExpInput) {
    cardExpInput.addEventListener('input', (e) => {
      let val = e.target.value.replace(/\D/g, '').substring(0, 4);
      if (val.length >= 3) {
        val = val.substring(0, 2) + '/' + val.substring(2);
      }
      e.target.value = val;
    });
  }

  // Procesamiento del Formulario
  if (form) {
    form.addEventListener('submit', async (e) => {
      e.preventDefault();
      feedback.innerHTML = '';

      const { totalAmount } = cart.getTotals();
      if (totalAmount <= 0) {
        feedback.innerHTML = '<div class="alert-box alert-danger">Debes agregar al menos un producto al carrito para realizar el pago.</div>';
        return;
      }

      // Validar datos de comprador
      const buyerName = document.getElementById('buyer-name').value.trim();
      const buyerSurname = document.getElementById('buyer-surname').value.trim();
      const buyerEmail = document.getElementById('buyer-email').value.trim();
      const buyerMobile = document.getElementById('buyer-mobile').value.trim();
      const buyerDocType = document.getElementById('buyer-doc-type').value;
      const buyerDoc = document.getElementById('buyer-doc').value.trim();
      const buyerStreet = document.getElementById('buyer-street').value.trim();
      const buyerCity = document.getElementById('buyer-city').value.trim();
      const channel = document.querySelector('input[name="paymentChannel"]:checked').value;

      if (!buyerName || !buyerSurname || !buyerEmail || !buyerMobile || !buyerDoc) {
        feedback.innerHTML = '<div class="alert-box alert-danger">Por favor completa todos los campos obligatorios del comprador marcados con asterisco (*).</div>';
        return;
      }

      // Referencia única de transacción
      const reference = 'ORD-' + Date.now();

      // Construcción del Contrato Base
      const contractPayload = {
        buyer: {
          name: buyerName,
          surname: buyerSurname,
          email: buyerEmail,
          documentType: buyerDocType,
          document: buyerDoc,
          mobile: buyerMobile,
          address: {
            street: buyerStreet || 'Calle Principal # 1-1',
            city: buyerCity || 'Bogotá'
          }
        },
        payment: {
          reference: reference,
          description: `Compra en Evertec PayShop (${cart.items.length} productos)`,
          amount: totalAmount,
          currency: 'COP',
          items: cart.items.map(i => ({
            sku: i.product.sku,
            name: i.product.name,
            qty: i.quantity,
            price: i.product.price
          }))
        },
        channel: channel
      };

      // Si es Gateway Directo, anexar datos de tarjeta
      if (channel === 'GATEWAY_DIRECT') {
        const rawCardNum = (cardNumberInput ? cardNumberInput.value : '').replace(/\s+/g, '');
        const rawExp = cardExpInput ? cardExpInput.value : '';
        const rawCvv = document.getElementById('card-cvv').value.trim();
        const installments = parseInt(document.getElementById('card-installments').value, 10) || 1;

        if (!rawCardNum || rawCardNum.length < 13) {
          feedback.innerHTML = '<div class="alert-box alert-danger">El número de tarjeta ingresado no es válido.</div>';
          return;
        }

        const expParts = rawExp.split('/');
        contractPayload.card = {
          number: rawCardNum,
          expirationMonth: expParts[0] || '12',
          expirationYear: expParts[1] ? '20' + expParts[1] : '2028',
          cvv: rawCvv || '123',
          installments: installments,
          brand: detectCardBrand(rawCardNum)
        };
      }

      // Estado de carga en botón
      submitBtn.disabled = true;
      spinner.hidden = false;
      btnText.textContent = 'Procesando con Placetopay...';

      try {
        if (channel === 'WEBCHECKOUT') {
          // Flujo WebCheckout Placetopay
          const res = await fetch('/api/checkout/session', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(contractPayload)
          });
          const result = await res.json();

          if (result.success && result.processUrl) {
            feedback.innerHTML = `
              <div class="alert-box alert-warning">
                <strong>Sesión WebCheckout Creada Exitosamente (RequestId: ${result.requestId})</strong>
                <p>Estado de sesión: <strong>PENDIENTE</strong>. Placetopay ha generado la URL de redirección transaccional.</p>
                <div style="margin-top:0.85rem; display:flex; gap:0.75rem; flex-wrap:wrap;">
                  <a href="${result.processUrl}" target="_blank" rel="noopener noreferrer" class="btn btn-primary btn-sm">
                    Ir a la Pasarela Oficial de Placetopay &rarr;
                  </a>
                  <button type="button" class="btn btn-secondary btn-sm" onclick="checkWebcheckoutStatus(${result.requestId})">
                    Consultar Estado de Sesión
                  </button>
                </div>
              </div>
            `;
          } else {
            feedback.innerHTML = `<div class="alert-box alert-danger"><strong>Error WebCheckout:</strong> ${result.error || 'No se pudo generar la sesión de pago.'}</div>`;
          }

        } else {
          // Flujo API Gateway Directo
          const res = await fetch('/api/checkout/gateway', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(contractPayload)
          });
          const result = await res.json();

          if (result.status === 'APPROVED') {
            feedback.innerHTML = `
              <div class="alert-box alert-success">
                <strong>🎉 ¡Transacción Aprobada Exitosamente!</strong>
                <p>Referencia: <strong>${result.reference}</strong> | Código de Autorización: <strong>${result.authorizationCode}</strong> | Recibo: <strong>${result.receipt}</strong></p>
                <p>Persistida en la base de datos relacional SQLite.</p>
              </div>
            `;
          } else if (result.status === 'PENDING') {
            feedback.innerHTML = `
              <div class="alert-box alert-warning">
                <strong>⏳ Transacción en Proceso / Pendiente</strong>
                <p>Código: <code>${result.statusReason}</code> | Mensaje: <em>${result.statusMessage}</em></p>
                <p>La red financiera está verificando los fondos asíncronamente.</p>
              </div>
            `;
          } else {
            feedback.innerHTML = `
              <div class="alert-box alert-danger">
                <strong>❌ Transacción Declinada / Rechazada</strong>
                <p>Código de Rechazo: <code>${result.statusReason}</code></p>
                <p>Causal: <strong>${result.statusMessage}</strong></p>
                <p class="field-hint">Tip: Esta declinación ha sido debidamente catalogada y registrada en SQLite para auditoría.</p>
              </div>
            `;
          }
        }

        // Recargar visor de evidencias inmediatamente
        await loadEvidences('ALL');

      } catch (err) {
        console.error('[CHECKOUT SUBMIT ERROR]', err);
        feedback.innerHTML = `<div class="alert-box alert-danger">Error al conectar con la pasarela: ${err.message}</div>`;
      } finally {
        submitBtn.disabled = false;
        spinner.hidden = true;
        btnText.innerHTML = `Pagar <strong id="btn-amount">${formatCOP(totalAmount)}</strong>`;
      }
    });
  }
}

// 10. Función Global para Consultar Estado de WebCheckout
window.checkWebcheckoutStatus = async function(requestId) {
  try {
    const res = await fetch(`/api/checkout/status/${requestId}`);
    const data = await res.json();
    openPayloadModal(data);
    await loadEvidences('ALL');
  } catch (e) {
    alert('Error al consultar estado: ' + e.message);
  }
};

// 11. Inicialización en el Carga del DOM
document.addEventListener('DOMContentLoaded', () => {
  // Asegurar que drawer y modal inicien cerrados
  closeCartDrawer();
  closePayloadModal();

  renderCatalog();
  renderCart();
  renderSummary();
  initCheckoutForm();
  loadEvidences('ALL');

  // Eventos de Drawer del Carrito
  const cartToggleBtn = document.getElementById('cart-toggle-btn');
  const closeCartBtn = document.getElementById('close-cart-btn');
  const cartOverlay = document.getElementById('cart-drawer-overlay');
  const proceedBtn = document.getElementById('proceed-to-checkout-btn');

  if (cartToggleBtn) cartToggleBtn.addEventListener('click', openCartDrawer);
  if (closeCartBtn) closeCartBtn.addEventListener('click', closeCartDrawer);
  if (cartOverlay) cartOverlay.addEventListener('click', closeCartDrawer);
  if (proceedBtn) {
    proceedBtn.addEventListener('click', () => {
      closeCartDrawer();
      const checkoutSection = document.getElementById('checkout-section');
      if (checkoutSection) {
        checkoutSection.scrollIntoView({ behavior: 'smooth' });
        const firstInput = document.getElementById('buyer-name');
        if (firstInput) firstInput.focus();
      }
    });
  }

  // Eventos de Modal de Payload
  const closeModalBtn = document.getElementById('close-modal-btn');
  const modalOverlay = document.getElementById('payload-modal-overlay');
  if (closeModalBtn) closeModalBtn.addEventListener('click', closePayloadModal);
  if (modalOverlay) modalOverlay.addEventListener('click', closePayloadModal);

  // Cerrar Drawer y Modal con tecla ESC
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
      closeCartDrawer();
      closePayloadModal();
    }
  });

  // Filtros del Visor de Evidencias
  document.querySelectorAll('.filter-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      document.querySelectorAll('.filter-btn').forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      const filter = btn.getAttribute('data-filter');
      loadEvidences(filter);
    });
  });

  // Botón de Actualizar Evidencias
  const refreshBtn = document.getElementById('refresh-evidences-btn');
  if (refreshBtn) {
    refreshBtn.addEventListener('click', () => {
      const activeFilter = document.querySelector('.filter-btn.active')?.getAttribute('data-filter') || 'ALL';
      loadEvidences(activeFilter);
    });
  }
});
