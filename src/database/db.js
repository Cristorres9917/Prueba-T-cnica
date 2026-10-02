import { DatabaseSync } from 'node:sqlite';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const defaultDbPath = path.resolve(process.cwd(), 'data', 'placetopay.db');

function seedInitialEvidences(db) {
  try {
    const row = db.prepare('SELECT count(*) as count FROM transactions').get();
    if (row && row.count === 0) {
      const seedTransactions = [
        {
          sessionId: null,
          channel: 'GATEWAY_DIRECT',
          reference: 'EVID-APP-001',
          internalReference: '1099238',
          authorizationCode: '000192',
          receipt: '77281928',
          status: 'APPROVED',
          statusReason: '00',
          statusMessage: 'Aprobada',
          paymentMethod: 'VISA',
          amount: 350000,
          currency: 'COP',
          rawPayload: { simulated: true, state: 'APPROVED', authCode: '000192', card: 'VISA **** 4242' }
        },
        {
          sessionId: null,
          channel: 'WEBCHECKOUT',
          reference: 'EVID-PEN-002',
          internalReference: '1099240',
          status: 'PENDING',
          statusReason: 'PC',
          statusMessage: 'La petición se encuentra activa en WebCheckout',
          paymentMethod: 'PSE',
          amount: 180000,
          currency: 'COP',
          rawPayload: { simulated: true, state: 'PENDING', reason: 'PC' }
        },
        {
          sessionId: null,
          channel: 'GATEWAY_DIRECT',
          reference: 'EVID-REJ-FONDOS',
          internalReference: '1099241',
          status: 'REJECTED',
          statusReason: '05',
          statusMessage: 'Fondos insuficientes / Cupo excedido',
          paymentMethod: 'MASTERCARD',
          amount: 520000,
          currency: 'COP',
          rawPayload: { simulated: true, state: 'REJECTED', declineCode: '05' }
        },
        {
          sessionId: null,
          channel: 'GATEWAY_DIRECT',
          reference: 'EVID-REJ-VENCIDA',
          internalReference: '1099242',
          status: 'REJECTED',
          statusReason: '54',
          statusMessage: 'Tarjeta vencida / Fecha de expiración inválida',
          paymentMethod: 'VISA',
          amount: 290000,
          currency: 'COP',
          rawPayload: { simulated: true, state: 'REJECTED', declineCode: '54' }
        },
        {
          sessionId: null,
          channel: 'GATEWAY_DIRECT',
          reference: 'EVID-REJ-CVV',
          internalReference: '1099243',
          status: 'REJECTED',
          statusReason: '55',
          statusMessage: 'CVV / Código de seguridad inválido',
          paymentMethod: 'AMEX',
          amount: 150000,
          currency: 'COP',
          rawPayload: { simulated: true, state: 'REJECTED', declineCode: '55' }
        },
        {
          sessionId: null,
          channel: 'WEBCHECKOUT',
          reference: 'EVID-REJ-CANCELADO',
          internalReference: '1099244',
          status: 'REJECTED',
          statusReason: '?C',
          statusMessage: 'Proceso cancelado voluntariamente por el pagador',
          paymentMethod: 'PSE',
          amount: 350000,
          currency: 'COP',
          rawPayload: { simulated: true, state: 'REJECTED', declineCode: '?C' }
        },
        {
          sessionId: null,
          channel: 'GATEWAY_DIRECT',
          reference: 'EVID-REJ-ANTIFRAUDE',
          internalReference: '1099245',
          status: 'REJECTED',
          statusReason: 'AF',
          statusMessage: 'Declinada por motor de prevención de fraude (scoring Cybersource)',
          paymentMethod: 'VISA',
          amount: 1500000,
          currency: 'COP',
          rawPayload: { simulated: true, state: 'REJECTED', declineCode: 'AF' }
        },
        {
          sessionId: null,
          channel: 'GATEWAY_DIRECT',
          reference: 'EVID-REJ-NO-PERMITIDA',
          internalReference: '1099246',
          status: 'REJECTED',
          statusReason: '12',
          statusMessage: 'Transacción no permitida a la tarjeta / e-commerce bloqueado por emisor',
          paymentMethod: 'MASTERCARD',
          amount: 210000,
          currency: 'COP',
          rawPayload: { simulated: true, state: 'REJECTED', declineCode: '12' }
        }
      ];

      const stmt = db.prepare(`
        INSERT INTO transactions (
          session_id, channel, reference, internal_reference, authorization_code,
          receipt, status, status_reason, status_message, payment_method,
          amount, currency, raw_payload
        ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
      `);

      for (const tx of seedTransactions) {
        stmt.run(
          tx.sessionId,
          tx.channel,
          tx.reference,
          tx.internalReference,
          tx.authorizationCode || null,
          tx.receipt || null,
          tx.status,
          tx.statusReason,
          tx.statusMessage,
          tx.paymentMethod,
          tx.amount,
          tx.currency,
          JSON.stringify(tx.rawPayload)
        );
      }
    }
  } catch (e) {
    // Si la tabla no existe aún o hay concurrencia, omitir silenciosamente
  }
}

