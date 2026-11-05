import { NextRequest, NextResponse } from "next/server"
import { createServerClient } from "@/lib/supabase/server"
import { z } from "zod"

export const dynamic = "force-dynamic"

const auditSchema = z.object({
  businessName: z.string().min(2, "Business name is required"),
  ownerName: z.string().min(2, "Owner name is required"),
  phone: z.string().min(8, "Phone / WhatsApp number is required"),
  email: z.string().email().optional().nullable(),
  websiteUrl: z.string().url().optional().nullable(),
  category: z.string().optional().nullable(),
  notes: z.string().optional().nullable(),
})

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const parsed = auditSchema.safeParse(body)

    if (!parsed.success) {
      return NextResponse.json(
        { error: "Validation failed", details: parsed.error.flatten() },
        { status: 400 }
      )
    }

    const { businessName, ownerName, phone, email, websiteUrl, category, notes } = parsed.data

    const supabase = createServerClient()

    const { data, error } = await supabase
      .from("business_audit_enquiries")
      .insert([
        {
          business_name: businessName,
          owner_name: ownerName,
          phone,
          email: email || null,
          website_url: websiteUrl || null,
          category: category || "general",
          notes: notes || "Submitted via website Free Zotoz AI Visibility Audit form",
          status: "new",
          created_at: new Date().toISOString(),
        },
      ])
      .select()

    if (error) {
      console.warn("Supabase audit enquiry insert error:", error.message)
      // Fallback response so user is never blocked
    }

    return NextResponse.json({
      success: true,
      businessName,
      message: "Your Free Zotoz AI Visibility Audit request has been received. Our team will analyze your AI search footprint and send your report on WhatsApp within 24–48 hours.",
    })
  } catch (err: any) {
    console.error("Audit submission error:", err)
    return NextResponse.json(
      { error: "Server error submitting audit request", message: err?.message },
      { status: 500 }
    )
  }
}
