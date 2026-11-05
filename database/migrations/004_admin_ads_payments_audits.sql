-- ============================================================
-- Migration 004: Admin, Ads, Payment Transactions & Zotoz Audits
-- KatrajPune.com — Additive Schema
-- ============================================================

-- 1. Enhance businesses table with payment and featured fields
ALTER TABLE businesses ADD COLUMN IF NOT EXISTS featured BOOLEAN DEFAULT FALSE;
ALTER TABLE businesses ADD COLUMN IF NOT EXISTS payment_status TEXT DEFAULT 'unpaid' CHECK (payment_status IN ('unpaid', 'pending', 'paid', 'refunded'));
ALTER TABLE businesses ADD COLUMN IF NOT EXISTS payment_id TEXT;

CREATE INDEX IF NOT EXISTS idx_businesses_featured ON businesses(featured) WHERE featured = TRUE;
CREATE INDEX IF NOT EXISTS idx_businesses_payment_status ON businesses(payment_status);

-- 2. Create ad_campaigns table
CREATE TABLE IF NOT EXISTS ad_campaigns (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  advertiser_name TEXT NOT NULL,
  image_url TEXT NOT NULL,
  destination_url TEXT NOT NULL,
  placement TEXT NOT NULL CHECK (placement IN (
    'homepage_top',
    'homepage_promo',
    'directory_between',
    'category_banner',
    'business_profile',
    'sponsored_listing'
  )),
  start_date DATE NOT NULL,
  end_date DATE NOT NULL,
  priority INT DEFAULT 1,
  status TEXT NOT NULL DEFAULT 'active' CHECK (status IN ('active', 'paused', 'scheduled', 'ended')),
  notes TEXT,
  impressions_count INT DEFAULT 0,
  clicks_count INT DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_ad_campaigns_placement_status ON ad_campaigns(placement, status);
CREATE INDEX IF NOT EXISTS idx_ad_campaigns_dates ON ad_campaigns(start_date, end_date);

-- 3. Create payment_transactions table
CREATE TABLE IF NOT EXISTS payment_transactions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  transaction_ref TEXT UNIQUE NOT NULL,
  business_id UUID REFERENCES businesses(id) ON DELETE SET NULL,
  business_name TEXT NOT NULL,
  business_slug TEXT,
  amount NUMERIC(10, 2) NOT NULL DEFAULT 350.00,
  currency TEXT NOT NULL DEFAULT 'INR',
  payment_gateway TEXT NOT NULL DEFAULT 'razorpay',
  gateway_payment_id TEXT,
  gateway_order_id TEXT,
  gateway_signature TEXT,
  status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'verified', 'failed')),
  payer_name TEXT,
  payer_email TEXT,
  payer_phone TEXT,
  metadata JSONB DEFAULT '{}'::jsonb,
  verified_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_payment_transactions_ref ON payment_transactions(transaction_ref);
CREATE INDEX IF NOT EXISTS idx_payment_transactions_status ON payment_transactions(status);
CREATE INDEX IF NOT EXISTS idx_payment_transactions_business ON payment_transactions(business_id);

