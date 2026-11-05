"use client"

import { useState, useEffect } from "react"
import { Settings, Save, CheckCircle2, MessageCircle, CreditCard, Sparkles, Clock, ShieldCheck, Globe, RefreshCw } from "lucide-react"
import { SITE_CONFIG } from "@/lib/config"

interface SettingsFormData {
  supportPhone: string
  slaHours: number
  listingFee: number
  razorpayUrl: string
  zotozHeadline: string
  zotozSubheadline: string
  zotozEnabled: boolean
}

export default function AdminSettingsPage() {
  const [formData, setFormData] = useState<SettingsFormData>({
    supportPhone: SITE_CONFIG.support.displayPhone,
    slaHours: 48,
    listingFee: 350,
    razorpayUrl: SITE_CONFIG.listing.paymentUrl,
    zotozHeadline: SITE_CONFIG.zotozAudit.headline,
    zotozSubheadline: SITE_CONFIG.zotozAudit.subheadline,
    zotozEnabled: true,
  })
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [savedSuccess, setSavedSuccess] = useState(false)
  const [indexNowPushing, setIndexNowPushing] = useState(false)
  const [indexNowResult, setIndexNowResult] = useState<string | null>(null)

  const handlePushIndexNow = async () => {
    setIndexNowPushing(true)
    setIndexNowResult(null)
    try {
      const res = await fetch("/api/admin/indexnow", { method: "POST" })
      const data = await res.json()
      if (res.ok && data.success) {
        setIndexNowResult(`✅ Successfully submitted ${data.totalUrls} URLs to IndexNow (Bing & ChatGPT)!`)
      } else {
        setIndexNowResult(`⚠️ ${data.error || "Failed to submit to IndexNow"}`)
      }
    } catch (err: any) {
      setIndexNowResult(`❌ ${err.message || "Network error"}`)
    } finally {
      setIndexNowPushing(false)
    }
  }

  useEffect(() => {
    fetch("/api/admin/settings")
      .then((res) => res.json())
      .then((data) => {
        if (data) {
          setFormData({
            supportPhone: data.support_whatsapp?.phone || SITE_CONFIG.support.displayPhone,
            slaHours: data.listing_pricing?.slaHours || 48,
            listingFee: data.listing_pricing?.feeINR || 350,
            razorpayUrl: data.listing_pricing?.paymentUrl || SITE_CONFIG.listing.paymentUrl,
            zotozHeadline: data.zotoz_audit_promo?.headline || SITE_CONFIG.zotozAudit.headline,
            zotozSubheadline: data.zotoz_audit_promo?.subheadline || SITE_CONFIG.zotozAudit.subheadline,
            zotozEnabled: data.zotoz_audit_promo?.enabled ?? true,
          })
        }
      })
      .catch(() => {})
      .finally(() => setLoading(false))
  }, [])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setSaving(true)
    setSavedSuccess(false)

    try {
      const payload = {
        support_whatsapp: {
          phone: formData.supportPhone,
          cleanNumber: formData.supportPhone.replace(/[^0-9]/g, ""),
        },
        listing_pricing: {
          feeINR: formData.listingFee,
          slaHours: formData.slaHours,
          paymentUrl: formData.razorpayUrl,
        },
        zotoz_audit_promo: {
          headline: formData.zotozHeadline,
          subheadline: formData.zotozSubheadline,
          enabled: formData.zotozEnabled,
          destinationUrl: "/free-ai-audit",
        },
      }

      const res = await fetch("/api/admin/settings", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      })

      if (res.ok) {
        setSavedSuccess(true)
        setTimeout(() => setSavedSuccess(false), 3000)
      }
    } catch (err) {
      console.error(err)
    } finally {
      setSaving(false)
    }
  }

  return (
    <div className="space-y-6 max-w-4xl">
      <div>
        <h1 className="text-2xl font-black text-navy">Platform Settings</h1>
        <p className="text-xs text-gray-500">
          Configure global support contacts, SLA publishing timelines, pricing standards, and promotional campaigns.
        </p>
      </div>

      {savedSuccess && (
        <div className="p-3.5 bg-emerald-50 border border-emerald-200 text-emerald-800 rounded-xl text-xs font-bold flex items-center gap-2">
          <CheckCircle2 className="w-4 h-4 text-emerald-600" />
          <span>Settings successfully updated in site database.</span>
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Support Settings Card */}
        <div className="bg-white rounded-2xl border border-navy/10 p-6 shadow-sm space-y-4">
          <div className="flex items-center gap-2 pb-3 border-b border-navy/10">
            <MessageCircle className="w-5 h-5 text-emerald-600" />
            <h2 className="text-sm font-bold text-navy uppercase tracking-wider">
              Global WhatsApp Support Contact
            </h2>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
            <div>
              <label className="block font-bold text-navy uppercase tracking-wider mb-1">
                Support Display Phone *
              </label>
              <input
                type="text"
                required
                value={formData.supportPhone}
                onChange={(e) => setFormData({ ...formData, supportPhone: e.target.value })}
                className="w-full px-3 py-2 rounded-xl border border-navy/20 focus:outline-none focus:border-orange font-mono"
              />
              <p className="text-[11px] text-gray-400 mt-1">
                Default: +91 70208 88195 (floating button &amp; contextual links).
              </p>
            </div>
          </div>
        </div>

        {/* Pricing & SLA Card */}
        <div className="bg-white rounded-2xl border border-navy/10 p-6 shadow-sm space-y-4">
          <div className="flex items-center gap-2 pb-3 border-b border-navy/10">
            <Clock className="w-5 h-5 text-amber-600" />
            <h2 className="text-sm font-bold text-navy uppercase tracking-wider">
              Listing Standards &amp; SLA
            </h2>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs">
            <div>
              <label className="block font-bold text-navy uppercase tracking-wider mb-1">
                Listing Fee (INR)
              </label>
              <input
                type="number"
                required
                value={formData.listingFee}
                onChange={(e) => setFormData({ ...formData, listingFee: parseInt(e.target.value) || 350 })}
                className="w-full px-3 py-2 rounded-xl border border-navy/20 focus:outline-none focus:border-orange font-mono"
              />
            </div>

            <div>
              <label className="block font-bold text-navy uppercase tracking-wider mb-1">
                Review SLA (Hours)
              </label>
              <input
                type="number"
                required
                value={formData.slaHours}
                onChange={(e) => setFormData({ ...formData, slaHours: parseInt(e.target.value) || 48 })}
                className="w-full px-3 py-2 rounded-xl border border-navy/20 focus:outline-none focus:border-orange font-mono"
              />
            </div>

            <div>
              <label className="block font-bold text-navy uppercase tracking-wider mb-1">
                Razorpay Checkout URL
              </label>
              <input
                type="url"
                required
                value={formData.razorpayUrl}
                onChange={(e) => setFormData({ ...formData, razorpayUrl: e.target.value })}
                className="w-full px-3 py-2 rounded-xl border border-navy/20 focus:outline-none focus:border-orange font-mono"
              />
            </div>
          </div>
        </div>

        {/* Zotoz AI Audit Promotion */}
        <div className="bg-white rounded-2xl border border-navy/10 p-6 shadow-sm space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-navy/10">
            <div className="flex items-center gap-2">
              <Sparkles className="w-5 h-5 text-indigo-600" />
              <h2 className="text-sm font-bold text-navy uppercase tracking-wider">
                Free Zotoz AI Visibility Audit Campaign
              </h2>
            </div>
            <label className="flex items-center gap-2 cursor-pointer text-xs">
              <input
                type="checkbox"
                checked={formData.zotozEnabled}
                onChange={(e) => setFormData({ ...formData, zotozEnabled: e.target.checked })}
                className="rounded text-indigo-600 focus:ring-indigo-500"
              />
              <span className="font-bold text-navy">Campaign Active</span>
            </label>
          </div>

          <div className="space-y-3 text-xs">
            <div>
              <label className="block font-bold text-navy uppercase tracking-wider mb-1">
                Campaign Headline
              </label>
              <input
                type="text"
                required
                value={formData.zotozHeadline}
                onChange={(e) => setFormData({ ...formData, zotozHeadline: e.target.value })}
                className="w-full px-3 py-2 rounded-xl border border-navy/20 focus:outline-none focus:border-orange"
              />
            </div>

            <div>
              <label className="block font-bold text-navy uppercase tracking-wider mb-1">
                Supporting Copy
              </label>
              <textarea
                rows={2}
                required
                value={formData.zotozSubheadline}
                onChange={(e) => setFormData({ ...formData, zotozSubheadline: e.target.value })}
                className="w-full px-3 py-2 rounded-xl border border-navy/20 focus:outline-none focus:border-orange"
              />
            </div>
          </div>
        </div>

        {/* IndexNow Protocol (Bing, ChatGPT & Yahoo Instant Indexing) */}
        <div className="bg-white rounded-2xl border border-emerald-500/20 p-6 shadow-sm space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-emerald-500/10">
            <div className="flex items-center gap-2">
              <Globe className="w-5 h-5 text-emerald-600" />
              <h2 className="text-sm font-bold text-navy uppercase tracking-wider">
                IndexNow Protocol (Bing & ChatGPT Search)
              </h2>
            </div>
            <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200">
              Active Key Loaded
            </span>
          </div>

          <p className="text-xs text-gray-600 leading-relaxed">
            IndexNow instantly notifies search engines (Bing, Microsoft Copilot, ChatGPT Search, Yahoo, Yandex, Naver) whenever URLs are added or updated, bypassing slow web crawlers.
          </p>

          <div className="p-3 bg-gray-50 rounded-xl border border-navy/10 space-y-1 font-mono text-[11px] text-gray-700">
            <div><span className="text-navy font-bold">API Key:</span> {SITE_CONFIG.indexNow.key}</div>
            <div><span className="text-navy font-bold">Key Location:</span> <a href={SITE_CONFIG.indexNow.keyLocation} target="_blank" rel="noreferrer" className="text-blue underline">{SITE_CONFIG.indexNow.keyLocation}</a></div>
          </div>

          {indexNowResult && (
            <div className="p-3 rounded-xl bg-navy/5 text-xs font-semibold text-navy border border-navy/10">
              {indexNowResult}
            </div>
          )}

          <div className="pt-2">
            <button
              type="button"
              onClick={handlePushIndexNow}
              disabled={indexNowPushing}
              className="inline-flex items-center gap-2 bg-emerald-600 hover:bg-emerald-700 text-white font-extrabold text-xs px-5 py-2.5 rounded-xl shadow-md transition-all disabled:opacity-50"
            >
              <RefreshCw className={`w-3.5 h-3.5 ${indexNowPushing ? "animate-spin" : ""}`} />
              <span>{indexNowPushing ? "Submitting All URLs..." : "Submit All 1,470 URLs to IndexNow Now"}</span>
            </button>
          </div>
        </div>

        <div className="flex items-center justify-end">
          <button
            type="submit"
            disabled={saving}
            className="inline-flex items-center gap-2 bg-navy hover:bg-blue text-white font-extrabold text-xs px-6 py-3 rounded-xl shadow-md transition-all disabled:opacity-50"
          >
            <Save className="w-4 h-4" />
            <span>{saving ? "Saving Changes..." : "Save Platform Settings"}</span>
          </button>
        </div>
      </form>
    </div>
  )
}
