-- Run this in Supabase SQL Editor to add email column to existing orders table
ALTER TABLE orders ADD COLUMN IF NOT EXISTS email text default '';