export function initDatabase(dbPath = defaultDbPath) {
  const dir = path.dirname(dbPath);
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }

  const db = new DatabaseSync(dbPath);
  const schemaPath = path.resolve(__dirname, 'schema.sql');
  const ddl = fs.readFileSync(schemaPath, 'utf8');
  db.exec(ddl);
  seedInitialEvidences(db);

  return {
    rawDb: db,

    saveSession(sessionData) {
      const stmt = db.prepare(`
        INSERT INTO payment_sessions (
          request_id, reference, description, amount, currency,
          buyer_name, buyer_email, buyer_document, process_url,
          status, status_reason, status_message, raw_response
        ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
      `);

      stmt.run(
        sessionData.requestId,
        sessionData.reference,
        sessionData.description || '',
        sessionData.amount,
        sessionData.currency || 'COP',
        sessionData.buyerName,
        sessionData.buyerEmail,
        sessionData.buyerDocument,
        sessionData.processUrl,
        sessionData.status || 'PENDING',
        sessionData.statusReason || 'PC',
        sessionData.statusMessage || '',
        typeof sessionData.rawResponse === 'object' ? JSON.stringify(sessionData.rawResponse) : (sessionData.rawResponse || '')
      );

      return this.getSessionByRequestId(sessionData.requestId);
    },

    updateSessionStatus(requestId, status, reason = '', message = '', rawResponse = null) {
      const stmt = db.prepare(`
        UPDATE payment_sessions
        SET status = ?, status_reason = ?, status_message = ?, raw_response = COALESCE(?, raw_response), updated_at = CURRENT_TIMESTAMP
        WHERE request_id = ?
      `);

      stmt.run(
        status,
        reason,
        message,
        rawResponse ? (typeof rawResponse === 'object' ? JSON.stringify(rawResponse) : rawResponse) : null,
        requestId
      );

      return this.getSessionByRequestId(requestId);
    },

    getSessionByRequestId(requestId) {
      const stmt = db.prepare(`SELECT * FROM payment_sessions WHERE request_id = ?`);
      return stmt.get(requestId);
    },

    saveTransaction(txData) {
      const stmt = db.prepare(`
        INSERT INTO transactions (
          session_id, channel, reference, internal_reference,
          authorization_code, receipt, status, status_reason,
          status_message, payment_method, amount, currency, raw_payload
        ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
      `);

      stmt.run(
        txData.sessionId || null,
        txData.channel || 'WEBCHECKOUT',
        txData.reference,
        txData.internalReference || null,
        txData.authorizationCode || null,
        txData.receipt || null,
        txData.status,
        txData.statusReason || '',
        txData.statusMessage || '',
        txData.paymentMethod || 'UNKNOWN',
        typeof txData.amount === 'object' && txData.amount !== null ? (txData.amount.total || 0) : Number(txData.amount || 0),
        txData.currency || 'COP',
        typeof txData.rawPayload === 'object' ? JSON.stringify(txData.rawPayload) : (txData.rawPayload || '')
      );

      return db.prepare(`SELECT * FROM transactions WHERE id = last_insert_rowid()`).get();
    },

    getTransactions(status = null) {
      if (status) {
        return db.prepare(`SELECT * FROM transactions WHERE status = ? ORDER BY created_at DESC`).all(status);
      }
      return db.prepare(`SELECT * FROM transactions ORDER BY created_at DESC`).all();
    },

    getTransactionByReference(reference) {
      const stmt = db.prepare(`SELECT * FROM transactions WHERE reference = ?`);
      const row = stmt.get(reference);
      if (row && row.raw_payload) {
        try { row.raw_payload = JSON.parse(row.raw_payload); } catch (e) {}
      }
      return row;
    },

    saveAuditLog(logData) {
      const stmt = db.prepare(`
        INSERT INTO audit_logs (
          service_type, endpoint, http_method, request_payload,
          response_payload, http_status, latency_ms
        ) VALUES (?, ?, ?, ?, ?, ?, ?)
      `);

      stmt.run(
        logData.serviceType,
        logData.endpoint,
        logData.httpMethod,
        typeof logData.requestPayload === 'object' ? JSON.stringify(logData.requestPayload) : (logData.requestPayload || ''),
        typeof logData.responsePayload === 'object' ? JSON.stringify(logData.responsePayload) : (logData.responsePayload || ''),
        logData.httpStatus || 200,
        logData.latencyMs || 0
      );

      return db.prepare(`SELECT * FROM audit_logs WHERE id = last_insert_rowid()`).get();
    },

    getAuditLogs(limit = 50) {
      return db.prepare(`SELECT * FROM audit_logs ORDER BY created_at DESC LIMIT ?`).all(limit);
    },

    close() {
      db.close();
    }
  };
}

export const db = initDatabase();
