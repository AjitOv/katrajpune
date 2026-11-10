"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import {
  Share2,
  Sparkles,
  Facebook,
  Instagram,
  Linkedin,
  Send,
  RefreshCw,
  ExternalLink,
  CheckCircle2,
  AlertCircle,
  HelpCircle,
  Dice5,
  Copy,
  Building2,
  Flame,
} from "lucide-react"
import { generateSpotlightPost, generateDiwaliPromoPost } from "@/lib/social/generator"
import { SocialPublishResult } from "@/lib/social/types"

interface Business {
  id: string
  slug: string
  name: string
  category: string
  locality: string | null
  address: string | null
  rating: number | null
  reviews_count: number
  phone: string | null
  whatsapp: string | null
  photos: string[]
  logo_url: string | null
}

export default function AdminSocialPage() {
  const [businesses, setBusinesses] = useState<Business[]>([])
  const [selectedBusiness, setSelectedBusiness] = useState<Business | null>(null)
  const [postType, setPostType] = useState<"spotlight" | "diwali" | "custom">("spotlight")
  const [caption, setCaption] = useState("")
  const [imageUrl, setImageUrl] = useState("https://katrajpune.com/og-image.png")
  const [linkUrl, setLinkUrl] = useState("https://katrajpune.com")
  const [platforms, setPlatforms] = useState<("facebook" | "instagram" | "linkedin")[]>([
    "facebook",
    "instagram",
    "linkedin",
  ])
  const [status, setStatus] = useState<any>({
    facebook: { connected: false },
    instagram: { connected: false },
    linkedin: { connected: false },
  })
  const [publishing, setPublishing] = useState(false)
  const [results, setResults] = useState<SocialPublishResult[]>([])
  const [showGuide, setShowGuide] = useState(false)
  const [previewTab, setPreviewTab] = useState<"facebook" | "instagram" | "linkedin">("instagram")

  // 1. Fetch businesses and platform status
  useEffect(() => {
    Promise.all([
      fetch("/api/businesses/all").then((r) => r.json()),
      fetch("/api/admin/social/status").then((r) => r.json()),
    ])
      .then(([bizData, statusData]) => {
        if (Array.isArray(bizData) && bizData.length > 0) {
          setBusinesses(bizData)
          // Default to first high-rated business
          const topRated = bizData.find((b: any) => (b.rating || 0) >= 4.5) || bizData[0]
          setSelectedBusiness(topRated)
          const generated = generateSpotlightPost(topRated)
          setCaption(generated.text)
          setImageUrl(generated.imageUrl)
          setLinkUrl(generated.linkUrl)
        }
        if (statusData) {
          setStatus(statusData)
        }
      })
      .catch((err) => console.error(err))
  }, [])

  // 2. Switch Post Types
  const handleSelectPostType = (type: "spotlight" | "diwali" | "custom") => {
    setPostType(type)
    setResults([])

    if (type === "spotlight") {
      if (selectedBusiness) {
        const gen = generateSpotlightPost(selectedBusiness)
        setCaption(gen.text)
        setImageUrl(gen.imageUrl)
        setLinkUrl(gen.linkUrl)
      }
    } else if (type === "diwali") {
      const gen = generateDiwaliPromoPost()
      setCaption(gen.text)
      setImageUrl(gen.imageUrl)
      setLinkUrl(gen.linkUrl)
    } else {
      setCaption("📢 Announcement from KatrajPune.com...\n\n#Katraj #Pune")
      setImageUrl("https://katrajpune.com/og-image.png")
      setLinkUrl("https://katrajpune.com")
    }
  }

  // 3. Pick random business
  const handlePickRandom = () => {
    if (businesses.length === 0) return
    const random = businesses[Math.floor(Math.random() * businesses.length)]
    setSelectedBusiness(random)
    const gen = generateSpotlightPost(random)
    setCaption(gen.text)
    setImageUrl(gen.imageUrl)
    setLinkUrl(gen.linkUrl)
    setResults([])
  }

  // 4. Select specific business
  const handleSelectBusiness = (slug: string) => {
    const found = businesses.find((b) => b.slug === slug)
    if (found) {
      setSelectedBusiness(found)
      const gen = generateSpotlightPost(found)
      setCaption(gen.text)
      setImageUrl(gen.imageUrl)
      setLinkUrl(gen.linkUrl)
      setResults([])
    }
  }

  // 5. Toggle platform checkbox
  const togglePlatform = (p: "facebook" | "instagram" | "linkedin") => {
    setPlatforms((prev) =>
      prev.includes(p) ? prev.filter((item) => item !== p) : [...prev, p]
    )
  }

  // 6. Submit Post
  const handlePublish = async () => {
    if (platforms.length === 0) {
      alert("Please select at least one platform (Facebook, Instagram, or LinkedIn).")
      return
    }

    setPublishing(true)
    setResults([])

    try {
      const res = await fetch("/api/admin/social/post", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          platforms,
          message: caption,
          imageUrl,
          linkUrl,
          title: selectedBusiness ? `Katraj Spotlight: ${selectedBusiness.name}` : undefined,
        }),
      })

      const data = await res.json()
      if (data.results) {
        setResults(data.results)
      } else if (data.error) {
        setResults([
          {
            platform: platforms[0],
            success: false,
            error: data.error,
          },
        ])
      }
    } catch (err: any) {
      alert("Publishing error: " + err.message)
    } finally {
      setPublishing(false)
    }
  }

  return (
    <div className="space-y-6 max-w-7xl mx-auto pb-16">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-blue/10 text-blue text-xs font-bold uppercase tracking-wider mb-2 border border-blue/20">
            <Share2 className="w-3.5 h-3.5" />
            <span>Multi-Channel Auto-Poster</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-black text-navy tracking-tight">
            Social Media Automation Engine
          </h1>
          <p className="text-xs sm:text-sm text-gray-500">
            Publish automated business spotlights, Diwali offers, and updates to Facebook, Instagram, and LinkedIn.
          </p>
        </div>

        <button
          onClick={() => setShowGuide(!showGuide)}
          className="inline-flex items-center gap-1.5 text-xs font-bold text-navy hover:text-blue bg-white border border-navy/10 px-3.5 py-2 rounded-xl transition-all shadow-sm"
        >
          <HelpCircle className="w-4 h-4 text-blue" />
          <span>{showGuide ? "Hide Setup Guide" : "API Setup Guide"}</span>
        </button>
      </div>

      {/* Platform Connection Status Bar */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
        {/* Facebook */}
        <div className="bg-white rounded-2xl border border-navy/10 p-4 shadow-sm flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-blue-50 text-blue flex items-center justify-center font-bold">
              <Facebook className="w-5 h-5 text-[#1877F2]" />
            </div>
            <div>
              <span className="text-xs font-bold text-navy block">Facebook Page</span>
              <span className="text-[11px] text-gray-400">
                {status.facebook?.connected ? "Ready to publish" : "Needs Token"}
              </span>
            </div>
          </div>
          <span
            className={`text-[10px] font-black uppercase px-2 py-0.5 rounded-full ${
              status.facebook?.connected
                ? "bg-emerald-100 text-emerald-800 border border-emerald-300"
                : "bg-amber-100 text-amber-800 border border-amber-300"
            }`}
          >
            {status.facebook?.connected ? "Connected" : "Pending Key"}
          </span>
        </div>

        {/* Instagram */}
        <div className="bg-white rounded-2xl border border-navy/10 p-4 shadow-sm flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-pink-50 text-pink-600 flex items-center justify-center font-bold">
              <Instagram className="w-5 h-5 text-[#E4405F]" />
            </div>
            <div>
              <span className="text-xs font-bold text-navy block">Instagram Pro</span>
              <span className="text-[11px] text-gray-400">
                {status.instagram?.connected ? "Ready to publish" : "Needs Account ID"}
              </span>
            </div>
          </div>
          <span
            className={`text-[10px] font-black uppercase px-2 py-0.5 rounded-full ${
              status.instagram?.connected
                ? "bg-emerald-100 text-emerald-800 border border-emerald-300"
                : "bg-amber-100 text-amber-800 border border-amber-300"
            }`}
          >
            {status.instagram?.connected ? "Connected" : "Pending Key"}
          </span>
        </div>

        {/* LinkedIn */}
        <div className="bg-white rounded-2xl border border-navy/10 p-4 shadow-sm flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-sky-50 text-sky-700 flex items-center justify-center font-bold">
              <Linkedin className="w-5 h-5 text-[#0A66C2]" />
            </div>
            <div>
              <span className="text-xs font-bold text-navy block">LinkedIn Page</span>
              <span className="text-[11px] text-gray-400">
                {status.linkedin?.connected ? "Ready to publish" : "Needs Token"}
              </span>
            </div>
          </div>
          <span
            className={`text-[10px] font-black uppercase px-2 py-0.5 rounded-full ${
              status.linkedin?.connected
                ? "bg-emerald-100 text-emerald-800 border border-emerald-300"
                : "bg-amber-100 text-amber-800 border border-amber-300"
            }`}
          >
            {status.linkedin?.connected ? "Connected" : "Pending Key"}
          </span>
        </div>
      </div>

      {/* Collapsible Setup Guide */}
      {showGuide && (
        <div className="bg-white rounded-3xl border border-navy/15 p-6 shadow-sm space-y-4">
          <h2 className="text-base font-black text-navy flex items-center gap-2">
            <span>🔑 How to Get Your Free API Keys in 3 Minutes</span>
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-xs text-gray-600">
            <div className="space-y-2">
              <h3 className="font-bold text-navy flex items-center gap-1.5">
                <Facebook className="w-4 h-4 text-[#1877F2]" />
                <span>1. Facebook Page Token</span>
              </h3>
              <ol className="list-decimal pl-4 space-y-1 text-gray-600">
                <li>Go to <a href="https://developers.facebook.com" target="_blank" rel="noreferrer" className="text-blue underline">developers.facebook.com</a>.</li>
                <li>Create an App &gt; Select &quot;Other&quot; &gt; &quot;Business&quot;.</li>
                <li>In Graph API Explorer, select your Page and permissions: <code>pages_manage_posts</code>, <code>pages_read_engagement</code>.</li>
                <li>Copy <strong>Page ID</strong> &amp; <strong>Access Token</strong> to <code>.env.local</code>.</li>
              </ol>
            </div>

            <div className="space-y-2">
              <h3 className="font-bold text-navy flex items-center gap-1.5">
                <Instagram className="w-4 h-4 text-[#E4405F]" />
                <span>2. Instagram Account ID</span>
              </h3>
              <ol className="list-decimal pl-4 space-y-1 text-gray-600">
                <li>Connect your Instagram Professional account to your Facebook Page in Instagram settings.</li>
                <li>In Meta Graph API Explorer, query: <code>GET me/accounts?fields=instagram_business_account</code>.</li>
                <li>Copy the returned ID as <code>INSTAGRAM_ACCOUNT_ID</code> in <code>.env.local</code>.</li>
              </ol>
            </div>

            <div className="space-y-2">
              <h3 className="font-bold text-navy flex items-center gap-1.5">
                <Linkedin className="w-4 h-4 text-[#0A66C2]" />
                <span>3. LinkedIn Token</span>
              </h3>
              <ol className="list-decimal pl-4 space-y-1 text-gray-600">
                <li>Go to <a href="https://www.linkedin.com/developers" target="_blank" rel="noreferrer" className="text-blue underline">linkedin.com/developers</a>.</li>
                <li>Create an App &amp; request permission <code>w_member_social</code> (or <code>w_organization_social</code>).</li>
                <li>Generate OAuth access token and add <code>LINKEDIN_ACCESS_TOKEN</code> and <code>LINKEDIN_AUTHOR_URN</code> to <code>.env.local</code>.</li>
              </ol>
            </div>
          </div>
        </div>
      )}

      {/* Main 2-Column Composer */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left Column: Post Composer */}
        <div className="lg:col-span-7 bg-white rounded-3xl border border-navy/10 p-6 sm:p-7 shadow-sm space-y-6">
          {/* Post Type Selector Tabs */}
          <div>
            <label className="block text-xs font-bold text-navy uppercase tracking-wider mb-2">
              Select Campaign Type
            </label>
            <div className="grid grid-cols-3 gap-2">
              <button
                type="button"
                onClick={() => handleSelectPostType("spotlight")}
                className={`py-2.5 px-3 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-1.5 ${
                  postType === "spotlight"
                    ? "bg-navy text-white shadow-md"
                    : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                }`}
              >
                <Sparkles className="w-3.5 h-3.5 text-amber-400" />
                <span>Business Spotlight</span>
              </button>

              <button
                type="button"
                onClick={() => handleSelectPostType("diwali")}
                className={`py-2.5 px-3 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-1.5 ${
                  postType === "diwali"
                    ? "bg-navy text-white shadow-md"
                    : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                }`}
              >
                <Flame className="w-3.5 h-3.5 text-orange" />
                <span>Diwali Offer Promo</span>
              </button>

              <button
                type="button"
                onClick={() => handleSelectPostType("custom")}
                className={`py-2.5 px-3 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-1.5 ${
                  postType === "custom"
                    ? "bg-navy text-white shadow-md"
                    : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                }`}
              >
                <span>✍️ Custom Post</span>
              </button>
            </div>
          </div>

          {/* Business Selector (if Spotlight) */}
          {postType === "spotlight" && (
            <div className="space-y-2 p-4 rounded-2xl bg-gray-50 border border-navy/10">
              <div className="flex items-center justify-between">
                <label className="text-xs font-bold text-navy uppercase tracking-wider">
                  Target Business ({businesses.length} available)
                </label>
                <button
                  type="button"
                  onClick={handlePickRandom}
                  className="inline-flex items-center gap-1 text-[11px] font-bold text-blue hover:text-navy"
                >
                  <Dice5 className="w-3.5 h-3.5" />
                  <span>Pick Random Business</span>
                </button>
              </div>

              <select
                value={selectedBusiness?.slug || ""}
                onChange={(e) => handleSelectBusiness(e.target.value)}
                className="w-full px-3 py-2 rounded-xl border border-navy/20 text-xs text-navy focus:outline-none focus:border-orange bg-white font-medium"
              >
                {businesses.map((b) => (
                  <option key={b.id} value={b.slug}>
                    {b.name} ({b.locality || "Katraj"}) {b.rating ? `— ⭐ ${b.rating}` : ""}
                  </option>
                ))}
              </select>
            </div>
          )}

          {/* Caption Editor */}
          <div className="space-y-1.5">
            <div className="flex items-center justify-between">
              <label className="text-xs font-bold text-navy uppercase tracking-wider">
                Post Caption &amp; Hashtags
              </label>
              <button
                type="button"
                onClick={() => {
                  navigator.clipboard.writeText(caption)
                  alert("Caption copied to clipboard!")
                }}
                className="inline-flex items-center gap-1 text-[11px] font-semibold text-gray-500 hover:text-navy"
              >
                <Copy className="w-3 h-3" />
                <span>Copy Caption</span>
              </button>
            </div>
            <textarea
              rows={9}
              value={caption}
              onChange={(e) => setCaption(e.target.value)}
              className="w-full p-3.5 rounded-2xl border border-navy/20 text-xs font-mono focus:outline-none focus:border-orange leading-relaxed"
            />
          </div>

          {/* Image URL & Link URL Inputs */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-navy uppercase tracking-wider">
                Post Image URL
              </label>
              <input
                type="text"
                value={imageUrl}
                onChange={(e) => setImageUrl(e.target.value)}
                placeholder="https://..."
                className="w-full px-3 py-2 rounded-xl border border-navy/20 text-xs font-mono focus:outline-none focus:border-orange"
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-bold text-navy uppercase tracking-wider">
                Attached Link URL
              </label>
              <input
                type="text"
                value={linkUrl}
                onChange={(e) => setLinkUrl(e.target.value)}
                placeholder="https://katrajpune.com/..."
                className="w-full px-3 py-2 rounded-xl border border-navy/20 text-xs font-mono focus:outline-none focus:border-orange"
              />
            </div>
          </div>

          {/* Platform Selection Checkboxes */}
          <div className="space-y-2 pt-2 border-t border-navy/10">
            <label className="block text-xs font-bold text-navy uppercase tracking-wider">
              Publish To Channels
            </label>
            <div className="flex flex-wrap items-center gap-4">
              <label className="flex items-center gap-2 cursor-pointer text-xs font-bold text-navy">
                <input
                  type="checkbox"
                  checked={platforms.includes("facebook")}
                  onChange={() => togglePlatform("facebook")}
                  className="rounded text-blue focus:ring-blue"
                />
                <Facebook className="w-4 h-4 text-[#1877F2]" />
                <span>Facebook Page</span>
              </label>

              <label className="flex items-center gap-2 cursor-pointer text-xs font-bold text-navy">
                <input
                  type="checkbox"
                  checked={platforms.includes("instagram")}
                  onChange={() => togglePlatform("instagram")}
                  className="rounded text-pink-600 focus:ring-pink-500"
                />
                <Instagram className="w-4 h-4 text-[#E4405F]" />
                <span>Instagram Feed</span>
              </label>

              <label className="flex items-center gap-2 cursor-pointer text-xs font-bold text-navy">
                <input
                  type="checkbox"
                  checked={platforms.includes("linkedin")}
                  onChange={() => togglePlatform("linkedin")}
                  className="rounded text-sky-600 focus:ring-sky-500"
                />
                <Linkedin className="w-4 h-4 text-[#0A66C2]" />
                <span>LinkedIn Page</span>
              </label>
            </div>
          </div>

          {/* Results Message */}
          {results.length > 0 && (
            <div className="p-4 rounded-2xl bg-gray-50 border border-navy/10 space-y-2">
              <span className="text-xs font-bold text-navy uppercase tracking-wider block">
                Publishing Results:
              </span>
              {results.map((r, i) => (
                <div
                  key={i}
                  className={`flex items-center justify-between text-xs p-2.5 rounded-xl ${
                    r.success ? "bg-emerald-50 text-emerald-900 border border-emerald-200" : "bg-red-50 text-red-900 border border-red-200"
                  }`}
                >
                  <span className="font-bold capitalize">{r.platform}:</span>
                  {r.success ? (
                    <a
                      href={r.url}
                      target="_blank"
                      rel="noreferrer"
                      className="underline font-semibold flex items-center gap-1"
                    >
                      <span>View Live Post</span>
                      <ExternalLink className="w-3 h-3" />
                    </a>
                  ) : (
                    <span className="text-[11px] font-mono">{r.error}</span>
                  )}
                </div>
              ))}
            </div>
          )}

          {/* Publish CTA Button */}
          <button
            type="button"
            onClick={handlePublish}
            disabled={publishing}
            className="w-full bg-navy hover:bg-blue disabled:opacity-50 text-white font-extrabold text-sm py-3.5 px-6 rounded-2xl shadow-lg transition-all flex items-center justify-center gap-2 cursor-pointer"
          >
            {publishing ? (
              <>
                <RefreshCw className="w-4 h-4 animate-spin" />
                <span>Publishing to Social Channels...</span>
              </>
            ) : (
              <>
                <Send className="w-4 h-4" />
                <span>🚀 Publish to Selected Social Channels</span>
              </>
            )}
          </button>
        </div>

        {/* Right Column: Live Mockup Card Preview */}
        <div className="lg:col-span-5 space-y-4">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-navy uppercase tracking-wider">
              Live Feed Preview
            </span>
            <div className="flex items-center gap-1 bg-gray-100 p-1 rounded-xl">
              <button
                type="button"
                onClick={() => setPreviewTab("instagram")}
                className={`px-2.5 py-1 rounded-lg text-xs font-bold transition-all ${
                  previewTab === "instagram" ? "bg-white text-navy shadow-sm" : "text-gray-500"
                }`}
              >
                Instagram
              </button>
              <button
                type="button"
                onClick={() => setPreviewTab("facebook")}
                className={`px-2.5 py-1 rounded-lg text-xs font-bold transition-all ${
                  previewTab === "facebook" ? "bg-white text-navy shadow-sm" : "text-gray-500"
                }`}
              >
                Facebook
              </button>
              <button
                type="button"
                onClick={() => setPreviewTab("linkedin")}
                className={`px-2.5 py-1 rounded-lg text-xs font-bold transition-all ${
                  previewTab === "linkedin" ? "bg-white text-navy shadow-sm" : "text-gray-500"
                }`}
              >
                LinkedIn
              </button>
            </div>
          </div>

          {/* Social Post Mockup Card */}
          <div className="bg-white rounded-3xl border border-navy/15 shadow-md overflow-hidden">
            {/* Header info */}
            <div className="p-4 flex items-center gap-3 border-b border-gray-100">
              <div className="w-10 h-10 rounded-full bg-navy text-white flex items-center justify-center font-black text-sm">
                KP
              </div>
              <div className="flex-1">
                <div className="flex items-center gap-1.5">
                  <span className="text-xs font-black text-navy">KatrajPune</span>
                  <CheckCircle2 className="w-3.5 h-3.5 text-blue fill-blue text-white" />
                </div>
                <span className="text-[10px] text-gray-400">Katraj, Pune • Just now</span>
              </div>
            </div>

            {/* Media Image */}
            <div className="relative aspect-square bg-gray-100 flex items-center justify-center overflow-hidden">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={imageUrl}
                alt="Post Preview"
                className="w-full h-full object-cover"
                onError={(e) => {
                  ;(e.target as any).src = "https://katrajpune.com/og-image.png"
                }}
              />
              <div className="absolute top-3 left-3 bg-navy/80 backdrop-blur-md text-white px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider border border-white/20">
                📍 {selectedBusiness?.locality || "Katraj"}
              </div>
            </div>

            {/* Caption in Mockup */}
            <div className="p-4 space-y-2">
              <p className="text-xs text-gray-800 whitespace-pre-wrap font-sans max-h-48 overflow-y-auto leading-relaxed">
                {caption}
              </p>

              {linkUrl && (
                <div className="pt-2 border-t border-gray-100">
                  <a
                    href={linkUrl}
                    target="_blank"
                    rel="noreferrer"
                    className="text-[11px] font-bold text-blue hover:underline flex items-center gap-1"
                  >
                    <span>{linkUrl}</span>
                    <ExternalLink className="w-3 h-3" />
                  </a>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

