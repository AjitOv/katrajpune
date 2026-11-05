import { NextRequest, NextResponse } from "next/server"
import { createServerClient } from "@/lib/supabase/server"
import { z } from "zod"
import fs from "fs"
import path from "path"

export const dynamic = "force-dynamic"

const submitSchema = z.object({
  businessName: z.string().min(2, "Business name is required"),
  category: z.string().min(2, "Category is required"),
  locality: z.string().min(2, "Locality is required"),
  address: z.string().min(5, "Complete address is required"),
  phone: z.string().optional().nullable(),
  whatsapp: z.string().min(8, "WhatsApp number is required"),
  email: z.string().email().optional().nullable(),
  website: z.string().url().optional().nullable(),
  description: z.string().optional().nullable(),
  amount: z.number().default(350),
})

function generateRef(): string {
  const rand = Math.random().toString(36).substring(2, 8).toUpperCase()
  const date = new Date().toISOString().slice(0, 10).replace(/-/g, "")
  return `KP-${date}-${rand}`
}

function generateSlug(name: string, locality: string): string {
  const base = `${name} ${locality}`
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)+/g, "")
  return base || `biz-${Date.now()}`
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const parsed = submitSchema.safeParse(body)

    if (!parsed.success) {
      return NextResponse.json(
        { error: "Validation failed", details: parsed.error.flatten() },
        { status: 400 }
      )
    }

    const { businessName, category, locality, address, phone, whatsapp, email, website, description, amount } = parsed.data
    const transactionRef = generateRef()
    const slug = generateSlug(businessName, locality)

    const supabase = createServerClient()

    // Default Katraj center coordinates for new submissions until verified by admin
    const defaultLat = 18.452936
    const defaultLng = 73.855301

    const newBusiness = {
      slug,
      name: businessName,
      description: description || `${businessName} is a verified ${category} listing located in ${locality}, Katraj, Pune.`,
      category,
      locality,
      address,
      phone: phone || whatsapp,
      whatsapp,
      email: email || null,
      website: website || null,
      logo_url: null,
      photos: [],
      latitude: defaultLat,
      longitude: defaultLng,
      status: "pending",
      payment_status: "pending",
      payment_id: transactionRef,
      location_verified: false,
      geocoding_source: "owner_submission",
      submitted_at: new Date().toISOString(),
    }

    // 1. Persist business to Supabase if table exists
    let businessId: string | null = null
    const { data: insertedBiz, error: bizError } = await supabase
      .from("businesses")
      .insert([newBusiness])
      .select("id")
      .single()

    if (!bizError && insertedBiz) {
      businessId = insertedBiz.id
    }

    // 2. Persist payment transaction record
    const paymentRecord = {
      transaction_ref: transactionRef,
      business_id: businessId,
      business_name: businessName,
      business_slug: slug,
      amount,
      currency: "INR",
      payment_gateway: "razorpay",
      status: "pending",
      payer_name: businessName,
      payer_email: email || null,
      payer_phone: whatsapp,
      metadata: {
        category,
        locality,
        address,
        phone,
      },
      created_at: new Date().toISOString(),
    }

    await supabase.from("payment_transactions").insert([paymentRecord])

    // 3. Update local dataset in data/katraj_businesses.json as persistent fallback
    try {
      const jsonPath = path.resolve(process.cwd(), "data", "katraj_businesses.json")
      if (fs.existsSync(jsonPath)) {
        const localList = JSON.parse(fs.readFileSync(jsonPath, "utf-8"))
        const existingIdx = localList.findIndex((b: any) => b.slug === slug)
        if (existingIdx !== -1) {
          localList[existingIdx] = { ...localList[existingIdx], ...newBusiness }
        } else {
          localList.push(newBusiness)
        }
        fs.writeFileSync(jsonPath, JSON.stringify(localList, null, 2), "utf-8")
      }
    } catch (fsErr) {
      console.warn("Could not append to local katraj_businesses.json:", fsErr)
    }

    return NextResponse.json({
      success: true,
      transactionRef,
      slug,
      businessName,
      amount,
      paymentUrl: `https://rzp.io/rzp/g0GBqkap`,
    })
  } catch (err: any) {
    console.error("Payment initiation error:", err)
    return NextResponse.json(
      { error: "Internal server error", message: err?.message || "Failed to create payment" },
      { status: 500 }
    )
  }
}
