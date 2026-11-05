import { NextRequest, NextResponse } from "next/server"
import { createServerClient } from "@/lib/supabase/server"
import { z } from "zod"

function isAdmin(user: { email?: string; user_metadata?: Record<string, any> } | null): boolean {
  return user?.user_metadata?.role === "admin"
}

export const dynamic = "force-dynamic"

// ---- GET all businesses for admin ----
export async function GET(request: NextRequest) {
  const supabase = createServerClient()

  const {
    data: { user },
    error: authError,
  } = await supabase.auth.getUser()

  if (authError || !user || !isAdmin(user)) {
    return new NextResponse("Unauthorized", { status: 401 })
  }

  const { searchParams } = new URL(request.url)
  const status = searchParams.get("status") || null
  const category = searchParams.get("category") || null

  let query = supabase.from("businesses").select("*")

  if (status) query = query.eq("status", status)
  if (category) query = query.eq("category", category)

  const { data, error } = await query.order("submitted_at", { ascending: false })

  if (error) return NextResponse.json({ error: error.message }, { status: 500 })

  return NextResponse.json(data || [])
}

// ---- PATCH: approve/reject/update_location ----
const approveSchema = z.object({
  action: z.enum(["approve", "reject"]),
})

const locationSchema = z.object({
  action: z.literal("update_location"),
  latitude: z.number(),
  longitude: z.number(),
})

export async function PATCH(request: NextRequest) {
  const supabase = createServerClient()

  const {
    data: { user },
    error: authError,
  } = await supabase.auth.getUser()

  if (authError || !user || !isAdmin(user)) {
    return new NextResponse("Unauthorized", { status: 401 })
  }

  const { searchParams } = new URL(request.url)
  const id = searchParams.get("id")

  if (!id) {
    return NextResponse.json({ error: "Business ID required" }, { status: 400 })
  }

  const body = await request.json()

  // Fetch current record for audit log
  const { data: current } = await supabase
    .from("businesses")
    .select("*")
    .eq("id", id)
    .single()

  if (!current) {
    return NextResponse.json({ error: "Business not found" }, { status: 404 })
  }

  const actorEmail = user.email || user.id

  // ---- Approve / Reject ----
  const approveResult = approveSchema.safeParse(body)
  if (approveResult.success) {
    const { action } = approveResult.data
    const newStatus = action === "approve" ? "approved" : "rejected"

    const { data, error } = await supabase
      .from("businesses")
      .update({
        status: newStatus,
        approved_at: newStatus === "approved" ? new Date().toISOString() : null,
        approved_by: action === "approve" ? user.id : null,
        location_verified: action === "approve" ? current.location_verified : false,
      })
      .eq("id", id)
      .select()
      .single()

    if (error) return NextResponse.json({ error: error.message }, { status: 500 })

    // Audit log
    await supabase.rpc("write_audit_log", {
      p_actor_id: user.id,
      p_actor_email: actorEmail,
      p_action: action,
      p_target_type: "business",
      p_target_id: id,
      p_target_slug: current.slug,
      p_previous_values: { status: current.status },
      p_new_values: { status: newStatus },
    })

    return NextResponse.json(data)
  }

  // ---- Update Location ----
  const locationResult = locationSchema.safeParse(body)
  if (locationResult.success) {
    const { latitude, longitude } = locationResult.data

    const { data, error } = await supabase
      .from("businesses")
      .update({
        latitude,
        longitude,
        location_verified: false, // requires re-approval after location change
        status: current.status === "approved" ? "pending" : current.status, // needs re-approval if was approved
        approved_at: null,
        approved_by: null,
      })
      .eq("id", id)
      .select()
      .single()

    if (error) return NextResponse.json({ error: error.message }, { status: 500 })

    // Audit log
    await supabase.rpc("write_audit_log", {
      p_actor_id: user.id,
      p_actor_email: actorEmail,
      p_action: "update_location",
      p_target_type: "business",
      p_target_id: id,
      p_target_slug: current.slug,
      p_previous_values: {
        latitude: current.latitude,
        longitude: current.longitude,
        status: current.status,
        location_verified: current.location_verified,
      },
      p_new_values: {
        latitude,
        longitude,
        status: data.status,
        location_verified: data.location_verified,
      },
    })

    return NextResponse.json(data)
  }

  return NextResponse.json({ error: "Invalid action" }, { status: 400 })
}
