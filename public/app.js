/**
 * Evertec PayShop — Lógica Reactiva Frontend & Integración Placetopay
 * Metodología: Spec-Driven Development (SDD) | WCAG 2.1 AA Compliant
 * Spec-05: Tienda de Smartphones de Gama Alta, Checkout Modal y WebCheckout Transparente
 */

// 1. Catálogo Oficial de 12 Smartphones de Gama Alta con Fotos Reales y Precios COP
const PRODUCTS = [
  {
    id: 'prod-001',
    sku: 'APL-IP16PM-256',
    name: 'Apple iPhone 16 Pro Max',
    category: 'iOS Flagship',
    price: 6499000,
    desc: '256 GB, Titanio del Desierto, Pantalla Super Retina XDR 6.9", Chip A18 Pro y Cámara Fusion 48MP.',
    image: 'https://upload.wikimedia.org/wikipedia/commons/e/e2/IPhone_16_Pro_Max_Desert_Titanium_Rear.png',
    icon: `<svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="#FF5900" stroke-width="1.8" aria-hidden="true"><rect x="5" y="2" width="14" height="20" rx="3"></rect><circle cx="12" cy="5" r="0.75" fill="#FF5900"></circle><line x1="10" y1="20" x2="14" y2="20" stroke-linecap="round"></line><rect x="7" y="6" width="10" height="11" rx="1" fill="#FF5900" fill-opacity="0.08"></rect></svg>`
  },
  {
    id: 'prod-002',
    sku: 'SAM-S24U-512',
    name: 'Samsung Galaxy S24 Ultra',
    category: 'Android Flagship',
    price: 5899000,
    desc: '512 GB, Titanium Gray, Pantalla Dynamic AMOLED 2X 6.8", Snapdragon 8 Gen 3 y Galaxy AI.',
    image: 'https://upload.wikimedia.org/wikipedia/commons/e/ed/Samsung_S24_Ultra_Phone.png',
    icon: `<svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="#0077CC" stroke-width="1.8" aria-hidden="true"><rect x="5" y="2" width="14" height="20" rx="2"></rect><circle cx="12" cy="4.5" r="0.6" fill="#0077CC"></circle><line x1="8" y1="20" x2="16" y2="20"></line><circle cx="16" cy="18" r="0.75" fill="#0077CC"></circle></svg>`
  },
  {
    id: 'prod-003',
    sku: 'SAM-ZFOLD6-256',
    name: 'Samsung Galaxy Z Fold6',
    category: 'Plegable Premium',
    price: 7999000,
    desc: '256 GB, Silver Shadow, Pantalla Plegable 7.6" Dynamic AMOLED 120Hz y Bisagra Armor Aluminum.',
    image: 'https://images.unsplash.com/photo-1580910051074-3eb694886505?auto=format&fit=crop&w=600&q=80',
    icon: `<svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="#0B192C" stroke-width="1.8" aria-hidden="true"><rect x="3" y="3" width="8" height="18" rx="1.5"></rect><rect x="13" y="3" width="8" height="18" rx="1.5"></rect><line x1="11" y1="4" x2="11" y2="20" stroke="#FF5900" stroke-width="1.5"></line></svg>`
  },
  {
    id: 'prod-004',
    sku: 'GGL-PX9PXL-256',
    name: 'Google Pixel 9 Pro XL',
    category: 'AI Phone',
    price: 4990000,
    desc: '256 GB, Obsidian, Pantalla Super Actua 6.8", Procesador Google Tensor G4 y Gemini Nano con IA nativa.',
    image: 'https://images.unsplash.com/photo-1598327105666-5b89351aff97?auto=format&fit=crop&w=600&q=80',
    icon: `<svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="#166534" stroke-width="1.8" aria-hidden="true"><rect x="5" y="2" width="14" height="20" rx="3"></rect><rect x="6" y="5" width="12" height="3" rx="1.5" fill="#166534" fill-opacity="0.15"></rect><circle cx="9" cy="6.5" r="0.7" fill="#166534"></circle><circle cx="12" cy="6.5" r="0.7" fill="#166534"></circle></svg>`
  },
  {
    id: 'prod-005',
    sku: 'XIA-14U-512',
    name: 'Xiaomi 14 Ultra Leica',
    category: 'Fotografía Pro',
    price: 5199000,
    desc: '512 GB, Black Ceramic, Sensor de 1 pulgada Leica Quad 50MP, Snapdragon 8 Gen 3 y Carga 90W.',
    image: 'https://images.unsplash.com/photo-1511707171634-5f897ff02560?auto=format&fit=crop&w=600&q=80',
    icon: `<svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="#D97706" stroke-width="1.8" aria-hidden="true"><rect x="5" y="2" width="14" height="20" rx="3"></rect><circle cx="12" cy="9" r="4" stroke="#D97706" stroke-width="1.5"></circle><circle cx="12" cy="9" r="1.5" fill="#D97706"></circle></svg>`
  },
  {
    id: 'prod-006',
    sku: 'HNR-MGK6P-512',
    name: 'Honor Magic6 Pro',
    category: 'Android Flagship',
    price: 4799000,
    desc: '512 GB, Epi Green, Cámara Telefoto 180MP, Pantalla LTPO Curved 5000 nits y Batería 5600mAh.',
    image: 'https://images.unsplash.com/photo-1565849904461-04a58ad377e0?auto=format&fit=crop&w=600&q=80',
    icon: `<svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="#059669" stroke-width="1.8" aria-hidden="true"><rect x="5" y="2" width="14" height="20" rx="3"></rect><circle cx="12" cy="8.5" r="3.2" stroke="#059669"></circle><path d="M10 8h4M12 6v4" stroke="#059669"></path></svg>`
  },
  {
    id: 'prod-007',
    sku: 'OPL-12-512',
    name: 'OnePlus 12 Pro Edition',
    category: 'Rendimiento Puro',
    price: 4299000,
    desc: '512 GB, Silky Black, Pantalla 2K ProXDR 120Hz, Hasselblad Gen 4 y Carga 100W SUPERVOOC.',
    image: 'https://images.unsplash.com/photo-1546868871-7041f2a55e12?auto=format&fit=crop&w=600&q=80',
    icon: `<svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="#DC2626" stroke-width="1.8" aria-hidden="true"><rect x="5" y="2" width="14" height="20" rx="3"></rect><path d="M7 6h10v10H7z" stroke-dasharray="1.5 1.5"></path><circle cx="12" cy="11" r="2.5"></circle></svg>`
  },
  {
    id: 'prod-008',
    sku: 'ASU-ROG8P-512',
    name: 'ASUS ROG Phone 8 Pro',
    category: 'Gaming Flagship',
    price: 5699000,
    desc: '512 GB, Phantom Black, Pantalla AMOLED 165Hz, Sistema GameCool 8 y Botones AirTrigger.',
    image: 'https://images.unsplash.com/photo-1533228896884-6a8f9312804b?auto=format&fit=crop&w=600&q=80',
    icon: `<svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="#7C3AED" stroke-width="1.8" aria-hidden="true"><rect x="5" y="2" width="14" height="20" rx="3"></rect><path d="M8 8l4 4-4 4M16 8l-4 4 4 4" stroke-linecap="round"></path></svg>`
  },
  {
    id: 'prod-009',
    sku: 'MOT-ED50U-512',
    name: 'Motorola Edge 50 Ultra',
    category: 'Diseño Exclusivo',
    price: 3899000,
    desc: '512 GB, Nordic Wood en madera real, Pantalla pOLED 144Hz, Moto AI y Cámara Teleobjetivo 64MP.',
    image: 'https://images.unsplash.com/photo-1574944985070-8f3ebc6b79d2?auto=format&fit=crop&w=600&q=80',
    icon: `<svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="#9A3412" stroke-width="1.8" aria-hidden="true"><rect x="5" y="2" width="14" height="20" rx="3"></rect><line x1="8" y1="7" x2="16" y2="7"></line><line x1="8" y1="11" x2="16" y2="11"></line><line x1="8" y1="15" x2="14" y2="15"></line></svg>`
  },
  {
    id: 'prod-010',
    sku: 'SNY-XP1VI-256',
    name: 'Sony Xperia 1 VI',
    category: 'Cinematografía',
    price: 5890000,
    desc: '256 GB, Platinum Silver, Zoom Óptico Continuo 85-170mm, Pantalla OLED BRAVIA Engine y Audio Hi-Res.',
    image: 'https://images.unsplash.com/photo-1585060544812-6b45742d762f?auto=format&fit=crop&w=600&q=80',
    icon: `<svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="#4B5563" stroke-width="1.8" aria-hidden="true"><rect x="6" y="2" width="12" height="20" rx="2"></rect><circle cx="12" cy="7" r="1.5"></circle><circle cx="12" cy="11" r="1.5"></circle><circle cx="12" cy="15" r="1.5"></circle></svg>`
  },
  {
    id: 'prod-011',
    sku: 'VIV-X100P-512',
    name: 'Vivo X100 Pro Zeiss',
    category: 'Fotografía Pro',
    price: 4650000,
    desc: '512 GB, Asteroid Black, Óptica ZEISS APO Telefoto, Chip de Imagen V3 y MediaTek Dimensity 9300.',
    image: 'https://images.unsplash.com/photo-1592899677977-9c10ca588bbd?auto=format&fit=crop&w=600&q=80',
    icon: `<svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="#0284C7" stroke-width="1.8" aria-hidden="true"><rect x="5" y="2" width="14" height="20" rx="3"></rect><circle cx="12" cy="8" r="3"></circle><circle cx="12" cy="8" r="1" fill="#0284C7"></circle></svg>`
  },
  {
    id: 'prod-012',
    sku: 'APL-IP16PL-128',
    name: 'Apple iPhone 16 Plus',
    category: 'iOS Flagship',
    price: 4699000,
    desc: '128 GB, Ultramarine, Pantalla Super Retina XDR OLED 6.7", Control de Cámara háptico y Chip A18.',
    image: 'https://images.unsplash.com/photo-1510557880182-3d4d3cba35a5?auto=format&fit=crop&w=600&q=80',
    icon: `<svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="#2563EB" stroke-width="1.8" aria-hidden="true"><rect x="5" y="2" width="14" height="20" rx="3"></rect><circle cx="12" cy="5" r="0.75" fill="#2563EB"></circle><rect x="8" y="7" width="8" height="10" rx="1.5" stroke="#2563EB" stroke-width="1.2"></rect></svg>`
  }
];

