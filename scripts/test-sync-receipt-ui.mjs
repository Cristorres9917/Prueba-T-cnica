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
console.log('🧪 SUITE AGENTEST 006: SYNC ESTADO, RECIBO CLIENTE, FECHA BOGOTA Y UI CARDS');
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

// TEST-6.1: Aislamiento en rama activa de spec (feat/spec-006-*)
await assertTest('TEST-6.1', 'Aislamiento estricto en rama activa de spec (feat/spec-006-*)', () => {
  let branch = '';
  try {
    branch = execSync('git rev-parse --abbrev-ref HEAD', { encoding: 'utf8' }).trim();
  } catch (e) {
    branch = process.env.GIT_BRANCH || '';
  }

  if (branch === 'main' || branch === 'master') {
    throw new Error(`Estás en la rama ${branch}. El Spec-06 debe desarrollarse en rama aislada feat/spec-006-*`);
  }
  if (!/^feat\/spec-006-/.test(branch)) {
    throw new Error(`La rama activa '${branch}' no cumple con el patrón 'feat/spec-006-*'`);
  }
});

// TEST-6.2: Deserialización de raw_payload en SQLite (db.getTransactions)
await assertTest('TEST-6.2', 'db.getTransactions() deserializa raw_payload a objeto estructurado', () => {
  const txs = db.getTransactions();
  if (!Array.isArray(txs) || txs.length === 0) {
    throw new Error('No se obtuvieron transacciones desde SQLite');
  }

  // Al menos una transacción con raw_payload debe tenerlo deserializado como objeto
  const txWithPayload = txs.find(t => t.raw_payload !== null && t.raw_payload !== '');
  if (!txWithPayload) {
    throw new Error('No hay transacciones con raw_payload para evaluar');
  }

  if (typeof txWithPayload.raw_payload !== 'object') {
    throw new Error(`raw_payload debe ser tipo object, se obtuvo: ${typeof txWithPayload.raw_payload}`);
  }
});

// TEST-6.3: Método de actualización transaccional en SQLite (db.updateTransactionByReference)
await assertTest('TEST-6.3', 'db.updateTransactionByReference() actualiza estado, autorización y recibo', () => {
  const testRef = 'SPEC6-REF-' + Date.now();
  
  // Guardar transacción inicial en PENDING
  db.saveTransaction({
    sessionId: null,
    channel: 'WEBCHECKOUT',
    reference: testRef,
    status: 'PENDING',
    statusReason: 'PC',
    statusMessage: 'Esperando pago',
    amount: 5499000,
    currency: 'COP',
    rawPayload: { buyer: { name: 'Mariana', document: '98765432' } }
  });

  // Actualizar mediante updateTransactionByReference
  const updated = db.updateTransactionByReference(testRef, {
    status: 'APPROVED',
    statusReason: '00',
    statusMessage: 'Aprobada por Placetopay',
    authorizationCode: '998877',
    receipt: 'REC-123456',
    rawPayload: { buyer: { name: 'Mariana', document: '98765432' }, authCode: '998877' }
  });

  if (!updated) {
    throw new Error('updateTransactionByReference retornó null');
  }
  if (updated.status !== 'APPROVED') {
    throw new Error(`Se esperaba status 'APPROVED', se obtuvo: ${updated.status}`);
  }
  if (updated.authorization_code !== '998877' || updated.receipt !== 'REC-123456') {
    throw new Error('No se actualizaron authorization_code o receipt correctamente');
  }
});

