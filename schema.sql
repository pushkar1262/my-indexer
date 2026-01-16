CREATE TABLE IF NOT EXISTS blocks (
    number BIGINT PRIMARY KEY,
    hash VARCHAR(66) NOT NULL,
    parent_hash VARCHAR(66) NOT NULL,
    timestamp BIGINT NOT NULL
);

CREATE TABLE IF NOT EXISTS transactions (
    hash VARCHAR(66) PRIMARY KEY,
    block_number BIGINT REFERENCES blocks(number),
    from_address VARCHAR(42) NOT NULL,
    to_address VARCHAR(42),
    value NUMERIC,
    data TEXT
);

-- Bitcoin Tables
CREATE TABLE IF NOT EXISTS btc_blocks (
    id SERIAL PRIMARY KEY,
    block_number BIGINT UNIQUE NOT NULL,
    block_hash VARCHAR(64) UNIQUE NOT NULL,
    parent_hash VARCHAR(64),
    timestamp BIGINT,
    nonce BIGINT,
    difficulty TEXT,
    size INTEGER,
    tx_count INTEGER,
    indexed_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS btc_transactions (
    id SERIAL PRIMARY KEY,
    tx_hash VARCHAR(64) UNIQUE NOT NULL,
    block_number BIGINT,
    block_hash VARCHAR(64),
    timestamp BIGINT,
    vin TEXT,
    vout TEXT,
    size INTEGER,
    weight INTEGER,
    indexed_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
