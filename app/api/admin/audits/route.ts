import { NextRequest, NextResponse } from "next/server"
import { createAdminClient } from "@/lib/supabase/admin"
import { verifyAdminSession, logAdminAction } from "@/lib/auth/admin"

export const dynamic = "force-dynamic"

export async function GET(request: NextRequest) {
  const { authorized, user, errorResponse } = await verifyAdminSession(request)
  if (!authorized || !user) return errorResponse!

  const supabase = createAdminClient()
  const { data, error } = await supabase
    .from("business_audit_enquiries")
    .select("*")
    .order("created_at", { ascending: false })

  if (error) {
    return NextResponse.json([])
  }

  return NextResponse.json(data || [])
}

export async function PATCH(request: NextRequest) {
  const { authorized, user, errorResponse } = await verifyAdminSession(request)
  if (!authorized || !user) return errorResponse!

  try {
    const { searchParams } = new URL(request.url)
    const id = searchParams.get("id")
    if (!id) return NextResponse.json({ error: "ID required" }, { status: 400 })

    const body = await request.json()
    const supabase = createAdminClient()

    const { data, error } = await supabase
      .from("business_audit_enquiries")
      .update({ ...body, updated_at: new Date().toISOString() })
      .eq("id", id)
      .select()
      .single()

    if (error) return NextResponse.json({ error: error.message }, { status: 500 })

    return NextResponse.json({ success: true, enquiry: data })
  } catch (err: any) {
    return NextResponse.json({ error: err?.message }, { status: 500 })
  }
}
