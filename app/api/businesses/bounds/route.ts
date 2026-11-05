import { NextRequest, NextResponse } from "next/server"
import { fetchBusinessesInBounds } from "@/lib/data/businesses"

export const dynamic = "force-dynamic"

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url)
  const west = parseFloat(searchParams.get("west") || "-180")
  const south = parseFloat(searchParams.get("south") || "-90")
  const east = parseFloat(searchParams.get("east") || "180")
  const north = parseFloat(searchParams.get("north") || "90")
  const category = searchParams.get("category") || null
  const limit = parseInt(searchParams.get("limit") || "2000", 10)
  const offset = parseInt(searchParams.get("offset") || "0", 10)

  // Validate bounds
  if (isNaN(west) || isNaN(south) || isNaN(east) || isNaN(north)) {
    return NextResponse.json({ error: "Invalid bounds" }, { status: 400 })
  }

  try {
    const businesses = await fetchBusinessesInBounds({
      west,
      south,
      east,
      north,
      category,
      limit,
      offset,
    })
    return NextResponse.json(businesses)
  } catch (err: any) {
    console.error("Error fetching businesses in bounds:", err)
    return NextResponse.json(
      { error: err.message || "Failed to fetch businesses" },
      { status: 500 }
    )
  }
}
