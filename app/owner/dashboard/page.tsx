"use client"

import { useEffect, useState } from "react"

interface OwnerBusiness {
  id: string
  slug: string
  name: string
  category: string
  locality: string | null
  status: string
  location_verified: boolean
  submitted_at: string
  latitude: number
  longitude: number
}

export default function OwnerDashboard() {
  const [businesses, setBusinesses] = useState<OwnerBusiness[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState("")

  useEffect(() => {
    loadBusinesses()
  }, [])

  async function loadBusinesses() {
    setLoading(true)
    try {
      const res = await fetch("/api/owner/businesses")
      if (!res.ok) {
        if (res.status === 401) {
          window.location.href = "/auth/login"
          return
        }
        throw new Error("Failed to load businesses")
      }
      const data = await res.json()
      setBusinesses(data || [])
    } catch (err: any) {
      setError(err.message || "Something went wrong")
    } finally {
      setLoading(false)
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-navy"></div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-background">
      <header className="bg-white border-b border-navy/10">
        <div className="max-w-5xl mx-auto px-4 py-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between">
            <div>
              <span className="text-[10px] font-bold tracking-widest text-navy/60 uppercase">katrajpune</span>
              <span className="w-1 h-1 rounded-full bg-orange mx-2 mt-[2px]"></span>
              <h1 className="text-xl font-bold text-navy">Owner Dashboard</h1>
            </div>
            <div className="flex items-center gap-3">
              <a href="/owner/add-business" className="px-4 py-2 bg-navy text-white text-sm font-semibold rounded-lg hover:bg-blue transition-colors">
                + Add Business
              </a>
              <button onClick={() => fetch("/api/auth/logout", { method: "POST" }).then(() => (window.location.href = "/"))}
                className="px-4 py-2 text-sm text-navy/60 hover:text-navy transition-colors"
              >
                Sign out
              </button>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {error && (
          <div className="mb-6 p-3 rounded-lg bg-red-50 text-red-600 text-sm border border-red-100">
            {error}
          </div>
        )}

        <div className="flex items-center justify-between mb-6">
          <h2 className="text-lg font-bold text-navy">My Business Listings</h2>
          <p className="text-sm text-gray-600">{businesses.length} listing(s)</p>
        </div>

        {businesses.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-gray-600 mb-4">No listings yet.</p>
            <a href="/owner/add-business" className="text-blue hover:underline font-medium">Add your first business</a>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {businesses.map((biz) => (
              <div key={biz.id} className="bg-white rounded-xl shadow-sm border border-navy/10 overflow-hidden">
                <div className="h-32 bg-gray-100 flex items-center justify-center">
                  <span className="text-3xl">📍</span>
                </div>
                <div className="p-4">
                  <h3 className="text-lg font-bold text-navy">{biz.name}</h3>
                  <p className="text-sm text-gray-600 mt-1">{biz.category.replace(/_/g, " ")}</p>
                  {biz.locality && (
                    <p className="text-sm text-blue-600 font-medium mt-2">{biz.locality}</p>
                  )}
                  <div className="mt-4 flex items-center gap-2">
                    <span
                      className={`px-2 py-0.5 rounded-full text-[10px] font-bold uppercase ${
                        biz.status === "approved"
                          ? "bg-green-50 text-green-600"
                          : biz.status === "rejected"
                          ? "bg-red-50 text-red-600"
                          : "bg-blue-50 text-blue-600"
                      }`}
                    >
                      {biz.status}
                    </span>
                    {biz.location_verified && (
                      <span className="ml-2 inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-green-50 text-green-600 text-[10px] font-bold">
                        <span className="w-1 h-1 rounded-full bg-green-500"></span> Verified
                      </span>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