// TEST-6.4: Sincronización de estado en /api/checkout/status/:requestId
await assertTest('TEST-6.4', 'Endpoint /api/checkout/status/:requestId sincroniza y actualiza la sesión y transacción en SQLite', async () => {
  const testRef = 'SPEC6-SYNC-' + Date.now();
  const createPayload = {
    buyer: {
      name: 'Laura',
      surname: 'Méndez',
      email: 'laura.mendez@evertecinc.com',
      documentType: 'CC',
      document: '1020304050',
      mobile: '3001234567',
      address: { street: 'Carrera 7 # 72-01', city: 'Bogotá' }
    },
    payment: {
      reference: testRef,
      description: 'Compra de prueba Spec 06',
      amount: 4500000,
      currency: 'COP',
      items: [
        { sku: 'TEST-SKU-1', name: 'Smartphone Test', qty: 1, price: 4500000 }
      ]
    },
    channel: 'WEBCHECKOUT'
  };

  const postData = JSON.stringify(createPayload);
  const createRes = await new Promise((resolve, reject) => {
    const req = http.request({
      hostname: '127.0.0.1',
      port: 3000,
      path: '/api/checkout/session',
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Content-Length': Buffer.byteLength(postData)
      }
    }, (res) => {
      let body = '';
      res.on('data', chunk => body += chunk);
      res.on('end', () => {
        try {
          resolve({ status: res.statusCode, body: JSON.parse(body) });
        } catch (e) {
          reject(e);
        }
      });
    });
    req.on('error', reject);
    req.write(postData);
    req.end();
  });

  if (!createRes.body.success || !createRes.body.requestId) {
    throw new Error('Fallo al crear sesión en Placetopay Sandbox: ' + JSON.stringify(createRes.body));
  }

  const realRequestId = createRes.body.requestId;

  // Consultar estado con el endpoint local
  const statusRes = await new Promise((resolve, reject) => {
    const req = http.request({
      hostname: '127.0.0.1',
      port: 3000,
      path: `/api/checkout/status/${realRequestId}`,
      method: 'GET'
    }, (res) => {
      let body = '';
      res.on('data', chunk => body += chunk);
      res.on('end', () => {
        try {
          resolve({ status: res.statusCode, body: JSON.parse(body) });
        } catch (e) {
          reject(e);
        }
      });
    });
    req.on('error', reject);
    req.end();
  });

  if (statusRes.status !== 200 || !statusRes.body.success) {
    throw new Error('Fallo al consultar status de sesión: ' + JSON.stringify(statusRes.body));
  }

  // Verificar que la transacción en SQLite existe y tiene raw_payload objeto
  const tx = db.getTransactionByReference(testRef);
  if (!tx) {
    throw new Error(`La transacción ${testRef} no existe en SQLite`);
  }
  if (!tx.raw_payload || typeof tx.raw_payload !== 'object') {
    throw new Error('La transacción en SQLite no contiene raw_payload deserializado');
  }
});

// TEST-6.5: Parámetros de retorno en returnUrl de sesión WebCheckout
await assertTest('TEST-6.5', 'returnUrl incluye parámetros status=return y reference', () => {
  const serverJsPath = path.join(rootDir, 'src', 'server.js');
  const serverJs = fs.readFileSync(serverJsPath, 'utf8');

  if (!serverJs.includes('status=return') || !serverJs.includes('reference=')) {
    throw new Error('server.js no incluye status=return ni reference= en la configuración de returnUrl');
  }
});

// TEST-6.6: Datos completos del cliente en modal de recibo
await assertTest('TEST-6.6', 'openDetailModal() deserializa raw_payload y renderiza datos del comprador y dirección', () => {
  const appJsPath = path.join(rootDir, 'public', 'app.js');
  const appJs = fs.readFileSync(appJsPath, 'utf8');

  if (!appJs.includes('JSON.parse(raw)') && !appJs.includes('JSON.parse(tx.raw_payload)')) {
    throw new Error('openDetailModal en app.js no incluye parsing defensivo de raw_payload');
  }
  if (!appJs.includes('buyer.address?.street') || !appJs.includes('buyer.address?.city')) {
    throw new Error('openDetailModal no renderiza dirección de entrega y ciudad del comprador');
  }
  if (!appJs.includes('buyer.email') || !appJs.includes('buyer.mobile')) {
    throw new Error('openDetailModal no renderiza correo y móvil del comprador');
  }
});

