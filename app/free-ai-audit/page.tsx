"use client"

import { useState } from "react"
import Link from "next/link"
import {
  Sparkles,
  Search,
  CheckCircle2,
  ArrowRight,
  Bot,
  Globe,
  Share2,
  Clock,
  ExternalLink,
  MessageCircle,
} from "lucide-react"
import { SITE_CONFIG, getContextualWhatsAppUrl } from "@/lib/config"

export default function FreeAIAuditPage() {
  const [formData, setFormData] = useState({
    businessName: "",
    ownerName: "",
    phone: "",
    email: "",
    websiteUrl: "",
    category: "shopping",
  })
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [submitted, setSubmitted] = useState(false)
  const [errorMsg, setErrorMsg] = useState<string | null>(null)

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)
    setErrorMsg(null)

    try {
      const res = await fetch("/api/audit/submit", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      })
      const data = await res.json()

      if (!res.ok || !data.success) {
        throw new Error(data.error || "Submission failed")
      }

      setSubmitted(true)
    } catch (err: any) {
      console.error(err)
      setErrorMsg(err?.message || "Something went wrong. Please try again or message us on WhatsApp.")
    } finally {
      setIsSubmitting(false)
    }
  }

  const directWhatsAppUrl = getContextualWhatsAppUrl({
    action: "audit",
    businessName: formData.businessName || undefined,
  })

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
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
              className="text-xs font-bold px-3 py-1.5 rounded-lg bg-navy text-white hover:bg-blue transition-colors shadow-sm"
            >
              + List Business ({SITE_CONFIG.listing.feeDisplay})
            </Link>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="bg-gradient-to-br from-indigo-950 via-[#10243A] to-blue-900 text-white py-14 px-4 sm:px-6 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-96 h-96 bg-indigo-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="max-w-4xl mx-auto text-center space-y-4 relative z-10">
          <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-indigo-500/20 border border-indigo-400/40 text-indigo-200 text-xs font-bold uppercase tracking-wider">
            <Sparkles className="w-3.5 h-3.5 text-amber-300" />
            <span>AI Visibility Benchmark</span>
          </div>

          <h1 className="text-3xl sm:text-5xl font-black tracking-tight leading-tight">
            {SITE_CONFIG.zotozAudit.headline}
          </h1>

          <p className="text-base sm:text-lg text-indigo-100/90 max-w-2xl mx-auto leading-relaxed">
            {SITE_CONFIG.zotozAudit.subheadline}
          </p>

          <div className="pt-2 flex flex-wrap items-center justify-center gap-4 text-xs font-medium text-indigo-200">
            <span className="flex items-center gap-1.5">
              <CheckCircle2 className="w-4 h-4 text-emerald-400" /> 100% Free Audit Report
            </span>
            <span>•</span>
            <span className="flex items-center gap-1.5">
              <CheckCircle2 className="w-4 h-4 text-emerald-400" /> WhatsApp Delivery
            </span>
            <span>•</span>
            <span className="flex items-center gap-1.5">
              <CheckCircle2 className="w-4 h-4 text-emerald-400" /> No Obligation
            </span>
          </div>
        </div>
      </section>

      {/* Main Content */}
      <main className="max-w-6xl mx-auto px-4 sm:px-6 py-12">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-start">
          {/* Left: What the Audit Analyzes */}
          <div className="lg:col-span-6 space-y-6">
            {/* Lead AI Audit Specialist Box */}
            <div className="bg-gradient-to-br from-indigo-950 via-[#10243A] to-blue-900 text-white rounded-2xl p-5 shadow-sm border border-indigo-700/40 flex items-center gap-4">
              <img
                src="/images/corporate-advisor-female.jpg"
                alt="Katraj AI Visibility Specialist"
                className="w-16 h-16 rounded-xl object-cover shadow-md border border-white/20 shrink-0"
              />
              <div className="space-y-0.5">
                <span className="text-[10px] font-bold uppercase tracking-wider text-amber-300">
                  AI Visibility Specialist
                </span>
                <h3 className="text-sm font-bold text-white">
                  Conducted by Local Search Experts
                </h3>
                <p className="text-[11px] text-indigo-100/80">
                  We test your Katraj business against real queries on ChatGPT, Perplexity, and Google Gemini.
                </p>
              </div>
            </div>

            <div className="space-y-2">
              <span className="text-xs font-bold uppercase tracking-wider text-orange">Why AI Search Matters</span>
              <h2 className="text-2xl font-black text-navy">
                Customers are asking AI instead of just Googling.
              </h2>
              <p className="text-sm text-gray-600 leading-relaxed">
                When a student or resident asks ChatGPT or Perplexity <em>"Which are the top vegetarian restaurants near Bharati Vidyapeeth?"</em> or <em>"Find best water purifier service in Dhankawadi"</em>, does your business get recommended?
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
              <div className="bg-white rounded-2xl p-5 border border-navy/10 shadow-sm space-y-2">
                <div className="w-10 h-10 rounded-xl bg-indigo-50 text-indigo-600 flex items-center justify-center">
                  <Bot className="w-5 h-5" />
                </div>
                <h3 className="font-bold text-navy text-sm">ChatGPT &amp; Perplexity</h3>
                <p className="text-xs text-gray-500 leading-relaxed">
                  We test your business name and category against real AI prompts to check citation rates.
                </p>
              </div>

              <div className="bg-white rounded-2xl p-5 border border-navy/10 shadow-sm space-y-2">
                <div className="w-10 h-10 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center">
                  <Globe className="w-5 h-5" />
                </div>
                <h3 className="font-bold text-navy text-sm">Google AI Overviews</h3>
                <p className="text-xs text-gray-500 leading-relaxed">
                  Audits your presence in Google Gemini summaries for local Katraj queries.
                </p>
              </div>

              <div className="bg-white rounded-2xl p-5 border border-navy/10 shadow-sm space-y-2">
                <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center">
                  <Share2 className="w-5 h-5" />
                </div>
                <h3 className="font-bold text-navy text-sm">Schema &amp; AEO Data</h3>
                <p className="text-xs text-gray-500 leading-relaxed">
                  Verifies if your business has machine-readable JSON-LD and <code className="text-[11px] bg-gray-100 px-1 py-0.5 rounded">llms.txt</code> indexing.
                </p>
              </div>

              <div className="bg-white rounded-2xl p-5 border border-navy/10 shadow-sm space-y-2">
                <div className="w-10 h-10 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center">
                  <Clock className="w-5 h-5" />
                </div>
                <h3 className="font-bold text-navy text-sm">Actionable Action Plan</h3>
                <p className="text-xs text-gray-500 leading-relaxed">
                  Receive 3 concrete steps to boost your business visibility on generative search engines.
                </p>
              </div>
            </div>

            {/* Direct WhatsApp Quick Enquiry Box */}
            <div className="bg-emerald-50/70 border border-emerald-200 rounded-2xl p-5 flex flex-col sm:flex-row items-center justify-between gap-4">
              <div>
                <p className="text-sm font-bold text-emerald-950">Prefer a quick chat on WhatsApp?</p>
                <p className="text-xs text-emerald-800">Send your business name to our audit specialist directly.</p>
              </div>
              <a
                href={directWhatsAppUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1.5 bg-[#25D366] hover:bg-[#20bd5a] text-white font-bold text-xs px-4 py-2.5 rounded-xl shadow-sm transition-colors shrink-0"
              >
                <MessageCircle className="w-4 h-4" />
                <span>Message on WhatsApp</span>
              </a>
            </div>
          </div>

          {/* Right: Free Audit Enquiry Form */}
          <div className="lg:col-span-6">
            <div className="bg-white rounded-3xl shadow-sm border border-navy/10 p-6 sm:p-8 space-y-6">
              <div>
                <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-emerald-50 text-emerald-700 text-xs font-bold mb-2">
                  <span>✨ 100% Free Offer</span>
                </div>
                <h2 className="text-2xl font-black text-navy">Request Your Free Audit</h2>
                <p className="text-xs text-gray-500 mt-1">
                  Fill in your store details below. We'll analyze your search visibility and deliver your audit report within 48 hours.
                </p>
              </div>

              {submitted ? (
                <div className="p-6 bg-emerald-50 border border-emerald-200 rounded-2xl text-center space-y-3">
                  <div className="w-12 h-12 rounded-full bg-emerald-100 text-emerald-700 flex items-center justify-center mx-auto">
                    <CheckCircle2 className="w-6 h-6" />
                  </div>
                  <h3 className="text-lg font-bold text-emerald-950">Audit Request Received!</h3>
                  <p className="text-xs text-emerald-800 max-w-sm mx-auto leading-relaxed">
                    Our team is now benchmarking <strong>{formData.businessName}</strong> across AI platforms. You will receive your free report on WhatsApp within 48 hours.
                  </p>
                  <div className="pt-2">
                    <a
                      href={directWhatsAppUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1.5 text-xs font-bold text-emerald-800 underline"
                    >
                      Connect on WhatsApp now ↗
                    </a>
                  </div>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-4">
                  {errorMsg && (
                    <div className="p-3.5 bg-red-50 border border-red-200 rounded-xl text-red-900 text-xs font-medium">
                      {errorMsg}
                    </div>
                  )}

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
                      placeholder="e.g. Shreeji Pure Veg / Maza Ghar Day Care"
                      className="w-full px-3.5 py-2.5 rounded-xl border border-navy/20 text-sm focus:outline-none focus:border-orange focus:ring-1 focus:ring-orange"
                    />
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-bold text-navy uppercase tracking-wider mb-1.5">
                        Your Name (Owner / Manager) *
                      </label>
                      <input
                        type="text"
                        required
                        name="ownerName"
                        value={formData.ownerName}
                        onChange={handleChange}
                        placeholder="e.g. Amit Patil"
                        className="w-full px-3.5 py-2.5 rounded-xl border border-navy/20 text-sm focus:outline-none focus:border-orange focus:ring-1 focus:ring-orange"
                      />
                    </div>

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
                        <option value="healthcare">Healthcare &amp; Clinic</option>
                        <option value="education">Education &amp; Day Care</option>
                        <option value="home_services">Home Services</option>
                        <option value="automotive">Automotive</option>
                        <option value="fitness">Fitness &amp; Gym</option>
                        <option value="professional_services">Professional Services</option>
                      </select>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-bold text-navy uppercase tracking-wider mb-1.5">
                        WhatsApp / Phone Number *
                      </label>
                      <input
                        type="tel"
                        required
                        name="phone"
                        value={formData.phone}
                        onChange={handleChange}
                        placeholder="+91 98765 43210"
                        className="w-full px-3.5 py-2.5 rounded-xl border border-navy/20 text-sm focus:outline-none focus:border-orange focus:ring-1 focus:ring-orange"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-navy uppercase tracking-wider mb-1.5">
                        Email Address (Optional)
                      </label>
                      <input
                        type="email"
                        name="email"
                        value={formData.email}
                        onChange={handleChange}
                        placeholder="owner@business.com"
                        className="w-full px-3.5 py-2.5 rounded-xl border border-navy/20 text-sm focus:outline-none focus:border-orange focus:ring-1 focus:ring-orange"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-navy uppercase tracking-wider mb-1.5">
                      Website URL (Optional)
                    </label>
                    <input
                      type="url"
                      name="websiteUrl"
                      value={formData.websiteUrl}
                      onChange={handleChange}
                      placeholder="https://yourbusiness.com"
                      className="w-full px-3.5 py-2.5 rounded-xl border border-navy/20 text-sm focus:outline-none focus:border-orange focus:ring-1 focus:ring-orange"
                    />
                  </div>

                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="w-full bg-indigo-600 hover:bg-indigo-700 disabled:opacity-50 text-white font-extrabold text-sm py-3.5 px-6 rounded-xl shadow-lg transition-all flex items-center justify-center gap-2 transform hover:scale-[1.01]"
                  >
                    {isSubmitting ? (
                      <span>Submitting Enquiry...</span>
                    ) : (
                      <>
                        <Sparkles className="w-4 h-4 text-amber-300" />
                        <span>{SITE_CONFIG.zotozAudit.ctaText}</span>
                        <ArrowRight className="w-4 h-4" />
                      </>
                    )}
                  </button>

                  <p className="text-[11px] text-center text-gray-400">
                    🔒 No spam. We only use your contact details to deliver your free AI search audit report within 48 hours.
                  </p>
                </form>
              )}
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}
