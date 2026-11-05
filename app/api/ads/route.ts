import { NextRequest, NextResponse } from "next/server"
import { createServerClient } from "@/lib/supabase/server"

export const dynamic = "force-dynamic"

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const placement = searchParams.get("placement")

    const supabase = createServerClient()
    const today = new Date().toISOString().slice(0, 10)

    let query = supabase
      .from("ad_campaigns")
      .select("id, name, advertiser_name, image_url, destination_url, placement, priority")
      .eq("status", "active")
      .lte("start_date", today)
      .gte("end_date", today)

    if (placement) {
      query = query.eq("placement", placement)
    }

    const { data, error } = await query.order("priority", { ascending: false })

    if (error) {
      // If table doesn't exist yet, return empty array gracefully
      return NextResponse.json([])
    }

    return NextResponse.json(data || [])
  } catch (err: any) {
    console.error("Ads fetch error:", err)
    return NextResponse.json([])
  }
}
