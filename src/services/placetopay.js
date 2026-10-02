import crypto from 'node:crypto';

const DEFAULT_CONFIG = {
  login: '2d9eaf1e662518756a3d78806543af5b',
  secretKey: '3YC5brb5eAR4xBGQ',
  checkoutUrl: 'https://checkout-test.placetopay.com',
  gatewayUrl: 'https://api-test.placetopay.com/rest'
};

export class PlacetopayService {
  constructor(config = {}) {
    this.login = config.login || process.env.P2P_LOGIN || DEFAULT_CONFIG.login;
    this.secretKey = config.secretKey || process.env.P2P_SECRET_KEY || DEFAULT_CONFIG.secretKey;
    this.checkoutUrl = config.checkoutUrl || process.env.P2P_CHECKOUT_URL || DEFAULT_CONFIG.checkoutUrl;
    this.gatewayUrl = config.gatewayUrl || process.env.P2P_GATEWAY_URL || DEFAULT_CONFIG.gatewayUrl;
  }

  generateAuth() {
    const seed = new Date().toISOString();
    const rawNonce = crypto.randomBytes(16);
    const nonce = rawNonce.toString('base64');
    const bufferToHash = Buffer.concat([
      rawNonce,
      Buffer.from(seed, 'utf8'),
      Buffer.from(this.secretKey, 'utf8')
    ]);
    const tranKey = crypto.createHash('sha256').update(bufferToHash).digest('base64');

    return {
      login: this.login,
      tranKey,
      nonce,
      seed
    };
  }

