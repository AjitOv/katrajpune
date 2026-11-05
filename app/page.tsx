"use client"

import { useEffect, useState, useCallback, useRef, Suspense } from "react"
import { useSearchParams } from "next/navigation"
import MapContainer from "@/components/map/MapContainer"
import SearchBar from "@/components/search/SearchBar"
import { BUSINESS_CATEGORIES } from "@/lib/maplibre"
import BusinessCard from "@/components/map/BusinessCard"
import { Business } from "@/types/business"
import LocalityFilter from "@/components/search/LocalityFilter"
import DirectoryGrid from "@/components/directory/DirectoryGrid"

const KATRAJ_CENTER = [73.8456, 18.4593] as [number, number]

const CATEGORY_EMOJIS: Record<string, string> = {
  all: "🏙️",
  shopping: "🛒",
  restaurants: "🍴",
  healthcare: "🏥",
  education: "🎓",
  home_services: "🔧",
  automotive: "🚗",
  fitness: "💪",
  professional_services: "💼",
}

function MapPage() {
  const searchParams = useSearchParams()
  const [viewMode, setViewMode] = useState<"map" | "grid">(
    searchParams.get("view") === "grid" ? "grid" : "map"
  )
  const [selectedBusiness, setSelectedBusiness] = useState<Business | null>(null)
  const [activeCategory, setActiveCategory] = useState<string>("all")
  const [activeLocality, setActiveLocality] = useState<string | null>(null)
  const [searchQuery, setSearchQuery] = useState("")
  const [searchResults, setSearchResults] = useState<Business[]>([])
  const [isSearching, setIsSearching] = useState(false)
  const [showSearchResults, setShowSearchResults] = useState(false)
  const [showMobileCategories, setShowMobileCategories] = useState(false)
  const [allBusinesses, setAllBusinesses] = useState<Business[]>([])
  const searchTimer = useRef<ReturnType<typeof setTimeout> | null>(null)

  // Load all 1000 businesses for the directory grid
  useEffect(() => {
    fetch("/api/businesses/all")
      .then((res) => res.json())
      .then((data) => {
        if (Array.isArray(data)) setAllBusinesses(data)
      })
      .catch((err) => console.error("Failed to load directory businesses:", err))
  }, [])

  // Handle ?focus=slug&lat=...&lng=... param (from business profile "View on Map")
  useEffect(() => {
    const lat = searchParams.get("lat")
    const lng = searchParams.get("lng")
    if (lat && lng && typeof window !== "undefined") {
      setViewMode("map")
      const timer = setTimeout(() => {
        const map = (window as any).__katrajpuneMap
        if (map?.flyTo) {
          map.flyTo(parseFloat(lng), parseFloat(lat), 17)
        }
      }, 1200) // wait for map to load
      return () => clearTimeout(timer)
    }
  }, [searchParams])

  const handleMarkerClick = useCallback((business: Business) => {
    setSelectedBusiness(business)
    if (typeof window !== "undefined" && (window as any).__katrajpuneMap?.flyToBusiness) {
      ;(window as any).__katrajpuneMap.flyToBusiness(business)
    }
    setShowSearchResults(false)
  }, [])

  const handleCloseCard = useCallback(() => {
    setSelectedBusiness(null)
  }, [])

  const handleResetMap = useCallback(() => {
    if (typeof window !== "undefined" && (window as any).__katrajpuneMap?.resetToKatraj) {
      ;(window as any).__katrajpuneMap.resetToKatraj()
    }
    setActiveLocality(null)
    setSearchQuery("")
    setSearchResults([])
    setShowSearchResults(false)
    setSelectedBusiness(null)
  }, [])

  const handleMyLocation = useCallback(() => {
    if (!navigator.geolocation || typeof window === "undefined") return
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        const { latitude, longitude } = pos.coords
        const map = (window as any).__katrajpuneMap
        if (map?.flyTo) {
          map.flyTo(longitude, latitude, 16)
        }
      },
      () => {}
    )
  }, [])

  // Debounced search for map view
  useEffect(() => {
    if (searchTimer.current) clearTimeout(searchTimer.current)

    if (!searchQuery.trim()) {
      setSearchResults([])
      setIsSearching(false)
      setShowSearchResults(false)
      return
    }

    setIsSearching(true)
    searchTimer.current = setTimeout(async () => {
      try {
        const params = new URLSearchParams({ q: searchQuery, limit: "20" })
        if (activeCategory && activeCategory !== "all") params.set("category", activeCategory)
        if (activeLocality) params.set("locality", activeLocality)

        const res = await fetch(`/api/businesses/search?${params}`)
        const data = await res.json()
        setSearchResults(Array.isArray(data) ? data : [])
        setShowSearchResults(Array.isArray(data) && data.length > 0)
      } catch (err) {
        console.error("Search failed:", err)
        setSearchResults([])
        setShowSearchResults(false)
      } finally {
        setIsSearching(false)
      }
    }, 300)

    return () => {
      if (searchTimer.current) clearTimeout(searchTimer.current)
    }
  }, [searchQuery, activeCategory, activeLocality])

  const handleSearchResultClick = useCallback((business: Business) => {
    setSelectedBusiness(business)
    setShowSearchResults(false)
    setSearchQuery("")
    setSearchResults([])
    if (typeof window !== "undefined" && (window as any).__katrajpuneMap?.flyToBusiness) {
      ;(window as any).__katrajpuneMap.flyToBusiness(business)
    }
  }, [])

  const handleLocalityChange = useCallback((locality: string | null) => {
    setActiveLocality(locality)
    if (locality) {
      setShowSearchResults(false)
      setSearchQuery("")
      setSearchResults([])
    }
  }, [])

  const handleCategorySelect = useCallback((cat: string) => {
    setActiveCategory(cat)
    setShowMobileCategories(false)
  }, [])

  const handleViewOnMapFromGrid = useCallback(
    (business: Business) => {
      setViewMode("map")
      handleMarkerClick(business)
    },
    [handleMarkerClick]
  )

  return (
    <div
      className="relative w-full h-[calc(100vh-42px)] overflow-hidden bg-background"
      style={{ position: "relative", width: "100%", height: "calc(100vh - 42px)", overflow: "hidden" }}
    >
      {/* View Mode: MAP */}
      <div
        style={{
          position: "absolute",
          inset: 0,
          display: viewMode === "map" ? "block" : "none",
          zIndex: 1,
        }}
      >
        <MapContainer
          initialCenter={KATRAJ_CENTER}
          initialZoom={13}
          activeCategory={activeCategory === "all" ? null : activeCategory}
          onMarkerClick={handleMarkerClick}
        />
      </div>

      {/* View Mode: GRID */}
      {viewMode === "grid" && (
        <div
          className="absolute inset-0 pt-28 pb-8 overflow-y-auto bg-background"
          style={{ position: "absolute", inset: 0, paddingTop: "112px", zIndex: 10, overflowY: "auto" }}
        >
          <div className="max-w-7xl mx-auto px-4 mb-3">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2">
              <div>
                <h1 className="text-2xl font-black text-navy">Katraj Business Directory</h1>
                <p className="text-xs text-gray-500">
                  Browsing 1,000+ local businesses across Katraj, Pune with ratings, WhatsApp & photos
                </p>
              </div>
              <button
                onClick={() => setViewMode("map")}
                className="flex items-center gap-1.5 px-4 py-2 bg-navy text-white text-xs font-bold rounded-xl shadow-sm hover:bg-blue transition-colors"
              >
                <span>🗺️</span> Switch to Full Map
              </button>
            </div>
          </div>
          <DirectoryGrid
            businesses={allBusinesses}
            initialCategory={activeCategory}
            initialLocality={activeLocality}
            onViewOnMap={handleViewOnMapFromGrid}
          />
        </div>
      )}

      {/* Floating Header (Shared across both modes) */}
      <div
        className="absolute top-0 left-0 w-full p-3 z-40 pointer-events-none"
        style={{
          position: "absolute",
          top: 0,
          left: 0,
          width: "100%",
          padding: "12px",
          zIndex: 40,
          pointerEvents: "none",
        }}
      >
        <div
          className="flex flex-col gap-2 pointer-events-auto max-w-7xl mx-auto"
          style={{ pointerEvents: "auto" }}
        >
          {/* Top row: Logo + View Mode Switcher + Desktop Category Chips + Add Business */}
          <div className="flex items-center justify-between gap-3">
            {/* Logo */}
            <div className="flex items-center gap-2 px-3.5 py-2 bg-white/95 backdrop-blur-md rounded-full border border-black/5 shadow-md flex-shrink-0">
              <span className="text-base">📍</span>
              <div className="flex items-center gap-1.5">
                <span className="text-[10px] font-black tracking-widest text-navy/60 uppercase">katraj</span>
                <span className="w-1 h-1 rounded-full bg-orange" />
                <span className="text-sm font-bold text-navy">pune</span>
              </div>
            </div>

            {/* View Mode Switcher: Map vs Grid */}
            <div className="flex items-center bg-white/95 backdrop-blur-md rounded-full p-1 border border-black/5 shadow-md flex-shrink-0">
              <button
                onClick={() => setViewMode("map")}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-bold transition-all ${
                  viewMode === "map"
                    ? "bg-navy text-white shadow-sm"
                    : "text-navy/70 hover:text-navy hover:bg-navy/5"
                }`}
              >
                <span>🗺️</span>
                <span>Map</span>
              </button>
              <button
                onClick={() => setViewMode("grid")}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-bold transition-all ${
                  viewMode === "grid"
                    ? "bg-navy text-white shadow-sm"
                    : "text-navy/70 hover:text-navy hover:bg-navy/5"
                }`}
              >
                <span>📋</span>
                <span>Grid (1000+)</span>
              </button>
            </div>

            {/* Desktop category chips (in map mode) */}
            {viewMode === "map" && (
              <div className="hidden xl:flex items-center gap-1 bg-white/95 backdrop-blur-md rounded-full px-2 py-1.5 border border-black/5 shadow-md overflow-x-auto max-w-2xl">
                {BUSINESS_CATEGORIES.map((cat) => (
                  <button
                    key={cat.value}
                    onClick={() => handleCategorySelect(cat.value)}
                    className={`flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold transition-all whitespace-nowrap ${
                      activeCategory === cat.value
                        ? "bg-navy text-white shadow-sm"
                        : "text-navy/70 hover:bg-navy/5"
                    }`}
                  >
                    <span>{CATEGORY_EMOJIS[cat.value]}</span>
                    <span>{cat.label}</span>
                  </button>
                ))}
              </div>
            )}

            {/* Actions & Deals CTAs */}
            <div className="flex items-center gap-2 flex-shrink-0">
              <a
                href="/deals"
                className="flex items-center gap-1 px-3 py-2 bg-amber-50 hover:bg-amber-100 text-amber-900 border border-amber-300/70 text-xs font-bold rounded-full shadow-sm transition-colors"
              >
                <span>🛍️</span> Deals
              </a>
              <a
                href="/claim"
                className="hidden lg:flex items-center gap-1.5 px-3 py-2 bg-white/95 text-navy text-xs font-bold rounded-full border border-black/5 shadow-md hover:bg-navy/5 transition-colors"
              >
                <span>🛡️</span> Claim (₹350)
              </a>
              <a
                href="/add-business"
                className="hidden md:flex items-center gap-1.5 px-3.5 py-2 bg-orange text-white text-xs font-bold rounded-full shadow-md hover:opacity-90 transition-opacity"
              >
                <span>+</span> Add Business (₹350)
              </a>
            </div>
          </div>

          {/* Search bar & locality filter (when in map view) */}
          {viewMode === "map" && (
            <div className="flex items-center gap-2">
              <div className="relative flex-1 max-w-lg">
                <div className="absolute left-3 top-1/2 -translate-y-1/2 text-navy/40">
                  🔍
                </div>
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search 1,000+ businesses in Katraj..."
                  className="w-full pl-9 pr-10 py-2.5 rounded-full bg-white/95 backdrop-blur-md border border-black/5 text-navy text-sm placeholder-navy/40 focus:outline-none focus:ring-2 shadow-md transition-all"
                  style={{ "--tw-ring-color": "#10243A" } as any}
                />
                {isSearching && (
                  <span className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-navy/40 animate-spin">
                    ⟳
                  </span>
                )}
                {searchQuery && !isSearching && (
                  <button
                    onClick={() => {
                      setSearchQuery("")
                      setShowSearchResults(false)
                    }}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-navy/40 hover:text-navy"
                  >
                    ✕
                  </button>
                )}
              </div>

              <LocalityFilter value={activeLocality} onChange={handleLocalityChange} />

              {/* Mobile category toggle */}
              <button
                onClick={() => setShowMobileCategories((v) => !v)}
                className="xl:hidden flex items-center gap-1 px-3 py-2.5 bg-white/95 backdrop-blur-md rounded-full border border-black/5 shadow-md text-sm font-medium text-navy"
              >
                {CATEGORY_EMOJIS[activeCategory] || "🏙️"}
                <span className="text-xs">▾</span>
              </button>
            </div>
          )}

          {/* Mobile category drawer */}
          {viewMode === "map" && showMobileCategories && (
            <div className="xl:hidden flex flex-wrap gap-1.5 bg-white/95 backdrop-blur-md rounded-2xl p-3 border border-black/5 shadow-md">
              {BUSINESS_CATEGORIES.map((cat) => (
                <button
                  key={cat.value}
                  onClick={() => handleCategorySelect(cat.value)}
                  className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold transition-all ${
                    activeCategory === cat.value
                      ? "bg-navy text-white"
                      : "bg-gray-100 text-navy/70 hover:bg-gray-200"
                  }`}
                >
                  {CATEGORY_EMOJIS[cat.value]} {cat.label}
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Search results dropdown (Map Mode) */}
        {viewMode === "map" && showSearchResults && searchResults.length > 0 && (
          <div
            className="absolute top-28 left-3 z-50 w-full max-w-md bg-white rounded-2xl shadow-2xl border border-black/5 overflow-hidden"
            style={{ maxHeight: "60vh" }}
          >
            <div className="px-4 py-3 border-b border-navy/5 bg-gray-50 flex items-center justify-between">
              <span className="text-xs font-bold text-navy/50 uppercase tracking-wider">
                {searchResults.length} result{searchResults.length !== 1 ? "s" : ""}
              </span>
              <button
                onClick={() => setShowSearchResults(false)}
                className="text-navy/40 hover:text-navy text-xs"
              >
                ✕ Close
              </button>
            </div>
            <div className="overflow-y-auto" style={{ maxHeight: "calc(60vh - 48px)" }}>
              {searchResults.map((biz) => (
                <button
                  key={biz.id || biz.slug}
                  onClick={() => handleSearchResultClick(biz)}
                  className="w-full flex items-center gap-3 px-4 py-3 text-left hover:bg-gray-50 border-b border-navy/5 transition-colors"
                >
                  <div
                    className="w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0 text-base"
                    style={{ backgroundColor: "#10243A20" }}
                  >
                    {CATEGORY_EMOJIS[biz.category] || "📍"}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="text-sm font-semibold text-navy truncate">{biz.name}</div>
                    <div className="text-xs text-gray-400 truncate">
                      {biz.locality && `${biz.locality} · `}{biz.category.replace(/_/g, " ")}
                    </div>
                  </div>
                  {biz.rating && (
                    <span className="text-xs font-bold text-amber-600 bg-amber-50 px-1.5 py-0.5 rounded">
                      ★ {biz.rating.toFixed(1)}
                    </span>
                  )}
                </button>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Map controls — bottom left (when in map view) */}
      {viewMode === "map" && (
        <div className="absolute left-3 bottom-6 z-40 flex flex-col gap-2 pointer-events-auto">
          <button
            onClick={handleResetMap}
            className="w-10 h-10 rounded-xl bg-white shadow-md flex items-center justify-center text-navy hover:bg-navy hover:text-white transition-colors text-lg border border-black/5"
            title="Reset to Katraj"
            aria-label="Reset map to Katraj"
          >
            ↺
          </button>
          <button
            onClick={handleMyLocation}
            className="w-10 h-10 rounded-xl bg-white shadow-md flex items-center justify-center hover:bg-navy hover:text-white transition-colors text-base border border-black/5"
            title="My location"
            aria-label="Go to my location"
          >
            📍
          </button>
        </div>
      )}

      {/* Active filter indicator (when in map view) */}
      {viewMode === "map" && (activeCategory !== "all" || activeLocality) && (
        <div className="absolute bottom-6 right-3 z-40 flex items-center gap-2 pointer-events-auto">
          <div className="flex items-center gap-1.5 px-3 py-2 bg-navy text-white text-xs font-semibold rounded-full shadow-md">
            {activeCategory !== "all" && (
              <span>
                {CATEGORY_EMOJIS[activeCategory]}{" "}
                {BUSINESS_CATEGORIES.find((c) => c.value === activeCategory)?.label}
              </span>
            )}
            {activeLocality && <span>· {activeLocality}</span>}
            <button
              onClick={() => {
                setActiveCategory("all")
                setActiveLocality(null)
              }}
              className="ml-1 opacity-70 hover:opacity-100"
              aria-label="Clear filters"
            >
              ✕
            </button>
          </div>
        </div>
      )}

      {/* Business info card (in map view) */}
      {viewMode === "map" && selectedBusiness && (
        <BusinessCard business={selectedBusiness} onClose={handleCloseCard} />
      )}
    </div>
  )
}

export default function Page() {
  return (
    <Suspense>
      <MapPage />
    </Suspense>
  )
}
