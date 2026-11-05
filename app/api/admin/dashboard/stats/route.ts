import { NextResponse } from "next/server"
import { createServerClient } from "@/lib/supabase/server"
import { verifyAdminSession } from "@/lib/auth/admin"
import { getLocalBusinesses } from "@/lib/data/businesses"

export const dynamic = "force-dynamic"

export async function GET() {
  const { authorized, user, errorResponse } = await verifyAdminSession()
  if (!authorized || !user) return errorResponse!

  const supabase = createServerClient()

  let totalBusinesses = 0
  let approvedListings = 0
  let pendingListings = 0
  let rejectedListings = 0
  let paidListings = 0
  let pendingPayments = 0
  let activeAds = 0
  let auditEnquiries = 0

  // 1. Fetch businesses stats
  try {
    const { data: biz } = await supabase.from("businesses").select("status, payment_status")
    if (biz && biz.length > 0) {
      totalBusinesses = biz.length
      approvedListings = biz.filter((b) => b.status === "approved").length
      pendingListings = biz.filter((b) => b.status === "pending").length
      rejectedListings = biz.filter((b) => b.status === "rejected").length
      paidListings = biz.filter((b) => b.payment_status === "paid").length
      pendingPayments = biz.filter((b) => b.payment_status === "pending").length
    } else {
      // Fallback to local dataset
      const local = getLocalBusinesses()
      totalBusinesses = local.length
      approvedListings = local.filter((b) => b.status === "approved").length
      pendingListings = local.filter((b) => b.status === "pending").length
      rejectedListings = local.filter((b) => b.status === "rejected").length
    }
  } catch {
    const local = getLocalBusinesses()
    totalBusinesses = local.length
    approvedListings = local.filter((b) => b.status === "approved").length
  }

  // 2. Fetch ad campaigns stats
  try {
    const { data: ads } = await supabase.from("ad_campaigns").select("status")
    if (ads) {
      activeAds = ads.filter((a) => a.status === "active").length
    }
  } catch {}

  // 3. Fetch audit enquiries stats
  try {
    const { data: audits } = await supabase.from("business_audit_enquiries").select("id")
    if (audits) {
      auditEnquiries = audits.length
    }
  } catch {}

  return NextResponse.json({
    totalBusinesses,
    approvedListings,
    pendingListings,
    rejectedListings,
    paidListings,
    pendingPayments,
    activeAds,
    auditEnquiries,
  })
}
