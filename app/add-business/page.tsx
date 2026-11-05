"use client"

import { useState } from "react"
import Link from "next/link"
import { CheckCircle2, ShieldCheck, Zap, ArrowRight, MessageCircle, MapPin, Star, Building2, ExternalLink } from "lucide-react"
import DhanDematBanner from "@/components/ads/DhanDematBanner"

const RAZORPAY_PAYMENT_URL = "https://rzp.io/rzp/g0GBqkap"

export default function AddBusinessListingPage() {
  const [formData, setFormData] = useState({
    businessName: "",
    category: "shopping",
    locality: "Katraj Chowk",
    address: "",
    phone: "",
    whatsapp: "",
    email: "",
    description: "",
  })
  const [submitted, setSubmitted] = useState(false)

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }))
  }

  const handleProceedToPayment = (e: React.FormEvent) => {
    e.preventDefault()
    // Open Razorpay payment gateway
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
              Browse Directory
            </Link>
            <Link
              href="/claim"
              className="text-xs font-bold px-3 py-1.5 rounded-lg border border-navy/20 text-navy hover:bg-navy/5 transition-colors"
            >
              Claim Existing Business
            </Link>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="bg-gradient-to-br from-navy via-[#17324F] to-blue text-white py-12 px-4 sm:px-6">
        <div className="max-w-4xl mx-auto text-center space-y-4">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-orange/20 border border-orange/40 text-orange-200 text-xs font-bold uppercase tracking-wider">
            <span>🚀</span> Hyperlocal Business Growth
          </div>
          <h1 className="text-3xl sm:text-5xl font-black tracking-tight leading-tight">
            List Your Business on <span className="text-orange">KatrajPune</span>
          </h1>
          <p className="text-base sm:text-lg text-gray-300 max-w-2xl mx-auto">
            Get discovered by 50,000+ local residents, college students, and shoppers looking for businesses in Katraj every month.
          </p>

          {/* Pricing Highlight Pill */}
          <div className="pt-4 flex flex-col sm:flex-row items-center justify-center gap-4">
            <div className="bg-white/10 backdrop-blur-md border border-white/20 rounded-2xl p-4 px-6 text-center">
              <span className="text-xs font-semibold text-gray-300 uppercase tracking-widest block">
                One-Time Listing Fee
              </span>
              <div className="flex items-baseline justify-center gap-1 mt-1">
                <span className="text-4xl font-extrabold text-white">₹350</span>
                <span className="text-xs text-orange font-bold uppercase">Only / Lifetime</span>
              </div>
              <span className="text-[11px] text-emerald-400 font-medium block mt-1">
                ✓ No Monthly Fees • Instant Verification
              </span>
            </div>
          </div>
        </div>
      </section>

      {/* Main Content: Form + What's Included */}
      <main className="max-w-6xl mx-auto px-4 sm:px-6 py-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Left: What You Get for ₹350 */}
          <div className="lg:col-span-5 space-y-6">
            <div className="bg-white rounded-2xl shadow-sm border border-navy/10 p-6 space-y-5">
              <h2 className="text-lg font-black text-navy flex items-center gap-2">
                <Zap className="w-5 h-5 text-orange" />
                What’s Included for ₹350/-:
              </h2>

              <ul className="space-y-3.5 text-sm text-gray-700">
                <li className="flex items-start gap-3">
                  <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0 mt-0.5" />
                  <div>
                    <strong className="text-navy">Interactive Map Pin:</strong> Exact GPS coordinates pinned on Katraj MapLibre map.
                  </div>
                </li>
                <li className="flex items-start gap-3">
                  <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0 mt-0.5" />
                  <div>
                    <strong className="text-navy">Dedicated Profile Page:</strong> Permanent SEO-indexed URL (`/business/your-name`).
                  </div>
                </li>
                <li className="flex items-start gap-3">
                  <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0 mt-0.5" />
                  <div>
                    <strong className="text-navy">1-Click WhatsApp Button:</strong> Direct customer enquiries straight to your WhatsApp.
                  </div>
                </li>
                <li className="flex items-start gap-3">
                  <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0 mt-0.5" />
                  <div>
                    <strong className="text-navy">Photos &amp; Ratings:</strong> Display your storefront photo, Google star rating &amp; reviews.
                  </div>
                </li>
                <li className="flex items-start gap-3">
                  <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0 mt-0.5" />
                  <div>
                    <strong className="text-navy">AI &amp; Google SEO Indexed:</strong> Included in Google Sitemap, ChatGPT &amp; Perplexity AI feeds.
                  </div>
                </li>
                <li className="flex items-start gap-3">
                  <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0 mt-0.5" />
                  <div>
                    <strong className="text-navy">Verified Merchant Badge:</strong> Green verification tick to build customer trust.
                  </div>
                </li>
              </ul>

              {/* Secure Payment Callout */}
              <div className="bg-blue-50 border border-blue-200 rounded-xl p-4 text-xs text-blue-900 space-y-1">
                <div className="font-bold flex items-center gap-1.5">
                  <ShieldCheck className="w-4 h-4 text-blue-600" />
                  Secure Instant Payment via Razorpay
                </div>
                <p className="text-blue-700">
                  Supports Google Pay, PhonePe, Paytm, UPI, Debit/Credit Cards &amp; Netbanking.
                </p>
              </div>

              {/* Direct Quick Pay Link */}
              <div className="pt-2">
                <a
                  href={RAZORPAY_PAYMENT_URL}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full bg-emerald-600 hover:bg-emerald-700 text-white font-extrabold text-sm py-3 px-4 rounded-xl flex items-center justify-center gap-2 shadow-md transition-all text-center"
                >
                  <span>Pay ₹350 Directly via Razorpay</span>
                  <ExternalLink className="w-4 h-4" />
                </a>
              </div>
            </div>

            {/* Sponsored Dhan Ad Card */}
            <DhanDematBanner variant="card" />
          </div>

          {/* Right: Business Details Form */}
          <div className="lg:col-span-7">
            <div className="bg-white rounded-2xl shadow-sm border border-navy/10 p-6 sm:p-8">
              <div className="border-b border-navy/10 pb-4 mb-6">
                <h2 className="text-xl font-bold text-navy">Enter Business Details</h2>
                <p className="text-xs text-gray-500 mt-1">
                  Fill in your information below, then proceed to the ₹350/- secure Razorpay checkout.
                </p>
              </div>

              {submitted && (
                <div className="mb-6 p-4 bg-emerald-50 border border-emerald-200 rounded-xl text-emerald-900 text-sm space-y-2">
                  <div className="font-bold flex items-center gap-2">
                    <CheckCircle2 className="w-5 h-5 text-emerald-600" />
                    Payment Gateway Opened!
                  </div>
                  <p>
                    Once payment of ₹350 is completed via Razorpay, our Katraj team will verify your listing within 2 hours and publish it live!
                  </p>
                  <a
                    href={RAZORPAY_PAYMENT_URL}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-block text-xs font-bold text-emerald-700 underline"
                  >
                    Click here if the Razorpay window did not open ↗
                  </a>
                </div>
              )}

              <form onSubmit={handleProceedToPayment} className="space-y-4">
                <div>
                  <label className="block text-xs font-bold text-navy uppercase tracking-wider mb-1.5">
                    Business Name *
                  </label>
                  <input
                    type="text"
                    required
                    name="businessName"
                    value={formData.businessName}
                    onChange={handleChange}
                    placeholder="e.g. Royal Caterers & Bakers"
                    className="w-full px-3.5 py-2.5 rounded-xl border border-navy/20 text-sm focus:outline-none focus:border-orange focus:ring-1 focus:ring-orange"
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold text-navy uppercase tracking-wider mb-1.5">
                      Category *
                    </label>
                    <select
                      name="category"
                      value={formData.category}
                      onChange={handleChange}
                      className="w-full px-3.5 py-2.5 rounded-xl border border-navy/20 text-sm focus:outline-none focus:border-orange focus:ring-1 focus:ring-orange bg-white"
                    >
                      <option value="restaurants">Restaurants &amp; Cafes</option>
                      <option value="shopping">Shopping &amp; Retail</option>
                      <option value="healthcare">Healthcare &amp; Doctors</option>
                      <option value="education">Education &amp; Coaching</option>
                      <option value="fitness">Fitness &amp; Gyms</option>
                      <option value="automotive">Automotive &amp; Garage</option>
                      <option value="home_services">Home Services</option>
                      <option value="professional_services">Professional Services</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-navy uppercase tracking-wider mb-1.5">
                      Locality in Katraj *
                    </label>
                    <select
                      name="locality"
                      value={formData.locality}
                      onChange={handleChange}
                      className="w-full px-3.5 py-2.5 rounded-xl border border-navy/20 text-sm focus:outline-none focus:border-orange focus:ring-1 focus:ring-orange bg-white"
                    >
                      <option value="Katraj Chowk">Katraj Chowk</option>
                      <option value="Bharati Vidyapeeth">Bharati Vidyapeeth</option>
                      <option value="Katraj-Kondhwa Road">Katraj-Kondhwa Road</option>
                      <option value="Ambegaon Budruk">Ambegaon Budruk</option>
                      <option value="Katraj Dairy">Katraj Dairy</option>
                      <option value="Sukhsagar Nagar">Sukhsagar Nagar</option>
                      <option value="Wonder City">Wonder City</option>
                      <option value="Rajas Society">Rajas Society</option>
                      <option value="Santosh Nagar">Santosh Nagar</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-navy uppercase tracking-wider mb-1.5">
                    Complete Address *
                  </label>
                  <input
                    type="text"
                    required
                    name="address"
                    value={formData.address}
                    onChange={handleChange}
                    placeholder="Shop No., Building, Landmark, Katraj, Pune 411046"
                    className="w-full px-3.5 py-2.5 rounded-xl border border-navy/20 text-sm focus:outline-none focus:border-orange focus:ring-1 focus:ring-orange"
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold text-navy uppercase tracking-wider mb-1.5">
                      WhatsApp Number (for leads) *
                    </label>
                    <input
                      type="tel"
                      required
                      name="whatsapp"
                      value={formData.whatsapp}
                      onChange={handleChange}
                      placeholder="+91 98765 43210"
                      className="w-full px-3.5 py-2.5 rounded-xl border border-navy/20 text-sm focus:outline-none focus:border-orange focus:ring-1 focus:ring-orange"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-navy uppercase tracking-wider mb-1.5">
                      Calling Phone Number
                    </label>
                    <input
                      type="tel"
                      name="phone"
                      value={formData.phone}
                      onChange={handleChange}
                      placeholder="+91 98765 43210"
                      className="w-full px-3.5 py-2.5 rounded-xl border border-navy/20 text-sm focus:outline-none focus:border-orange focus:ring-1 focus:ring-orange"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-navy uppercase tracking-wider mb-1.5">
                    Business Description
                  </label>
                  <textarea
                    rows={3}
                    name="description"
                    value={formData.description}
                    onChange={handleChange}
                    placeholder="Tell local customers about your products, services, and specialities..."
                    className="w-full px-3.5 py-2.5 rounded-xl border border-navy/20 text-sm focus:outline-none focus:border-orange focus:ring-1 focus:ring-orange"
                  />
                </div>

                {/* Pricing Summary Box */}
                <div className="p-4 rounded-xl bg-orange/5 border border-orange/20 space-y-2">
                  <div className="flex items-center justify-between text-sm">
                    <span className="font-semibold text-navy">Listing Fee (Lifetime)</span>
                    <span className="font-bold text-navy">₹350.00</span>
                  </div>
                  <div className="flex items-center justify-between text-xs text-gray-500">
                    <span>GST &amp; Taxes</span>
                    <span>Included</span>
                  </div>
                  <div className="border-t border-orange/10 pt-2 flex items-center justify-between">
                    <span className="font-bold text-navy text-base">Total Payable</span>
                    <span className="font-extrabold text-orange text-xl">₹350/-</span>
                  </div>
                </div>

                {/* Submit & Pay Button */}
                <button
                  type="submit"
                  className="w-full bg-gradient-to-r from-orange to-amber-500 hover:from-orange/90 hover:to-amber-500/90 text-white font-extrabold text-base py-3.5 px-6 rounded-xl shadow-lg transition-all transform hover:scale-[1.01] flex items-center justify-center gap-2"
                >
                  <span>Pay ₹350 &amp; Submit Listing via Razorpay</span>
                  <ArrowRight className="w-5 h-5" />
                </button>

                <p className="text-[11px] text-center text-gray-400">
                  🔒 Payments are processed securely via Razorpay. Fast approval within 2-4 hours.
                </p>
              </form>
            </div>
          </div>
        </div>

        {/* Bottom Banner */}
        <div className="mt-12">
          <DhanDematBanner variant="horizontal" />
        </div>
      </main>
    </div>
  )
}

