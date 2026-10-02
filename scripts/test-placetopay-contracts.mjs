import fs from 'node:fs';
import path from 'node:path';
import { execSync } from 'node:child_process';
import { initDatabase } from '../src/database/db.js';
import { validateMockupPaymentPayload } from '../src/validators/mockup-contract.js';
import { PlacetopayService } from '../src/services/placetopay.js';

const rootDir = process.cwd();
const testDbPath = path.join(rootDir, 'data', 'test_placetopay.db');

// Limpiar base de datos de prueba si existe
if (fs.existsSync(testDbPath)) {
  fs.unlinkSync(testDbPath);
}

console.log('🧪 ==============================================================');
console.log('🧪 SUITE AGENTEST 003: CONTRATOS BACKEND, MOCKUP Y SQLITE');
console.log('🧪 ==============================================================\n');

const testResults = [];

async function assertTest(id, name, fn) {
  try {
    await fn();
    testResults.push({ id, name, status: 'PASS' });
    console.log(`✅ [${id}] ${name}: PASS`);
  } catch (err) {
    testResults.push({ id, name, status: 'FAIL', error: err.message });
    console.error(`❌ [${id}] ${name}: FAIL -> ${err.message}`);
  }
}

const db = initDatabase(testDbPath);
const service = new PlacetopayService();

let createdRequestId = null;

// TEST-3.1: Aislamiento de Rama Git
await assertTest('TEST-3.1', 'Aislamiento en rama activa de spec (feat/spec-003-*)', () => {
  const currentBranch = execSync('git rev-parse --abbrev-ref HEAD', { encoding: 'utf8' }).trim();
  if (currentBranch === 'main') {
    throw new Error('Las pruebas deben ejecutarse en la rama de trabajo feat/spec-003-*');
  }
  if (!currentBranch.includes('spec-003')) {
    throw new Error(`La rama actual '${currentBranch}' no corresponde a spec-003`);
  }
});

// TEST-3.2: SQLite DDL
await assertTest('TEST-3.2', 'Creación e integridad del esquema relacional SQLite', () => {
  const tables = db.rawDb.prepare(`
    SELECT name FROM sqlite_master WHERE type='table' AND name IN ('payment_sessions', 'transactions', 'audit_logs')
  `).all();
  if (tables.length !== 3) {
    throw new Error(`Se esperaban 3 tablas, pero se encontraron ${tables.length}`);
  }
});

// TEST-3.3: Mockup Contract Validator
await assertTest('TEST-3.3', 'Validación del diccionario de datos y contrato del Mockup', () => {
  // Caso inválido: falta email y total negativo
  const invalid = validateMockupPaymentPayload({
    buyer: { name: 'A', document: '123' },
    payment: { amount: { total: -10 } }
  });
  if (invalid.valid) {
    throw new Error('El validador debió rechazar el payload incompleto');
  }
  if (invalid.errors.length < 3) {
    throw new Error('Se esperaban múltiples errores de validación');
  }

  // Caso válido
  const valid = validateMockupPaymentPayload({
    buyer: {
      name: 'Carlos',
      surname: 'Restrepo',
      email: 'carlos.restrepo@example.com',
      documentType: 'CC',
      document: '1098765432',
      mobile: '3109876543'
    },
    payment: {
      reference: 'ORD-TEST-001',
      description: 'Compra Carrito Mockup MVP',
      amount: { currency: 'COP', total: 120000 }
    },
    channel: 'WEBCHECKOUT'
  });
  if (!valid.valid) {
    throw new Error(`El payload válido fue rechazado: ${valid.errors.join(', ')}`);
  }
});

// TEST-3.4: Firma Criptográfica
await assertTest('TEST-3.4', 'Cálculo algorítmico de credenciales y tranKey (SHA-256 + Base64)', () => {
  const auth = service.generateAuth();
  if (!auth.login || !auth.tranKey || !auth.nonce || !auth.seed) {
    throw new Error('El objeto auth no contiene los 4 campos obligatorios');
  }
  if (auth.tranKey.length !== 44 || auth.nonce.length !== 24) {
    throw new Error(`Longitud de tranKey (${auth.tranKey.length}) o nonce (${auth.nonce.length}) no es válida en Base64`);
  }
  if (isNaN(Date.parse(auth.seed))) {
    throw new Error('El campo seed no cumple con la norma ISO 8601');
  }
});

