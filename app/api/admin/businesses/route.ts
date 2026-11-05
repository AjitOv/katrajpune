import { NextRequest, NextResponse } from "next/server"
import { createServerClient } from "@/lib/supabase/server"
import { createAdminClient } from "@/lib/supabase/admin"
import { verifyAdminSession, logAdminAction } from "@/lib/auth/admin"
import { getLocalBusinesses } from "@/lib/data/businesses"
import { z } from "zod"
import fs from "fs"
import path from "path"

export const dynamic = "force-dynamic"

// Schema for adding/editing a business
const businessSchema = z.object({
  name: z.string().min(2, "Name is required"),
  slug: z.string().min(2, "Slug is required"),
  category: z.string().min(2, "Category is required"),
  locality: z.string().optional().nullable().transform((v) => v?.trim() || "Katraj"),
  address: z.string().optional().nullable().transform((v) => v?.trim() || null),
  phone: z.string().optional().nullable().transform((v) => v?.trim() || null),
  whatsapp: z.string().optional().nullable().transform((v) => v?.trim() || null),
  email: z.string().optional().nullable().transform((v) => v?.trim() || null),
  website: z.string().optional().nullable().transform((v) => {
    if (!v) return null
    const trimmed = v.trim()
    if (!trimmed) return null
    return trimmed.startsWith("http://") || trimmed.startsWith("https://") ? trimmed : `https://${trimmed}`
  }),
  description: z.string().optional().nullable().transform((v) => v?.trim() || null),
  logo_url: z.string().optional().nullable().transform((v) => {
    if (!v) return null
    const trimmed = v.trim()
    if (!trimmed) return null
    return trimmed.startsWith("http://") || trimmed.startsWith("https://") ? trimmed : `https://${trimmed}`
  }),
  photos: z.array(z.string()).optional().default([]),
  latitude: z.union([z.number(), z.string()]).transform((v) => Number(v) || 18.452936),
  longitude: z.union([z.number(), z.string()]).transform((v) => Number(v) || 73.855301),
  location_verified: z.boolean().default(true),
  featured: z.boolean().default(false),
  status: z.enum(["approved", "pending", "rejected"]).default("approved"),
  payment_status: z.enum(["unpaid", "pending", "paid", "refunded"]).default("unpaid"),
  rating: z.union([z.number(), z.string()]).optional().nullable().transform((v) => (v ? Number(v) : null)),
  reviews_count: z.union([z.number(), z.string()]).optional().default(0).transform((v) => Number(v) || 0),
})

// ---- GET: All businesses with search & filtering ----
export async function GET(request: NextRequest) {
  const { authorized, user, errorResponse } = await verifyAdminSession(request)
  if (!authorized || !user) return errorResponse!

  const { searchParams } = new URL(request.url)
  const q = (searchParams.get("q") || "").toLowerCase().trim()
  const status = searchParams.get("status")
  const category = searchParams.get("category")
  const locality = searchParams.get("locality")
  const paymentStatus = searchParams.get("payment_status")

  const supabase = createAdminClient()

  // Fetch from Supabase
  let dbBusinesses: any[] = []
  try {
    let query = supabase.from("businesses").select("*").order("created_at", { ascending: false })
    if (status && status !== "all") query = query.eq("status", status)
    if (category && category !== "all") query = query.eq("category", category)
    if (locality && locality !== "all") query = query.eq("locality", locality)
    if (paymentStatus && paymentStatus !== "all") query = query.eq("payment_status", paymentStatus)

    const { data } = await query
    if (data && data.length > 0) {
      dbBusinesses = data
    }
  } catch (err) {
    console.warn("Supabase fetch fallback to local:", err)
  }

  // If Supabase returned few or none, merge with local dataset
  let all = dbBusinesses
  if (all.length === 0) {
    all = getLocalBusinesses()
  }

  // Apply in-memory search and filters if needed
  if (q) {
    all = all.filter(
      (b) =>
        b.name?.toLowerCase().includes(q) ||
        b.slug?.toLowerCase().includes(q) ||
        b.phone?.includes(q) ||
        b.whatsapp?.includes(q)
    )
  }
  if (status && status !== "all") {
    all = all.filter((b) => b.status === status)
  }
  if (category && category !== "all") {
    all = all.filter((b) => b.category === category)
  }
  if (locality && locality !== "all") {
    all = all.filter((b) => b.locality === locality)
  }
  if (paymentStatus && paymentStatus !== "all") {
    all = all.filter((b) => b.payment_status === paymentStatus)
  }

  return NextResponse.json(all)
}

