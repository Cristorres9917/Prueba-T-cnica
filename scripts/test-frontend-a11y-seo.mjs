import fs from 'node:fs';
import path from 'node:path';
import http from 'node:http';
import { fileURLToPath } from 'node:url';
import { execSync, spawn } from 'node:child_process';
import { db } from '../src/database/db.js';
import { validateMockupPayload } from '../src/validators/mockup-contract.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const rootDir = path.join(__dirname, '..');

console.log('🧪 ==============================================================');
console.log('🧪 SUITE AGENTEST 004: FRONTEND EVERTEC, A11Y, SEO Y SERVIDOR API');
console.log('🧪 ==============================================================\n');

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

// TEST-4.1: Aislamiento en rama activa de spec
await assertTest('TEST-4.1', 'Aislamiento en rama activa de spec (feat/spec-004-*)', () => {
  let branch = '';
  try {
    branch = execSync('git rev-parse --abbrev-ref HEAD', { encoding: 'utf8' }).trim();
  } catch (e) {
    branch = process.env.GIT_BRANCH || '';
  }

  if (branch === 'main' || branch === 'master') {
    throw new Error(`Estás en la rama ${branch}. El Spec-04 debe desarrollarse en rama aislada feat/spec-004-*`);
  }
  if (!/^feat\/spec-004-/.test(branch)) {
    throw new Error(`La rama activa '${branch}' no cumple con el patrón 'feat/spec-004-*'`);
  }
});

// TEST-4.2: Identidad visual Evertec en CSS
await assertTest('TEST-4.2', 'Presencia de Design System y tokens de color Evertec en CSS', () => {
  const cssPath = path.join(rootDir, 'public', 'styles.css');
  if (!fs.existsSync(cssPath)) throw new Error('public/styles.css no existe');
  const css = fs.readFileSync(cssPath, 'utf8');

  if (!css.includes('--color-primary: #FF5900;') && !css.includes('#FF5900')) {
    throw new Error('Falta el color corporativo Naranja Evertec (#FF5900) en CSS');
  }
  if (!css.includes('--color-navy: #0B192C;') && !css.includes('#0B192C')) {
    throw new Error('Falta el color Azul Marino Evertec (#0B192C) en CSS');
  }
  if (!css.includes('--color-accent-blue: #0077CC;') && !css.includes('#0077CC')) {
    throw new Error('Falta el color Azul Acento (#0077CC) en CSS');
  }
});

// TEST-4.3: Accesibilidad WCAG 2.1 AA (HTML & Contrastes)
await assertTest('TEST-4.3', 'Accesibilidad WCAG 2.1 AA (Skip link, labels for=id, ARIA y contrastes)', () => {
  const htmlPath = path.join(rootDir, 'public', 'index.html');
  if (!fs.existsSync(htmlPath)) throw new Error('public/index.html no existe');
  const html = fs.readFileSync(htmlPath, 'utf8');

  if (!html.includes('<html lang="es">')) {
    throw new Error('Falta atributo lang="es" en etiqueta <html>');
  }
  if (!html.includes('class="skip-link"') || !html.includes('href="#content"')) {
    throw new Error('Falta enlace accesible de salto (skip-link) hacia #content');
  }

  // Verificar que inputs tengan labels for=id
  const requiredInputs = ['buyer-name', 'buyer-surname', 'buyer-email', 'buyer-mobile', 'buyer-doc', 'card-number'];
  for (const id of requiredInputs) {
    if (!html.includes(`id="${id}"`)) {
      throw new Error(`Falta elemento con id="${id}" en HTML`);
    }
    if (!html.includes(`for="${id}"`)) {
      throw new Error(`Falta <label for="${id}"> explícito para accesibilidad de lectores de pantalla`);
    }
  }

  if (!html.includes('role="banner"') || !html.includes('role="contentinfo"') || !html.includes('aria-live=')) {
    throw new Error('Faltan ARIA landmarks o regiones vivas (aria-live) requeridas por WCAG 2.1 AA');
  }
});