  async createWebcheckoutSession(payload, db = null) {
    const endpoint = `${this.checkoutUrl}/api/session`;
    const auth = this.generateAuth();

    const expiration = new Date(Date.now() + 24 * 3600000).toISOString();

    const requestBody = {
      auth,
      locale: 'es_CO',
      buyer: payload.buyer,
      payment: payload.payment,
      expiration,
      returnUrl: payload.returnUrl || 'http://localhost:3000/response',
      ipAddress: payload.ipAddress || '127.0.0.1',
      userAgent: payload.userAgent || 'Mozilla/5.0 (Windows NT 10.0; Win64; x64)'
    };

    const startTime = Date.now();
    let httpStatus = 0;
    let responseData = null;

    try {
      const response = await fetch(endpoint, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(requestBody)
      });

      httpStatus = response.status;
      responseData = await response.json();
      const latencyMs = Date.now() - startTime;

      if (db) {
        db.saveAuditLog({
          serviceType: 'WEBCHECKOUT_SESSION',
          endpoint,
          httpMethod: 'POST',
          requestPayload: requestBody,
          responsePayload: responseData,
          httpStatus,
          latencyMs
        });

        if (responseData.status && responseData.status.status === 'OK' && responseData.requestId) {
          db.saveSession({
            requestId: responseData.requestId,
            reference: payload.payment.reference,
            description: payload.payment.description,
            amount: payload.payment.amount.total,
            currency: payload.payment.amount.currency,
            buyerName: `${payload.buyer.name} ${payload.buyer.surname}`,
            buyerEmail: payload.buyer.email,
            buyerDocument: payload.buyer.document,
            processUrl: responseData.processUrl,
            status: 'PENDING',
            statusReason: responseData.status.reason,
            statusMessage: responseData.status.message,
            rawResponse: responseData
          });
        }
      }

      return {
        success: responseData.status?.status === 'OK',
        requestId: responseData.requestId,
        processUrl: responseData.processUrl,
        status: responseData.status,
        raw: responseData
      };
    } catch (err) {
      const latencyMs = Date.now() - startTime;
      if (db) {
        db.saveAuditLog({
          serviceType: 'WEBCHECKOUT_SESSION',
          endpoint,
          httpMethod: 'POST',
          requestPayload: requestBody,
          responsePayload: { error: err.message },
          httpStatus: 500,
          latencyMs
        });
      }
      throw err;
    }
  }

  async getSessionStatus(requestId, db = null) {
    const endpoint = `${this.checkoutUrl}/api/session/${requestId}`;
    const auth = this.generateAuth();
    const requestBody = { auth };

    const startTime = Date.now();
    let httpStatus = 0;
    let responseData = null;

    try {
      const response = await fetch(endpoint, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(requestBody)
      });

      httpStatus = response.status;
      responseData = await response.json();
      const latencyMs = Date.now() - startTime;

      if (db) {
        db.saveAuditLog({
          serviceType: 'WEBCHECKOUT_QUERY',
          endpoint,
          httpMethod: 'POST',
          requestPayload: requestBody,
          responsePayload: responseData,
          httpStatus,
          latencyMs
        });

        if (responseData.status) {
          db.updateSessionStatus(
            requestId,
            responseData.status.status,
            responseData.status.reason,
            responseData.status.message,
            responseData
          );

          if (responseData.payment && responseData.payment.length > 0) {
            const p = responseData.payment[0];
            db.saveTransaction({
              sessionId: null,
              channel: 'WEBCHECKOUT',
              reference: responseData.request?.payment?.reference || `REQ-${requestId}`,
              internalReference: p.internalReference ? String(p.internalReference) : null,
              authorizationCode: p.authorization || null,
              receipt: p.receipt ? String(p.receipt) : null,
              status: p.status?.status || responseData.status.status,
              statusReason: p.status?.reason || '',
              statusMessage: p.status?.message || '',
              paymentMethod: p.paymentMethodName || p.paymentMethod || 'CARD',
              amount: p.amount?.to?.total || 0,
              currency: p.amount?.to?.currency || 'COP',
              rawPayload: p
            });
          }
        }
      }

      return {
        success: responseData.status?.status === 'APPROVED' || responseData.status?.status === 'OK',
        status: responseData.status?.status,
        statusDetails: responseData.status,
        payment: responseData.payment,
        raw: responseData
      };
    } catch (err) {
      const latencyMs = Date.now() - startTime;
      if (db) {
        db.saveAuditLog({
          serviceType: 'WEBCHECKOUT_QUERY',
          endpoint,
          httpMethod: 'POST',
          requestPayload: requestBody,
          responsePayload: { error: err.message },
          httpStatus: 500,
          latencyMs
        });
      }
      throw err;
    }
  }

  async processGateway(payload, db = null) {
    const endpoint = `${this.gatewayUrl}/gateway/process`;
    const auth = this.generateAuth();

    const requestBody = {
      auth,
      locale: 'es_CO',
      buyer: payload.buyer,
      payment: payload.payment,
      instrument: payload.instrument,
      ipAddress: payload.ipAddress || '127.0.0.1',
      userAgent: payload.userAgent || 'Mozilla/5.0'
    };

    const startTime = Date.now();
    let httpStatus = 0;
    let responseData = null;

    try {
      const response = await fetch(endpoint, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(requestBody)
      });

      httpStatus = response.status;
      responseData = await response.json();
      const latencyMs = Date.now() - startTime;

      if (db) {
        db.saveAuditLog({
          serviceType: 'GATEWAY_PROCESS',
          endpoint,
          httpMethod: 'POST',
          requestPayload: requestBody,
          responsePayload: responseData,
          httpStatus,
          latencyMs
        });

        if (responseData.status) {
          db.saveTransaction({
            channel: 'GATEWAY',
            reference: payload.payment.reference,
            internalReference: responseData.internalReference ? String(responseData.internalReference) : null,
            authorizationCode: responseData.authorization || null,
            receipt: responseData.receipt ? String(responseData.receipt) : null,
            status: responseData.status.status,
            statusReason: responseData.status.reason,
            statusMessage: responseData.status.message,
            paymentMethod: 'CREDIT_CARD',
            amount: payload.payment.amount.total,
            currency: payload.payment.amount.currency,
            rawPayload: responseData
          });
        }
      }

      return {
        success: responseData.status?.status === 'APPROVED',
        status: responseData.status?.status,
        details: responseData
      };
    } catch (err) {
      const latencyMs = Date.now() - startTime;
      if (db) {
        db.saveAuditLog({
          serviceType: 'GATEWAY_PROCESS',
          endpoint,
          httpMethod: 'POST',
          requestPayload: requestBody,
          responsePayload: { error: err.message },
          httpStatus: 500,
          latencyMs
        });
      }
      throw err;
    }
  }
}
