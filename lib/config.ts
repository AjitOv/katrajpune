/**
 * KatrajPune Central Configuration & Settings
 * Configurable defaults that can be overridden via environment variables or Supabase settings
 */

export const SITE_CONFIG = {
  name: "KatrajPune",
  domain: "katrajpune.com",
  baseUrl: process.env.NEXT_PUBLIC_APP_URL || "https://katrajpune.com",
  locality: "Katraj, Pune",
  pincode: "411046",

  // 1. Global WhatsApp Support
  support: {
    phone: process.env.NEXT_PUBLIC_SUPPORT_WHATSAPP || "+917020888195",
    displayPhone: "+91 70208 88195",
    cleanNumber: "917020888195",
    defaultMessage: "Hello KatrajPune Support, I need help with my business listing.",
  },

  // 2. Listing & Pricing Standards
  listing: {
    feeINR: 350,
    feeDisplay: "₹350",
    feeType: "Lifetime",
    slaHours: 48,
    slaNotice:
      "Business listing updates may take up to 48 hours after successful payment and submission of the required information.",
    paymentUrl: process.env.NEXT_PUBLIC_RAZORPAY_PAYMENT_URL || "https://rzp.io/rzp/g0GBqkap",
  },

  // 3. Free Zotoz AI Visibility Audit
  zotozAudit: {
    headline: "Is Your Business Visible on AI Search?",
    subheadline:
      "Discover how your business appears across AI-powered search and answer platforms. Get a free Zotoz AI Visibility Audit and find opportunities to improve your online visibility.",
    ctaText: "Get Free AI Visibility Audit",
    destinationUrl: "/free-ai-audit",
    enabled: true,
  },

  // 4. External Affiliate Credentials
  affiliates: {
    dhanDematUrl: "https://invite.dhan.co/?join=AJAL11",
    amazonTag: "ftechindia-21",
  },

  // 5. IndexNow Protocol (Bing, ChatGPT, Yandex, Naver)
  indexNow: {
    key: "9d9cdc5943686555d7c1f32bcebc7142",
    keyLocation: "https://katrajpune.com/9d9cdc5943686555d7c1f32bcebc7142.txt",
    endpoint: "https://api.indexnow.org/indexnow",
  },
} as const

/**
 * Generate a clean wa.me URL with prefilled text
 */
export function getWhatsAppUrl(
  message?: string,
  phoneNumber: string = SITE_CONFIG.support.cleanNumber
): string {
  const cleanPhone = phoneNumber.replace(/[^0-9]/g, "")
  const text = encodeURIComponent(message || SITE_CONFIG.support.defaultMessage)
  return `https://wa.me/${cleanPhone}?text=${text}`
}

/**
 * Contextual WhatsApp support links
 */
export function getContextualWhatsAppUrl(context: {
  action: "add_business" | "claim" | "payment" | "audit" | "general"
  businessName?: string
  referenceId?: string
}): string {
  let msg: string = SITE_CONFIG.support.defaultMessage

  if (context.action === "add_business") {
    msg = context.businessName
      ? `Hello KatrajPune Support, I have submitted a new listing for "${context.businessName}" and would like to verify my submission.`
      : `Hello KatrajPune Support, I want to add my business listing on KatrajPune.`
  } else if (context.action === "claim") {
    msg = context.businessName
      ? `Hello KatrajPune Support, I am claiming ownership of "${context.businessName}". Please guide me with the verification.`
      : `Hello KatrajPune Support, I need help claiming my business listing on KatrajPune.`
  } else if (context.action === "payment") {
    msg = context.referenceId
      ? `Hello KatrajPune Support, I made a payment for listing (Ref: ${context.referenceId}${
          context.businessName ? ` for "${context.businessName}"` : ""
        }). Please verify my payment status.`
      : `Hello KatrajPune Support, I need assistance with the ₹350 listing payment.`
  } else if (context.action === "audit") {
    msg = context.businessName
      ? `Hello KatrajPune Support, I requested a FREE Zotoz AI Visibility Audit for "${context.businessName}".`
      : `Hello KatrajPune Support, I would like to get a FREE Zotoz AI Visibility Audit for my business.`
  }

  return getWhatsAppUrl(msg)
}
