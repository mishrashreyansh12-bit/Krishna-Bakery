-- ─── Migration: Order Experience Features ────────────────────────────────────
-- Run this in Supabase SQL Editor

-- Add delivery_date column to orders
ALTER TABLE orders ADD COLUMN IF NOT EXISTS delivery_date text DEFAULT '';

-- Add combo_discount column
ALTER TABLE orders ADD COLUMN IF NOT EXISTS combo_discount integer DEFAULT 0;

-- Add tracking_status column
ALTER TABLE orders ADD COLUMN IF NOT EXISTS tracking_status text DEFAULT 'confirmed';
-- tracking_status values: confirmed → preparing → out_for_delivery → delivered

-- Add notes column for special instructions
ALTER TABLE orders ADD COLUMN IF NOT EXISTS notes text DEFAULT '';

-- Create order_tracking table for detailed tracking
CREATE TABLE IF NOT EXISTS order_tracking (
  id          uuid primary key default gen_random_uuid(),
  order_id    uuid references orders(id) on delete cascade,
  status      text not null,
  message     text,
  updated_at  timestamptz default now()
);

ALTER TABLE order_tracking ENABLE ROW LEVEL SECURITY;

-- Allow public read on order_tracking (for tracking page)
CREATE POLICY IF NOT EXISTS "Public can read tracking" ON order_tracking
  FOR SELECT USING (true);

-- Allow public insert on orders (already exists, just ensuring)
CREATE POLICY IF NOT EXISTS "Public can insert orders" ON orders
  FOR INSERT WITH CHECK (true);

-- Allow public read on orders by contact (for tracking)
CREATE POLICY IF NOT EXISTS "Public can read own orders" ON orders
  FOR SELECT USING (true);
