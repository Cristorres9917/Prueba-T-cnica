import fs from 'node:fs';
import path from 'node:path';
import http from 'node:http';
import { fileURLToPath } from 'node:url';
import { execSync } from 'node:child_process';
import { db } from '../src/database/db.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const rootDir = path.join(__dirname, '..');

console.log('🧪 =========================================================================');
console.log('🧪 SUITE AGENTEST 005: SMARTPHONES, CHECKOUT MODAL Y PLACETOPAY WEBCHECKOUT');
console.log('🧪 =========================================================================\n');

const testResults = [];

async function assertTest(id, description, fn) {
  try {
    await fn();
    testResults.push({ id, description, status: 'PASS' });
    console.log(`✅ [${id}] ${description}: PASS`);
  } catch (err) {
    testResults.push({ id, description, status: 'FAIL', error: err.message });
    console.error(`❌ [${id}] ${description}: FAIL -> ${err.message}`);
  }
}

// TEST-5.1: Aislamiento en rama activa de spec (feat/spec-005-*)
await assertTest('TEST-5.1', 'Aislamiento estricto en rama activa de spec (feat/spec-005-*)', () => {
  let branch = '';
  try {
    branch = execSync('git rev-parse --abbrev-ref HEAD', { encoding: 'utf8' }).trim();
  } catch (e) {
    branch = process.env.GIT_BRANCH || '';
  }

  if (branch === 'main' || branch === 'master') {
    throw new Error(`Estás en la rama ${branch}. El Spec-05 debe desarrollarse en rama aislada feat/spec-005-*`);
  }
  if (!/^feat\/spec-005-/.test(branch)) {
    throw new Error(`La rama activa '${branch}' no cumple con el patrón 'feat/spec-005-*'`);
  }
});

// TEST-5.2: Catálogo de 12 smartphones de alta gama en app.js con precios reales (> $3M COP)
await assertTest('TEST-5.2', 'Catálogo de 12 smartphones de alta gama en app.js con precios reales en COP', () => {
  const appJsPath = path.join(rootDir, 'public', 'app.js');
  if (!fs.existsSync(appJsPath)) throw new Error('public/app.js no existe');
  const appJs = fs.readFileSync(appJsPath, 'utf8');

  // Extraer el array PRODUCTS usando regex o eval controlado
  const match = appJs.match(/const PRODUCTS = (\[[\s\S]*?\n\]);/);
  if (!match) throw new Error('No se encontró la definición de PRODUCTS en public/app.js');

  let products;
  try {
    products = eval(`(${match[1]})`);
  } catch (e) {
    throw new Error('No se pudo analizar el array PRODUCTS: ' + e.message);
  }

  if (!Array.isArray(products) || products.length !== 12) {
    throw new Error(`Se esperaban exactamente 12 smartphones, se encontraron: ${products ? products.length : 0}`);
  }

  for (const prod of products) {
    if (!prod.id || !prod.sku || !prod.name || !prod.category || !prod.desc || !prod.icon) {
      throw new Error(`Producto ${prod.name || 'desconocido'} tiene campos incompletos`);
    }
    if (typeof prod.price !== 'number' || prod.price < 3000000) {
      throw new Error(`Producto ${prod.name} tiene un precio irreal para alta gama: ${prod.price}`);
    }
  }
});