// 2. Estado Reactivo del Carrito de Compras
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
        // Inicializar con el primer smartphone de alta gama
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

// 4. Renderizado del Catálogo de 12 Smartphones con Botones Uniformes
function renderCatalog() {
  const container = document.getElementById('products-grid');
  if (!container) return;

  container.innerHTML = PRODUCTS.map(product => `
    <article class="product-card" aria-labelledby="title-${product.id}">
      <div class="product-badge-row">
        <span class="sku-tag">${product.sku}</span>
        <span class="category-tag">${product.category}</span>
      </div>
      <div class="product-image-wrap">
        <img src="${product.image}" alt="${product.name}" class="product-real-img" loading="lazy" onerror="this.style.display='none'; this.nextElementSibling.style.display='flex';">
        <div class="product-icon-wrap" style="display:none;" aria-hidden="true">
          ${product.icon}
        </div>
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
    btn.addEventListener('click', () => {
      const prodId = btn.getAttribute('data-id');
      cart.addItem(prodId);
      openCartDrawer();
    });
  });
}

// 5. Renderizado del Carrito Lateral y Sincronización con Modal de Checkout
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

  if (container) {
    if (cart.items.length === 0) {
      container.innerHTML = '<p class="empty-cart-msg">Tu carrito está vacío.</p>';
    } else {
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
  }

  // Sincronizar Resumen en Modal de Checkout
  const modalCartCount = document.getElementById('modal-cart-count');
  const modalSummaryTotal = document.getElementById('modal-summary-total');
  const modalSummaryItems = document.getElementById('modal-summary-items');
  const btnAmount = document.getElementById('btn-amount');

  if (modalCartCount) modalCartCount.textContent = totalItems;
  if (modalSummaryTotal) modalSummaryTotal.textContent = formatCOP(totalAmount);
  if (btnAmount) btnAmount.textContent = formatCOP(totalAmount);

  if (modalSummaryItems) {
    if (cart.items.length === 0) {
      modalSummaryItems.innerHTML = '<p class="empty-cart-msg">No hay productos seleccionados.</p>';
    } else {
      modalSummaryItems.innerHTML = cart.items.map(item => `
        <div class="modal-summary-item-row">
          <span class="modal-item-name">${item.quantity}x ${item.product.name}</span>
          <span class="modal-item-price">${formatCOP(item.product.price * item.quantity)}</span>
        </div>
      `).join('');
    }
  }
}

// 6. Manejo Seguro de Drawer y Modales Accesibles
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
    }
  }
}

function openCheckoutModal() {
  closeCartDrawer();
  closeHistoryModal();
  const modal = document.getElementById('checkout-modal');
  const overlay = document.getElementById('checkout-modal-overlay');
  if (modal && overlay) {
    modal.hidden = false;
    overlay.hidden = false;
    modal.style.display = 'flex';
    overlay.style.display = 'block';
    const firstInput = document.getElementById('buyer-name');
    if (firstInput) firstInput.focus();
  }
}

function closeCheckoutModal() {
  const modal = document.getElementById('checkout-modal');
  const overlay = document.getElementById('checkout-modal-overlay');
  if (modal && overlay) {
    modal.hidden = true;
    overlay.hidden = true;
    modal.style.display = 'none';
    overlay.style.display = 'none';
  }
}

// Modal de Historial y Evidencias Transaccionales (SQLite)
function openHistoryModal() {
  closeCartDrawer();
  closeCheckoutModal();
  loadEvidences('ALL');
  const modal = document.getElementById('history-modal');
  const overlay = document.getElementById('history-modal-overlay');
  if (modal && overlay) {
    modal.hidden = false;
    overlay.hidden = false;
    modal.style.display = 'flex';
    overlay.style.display = 'block';
    const closeBtn = document.getElementById('close-history-modal-btn');
    if (closeBtn) closeBtn.focus();
  }
}

function closeHistoryModal() {
  const modal = document.getElementById('history-modal');
  const overlay = document.getElementById('history-modal-overlay');
  if (modal && overlay) {
    modal.hidden = true;
    overlay.hidden = true;
    modal.style.display = 'none';
    overlay.style.display = 'none';
  }
}

// Modal "Ver Detalle" (Recibo de Compra Estructurado)
function openDetailModal(tx) {
  const modal = document.getElementById('detail-modal');
  const overlay = document.getElementById('detail-modal-overlay');
  const body = document.getElementById('detail-modal-body');
  if (!modal || !overlay || !body) return;

  const dateStr = new Date(tx.created_at).toLocaleString('es-CO', {
    dateStyle: 'full',
    timeStyle: 'medium'
  });

  const raw = tx.raw_payload || {};
  const buyer = raw.buyer || {};
  const payment = raw.payment || {};
  const items = payment.items || [];

  const subtotal = Math.round(tx.amount / 1.19);
  const tax = tx.amount - subtotal;

  body.innerHTML = `
    <div class="receipt-card">
      <div class="receipt-header-row">
        <div>
          <span class="receipt-label">Referencia de Orden</span>
          <h4 class="receipt-ref">${tx.reference}</h4>
        </div>
        <span class="status-badge status-${tx.status}">${tx.status}</span>
      </div>

      <div class="receipt-section">
        <h5 class="receipt-section-title">Información Transaccional</h5>
        <div class="receipt-grid">
          <div class="receipt-field">
            <span class="field-title">Fecha y Hora:</span>
            <span class="field-value">${dateStr}</span>
          </div>
          <div class="receipt-field">
            <span class="field-title">Canal de Pago:</span>
            <span class="field-value">Placetopay WebCheckout</span>
          </div>
          <div class="receipt-field">
            <span class="field-title">Estado Placetopay:</span>
            <span class="field-value">${tx.status_message || 'Transacción procesada'}</span>
          </div>
          <div class="receipt-field">
            <span class="field-title">ID de Sesión:</span>
            <span class="field-value"><code>${tx.session_id || 'N/A'}</code></span>
          </div>
        </div>
      </div>

      <div class="receipt-section">
        <h5 class="receipt-section-title">Datos del Pagador</h5>
        <div class="receipt-grid">
          <div class="receipt-field">
            <span class="field-title">Nombre Completo:</span>
            <span class="field-value">${buyer.name || 'Cliente'} ${buyer.surname || ''}</span>
          </div>
          <div class="receipt-field">
            <span class="field-title">Documento:</span>
            <span class="field-value">${buyer.documentType || 'CC'} ${buyer.document || 'N/A'}</span>
          </div>
          <div class="receipt-field">
            <span class="field-title">Correo Electrónico:</span>
            <span class="field-value">${buyer.email || 'N/A'}</span>
          </div>
          <div class="receipt-field">
            <span class="field-title">Teléfono Móvil:</span>
            <span class="field-value">${buyer.mobile || 'N/A'}</span>
          </div>
        </div>
      </div>

      ${items.length > 0 ? `
        <div class="receipt-section">
          <h5 class="receipt-section-title">Artículos Comprados (${items.length})</h5>
          <div class="receipt-items-list">
            ${items.map(it => `
              <div class="receipt-item-row">
                <span>${it.qty || 1}x ${it.name} (${it.sku})</span>
                <strong>${formatCOP(it.price * (it.qty || 1))}</strong>
              </div>
            `).join('')}
          </div>
        </div>
      ` : ''}

      <div class="receipt-totals-box">
        <div class="receipt-total-row">
          <span>Subtotal:</span>
          <span>${formatCOP(subtotal)}</span>
        </div>
        <div class="receipt-total-row">
          <span>IVA (19%):</span>
          <span>${formatCOP(tax)}</span>
        </div>
        <div class="receipt-total-row total-highlight">
          <span>Total Pagado:</span>
          <strong>${formatCOP(tx.amount)}</strong>
        </div>
      </div>

      <!-- Acordeón colapsable para auditoría técnica de la prueba técnica -->
      <details class="technical-details-box">
        <summary class="details-summary">🔍 Ver Payload Técnico de Auditoría (JSON)</summary>
        <pre class="technical-pre" tabindex="0">${JSON.stringify(raw, null, 2)}</pre>
      </details>
    </div>
  `;

  modal.hidden = false;
  overlay.hidden = false;
  modal.style.display = 'flex';
  overlay.style.display = 'block';

  const closeBtn = document.getElementById('close-detail-modal-btn');
  if (closeBtn) closeBtn.focus();
}

function closeDetailModal() {
  const modal = document.getElementById('detail-modal');
  const overlay = document.getElementById('detail-modal-overlay');
  if (modal && overlay) {
    modal.hidden = true;
    overlay.hidden = true;
    modal.style.display = 'none';
    overlay.style.display = 'none';
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

// 7. Carga y Filtros del Tablero de Evidencias (6 Columnas Limpias)
async function loadEvidences(filter = 'ALL') {
  const tbody = document.getElementById('evidences-tbody');
  if (!tbody) return;

  tbody.innerHTML = '<tr><td colspan="6" style="text-align:center; padding:1.5rem;">Cargando evidencias desde SQLite...</td></tr>';

  try {
    const url = filter === 'ALL' ? '/api/transactions/evidences' : `/api/transactions/evidences?status=${filter}`;
    const res = await fetch(url);
    const data = await res.json();

    if (!data.success || !data.transactions) {
      tbody.innerHTML = '<tr><td colspan="6" style="text-align:center; color:#991B1B;">Error al consultar SQLite</td></tr>';
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
      tbody.innerHTML = '<tr><td colspan="6" style="text-align:center; padding:1.5rem; color:#64748B;">No hay transacciones registradas con este filtro.</td></tr>';
      return;
    }

    tbody.innerHTML = txs.map(tx => {
      const dateStr = new Date(tx.created_at).toLocaleString('es-CO');
      const txEncoded = encodeURIComponent(JSON.stringify(tx));
      return `
        <tr>
          <td><strong>${tx.reference}</strong></td>
          <td><span class="status-badge status-${tx.status}">${tx.status}</span></td>
          <td>${tx.status_message || 'Transacción procesada'}</td>
          <td><strong>${formatCOP(tx.amount)}</strong></td>
          <td style="font-size:0.82rem; color:#64748B;">${dateStr}</td>
          <td>
            <button class="btn btn-primary btn-sm btn-view-detail" data-tx="${txEncoded}" aria-label="Ver detalle de transacción ${tx.reference}">
              <span>👁️ Ver Detalle</span>
            </button>
          </td>
        </tr>
      `;
    }).join('');

    // Asignar eventos a los botones "Ver Detalle"
    tbody.querySelectorAll('.btn-view-detail').forEach(btn => {
      btn.addEventListener('click', () => {
        try {
          const rawTx = JSON.parse(decodeURIComponent(btn.getAttribute('data-tx')));
          openDetailModal(rawTx);
        } catch (e) {
          console.error('Error al decodificar transacción:', e);
        }
      });
    });

  } catch (err) {
    console.error('[EVIDENCES LOAD ERROR]', err);
    tbody.innerHTML = '<tr><td colspan="6" style="text-align:center; color:#991B1B;">Error de conexión con el servidor</td></tr>';
  }
}

// 8. Manejador del Formulario de Pago (Redirección Directa a Placetopay)
function initCheckoutForm() {
  const form = document.getElementById('checkout-form');
  const feedback = document.getElementById('checkout-feedback');
  const submitBtn = document.getElementById('submit-pay-btn');
  const spinner = document.getElementById('btn-spinner');
  const btnText = document.getElementById('btn-text');

  if (!form) return;

  form.addEventListener('submit', async (e) => {
    e.preventDefault();
    feedback.innerHTML = '';

    const { totalAmount } = cart.getTotals();
    if (totalAmount <= 0) {
      feedback.innerHTML = '<div class="alert-box alert-danger">Debes agregar al menos un smartphone al carrito para continuar.</div>';
      return;
    }

    // Validar datos del comprador
    const buyerName = document.getElementById('buyer-name').value.trim();
    const buyerSurname = document.getElementById('buyer-surname').value.trim();
    const buyerEmail = document.getElementById('buyer-email').value.trim();
    const buyerMobile = document.getElementById('buyer-mobile').value.trim();
    const buyerDocType = document.getElementById('buyer-doc-type').value;
    const buyerDoc = document.getElementById('buyer-doc').value.trim();
    const buyerStreet = document.getElementById('buyer-street').value.trim();
    const buyerCity = document.getElementById('buyer-city').value.trim();

    if (!buyerName || !buyerSurname || !buyerEmail || !buyerMobile || !buyerDoc) {
      feedback.innerHTML = '<div class="alert-box alert-danger">Por favor completa todos los campos obligatorios del comprador marcados con asterisco (*).</div>';
      return;
    }

    // Referencia única de transacción
    const reference = 'SMART-' + Date.now();

    // Payload de Contrato: SIEMPRE WebCheckout
    const contractPayload = {
      buyer: {
        name: buyerName,
        surname: buyerSurname,
        email: buyerEmail,
        documentType: buyerDocType,
        document: buyerDoc,
        mobile: buyerMobile,
        address: {
          street: buyerStreet || 'Carrera 7 # 72-01',
          city: buyerCity || 'Bogotá D.C.'
        }
      },
      payment: {
        reference: reference,
        description: `Compra de Smartphones en Evertec PayShop (${cart.items.length} equipos)`,
        amount: totalAmount,
        currency: 'COP',
        items: cart.items.map(i => ({
          sku: i.product.sku,
          name: i.product.name,
          qty: i.quantity,
          price: i.product.price
        }))
      },
      channel: 'WEBCHECKOUT'
    };

    // Estado de carga en el botón
    submitBtn.disabled = true;
    spinner.hidden = false;
    btnText.textContent = 'Transfiriendo a Placetopay...';

    try {
      const res = await fetch('/api/checkout/session', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(contractPayload)
      });
      const result = await res.json();

      if (result.success && result.processUrl) {
        feedback.innerHTML = `
          <div class="alert-box alert-success" style="background:#ECFDF5; border-color:#10B981; color:#065F46;">
            <strong>✅ Redirigiendo a Placetopay WebCheckout...</strong>
            <p style="margin: 0.5rem 0;">Sesión creada con éxito (RequestId: ${result.requestId}). Redirigiendo automáticamente a la pasarela bancaria oficial...</p>
            <div class="spinner" style="margin: 0.75rem auto; border-top-color: #065F46;" aria-hidden="true"></div>
          </div>
        `;

        // Redirección directa e inmediata a la URL de Placetopay
        window.location.href = result.processUrl;

      } else {
        feedback.innerHTML = `<div class="alert-box alert-danger"><strong>Error WebCheckout:</strong> ${result.error || 'No se pudo generar la sesión de pago.'}</div>`;
        submitBtn.disabled = false;
        spinner.hidden = true;
        btnText.innerHTML = `Pagar <strong id="btn-amount">${formatCOP(totalAmount)}</strong>`;
      }

      // Recargar visor de evidencias en segundo plano
      await loadEvidences('ALL');

    } catch (err) {
      console.error('[CHECKOUT SUBMIT ERROR]', err);
      feedback.innerHTML = `<div class="alert-box alert-danger">Error al conectar con la pasarela: ${err.message}</div>`;
      submitBtn.disabled = false;
      spinner.hidden = true;
      btnText.innerHTML = `Pagar <strong id="btn-amount">${formatCOP(totalAmount)}</strong>`;
    }
  });
}

// 9. Función Global para Consultar Estado de WebCheckout
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

// 10. Inicialización en la Carga del DOM
document.addEventListener('DOMContentLoaded', () => {
  // Asegurar que modales y drawer inicien cerrados
  closeCartDrawer();
  closeCheckoutModal();
  closeHistoryModal();
  closeDetailModal();
  closePayloadModal();

  renderCatalog();
  renderCart();
  initCheckoutForm();
  loadEvidences('ALL');

  // Evento Botón del Carrito en Header (resiliente)
  const cartToggleBtn = document.getElementById('cart-toggle-btn');
  if (cartToggleBtn) {
    cartToggleBtn.addEventListener('click', (e) => {
      e.stopPropagation();
      openCartDrawer();
    });
  }

  // Eventos de Cierre del Carrito
  const closeCartBtn = document.getElementById('close-cart-btn');
  const cartOverlay = document.getElementById('cart-drawer-overlay');
  if (closeCartBtn) closeCartBtn.addEventListener('click', closeCartDrawer);
  if (cartOverlay) cartOverlay.addEventListener('click', closeCartDrawer);

  // Botón "Ir a Pagar" del Drawer: Abre el Modal de Checkout
  const proceedBtn = document.getElementById('proceed-to-checkout-btn');
  if (proceedBtn) {
    proceedBtn.addEventListener('click', () => {
      openCheckoutModal();
    });
  }

  // Enlace Checkout en el Nav
  const navCheckoutBtn = document.getElementById('nav-checkout-btn');
  if (navCheckoutBtn) {
    navCheckoutBtn.addEventListener('click', (e) => {
      e.preventDefault();
      openCheckoutModal();
    });
  }

  // Botón Historial en el Nav: Abre el Modal de Historial
  const navHistoryBtn = document.getElementById('nav-history-btn');
  if (navHistoryBtn) {
    navHistoryBtn.addEventListener('click', (e) => {
      e.preventDefault();
      openHistoryModal();
    });
  }

  // Eventos de Cierre del Modal de Historial
  const closeHistoryBtn = document.getElementById('close-history-modal-btn');
  const historyOverlay = document.getElementById('history-modal-overlay');
  if (closeHistoryBtn) closeHistoryBtn.addEventListener('click', closeHistoryModal);
  if (historyOverlay) historyOverlay.addEventListener('click', closeHistoryModal);

  // Eventos de Cierre del Modal de Checkout
  const closeCheckoutBtn = document.getElementById('close-checkout-modal-btn');
  const checkoutOverlay = document.getElementById('checkout-modal-overlay');
  if (closeCheckoutBtn) closeCheckoutBtn.addEventListener('click', closeCheckoutModal);
  if (checkoutOverlay) checkoutOverlay.addEventListener('click', closeCheckoutModal);

  // Eventos de Cierre del Modal "Ver Detalle"
  const closeDetailBtn = document.getElementById('close-detail-modal-btn');
  const detailOverlay = document.getElementById('detail-modal-overlay');
  if (closeDetailBtn) closeDetailBtn.addEventListener('click', closeDetailModal);
  if (detailOverlay) detailOverlay.addEventListener('click', closeDetailModal);

  // Eventos de Modal de Payload
  const closeModalBtn = document.getElementById('close-modal-btn');
  const modalOverlay = document.getElementById('payload-modal-overlay');
  if (closeModalBtn) closeModalBtn.addEventListener('click', closePayloadModal);
  if (modalOverlay) modalOverlay.addEventListener('click', closePayloadModal);

  // Tecla Escape para cerrar modales o drawer activos
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
      closeCartDrawer();
      closeCheckoutModal();
      closeHistoryModal();
      closeDetailModal();
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
