-- ==============================================================================
-- ESQUEMA RELACIONAL SQLITE - PLACETOPAY SDD
-- ==============================================================================

-- 1. Sesiones de Pago (WebCheckout)
CREATE TABLE IF NOT EXISTS payment_sessions (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    request_id INTEGER UNIQUE NOT NULL,
    reference VARCHAR(80) NOT NULL,
    description TEXT,
    amount REAL NOT NULL,
    currency VARCHAR(3) NOT NULL DEFAULT 'COP',
    buyer_name VARCHAR(160) NOT NULL,
    buyer_email VARCHAR(120) NOT NULL,
    buyer_document VARCHAR(30) NOT NULL,
    process_url TEXT NOT NULL,
    status VARCHAR(20) NOT NULL DEFAULT 'PENDING', -- 'PENDING', 'APPROVED', 'REJECTED'
    status_reason VARCHAR(10),
    status_message TEXT,
    raw_response TEXT,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- 2. Transacciones Procesadas (Evidencias de Estados: Aprobado, Pendiente, Rechazado)
CREATE TABLE IF NOT EXISTS transactions (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    session_id INTEGER,
    channel VARCHAR(20) NOT NULL, -- 'WEBCHECKOUT' o 'GATEWAY'
    reference VARCHAR(80) NOT NULL,
    internal_reference VARCHAR(50),
    authorization_code VARCHAR(30),
    receipt VARCHAR(50),
    status VARCHAR(20) NOT NULL, -- 'APPROVED', 'PENDING', 'REJECTED'
    status_reason VARCHAR(10),
    status_message TEXT,
    payment_method VARCHAR(50),
    amount REAL NOT NULL,
    currency VARCHAR(3) NOT NULL DEFAULT 'COP',
    raw_payload TEXT,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY(session_id) REFERENCES payment_sessions(id)
);

-- 3. Registro de Auditoría de Peticiones y Respuestas HTTP
CREATE TABLE IF NOT EXISTS audit_logs (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    service_type VARCHAR(30) NOT NULL, -- 'WEBCHECKOUT_SESSION', 'WEBCHECKOUT_QUERY', 'GATEWAY_PROCESS'
    endpoint TEXT NOT NULL,
    http_method VARCHAR(10) NOT NULL,
    request_payload TEXT,
    response_payload TEXT,
    http_status INTEGER,
    latency_ms INTEGER,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX IF NOT EXISTS idx_sessions_request_id ON payment_sessions(request_id);
CREATE INDEX IF NOT EXISTS idx_sessions_reference ON payment_sessions(reference);
CREATE INDEX IF NOT EXISTS idx_transactions_status ON transactions(status);
