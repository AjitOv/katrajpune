"use client"

import { useEffect, useState, useCallback } from "react"
import Link from "next/link"

interface Business {
  id: string
  slug: string
  name: string
  category: string
  locality: string | null
  address: string | null
  phone: string | null
  status: string
  location_verified: boolean
  submitted_at: string
  owner_id: string | null
  latitude: number
  longitude: number
}

const CATEGORY_LABELS: Record<string, string> = {
  shopping: "Shopping",
  restaurants: "Restaurants",
  healthcare: "Healthcare",
  education: "Education",
  home_services: "Home Services",
  automotive: "Automotive",
  fitness: "Fitness",
  professional_services: "Professional Services",
}

export default function AdminBusinessesPage() {
  const [businesses, setBusinesses] = useState<Business[]>([])
  const [filter, setFilter] = useState<string>("all")
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState("")

  useEffect(() => {
    loadBusinesses()
  }, [filter])

  async function loadBusinesses() {
    setLoading(true)
    try {
      const params = new URLSearchParams()
      if (filter !== "all") params.set("status", filter)

      const res = await fetch(`/api/admin/businesses?${params}`)
      if (!res.ok) throw new Error("Failed to load listings")
      const data = await res.json()
      setBusinesses(data)
    } catch (err: any) {
      setError(err.message || "Something went wrong")
    } finally {
      setLoading(false)
    }
  }

  async function toggleStatus(id: string, currentStatus: string) {
    const newStatus = currentStatus === "pending" ? "approved" : "pending"
    const action = newStatus === "approved" ? "approve" : "reject"

    try {
      const res = await fetch(`/api/admin/businesses?id=${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action }),
      })
      if (!res.ok) throw new Error("Action failed")
      loadBusinesses()
    } catch (err: any) {
      setError(err.message || "Action failed")
    }
  }

  const filtered = businesses.filter((b) => filter === "all" || b.status === filter)

  const statusColor = (s: string) => {
    switch (s) {
      case "pending": return "bg-blue-50 text-blue-600 border-blue-100"
      case "approved": return "bg-green-50 text-green-600 border-green-100"
      case "rejected": return "bg-red-50 text-red-600 border-red-100"
      default: return "bg-gray-50 text-gray-600 border-gray-100"
    }
  }

  if (loading) {
    return (
      <div className="text-center py-20">
        <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-navy mx-auto mb-4"></div>
        <p className="text-gray-600">Loading listings…</p>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-navy mb-2">All Business Listings</h2>
        <p className="text-gray-600">Review and moderate business submissions.</p>
      </div>

      {error && (
        <div className="p-3 rounded-lg bg-red-50 text-red-600 text-sm border border-red-100">
          {error}
        </div>
      )}

      {/* Filters */}
      <div className="flex flex-wrap gap-2">
        {["all", "pending", "approved", "rejected"].map((f) => (
          <button
            key={f}
            onClick={() => setFilter(f)}
            className={`px-3 py-1.5 rounded-full text-sm font-medium border transition-all ${
              filter === f
                ? "bg-navy text-white border-navy"
                : "bg-white text-navy/60 border-navy/10 hover:bg-gray-50"
            }`}
          >
            {f.charAt(0).toUpperCase() + f.slice(1)}
          </button>
        ))}
      </div>

      {/* Listings table */}
      <div className="bg-white rounded-xl shadow-sm border border-navy/10 overflow-hidden">
        <table className="w-full text-left">
          <thead>
            <tr className="bg-gray-50 border-b border-navy/5">
              <th className="px-6 py-3 text-xs font-bold text-navy/60 uppercase">Business</th>
              <th className="px-6 py-3 text-xs font-bold text-navy/60 uppercase">Category</th>
              <th className="px-6 py-3 text-xs font-bold text-navy/60 uppercase">Locality</th>
              <th className="px-6 py-3 text-xs font-bold text-navy/60 uppercase">Status</th>
              <th className="px-6 py-3 text-xs font-bold text-navy/60 uppercase">Submitted</th>
              <th className="px-6 py-3 text-xs font-bold text-navy/60 uppercase text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-navy/5">
            {filtered.length === 0 ? (
              <tr>
                <td colSpan={6} className="px-6 py-8 text-center text-gray-600">
                  No listings found.
                </td>
              </tr>
            ) : (
              filtered.map((biz) => (
                <tr key={biz.id} className="hover:bg-gray-50 transition-colors">
                  <td className="px-6 py-4">
                    <div className="font-medium text-navy">{biz.name}</div>
                    <div className="text-xs text-gray-500">{biz.address || "No address"}</div>
                  </td>
                  <td className="px-6 py-4">
                    <span className="text-sm text-gray-600">
                      {CATEGORY_LABELS[biz.category] || biz.category}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <span className="text-sm text-gray-600">{biz.locality || "—"}</span>
                  </td>
                  <td className="px-6 py-4">
                    <span
                      className={`px-2 py-0.5 rounded-full text-[10px] font-bold uppercase border ${statusColor(biz.status)}`}
                    >
                      {biz.status}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <span className="text-sm text-gray-500">
                      {new Date(biz.submitted_at).toLocaleDateString()}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-right">
                    <div className="flex items-center justify-end gap-2">
                      <Link
                        href={`/business/${biz.slug}`}
                        className="text-sm text-blue hover:underline"
                      >
                        View
                      </Link>
                      {biz.status === "pending" && (
                        <>
                          <button
                            onClick={() => toggleStatus(biz.id, biz.status)}
                            className="text-xs font-medium text-green-600 hover:text-green-800"
                          >
                            Approve
                          </button>
                          <button
                            onClick={() => toggleStatus(biz.id, biz.status)}
                            className="text-xs font-medium text-red-600 hover:text-red-800"
                          >
                            Reject
                          </button>
                        </>
                      )}
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {filtered.length > 0 && (
        <p className="text-sm text-gray-600">
          Showing {filtered.length} of {businesses.length} listing(s).
        </p>
      )}
    </div>
  )
}
