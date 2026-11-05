import fs from "fs"
import path from "path"

const jsonPath = path.join(process.cwd(), "data", "katraj_businesses.json")
const businesses = JSON.parse(fs.readFileSync(jsonPath, "utf-8"))

const header = `-- ============================================================
-- KatrajPune.com — 1,441 Real Google Maps Businesses & Production Schema
-- Safe to run repeatedly in Supabase SQL Editor
-- ============================================================

-- 1. Enable PostGIS Extension
CREATE EXTENSION IF NOT EXISTS postgis;

-- 2. Create businesses table if it doesn't exist
CREATE TABLE IF NOT EXISTS businesses (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  slug TEXT UNIQUE NOT NULL,
  name TEXT NOT NULL,
  description TEXT,
  category TEXT NOT NULL,
  locality TEXT,
  address TEXT,
  phone TEXT,
  whatsapp TEXT,
  email TEXT,
  website TEXT,
  logo_url TEXT,
  photos TEXT[] DEFAULT '{}'::text[],
  opening_hours JSONB,
  location_verified BOOLEAN DEFAULT FALSE,
  geocoding_source TEXT,
  location geography(Point, 4326),
  latitude DOUBLE PRECISION NOT NULL,
  longitude DOUBLE PRECISION NOT NULL,
  rating NUMERIC(2, 1),
  reviews_count INT DEFAULT 0,
  status TEXT NOT NULL DEFAULT 'approved',
  owner_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  submitted_at TIMESTAMPTZ DEFAULT NOW(),
  approved_at TIMESTAMPTZ,
  approved_by UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Ensure all columns exist (in case table was previously created with fewer columns)
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

-- Indexes
CREATE INDEX IF NOT EXISTS idx_businesses_status ON businesses(status);
CREATE INDEX IF NOT EXISTS idx_businesses_category ON businesses(category);
CREATE INDEX IF NOT EXISTS idx_businesses_locality ON businesses(locality);
CREATE INDEX IF NOT EXISTS idx_businesses_rating ON businesses(rating DESC NULLS LAST);
CREATE INDEX IF NOT EXISTS idx_businesses_location ON businesses USING GIST (location);

-- 3. Enable Row Level Security (RLS) & Policies
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

-- ============================================================
-- 4. INSERT 1,441 REAL KATRAJ GOOGLE MAPS BUSINESSES
-- ============================================================

`

const BATCH_SIZE = 50
let insertStatements = ""

for (let i = 0; i < businesses.length; i += BATCH_SIZE) {
  const batch = businesses.slice(i, i + BATCH_SIZE)
  insertStatements += `INSERT INTO businesses (
  slug, name, description, category, locality, address, phone,
  whatsapp, email, website, logo_url, photos, opening_hours,
  location_verified, geocoding_source, location, latitude, longitude,
  rating, reviews_count, status
) VALUES\n`

  const values = batch.map((b: any) => {
    const escape = (str: string | null) => (str ? `'${str.replace(/'/g, "''")}'` : "NULL")
    const photosArray = `'{"${b.photos[0]}"}'::text[]`
    const hoursJson = `'${JSON.stringify(b.opening_hours)}'::jsonb`
    const geom = `ST_SetSRID(ST_MakePoint(${b.longitude}, ${b.latitude}), 4326)::geography`
    return `  (${escape(b.slug)}, ${escape(b.name)}, ${escape(b.description)}, ${escape(b.category)}, ${escape(b.locality)}, ${escape(b.address)}, ${escape(b.phone)}, ${escape(b.whatsapp)}, ${escape(b.email)}, ${escape(b.website)}, ${escape(b.logo_url)}, ${photosArray}, ${hoursJson}, true, 'google_maps_live', ${geom}, ${b.latitude}, ${b.longitude}, ${b.rating}, ${b.reviews_count}, 'approved')`
  })

  insertStatements += values.join(",\n") + "\nON CONFLICT (slug) DO UPDATE SET\n" +
    "  address = EXCLUDED.address,\n" +
    "  rating = EXCLUDED.rating,\n" +
    "  reviews_count = EXCLUDED.reviews_count,\n" +
    "  photos = EXCLUDED.photos,\n" +
    "  logo_url = EXCLUDED.logo_url,\n" +
    "  phone = EXCLUDED.phone,\n" +
    "  whatsapp = EXCLUDED.whatsapp,\n" +
    "  location = EXCLUDED.location;\n\n"
}

const fullSql = header + insertStatements
const seedPath = path.join(process.cwd(), "database", "seed_1000_businesses.sql")
fs.writeFileSync(seedPath, fullSql, "utf-8")
console.log(`Saved: ${seedPath} (${(fullSql.length / 1024 / 1024).toFixed(2)} MB)`)

// Also write schema-only apply_now.sql
const applyPath = path.join(process.cwd(), "database", "apply_now.sql")
fs.writeFileSync(applyPath, header + "-- Run database/seed_1000_businesses.sql to insert all 1,441 businesses\n", "utf-8")
console.log(`Saved: ${applyPath}`)

