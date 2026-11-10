import { NextRequest, NextResponse } from "next/server"
import { verifyAdminSession } from "@/lib/auth/admin"

export const dynamic = "force-dynamic"

export async function GET(request: NextRequest) {
  const { authorized, user, errorResponse } = await verifyAdminSession(request)
  if (!authorized || !user) return errorResponse!

  const hasFb = !!(process.env.FACEBOOK_PAGE_ID && process.env.FACEBOOK_PAGE_ACCESS_TOKEN)
  const hasIg = !!(process.env.INSTAGRAM_ACCOUNT_ID && process.env.FACEBOOK_PAGE_ACCESS_TOKEN)
  const hasLi = !!(process.env.LINKEDIN_ACCESS_TOKEN && process.env.LINKEDIN_AUTHOR_URN)

  return NextResponse.json({
    facebook: {
      connected: hasFb,
      pageId: process.env.FACEBOOK_PAGE_ID ? `${process.env.FACEBOOK_PAGE_ID.substring(0, 4)}...` : null,
    },
    instagram: {
      connected: hasIg,
      accountId: process.env.INSTAGRAM_ACCOUNT_ID ? `${process.env.INSTAGRAM_ACCOUNT_ID.substring(0, 4)}...` : null,
    },
    linkedin: {
      connected: hasLi,
      authorUrn: process.env.LINKEDIN_AUTHOR_URN ? `${process.env.LINKEDIN_AUTHOR_URN.substring(0, 15)}...` : null,
    },
  })
}

