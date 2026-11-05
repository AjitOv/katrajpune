"use client"

import { useState, useEffect, Suspense } from "react"
import { useSearchParams } from "next/navigation"
import Link from "next/link"
import { ShieldCheck, CheckCircle2, ArrowRight, ExternalLink, Search, Building2, MapPin } from "lucide-react"
import DhanDematBanner from "@/components/ads/DhanDematBanner"

const RAZORPAY_PAYMENT_URL = "https://rzp.io/rzp/g0GBqkap"

function ClaimListingContent() {
  const searchParams = useSearchParams()
  const initialSlug = searchParams.get("slug") || ""

  const [businesses, setBusinesses] = useState<any[]>([])
  const [selectedBusiness, setSelectedBusiness] = useState<any | null>(null)
  const [searchTerm, setSearchTerm] = useState("")
  const [ownerName, setOwnerName] = useState("")
  const [ownerPhone, setOwnerPhone] = useState("")
  const [ownerEmail, setOwnerEmail] = useState("")
  const [submitted, setSubmitted] = useState(false)

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

  const handleClaim = (e: React.FormEvent) => {
    e.preventDefault()
    window.open(RAZORPAY_PAYMENT_URL, "_blank", "noopener,noreferrer")
    setSubmitted(true)
  }

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
              className="text-xs font-bold px-3 py-1.5 rounded-lg bg-orange text-white hover:bg-orange/90 transition-colors"
            >
              + List New Business (₹350)
            </Link>
          </div>
        </div>
      </header>

      {/* Hero Banner */}
      <section className="bg-gradient-to-br from-navy via-navy to-[#18395B] text-white py-12 px-4 sm:px-6">
        <div className="max-w-3xl mx-auto text-center space-y-3">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/20 border border-emerald-400/40 text-emerald-300 text-xs font-bold uppercase tracking-wider">
            <ShieldCheck className="w-3.5 h-3.5" /> Official Owner Verification
          </div>
          <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight">
            Claim Your Business on <span className="text-orange">KatrajPune</span>
          </h1>
          <p className="text-sm sm:text-base text-gray-300">
            Are you the business owner or manager? Claim your verified listing for just <strong>₹350/-</strong> to update phone numbers, WhatsApp, photos, and receive customer leads.
          </p>
        </div>
      </section>

      {/* Main Container */}
      <main className="max-w-5xl mx-auto px-4 sm:px-6 py-10">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-8 items-start">
          {/* Left: Search & Select Business + Claim Form */}
          <div className="md:col-span-7 space-y-6">
            <div className="bg-white rounded-2xl shadow-sm border border-navy/10 p-6 sm:p-7">
              <h2 className="text-base font-bold text-navy mb-4 flex items-center gap-2">
                <Building2 className="w-5 h-5 text-orange" />
                Step 1: Select Your Business
              </h2>

              {selectedBusiness ? (
                <div className="p-4 rounded-xl bg-orange/5 border border-orange/20 mb-6 flex items-start justify-between gap-3">
                  <div className="space-y-1">
                    <span className="text-[10px] font-bold text-orange uppercase tracking-wider block">
                      Selected Listing
                    </span>
                    <h3 className="font-bold text-navy text-base">{selectedBusiness.name}</h3>
                    <p className="text-xs text-gray-600 flex items-center gap-1">
                      <MapPin className="w-3.5 h-3.5 text-orange shrink-0" />
                      {selectedBusiness.address || selectedBusiness.locality}
                    </p>
                    <p className="text-xs text-gray-500">
                      Category: <span className="capitalize font-medium">{selectedBusiness.category}</span>
                    </p>
                  </div>
                  <button
                    onClick={() => setSelectedBusiness(null)}
                    className="text-xs font-bold text-navy/60 hover:text-navy underline shrink-0"
                  >
                    Change
                  </button>
                </div>
              ) : (
                <div className="space-y-3 mb-6">
                  <label className="block text-xs font-bold text-navy uppercase tracking-wider">
                    Search Business Name
                  </label>
                  <div className="relative">
                    <Search className="w-4 h-4 text-gray-400 absolute left-3.5 top-3.5" />
                    <input
                      type="text"
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      placeholder="Type your business name (e.g. Shreeji, Sai Sneh...)"
                      className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-navy/20 text-sm focus:outline-none focus:border-orange focus:ring-1 focus:ring-orange"
                    />
                  </div>

                  {filteredBusinesses.length > 0 && (
                    <div className="border border-navy/10 rounded-xl divide-y divide-navy/5 max-h-60 overflow-y-auto bg-white shadow-lg">
                      {filteredBusinesses.map((b) => (
                        <div
                          key={b.slug}
                          onClick={() => {
                            setSelectedBusiness(b)
                            setSearchTerm("")
                          }}
                          className="p-3 hover:bg-orange/5 cursor-pointer flex items-center justify-between gap-2 transition-colors"
                        >
                          <div>
                            <div className="text-sm font-bold text-navy">{b.name}</div>
                            <div className="text-xs text-gray-500">{b.locality}</div>
                          </div>
                          <span className="text-xs font-bold text-orange shrink-0">Claim →</span>
                        </div>
                      ))}
                    </div>
                  )}

                  {searchTerm.trim().length > 1 && filteredBusinesses.length === 0 && (
                    <div className="p-3 bg-gray-50 rounded-xl text-xs text-gray-500 text-center">
                      Business not found in existing records?{" "}
                      <Link href="/add-business" className="text-orange font-bold underline">
                        Add it as a new business listing here →
                      </Link>
                    </div>
                  )}
                </div>
              )}

              {/* Step 2: Owner Verification Form */}
              <h2 className="text-base font-bold text-navy mb-4 pt-4 border-t border-navy/10 flex items-center gap-2">
                <ShieldCheck className="w-5 h-5 text-emerald-600" />
                Step 2: Owner Contact Details
              </h2>

              {submitted && (
                <div className="mb-6 p-4 bg-emerald-50 border border-emerald-200 rounded-xl text-emerald-900 text-sm space-y-2">
                  <div className="font-bold flex items-center gap-2">
                    <CheckCircle2 className="w-5 h-5 text-emerald-600" />
                    Razorpay Checkout Launched!
                  </div>
                  <p>
                    Once payment of ₹350/- is completed, our Katraj team will verify your ownership and give you full manager access.
                  </p>
                  <a
                    href={RAZORPAY_PAYMENT_URL}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-block text-xs font-bold text-emerald-700 underline"
                  >
                    Click here to open Razorpay payment window again ↗
                  </a>
                </div>
              )}

              <form onSubmit={handleClaim} className="space-y-4">
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
                <div className="p-4 rounded-xl bg-emerald-50/60 border border-emerald-200 space-y-2">
                  <div className="flex items-center justify-between text-sm">
                    <span className="font-semibold text-navy">Ownership Verification &amp; Claim</span>
                    <span className="font-bold text-navy">₹350.00</span>
                  </div>
                  <div className="flex items-center justify-between text-xs text-emerald-800">
                    <span>Lifetime verified badge &amp; lead access</span>
                    <span className="font-bold">Included</span>
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={!selectedBusiness}
                  className="w-full bg-emerald-600 hover:bg-emerald-700 disabled:opacity-50 text-white font-extrabold text-sm py-3.5 px-6 rounded-xl shadow-lg transition-all flex items-center justify-center gap-2 cursor-pointer disabled:cursor-not-allowed"
                >
                  <span>Pay ₹350 &amp; Claim Ownership via Razorpay</span>
                  <ArrowRight className="w-4 h-4" />
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
            <div className="bg-white rounded-2xl shadow-sm border border-navy/10 p-6 space-y-4">
              <h3 className="font-bold text-navy text-sm uppercase tracking-wider">
                Why Claim on KatrajPune?
              </h3>
              <ul className="space-y-3 text-xs text-gray-600">
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

              <div className="pt-2 border-t border-navy/5">
                <a
                  href={RAZORPAY_PAYMENT_URL}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full py-2.5 px-3 bg-gray-100 hover:bg-gray-200 text-navy font-bold text-xs rounded-xl flex items-center justify-center gap-1.5 transition-colors"
                >
                  <span>Quick Pay ₹350 on Razorpay</span>
                  <ExternalLink className="w-3.5 h-3.5" />
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