// TEST-3.5: Creación de Sesión en Sandbox Placetopay
await assertTest('TEST-3.5', 'Consumo de WebCheckout sandbox (POST /api/session) con respuesta OK', async () => {
  const result = await service.createWebcheckoutSession({
    buyer: {
      name: 'Edison',
      surname: 'Isaza',
      email: 'edison.isaza@example.com',
      documentType: 'CC',
      document: '123456789',
      mobile: '3001234567'
    },
    payment: {
      reference: 'TEST-SDD-' + Date.now(),
      description: 'Prueba Tecnica Evertec Placetopay - Spec 03',
      amount: { currency: 'COP', total: 75000 }
    },
    returnUrl: 'http://localhost:3000/response'
  }, db);

  if (!result.success || !result.requestId || !result.processUrl) {
    throw new Error(`Fallo en respuesta de sandbox: ${JSON.stringify(result.raw)}`);
  }
  createdRequestId = result.requestId;
});

// TEST-3.6: Persistencia de Sesión en SQLite
await assertTest('TEST-3.6', 'Persistencia de sesión en tabla payment_sessions con status PENDING', () => {
  if (!createdRequestId) throw new Error('No se dispone de requestId creado');
  const session = db.getSessionByRequestId(createdRequestId);
  if (!session) {
    throw new Error(`Sesión ${createdRequestId} no encontrada en SQLite`);
  }
  if (session.status !== 'PENDING' || session.amount !== 75000) {
    throw new Error(`Estado o monto incorrecto en SQLite: ${session.status} / ${session.amount}`);
  }
});

// TEST-3.7: Consulta de Estado de Sesión en Sandbox
await assertTest('TEST-3.7', 'Consulta de estado de sesión (POST /api/session/{requestId}) en sandbox', async () => {
  if (!createdRequestId) throw new Error('No se dispone de requestId');
  const statusResult = await service.getSessionStatus(createdRequestId, db);
  if (!statusResult.statusDetails || statusResult.statusDetails.status !== 'PENDING') {
    throw new Error(`Se esperaba status PENDING en sesión recién creada, pero se obtuvo: ${JSON.stringify(statusResult)}`);
  }
});

