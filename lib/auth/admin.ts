import { createServerClient } from "@/lib/supabase/server"
import { createAdminClient } from "@/lib/supabase/admin"
import { NextRequest, NextResponse } from "next/server"

export interface AdminUser {
  id: string
  email: string
  role: string
}

const DEFAULT_ADMIN_EMAILS = ["ovhalajit@gmail.com"]

export async function verifyAdminSession(req?: NextRequest): Promise<{
  authorized: boolean
  user: AdminUser | null
  errorResponse?: NextResponse
}> {
  try {
    let user: any = null

    // 1. Check Bearer token in Authorization header if request provided
    if (req) {
      const authHeader = req.headers.get("authorization") || req.headers.get("Authorization")
      if (authHeader && authHeader.toLowerCase().startsWith("bearer ")) {
        const token = authHeader.substring(7).trim()
        if (token) {
          const supabase = createServerClient()
          const { data } = await supabase.auth.getUser(token)
          if (data?.user) {
            user = data.user
          }
        }
      }
    }

    // 2. Fallback to cookies
    if (!user) {
      const supabase = createServerClient()
      const { data } = await supabase.auth.getUser()
      if (data?.user) {
        user = data.user
      }
    }

    if (!user) {
      return {
        authorized: false,
        user: null,
        errorResponse: new NextResponse(
          JSON.stringify({ error: "Authentication required", code: "UNAUTHENTICATED" }),
          { status: 401, headers: { "Content-Type": "application/json" } }
        ),
      }
    }

    const email = (user.email || "").toLowerCase()
    const envAdmins = (process.env.ADMIN_EMAILS || "")
      .split(",")
      .map((e) => e.trim().toLowerCase())
      .filter(Boolean)

    const isRoleAdmin =
      user.user_metadata?.role === "admin" ||
      user.app_metadata?.role === "admin" ||
      DEFAULT_ADMIN_EMAILS.includes(email) ||
      envAdmins.includes(email)

    if (!isRoleAdmin) {
      return {
        authorized: false,
        user: null,
        errorResponse: new NextResponse(
          JSON.stringify({ error: "Forbidden: Admin access required", code: "FORBIDDEN" }),
          { status: 403, headers: { "Content-Type": "application/json" } }
        ),
      }
    }

    return {
      authorized: true,
      user: {
        id: user.id,
        email: user.email || "",
        role: "admin",
      },
    }
  } catch (err: any) {
    console.error("Admin verification exception:", err)
    return {
      authorized: false,
      user: null,
      errorResponse: new NextResponse(
        JSON.stringify({ error: "Internal authorization failure" }),
        { status: 500, headers: { "Content-Type": "application/json" } }
      ),
    }
  }
}

/**
 * Record an action to the existing audit_log table
 */
export async function logAdminAction(params: {
  actorId: string
  actorEmail: string
  action: "approve" | "reject" | "update_location" | "create" | "delete" | "update_details" | "submit_indexnow"
  targetType: "business" | "user" | "ad" | "settings" | "seo"
  targetId?: string
  targetSlug?: string
  previousValues?: Record<string, any> | null
  newValues?: Record<string, any> | null
  details?: Record<string, any> | null
}) {
  try {
    const supabase = createAdminClient()
    await supabase.from("audit_log").insert([
      {
        actor_id: params.actorId,
        actor_email: params.actorEmail,
        action: params.action,
        target_type: ["ad", "seo"].includes(params.targetType) ? "settings" : params.targetType,
        target_id: params.targetId || "00000000-0000-0000-0000-000000000000",
        target_slug: params.targetSlug || null,
        previous_values: params.previousValues || null,
        new_values: params.newValues || null,
        created_at: new Date().toISOString(),
      },
    ])
  } catch (err) {
    console.warn("Audit log insert warning:", err)
  }
}
