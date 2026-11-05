-- Enable PostGIS
CREATE EXTENSION IF NOT EXISTS postgis;

-- Drop and recreate to ensure clean schema
DROP TABLE IF EXISTS businesses CASCADE;

-- Create businesses table
CREATE TABLE businesses (
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
  photos TEXT[] DEFAULT '{}',
  opening_hours JSONB,
  location_verified BOOLEAN DEFAULT FALSE,
  geocoding_source TEXT,
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

-- Indexes
CREATE INDEX IF NOT EXISTS idx_businesses_status ON businesses(status);
CREATE INDEX IF NOT EXISTS idx_businesses_category ON businesses(category);
CREATE INDEX IF NOT EXISTS idx_businesses_location ON businesses USING GIST (ST_SetSRID(ST_MakePoint(longitude, latitude), 4326));

-- RLS
ALTER TABLE businesses ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Public can view approved businesses" ON businesses;
CREATE POLICY "Public can view approved businesses" ON businesses FOR SELECT USING (status = 'approved');
DROP POLICY IF EXISTS "Admins manage all businesses" ON businesses;
CREATE POLICY "Admins manage all businesses" ON businesses FOR ALL USING (
  EXISTS (SELECT 1 FROM auth.users WHERE id = auth.uid() AND raw_user_meta_data->>'role' = 'admin')
);

-- Insert seed data (9 Katraj businesses)
INSERT INTO businesses (slug, name, description, category, locality, address, phone, whatsapp, email, website, logo_url, photos, opening_hours, location_verified, geocoding_source, latitude, longitude, status)
VALUES (
  'katraj-mart', 'Katraj Mart', 'Daily groceries', 'shopping', 'Katraj', 'Katraj Bus Stand', '+91 98765 43210', '+91 98765 43210', 'contact@katrajmart.com', NULL, NULL, '{}', '{"mon":"08:00-22:00"}'::jsonb, true, 'manual', 18.4593, 73.8456, 'approved'
) ON CONFLICT (slug) DO NOTHING;

INSERT INTO businesses (slug, name, description, category, locality, address, phone, whatsapp, email, website, logo_url, photos, opening_hours, location_verified, geocoding_source, latitude, longitude, status)
VALUES (
  'sai-dining', 'Sai Dining', 'Family restaurant', 'restaurants', 'Katraj', 'Near Katraj Dairy', '+91 98765 43211', '+91 98765 43211', NULL, NULL, NULL, '{}', '{"mon":"11:00-23:00"}'::jsonb, true, 'manual', 18.4560, 73.8480, 'approved'
) ON CONFLICT (slug) DO NOTHING;

INSERT INTO businesses (slug, name, description, category, locality, address, phone, whatsapp, email, website, logo_url, photos, opening_hours, location_verified, geocoding_source, latitude, longitude, status)
VALUES (
  'katraj-hospital', 'Katraj Community Hospital', 'Multi-speciality hospital', 'healthcare', 'Katraj', 'Katraj-Satara Road', '+91 98765 43212', '+91 98765 43212', 'info@katrajhospital.com', NULL, NULL, '{}', '{"mon":"24 hrs"}'::jsonb, true, 'manual', 18.4620, 73.8420, 'approved'
) ON CONFLICT (slug) DO NOTHING;

INSERT INTO businesses (slug, name, description, category, locality, address, phone, whatsapp, email, website, logo_url, photos, opening_hours, location_verified, geocoding_source, latitude, longitude, status)
VALUES (
  'pune-public-school', 'Pune Public School Katraj', 'CBSE school', 'education', 'Katraj', 'Katraj-Satara Road', '+91 98765 43213', '+91 98765 43213', 'admission@punepublicschool.com', NULL, NULL, '{}', '{"mon":"07:30-14:30"}'::jsonb, true, 'manual', 18.4650, 73.8400, 'approved'
) ON CONFLICT (slug) DO NOTHING;

INSERT INTO businesses (slug, name, description, category, locality, address, phone, whatsapp, email, website, logo_url, photos, opening_hours, location_verified, geocoding_source, latitude, longitude, status)
VALUES (
  'raj-home-services', 'Raj Home Services', 'Plumbing, electrical, AC repair', 'home_services', 'Katraj', 'Katraj', '+91 98765 43214', '+91 98765 43214', NULL, NULL, NULL, '{}', '{"mon":"09:00-18:00"}'::jsonb, true, 'manual', 18.4580, 73.8470, 'approved'
) ON CONFLICT (slug) DO NOTHING;

INSERT INTO businesses (slug, name, description, category, locality, address, phone, whatsapp, email, website, logo_url, photos, opening_hours, location_verified, geocoding_source, latitude, longitude, status)
VALUES (
  'katraj-auto', 'Katraj Auto Care', 'Car servicing', 'automotive', 'Katraj', 'Katraj-Satara Road', '+91 98765 43215', '+91 98765 43215', NULL, NULL, NULL, '{}', '{"mon":"09:00-19:00"}'::jsonb, true, 'manual', 18.4550, 73.8500, 'approved'
) ON CONFLICT (slug) DO NOTHING;

INSERT INTO businesses (slug, name, description, category, locality, address, phone, whatsapp, email, website, logo_url, photos, opening_hours, location_verified, geocoding_source, latitude, longitude, status)
VALUES (
  'fitness-hub', 'Fitness Hub Gym', 'Gym and personal training', 'fitness', 'Katraj', 'Near Katraj Bus Stand', '+91 98765 43216', '+91 98765 43216', NULL, NULL, NULL, '{}', '{"mon":"06:00-22:00"}'::jsonb, true, 'manual', 18.4600, 73.8460, 'approved'
) ON CONFLICT (slug) DO NOTHING;

INSERT INTO businesses (slug, name, description, category, locality, address, phone, whatsapp, email, website, logo_url, photos, opening_hours, location_verified, geocoding_source, latitude, longitude, status)
VALUES (
  'legal-assist', 'Legal Assist Associates', 'Legal and tax consultancy', 'professional_services', 'Katraj', 'Katraj', '+91 98765 43217', '+91 98765 43217', 'consult@legalassist.in', NULL, NULL, '{}', '{"mon":"10:00-18:00"}'::jsonb, true, 'manual', 18.4610, 73.8440, 'approved'
) ON CONFLICT (slug) DO NOTHING;

INSERT INTO businesses (slug, name, description, category, locality, address, phone, whatsapp, email, website, logo_url, photos, opening_hours, location_verified, geocoding_source, latitude, longitude, status)
VALUES (
  'dairy-fresh', 'Dairy Fresh Milk', 'Fresh dairy products', 'shopping', 'Katraj', 'Katraj Dairy', '+91 98765 43218', '+91 98765 43218', NULL, NULL, NULL, '{}', '{"mon":"06:00-21:00"}'::jsonb, true, 'manual', 18.4570, 73.8430, 'approved'
) ON CONFLICT (slug) DO NOTHING;
