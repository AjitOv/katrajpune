-- Migration 003: Add rating and reviews_count to businesses
ALTER TABLE businesses 
  ADD COLUMN IF NOT EXISTS rating NUMERIC(2, 1),
  ADD COLUMN IF NOT EXISTS reviews_count INT DEFAULT 0;

CREATE INDEX IF NOT EXISTS idx_businesses_rating ON businesses(rating DESC NULLS LAST);

