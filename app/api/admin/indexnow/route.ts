import { NextRequest, NextResponse } from "next/server"
import { verifyAdminSession, logAdminAction } from "@/lib/auth/admin"
import { SITE_CONFIG } from "@/lib/config"
import sitemap from "@/app/sitemap"

export const dynamic = "force-dynamic"

export async function POST(request: NextRequest) {
  const { authorized, user, errorResponse } = await verifyAdminSession(request)
  if (!authorized || !user) return errorResponse!

  try {
    const sitemapEntries = await sitemap()
    const urlList = sitemapEntries.map((item) => item.url)

    const payload = {
      host: SITE_CONFIG.domain,
      key: SITE_CONFIG.indexNow.key,
      keyLocation: SITE_CONFIG.indexNow.keyLocation,
      urlList,
    }

    const endpoints = [
      "https://api.indexnow.org/indexnow",
      "https://www.bing.com/indexnow",
    ]

    const results: Array<{ endpoint: string; status: number; statusText: string }> = []

    for (const endpoint of endpoints) {
      try {
        const res = await fetch(endpoint, {
          method: "POST",
          headers: {
            "Content-Type": "application/json; charset=utf-8",
          },
          body: JSON.stringify(payload),
        })
        results.push({
          endpoint,
          status: res.status,
          statusText: res.statusText,
        })
      } catch (err: any) {
        results.push({
          endpoint,
          status: 500,
          statusText: err.message || "Failed to reach endpoint",
        })
      }
    }

    await logAdminAction({
      actorId: user.id,
      actorEmail: user.email,
      action: "submit_indexnow",
      targetType: "seo",
      targetId: "sitemap",
      details: {
        totalUrls: urlList.length,
        results,
      },
    })

    return NextResponse.json({
      success: true,
      totalUrls: urlList.length,
      key: SITE_CONFIG.indexNow.key,
      keyLocation: SITE_CONFIG.indexNow.keyLocation,
      results,
    })
  } catch (error: any) {
    console.error("IndexNow submission error:", error)
    return NextResponse.json(
      { error: error.message || "Failed to submit IndexNow request" },
      { status: 500 }
    )
  }
}

