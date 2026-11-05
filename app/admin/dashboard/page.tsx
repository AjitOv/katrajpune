"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import {
  Building2,
  CheckCircle2,
  Clock,
  XCircle,
  CreditCard,
  AlertCircle,
  Megaphone,
  Sparkles,
  Plus,
  ArrowRight,
  ShieldCheck,
  MapPin,
  Settings,
  FileText,
} from "lucide-react"

interface DashboardStats {
  totalBusinesses: number
  approvedListings: number
  pendingListings: number
  rejectedListings: number
  paidListings: number
  pendingPayments: number
  activeAds: number
  auditEnquiries: number
}

export default function AdminDashboardPage() {
  const [stats, setStats] = useState<DashboardStats>({
    totalBusinesses: 0,
    approvedListings: 0,
    pendingListings: 0,
    rejectedListings: 0,
    paidListings: 0,
    pendingPayments: 0,
    activeAds: 0,
    auditEnquiries: 0,
  })
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetch("/api/admin/dashboard/stats")
      .then((res) => res.json())
      .then((data) => {
        if (data) setStats(data)
      })
      .catch((err) => console.error("Failed to load dashboard stats:", err))
      .finally(() => setLoading(false))
  }, [])

  const statCards = [
    {
      label: "Total Businesses",
      value: stats.totalBusinesses,
      icon: Building2,
      color: "text-navy",
      bg: "bg-navy/5",
      border: "border-navy/10",
      href: "/admin/businesses",
    },
    {
      label: "Approved Listings",
      value: stats.approvedListings,
      icon: CheckCircle2,
      color: "text-emerald-600",
      bg: "bg-emerald-50",
      border: "border-emerald-200",
      href: "/admin/businesses?status=approved",
    },
    {
      label: "Pending Review",
      value: stats.pendingListings,
      icon: Clock,
      color: "text-amber-600",
      bg: "bg-amber-50",
      border: "border-amber-200",
      href: "/admin/businesses?status=pending",
    },
    {
      label: "Rejected Listings",
      value: stats.rejectedListings,
      icon: XCircle,
      color: "text-rose-600",
      bg: "bg-rose-50",
      border: "border-rose-200",
      href: "/admin/businesses?status=rejected",
    },
    {
      label: "Paid Listings (₹350)",
      value: stats.paidListings,
      icon: CreditCard,
      color: "text-blue-600",
      bg: "bg-blue-50",
      border: "border-blue-200",
      href: "/admin/businesses?payment_status=paid",
    },
    {
      label: "Pending Payments",
      value: stats.pendingPayments,
      icon: AlertCircle,
      color: "text-purple-600",
      bg: "bg-purple-50",
      border: "border-purple-200",
      href: "/admin/businesses?payment_status=pending",
    },
    {
      label: "Active Ad Campaigns",
      value: stats.activeAds,
      icon: Megaphone,
      color: "text-orange",
      bg: "bg-orange/10",
      border: "border-orange/20",
      href: "/admin/ads",
    },
    {
      label: "Zotoz Audit Leads",
      value: stats.auditEnquiries,
      icon: Sparkles,
      color: "text-indigo-600",
      bg: "bg-indigo-50",
      border: "border-indigo-200",
      href: "/admin/audits",
    },
  ]

  return (
    <div className="space-y-8">
      {/* Overview Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-black text-navy tracking-tight">Admin Overview</h1>
          <p className="text-xs text-gray-500 mt-1">
            Real-time platform metrics, moderation queue, ad campaigns, and merchant enquiries for Katraj, Pune.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <Link
            href="/admin/businesses?action=add"
            className="inline-flex items-center gap-1.5 bg-navy hover:bg-blue text-white text-xs font-bold px-3.5 py-2.5 rounded-xl shadow-sm transition-all"
          >
            <Plus className="w-4 h-4" />
            <span>Add Business</span>
          </Link>
          <Link
            href="/admin/ads"
            className="inline-flex items-center gap-1.5 bg-orange hover:bg-orange/90 text-white text-xs font-bold px-3.5 py-2.5 rounded-xl shadow-sm transition-all"
          >
            <Megaphone className="w-4 h-4" />
            <span>New Ad</span>
          </Link>
        </div>
      </div>

      {/* 8 Metric Cards Grid */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {statCards.map((card) => {
          const Icon = card.icon
          return (
            <Link
              key={card.label}
              href={card.href}
              className={`bg-white rounded-2xl p-5 border ${card.border} shadow-sm hover:shadow-md transition-all hover:scale-[1.01] block group`}
            >
              <div className="flex items-center justify-between mb-3">
                <span className="text-[11px] font-bold uppercase tracking-wider text-gray-500 truncate">
                  {card.label}
                </span>
                <div className={`w-8 h-8 rounded-xl ${card.bg} flex items-center justify-center shrink-0`}>
                  <Icon className={`w-4 h-4 ${card.color}`} />
                </div>
              </div>

              <div className="flex items-baseline justify-between">
                <p className={`text-3xl font-black ${card.color}`}>
                  {loading ? "..." : card.value}
                </p>
                <ArrowRight className="w-3.5 h-3.5 text-gray-300 group-hover:text-navy group-hover:translate-x-1 transition-all" />
              </div>
            </Link>
          )
        })}
      </div>

      {/* Quick Actions & Moderation Overview */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Quick Actions Card */}
        <div className="lg:col-span-7 bg-white rounded-2xl border border-navy/10 p-6 shadow-sm space-y-4">
          <h2 className="text-sm font-bold text-navy uppercase tracking-wider">
            Quick Actions &amp; Workflows
          </h2>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
            <Link
              href="/admin/businesses"
              className="flex items-start gap-3 p-3.5 rounded-xl bg-navy/5 hover:bg-navy/10 transition-colors border border-navy/10 group"
            >
              <Building2 className="w-5 h-5 text-navy shrink-0 mt-0.5" />
              <div>
                <p className="font-bold text-navy group-hover:text-blue">Manage 1,440+ Listings</p>
                <p className="text-[11px] text-gray-500 mt-0.5">Edit store details, verify coords &amp; approve</p>
              </div>
            </Link>

            <Link
              href="/admin/ads"
              className="flex items-start gap-3 p-3.5 rounded-xl bg-orange/10 hover:bg-orange/20 transition-colors border border-orange/20 group"
            >
              <Megaphone className="w-5 h-5 text-orange shrink-0 mt-0.5" />
              <div>
                <p className="font-bold text-navy group-hover:text-orange">Manage Advertisements</p>
                <p className="text-[11px] text-gray-500 mt-0.5">Schedule banners, track clicks &amp; impressions</p>
              </div>
            </Link>

            <Link
              href="/admin/audits"
              className="flex items-start gap-3 p-3.5 rounded-xl bg-indigo-50 hover:bg-indigo-100 transition-colors border border-indigo-200 group"
            >
              <Sparkles className="w-5 h-5 text-indigo-700 shrink-0 mt-0.5" />
              <div>
                <p className="font-bold text-navy group-hover:text-indigo-700">View Audit Enquiries</p>
                <p className="text-[11px] text-gray-500 mt-0.5">Lead submissions for Free Zotoz AI Audit</p>
              </div>
            </Link>

            <Link
              href="/admin/map"
              className="flex items-start gap-3 p-3.5 rounded-xl bg-blue-50 hover:bg-blue-100 transition-colors border border-blue-200 group"
            >
              <MapPin className="w-5 h-5 text-blue-700 shrink-0 mt-0.5" />
              <div>
                <p className="font-bold text-navy group-hover:text-blue-700">Moderation Map</p>
                <p className="text-[11px] text-gray-500 mt-0.5">Geospatial review of pin coordinates</p>
              </div>
            </Link>

            <Link
              href="/admin/settings"
              className="flex items-start gap-3 p-3.5 rounded-xl bg-gray-50 hover:bg-gray-100 transition-colors border border-gray-200 group"
            >
              <Settings className="w-5 h-5 text-gray-700 shrink-0 mt-0.5" />
              <div>
                <p className="font-bold text-navy group-hover:text-black">Platform Settings</p>
                <p className="text-[11px] text-gray-500 mt-0.5">WhatsApp support, pricing &amp; SLA</p>
              </div>
            </Link>

            <a
              href="/"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-start gap-3 p-3.5 rounded-xl bg-emerald-50 hover:bg-emerald-100 transition-colors border border-emerald-200 group"
            >
              <ShieldCheck className="w-5 h-5 text-emerald-700 shrink-0 mt-0.5" />
              <div>
                <p className="font-bold text-navy group-hover:text-emerald-800">Live Website ↗</p>
                <p className="text-[11px] text-gray-500 mt-0.5">View public KatrajPune platform</p>
              </div>
            </a>
          </div>
        </div>

        {/* Operating Standards Card */}
        <div className="lg:col-span-5 bg-white rounded-2xl border border-navy/10 p-6 shadow-sm space-y-4">
          <h2 className="text-sm font-bold text-navy uppercase tracking-wider">
            Operational Guidelines &amp; SLA
          </h2>

          <div className="p-4 bg-amber-50 rounded-xl border border-amber-200 space-y-1.5 text-xs text-amber-950">
            <p className="font-bold flex items-center gap-1.5 text-amber-900">
              <Clock className="w-4 h-4 text-amber-700" />
              48-Hour Publishing Standard
            </p>
            <p className="leading-relaxed">
              New submissions and merchant claims require verification against phone/WhatsApp and Razorpay transaction reference before being approved.
            </p>
          </div>

          <ul className="space-y-2.5 text-xs text-gray-600">
            <li className="flex items-start gap-2">
              <span className="text-emerald-600 font-bold">✓</span>
              <span><strong>Separate Statuses:</strong> Payment status is distinct from listing status (unpaid listings can never be auto-published).</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-emerald-600 font-bold">✓</span>
              <span><strong>Audit Trail:</strong> All listing creations, edits, and deletions record actor email and timestamps.</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-emerald-600 font-bold">✓</span>
              <span><strong>SEO Preservation:</strong> Existing slugs and IDs are protected to prevent broken Google links.</span>
            </li>
          </ul>
        </div>
      </div>
    </div>
  )
}
