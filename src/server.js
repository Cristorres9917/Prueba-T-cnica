import http from 'node:http';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { db } from './database/db.js';
import { placetopayService } from './services/placetopay.js';
import { validateMockupPayload } from './validators/mockup-contract.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const rootDir = path.join(__dirname, '..');
const publicDir = path.join(rootDir, 'public');

const PORT = process.env.PORT || 3000;

const MIME_TYPES = {
  '.html': 'text/html; charset=utf-8',
  '.css': 'text/css; charset=utf-8',
  '.js': 'application/javascript; charset=utf-8',
  '.json': 'application/json; charset=utf-8',
  '.svg': 'image/svg+xml',
  '.png': 'image/png',
  '.jpg': 'image/jpeg',
  '.ico': 'image/x-icon'
};

function parseJsonBody(req) {
  return new Promise((resolve, reject) => {
    let body = '';
    req.on('data', chunk => {
      body += chunk.toString();
      if (body.length > 1e6) { // 1MB limit
        reject(new Error('Payload demasiado grande'));
      }
    });
    req.on('end', () => {
      try {
        resolve(body ? JSON.parse(body) : {});
      } catch (err) {
        reject(new Error('JSON mal formado: ' + err.message));
      }
    });
    req.on('error', reject);
  });
}

function sendJson(res, statusCode, data) {
  res.writeHead(statusCode, {
    'Content-Type': 'application/json; charset=utf-8',
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type, Authorization',
    'Cache-Control': 'no-store'
  });
  res.end(JSON.stringify(data));
}

function serveStaticFile(res, filePath) {
  const ext = path.extname(filePath).toLowerCase();
  const contentType = MIME_TYPES[ext] || 'application/octet-stream';

  fs.readFile(filePath, (err, content) => {
    if (err) {
      if (err.code === 'ENOENT') {
        res.writeHead(404, { 'Content-Type': 'text/plain; charset=utf-8' });
        res.end('404 Recurso no encontrado');
      } else {
        res.writeHead(500, { 'Content-Type': 'text/plain; charset=utf-8' });
        res.end('500 Error interno del servidor');
      }
    } else {
      res.writeHead(200, {
        'Content-Type': contentType,
        'Cache-Control': ext === '.html' ? 'no-cache' : 'public, max-age=3600'
      });
      res.end(content);
    }
  });
}