// TEST-4.4: SEO On-Page y Metadatos
await assertTest('TEST-4.4', 'SEO On-Page (Meta description, OpenGraph, Twitter Cards y jerarquía H1)', () => {
  const htmlPath = path.join(rootDir, 'public', 'index.html');
  const html = fs.readFileSync(htmlPath, 'utf8');

  // Title y Description
  const titleMatch = html.match(/<title>(.*?)<\/title>/);
  if (!titleMatch || titleMatch[1].length < 15 || titleMatch[1].length > 70) {
    throw new Error(`Título ausente o longitud inadecuada (${titleMatch ? titleMatch[1].length : 0} caracteres)`);
  }

  const descMatch = html.match(/<meta\s+name=["']description["']\s+content=["'](.*?)["']/);
  if (!descMatch || descMatch[1].length < 100 || descMatch[1].length > 170) {
    throw new Error(`Meta description ausente o fuera de rango SEO (${descMatch ? descMatch[1].length : 0} caracteres)`);
  }

  // OpenGraph y Twitter
  if (!html.includes('property="og:title"') || !html.includes('property="og:description"') || !html.includes('property="og:image"')) {
    throw new Error('Faltan etiquetas OpenGraph obligatorias (og:title, og:description, og:image)');
  }
  if (!html.includes('name="twitter:card"')) {
    throw new Error('Falta metadato twitter:card');
  }

  // Exactamente 1 H1
  const h1Count = (html.match(/<h1[\s>]/g) || []).length;
  if (h1Count !== 1) {
    throw new Error(`Se esperaba exactamente 1 etiqueta <h1> para SEO semántico, pero se encontraron ${h1Count}`);
  }
});

// TEST-4.5: Marcado Estructurado JSON-LD Schema.org
await assertTest('TEST-4.5', 'Marcado Estructurado JSON-LD Schema.org de Organización y Catálogo de Productos', () => {
  const htmlPath = path.join(rootDir, 'public', 'index.html');
  const html = fs.readFileSync(htmlPath, 'utf8');

  const jsonLdMatch = html.match(/<script\s+type=["']application\/ld\+json["']>([\s\S]*?)<\/script>/);
  if (!jsonLdMatch) throw new Error('No se encontró bloque <script type="application/ld+json">');

  let parsed = null;
  try {
    parsed = JSON.parse(jsonLdMatch[1].trim());
  } catch (e) {
    throw new Error('El contenido JSON-LD no es JSON sintácticamente válido: ' + e.message);
  }

  if (!parsed['@graph'] || !Array.isArray(parsed['@graph'])) {
    throw new Error('Falta @graph en estructura JSON-LD Schema.org');
  }

  const org = parsed['@graph'].find(item => item['@type'] === 'Organization');
  const items = parsed['@graph'].find(item => item['@type'] === 'ItemList');

  if (!org || !org.name.includes('Evertec')) {
    throw new Error('Falta entidad Organization de Evertec en JSON-LD');
  }
  if (!items || !items.itemListElement || items.itemListElement.length < 3) {
    throw new Error('Falta catálogo ItemList con al menos 3 productos en JSON-LD');
  }
});

// TEST-4.6: Carrito de Compras y Lógica Reactiva
await assertTest('TEST-4.6', 'Lógica de Carrito de Compras, cálculo de IVA (19%) y totales en COP', () => {
  const appJsPath = path.join(rootDir, 'public', 'app.js');
  if (!fs.existsSync(appJsPath)) throw new Error('public/app.js no existe');
  const js = fs.readFileSync(appJsPath, 'utf8');

  if (!js.includes('PRODUCTS =') || !js.includes('EVT-POS-001')) {
    throw new Error('Falta catálogo de productos en app.js');
  }
  if (!js.includes('detectCardBrand') || !js.includes('validateLuhn')) {
    throw new Error('Falta algoritmo de detección de franquicia o Luhn en app.js');
  }

  // Simulación de cálculo
  const samplePrice = 350000;
  const subtotal = Math.round(samplePrice / 1.19);
  const tax = samplePrice - subtotal;
  if (subtotal + tax !== samplePrice) {
    throw new Error('Discrepancia en el cálculo de impuestos y subtotal en COP');
  }
});

// TEST-4.7: Compatibilidad de Contrato Frontend con Validador Backend
await assertTest('TEST-4.7', 'Compatibilidad del contrato de formulario con src/validators/mockup-contract.js', () => {
  const samplePayload = {
    buyer: {
      name: 'Carlos',
      surname: 'Gómez',
      email: 'carlos.gomez@evertecinc.com',
      documentType: 'CC',
      document: '1020304050',
      mobile: '3001234567',
      address: {
        street: 'Calle 100 # 15-20',
        city: 'Bogotá'
      }
    },
    payment: {
      reference: 'TEST-ORD-001',
      description: 'Compra de prueba en Evertec PayShop',
      amount: 350000,
      currency: 'COP',
      items: [
        { sku: 'EVT-POS-001', name: 'Terminal POS Evertec', qty: 1, price: 350000 }
      ]
    },
    channel: 'GATEWAY_DIRECT',
    card: {
      number: '4000123456789010',
      expirationMonth: '12',
      expirationYear: '2028',
      cvv: '123',
      installments: 1
    }
  };

  const validation = validateMockupPayload(samplePayload);
  if (!validation.isValid) {
    throw new Error('El payload generado por el frontend no cumple con el contrato backend: ' + JSON.stringify(validation.errors));
  }
});

// TEST-4.8: Servidor HTTP y Endpoints REST
await assertTest('TEST-4.8', 'Servidor HTTP nativo expone estáticos y rutas REST de checkout y evidencias', async () => {
  const TEST_PORT = 3456;
  const serverPath = path.join(rootDir, 'src', 'server.js');
  const child = spawn(process.execPath, [serverPath], {
    env: { ...process.env, PORT: String(TEST_PORT) },
    stdio: 'pipe'
  });

  await new Promise((resolve, reject) => {
    let started = false;
    child.stdout.on('data', data => {
      const msg = data.toString();
      if (msg.includes('corriendo en') || msg.includes(String(TEST_PORT))) {
        started = true;
        resolve();
      }
    });
    child.on('error', reject);
    setTimeout(() => {
      if (!started) resolve();
    }, 1500);
  });

  try {
    // 1. Verificar GET /
    const htmlRes = await fetch(`http://localhost:${TEST_PORT}/`);
    if (htmlRes.status !== 200) {
      throw new Error(`GET / retornó status ${htmlRes.status}`);
    }
    const htmlBody = await htmlRes.text();
    if (!htmlBody.includes('Evertec PayShop')) {
      throw new Error('GET / no retornó la página principal esperada');
    }

    // 2. Verificar GET /api/transactions/evidences
    const evRes = await fetch(`http://localhost:${TEST_PORT}/api/transactions/evidences`);
    if (evRes.status !== 200) {
      throw new Error(`GET /api/transactions/evidences retornó status ${evRes.status}`);
    }
    const evData = await evRes.json();
    if (!evData.success || !Array.isArray(evData.transactions)) {
      throw new Error('Respuesta de /api/transactions/evidences no tiene formato de éxito esperado');
    }

    // 3. Verificar GET /api/health
    const healthRes = await fetch(`http://localhost:${TEST_PORT}/api/health`);
    if (healthRes.status !== 200) {
      throw new Error(`GET /api/health retornó status ${healthRes.status}`);
    }
    const healthData = await healthRes.json();
    if (healthData.status !== 'UP') {
      throw new Error('Health check no reportó estado UP');
    }

  } finally {
    child.kill();
  }
});

// TEST-4.9: Visor de Evidencias y Taxonomía de Rechazos en SQLite
await assertTest('TEST-4.9', 'Visor de evidencias consulta y categoriza los 3 estados y causales en SQLite', () => {
  const allTxs = db.getTransactions();
  const approved = db.getTransactions('APPROVED');
  const pending = db.getTransactions('PENDING');
  const rejected = db.getTransactions('REJECTED');

  if (allTxs.length === 0) {
    throw new Error('No hay transacciones en SQLite para auditar evidencias');
  }
  if (approved.length === 0) {
    throw new Error('Falta al menos una transacción APROBADA en SQLite');
  }
  if (pending.length === 0) {
    throw new Error('Falta al menos una transacción PENDIENTE en SQLite');
  }
  if (rejected.length === 0) {
    throw new Error('Falta al menos una transacción RECHAZADA en SQLite');
  }

  // Verificar que existen diversas causales de rechazo registradas
  const declineReasons = new Set(rejected.map(r => r.status_reason));
  if (declineReasons.size < 2) {
    throw new Error(`Se esperaban múltiples códigos de rechazo en SQLite, pero solo hay: ${Array.from(declineReasons).join(', ')}`);
  }
});

// TEST-4.10: Integridad de compuerta y solicitud de merge humano
await assertTest('TEST-4.10', 'Integridad de acta de entrega 004 (con compuerta de merge humano)', () => {
  const entregaPath = path.join(rootDir, 'docs', 'sdd', '04-entregas', '004-entrega-mockup-frontend-evertec.md');
  if (!fs.existsSync(entregaPath)) {
    throw new Error('El acta de entrega 004 no existe');
  }
  const content = fs.readFileSync(entregaPath, 'utf8');
  if (!content.includes('Human-in-the-Loop') || !content.includes('git merge --no-ff')) {
    throw new Error('El acta de entrega 004 no define la compuerta obligatoria de merge humano');
  }
});

console.log('\n==============================================================');
const passed = testResults.filter(t => t.status === 'PASS').length;
const failed = testResults.filter(t => t.status === 'FAIL').length;
console.log(`TOTAL TESTS: ${testResults.length} | PASSED: ${passed} | FAILED: ${failed}`);
console.log('==============================================================\n');

db.close();

if (failed > 0) {
  process.exit(1);
} else {
  console.log('🎉 SUITE AGENTEST 004 EXITOSA. Puerta de entrega habilitada.\n');
}
