import { NextRequest, NextResponse } from "next/server"
import { createServerClient } from "@/lib/supabase/server"
import { verifyAdminSession, logAdminAction } from "@/lib/auth/admin"
import { SITE_CONFIG } from "@/lib/config"

export const dynamic = "force-dynamic"

export async function GET() {
  const { authorized, user, errorResponse } = await verifyAdminSession()
  if (!authorized || !user) return errorResponse!

  const supabase = createServerClient()
  try {
    const { data } = await supabase.from("site_settings").select("*")
    const settingsMap: Record<string, any> = {}
    if (data) {
      for (const row of data) {
        settingsMap[row.key] = row.value
      }
    }
    return NextResponse.json({
      support_whatsapp: settingsMap["support_whatsapp"] || { phone: SITE_CONFIG.support.displayPhone },
      zotoz_audit_promo: settingsMap["zotoz_audit_promo"] || SITE_CONFIG.zotozAudit,
      listing_pricing: settingsMap["listing_pricing"] || { feeINR: SITE_CONFIG.listing.feeINR, slaHours: 48 },
    })
  } catch {
    return NextResponse.json({
      support_whatsapp: { phone: SITE_CONFIG.support.displayPhone },
      zotoz_audit_promo: SITE_CONFIG.zotozAudit,
      listing_pricing: { feeINR: SITE_CONFIG.listing.feeINR, slaHours: 48 },
    })
  }
}

export async function POST(request: NextRequest) {
  const { authorized, user, errorResponse } = await verifyAdminSession()
  if (!authorized || !user) return errorResponse!

  try {
    const body = await request.json()
    const supabase = createServerClient()

    for (const [key, value] of Object.entries(body)) {
      await supabase
        .from("site_settings")
        .upsert({ key, value: value as any, updated_at: new Date().toISOString() }, { onConflict: "key" })
    }

    await logAdminAction({
      actorId: user.id,
      actorEmail: user.email,
      action: "update_details",
      targetType: "settings",
      newValues: body,
    })

    return NextResponse.json({ success: true, updated: true })
  } catch (err: any) {
    return NextResponse.json({ error: err?.message || "Failed to update settings" }, { status: 500 })
  }
}