// TEST-3.8: Evidencias de los 3 Estados (Aprobado, Pendiente, Rechazado)
await assertTest('TEST-3.8', 'Persistencia de evidencias para los 3 estados transaccionales en SQLite', () => {
  // Registrar evidencia PENDIENTE
  const txPending = db.saveTransaction({
    sessionId: null,
    channel: 'WEBCHECKOUT',
    reference: 'EVID-PENDING-001',
    status: 'PENDING',
    statusReason: 'PC',
    statusMessage: 'La petición se encuentra activa',
    amount: 50000,
    currency: 'COP',
    rawPayload: { simulated: false, state: 'PENDING' }
  });

  // Registrar evidencia APROBADO
  const txApproved = db.saveTransaction({
    sessionId: null,
    channel: 'GATEWAY',
    reference: 'EVID-APPROVED-001',
    internalReference: '1099238',
    authorizationCode: '000192',
    receipt: '77281928',
    status: 'APPROVED',
    statusReason: '00',
    statusMessage: 'Aprobada',
    paymentMethod: 'VISA',
    amount: 150000,
    currency: 'COP',
    rawPayload: { simulated: true, state: 'APPROVED', authCode: '000192' }
  });

  // Registrar evidencias de RECHAZOS por diversas causales del ecosistema Placetopay / Evertec
  const rejectionsToTest = [
    { ref: 'EVID-REJ-FONDOS', reason: '05', msg: 'Fondos insuficientes / Límite de cupo excedido', brand: 'MASTERCARD', amount: 450000, channel: 'GATEWAY' },
    { ref: 'EVID-REJ-VENCIDA', reason: '54', msg: 'Tarjeta vencida / Fecha de expiración inválida', brand: 'VISA', amount: 120000, channel: 'GATEWAY' },
    { ref: 'EVID-REJ-CVV', reason: '55', msg: 'CVV / Código de seguridad inválido', brand: 'AMEX', amount: 85000, channel: 'GATEWAY' },
    { ref: 'EVID-REJ-CANCELADO', reason: '?C', msg: 'Proceso cancelado voluntariamente por el pagador', brand: 'PSE', amount: 320000, channel: 'WEBCHECKOUT' },
    { ref: 'EVID-REJ-ANTIFRAUDE', reason: 'AF', msg: 'Declinada por motor de prevención de fraude (scoring Cybersource)', brand: 'VISA', amount: 1500000, channel: 'GATEWAY' },
    { ref: 'EVID-REJ-NO-PERMITIDA', reason: '12', msg: 'Transacción no permitida a la tarjeta / e-commerce bloqueado por emisor', brand: 'MASTERCARD', amount: 210000, channel: 'GATEWAY' }
  ];

  for (const rej of rejectionsToTest) {
    db.saveTransaction({
      sessionId: null,
      channel: rej.channel,
      reference: rej.ref,
      internalReference: 'INT-' + Math.floor(Math.random() * 900000 + 100000),
      status: 'REJECTED',
      statusReason: rej.reason,
      statusMessage: rej.msg,
      paymentMethod: rej.brand,
      amount: rej.amount,
      currency: 'COP',
      rawPayload: { simulated: true, state: 'REJECTED', declineCode: rej.reason, reasonDescription: rej.msg }
    });
  }

  const approvedList = db.getTransactions('APPROVED');
  const pendingList = db.getTransactions('PENDING');
  const rejectedList = db.getTransactions('REJECTED');

  if (approvedList.length === 0 || pendingList.length === 0 || rejectedList.length < 6) {
    throw new Error(`Se esperaban al menos 6 rechazos con distintos motivos, pero se encontraron ${rejectedList.length}`);
  }
});

// TEST-3.9: Registro de Auditoría HTTP
await assertTest('TEST-3.9', 'Trazabilidad y métricas de latencia en tabla audit_logs', () => {
  const logs = db.getAuditLogs(10);
  if (logs.length < 2) {
    throw new Error(`Se esperaban al menos 2 registros de auditoría HTTP, se encontraron ${logs.length}`);
  }
  const sessionLog = logs.find(l => l.service_type === 'WEBCHECKOUT_SESSION');
  if (!sessionLog || sessionLog.http_status !== 200 || sessionLog.latency_ms <= 0) {
    throw new Error('El registro de auditoría de sesión no contiene métricas válidas');
  }
});

// TEST-3.10: Integridad de compuerta de entrega y solicitud de merge humano
await assertTest('TEST-3.10', 'Integridad de acta de entrega 003 (con compuerta de merge humano)', () => {
  const entregaPath = path.join(rootDir, 'docs', 'sdd', '04-entregas', '003-entrega-contratos-backend-y-mockup.md');
  if (!fs.existsSync(entregaPath)) {
    throw new Error('El acta de entrega 003 no existe');
  }
  const content = fs.readFileSync(entregaPath, 'utf8');
  if (!content.includes('Human-in-the-Loop') || !content.includes('git merge --no-ff')) {
    throw new Error('El acta de entrega 003 no define la compuerta obligatoria de merge humano');
  }
});

console.log('\n==============================================================');
const passed = testResults.filter(t => t.status === 'PASS').length;
const failed = testResults.filter(t => t.status === 'FAIL').length;
console.log(`TOTAL TESTS: ${testResults.length} | PASSED: ${passed} | FAILED: ${failed}`);
console.log('==============================================================\n');

db.close();

// Limpiar base de datos de test
if (fs.existsSync(testDbPath)) {
  fs.unlinkSync(testDbPath);
}

if (failed === 0) {
  console.log('🎉 SUITE AGENTEST 003 EXITOSA. Puerta de entrega habilitada.');
  process.exit(0);
} else {
  console.error(`⛔ ${failed} PRUEBAS FALLIDAS. La entrega permanece BLOQUEADA.`);
  process.exit(1);
}
