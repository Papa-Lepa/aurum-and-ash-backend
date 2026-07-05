-- AURUM & ASH — database schema
-- Run this once against your Neon (or any Postgres) database before deploying.

CREATE TABLE IF NOT EXISTS perfumes (
  id            SERIAL PRIMARY KEY,
  name          TEXT NOT NULL,
  family        TEXT NOT NULL,
  top_notes     TEXT,
  heart_notes   TEXT,
  base_notes    TEXT,
  size          TEXT,
  price_cents   INTEGER NOT NULL CHECK (price_cents >= 0),
  created_at    TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS orders (
  id              SERIAL PRIMARY KEY,
  customer_name   TEXT NOT NULL,
  customer_email  TEXT NOT NULL,
  address         TEXT,
  total_cents     INTEGER NOT NULL CHECK (total_cents >= 0),
  status          TEXT NOT NULL DEFAULT 'received',
  created_at      TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS order_items (
  id                SERIAL PRIMARY KEY,
  order_id          INTEGER NOT NULL REFERENCES orders(id) ON DELETE CASCADE,
  perfume_id        INTEGER NOT NULL REFERENCES perfumes(id),
  perfume_name      TEXT NOT NULL,
  quantity          INTEGER NOT NULL DEFAULT 1 CHECK (quantity > 0),
  unit_price_cents  INTEGER NOT NULL CHECK (unit_price_cents >= 0)
);

CREATE INDEX IF NOT EXISTS idx_order_items_order_id ON order_items(order_id);
CREATE INDEX IF NOT EXISTS idx_perfumes_family ON perfumes(family);
