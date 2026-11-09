import { NextRequest, NextResponse } from "next/server"
import fs from "fs"
import path from "path"
import { verifyAdminSession } from "@/lib/auth/admin"

export const dynamic = "force-dynamic"

const DATA_FILE = path.join(process.cwd(), "data", "outreach_campaign.json")

function loadOutreachData(): Record<string, { status: string; sentAt?: string; updatedAt?: string; notes?: string }> {
  try {
    if (fs.existsSync(DATA_FILE)) {
      const raw = fs.readFileSync(DATA_FILE, "utf-8")
      return JSON.parse(raw)
    }
  } catch (err) {
    console.error("Failed to read outreach data:", err)
  }
  return {}
}

function saveOutreachData(data: Record<string, any>) {
  try {
    fs.writeFileSync(DATA_FILE, JSON.stringify(data, null, 2), "utf-8")
  } catch (err) {
    console.error("Failed to save outreach data:", err)
  }
}

export async function GET(request: NextRequest) {
  const { authorized, user, errorResponse } = await verifyAdminSession(request)
  if (!authorized || !user) return errorResponse!

  const outreachMap = loadOutreachData()
  return NextResponse.json({
    success: true,
    campaign: outreachMap,
    count: Object.keys(outreachMap).length,
  })
}

export async function POST(request: NextRequest) {
  const { authorized, user, errorResponse } = await verifyAdminSession(request)
  if (!authorized || !user) return errorResponse!

  try {
    const body = await request.json()
    const { slug, status, notes } = body

    if (!slug || !status) {
      return NextResponse.json({ error: "Missing slug or status" }, { status: 400 })
    }

    const outreachMap = loadOutreachData()
    outreachMap[slug] = {
      status,
      sentAt: outreachMap[slug]?.sentAt || new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      notes: notes || outreachMap[slug]?.notes || "",
    }

    saveOutreachData(outreachMap)

    return NextResponse.json({
      success: true,
      slug,
      record: outreachMap[slug],
      totalContacted: Object.values(outreachMap).filter((v) => v.status === "sent" || v.status === "replied" || v.status === "converted").length,
    })
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 })
  }
}