-- 4. Create business_audit_enquiries table (Zotoz AI Visibility Audit)
CREATE TABLE IF NOT EXISTS business_audit_enquiries (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  business_name TEXT NOT NULL,
  owner_name TEXT NOT NULL,
  phone TEXT NOT NULL,
  email TEXT,
  website_url TEXT,
  category TEXT,
  status TEXT NOT NULL DEFAULT 'new' CHECK (status IN ('new', 'in_progress', 'completed', 'contacted')),
  notes TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_audit_enquiries_status ON business_audit_enquiries(status);
CREATE INDEX IF NOT EXISTS idx_audit_enquiries_created ON business_audit_enquiries(created_at DESC);

-- 5. Create site_settings table (dynamic configuration)
CREATE TABLE IF NOT EXISTS site_settings (
  key TEXT PRIMARY KEY,
  value JSONB NOT NULL,
  description TEXT,
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Seed default settings if not exists
INSERT INTO site_settings (key, value, description)
VALUES 
  ('support_whatsapp', '{"phone": "+91 70208 88195", "cleanNumber": "917020888195"}'::jsonb, 'Global WhatsApp support contact'),
  ('zotoz_audit_promo', '{"enabled": true, "headline": "Is Your Business Visible on AI Search?", "destinationUrl": "/free-ai-audit"}'::jsonb, 'Zotoz AI Audit promotional campaign settings'),
  ('listing_pricing', '{"feeINR": 350, "slaHours": 48}'::jsonb, 'Listing fee and SLA hours')
ON CONFLICT (key) DO NOTHING;

-- 6. Row Level Security (RLS) Policies
ALTER TABLE ad_campaigns ENABLE ROW LEVEL SECURITY;
ALTER TABLE payment_transactions ENABLE ROW LEVEL SECURITY;
ALTER TABLE business_audit_enquiries ENABLE ROW LEVEL SECURITY;
ALTER TABLE site_settings ENABLE ROW LEVEL SECURITY;

-- Ad campaigns: Public can read active ads within date range
DROP POLICY IF EXISTS "Public can view active ads" ON ad_campaigns;
CREATE POLICY "Public can view active ads" ON ad_campaigns
  FOR SELECT USING (
    status = 'active'
    AND CURRENT_DATE >= start_date
    AND CURRENT_DATE <= end_date
  );

DROP POLICY IF EXISTS "Admins manage all ads" ON ad_campaigns;
CREATE POLICY "Admins manage all ads" ON ad_campaigns
  FOR ALL USING (
    EXISTS (
      SELECT 1 FROM auth.users
      WHERE id = auth.uid()
        AND raw_user_meta_data->>'role' = 'admin'
    )
  );

-- Payment transactions: Public can insert pending transaction (during checkout)
DROP POLICY IF EXISTS "Public can create payment transactions" ON payment_transactions;
CREATE POLICY "Public can create payment transactions" ON payment_transactions
  FOR INSERT WITH CHECK (status = 'pending');

-- Public can read their own transaction by transaction_ref
DROP POLICY IF EXISTS "Public can view own transaction by ref" ON payment_transactions;
CREATE POLICY "Public can view own transaction by ref" ON payment_transactions
  FOR SELECT USING (TRUE);

DROP POLICY IF EXISTS "Admins manage all payment transactions" ON payment_transactions;
CREATE POLICY "Admins manage all payment transactions" ON payment_transactions
  FOR ALL USING (
    EXISTS (
      SELECT 1 FROM auth.users
      WHERE id = auth.uid()
        AND raw_user_meta_data->>'role' = 'admin'
    )
  );

-- Audit enquiries: Public can insert enquiries
DROP POLICY IF EXISTS "Public can create audit enquiries" ON business_audit_enquiries;
CREATE POLICY "Public can create audit enquiries" ON business_audit_enquiries
  FOR INSERT WITH CHECK (TRUE);

DROP POLICY IF EXISTS "Admins manage audit enquiries" ON business_audit_enquiries;
CREATE POLICY "Admins manage audit enquiries" ON business_audit_enquiries
  FOR ALL USING (
    EXISTS (
      SELECT 1 FROM auth.users
      WHERE id = auth.uid()
        AND raw_user_meta_data->>'role' = 'admin'
    )
  );

-- Site settings: Public can read, Admins can edit
DROP POLICY IF EXISTS "Public can read site settings" ON site_settings;
CREATE POLICY "Public can read site settings" ON site_settings
  FOR SELECT USING (TRUE);

DROP POLICY IF EXISTS "Admins can update site settings" ON site_settings;
CREATE POLICY "Admins can update site settings" ON site_settings
  FOR ALL USING (
    EXISTS (
      SELECT 1 FROM auth.users
      WHERE id = auth.uid()
        AND raw_user_meta_data->>'role' = 'admin'
    )
  );