// TEST-6.7: Formateo horario local de Colombia (America/Bogota)
await assertTest('TEST-6.7', 'Fechas formateadas con zona horaria America/Bogota y normalización ISO UTC', () => {
  const appJs = fs.readFileSync(path.join(rootDir, 'public', 'app.js'), 'utf8');

  if (!appJs.includes("timeZone: 'America/Bogota'")) {
    throw new Error("Falta configuración timeZone: 'America/Bogota' en formateo de fechas");
  }
  if (!appJs.includes("replace(' ', 'T') + 'Z'") && !appJs.includes("replace(' ', 'T')")) {
    throw new Error("Falta normalización ISO UTC para evitar desfases horarios en navegadores");
  }
});

// TEST-6.8: Limpieza de carrito tras pago (cart.clearCart)
await assertTest('TEST-6.8', 'CartState incluye método clearCart() que vacía items y resetea almacenamiento', () => {
  const appJs = fs.readFileSync(path.join(rootDir, 'public', 'app.js'), 'utf8');

  if (!appJs.includes('clearCart()') || !appJs.includes('removeItem(\'evt_cart\')')) {
    throw new Error('Falta método clearCart() con limpieza de localStorage en app.js');
  }
  if (!appJs.includes('cart.clearCart()')) {
    throw new Error('cart.clearCart() no se invoca en los flujos de pago o retorno');
  }
});

// TEST-6.9: Contención y prevención de desbordes en tarjetas de productos
await assertTest('TEST-6.9', 'Estilos CSS de product-card y product-footer garantizan uniformidad sin desbordes', () => {
  const css = fs.readFileSync(path.join(rootDir, 'public', 'styles.css'), 'utf8');

  if (!css.includes('.product-card') || !css.includes('box-sizing: border-box;') || !css.includes('overflow: hidden;')) {
    throw new Error('.product-card carece de box-sizing: border-box o overflow: hidden');
  }
  if (!css.includes('.product-title') || !css.includes('height: 3rem;')) {
    throw new Error('.product-title carece de altura normalizada fija');
  }
  if (!css.includes('.product-desc') || !css.includes('height: 3.8rem;')) {
    throw new Error('.product-desc carece de altura normalizada fija');
  }
  if (!css.includes('.btn-add-cart') || !css.includes('flex-shrink: 0;')) {
    throw new Error('.btn-add-cart carece de flex-shrink: 0 o dimensiones para evitar desbordes');
  }
});

// TEST-6.10: Detección de retorno de pasarela en frontend
await assertTest('TEST-6.10', 'Frontend detecta retorno (?status=return), limpia carrito y abre modal de evidencias', () => {
  const appJs = fs.readFileSync(path.join(rootDir, 'public', 'app.js'), 'utf8');

  if (!appJs.includes("urlParams.get('status') === 'return'") && !appJs.includes("urlParams.has('reference')")) {
    throw new Error('Falta detector de retorno status=return en app.js');
  }
  if (!appJs.includes('openHistoryModal()')) {
    throw new Error('El detector de retorno no abre openHistoryModal()');
  }
  if (!appJs.includes('window.history.replaceState')) {
    throw new Error('Falta limpieza de URL en el navegador mediante window.history.replaceState');
  }
});

console.log('\n=========================================================================');
const failed = testResults.filter(t => t.status === 'FAIL');
if (failed.length === 0) {
  console.log('🎉 TODOS LOS TESTS DE AGENTEST 006 PASARON EXITOSAMENTE (10/10)');
  console.log('=========================================================================\n');
  process.exit(0);
} else {
  console.error(`💥 SE PRESENTARON ${failed.length} FALLOS EN AGENTEST 006:`);
  failed.forEach(f => console.error(` - [${f.id}] ${f.description}: ${f.error}`));
  console.log('=========================================================================\n');
  process.exit(1);
}
