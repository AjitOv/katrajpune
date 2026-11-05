-- KatrajPune Database Schema
-- Run this in Supabase SQL Editor
-- Enables PostGIS for spatial queries on businesses

-- 1. Enable PostGIS extension
CREATE EXTENSION IF NOT EXISTS postgis;

-- 2. Businesses table
CREATE TABLE IF NOT EXISTS businesses (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  slug TEXT UNIQUE NOT NULL,
  name TEXT NOT NULL,
  description TEXT,
  category TEXT NOT NULL CHECK (category IN (
    'shopping','restaurants','healthcare','education',
    'home_services','automotive','fitness','professional_services'
  )),
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
  location geography(Point, 4326) NOT NULL,
  latitude DOUBLE PRECISION NOT NULL,
  longitude DOUBLE PRECISION NOT NULL,
  status TEXT DEFAULT 'pending' CHECK (status IN ('pending','approved','rejected')),
  owner_id UUID REFERENCES auth.users(id),
  submitted_at TIMESTAMPTZ DEFAULT NOW(),
  approved_at TIMESTAMPTZ,
  approved_by UUID REFERENCES auth.users(id),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 3. Indexes
CREATE INDEX IF NOT EXISTS idx_businesses_location ON businesses USING GIST (location);
CREATE INDEX IF NOT EXISTS idx_businesses_status ON businesses(status);
CREATE INDEX IF NOT EXISTS idx_businesses_category ON businesses(category);
CREATE INDEX IF NOT EXISTS idx_businesses_locality ON businesses(locality);
CREATE INDEX IF NOT EXISTS idx_businesses_slug ON businesses(slug);
CREATE INDEX IF NOT EXISTS idx_businesses_owner ON businesses(owner_id);

-- 4. Keep latitude/longitude synchronized with geography point
CREATE OR REPLACE FUNCTION sync_lat_long()
RETURNS TRIGGER AS $$
BEGIN
  NEW.latitude := ST_Y(NEW.location::geometry);
  NEW.longitude := ST_X(NEW.location::geometry);
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS trg_sync_lat_long ON businesses;
CREATE TRIGGER trg_sync_lat_long
BEFORE INSERT OR UPDATE OF location ON businesses
FOR EACH ROW EXECUTE FUNCTION sync_lat_long();

-- 5. Row Level Security
ALTER TABLE businesses ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Public can view approved businesses" ON businesses;
CREATE POLICY "Public can view approved businesses" ON businesses
  FOR SELECT USING (status = 'approved');

DROP POLICY IF EXISTS "Owners manage own businesses" ON businesses;
CREATE POLICY "Owners manage own businesses" ON businesses
  FOR ALL USING (auth.uid() = owner_id)
  WITH CHECK (auth.uid() = owner_id);

DROP POLICY IF EXISTS "Admins manage all businesses" ON businesses;
CREATE POLICY "Admins manage all businesses" ON businesses
  FOR ALL USING (
    EXISTS (
      SELECT 1 FROM auth.users
      WHERE id = auth.uid()
        AND raw_user_meta_data->>'role' = 'admin'
    )
  );

-- 6. Helper function: fetch approved businesses within viewport bounds
-- Usage: SELECT * FROM get_businesses_in_bounds(west, south, east, north, category_filter, limit, offset)
CREATE OR REPLACE FUNCTION get_businesses_in_bounds(
  west DOUBLE PRECISION,
  south DOUBLE PRECISION,
  east DOUBLE PRECISION,
  north DOUBLE PRECISION,
  category_filter TEXT DEFAULT NULL,
  limit_count INT DEFAULT 500,
  offset_count INT DEFAULT 0
)
RETURNS TABLE (
  id UUID,
  slug TEXT,
  name TEXT,
  category TEXT,
  locality TEXT,
  address TEXT,
  phone TEXT,
  whatsapp TEXT,
  logo_url TEXT,
  latitude DOUBLE PRECISION,
  longitude DOUBLE PRECISION,
  location_verified BOOLEAN,
  status TEXT
)
LANGUAGE plpgsql
AS $$
BEGIN
  RETURN QUERY
  SELECT
    b.id,
    b.slug,
    b.name,
    b.category,
    b.locality,
    b.address,
    b.phone,
    b.whatsapp,
    b.logo_url,
    b.latitude,
    b.longitude,
    b.location_verified,
    b.status
  FROM businesses b
  WHERE b.status = 'approved'
    AND ST_Intersects(
      b.location,
      ST_MakeEnvelope(west, south, east, north, 4326)
    )
    AND (category_filter IS NULL OR b.category = category_filter)
  ORDER BY b.name
  LIMIT limit_count OFFSET offset_count;
END;
$$;

-- 7. Helper: count approved businesses in bounds (for cluster counts)
CREATE OR REPLACE FUNCTION get_business_count_in_bounds(
  west DOUBLE PRECISION,
  south DOUBLE PRECISION,
  east DOUBLE PRECISION,
  north DOUBLE PRECISION,
  category_filter TEXT DEFAULT NULL
)
RETURNS INT
LANGUAGE plpgsql
AS $$
DECLARE
  cnt INT;
BEGIN
  SELECT COUNT(*) INTO cnt
  FROM businesses b
  WHERE b.status = 'approved'
    AND ST_Intersects(
      b.location,
      ST_MakeEnvelope(west, south, east, north, 4326)
    )
    AND (category_filter IS NULL OR b.category = category_filter);
  RETURN cnt;
END;
$$;

-- 8. Seed data: Sample Katraj, Pune businesses (center ~18.4593, 73.8456)
-- Insert only if table is empty
INSERT INTO businesses (
  slug, name, description, category, locality, address, phone,
  whatsapp, email, website, logo_url, photos, opening_hours,
  location_verified, geocoding_source, location, latitude, longitude,
  status, owner_id, submitted_at, approved_at, approved_by
)
SELECT * FROM (VALUES
  ('katraj-mart', 'Katraj Mart', 'Daily groceries and household essentials', 'shopping', 'Katraj', 'Katraj Bus Stand, Katraj, Pune', '+91 98765 43210', '+91 98765 43210', 'contact@katrajmart.com', NULL, NULL, '{}'::text[], '{"mon":"08:00-22:00","tue":"08:00-22:00","wed":"08:00-22:00","thu":"08:00-22:00","fri":"08:00-22:00","sat":"08:00-22:00","sun":"09:00-21:00"}'::jsonb, true, 'manual', ST_SetSRID(ST_MakePoint(73.8456, 18.4593), 4326)::geography, 18.4593, 73.8456, 'approved', NULL::uuid, NOW(), NOW(), NULL::uuid),
  ('sai-dining', 'Sai Dining', 'Family restaurant serving Maharashtrian and North Indian cuisine', 'restaurants', 'Katraj', 'Near Katraj Dairy, Katraj, Pune', '+91 98765 43211', '+91 98765 43211', NULL, NULL, NULL, '{}'::text[], '{"mon":"11:00-23:00","tue":"11:00-23:00","wed":"11:00-23:00","thu":"11:00-23:00","fri":"11:00-23:00","sat":"11:00-00:00","sun":"11:00-23:00"}'::jsonb, true, 'manual', ST_SetSRID(ST_MakePoint(73.8480, 18.4560), 4326)::geography, 18.4560, 73.8480, 'approved', NULL::uuid, NOW(), NOW(), NULL::uuid),
  ('katraj-hospital', 'Katraj Community Hospital', 'Multi-speciality hospital with emergency services', 'healthcare', 'Katraj', 'Katraj-Satara Road, Katraj, Pune', '+91 98765 43212', '+91 98765 43212', 'info@katrajhospital.com', NULL, NULL, '{}'::text[], '{"mon":"24 hrs","tue":"24 hrs","wed":"24 hrs","thu":"24 hrs","fri":"24 hrs","sat":"24 hrs","sun":"24 hrs"}'::jsonb, true, 'manual', ST_SetSRID(ST_MakePoint(73.8420, 18.4620), 4326)::geography, 18.4620, 73.8420, 'approved', NULL::uuid, NOW(), NOW(), NULL::uuid),
  ('pune-public-school', 'Pune Public School Katraj', 'CBSE school for primary and secondary education', 'education', 'Katraj', 'Katraj-Satara Road, Katraj, Pune', '+91 98765 43213', '+91 98765 43213', 'admission@punepublicschool.com', NULL, NULL, '{}'::text[], '{"mon":"07:30-14:30","tue":"07:30-14:30","wed":"07:30-14:30","thu":"07:30-14:30","fri":"07:30-14:30","sat":"07:30-12:30","sun":"closed"}'::jsonb, true, 'manual', ST_SetSRID(ST_MakePoint(73.8400, 18.4650), 4326)::geography, 18.4650, 73.8400, 'approved', NULL::uuid, NOW(), NOW(), NULL::uuid),
  ('raj-home-services', 'Raj Home Services', 'Plumbing, electrical and AC repair services', 'home_services', 'Katraj', 'Katraj, Pune', '+91 98765 43214', '+91 98765 43214', NULL, NULL, NULL, '{}'::text[], '{"mon":"09:00-18:00","tue":"09:00-18:00","wed":"09:00-18:00","thu":"09:00-18:00","fri":"09:00-18:00","sat":"09:00-18:00","sun":"closed"}'::jsonb, true, 'manual', ST_SetSRID(ST_MakePoint(73.8470, 18.4580), 4326)::geography, 18.4580, 73.8470, 'approved', NULL::uuid, NOW(), NOW(), NULL::uuid),
  ('katraj-auto', 'Katraj Auto Care', 'Car servicing and two-wheeler repair', 'automotive', 'Katraj', 'Katraj-Satara Road, Katraj, Pune', '+91 98765 43215', '+91 98765 43215', NULL, NULL, NULL, '{}'::text[], '{"mon":"09:00-19:00","tue":"09:00-19:00","wed":"09:00-19:00","thu":"09:00-19:00","fri":"09:00-19:00","sat":"09:00-19:00","sun":"10:00-17:00"}'::jsonb, true, 'manual', ST_SetSRID(ST_MakePoint(73.8500, 18.4550), 4326)::geography, 18.4550, 73.8500, 'approved', NULL::uuid, NOW(), NOW(), NULL::uuid),
  ('fitness-hub', 'Fitness Hub Gym', 'Gym and personal training center', 'fitness', 'Katraj', 'Near Katraj Bus Stand, Katraj, Pune', '+91 98765 43216', '+91 98765 43216', NULL, NULL, NULL, '{}'::text[], '{"mon":"06:00-22:00","tue":"06:00-22:00","wed":"06:00-22:00","thu":"06:00-22:00","fri":"06:00-22:00","sat":"07:00-21:00","sun":"08:00-20:00"}'::jsonb, true, 'manual', ST_SetSRID(ST_MakePoint(73.8460, 18.4600), 4326)::geography, 18.4600, 73.8460, 'approved', NULL::uuid, NOW(), NOW(), NULL::uuid),
  ('legal-assist', 'Legal Assist Associates', 'Professional legal and tax consultancy', 'professional_services', 'Katraj', 'Katraj, Pune', '+91 98765 43217', '+91 98765 43217', 'consult@legalassist.in', NULL, NULL, '{}'::text[], '{"mon":"10:00-18:00","tue":"10:00-18:00","wed":"10:00-18:00","thu":"10:00-18:00","fri":"10:00-18:00","sat":"10:00-15:00","sun":"closed"}'::jsonb, true, 'manual', ST_SetSRID(ST_MakePoint(73.8440, 18.4610), 4326)::geography, 18.4610, 73.8440, 'approved', NULL::uuid, NOW(), NOW(), NULL::uuid),
  ('dairy-fresh', 'Dairy Fresh Milk', 'Fresh dairy products and milk delivery', 'shopping', 'Katraj', 'Katraj Dairy, Katraj, Pune', '+91 98765 43218', '+91 98765 43218', NULL, NULL, NULL, '{}'::text[], '{"mon":"06:00-21:00","tue":"06:00-21:00","wed":"06:00-21:00","thu":"06:00-21:00","fri":"06:00-21:00","sat":"06:00-21:00","sun":"07:00-20:00"}'::jsonb, true, 'manual', ST_SetSRID(ST_MakePoint(73.8430, 18.4570), 4326)::geography, 18.4570, 73.8430, 'approved', NULL::uuid, NOW(), NOW(), NULL::uuid)
) AS v(slug, name, description, category, locality, address, phone, whatsapp, email, website, logo_url, photos, opening_hours, location_verified, geocoding_source, location, latitude, longitude, status, owner_id, submitted_at, approved_at, approved_by)
WHERE NOT EXISTS (SELECT 1 FROM businesses LIMIT 1);
