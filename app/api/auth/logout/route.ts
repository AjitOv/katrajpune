import { NextRequest, NextResponse } from "next/server"
import { cookies } from "next/headers"

export const dynamic = "force-dynamic"

export async function POST() {
  const cookieStore = cookies()
  cookieStore.set("sb-access-token", "", { path: "/", httpOnly: true, sameSite: "lax", maxAge: 0 })
  cookieStore.set("sb-refresh-token", "", { path: "/", httpOnly: true, sameSite: "lax", maxAge: 0 })
  return NextResponse.json({ ok: true })
}