// ---- POST: Create new business manually ----
export async function POST(request: NextRequest) {
  const { authorized, user, errorResponse } = await verifyAdminSession(request)
  if (!authorized || !user) return errorResponse!

  try {
    const body = await request.json()
    const parsed = businessSchema.safeParse(body)
    if (!parsed.success) {
      return NextResponse.json(
        { error: "Validation failed", details: parsed.error.flatten() },
        { status: 400 }
      )
    }

    const businessData = {
      ...parsed.data,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
      approved_at: parsed.data.status === "approved" ? new Date().toISOString() : null,
      approved_by: parsed.data.status === "approved" ? user.id : null,
    }

    const supabase = createAdminClient()
    const { data, error } = await supabase
      .from("businesses")
      .insert([businessData])
      .select()
      .single()

    if (error) {
      console.error("Supabase insert error:", error)
      return NextResponse.json(
        { error: `Database insert failed: ${error.message}` },
        { status: 400 }
      )
    }

    // Also persist to local JSON file
    try {
      const jsonPath = path.resolve(process.cwd(), "data", "katraj_businesses.json")
      if (fs.existsSync(jsonPath)) {
        const localList = JSON.parse(fs.readFileSync(jsonPath, "utf-8"))
        localList.push(businessData)
        fs.writeFileSync(jsonPath, JSON.stringify(localList, null, 2), "utf-8")
      }
    } catch (fsErr) {
      console.warn("Local JSON persist warning:", fsErr)
    }

    await logAdminAction({
      actorId: user.id,
      actorEmail: user.email,
      action: "create",
      targetType: "business",
      targetId: data?.id,
      targetSlug: businessData.slug,
      newValues: businessData,
    })

    return NextResponse.json({ success: true, business: data || businessData })
  } catch (err: any) {
    return NextResponse.json({ error: err?.message || "Failed to create business" }, { status: 500 })
  }
}

// ---- PUT: Edit existing business details ----
export async function PUT(request: NextRequest) {
  const { authorized, user, errorResponse } = await verifyAdminSession(request)
  if (!authorized || !user) return errorResponse!

  try {
    const { searchParams } = new URL(request.url)
    const id = searchParams.get("id")
    const slug = searchParams.get("slug")

    if (!id && !slug) {
      return NextResponse.json({ error: "Business ID or slug required" }, { status: 400 })
    }

    const body = await request.json()
    const parsed = businessSchema.partial().safeParse(body)
    if (!parsed.success) {
      return NextResponse.json(
        { error: "Validation failed", details: parsed.error.flatten() },
        { status: 400 }
      )
    }

    const updateData = {
      ...parsed.data,
      updated_at: new Date().toISOString(),
    }

    const supabase = createAdminClient()
    let query = supabase.from("businesses").update(updateData)
    if (id) query = query.eq("id", id)
    else if (slug) query = query.eq("slug", slug)

    const { data, error } = await query.select().single()

    // Update in local katraj_businesses.json as well
    try {
      const jsonPath = path.resolve(process.cwd(), "data", "katraj_businesses.json")
      if (fs.existsSync(jsonPath)) {
        const localList = JSON.parse(fs.readFileSync(jsonPath, "utf-8"))
        const targetSlug = slug || data?.slug || body.slug
        const idx = localList.findIndex((b: any) => b.slug === targetSlug || b.id === id)
        if (idx !== -1) {
          localList[idx] = { ...localList[idx], ...updateData }
          fs.writeFileSync(jsonPath, JSON.stringify(localList, null, 2), "utf-8")
        }
      }
    } catch (fsErr) {
      console.warn("Local JSON update warning:", fsErr)
    }

    await logAdminAction({
      actorId: user.id,
      actorEmail: user.email,
      action: "update_details",
      targetType: "business",
      targetId: id || data?.id,
      targetSlug: slug || data?.slug,
      newValues: updateData,
    })

    return NextResponse.json({ success: true, business: data || updateData })
  } catch (err: any) {
    return NextResponse.json({ error: err?.message || "Failed to update business" }, { status: 500 })
  }
}

