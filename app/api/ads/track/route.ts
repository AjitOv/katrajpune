import { NextRequest, NextResponse } from "next/server"
import { createServerClient } from "@/lib/supabase/server"
import { z } from "zod"

export const dynamic = "force-dynamic"

const trackSchema = z.object({
  id: z.string().uuid("Valid ad campaign ID required"),
  type: z.enum(["impression", "click"]),
})

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const parsed = trackSchema.safeParse(body)
    if (!parsed.success) {
      return NextResponse.json({ error: "Invalid tracking payload" }, { status: 400 })
    }

    const { id, type } = parsed.data
    const supabase = createServerClient()

    // Fetch current counts
    const { data: ad } = await supabase
      .from("ad_campaigns")
      .select("impressions_count, clicks_count")
      .eq("id", id)
      .single()

    if (ad) {
      const updateData =
        type === "click"
          ? { clicks_count: (ad.clicks_count || 0) + 1 }
          : { impressions_count: (ad.impressions_count || 0) + 1 }

      await supabase.from("ad_campaigns").update(updateData).eq("id", id)
    }

    return NextResponse.json({ ok: true })
  } catch (err: any) {
    return NextResponse.json({ ok: false }, { status: 500 })
  }
}
