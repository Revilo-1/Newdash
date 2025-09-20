-- Migration: add sold_for to sales_items
ALTER TABLE public.sales_items
ADD COLUMN IF NOT EXISTS sold_for TEXT DEFAULT 'self'; -- values: 'self' | 'gitte'

-- Optional: backfill can remain default

-- Policy unchanged; column is per-row metadata
