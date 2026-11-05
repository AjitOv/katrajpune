"use client"

import { Suspense } from "react"
import { useSearchParams } from "next/navigation"
import Link from "next/link"
import { AlertTriangle, RefreshCw, ExternalLink, ArrowRight } from "lucide-react"
import { SITE_CONFIG, getContextualWhatsAppUrl } from "@/lib/config"

function PaymentFailedContent() {
  const searchParams = useSearchParams()
  const ref = searchParams.get("ref") || "KP-PAYMENT-FAILED"
  const businessName = searchParams.get("name") || "Your Business"
  const reason = searchParams.get("reason") || "The payment could not be completed or was cancelled."

  const whatsappUrl = getContextualWhatsAppUrl({
    action: "payment",
    businessName,
    referenceId: ref,
  })

  return (
    <div className="min-h-screen bg-background py-10 px-4 sm:px-6">
      <div className="max-w-xl mx-auto space-y-6">
        {/* Header Branding */}
        <div className="text-center space-y-2">
          <Link href="/" className="inline-flex items-center gap-2 group">
            <span className="text-2xl">📍</span>
            <div className="flex items-center gap-1.5">
              <span className="text-xs font-black tracking-widest text-navy/60 uppercase">katraj</span>
              <span className="w-1.5 h-1.5 rounded-full bg-orange" />
              <span className="text-xl font-bold text-navy">pune</span>
            </div>
          </Link>
        </div>

        {/* Failed Card */}
        <div className="bg-white rounded-3xl shadow-sm border border-navy/10 overflow-hidden">
          <div className="bg-gradient-to-r from-red-600 to-rose-700 p-6 text-white text-center space-y-2">
            <div className="inline-flex items-center justify-center w-14 h-14 rounded-full bg-white/20 backdrop-blur-md shadow-inner mb-1">
              <AlertTriangle className="w-8 h-8 text-white" />
            </div>
            <h1 className="text-2xl sm:text-3xl font-black">Payment Incomplete</h1>
            <p className="text-white/90 text-sm max-w-md mx-auto">
              We were unable to process the ₹350 listing payment for <strong>{businessName}</strong>.
            </p>
          </div>

          <div className="p-6 sm:p-8 space-y-6">
            <div className="bg-red-50 border border-red-200 rounded-2xl p-4 text-sm text-red-900 space-y-1">
              <p className="font-bold">What happened?</p>
              <p className="text-xs text-red-800 leading-relaxed">{reason}</p>
              <p className="text-xs font-mono text-gray-500 pt-1">Reference: {ref}</p>
            </div>

            <div className="space-y-3">
              <p className="text-xs text-gray-600 leading-relaxed">
                Don't worry — your listing details are saved with us. If money was deducted from your account, please message our support team with your transaction screenshot for manual verification.
              </p>

              {/* Direct Retry Button */}
              <a
                href={SITE_CONFIG.listing.paymentUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full flex items-center justify-center gap-2 bg-navy hover:bg-blue text-white font-bold py-3.5 px-4 rounded-xl shadow-md transition-all text-sm"
              >
                <RefreshCw className="w-4 h-4" />
                <span>Retry Payment (₹350 on Razorpay)</span>
                <ExternalLink className="w-4 h-4" />
              </a>

              {/* WhatsApp Support Button */}
              <a
                href={whatsappUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full flex items-center justify-center gap-2 bg-[#25D366] hover:bg-[#20bd5a] text-white font-bold py-3.5 px-4 rounded-xl shadow-md transition-all text-sm"
              >
                <span>Get Help on WhatsApp Support</span>
                <ExternalLink className="w-4 h-4" />
              </a>
            </div>

            <div className="flex items-center justify-center gap-4 text-xs font-semibold text-gray-500 pt-2 border-t border-navy/10">
              <Link href="/add-business" className="hover:text-navy transition-colors">
                ← Back to Add Business
              </Link>
              <span>•</span>
              <Link href="/" className="hover:text-navy transition-colors">
                Home Map
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default function PaymentFailedPage() {
  return (
    <Suspense fallback={<div className="p-10 text-center">Loading...</div>}>
      <PaymentFailedContent />
    </Suspense>
  )
}
