import { NextRequest, NextResponse } from "next/server"
import { createServerClient } from "@/lib/supabase/server"

export const dynamic = "force-dynamic"

export async function GET(_request: NextRequest) {
  const supabase = createServerClient()

  try {
    const { data, error } = await supabase
      .from("businesses")
      .select("*")
      .eq("status", "approved")

    if (error) throw error

    // Get distinct, non-null localities
    const localities = Array.from(
      new Set((data || []).map((b: any) => b.locality).filter(Boolean))
    ).sort() as string[]

    return NextResponse.json(localities)
  } catch (err: any) {
    console.error("Error fetching localities:", err)
    return NextResponse.json(
      { error: err.message || "Failed to fetch localities" },
      { status: 500 }
    )
  }
}
