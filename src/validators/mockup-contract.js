// ==============================================================================
// VALIDADOR DE CONTRATO DE DATOS PARA MOCKUP / FORMULARIO MVP
// ==============================================================================

const ALLOWED_DOCUMENT_TYPES = ['CC', 'CE', 'TI', 'NIT', 'PPN', 'RUT'];
const ALLOWED_CURRENCIES = ['COP', 'USD'];
const ALLOWED_CHANNELS = ['WEBCHECKOUT', 'GATEWAY_DIRECT'];

export function validateMockupPaymentPayload(payload) {
  const errors = [];

  if (!payload || typeof payload !== 'object') {
    return { valid: false, errors: ['El cuerpo de la petición debe ser un objeto JSON válido'] };
  }

  // 1. Validar Buyer
  const buyer = payload.buyer;
  if (!buyer || typeof buyer !== 'object') {
    errors.push('El objeto buyer es obligatorio');
  } else {
    if (!buyer.name || typeof buyer.name !== 'string' || buyer.name.trim().length < 2) {
      errors.push('buyer.name es requerido (mínimo 2 caracteres)');
    }
    if (!buyer.surname || typeof buyer.surname !== 'string' || buyer.surname.trim().length < 2) {
      errors.push('buyer.surname es requerido (mínimo 2 caracteres)');
    }
    if (!buyer.email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(buyer.email)) {
      errors.push('buyer.email debe ser una dirección de correo válida');
    }
    if (!buyer.documentType || !ALLOWED_DOCUMENT_TYPES.includes(buyer.documentType)) {
      errors.push(`buyer.documentType debe ser uno de: ${ALLOWED_DOCUMENT_TYPES.join(', ')}`);
    }
    if (!buyer.document || typeof buyer.document !== 'string' || buyer.document.trim().length < 5) {
      errors.push('buyer.document es requerido (mínimo 5 caracteres)');
    }
    if (!buyer.mobile || !/^[0-9]{7,15}$/.test(buyer.mobile.replace(/[\s+-]/g, ''))) {
      errors.push('buyer.mobile debe ser un número telefónico válido (entre 7 y 15 dígitos)');
    }
  }

  // 2. Validar Payment
  const payment = payload.payment;
  if (!payment || typeof payment !== 'object') {
    errors.push('El objeto payment es obligatorio');
  } else {
    if (!payment.reference || typeof payment.reference !== 'string' || payment.reference.trim().length < 3) {
      errors.push('payment.reference es requerido (mínimo 3 caracteres alfanuméricos)');
    }
    if (!payment.description || typeof payment.description !== 'string' || payment.description.trim().length === 0) {
      errors.push('payment.description es requerido para la orden');
    }
    // Normalizar amount si viene como número
    if (typeof payment.amount === 'number') {
      payment.amount = { total: payment.amount, currency: payment.currency || 'COP' };
    }

    if (!payment.amount || typeof payment.amount !== 'object') {
      errors.push('payment.amount es requerido');
    } else {
      if (!payment.amount.currency || !ALLOWED_CURRENCIES.includes(payment.amount.currency)) {
        errors.push(`payment.amount.currency debe ser uno de: ${ALLOWED_CURRENCIES.join(', ')}`);
      }
      if (typeof payment.amount.total !== 'number' || payment.amount.total <= 0) {
        errors.push('payment.amount.total debe ser un número positivo mayor a 0');
      }
    }
  }

  // 3. Validar Canal (si se proporciona)
  const channel = payload.channel || 'WEBCHECKOUT';
  if (!ALLOWED_CHANNELS.includes(channel)) {
    errors.push(`channel debe ser uno de: ${ALLOWED_CHANNELS.join(', ')}`);
  }

  // 4. Validar datos de tarjeta si el canal es GATEWAY_DIRECT
  if (channel === 'GATEWAY_DIRECT') {
    const card = payload.instrument?.card || payload.card;
    if (!card || typeof card !== 'object') {
      errors.push('card o instrument.card es requerido para el canal GATEWAY_DIRECT');
    } else {
      if (!card.number || !/^[0-9]{13,19}$/.test(card.number.replace(/\s/g, ''))) {
        errors.push('instrument.card.number debe ser un número de tarjeta válido (13 a 19 dígitos)');
      }
      const expMonth = card.expMonth || card.expirationMonth;
      if (!expMonth || !/^(0[1-9]|1[0-2]|[1-9])$/.test(String(expMonth))) {
        errors.push('instrument.card.expMonth debe ser un mes válido en formato MM (01-12)');
      }
      const expYear = card.expYear || card.expirationYear;
      if (!expYear || !/^[0-9]{2,4}$/.test(String(expYear))) {
        errors.push('instrument.card.expYear debe ser un año válido en formato YY o YYYY');
      }
      if (!card.cvv || !/^[0-9]{3,4}$/.test(card.cvv)) {
        errors.push('instrument.card.cvv debe ser un código de seguridad de 3 o 4 dígitos');
      }
      if (card.installments !== undefined && (typeof card.installments !== 'number' || card.installments < 1 || card.installments > 36)) {
        errors.push('instrument.card.installments debe ser un número de cuotas entre 1 y 36');
      }
    }
  }

  return {
    valid: errors.length === 0,
    isValid: errors.length === 0,
    errors,
    sanitized: errors.length === 0 ? {
      buyer: {
        name: buyer.name.trim(),
        surname: buyer.surname.trim(),
        email: buyer.email.trim().toLowerCase(),
        documentType: buyer.documentType,
        document: buyer.document.trim(),
        mobile: buyer.mobile.trim(),
        address: buyer.street ? {
          street: buyer.street.trim(),
          city: (buyer.city || 'Bogotá').trim(),
          country: (buyer.country || 'CO').trim()
        } : undefined
      },
      payment: {
        reference: payment.reference.trim(),
        description: payment.description.trim(),
        amount: {
          currency: payment.amount.currency,
          total: Number(payment.amount.total)
        }
      },
      channel,
      returnUrl: payload.returnUrl || 'http://localhost:3000/response',
      ipAddress: payload.ipAddress || '127.0.0.1',
      userAgent: payload.userAgent || 'Placetopay-Client/1.0'
    } : null
  };
}

export const validateMockupPayload = validateMockupPaymentPayload;

