"use client"

import { useEffect, useRef, useState, useCallback } from "react"
import * as maplibregl from "maplibre-gl"
import "maplibre-gl/dist/maplibre-gl.css"
import Link from "next/link"
import { getMapStyle } from "@/lib/maplibre"

const KATRAJ_CENTER = [73.8456, 18.4593] as [number, number]

interface Business {
  id: string
  slug: string
  name: string
  category: string
  locality: string | null
  status: string
  location_verified: boolean
  latitude: number
  longitude: number
}

const CATEGORY_COLORS: Record<string, string> = {
  shopping: "#10b981",
  restaurants: "#f43f5e",
  healthcare: "#3b82f6",
  education: "#8b5cf6",
  home_services: "#f59e0b",
  automotive: "#ef4444",
  fitness: "#06b6d4",
  professional_services: "#6366f1",
}

const STATUS_COLORS: Record<string, string> = {
  pending: "#f59e0b",
  approved: "#10b981",
  rejected: "#ef4444",
}

export default function AdminMapPage() {
  const mapRef = useRef<maplibregl.Map | null>(null)
  const containerRef = useRef<HTMLDivElement>(null)
  const markersRef = useRef<maplibregl.Marker[]>([])
  const [businesses, setBusinesses] = useState<Business[]>([])
  const [selectedBiz, setSelectedBiz] = useState<Business | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState("")

  useEffect(() => {
    loadBusinesses()
  }, [])

  async function loadBusinesses() {
    try {
      const res = await fetch("/api/admin/businesses")
      if (!res.ok) throw new Error("Failed to load businesses")
      const data = await res.json()
      setBusinesses(data)
    } catch (err: any) {
      setError(err.message || "Something went wrong")
    } finally {
      setLoading(false)
    }
  }

  // Initialize map
  useEffect(() => {
    if (!containerRef.current || mapRef.current) return

    const map = new maplibregl.Map({
      container: containerRef.current,
      style: getMapStyle(),
      center: KATRAJ_CENTER,
      zoom: 13,
    })

    map.addControl(new maplibregl.NavigationControl())

    mapRef.current = map

    map.on("load", () => {
      // Markers rendered by the businesses useEffect below
    })
  }, [])

  // Render markers when businesses change
  useEffect(() => {
    const map = mapRef.current
    if (!map) return

    markersRef.current.forEach((m) => m.remove())
    markersRef.current = []

    businesses.forEach((biz) => {
      const color = CATEGORY_COLORS[biz.category] || "#10b981"
      const statusColor = STATUS_COLORS[biz.status]

      const el = document.createElement("div")
      el.className = "relative cursor-pointer group"
      el.style.display = "flex"
      el.style.flexDirection = "column"
      el.style.alignItems = "center"

      // Pin
      const pin = document.createElement("div")
      pin.className = "flex items-center justify-center transition-all duration-200"
      pin.style.width = "36px"
      pin.style.height = "36px"
      pin.style.backgroundColor = color
      pin.style.border = "2px solid white"
      pin.style.borderRadius = "50%"
      pin.style.color = "white"
      pin.style.fontWeight = "800"
      pin.style.fontSize = "13px"
      pin.style.boxShadow = "0 2px 10px rgba(0,0,0,0.3)"
      pin.innerHTML = `<span>📍</span>`
      pin.title = biz.name

      // Status dot below pin
      const statusDot = document.createElement("div")
      statusDot.style.width = "10px"
      statusDot.style.height = "10px"
      statusDot.style.backgroundColor = statusColor
      statusDot.style.borderRadius = "50%"
      statusDot.style.border = "2px solid white"
      statusDot.style.marginTop = "2px"
      statusDot.style.boxShadow = "0 1px 4px rgba(0,0,0,0.3)"

      el.appendChild(pin)
      el.appendChild(statusDot)

      pin.onclick = (e) => {
        e.stopPropagation()
        setSelectedBiz(biz)
        map.flyTo({
          center: [biz.longitude, biz.latitude] as [number, number],
          zoom: 16,
          duration: 800,
        })
      }

      const marker = new maplibregl.Marker({ element: el })
        .setLngLat([biz.longitude, biz.latitude])
        .addTo(map)
      markersRef.current.push(marker)
    })
  }, [businesses])

  // Approve/reject business
  async function moderate(id: string, action: "approve" | "reject") {
    try {
      const res = await fetch(`/api/admin/businesses?id=${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action }),
      })
      if (!res.ok) throw new Error("Moderation failed")
      await loadBusinesses()
      setSelectedBiz(null)
    } catch (err: any) {
      setError(err.message || "Moderation failed")
    }
  }

  if (loading) {
    return (
      <div className="text-center py-20">
        <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-navy mx-auto mb-4"></div>
        <p className="text-gray-600">Loading moderation map…</p>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-background">
      <header className="bg-white border-b border-navy/10">
        <div className="max-w-5xl mx-auto px-4 py-4 sm:px-6 lg:px-8">
          <div className="flex items-center gap-3">
            <a href="/admin/dashboard" className="flex items-center gap-2 text-sm text-navy hover:text-blue">
              ← Back to Dashboard
            </a>
          </div>
          <h1 className="text-lg font-bold text-navy mt-2">Moderation Map</h1>
          <p className="text-sm text-gray-600 mt-1">
            Review all business submissions. Colored pins = category, status dot = approval status.
          </p>
        </div>
      </header>

      <div className="flex flex-col lg:flex-row h-[calc(100vh-160px)]">
        {/* Map */}
        <div className="flex-1 h-full relative z-0">
          <div ref={containerRef} className="w-full h-full" />
        </div>

        {/* Selected business panel */}
        {selectedBiz && (
          <div className="w-full lg:w-96 bg-white border-l border-navy/10 p-6 overflow-y-auto h-full">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h2 className="text-lg font-bold text-navy">{selectedBiz.name}</h2>
                <p className="text-sm text-gray-600">
                  {selectedBiz.locality}, Katraj, Pune
                </p>
              </div>
              <button
                onClick={() => setSelectedBiz(null)}
                className="p-2 text-gray-400 hover:text-navy"
              >
                ✕
              </button>
            </div>

            <div className="space-y-4">
              <div>
                <p className="text-xs font-bold uppercase tracking-wider text-navy/50 mb-1">Category</p>
                <p className="text-sm text-gray-600">
                  {selectedBiz.category.replace(/_/g, " ")}
                </p>
              </div>
              <div>
                <p className="text-xs font-bold uppercase tracking-wider text-navy/50 mb-1">Status</p>
                <span
                  className={`px-2 py-0.5 rounded-full text-[10px] font-bold uppercase border ${
                    selectedBiz.status === "pending"
                      ? "bg-blue-50 text-blue-600 border-blue-100"
                      : selectedBiz.status === "approved"
                      ? "bg-green-50 text-green-600 border-green-100"
                      : "bg-red-50 text-red-600 border-red-100"
                  }`}
                >
                  {selectedBiz.status}
                </span>
              </div>
              <div>
                <p className="text-xs font-bold uppercase tracking-wider text-navy/50 mb-1">Location</p>
                <p className="text-sm text-gray-600 font-mono">
                  {selectedBiz.latitude.toFixed(6)}, {selectedBiz.longitude.toFixed(6)}
                </p>
              </div>
              <div>
                <p className="text-xs font-bold uppercase tracking-wider text-navy/50 mb-1">Verified</p>
                <span
                  className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full ${
                    selectedBiz.location_verified
                      ? "bg-green-50 text-green-600"
                      : "bg-gray-50 text-gray-600"
                  } text-[10px] font-bold`}
                >
                  {selectedBiz.location_verified ? "Yes" : "No"}
                </span>
              </div>
            </div>

            <div className="mt-6 pt-4 border-t border-navy/5">
              <p className="text-xs font-bold uppercase tracking-wider text-navy/50 mb-3">Actions</p>
              <div className="space-y-2">
                {selectedBiz.status === "pending" && (
                  <>
                    <button
                      onClick={() => moderate(selectedBiz.id, "approve")}
                      className="w-full px-4 py-2.5 bg-green-500 text-white text-sm font-semibold rounded-xl hover:bg-green-600 transition-colors"
                    >
                      ✅ Approve Listing
                    </button>
                    <button
                      onClick={() => moderate(selectedBiz.id, "reject")}
                      className="w-full px-4 py-2.5 bg-red-500 text-white text-sm font-semibold rounded-xl hover:bg-red-600 transition-colors"
                    >
                      ❌ Reject Listing
                    </button>
                  </>
                )}
                {selectedBiz.status === "approved" && (
                  <button
                    disabled
                    className="w-full px-4 py-2.5 bg-gray-200 text-gray-500 text-sm font-semibold rounded-xl cursor-not-allowed"
                  >
                    Already Approved
                  </button>
                )}
                {selectedBiz.status === "rejected" && (
                  <button
                    onClick={() => moderate(selectedBiz.id, "approve")}
                    className="w-full px-4 py-2.5 bg-blue-500 text-white text-sm font-semibold rounded-xl hover:bg-blue-600 transition-colors"
                  >
                    ♻️ Re-approve Listing
                  </button>
                )}
              </div>
            </div>

            <div className="mt-4">
              <Link
                href={`/business/${selectedBiz.slug}`}
                className="flex items-center gap-2 text-sm text-blue hover:underline font-medium"
              >
                → View Public Profile
              </Link>
            </div>
          </div>
        )}

        {/* Empty state when nothing selected */}
        {!selectedBiz && (
          <div className="w-full lg:w-96 bg-white border-l border-navy/10 p-6 h-full flex flex-col">
            <h2 className="text-lg font-bold text-navy mb-2">Select a business</h2>
            <p className="text-sm text-gray-600 mb-4">
              Click a pin on the map to review and moderate a business listing.
            </p>
            <div className="flex items-center gap-2 mt-2">
              <span className="w-3 h-3 rounded-full bg-blue-500"></span>
              <span className="text-sm text-gray-600">Pending approval</span>
            </div>
            <div className="flex items-center gap-2 mt-1">
              <span className="w-3 h-3 rounded-full bg-green-500"></span>
              <span className="text-sm text-gray-600">Approved</span>
            </div>
            <div className="flex items-center gap-2 mt-1">
              <span className="w-3 h-3 rounded-full bg-red-500"></span>
              <span className="text-sm text-gray-600">Rejected</span>
            </div>
          </div>
        )}
      </div>

      {error && (
        <div className="fixed bottom-4 right-4 z-50 p-4 rounded-lg bg-red-50 text-red-600 border border-red-100 shadow-lg">
          {error}
        </div>
      )}
    </div>
  )
}