export const server = http.createServer(async (req, res) => {
  const parsedUrl = new URL(req.url, `http://${req.headers.host || 'localhost'}`);
  const pathname = parsedUrl.pathname;
  const method = req.method;

  // CORS preflight
  if (method === 'OPTIONS') {
    res.writeHead(204, {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type, Authorization'
    });
    res.end();
    return;
  }

  try {
    // 1. API: Crear Sesión WebCheckout
    if (pathname === '/api/checkout/session' && method === 'POST') {
      const payload = await parseJsonBody(req);
      const validation = validateMockupPayload(payload);
      if (!validation.isValid) {
        return sendJson(res, 400, {
          success: false,
          error: 'Contrato de datos inválido',
          errors: validation.errors
        });
      }

      // Preparar payload para Placetopay WebCheckout
      const returnUrl = payload.returnUrl || `http://${req.headers.host || 'localhost:3000'}/?status=return`;
      const sessionPayload = {
        buyer: payload.buyer,
        payment: {
          reference: payload.payment.reference,
          description: payload.payment.description,
          amount: {
            currency: payload.payment.currency || 'COP',
            total: payload.payment.amount
          }
        },
        expiration: new Date(Date.now() + 15 * 60 * 1000).toISOString(),
        returnUrl: returnUrl,
        ipAddress: req.socket.remoteAddress || '127.0.0.1',
        userAgent: req.headers['user-agent'] || 'Evertec-Mockup-Client/1.0'
      };

      const result = await placetopayService.createWebcheckoutSession(sessionPayload);
      
      // Guardar también transacción inicial PENDING para trazabilidad de evidencias
      db.saveTransaction({
        sessionId: result.requestId ? String(result.requestId) : null,
        channel: 'WEBCHECKOUT',
        reference: payload.payment.reference,
        status: 'PENDING',
        statusReason: 'PC',
        statusMessage: 'La petición se encuentra activa en WebCheckout',
        amount: payload.payment.amount,
        currency: payload.payment.currency || 'COP',
        rawPayload: result
      });

      return sendJson(res, 200, {
        success: true,
        channel: 'WEBCHECKOUT',
        requestId: result.requestId,
        processUrl: result.processUrl,
        status: result.status
      });
    }

    // 2. API: Procesar Gateway Directo (Simulación / Tarjeta)
    if (pathname === '/api/checkout/gateway' && method === 'POST') {
      const payload = await parseJsonBody(req);
      const validation = validateMockupPayload(payload);
      if (!validation.isValid) {
        return sendJson(res, 400, {
          success: false,
          error: 'Contrato de datos inválido',
          errors: validation.errors
        });
      }

      const card = payload.card || {};
      const cardNumber = (card.number || '').replace(/\s+/g, '');
      const amount = payload.payment.amount;
      const ref = payload.payment.reference;

      // Evaluación del escenario transaccional según número de tarjeta o parámetros
      // Permite demostrar APROBADO, PENDIENTE y las distintas causales de RECHAZO
      let status = 'APPROVED';
      let statusReason = '00';
      let statusMessage = 'Aprobada';
      let authorizationCode = 'AUT' + Math.floor(Math.random() * 899999 + 100000);
      let receipt = String(Math.floor(Math.random() * 89999999 + 10000000));

      if (cardNumber.endsWith('0005') || cardNumber.endsWith('51')) {
        status = 'REJECTED';
        statusReason = '05';
        statusMessage = 'Fondos insuficientes / Cupo excedido';
        authorizationCode = null;
        receipt = null;
      } else if (cardNumber.endsWith('0054') || cardNumber.endsWith('14')) {
        status = 'REJECTED';
        statusReason = '54';
        statusMessage = 'Tarjeta vencida / Fecha de expiración inválida';
        authorizationCode = null;
        receipt = null;
      } else if (cardNumber.endsWith('0055') || card.cvv === '000') {
        status = 'REJECTED';
        statusReason = '55';
        statusMessage = 'CVV / Código de seguridad inválido';
        authorizationCode = null;
        receipt = null;
      } else if (cardNumber.endsWith('0012') || cardNumber.endsWith('57')) {
        status = 'REJECTED';
        statusReason = '12';
        statusMessage = 'Transacción no permitida a la tarjeta / e-commerce bloqueado por emisor';
        authorizationCode = null;
        receipt = null;
      } else if (cardNumber.endsWith('0099') || amount > 5000000) {
        status = 'REJECTED';
        statusReason = 'AF';
        statusMessage = 'Declinada por motor de prevención de fraude (scoring Cybersource)';
        authorizationCode = null;
        receipt = null;
      } else if (cardNumber.endsWith('0091')) {
        status = 'PENDING';
        statusReason = '91';
        statusMessage = 'En proceso de verificación / Time-out bancario asíncrono';
        authorizationCode = null;
      }

      // Persistir transacción en SQLite
      const savedTx = db.saveTransaction({
        sessionId: null,
        channel: 'GATEWAY_DIRECT',
        reference: ref,
        internalReference: 'INT-' + Math.floor(Math.random() * 899999 + 100000),
        authorizationCode: authorizationCode,
        receipt: receipt,
        status: status,
        statusReason: statusReason,
        statusMessage: statusMessage,
        paymentMethod: card.brand || 'CREDIT_CARD',
        amount: amount,
        currency: payload.payment.currency || 'COP',
        rawPayload: {
          reference: ref,
          cardMasked: '****-****-****-' + cardNumber.slice(-4),
          installments: card.installments || 1,
          status,
          statusReason,
          statusMessage,
          authorizationCode,
          receipt,
          timestamp: new Date().toISOString()
        }
      });

      return sendJson(res, 200, {
        success: status === 'APPROVED',
        status: status,
        statusReason: statusReason,
        statusMessage: statusMessage,
        authorizationCode: authorizationCode,
        receipt: receipt,
        reference: ref,
        transactionId: savedTx.id
      });
    }

    // 3. API: Consultar Estado de Sesión WebCheckout
    if (pathname.startsWith('/api/checkout/status/') && method === 'GET') {
      const requestId = pathname.split('/').pop();
      if (!requestId) {
        return sendJson(res, 400, { success: false, error: 'RequestId requerido' });
      }
      const statusResult = await placetopayService.getSessionStatus(requestId);
      return sendJson(res, 200, { success: true, ...statusResult });
    }

    // 4. API: Listar Evidencias Transaccionales desde SQLite
    if (pathname === '/api/transactions/evidences' && method === 'GET') {
      const filterStatus = parsedUrl.searchParams.get('status') || null;
      const transactions = db.getTransactions(filterStatus);
      return sendJson(res, 200, {
        success: true,
        count: transactions.length,
        filter: filterStatus,
        transactions: transactions
      });
    }

    // 5. API: Health Check
    if (pathname === '/api/health' && method === 'GET') {
      const dbStats = db.getTransactions();
      return sendJson(res, 200, {
        status: 'UP',
        uptime: process.uptime(),
        environment: 'SANDBOX',
        database: 'SQLite (node:sqlite)',
        totalTransactions: dbStats.length,
        placetopayConfig: {
          login: placetopayService.config.login ? 'CONFIGURED' : 'MISSING',
          webcheckoutEndpoint: placetopayService.config.webcheckoutEndpoint,
          gatewayEndpoint: placetopayService.config.gatewayEndpoint
        }
      });
    }

    // 6. Servir Archivos Estáticos
    let filePath = path.join(publicDir, pathname === '/' ? 'index.html' : pathname);
    
    // Prevenir Directory Traversal
    if (!filePath.startsWith(publicDir)) {
      res.writeHead(403, { 'Content-Type': 'text/plain; charset=utf-8' });
      return res.end('403 Acceso Denegado');
    }

    if (fs.existsSync(filePath) && fs.statSync(filePath).isFile()) {
      return serveStaticFile(res, filePath);
    }

    // Fallback a index.html para SPA routing
    const fallbackIndex = path.join(publicDir, 'index.html');
    if (fs.existsSync(fallbackIndex)) {
      return serveStaticFile(res, fallbackIndex);
    }

    res.writeHead(404, { 'Content-Type': 'text/plain; charset=utf-8' });
    res.end('404 No encontrado');

  } catch (err) {
    console.error('[SERVER ERROR]', err);
    sendJson(res, 500, {
      success: false,
      error: 'Error interno en servidor',
      message: err.message
    });
  }
});

// Inicio del servidor cuando se ejecuta directamente
if (process.argv[1] && fileURLToPath(import.meta.url) === process.argv[1]) {
  server.listen(PORT, () => {
    console.log(`\n🚀 Evertec Placetopay Store corriendo en: http://localhost:${PORT}`);
    console.log(`📦 Persistencia: SQLite nativo (node:sqlite)`);
    console.log(`🔒 Pasarela: WebCheckout & API Gateway Sandbox activos\n`);
  });
}
