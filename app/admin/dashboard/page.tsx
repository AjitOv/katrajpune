"use client"

import { useEffect, useState } from "react"

interface Stat {
  label: string
  value: string
  color: string
}

export default function AdminDashboard() {
  const [stats, setStats] = useState<Stat[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    loadStats()
  }, [])

  async function loadStats() {
    try {
      const res = await fetch("/api/admin/businesses")
      if (!res.ok) throw new Error("Failed to load stats")
      const businesses = await res.json()

      const total = businesses.length
      const pending = businesses.filter((b: any) => b.status === "pending").length
      const approved = businesses.filter((b: any) => b.status === "approved").length
      const rejected = businesses.filter((b: any) => b.status === "rejected").length

      setStats([
        { label: "Total Listings", value: String(total), color: "#10b981" },
        { label: "Pending Approval", value: String(pending), color: "#f59e0b" },
        { label: "Approved", value: String(approved), color: "#3b82f6" },
        { label: "Rejected", value: String(rejected), color: "#ef4444" },
      ])
    } catch (err) {
      console.error(err)
    } finally {
      setLoading(false)
    }
  }

  if (loading) {
    return (
      <div className="text-center py-20">
        <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-navy mx-auto mb-4"></div>
        <p className="text-gray-600">Loading…</p>
      </div>
    )
  }

  return (
    <div className="space-y-8">
      <div>
        <h2 className="text-2xl font-bold text-navy mb-2">Admin Overview</h2>
        <p className="text-gray-600">Manage business listings and moderation actions.</p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((s) => (
          <div
            key={s.label}
            className="bg-white rounded-xl shadow-sm border border-navy/10 p-6"
          >
            <p className="text-xs font-bold uppercase tracking-wider text-navy/50">{s.label}</p>
            <p className="text-3xl font-bold text-navy mt-1" style={{ color: s.color }}>
              {s.value}
            </p>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div className="bg-white rounded-xl shadow-sm border border-navy/10 p-6">
          <h3 className="text-sm font-bold text-navy uppercase tracking-wider mb-4">Quick Actions</h3>
          <div className="space-y-3">
            <a
              href="/admin/map"
              className="flex items-center gap-3 px-4 py-3 bg-blue-50 text-blue-700 text-sm font-medium rounded-xl border border-blue-100 hover:bg-blue-100 transition-colors"
            >
              🗺️ Open Moderation Map
            </a>
            <a
              href="/admin/businesses"
              className="flex items-center gap-3 px-4 py-3 bg-white text-navy text-sm font-medium rounded-xl border border-navy/10 hover:bg-gray-50 transition-colors"
            >
              📋 Review All Listings
            </a>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-navy/10 p-6">
          <h3 className="text-sm font-bold text-navy uppercase tracking-wider mb-4">How Moderation Works</h3>
          <ul className="space-y-3 text-sm text-gray-600">
            <li className="flex items-start gap-2">
              <span className="text-blue">1.</span>
              <span>Business owners submit listings with a map pin.</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-blue">2.</span>
              <span>Submissions appear as "pending" and are not public.</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-blue">3.</span>
              <span>Admins review, approve, or reject each listing.</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-blue">4.</span>
              <span>Approved businesses appear on the public map.</span>
            </li>
          </ul>
        </div>
      </div>
    </div>
  )
}