// TEST-5.3: Marcado Estructurado JSON-LD con los 12 smartphones
await assertTest('TEST-5.3', 'Marcado Estructurado JSON-LD Schema.org con los 12 smartphones en index.html', () => {
  const htmlPath = path.join(rootDir, 'public', 'index.html');
  const html = fs.readFileSync(htmlPath, 'utf8');

  const jsonLdMatch = html.match(/<script\s+type=["']application\/ld\+json["']>([\s\S]*?)<\/script>/);
  if (!jsonLdMatch) throw new Error('No se encontró bloque <script type="application/ld+json">');

  const parsed = JSON.parse(jsonLdMatch[1].trim());
  const itemList = parsed['@graph']?.find(item => item['@type'] === 'ItemList');

  if (!itemList || !Array.isArray(itemList.itemListElement)) {
    throw new Error('Falta ItemList con itemListElement en JSON-LD');
  }

  if (itemList.itemListElement.length !== 12) {
    throw new Error(`El ItemList de Schema.org debe contener 12 smartphones, se encontraron: ${itemList.itemListElement.length}`);
  }

  // Verificar que el primero sea iPhone y tenga precio correcto
  const first = itemList.itemListElement[0].item;
  if (!first.name.includes('iPhone') || parseInt(first.offers.price, 10) < 3000000) {
    throw new Error('El primer producto del catálogo JSON-LD no cumple con las especificaciones');
  }
});

// TEST-5.4: Accesibilidad y resiliencia del botón de carrito (#cart-toggle-btn)
await assertTest('TEST-5.4', 'Resiliencia del botón del carrito con pointer-events: none en hijos y atributos accesibles', () => {
  const html = fs.readFileSync(path.join(rootDir, 'public', 'index.html'), 'utf8');
  const css = fs.readFileSync(path.join(rootDir, 'public', 'styles.css'), 'utf8');
  const appJs = fs.readFileSync(path.join(rootDir, 'public', 'app.js'), 'utf8');

  if (!html.includes('id="cart-toggle-btn"')) {
    throw new Error('Falta elemento #cart-toggle-btn en HTML');
  }
  if (!html.includes('aria-haspopup="dialog"')) {
    throw new Error('Falta aria-haspopup="dialog" en #cart-toggle-btn');
  }

  if (!css.includes('.cart-btn *') || !css.includes('pointer-events: none;')) {
    throw new Error('Falta regla CSS .cart-btn * { pointer-events: none; } para evitar bloqueo de clic');
  }

  if (!appJs.includes('openCartDrawer()') || !appJs.includes('closeCartDrawer()')) {
    throw new Error('Faltan funciones de control openCartDrawer / closeCartDrawer en app.js');
  }
});

// TEST-5.5: Checkout encapsulado en modal (no incrustado en el cuerpo de la página)
await assertTest('TEST-5.5', 'Checkout encapsulado en modal flotante accesible (#checkout-modal) sin sección en body', () => {
  const html = fs.readFileSync(path.join(rootDir, 'public', 'index.html'), 'utf8');

  if (html.includes('<section id="checkout-section"')) {
    throw new Error('La sección incrustada #checkout-section aún existe en el flujo principal del body');
  }

  if (!html.includes('id="checkout-modal"') || !html.includes('id="checkout-modal-overlay"')) {
    throw new Error('Faltan los elementos del modal #checkout-modal o su overlay en HTML');
  }

  if (!html.includes('role="dialog"') || !html.includes('aria-modal="true"')) {
    throw new Error('El modal de checkout carece de roles ARIA de accesibilidad (role="dialog" aria-modal="true")');
  }

  if (!html.includes('id="checkout-form"')) {
    throw new Error('El formulario #checkout-form debe encontrarse dentro del modal');
  }
});

// TEST-5.6: Eliminación absoluta de canal y tarjeta en la interfaz (100% WebCheckout transparente)
await assertTest('TEST-5.6', 'Canal Placetopay transparente (sin selector de canales ni campos de tarjeta directa en UI)', () => {
  const html = fs.readFileSync(path.join(rootDir, 'public', 'index.html'), 'utf8');

  if (html.includes('name="paymentChannel"') || html.includes('value="GATEWAY_DIRECT"')) {
    throw new Error('El selector de canales (paymentChannel / GATEWAY_DIRECT) aún está presente en la interfaz');
  }

  if (html.includes('id="card-number"') || html.includes('id="card-cvv"') || html.includes('id="card-exp"')) {
    throw new Error('Existen campos de captura directa de tarjeta de crédito en la interfaz de usuario');
  }
});

// TEST-5.7: Integración con Placetopay WebCheckout y persistencia SQLite
await assertTest('TEST-5.7', 'Flujo completo de sesión WebCheckout con almacenamiento enriquecido en SQLite', async () => {
  const testRef = 'SPEC5-TEST-' + Date.now();
  const payload = {
    buyer: {
      name: 'Carlos',
      surname: 'Gómez',
      email: 'carlos.gomez@evertecinc.com',
      documentType: 'CC',
      document: '1020304050',
      mobile: '3001234567',
      address: { street: 'Carrera 7 # 72-01', city: 'Bogotá' }
    },
    payment: {
      reference: testRef,
      description: 'Compra de 1x Apple iPhone 16 Pro Max',
      amount: 6499000,
      currency: 'COP',
      items: [
        { sku: 'APL-IP16PM-256', name: 'Apple iPhone 16 Pro Max', qty: 1, price: 6499000 }
      ]
    },
    channel: 'WEBCHECKOUT'
  };

  // Simulación de petición HTTP directa al servidor local
  const postData = JSON.stringify(payload);
  const options = {
    hostname: '127.0.0.1',
    port: 3000,
    path: '/api/checkout/session',
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Content-Length': Buffer.byteLength(postData)
    }
  };

  const response = await new Promise((resolve, reject) => {
    const req = http.request(options, (res) => {
      let body = '';
      res.on('data', chunk => body += chunk);
      res.on('end', () => {
        try {
          resolve({ status: res.statusCode, body: JSON.parse(body) });
        } catch (e) {
          reject(new Error(`Respuesta no JSON: ${body}`));
        }
      });
    });
    req.on('error', reject);
    req.write(postData);
    req.end();
  });

  if (response.status !== 200 || !response.body.success) {
    throw new Error(`Fallo al crear sesión WebCheckout: ${JSON.stringify(response.body)}`);
  }

  if (!response.body.requestId || !response.body.processUrl) {
    throw new Error('La respuesta no incluye requestId o processUrl');
  }

  // Verificar persistencia en SQLite
  const savedTx = db.getTransactionByReference(testRef);
  if (!savedTx) {
    throw new Error(`La transacción ${testRef} no fue persistida en la base de datos SQLite`);
  }
  if (savedTx.channel !== 'WEBCHECKOUT') {
    throw new Error(`Canal guardado esperado 'WEBCHECKOUT', se obtuvo: ${savedTx.channel}`);
  }
  if (!savedTx.raw_payload?.buyer?.name || savedTx.raw_payload.buyer.name !== 'Carlos') {
    throw new Error('El raw_payload no contiene los datos enriquecidos del comprador');
  }
});

// TEST-5.8: Navegación superior incluye botón de "Historial"
await assertTest('TEST-5.8', 'Barra de navegación incluye enlace/botón de Historial (#nav-history-btn)', () => {
  const html = fs.readFileSync(path.join(rootDir, 'public', 'index.html'), 'utf8');

  if (!html.includes('id="nav-history-btn"') || !html.includes('href="#evidences-section"')) {
    throw new Error('Falta enlace #nav-history-btn apuntando a #evidences-section');
  }
  if (!html.includes('Historial</a>')) {
    throw new Error('El texto del botón de navegación debe ser explícitamente "Historial"');
  }
});

// TEST-5.9: Tabla de evidencias simplificada a 6 columnas (sin Canal ni Razón)
await assertTest('TEST-5.9', 'Tabla de evidencias simplificada a 6 columnas (eliminadas Canal y Razón)', () => {
  const html = fs.readFileSync(path.join(rootDir, 'public', 'index.html'), 'utf8');
  const appJs = fs.readFileSync(path.join(rootDir, 'public', 'app.js'), 'utf8');

  // En index.html thead
  const theadMatch = html.match(/<thead>[\s\S]*?<\/thead>/);
  if (!theadMatch) throw new Error('No se encontró etiqueta <thead> en tabla de evidencias');
  const thCount = (theadMatch[0].match(/<th[\s>]/g) || []).length;
  if (thCount !== 6) {
    throw new Error(`Se esperaban exactamente 6 columnas en thead, se encontraron: ${thCount}`);
  }

  if (theadMatch[0].includes('Canal') || theadMatch[0].includes('Razón')) {
    throw new Error('Las columnas Canal o Razón aún están presentes en el <thead>');
  }

  // En app.js
  if (appJs.includes('<td colspan="8"') || appJs.includes('<td><span class="sku-tag">${tx.channel}</span></td>')) {
    throw new Error('app.js aún referencia 8 columnas o renderiza la celda de tx.channel en la tabla principal');
  }
});

// TEST-5.10: Botón "Ver Detalle" y Modal de Recibo Estructurado (#detail-modal)
await assertTest('TEST-5.10', 'Botón "Ver Detalle" y Modal de Recibo Estructurado con datos del comprador y desglose', () => {
  const html = fs.readFileSync(path.join(rootDir, 'public', 'index.html'), 'utf8');
  const appJs = fs.readFileSync(path.join(rootDir, 'public', 'app.js'), 'utf8');

  if (!html.includes('id="detail-modal"') || !html.includes('id="detail-modal-overlay"')) {
    throw new Error('Falta el elemento modal #detail-modal o su overlay en HTML');
  }

  if (!appJs.includes('btn-view-detail') || !appJs.includes('Ver Detalle')) {
    throw new Error('No se genera el botón con clase btn-view-detail y texto "Ver Detalle" en la tabla');
  }

  if (!appJs.includes('openDetailModal') || !appJs.includes('closeDetailModal')) {
    throw new Error('Faltan las funciones openDetailModal / closeDetailModal en app.js');
  }

  if (!appJs.includes('receipt-card') || !appJs.includes('technical-details-box')) {
    throw new Error('El modal no contiene la tarjeta de recibo o la sección técnica colapsable de auditoría');
  }
});

console.log('\n=========================================================================');
const failed = testResults.filter(t => t.status === 'FAIL');
if (failed.length === 0) {
  console.log('🎉 TODOS LOS TESTS DE AGENTEST 005 PASARON EXITOSAMENTE (10/10)');
  console.log('=========================================================================\n');
  process.exit(0);
} else {
  console.error(`💥 SE PRESENTARON ${failed.length} FALLOS EN AGENTEST 005:`);
  failed.forEach(f => console.error(` - [${f.id}] ${f.description}: ${f.error}`));
  console.log('=========================================================================\n');
  process.exit(1);
}
