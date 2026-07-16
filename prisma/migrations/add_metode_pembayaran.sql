-- Add metode_pembayaran column to orders table
-- This column tracks the payment method for each order

ALTER TABLE orders ADD COLUMN IF NOT EXISTS metode_pembayaran VARCHAR(50) DEFAULT 'Tunai';
