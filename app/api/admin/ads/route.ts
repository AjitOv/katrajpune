import { NextRequest, NextResponse } from "next/server"
import { createAdminClient } from "@/lib/supabase/admin"
import { verifyAdminSession, logAdminAction } from "@/lib/auth/admin"
import { z } from "zod"

export const dynamic = "force-dynamic"

const campaignSchema = z.object({
  name: z.string().min(2, "Campaign name is required"),
  advertiser_name: z.string().min(2, "Advertiser name is required"),
  image_url: z.string().url("Valid banner image URL is required"),
  destination_url: z.string().url("Valid destination URL is required"),
  placement: z.enum([
    "homepage_top",
    "homepage_promo",
    "directory_between",
    "category_banner",
    "business_profile",
    "sponsored_listing",
  ]),
  start_date: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, "Format: YYYY-MM-DD"),
  end_date: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, "Format: YYYY-MM-DD"),
  priority: z.number().int().min(1).max(10).default(1),
  status: z.enum(["active", "paused", "scheduled", "ended"]).default("active"),
  notes: z.string().optional().nullable(),
})

// GET: All ad campaigns for admin
export async function GET(request: NextRequest) {
  const { authorized, user, errorResponse } = await verifyAdminSession(request)
  if (!authorized || !user) return errorResponse!

  const supabase = createAdminClient()
  const { data, error } = await supabase
    .from("ad_campaigns")
    .select("*")
    .order("created_at", { ascending: false })

  if (error) {
    return NextResponse.json([])
  }

  return NextResponse.json(data || [])
}

// POST: Create ad campaign
export async function POST(request: NextRequest) {
  const { authorized, user, errorResponse } = await verifyAdminSession(request)
  if (!authorized || !user) return errorResponse!

  try {
    const body = await request.json()
    const parsed = campaignSchema.safeParse(body)
    if (!parsed.success) {
      return NextResponse.json(
        { error: "Validation failed", details: parsed.error.flatten() },
        { status: 400 }
      )
    }

    const supabase = createAdminClient()
    const { data, error } = await supabase
      .from("ad_campaigns")
      .insert([parsed.data])
      .select()
      .single()

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 })
    }

    await logAdminAction({
      actorId: user.id,
      actorEmail: user.email,
      action: "create",
      targetType: "ad",
      targetId: data?.id,
      newValues: parsed.data,
    })

    return NextResponse.json({ success: true, campaign: data })
  } catch (err: any) {
    return NextResponse.json({ error: err?.message || "Failed to create campaign" }, { status: 500 })
  }
}

// PATCH: Update ad campaign
export async function PATCH(request: NextRequest) {
  const { authorized, user, errorResponse } = await verifyAdminSession(request)
  if (!authorized || !user) return errorResponse!

  try {
    const { searchParams } = new URL(request.url)
    const id = searchParams.get("id")
    if (!id) {
      return NextResponse.json({ error: "Campaign ID required" }, { status: 400 })
    }

    const body = await request.json()
    const supabase = createAdminClient()

    // Fetch existing
    const { data: existing } = await supabase
      .from("ad_campaigns")
      .select("*")
      .eq("id", id)
      .single()

    const { data, error } = await supabase
      .from("ad_campaigns")
      .update({ ...body, updated_at: new Date().toISOString() })
      .eq("id", id)
      .select()
      .single()

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 })
    }

    await logAdminAction({
      actorId: user.id,
      actorEmail: user.email,
      action: "update_details",
      targetType: "ad",
      targetId: id,
      previousValues: existing,
      newValues: body,
    })

    return NextResponse.json({ success: true, campaign: data })
  } catch (err: any) {
    return NextResponse.json({ error: err?.message || "Update failed" }, { status: 500 })
  }
}

// DELETE: Delete ad campaign
export async function DELETE(request: NextRequest) {
  const { authorized, user, errorResponse } = await verifyAdminSession(request)
  if (!authorized || !user) return errorResponse!

  try {
    const { searchParams } = new URL(request.url)
    const id = searchParams.get("id")
    if (!id) {
      return NextResponse.json({ error: "Campaign ID required" }, { status: 400 })
    }

    const supabase = createAdminClient()
    const { data: existing } = await supabase
      .from("ad_campaigns")
      .select("*")
      .eq("id", id)
      .single()

    const { error } = await supabase.from("ad_campaigns").delete().eq("id", id)
    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 })
    }

    await logAdminAction({
      actorId: user.id,
      actorEmail: user.email,
      action: "delete",
      targetType: "ad",
      targetId: id,
      previousValues: existing,
    })

    return NextResponse.json({ success: true, deletedId: id })
  } catch (err: any) {
    return NextResponse.json({ error: err?.message || "Delete failed" }, { status: 500 })
  }
}
