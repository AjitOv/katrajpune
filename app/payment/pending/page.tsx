"use client"

import { Suspense } from "react"
import { useSearchParams } from "next/navigation"
import Link from "next/link"
import { Clock, ShieldCheck, ArrowRight, ExternalLink, HelpCircle, FileText, CheckCircle2 } from "lucide-react"
import { SITE_CONFIG, getContextualWhatsAppUrl } from "@/lib/config"

function PaymentPendingContent() {
  const searchParams = useSearchParams()
  const ref = searchParams.get("ref") || "KP-REF-PENDING"
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

        {/* Pending / Received Status Card */}
        <div className="bg-white rounded-3xl shadow-sm border border-navy/10 overflow-hidden">
          <div className="bg-gradient-to-r from-amber-500 to-orange p-6 text-white text-center space-y-2">
            <div className="inline-flex items-center justify-center w-14 h-14 rounded-full bg-white/20 backdrop-blur-md shadow-inner mb-1">
              <Clock className="w-7 h-7 text-white" />
            </div>
            <h1 className="text-2xl sm:text-3xl font-black">Submission &amp; Payment Initiated</h1>
            <p className="text-white/90 text-sm max-w-md mx-auto">
              We have recorded your business listing details for <strong>{businessName}</strong>.
            </p>
          </div>

          <div className="p-6 sm:p-8 space-y-6">
            {/* Reference Badge */}
            <div className="bg-navy/5 border border-navy/10 rounded-2xl p-4 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
              <div>
                <p className="text-xs font-bold text-navy/60 uppercase tracking-wider">Transaction Reference</p>
                <p className="text-lg font-mono font-black text-navy mt-0.5">{ref}</p>
              </div>
              <div className="text-left sm:text-right">
                <p className="text-xs font-bold text-navy/60 uppercase tracking-wider">Listing Fee</p>
                <p className="text-lg font-black text-emerald-600 mt-0.5">{amount}</p>
              </div>
            </div>

            {/* Mandatory 48-Hour Service Timeline Box */}
            <div className="bg-amber-50/80 border border-amber-200 rounded-2xl p-5 flex items-start gap-3.5">
              <div className="w-8 h-8 rounded-full bg-amber-100 flex items-center justify-center shrink-0 mt-0.5">
                <Clock className="w-4 h-4 text-amber-700" />
              </div>
              <div className="space-y-1">
                <p className="text-xs font-bold text-amber-900 uppercase tracking-wider">
                  Official Verification Standard
                </p>
                <p className="text-sm font-medium text-amber-950 leading-relaxed">
                  {SITE_CONFIG.listing.slaNotice}
                </p>
              </div>
            </div>

            {/* Next Steps Progression */}
            <div className="space-y-3">
              <h2 className="text-xs font-bold text-navy/60 uppercase tracking-wider">What happens next:</h2>
              <div className="space-y-3 text-sm text-navy/80">
                <div className="flex items-start gap-3">
                  <div className="w-6 h-6 rounded-full bg-emerald-100 text-emerald-700 font-bold text-xs flex items-center justify-center shrink-0 mt-0.5">
                    ✓
                  </div>
                  <div>
                    <p className="font-bold text-navy">1. Listing Record Persisted</p>
                    <p className="text-xs text-gray-500">Your store information, phone numbers, and address are safely stored.</p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <div className="w-6 h-6 rounded-full bg-blue-100 text-blue-700 font-bold text-xs flex items-center justify-center shrink-0 mt-0.5">
                    2
                  </div>
                  <div>
                    <p className="font-bold text-navy">2. Payment Reconciliation</p>
                    <p className="text-xs text-gray-500">Our backend reconciles your Razorpay payment against transaction reference {ref}.</p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <div className="w-6 h-6 rounded-full bg-gray-100 text-gray-600 font-bold text-xs flex items-center justify-center shrink-0 mt-0.5">
                    3
                  </div>
                  <div>
                    <p className="font-bold text-navy">3. Map &amp; Directory Live within 48 Hours</p>
                    <p className="text-xs text-gray-500">Once verified, your business profile and map pin go live across KatrajPune.</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="space-y-3 pt-2">
              <a
                href={whatsappUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full flex items-center justify-center gap-2 bg-[#25D366] hover:bg-[#20bd5a] text-white font-bold py-3.5 px-4 rounded-xl shadow-md transition-all text-sm"
              >
                <span>Confirm on WhatsApp Support</span>
                <ExternalLink className="w-4 h-4" />
              </a>

              <div className="flex items-center justify-center gap-4 text-xs font-semibold text-gray-500 pt-2">
                <Link href="/" className="hover:text-navy transition-colors">
                  ← Return to Map
                </Link>
                <span>•</span>
                <Link href="/directory" className="hover:text-navy transition-colors">
                  Browse Directory
                </Link>
              </div>
            </div>
          </div>
        </div>

        {/* Honest Security Disclaimer */}
        <p className="text-center text-[11px] text-gray-400">
          KatrajPune verifies all transactions server-side. Listings are published only after valid payment reconciliation and location review.
        </p>
      </div>
    </div>
  )
}

export default function PaymentPendingPage() {
  return (
    <Suspense fallback={<div className="p-10 text-center">Loading payment details...</div>}>
      <PaymentPendingContent />
    </Suspense>
  )
}
