import { NextRequest, NextResponse } from "next/server"
import { createServerClient } from "@/lib/supabase/server"

function isAdmin(user: { user_metadata?: Record<string, any> } | null): boolean {
  return user?.user_metadata?.role === "admin"
}

export const dynamic = "force-dynamic"

export async function GET() {
  const supabase = createServerClient()

  const {
    data: { user },
    error: authError,
  } = await supabase.auth.getUser()

  if (authError || !user || !isAdmin(user)) {
    return new NextResponse("Unauthorized", { status: 401 })
  }

  const { data, error } = await supabase
    .from("audit_log")
    .select("*, actor_email")
    .order("created_at", { ascending: false })
    .limit(100)

  if (error) return NextResponse.json({ error: error.message }, { status: 500 })

  return NextResponse.json(data || [])
}