// ---- PATCH: Fast status change (approve / reject) ----
export async function PATCH(request: NextRequest) {
  const { authorized, user, errorResponse } = await verifyAdminSession(request)
  if (!authorized || !user) return errorResponse!

  try {
    const { searchParams } = new URL(request.url)
    const id = searchParams.get("id")
    const slug = searchParams.get("slug")
    const body = await request.json()

    if (!id && !slug) {
      return NextResponse.json({ error: "Business ID or slug required" }, { status: 400 })
    }

    const newStatus = body.status
    if (!["approved", "pending", "rejected"].includes(newStatus)) {
      return NextResponse.json({ error: "Invalid status value" }, { status: 400 })
    }

    const updateFields = {
      status: newStatus,
      approved_at: newStatus === "approved" ? new Date().toISOString() : null,
      approved_by: newStatus === "approved" ? user.id : null,
      updated_at: new Date().toISOString(),
    }

    const supabase = createAdminClient()
    let query = supabase.from("businesses").update(updateFields)
    if (id) query = query.eq("id", id)
    else if (slug) query = query.eq("slug", slug)

    const { data } = await query.select().single()

    // Also update in local json
    try {
      const jsonPath = path.resolve(process.cwd(), "data", "katraj_businesses.json")
      if (fs.existsSync(jsonPath)) {
        const localList = JSON.parse(fs.readFileSync(jsonPath, "utf-8"))
        const targetSlug = slug || data?.slug
        const idx = localList.findIndex((b: any) => b.slug === targetSlug || b.id === id)
        if (idx !== -1) {
          localList[idx].status = newStatus
          fs.writeFileSync(jsonPath, JSON.stringify(localList, null, 2), "utf-8")
        }
      }
    } catch {}

    await logAdminAction({
      actorId: user.id,
      actorEmail: user.email,
      action: newStatus === "approved" ? "approve" : "reject",
      targetType: "business",
      targetId: id || data?.id,
      targetSlug: slug || data?.slug,
      newValues: updateFields,
    })

    return NextResponse.json({ success: true, status: newStatus })
  } catch (err: any) {
    return NextResponse.json({ error: err?.message || "Failed to update status" }, { status: 500 })
  }
}

// ---- DELETE: Delete business with confirmation ----
export async function DELETE(request: NextRequest) {
  const { authorized, user, errorResponse } = await verifyAdminSession(request)
  if (!authorized || !user) return errorResponse!

  try {
    const { searchParams } = new URL(request.url)
    const id = searchParams.get("id")
    const slug = searchParams.get("slug")

    if (!id && !slug) {
      return NextResponse.json({ error: "Business ID or slug required" }, { status: 400 })
    }

    const supabase = createAdminClient()
    let query = supabase.from("businesses").delete()
    if (id) query = query.eq("id", id)
    else if (slug) query = query.eq("slug", slug)

    await query

    // Also remove from local json
    try {
      const jsonPath = path.resolve(process.cwd(), "data", "katraj_businesses.json")
      if (fs.existsSync(jsonPath)) {
        const localList = JSON.parse(fs.readFileSync(jsonPath, "utf-8"))
        const filtered = localList.filter((b: any) => b.slug !== slug && b.id !== id)
        fs.writeFileSync(jsonPath, JSON.stringify(filtered, null, 2), "utf-8")
      }
    } catch {}

    await logAdminAction({
      actorId: user.id,
      actorEmail: user.email,
      action: "delete",
      targetType: "business",
      targetId: id || undefined,
      targetSlug: slug || undefined,
    })

    return NextResponse.json({ success: true, deleted: true })
  } catch (err: any) {
    return NextResponse.json({ error: err?.message || "Delete failed" }, { status: 500 })
  }
}
