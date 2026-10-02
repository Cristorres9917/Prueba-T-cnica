import { DatabaseSync } from 'node:sqlite';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const defaultDbPath = path.resolve(process.cwd(), 'data', 'placetopay.db');

export function initDatabase(dbPath = defaultDbPath) {
  const dir = path.dirname(dbPath);
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }

  const db = new DatabaseSync(dbPath);
  const schemaPath = path.resolve(__dirname, 'schema.sql');
  const ddl = fs.readFileSync(schemaPath, 'utf8');
  db.exec(ddl);

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
        txData.amount,
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
