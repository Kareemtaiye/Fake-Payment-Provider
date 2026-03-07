-- Enums
CREATE TYPE payment_method AS ENUM ('CARD', 'BANK_TRANSFER');
CREATE TYPE payment_status AS ENUM ('PENDING', 'PROCESSING', 'SUCCESS', 'FAILED'. "UNKNOWN");


-- Tables
-- Merchants
CREATE TABLE merchants (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name VARCHAR(255) NOT NULL,
    api_key VARCHAR(255) UNIQUE NOT NULL,
    webhook_url TEXT NOT NULL,
    webhook_secret VARCHAR(255) NOT NULL,
    created_at TIMESTAMP DEFAULT NOW()
);

-- Payments 
CREATE TABLE payments (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    merchant_id UUID REFERENCES merchants(id),
    reference VARCHAR(255) UNIQUE NOT NULL,
    method payment_method,
    amount BIGINT NOT NULL,
    currency TEXT DEFAULT 'NGN',
    status payment_status DEFAULT 'PENDING',
    metadata JSONB,
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW()
);

-- Events
CREATE TABLE events (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    payment_id UUID REFERENCES payments(id),
    merchant_id UUID REFERENCES merchants(id),
    event_type VARCHAR(50) NOT NULL, -- e.g., charge.success, charge.failed
    payload JSONB NOT NULL,
    created_at TIMESTAMP DEFAULT NOW()
);

-- Webhook Deliveries
CREATE TABLE webhook_deliveries (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    payment_id UUID REFERENCES payments(id),
    merchant_id UUID REFERENCES merchants(id),
    event_id UUID REFERENCES events(id),
    attempt_number INT DEFAULT 1,
    response_status INT,
    delivered_at TIMESTAMP,
    next_retry_at TIMESTAMP,
    created_at TIMESTAMP DEFAULT NOW()
);

-- Idempotency keys
CREATE TABLE idempotency_keys (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    merchant_id UUID REFERENCES merchants(id),
    payment_id UUID REFERENCES payments(id),
    key TEXT NOT NULL,
    request_hash TEXT,
    created_at TIMESTAMP DEFAULT NOW(),
    UNIQUE(key, merchant_id)
);