"use client"

import { Suspense } from "react"
import { useSearchParams } from "next/navigation"
import Link from "next/link"
import { CheckCircle2, ShieldCheck, Clock, ExternalLink, ArrowRight } from "lucide-react"
import { SITE_CONFIG, getContextualWhatsAppUrl } from "@/lib/config"

function PaymentSuccessContent() {
  const searchParams = useSearchParams()
  const ref = searchParams.get("ref") || searchParams.get("payment_id") || "KP-VERIFIED-TX"
  const businessName = searchParams.get("name") || "Your Business"
  const amount = searchParams.get("amount") || "₹350"

  const whatsappUrl = getContextualWhatsAppUrl({
    action: "payment",
    businessName,
    referenceId: ref,
  })

  return (
    <div className="min-h-screen bg-background py-10 px-4 sm:px-6">
      <div className="max-w-2xl mx-auto space-y-6">
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

        {/* Success Card */}
        <div className="bg-white rounded-3xl shadow-sm border border-navy/10 overflow-hidden">
          <div className="bg-gradient-to-r from-emerald-600 via-teal-600 to-indigo-700 p-6 text-white text-center space-y-2">
            <div className="inline-flex items-center justify-center w-14 h-14 rounded-full bg-white/20 backdrop-blur-md shadow-inner mb-1">
              <CheckCircle2 className="w-8 h-8 text-white" />
            </div>
            <div className="inline-flex items-center gap-1.5 bg-white/20 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider">
              <ShieldCheck className="w-3.5 h-3.5" />
              <span>Payment Verified</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-black">Listing Confirmed!</h1>
            <p className="text-white/90 text-sm max-w-md mx-auto">
              Thank you for listing <strong>{businessName}</strong> on KatrajPune.
            </p>
          </div>

          <div className="p-6 sm:p-8 space-y-6">
            {/* Receipt Summary */}
            <div className="bg-navy/5 border border-navy/10 rounded-2xl p-5 space-y-3">
              <div className="flex items-center justify-between text-xs font-bold text-navy/60 uppercase tracking-wider pb-2 border-b border-navy/10">
                <span>Receipt Summary</span>
                <span className="text-emerald-700 font-bold">PAID</span>
              </div>
              <div className="flex items-center justify-between text-sm">
                <span className="text-gray-600">Transaction ID:</span>
                <span className="font-mono font-bold text-navy">{ref}</span>
              </div>
              <div className="flex items-center justify-between text-sm">
                <span className="text-gray-600">Business:</span>
                <span className="font-bold text-navy">{businessName}</span>
              </div>
              <div className="flex items-center justify-between text-sm">
                <span className="text-gray-600">Amount Paid:</span>
                <span className="font-black text-navy">{amount} (One-Time Lifetime)</span>
              </div>
            </div>

            {/* Mandatory 48-Hour Review Notice */}
            <div className="bg-blue-50 border border-blue-200 rounded-2xl p-5 flex items-start gap-3.5">
              <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center shrink-0 mt-0.5">
                <Clock className="w-4 h-4 text-blue-700" />
              </div>
              <div className="space-y-1">
                <p className="text-xs font-bold text-blue-900 uppercase tracking-wider">
                  Review &amp; Update Standard
                </p>
                <p className="text-sm font-medium text-blue-950 leading-relaxed">
                  {SITE_CONFIG.listing.slaNotice}
                </p>
              </div>
            </div>

            {/* What Happens Next */}
            <div className="space-y-3">
              <h2 className="text-xs font-bold text-navy/60 uppercase tracking-wider">Next Steps:</h2>
              <ul className="space-y-2 text-sm text-gray-700">
                <li className="flex items-start gap-2">
                  <span className="text-emerald-600 font-bold">✓</span>
                  <span>Our moderation team reviews your pin location and details for accuracy.</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-emerald-600 font-bold">✓</span>
                  <span>Your direct WhatsApp CTA and Google reviews sync to your profile.</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-emerald-600 font-bold">✓</span>
                  <span>You will receive an update on WhatsApp once your listing is published.</span>
                </li>
              </ul>
            </div>

            {/* Support CTA */}
            <div className="space-y-3 pt-2">
              <a
                href={whatsappUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full flex items-center justify-center gap-2 bg-[#25D366] hover:bg-[#20bd5a] text-white font-bold py-3.5 px-4 rounded-xl shadow-md transition-all text-sm"
              >
                <span>Message Support on WhatsApp</span>
                <ExternalLink className="w-4 h-4" />
              </a>

              <div className="flex items-center justify-center gap-4 text-xs font-semibold text-gray-500 pt-2">
                <Link href="/" className="hover:text-navy transition-colors">
                  ← Return to Map
                </Link>
                <span>•</span>
                <Link href="/directory" className="hover:text-navy transition-colors">
                  Explore Directory
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default function PaymentSuccessPage() {
  return (
    <Suspense fallback={<div className="p-10 text-center">Loading confirmation...</div>}>
      <PaymentSuccessContent />
    </Suspense>
  )
}
