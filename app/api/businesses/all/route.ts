import { NextResponse } from "next/server"
import { getLocalBusinesses } from "@/lib/data/businesses"

export const dynamic = "force-dynamic"

export async function GET() {
  try {
    const businesses = getLocalBusinesses()
    return NextResponse.json(businesses)
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 })
  }
}

