import { NextRequest, NextResponse } from "next/server"
import { verifyAdminSession, logAdminAction } from "@/lib/auth/admin"
import { publishToFacebookPage, publishToInstagram } from "@/lib/social/meta"
import { publishToLinkedIn } from "@/lib/social/linkedin"
import { SocialPublishResult } from "@/lib/social/types"

export const dynamic = "force-dynamic"

export async function POST(request: NextRequest) {
  const { authorized, user, errorResponse } = await verifyAdminSession(request)
  if (!authorized || !user) return errorResponse!

  try {
    const body = await request.json()
    const { platforms = [], message, linkUrl, imageUrl, title } = body

    if (!message) {
      return NextResponse.json({ error: "Post message/caption is required" }, { status: 400 })
    }

    if (!Array.isArray(platforms) || platforms.length === 0) {
      return NextResponse.json({ error: "Select at least one platform to publish to" }, { status: 400 })
    }

    const results: SocialPublishResult[] = []

    // 1. Facebook Page
    if (platforms.includes("facebook")) {
      const fbRes = await publishToFacebookPage({
        message,
        linkUrl,
        imageUrl,
      })
      results.push(fbRes)
    }

    // 2. Instagram
    if (platforms.includes("instagram")) {
      const igRes = await publishToInstagram({
        caption: message,
        imageUrl: imageUrl || "https://katrajpune.com/og-image.png",
      })
      results.push(igRes)
    }

    // 3. LinkedIn
    if (platforms.includes("linkedin")) {
      const liRes = await publishToLinkedIn({
        text: message,
        articleUrl: linkUrl,
        title: title || "KatrajPune Local Business Spotlight",
      })
      results.push(liRes)
    }

    await logAdminAction({
      actorId: user.id,
      actorEmail: user.email,
      action: "create",
      targetType: "settings",
      newValues: {
        platforms,
        results,
      },
    })

    return NextResponse.json({
      success: results.some((r) => r.success),
      results,
    })
  } catch (err: any) {
    console.error("Social post exception:", err)
    return NextResponse.json({ error: err.message || "Social publishing failed" }, { status: 500 })
  }
}
