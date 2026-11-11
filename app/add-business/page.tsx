"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import {
  CheckCircle2,
  ShieldCheck,
  Zap,
  ArrowRight,
  MessageCircle,
  MapPin,
  Star,
  Building2,
  ExternalLink,
  Clock,
  Sparkles,
} from "lucide-react"
import DhanDematBanner from "@/components/ads/DhanDematBanner"
import { SITE_CONFIG, getContextualWhatsAppUrl } from "@/lib/config"

export default function AddBusinessListingPage() {
  const router = useRouter()
  const [formData, setFormData] = useState({
    businessName: "",
    category: "shopping",
    locality: "Katraj Chowk",
    address: "",
    phone: "",
    whatsapp: "",
    email: "",
    website: "",
    description: "",
  })
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [errorMsg, setErrorMsg] = useState<string | null>(null)

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>
  ) => {
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }))
  }

  const handleProceedToPayment = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)
    setErrorMsg(null)

    try {
      // 1. Persist submission to server before redirecting to payment
      const res = await fetch("/api/payment/create", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          businessName: formData.businessName,
          category: formData.category,
          locality: formData.locality,
          address: formData.address,
          phone: formData.phone || formData.whatsapp,
          whatsapp: formData.whatsapp,
          email: formData.email || null,
          website: formData.website || null,
          description: formData.description || null,
          amount: SITE_CONFIG.listing.feeINR,
        }),
      })

      const data = await res.json()

      if (!res.ok || !data.success) {
        throw new Error(data.error || "Failed to initiate submission")
      }

      const { transactionRef, paymentUrl } = data

      // 2. Open Razorpay in a new tab
      if (typeof window !== "undefined") {
        window.open(paymentUrl, "_blank", "noopener,noreferrer")
      }

      // 3. Navigate current window to the honest pending confirmation experience
      router.push(
        `/payment/pending?ref=${encodeURIComponent(transactionRef)}&name=${encodeURIComponent(
          formData.businessName
        )}&amount=${encodeURIComponent(SITE_CONFIG.listing.feeDisplay)}`
      )
    } catch (err: any) {
      console.error("Submission failed:", err)
      setErrorMsg(err?.message || "Something went wrong. Please try again.")
      setIsSubmitting(false)
    }
  }

  const supportWhatsAppUrl = getContextualWhatsAppUrl({
    action: "add_business",
    businessName: formData.businessName || undefined,
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
            <div className="bg-white/10 backdrop-blur-md border border-amber-400/40 rounded-2xl p-4 px-6 text-center relative overflow-hidden">
              <div className="inline-block bg-gradient-to-r from-amber-400 to-orange text-navy text-[10px] font-black uppercase px-2.5 py-0.5 rounded-full mb-1">
                🪔 Diwali Offer • First 100 Businesses Only
              </div>
              <span className="text-xs font-semibold text-gray-300 uppercase tracking-widest block">
                Annual Listing Fee
              </span>
              <div className="flex items-baseline justify-center gap-2 mt-1">
                <span className="text-base text-gray-400 line-through">{SITE_CONFIG.listing.regularFeeDisplay}</span>
                <span className="text-4xl font-extrabold text-white">{SITE_CONFIG.listing.feeDisplay}</span>
                <span className="text-xs text-emerald-400 font-bold uppercase">/ 1 Full Year</span>
              </div>
              <span className="text-[11px] text-emerald-300 font-medium block mt-1">
                ✓ Less than ₹1 per day (₹0.95/day) • Interactive Map Pin • Direct WhatsApp Leads
              </span>
            </div>
          </div>
        </div>
      </section>

      {/* Main Content: Form + What's Included */}
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

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Left: What You Get for ₹350 */}
          <div className="lg:col-span-5 space-y-6">
            {/* Official Accreditation Seal Box */}
            <div className="bg-gradient-to-br from-navy via-[#162D4A] to-navy text-white rounded-2xl p-5 shadow-sm border border-amber-400/30 flex items-center gap-4">
              <img
                src="/images/katraj-verified-seal.jpg"
                alt="Official KatrajPune Verified Seal"
                className="w-16 h-16 rounded-full shadow-lg border-2 border-amber-400/60 object-cover shrink-0"
              />
              <div className="space-y-0.5">
                <span className="text-[10px] font-bold uppercase tracking-wider text-amber-300">
                  Official Merchant Accreditation
                </span>
                <h3 className="text-sm font-bold text-white">
                  Gold Verification Seal Included
                </h3>
                <p className="text-[11px] text-gray-300">
                  Earn the official digital trust mark for your business storefront and map profile.
                </p>
              </div>
            </div>

            <div className="bg-white rounded-2xl shadow-sm border border-navy/10 p-6 space-y-5">
              <h2 className="text-lg font-bold text-navy flex items-center gap-2">
                <ShieldCheck className="w-5 h-5 text-emerald-600" />
                What's Included in {SITE_CONFIG.listing.feeDisplay} Listing
              </h2>

              <ul className="space-y-3.5 text-sm text-gray-600">
                <li className="flex items-start gap-3">
                  <CheckCircle2 className="w-5 h-5 text-emerald-500 shrink-0 mt-0.5" />
                  <span>
                    <strong className="text-navy">Interactive Map Pin:</strong> Placed accurately on the Katraj vector map with category icon.
                  </span>
                </li>
                <li className="flex items-start gap-3">
                  <CheckCircle2 className="w-5 h-5 text-emerald-500 shrink-0 mt-0.5" />
                  <span>
                    <strong className="text-navy">Dedicated SEO Webpage:</strong> Indexed on Google with full schema markup (e.g. <code className="text-xs bg-gray-100 px-1 py-0.5 rounded">/business/your-name</code>).
                  </span>
                </li>
                <li className="flex items-start gap-3">
                  <CheckCircle2 className="w-5 h-5 text-emerald-500 shrink-0 mt-0.5" />
                  <span>
                    <strong className="text-navy">1-Tap WhatsApp Button:</strong> Direct customer enquiries sent straight to your WhatsApp.
                  </span>
                </li>
                <li className="flex items-start gap-3">
                  <CheckCircle2 className="w-5 h-5 text-emerald-500 shrink-0 mt-0.5" />
                  <span>
                    <strong className="text-navy">Verified Green Badge:</strong> Builds immediate trust with students &amp; families.
                  </span>
                </li>
                <li className="flex items-start gap-3">
                  <CheckCircle2 className="w-5 h-5 text-emerald-500 shrink-0 mt-0.5" />
                  <span>
                    <strong className="text-navy">AI Search Visibility:</strong> Indexed into <code className="text-xs bg-gray-100 px-1 py-0.5 rounded">llms.txt</code> for discovery by ChatGPT, Claude &amp; Perplexity.
                  </span>
                </li>
              </ul>

              {/* Direct Support WhatsApp Box */}
              <div className="pt-2 border-t border-navy/10">
                <p className="text-xs text-gray-500 mb-2">Need help with your business listing?</p>
                <a
                  href={supportWhatsAppUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 text-xs font-bold text-emerald-700 bg-emerald-50 hover:bg-emerald-100 px-3.5 py-2 rounded-xl border border-emerald-200 transition-colors w-full justify-center"
                >
                  <MessageCircle className="w-4 h-4 text-emerald-600" />
                  <span>Chat with Katraj Support on WhatsApp</span>
                </a>
              </div>
            </div>

            {/* Zotoz AI Visibility Audit Promo Card */}
            <div className="bg-gradient-to-br from-indigo-900 via-navy to-blue-900 text-white rounded-2xl p-6 shadow-sm border border-indigo-700/50 space-y-4">
              <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-indigo-500/30 text-indigo-200 text-[11px] font-bold uppercase tracking-wider">
                <Sparkles className="w-3.5 h-3.5 text-amber-300" />
                <span>Free Growth Offer</span>
              </div>
              <h3 className="text-lg font-black leading-snug">
                {SITE_CONFIG.zotozAudit.headline}
              </h3>
              <p className="text-xs text-indigo-100/90 leading-relaxed">
                {SITE_CONFIG.zotozAudit.subheadline}
              </p>
              <Link
                href="/free-ai-audit"
                className="inline-flex items-center gap-2 bg-white hover:bg-amber-300 text-navy font-bold text-xs px-4 py-2.5 rounded-xl shadow transition-all transform hover:scale-105"
              >
                <span>Claim Free Zotoz AI Audit</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </Link>
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
                  Fill in your information below, then proceed to the {SITE_CONFIG.listing.feeDisplay} secure Razorpay checkout.
                </p>
              </div>

              {errorMsg && (
                <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-xl text-red-900 text-sm">
                  {errorMsg}
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
                    placeholder="e.g. Royal Caterers &amp; Bakers"
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
                      <option value="Dhankawadi">Dhankawadi</option>
                      <option value="Bibvewadi">Bibvewadi</option>
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

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold text-navy uppercase tracking-wider mb-1.5">
                      Email Address (Optional)
                    </label>
                    <input
                      type="email"
                      name="email"
                      value={formData.email}
                      onChange={handleChange}
                      placeholder="business@gmail.com"
                      className="w-full px-3.5 py-2.5 rounded-xl border border-navy/20 text-sm focus:outline-none focus:border-orange focus:ring-1 focus:ring-orange"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-navy uppercase tracking-wider mb-1.5">
                      Website URL (Optional)
                    </label>
                    <input
                      type="url"
                      name="website"
                      value={formData.website}
                      onChange={handleChange}
                      placeholder="https://yourwebsite.com"
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
                  disabled={isSubmitting}
                  className="w-full bg-gradient-to-r from-orange to-amber-500 hover:from-orange/90 hover:to-amber-500/90 disabled:opacity-50 text-white font-extrabold text-base py-3.5 px-6 rounded-xl shadow-lg transition-all transform hover:scale-[1.01] flex items-center justify-center gap-2"
                >
                  {isSubmitting ? (
                    <span>Persisting Details &amp; Opening Razorpay...</span>
                  ) : (
                    <>
                      <span>Pay ₹350 &amp; Submit Listing via Razorpay</span>
                      <ArrowRight className="w-5 h-5" />
                    </>
                  )}
                </button>

                <p className="text-[11px] text-center text-gray-500 leading-relaxed">
                  🔒 Payments are secured via Razorpay. Your submission is saved immediately, and updates undergo review within 48 hours.
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
