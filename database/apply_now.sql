-- ============================================================
-- KatrajPune.com — Definitive Production Schema
-- Copy and run in Supabase SQL Editor
-- ============================================================

-- 1. Enable PostGIS Extension
CREATE EXTENSION IF NOT EXISTS postgis;

-- 2. Create businesses table if not exists
CREATE TABLE IF NOT EXISTS businesses (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  slug TEXT UNIQUE NOT NULL,
  name TEXT NOT NULL,
  category TEXT NOT NULL,
  latitude DOUBLE PRECISION NOT NULL,
  longitude DOUBLE PRECISION NOT NULL,
  status TEXT NOT NULL DEFAULT 'approved'
);

-- 3. Add all remaining columns cleanly (safe if they already exist)
ALTER TABLE businesses ADD COLUMN IF NOT EXISTS description TEXT;
ALTER TABLE businesses ADD COLUMN IF NOT EXISTS locality TEXT;
ALTER TABLE businesses ADD COLUMN IF NOT EXISTS address TEXT;
ALTER TABLE businesses ADD COLUMN IF NOT EXISTS phone TEXT;
ALTER TABLE businesses ADD COLUMN IF NOT EXISTS whatsapp TEXT;
ALTER TABLE businesses ADD COLUMN IF NOT EXISTS email TEXT;
ALTER TABLE businesses ADD COLUMN IF NOT EXISTS website TEXT;
ALTER TABLE businesses ADD COLUMN IF NOT EXISTS logo_url TEXT;
ALTER TABLE businesses ADD COLUMN IF NOT EXISTS photos TEXT[] DEFAULT '{}'::text[];
ALTER TABLE businesses ADD COLUMN IF NOT EXISTS opening_hours JSONB;
ALTER TABLE businesses ADD COLUMN IF NOT EXISTS location_verified BOOLEAN DEFAULT FALSE;
ALTER TABLE businesses ADD COLUMN IF NOT EXISTS geocoding_source TEXT;
ALTER TABLE businesses ADD COLUMN IF NOT EXISTS location geography(Point, 4326);
ALTER TABLE businesses ADD COLUMN IF NOT EXISTS rating NUMERIC(2, 1);
ALTER TABLE businesses ADD COLUMN IF NOT EXISTS reviews_count INT DEFAULT 0;
ALTER TABLE businesses ADD COLUMN IF NOT EXISTS owner_id UUID REFERENCES auth.users(id) ON DELETE SET NULL;
ALTER TABLE businesses ADD COLUMN IF NOT EXISTS submitted_at TIMESTAMPTZ DEFAULT NOW();
ALTER TABLE businesses ADD COLUMN IF NOT EXISTS approved_at TIMESTAMPTZ;
ALTER TABLE businesses ADD COLUMN IF NOT EXISTS approved_by UUID REFERENCES auth.users(id) ON DELETE SET NULL;
ALTER TABLE businesses ADD COLUMN IF NOT EXISTS created_at TIMESTAMPTZ DEFAULT NOW();
ALTER TABLE businesses ADD COLUMN IF NOT EXISTS updated_at TIMESTAMPTZ DEFAULT NOW();

-- 4. Indexes
CREATE INDEX IF NOT EXISTS idx_businesses_status ON businesses(status);
CREATE INDEX IF NOT EXISTS idx_businesses_category ON businesses(category);
CREATE INDEX IF NOT EXISTS idx_businesses_locality ON businesses(locality);
CREATE INDEX IF NOT EXISTS idx_businesses_rating ON businesses(rating DESC NULLS LAST);
CREATE INDEX IF NOT EXISTS idx_businesses_location ON businesses USING GIST (location);

-- 5. Row Level Security (RLS)
ALTER TABLE businesses ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Public can view approved businesses" ON businesses;
CREATE POLICY "Public can view approved businesses"
  ON businesses FOR SELECT
  USING (status = 'approved');

DROP POLICY IF EXISTS "Allow service role full access" ON businesses;
CREATE POLICY "Allow service role full access"
  ON businesses FOR ALL
  TO service_role
  USING (true)
  WITH CHECK (true);
