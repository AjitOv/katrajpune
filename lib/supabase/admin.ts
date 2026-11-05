import { createClient } from "@supabase/supabase-js"

/**
 * Privileged Supabase client using SUPABASE_SERVICE_ROLE_KEY.
 * Bypasses RLS for secure server-side administrative operations after verifying session.
 */
export function createAdminClient() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL!
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  
  return createClient(url, key, {
    auth: {
      autoRefreshToken: false,
      persistSession: false,
    },
  })
}

