"use client"

import { useState, useEffect, useMemo } from "react"
import Link from "next/link"
import {
  MessageCircle,
  Search,
  CheckCircle2,
  Send,
  ExternalLink,
  Sparkles,
  Flame,
  Clock,
  Filter,
  Check,
  RotateCcw,
  Users,
  CreditCard,
  Building2,
  Copy,
} from "lucide-react"
import { SITE_CONFIG, getDiwaliOfferOutreachMessage, getWhatsAppWebUrl } from "@/lib/config"

interface Business {
  id: string
  slug: string
  name: string
  category: string
  locality: string | null
  phone: string | null
  whatsapp: string | null
  status: string
  payment_status?: string
}

interface OutreachRecord {
  status: "uncontacted" | "sent" | "replied" | "converted" | "skipped"
  sentAt?: string
  notes?: string
}

export default function AdminOutreachPage() {
  const [businesses, setBusinesses] = useState<Business[]>([])
  const [outreachMap, setOutreachMap] = useState<Record<string, OutreachRecord>>({})
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState("")
  const [selectedLocality, setSelectedLocality] = useState("all")
  const [selectedCategory, setSelectedCategory] = useState("all")
  const [selectedStatus, setSelectedStatus] = useState("all")
  const [copiedSlug, setCopiedSlug] = useState<string | null>(null)

  // 1. Load businesses and campaign history
  useEffect(() => {
    Promise.all([
      fetch("/api/businesses/all").then((res) => res.json()),
      fetch("/api/admin/outreach").then((res) => res.json()),
    ])
      .then(([bizData, outreachData]) => {
        if (Array.isArray(bizData)) {
          setBusinesses(bizData)
        }
        if (outreachData?.campaign) {
          setOutreachMap(outreachData.campaign)
        }
      })
      .catch((err) => console.error(err))
      .finally(() => setLoading(false))
  }, [])

  // 2. Localities and categories for filtering
  const localities = useMemo(() => {
    const set = new Set<string>()
    businesses.forEach((b) => {
      if (b.locality) set.add(b.locality)
    })
    return Array.from(set).sort()
  }, [businesses])

  const categories = useMemo(() => {
    const set = new Set<string>()
    businesses.forEach((b) => {
      if (b.category) set.add(b.category)
    })
    return Array.from(set).sort()
  }, [businesses])

  // 3. Filtered list
  const filteredBusinesses = useMemo(() => {
    return businesses.filter((b) => {
      const q = search.toLowerCase().trim()
      const matchSearch =
        !q ||
        b.name.toLowerCase().includes(q) ||
        b.phone?.includes(q) ||
        b.whatsapp?.includes(q) ||
        b.locality?.toLowerCase().includes(q)

      const matchLoc = selectedLocality === "all" || b.locality === selectedLocality
      const matchCat = selectedCategory === "all" || b.category === selectedCategory

      const currentStatus = outreachMap[b.slug]?.status || "uncontacted"
      const matchStatus =
        selectedStatus === "all" ||
        (selectedStatus === "uncontacted" && currentStatus === "uncontacted") ||
        (selectedStatus === "sent" && currentStatus === "sent") ||
        (selectedStatus === "converted" && currentStatus === "converted") ||
        (selectedStatus === "replied" && currentStatus === "replied") ||
        (selectedStatus === "skipped" && currentStatus === "skipped")

      return matchSearch && matchLoc && matchCat && matchStatus
    })
  }, [businesses, search, selectedLocality, selectedCategory, selectedStatus, outreachMap])

  // 4. Campaign Metrics
  const stats = useMemo(() => {
    const total = businesses.length
    let sent = 0
    let converted = 0
    let replied = 0
    let skipped = 0

    Object.values(outreachMap).forEach((rec) => {
      if (rec.status === "sent") sent++
      if (rec.status === "converted") converted++
      if (rec.status === "replied") replied++
      if (rec.status === "skipped") skipped++
    })

    const uncontacted = total - (sent + converted + replied + skipped)
    const goal = 100
    const revenueEarned = converted * SITE_CONFIG.listing.feeINR

    return { total, sent, converted, replied, skipped, uncontacted, goal, revenueEarned }
  }, [businesses, outreachMap])

  // 5. Update status
  const handleUpdateStatus = async (slug: string, status: OutreachRecord["status"]) => {
    // optimistic update
    setOutreachMap((prev) => ({
      ...prev,
      [slug]: {
        ...prev[slug],
        status,
        sentAt: prev[slug]?.sentAt || new Date().toISOString(),
      },
    }))

    try {
      await fetch("/api/admin/outreach", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ slug, status }),
      })
    } catch (err) {
      console.error("Failed to update status:", err)
    }
  }

  // 6. Action: Open WhatsApp Web and mark as sent
  const handleSendWhatsApp = (b: Business) => {
    const phone = b.whatsapp || b.phone
    if (!phone) {
      alert("No phone or WhatsApp number available for this business.")
      return
    }

    const message = getDiwaliOfferOutreachMessage(b)
    const url = getWhatsAppWebUrl(phone, message)

    window.open(url, "_blank", "noopener,noreferrer")
    handleUpdateStatus(b.slug, "sent")
  }

  // 7. Copy message text
  const handleCopyMessage = (b: Business) => {
    const message = getDiwaliOfferOutreachMessage(b)
    navigator.clipboard.writeText(message)
    setCopiedSlug(b.slug)
    setTimeout(() => setCopiedSlug(null), 2000)
  }

  // 8. Next uncontacted candidate for the Speed Dialer
  const nextCandidate = useMemo(() => {
    return businesses.find((b) => {
      const status = outreachMap[b.slug]?.status || "uncontacted"
      return status === "uncontacted" && (b.whatsapp || b.phone)
    })
  }, [businesses, outreachMap])

  return (
    <div className="space-y-6 max-w-7xl mx-auto pb-12">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-100 text-amber-800 text-xs font-bold uppercase tracking-wider mb-2 border border-amber-200">
            <Flame className="w-3.5 h-3.5 text-orange" />
            <span>Diwali Outreach Engine</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-black text-navy tracking-tight">
            WhatsApp Bulk Outreach Campaign
          </h1>
          <p className="text-xs sm:text-sm text-gray-500">
            Promote the <strong>Diwali Offer: ₹350/year</strong> (Regular ₹1,499) to 1,444 Katraj businesses with 1-click WhatsApp Web!
          </p>
        </div>

        <div className="flex items-center gap-3">
          <Link
            href="/admin/businesses"
            className="text-xs font-bold text-navy hover:text-blue bg-white border border-navy/10 px-4 py-2.5 rounded-xl transition-all shadow-sm"
          >
            ← Back to Listings
          </Link>
        </div>
      </div>

      {/* Goal Tracker Card */}
      <div className="bg-gradient-to-br from-navy via-[#162D4A] to-blue text-white rounded-3xl p-6 sm:p-8 shadow-xl relative overflow-hidden">
        <div className="relative z-10 grid grid-cols-1 md:grid-cols-12 gap-6 items-center">
          <div className="md:col-span-8 space-y-4">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 text-amber-300 text-xs font-black uppercase tracking-widest border border-white/10">
              <Sparkles className="w-3.5 h-3.5" />
              <span>Target: First 100 Paid Businesses @ ₹350</span>
            </div>

            <div className="space-y-2">
              <div className="flex items-baseline justify-between text-xs sm:text-sm">
                <span className="text-gray-300 font-semibold">
                  Campaign Progress ({stats.converted} of {stats.goal} Claimed)
                </span>
                <span className="font-extrabold text-amber-300">
                  ₹{stats.revenueEarned.toLocaleString("en-IN")} Earned
                </span>
              </div>
              <div className="w-full bg-white/20 h-4 rounded-full overflow-hidden p-0.5">
                <div
                  className="bg-gradient-to-r from-amber-400 to-emerald-400 h-full rounded-full transition-all duration-500"
                  style={{ width: `${Math.min(100, (stats.converted / stats.goal) * 100)}%` }}
                />
              </div>
            </div>

            <p className="text-xs text-gray-300 leading-relaxed">
              <strong>Diwali Hook:</strong> Regular ₹1,499/year crossed out. Businesses get 1 full year of verified listing, direct WhatsApp lead button, and top search ranking for <strong>less than ₹1 per day</strong> (₹350/yr).
            </p>
          </div>

          <div className="md:col-span-4 bg-white/10 backdrop-blur-md rounded-2xl p-5 border border-white/10 text-center space-y-2">
            <span className="text-xs font-bold uppercase tracking-wider text-amber-300 block">
              Remaining in First 100
            </span>
            <span className="text-4xl sm:text-5xl font-black text-white">
              {Math.max(0, stats.goal - stats.converted)}
            </span>
            <span className="text-[11px] text-gray-300 block">
              Slots open before price reverts to ₹1,499/year
            </span>
          </div>
        </div>
      </div>

      {/* Speed-Dialer Hero Card: Next Uncontacted Business */}
      {nextCandidate && (
        <div className="bg-amber-50/80 border-2 border-amber-300 rounded-3xl p-6 shadow-sm">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 pb-4 border-b border-amber-200">
            <div className="flex items-center gap-2.5">
              <div className="w-10 h-10 rounded-2xl bg-amber-500 text-white flex items-center justify-center font-black">
                ⚡
              </div>
              <div>
                <span className="text-[10px] font-black uppercase tracking-wider text-amber-800 block">
                  Speed-Dialer • Next Uncontacted Business
                </span>
                <h2 className="text-lg font-black text-navy">{nextCandidate.name}</h2>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <span className="text-xs font-semibold px-2.5 py-1 rounded-lg bg-white border border-amber-200 text-gray-700">
                {nextCandidate.locality || "Katraj"}
              </span>
              <span className="text-xs font-semibold px-2.5 py-1 rounded-lg bg-white border border-amber-200 text-navy font-mono">
                {nextCandidate.whatsapp || nextCandidate.phone}
              </span>
            </div>
          </div>

          <div className="py-4 grid grid-cols-1 lg:grid-cols-12 gap-4 items-center">
            <div className="lg:col-span-8 bg-white rounded-xl p-3.5 border border-amber-200 text-xs font-mono text-gray-700 max-h-36 overflow-y-auto whitespace-pre-wrap leading-relaxed">
              {getDiwaliOfferOutreachMessage(nextCandidate)}
            </div>

            <div className="lg:col-span-4 flex flex-col gap-2">
              <button
                onClick={() => handleSendWhatsApp(nextCandidate)}
                className="w-full bg-emerald-600 hover:bg-emerald-700 text-white font-extrabold text-sm py-3 px-4 rounded-xl shadow-md transition-all flex items-center justify-center gap-2 cursor-pointer"
              >
                <MessageCircle className="w-4 h-4 fill-white text-emerald-600" />
                <span>Open in WhatsApp Web &amp; Send</span>
              </button>

              <div className="grid grid-cols-2 gap-2">
                <button
                  onClick={() => handleCopyMessage(nextCandidate)}
                  className="bg-white hover:bg-gray-50 border border-gray-200 text-navy font-bold text-xs py-2 px-3 rounded-xl transition-all flex items-center justify-center gap-1.5"
                >
                  <Copy className="w-3.5 h-3.5" />
                  <span>{copiedSlug === nextCandidate.slug ? "Copied!" : "Copy Text"}</span>
                </button>
                <button
                  onClick={() => handleUpdateStatus(nextCandidate.slug, "skipped")}
                  className="bg-white hover:bg-gray-50 border border-gray-200 text-gray-600 font-bold text-xs py-2 px-3 rounded-xl transition-all"
                >
                  Skip for Now
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Metrics Row */}
      <div className="grid grid-cols-2 sm:grid-cols-5 gap-3">
        <div className="bg-white rounded-2xl border border-navy/10 p-4 shadow-sm text-center">
          <span className="text-[11px] font-bold text-gray-500 uppercase tracking-wider block">
            Total Listings
          </span>
          <span className="text-2xl font-black text-navy mt-1 block">{stats.total}</span>
        </div>

        <div className="bg-white rounded-2xl border border-navy/10 p-4 shadow-sm text-center">
          <span className="text-[11px] font-bold text-amber-600 uppercase tracking-wider block">
            Uncontacted
          </span>
          <span className="text-2xl font-black text-amber-600 mt-1 block">{stats.uncontacted}</span>
        </div>

        <div className="bg-white rounded-2xl border border-navy/10 p-4 shadow-sm text-center">
          <span className="text-[11px] font-bold text-blue uppercase tracking-wider block">
            Sent / Contacted
          </span>
          <span className="text-2xl font-black text-blue mt-1 block">{stats.sent}</span>
        </div>

        <div className="bg-white rounded-2xl border border-navy/10 p-4 shadow-sm text-center">
          <span className="text-[11px] font-bold text-emerald-600 uppercase tracking-wider block">
            Converted (Paid ₹350)
          </span>
          <span className="text-2xl font-black text-emerald-600 mt-1 block">{stats.converted}</span>
        </div>

        <div className="bg-white rounded-2xl border border-navy/10 p-4 shadow-sm text-center col-span-2 sm:col-span-1">
          <span className="text-[11px] font-bold text-gray-500 uppercase tracking-wider block">
            Replied / Interested
          </span>
          <span className="text-2xl font-black text-purple-600 mt-1 block">{stats.replied}</span>
        </div>
      </div>

      {/* Filters and Search Bar */}
      <div className="bg-white rounded-2xl border border-navy/10 p-4 shadow-sm space-y-3">
        <div className="grid grid-cols-1 sm:grid-cols-12 gap-3 items-center">
          <div className="sm:col-span-4 relative">
            <Search className="w-4 h-4 absolute left-3 top-3 text-gray-400" />
            <input
              type="text"
              placeholder="Search by business name or phone..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-9 pr-3 py-2 rounded-xl border border-navy/20 text-xs focus:outline-none focus:border-orange"
            />
          </div>

          <div className="sm:col-span-3">
            <select
              value={selectedLocality}
              onChange={(e) => setSelectedLocality(e.target.value)}
              className="w-full px-3 py-2 rounded-xl border border-navy/20 text-xs text-navy focus:outline-none focus:border-orange"
            >
              <option value="all">All Localities ({localities.length})</option>
              {localities.map((loc) => (
                <option key={loc} value={loc}>
                  {loc}
                </option>
              ))}
            </select>
          </div>

          <div className="sm:col-span-3">
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="w-full px-3 py-2 rounded-xl border border-navy/20 text-xs text-navy focus:outline-none focus:border-orange"
            >
              <option value="all">All Categories ({categories.length})</option>
              {categories.map((cat) => (
                <option key={cat} value={cat}>
                  {cat}
                </option>
              ))}
            </select>
          </div>

          <div className="sm:col-span-2">
            <select
              value={selectedStatus}
              onChange={(e) => setSelectedStatus(e.target.value)}
              className="w-full px-3 py-2 rounded-xl border border-navy/20 text-xs text-navy focus:outline-none focus:border-orange"
            >
              <option value="all">All Status</option>
              <option value="uncontacted">Uncontacted</option>
              <option value="sent">Sent</option>
              <option value="converted">Converted (Paid)</option>
              <option value="replied">Replied</option>
              <option value="skipped">Skipped</option>
            </select>
          </div>
        </div>

        <div className="flex items-center justify-between text-xs text-gray-500 pt-1 border-t border-navy/5">
          <span>
            Showing <strong>{filteredBusinesses.length}</strong> of {businesses.length} businesses
          </span>
          <span className="text-[11px] text-gray-400">
            Tip: Click &quot;Send WhatsApp&quot; to open WhatsApp Web with the prefilled Diwali offer message.
          </span>
        </div>
      </div>

      {/* Directory Table */}
      <div className="bg-white rounded-2xl border border-navy/10 shadow-sm overflow-hidden">
        {loading ? (
          <div className="p-12 text-center text-xs text-gray-500">Loading business directory...</div>
        ) : filteredBusinesses.length === 0 ? (
          <div className="p-12 text-center text-xs text-gray-500">No matching businesses found.</div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-gray-50 border-b border-navy/10 text-[11px] font-bold text-navy uppercase tracking-wider">
                  <th className="p-3.5">Business &amp; Micro-Locality</th>
                  <th className="p-3.5">Category</th>
                  <th className="p-3.5">Contact Number</th>
                  <th className="p-3.5">Campaign Status</th>
                  <th className="p-3.5 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-navy/5 text-xs">
                {filteredBusinesses.slice(0, 50).map((b) => {
                  const currentStatus = outreachMap[b.slug]?.status || "uncontacted"
                  const phone = b.whatsapp || b.phone

                  return (
                    <tr key={b.id} className="hover:bg-gray-50/80 transition-colors">
                      <td className="p-3.5">
                        <div className="font-bold text-navy">{b.name}</div>
                        <div className="text-[11px] text-gray-500 flex items-center gap-1.5 mt-0.5">
                          <span>{b.locality || "Katraj"}</span>
                          <span>•</span>
                          <a
                            href={`https://katrajpune.com/business/${b.slug}`}
                            target="_blank"
                            rel="noreferrer"
                            className="text-blue hover:underline inline-flex items-center gap-0.5"
                          >
                            <span>view</span>
                            <ExternalLink className="w-2.5 h-2.5" />
                          </a>
                        </div>
                      </td>

                      <td className="p-3.5 text-gray-600 capitalize">
                        {b.category?.replace("_", " ")}
                      </td>

                      <td className="p-3.5 font-mono text-gray-700">
                        {phone ? (
                          <span className="font-semibold text-emerald-800">{phone}</span>
                        ) : (
                          <span className="text-gray-400">No phone</span>
                        )}
                      </td>

                      <td className="p-3.5">
                        <select
                          value={currentStatus}
                          onChange={(e) =>
                            handleUpdateStatus(b.slug, e.target.value as OutreachRecord["status"])
                          }
                          className={`text-[11px] font-bold px-2.5 py-1 rounded-lg border focus:outline-none ${
                            currentStatus === "converted"
                              ? "bg-emerald-100 text-emerald-800 border-emerald-300"
                              : currentStatus === "sent"
                              ? "bg-blue-100 text-blue-800 border-blue-200"
                              : currentStatus === "replied"
                              ? "bg-purple-100 text-purple-800 border-purple-200"
                              : currentStatus === "skipped"
                              ? "bg-gray-100 text-gray-600 border-gray-200"
                              : "bg-amber-50 text-amber-800 border-amber-200"
                          }`}
                        >
                          <option value="uncontacted">⏳ Uncontacted</option>
                          <option value="sent">📨 Sent</option>
                          <option value="replied">💬 Replied</option>
                          <option value="converted">🎉 Converted (₹350 Paid)</option>
                          <option value="skipped">⏭️ Skipped</option>
                        </select>
                      </td>

                      <td className="p-3.5 text-right">
                        <div className="flex items-center justify-end gap-1.5">
                          <button
                            onClick={() => handleSendWhatsApp(b)}
                            disabled={!phone}
                            title="Open WhatsApp Web"
                            className="inline-flex items-center gap-1.5 bg-emerald-600 hover:bg-emerald-700 disabled:opacity-40 text-white font-bold text-[11px] px-3 py-1.5 rounded-lg shadow-sm transition-all"
                          >
                            <MessageCircle className="w-3.5 h-3.5" />
                            <span>WhatsApp</span>
                          </button>

                          <button
                            onClick={() => handleCopyMessage(b)}
                            title="Copy Offer Text"
                            className="p-1.5 rounded-lg text-gray-600 hover:bg-gray-100 transition-colors border border-gray-200"
                          >
                            <Copy className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
          </div>
        )}

        {filteredBusinesses.length > 50 && (
          <div className="p-4 bg-gray-50 border-t border-navy/10 text-center text-xs text-gray-500">
            Showing first 50 results. Use the search or locality filters above to narrow down specific zones.
          </div>
        )}
      </div>
    </div>
  )
}
