import { NextRequest, NextResponse } from "next/server"
import { searchBusinessesList } from "@/lib/data/businesses"

export const dynamic = "force-dynamic"

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url)
  const q = searchParams.get("q") || ""
  const category = searchParams.get("category") || null
  const locality = searchParams.get("locality") || null
  const limit = parseInt(searchParams.get("limit") || "50", 10)
  const offset = parseInt(searchParams.get("offset") || "0", 10)

  try {
    const data = await searchBusinessesList({
      query: q,
      category,
      locality,
      limit,
      offset,
    })
    return NextResponse.json(data)
  } catch (err: any) {
    console.error("Search API error:", err)
    return NextResponse.json(
      { error: err.message || "Failed to search businesses" },
      { status: 500 }
    )
  }
}
