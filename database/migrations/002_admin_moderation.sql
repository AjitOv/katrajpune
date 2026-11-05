-- Phase 7: Admin Moderation
-- Add audit_log table and admin RLS policies

-- 1. Audit log table
CREATE TABLE IF NOT EXISTS audit_log (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  actor_id UUID REFERENCES auth.users(id),
  actor_email TEXT,
  action TEXT NOT NULL CHECK (action IN (
    'approve','reject','update_location','create','delete','update_details'
  )),
  target_type TEXT NOT NULL CHECK (target_type IN ('business','user')),
  target_id UUID NOT NULL,
  target_slug TEXT,
  previous_values JSONB,
  new_values JSONB,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_audit_log_actor ON audit_log(actor_id);
CREATE INDEX IF NOT EXISTS idx_audit_log_target ON audit_log(target_type, target_id);
CREATE INDEX IF NOT EXISTS idx_audit_log_created_at ON audit_log(created_at DESC);

-- Enable RLS
ALTER TABLE audit_log ENABLE ROW LEVEL SECURITY;

-- Public cannot read audit log
DROP POLICY IF EXISTS "No public access to audit log" ON audit_log;
CREATE POLICY "No public access to audit log" ON audit_log
  FOR ALL USING (FALSE);

-- Admins can read audit log
DROP POLICY IF EXISTS "Admins can read audit log" ON audit_log;
CREATE POLICY "Admins can read audit log" ON audit_log
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM auth.users
      WHERE id = auth.uid()
        AND raw_user_meta_data->>'role' = 'admin'
    )
  );

-- 2. Admin policy on businesses (admins can manage all)
-- Already exists from Phase 1, but let's ensure it covers updates:
DROP POLICY IF EXISTS "Admins manage all businesses" ON businesses;
CREATE POLICY "Admins manage all businesses" ON businesses
  FOR ALL USING (
    EXISTS (
      SELECT 1 FROM auth.users
      WHERE id = auth.uid()
        AND raw_user_meta_data->>'role' = 'admin'
    )
  )
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM auth.users
      WHERE id = auth.uid()
        AND raw_user_meta_data->>'role' = 'admin'
    )
  );

-- 3. Helper function: write audit log entry
CREATE OR REPLACE FUNCTION write_audit_log(
  p_actor_id UUID,
  p_actor_email TEXT,
  p_action TEXT,
  p_target_type TEXT,
  p_target_id UUID,
  p_target_slug TEXT,
  p_previous_values JSONB,
  p_new_values JSONB
)
RETURNS VOID
LANGUAGE plpgsql
AS $$
BEGIN
  INSERT INTO audit_log (
    actor_id, actor_email, action, target_type, target_id,
    target_slug, previous_values, new_values, created_at
  ) VALUES (
    p_actor_id, p_actor_email, p_action, p_target_type, p_target_id,
    p_target_slug, p_previous_values, p_new_values, NOW()
  );
END;
$$;

-- 4. Set an existing user as admin (run manually in SQL Editor)
-- UPDATE auth.users SET raw_user_meta_data = raw_user_meta_data || '{"role": "admin"}' WHERE email = 'your-admin@email.com';
