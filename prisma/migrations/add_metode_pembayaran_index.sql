-- Add index for metode_pembayaran column
CREATE INDEX IF NOT EXISTS idx_orders_metode_pembayaran ON orders(metode_pembayaran);
