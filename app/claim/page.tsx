"use client"

import { useState, useEffect, Suspense } from "react"
import { useSearchParams, useRouter } from "next/navigation"
import Link from "next/link"
import {
  ShieldCheck,
  CheckCircle2,
  ArrowRight,
  ExternalLink,
  Search,
  Building2,
  MapPin,
  Clock,
  MessageCircle,
} from "lucide-react"
import DhanDematBanner from "@/components/ads/DhanDematBanner"
import { SITE_CONFIG, getContextualWhatsAppUrl } from "@/lib/config"

function ClaimListingContent() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const initialSlug = searchParams.get("slug") || ""

  const [businesses, setBusinesses] = useState<any[]>([])
  const [selectedBusiness, setSelectedBusiness] = useState<any | null>(null)
  const [searchTerm, setSearchTerm] = useState("")
  const [ownerName, setOwnerName] = useState("")
  const [ownerPhone, setOwnerPhone] = useState("")
  const [ownerEmail, setOwnerEmail] = useState("")
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [errorMsg, setErrorMsg] = useState<string | null>(null)

  // Fetch businesses for search
  useEffect(() => {
    fetch("/api/businesses/all")
      .then((res) => res.json())
      .then((data) => {
        if (Array.isArray(data)) {
          setBusinesses(data)
          if (initialSlug) {
            const found = data.find((b) => b.slug === initialSlug)
            if (found) setSelectedBusiness(found)
          }
        }
      })
      .catch((err) => console.error(err))
  }, [initialSlug])

  const filteredBusinesses =
    searchTerm.trim().length > 1
      ? businesses
          .filter(
            (b) =>
              b.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
              b.locality?.toLowerCase().includes(searchTerm.toLowerCase())
          )
          .slice(0, 8)
      : []

  const handleClaim = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!selectedBusiness) return

    setIsSubmitting(true)
    setErrorMsg(null)

    try {
      const res = await fetch("/api/payment/create", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          businessName: selectedBusiness.name,
          category: selectedBusiness.category || "shopping",
          locality: selectedBusiness.locality || "Katraj",
          address: selectedBusiness.address || `${selectedBusiness.name}, Katraj, Pune`,
          phone: ownerPhone,
          whatsapp: ownerPhone,
          email: ownerEmail || null,
          website: selectedBusiness.website || null,
          description: `Ownership claim submitted by ${ownerName}. Current status: Pending verification.`,
          amount: SITE_CONFIG.listing.feeINR,
        }),
      })

      const data = await res.json()
      if (!res.ok || !data.success) {
        throw new Error(data.error || "Failed to initiate claim")
      }

      const { transactionRef, paymentUrl } = data

      if (typeof window !== "undefined") {
        window.open(paymentUrl, "_blank", "noopener,noreferrer")
      }

      router.push(
        `/payment/pending?ref=${encodeURIComponent(transactionRef)}&name=${encodeURIComponent(
          selectedBusiness.name
        )}&amount=${encodeURIComponent(SITE_CONFIG.listing.feeDisplay)}`
      )
    } catch (err: any) {
      console.error("Claim submission failed:", err)
      setErrorMsg(err?.message || "Failed to process claim. Please try again.")
      setIsSubmitting(false)
    }
  }

  const supportWhatsAppUrl = getContextualWhatsAppUrl({
    action: "claim",
    businessName: selectedBusiness?.name || undefined,
  })

  return (
    <div className="min-h-screen bg-background">
      {/* Top Header */}
      <header className="sticky top-0 z-30 bg-white/95 backdrop-blur-md border-b border-navy/10 px-4 sm:px-6 py-3.5">
        <div className="max-w-6xl mx-auto flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2 group">
            <span className="text-xl">📍</span>
            <div className="flex items-center gap-1.5">
              <span className="text-xs font-black tracking-widest text-navy/60 uppercase">katraj</span>
              <span className="w-1.5 h-1.5 rounded-full bg-orange" />
              <span className="text-lg font-bold text-navy">pune</span>
            </div>
          </Link>
          <div className="flex items-center gap-3">
            <Link
              href="/directory"
              className="text-xs font-bold text-navy hover:text-orange transition-colors"
            >
              Directory
            </Link>
            <Link
              href="/add-business"
              className="text-xs font-bold px-3 py-1.5 rounded-lg bg-orange text-white hover:bg-orange/90 transition-colors shadow-sm"
            >
              + List New Business ({SITE_CONFIG.listing.feeDisplay})
            </Link>
          </div>
        </div>
      </header>

      {/* Hero */}
      <section className="bg-gradient-to-br from-navy via-[#162D4A] to-blue text-white py-12 px-4 sm:px-6 relative overflow-hidden">
        <div className="max-w-5xl mx-auto flex flex-col md:flex-row items-center justify-between gap-8">
          <div className="text-center md:text-left space-y-3">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-400/20 border border-amber-300/40 text-amber-200 text-xs font-bold uppercase tracking-wider">
              <ShieldCheck className="w-4 h-4 text-amber-300" />
              <span>Official Merchant Accreditation</span>
            </div>
            <h1 className="text-3xl sm:text-5xl font-black tracking-tight">
              Claim Your Business on <span className="text-orange">KatrajPune</span>
            </h1>
            <p className="text-sm sm:text-base text-gray-300 max-w-xl">
              Are you the business owner or manager? Claim your verified listing for just {SITE_CONFIG.listing.feeDisplay}/year (<span className="line-through text-gray-400">{SITE_CONFIG.listing.regularFeeDisplay}</span> — Diwali offer, less than ₹1/day for first 100 businesses) to receive your official <strong>Gold Verified Seal</strong>, direct WhatsApp leads, and priority ranking.
            </p>
          </div>
          <div className="shrink-0 flex flex-col items-center">
            <img
              src="/images/katraj-verified-seal.jpg"
              alt="Official KatrajPune Verified Seal"
              className="w-32 h-32 sm:w-36 sm:h-36 rounded-full shadow-2xl border-2 border-amber-400/60 object-cover"
            />
            <span className="text-[11px] font-bold text-amber-300 uppercase tracking-widest mt-2">
              Official Trust Seal
            </span>
          </div>
        </div>
      </section>

      {/* Main Section */}
      <main className="max-w-6xl mx-auto px-4 sm:px-6 py-10">
        {/* Service Standard SLA Alert Banner */}
        <div className="mb-8 p-4 sm:p-5 bg-amber-50 border border-amber-200 rounded-2xl flex items-start gap-3.5 shadow-sm">
          <div className="w-9 h-9 rounded-full bg-amber-100 flex items-center justify-center shrink-0 mt-0.5">
            <Clock className="w-5 h-5 text-amber-800" />
          </div>
          <div className="space-y-1">
            <p className="text-xs font-bold text-amber-900 uppercase tracking-wider">
              Verification &amp; Publishing Timeline
            </p>
            <p className="text-sm font-semibold text-amber-950">
              {SITE_CONFIG.listing.slaNotice}
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-12 gap-8 items-start">
          {/* Left Form: Find & Claim */}
          <div className="md:col-span-7">
            <div className="bg-white rounded-2xl shadow-sm border border-navy/10 p-6 sm:p-8 space-y-6">
              {errorMsg && (
                <div className="p-4 bg-red-50 border border-red-200 rounded-xl text-red-900 text-sm">
                  {errorMsg}
                </div>
              )}

              {/* Step 1: Search & Select */}
              <div className="space-y-3">
                <div className="flex items-center gap-2 text-sm font-bold text-navy">
                  <span>📑 Step 1: Select Your Business</span>
                </div>
                <div className="relative">
                  <label className="block text-xs font-bold text-navy uppercase tracking-wider mb-1.5">
                    Search Business Name
                  </label>
                  <div className="relative">
                    <Search className="w-4 h-4 absolute left-3.5 top-3.5 text-gray-400" />
                    <input
                      type="text"
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      placeholder="Type your business name (e.g. Shreeji, Sai Sneh...)"
                      className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-navy/20 text-sm focus:outline-none focus:border-orange focus:ring-1 focus:ring-orange"
                    />
                  </div>

                  {/* Autocomplete Dropdown */}
                  {filteredBusinesses.length > 0 && (
                    <div className="absolute top-full left-0 right-0 mt-1 bg-white border border-navy/10 rounded-xl shadow-xl z-20 overflow-hidden divide-y divide-navy/5 max-h-60 overflow-y-auto">
                      {filteredBusinesses.map((b) => (
                        <button
                          key={b.slug}
                          type="button"
                          onClick={() => {
                            setSelectedBusiness(b)
                            setSearchTerm("")
                          }}
                          className="w-full text-left p-3 hover:bg-navy/5 transition-colors flex items-center justify-between"
                        >
                          <div>
                            <p className="font-bold text-navy text-sm">{b.name}</p>
                            <p className="text-xs text-gray-500">
                              {b.category} • {b.locality || "Katraj"}
                            </p>
                          </div>
                          <span className="text-xs font-bold text-orange">Select →</span>
                        </button>
                      ))}
                    </div>
                  )}
                </div>

                {/* Selected Business Preview */}
                {selectedBusiness && (
                  <div className="p-4 rounded-xl bg-orange/5 border border-orange/30 flex items-start justify-between gap-3">
                    <div className="flex items-start gap-3">
                      <div className="w-10 h-10 rounded-xl bg-white border border-orange/20 flex items-center justify-center shrink-0">
                        <Building2 className="w-5 h-5 text-orange" />
                      </div>
                      <div>
                        <p className="font-bold text-navy text-sm">{selectedBusiness.name}</p>
                        <p className="text-xs text-gray-600 flex items-center gap-1 mt-0.5">
                          <MapPin className="w-3 h-3 text-orange" />
                          <span>{selectedBusiness.locality || "Katraj, Pune"}</span>
                        </p>
                      </div>
                    </div>
                    <button
                      type="button"
                      onClick={() => setSelectedBusiness(null)}
                      className="text-xs text-gray-400 hover:text-red-500 font-bold"
                    >
                      Change
                    </button>
                  </div>
                )}
              </div>

              {/* Step 2: Owner Contact Details */}
              <form onSubmit={handleClaim} className="space-y-4 pt-4 border-t border-navy/10">
                <div className="flex items-center gap-2 text-sm font-bold text-navy">
                  <span>🛡️ Step 2: Owner Contact Details</span>
                </div>

                <div>
                  <label className="block text-xs font-bold text-navy uppercase tracking-wider mb-1.5">
                    Your Full Name (Owner / Manager) *
                  </label>
                  <input
                    type="text"
                    required
                    value={ownerName}
                    onChange={(e) => setOwnerName(e.target.value)}
                    placeholder="e.g. Ramesh Patil"
                    className="w-full px-3.5 py-2.5 rounded-xl border border-navy/20 text-sm focus:outline-none focus:border-orange focus:ring-1 focus:ring-orange"
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold text-navy uppercase tracking-wider mb-1.5">
                      Phone / WhatsApp *
                    </label>
                    <input
                      type="tel"
                      required
                      value={ownerPhone}
                      onChange={(e) => setOwnerPhone(e.target.value)}
                      placeholder="+91 98765 43210"
                      className="w-full px-3.5 py-2.5 rounded-xl border border-navy/20 text-sm focus:outline-none focus:border-orange focus:ring-1 focus:ring-orange"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-navy uppercase tracking-wider mb-1.5">
                      Email Address
                    </label>
                    <input
                      type="email"
                      value={ownerEmail}
                      onChange={(e) => setOwnerEmail(e.target.value)}
                      placeholder="business@gmail.com"
                      className="w-full px-3.5 py-2.5 rounded-xl border border-navy/20 text-sm focus:outline-none focus:border-orange focus:ring-1 focus:ring-orange"
                    />
                  </div>
                </div>

                {/* Pricing Fee Card */}
                <div className="p-4 rounded-xl bg-gradient-to-r from-amber-50 to-emerald-50 border border-emerald-300 space-y-2">
                  <div className="flex items-center justify-between">
                    <div>
                      <span className="font-extrabold text-navy text-sm">🪔 Diwali Special Verification Offer</span>
                      <p className="text-[11px] text-amber-800 font-medium">Limited to First 100 Businesses • Less than ₹1 / day!</p>
                    </div>
                    <div className="text-right">
                      <span className="text-xs text-gray-400 line-through mr-1.5">{SITE_CONFIG.listing.regularFeeDisplay}</span>
                      <span className="text-lg font-black text-emerald-700">{SITE_CONFIG.listing.feeDisplay}</span>
                      <span className="text-[10px] text-gray-500 block">/ 1 full year</span>
                    </div>
                  </div>
                  <div className="flex items-center justify-between text-xs text-emerald-800 pt-1 border-t border-emerald-200/60">
                    <span>Green verified trust badge, WhatsApp button &amp; top ranking</span>
                    <span className="font-bold text-emerald-700">Included</span>
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={!selectedBusiness || isSubmitting}
                  className="w-full bg-emerald-600 hover:bg-emerald-700 disabled:opacity-50 text-white font-extrabold text-sm py-3.5 px-6 rounded-xl shadow-lg transition-all flex items-center justify-center gap-2 cursor-pointer disabled:cursor-not-allowed"
                >
                  {isSubmitting ? (
                    <span>Persisting Details &amp; Opening Razorpay...</span>
                  ) : (
                    <>
                      <span>Pay {SITE_CONFIG.listing.feeDisplay} &amp; Claim Ownership via Razorpay</span>
                      <ArrowRight className="w-4 h-4" />
                    </>
                  )}
                </button>

                {!selectedBusiness && (
                  <p className="text-xs text-center text-amber-600 font-medium">
                    ⚠️ Please select your business in Step 1 above to continue.
                  </p>
                )}
              </form>
            </div>
          </div>

          {/* Right: Benefits & Dhan Ad */}
          <div className="md:col-span-5 space-y-6">
            {/* Dedicated Business Growth Partner */}
            <div className="bg-gradient-to-br from-navy via-[#162D4A] to-navy text-white rounded-2xl shadow-sm border border-navy/10 p-5 flex items-center gap-4">
              <img
                src="/images/corporate-advisor-male.jpg"
                alt="Katraj Business Growth Advisor"
                className="w-16 h-16 rounded-xl object-cover shadow-md border border-white/20 shrink-0"
              />
              <div className="space-y-1">
                <span className="text-[10px] font-bold uppercase tracking-wider text-amber-300">
                  Dedicated Support
                </span>
                <h4 className="text-xs font-bold text-white">
                  Verified Local Commerce Partner
                </h4>
                <p className="text-[11px] text-gray-300 leading-relaxed">
                  Join 1,444+ verified Katraj businesses connecting with local residents and students daily.
                </p>
              </div>
            </div>

            <div className="bg-white rounded-2xl shadow-sm border border-navy/10 p-6 space-y-4">
              <h3 className="font-bold text-navy text-sm uppercase tracking-wider">
                Why Claim on KatrajPune?
              </h3>
              <ul className="space-y-3 text-xs text-gray-600">
                <li className="flex items-start gap-2.5">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                  <span>Receive the official <strong>Gold Verified Accreditation Seal</strong> and digital certificate.</span>
                </li>
                <li className="flex items-start gap-2.5">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                  <span>Update your direct WhatsApp and Phone number so customers call you directly.</span>
                </li>
                <li className="flex items-start gap-2.5">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                  <span>Correct your opening hours, address, and upload your real store photos.</span>
                </li>
                <li className="flex items-start gap-2.5">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                  <span>Receive a <strong>Verified Green Checkmark</strong> on the interactive map &amp; directory.</span>
                </li>
                <li className="flex items-start gap-2.5">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                  <span>Priority placement in category searches for your micro-locality.</span>
                </li>
              </ul>

              <div className="pt-2 border-t border-navy/5 space-y-2">
                <a
                  href={supportWhatsAppUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full py-2.5 px-3 bg-emerald-50 hover:bg-emerald-100 text-emerald-800 font-bold text-xs rounded-xl flex items-center justify-center gap-1.5 transition-colors border border-emerald-200"
                >
                  <MessageCircle className="w-3.5 h-3.5 text-emerald-600" />
                  <span>Need Help Claiming? Chat on WhatsApp</span>
                </a>
              </div>
            </div>

            {/* Sponsored Dhan Ad Card */}
            <DhanDematBanner variant="card" />
          </div>
        </div>

        {/* Bottom Horizontal Dhan Banner */}
        <div className="mt-12">
          <DhanDematBanner variant="horizontal" />
        </div>
      </main>
    </div>
  )
}

export default function ClaimListingPage() {
  return (
    <Suspense fallback={<div className="p-10 text-center">Loading claim portal...</div>}>
      <ClaimListingContent />
    </Suspense>
  )
}
