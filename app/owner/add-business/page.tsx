"use client"

import { useEffect, useRef, useState, useCallback } from "react"
import * as maplibregl from "maplibre-gl"
import "maplibre-gl/dist/maplibre-gl.css"
import { useRouter } from "next/navigation"
import { getMapStyle } from "@/lib/maplibre"

const KATRAJ_CENTER = [73.8456, 18.4593] as [number, number]

interface CategoryOption {
  value: string
  label: string
}

const CATEGORIES: CategoryOption[] = [
  { value: "shopping", label: "Shopping" },
  { value: "restaurants", label: "Restaurants" },
  { value: "healthcare", label: "Healthcare" },
  { value: "education", label: "Education" },
  { value: "home_services", label: "Home Services" },
  { value: "automotive", label: "Automotive" },
  { value: "fitness", label: "Fitness" },
  { value: "professional_services", label: "Professional Services" },
]

export default function AddBusinessPage() {
  const router = useRouter()
  const mapRef = useRef<maplibregl.Map | null>(null)
  const containerRef = useRef<HTMLDivElement>(null)
  const markerRef = useRef<maplibregl.Marker | null>(null)
  const [pinCoords, setPinCoords] = useState<{ lat: number; lng: number } | null>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    category: "shopping",
    locality: "",
    address: "",
    phone: "",
    whatsapp: "",
    email: "",
    website: "",
  })

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

    // Click on map to place/move pin
    map.on("click", (e) => {
      const { lng, lat } = e.lngLat
      setPinCoords({ lat, lng })
      updateMarker(map, lng, lat)
    })

    return () => {
      map.remove()
      mapRef.current = null
    }
  }, [])

  function updateMarker(map: maplibregl.Map, lng: number, lat: number) {
    if (markerRef.current) {
      markerRef.current.setLngLat([lng, lat])
    } else {
      const el = document.createElement("div")
      el.className = "w-6 h-6 rounded-full bg-orange border-4 border-white shadow-lg cursor-grab active:cursor-grabbing"
      el.style.position = "relative"
      el.style.top = "-8px"
      el.innerHTML = `<span style="position:absolute; top:100%; left:50%; transform:translateX(-50%); width:0; height:0; border-left:6px solid transparent; border-right:6px solid transparent; border-top:8px solid orange;"></span>`
      markerRef.current = new maplibregl.Marker({ element: el, draggable: true })
        .setLngLat([lng, lat])
        .addTo(map)

      markerRef.current.on("dragend", () => {
        const pos = markerRef.current!.getLngLat()
        setPinCoords({ lat: pos.lat, lng: pos.lng })
      })
    }
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (!pinCoords) {
      setError("Please place your business pin on the map.")
      return
    }

    setLoading(true)
    setError("")

    try {
      const res = await fetch("/api/owner/submit", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...formData,
          latitude: pinCoords.lat,
          longitude: pinCoords.lng,
        }),
      })

      if (!res.ok) {
        const err = await res.json()
        setError(err.error || "Submission failed")
        setLoading(false)
        return
      }

      // Open Razorpay payment gateway
      window.open("https://rzp.io/rzp/g0GBqkap", "_blank", "noopener,noreferrer")
      router.push("/owner/dashboard?submitted=1")
    } catch (err: any) {
      setError(err.message || "Something went wrong")
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-background">
      <header className="bg-white border-b border-navy/10">
        <div className="max-w-5xl mx-auto px-4 py-4 sm:px-6 lg:px-8">
          <div className="flex items-center gap-3">
            <a href="/" className="flex items-center gap-2">
              <span className="text-[10px] font-bold tracking-widest text-navy/60 uppercase">katrajpune</span>
              <span className="w-1 h-1 rounded-full bg-orange"></span>
            </a>
            <h1 className="text-xl font-bold text-navy">Add Your Business</h1>
          </div>
          <p className="text-sm text-gray-600 mt-1">Place your business pin on the map, then submit for approval.</p>
        </div>
      </header>

      <div className="flex flex-col lg:flex-row h-[calc(100vh-64px)]">
        {/* Map - takes up most of the screen */}
        <div className="flex-1 h-full relative z-0">
          <div ref={containerRef} className="w-full h-full" />
        </div>

        {/* Pin coordinates display */}
        {pinCoords && (
          <div className="absolute top-4 right-4 z-10 bg-white rounded-xl shadow-md border border-navy/10 p-4 w-64">
            <div className="flex items-center gap-2 mb-2">
              <span className="w-2 h-2 rounded-full bg-orange"></span>
              <span className="text-sm font-bold text-navy">Pin Location</span>
            </div>
            <div className="text-sm text-gray-600 space-y-1">
              <div className="flex justify-between">
                <span>Latitude</span>
                <span className="font-mono">{pinCoords.lat.toFixed(6)}</span>
              </div>
              <div className="flex justify-between">
                <span>Longitude</span>
                <span className="font-mono">{pinCoords.lng.toFixed(6)}</span>
              </div>
            </div>
            <p className="text-xs text-gray-500 mt-3">Click anywhere on the map to place or move your pin.</p>
          </div>
        )}

        {/* Form sidebar */}
        <div className="w-full lg:w-96 bg-white border-l border-navy/10 p-6 overflow-y-auto h-full">
          <h2 className="text-lg font-bold text-navy mb-6">Business Details</h2>

          {error && (
            <div className="mb-4 p-3 rounded-lg bg-red-50 text-red-600 text-sm border border-red-100">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label className="block text-sm font-medium text-navy mb-1">Business name *</label>
              <input
                type="text"
                name="name"
                required
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                className="w-full px-4 py-2.5 rounded-lg border border-navy/10 bg-white text-navy focus:outline-none focus:ring-2 focus:ring-navy transition-all"
                placeholder="e.g. Katraj Mart"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-navy mb-1">Category *</label>
              <select
                value={formData.category}
                onChange={(e) => setFormData({ ...formData, category: e.target.value as any })}
                className="w-full px-4 py-2.5 rounded-lg border border-navy/10 bg-white text-navy focus:outline-none focus:ring-2 focus:ring-navy transition-all"
              >
                {CATEGORIES.map((cat) => (
                  <option key={cat.value} value={cat.value}>
                    {cat.label}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-navy mb-1">Description</label>
              <textarea
                name="description"
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                rows={3}
                className="w-full px-4 py-2.5 rounded-lg border border-navy/10 bg-white text-navy focus:outline-none focus:ring-2 focus:ring-navy transition-all"
                placeholder="Tell customers about your business…"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-navy mb-1">Locality</label>
              <input
                type="text"
                name="locality"
                value={formData.locality}
                onChange={(e) => setFormData({ ...formData, locality: e.target.value })}
                className="w-full px-4 py-2.5 rounded-lg border border-navy/10 bg-white text-navy focus:outline-none focus:ring-2 focus:ring-navy transition-all"
                placeholder="e.g. Katraj, Pune"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-navy mb-1">Address</label>
              <input
                type="text"
                name="address"
                value={formData.address}
                onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                className="w-full px-4 py-2.5 rounded-lg border border-navy/10 bg-white text-navy focus:outline-none focus:ring-2 focus:ring-navy transition-all"
                placeholder="Street address, landmark…"
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-navy mb-1">Phone</label>
                <input
                  type="tel"
                  name="phone"
                  value={formData.phone}
                  onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                  className="w-full px-4 py-2.5 rounded-lg border border-navy/10 bg-white text-navy focus:outline-none focus:ring-2 focus:ring-navy transition-all"
                  placeholder="+91 98765 43210"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-navy mb-1">WhatsApp</label>
                <input
                  type="tel"
                  name="whatsapp"
                  value={formData.whatsapp}
                  onChange={(e) => setFormData({ ...formData, whatsapp: e.target.value })}
                  className="w-full px-4 py-2.5 rounded-lg border border-navy/10 bg-white text-navy focus:outline-none focus:ring-2 focus:ring-navy transition-all"
                  placeholder="+91 98765 43210"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-navy mb-1">Email</label>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  className="w-full px-4 py-2.5 rounded-lg border border-navy/10 bg-white text-navy focus:outline-none focus:ring-2 focus:ring-navy transition-all"
                  placeholder="contact@business.com"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-navy mb-1">Website</label>
                <input
                  type="url"
                  name="website"
                  value={formData.website}
                  onChange={(e) => setFormData({ ...formData, website: e.target.value })}
                  className="w-full px-4 py-2.5 rounded-lg border border-navy/10 bg-white text-navy focus:outline-none focus:ring-2 focus:ring-navy transition-all"
                  placeholder="https://example.com"
                />
              </div>
            </div>

            <div className="pt-4 border-t border-navy/5 space-y-3">
              <div className="p-3 bg-orange/5 border border-orange/20 rounded-xl space-y-1">
                <div className="flex justify-between items-center text-xs">
                  <span className="font-semibold text-navy">Listing Fee (Lifetime)</span>
                  <span className="font-bold text-orange text-sm">₹350/-</span>
                </div>
                <p className="text-[11px] text-gray-500">
                  Includes interactive map pin, directory listing, and direct WhatsApp lead button.
                </p>
              </div>

              <button
                type="submit"
                disabled={loading || !pinCoords}
                className="w-full px-4 py-3 bg-gradient-to-r from-orange to-amber-500 hover:from-orange/90 hover:to-amber-500/90 text-white text-sm font-extrabold rounded-xl shadow-md transition-all disabled:opacity-60 disabled:cursor-not-allowed"
              >
                {loading ? "Submitting…" : "Pay ₹350 & Submit Listing"}
              </button>

              <div className="text-center">
                <a
                  href="https://rzp.io/rzp/g0GBqkap"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-xs text-emerald-700 font-bold hover:underline inline-flex items-center gap-1"
                >
                  <span>Pay directly via Razorpay checkout ↗</span>
                </a>
              </div>
            </div>
          </form>
        </div>
      </div>
    </div>
  )
}
