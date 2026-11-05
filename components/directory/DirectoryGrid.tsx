"use client"

import { useState, useMemo, Fragment } from "react"
import Link from "next/link"
import { Business } from "@/types/business"
import { BUSINESS_CATEGORIES } from "@/lib/maplibre"
import DhanDematBanner from "@/components/ads/DhanDematBanner"

interface DirectoryGridProps {
  businesses: Business[]
  initialCategory?: string
  initialLocality?: string | null
  onViewOnMap?: (business: Business) => void
}

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

const CATEGORY_COLORS: Record<string, string> = {
  shopping: "#F59E0B",
  restaurants: "#EF4444",
  healthcare: "#10B981",
  education: "#3B82F6",
  home_services: "#8B5CF6",
  automotive: "#6B7280",
  fitness: "#EC4899",
  professional_services: "#14B8A6",
}

export default function DirectoryGrid({
  businesses,
  initialCategory = "all",
  initialLocality = null,
  onViewOnMap,
}: DirectoryGridProps) {
  const [searchQuery, setSearchQuery] = useState("")
  const [selectedCategory, setSelectedCategory] = useState<string>(initialCategory)
  const [selectedLocality, setSelectedLocality] = useState<string>(initialLocality || "all")
  const [sortBy, setSortBy] = useState<"rating" | "reviews" | "name">("rating")
  const [visibleCount, setVisibleCount] = useState<number>(24)

  // Unique localities list
  const localities = useMemo(() => {
    const set = new Set<string>()
    for (const b of businesses) {
      if (b.locality) set.add(b.locality)
    }
    return Array.from(set).sort()
  }, [businesses])

  // Filter and sort businesses
  const filteredBusinesses = useMemo(() => {
    const q = searchQuery.toLowerCase().trim()
    return businesses
      .filter((b) => {
        const matchCategory =
          selectedCategory === "all" || b.category === selectedCategory
        const matchLocality =
          selectedLocality === "all" || b.locality === selectedLocality
        const matchQuery =
          !q ||
          b.name.toLowerCase().includes(q) ||
          b.category.toLowerCase().includes(q) ||
          (b.locality && b.locality.toLowerCase().includes(q)) ||
          (b.address && b.address.toLowerCase().includes(q)) ||
          (b.description && b.description.toLowerCase().includes(q))
        return matchCategory && matchLocality && matchQuery
      })
      .sort((a, b) => {
        if (sortBy === "rating") {
          const rA = a.rating ?? 0
          const rB = b.rating ?? 0
          if (rB !== rA) return rB - rA
          return (b.reviews_count ?? 0) - (a.reviews_count ?? 0)
        }
        if (sortBy === "reviews") {
          return (b.reviews_count ?? 0) - (a.reviews_count ?? 0)
        }
        return a.name.localeCompare(b.name)
      })
  }, [businesses, searchQuery, selectedCategory, selectedLocality, sortBy])

  const visibleBusinesses = useMemo(() => {
    return filteredBusinesses.slice(0, visibleCount)
  }, [filteredBusinesses, visibleCount])

  const handleLoadMore = () => {
    setVisibleCount((prev) => prev + 24)
  }

  return (
    <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
      {/* Search & Filter Controls */}
      <div className="bg-white rounded-2xl shadow-sm border border-navy/10 p-4 sm:p-6 mb-8 space-y-4">
        {/* Top search & sorting bar */}
        <div className="flex flex-col md:flex-row gap-3 items-stretch md:items-center justify-between">
          <div className="relative flex-1">
            <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400 text-sm">
              🔍
            </span>
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => {
                setSearchQuery(e.target.value)
                setVisibleCount(24)
              }}
              placeholder="Search 1,000+ Katraj businesses (e.g. Biryani, Gym, Dental, Ambegaon)..."
              className="w-full pl-10 pr-10 py-3 rounded-xl bg-gray-50 border border-gray-200 text-navy text-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-navy focus:bg-white transition-all"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery("")}
                className="absolute right-3.5 top-1/2 -translate-y-1/2 text-gray-400 hover:text-navy text-sm"
              >
                ✕
              </button>
            )}
          </div>

          <div className="flex items-center gap-3">
            {/* Locality Dropdown */}
            <select
              value={selectedLocality}
              onChange={(e) => {
                setSelectedLocality(e.target.value)
                setVisibleCount(24)
              }}
              aria-label="Filter by locality in Katraj"
              className="px-3.5 py-3 rounded-xl bg-gray-50 border border-gray-200 text-navy text-sm font-medium focus:outline-none focus:ring-2 focus:ring-navy cursor-pointer"
            >
              <option value="all">📍 All Localities ({localities.length})</option>
              {localities.map((loc) => (
                <option key={loc} value={loc}>
                  {loc}
                </option>
              ))}
            </select>

            {/* Sort Dropdown */}
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as any)}
              aria-label="Sort businesses"
              className="px-3.5 py-3 rounded-xl bg-gray-50 border border-gray-200 text-navy text-sm font-medium focus:outline-none focus:ring-2 focus:ring-navy cursor-pointer"
            >
              <option value="rating">⭐ Highest Rated</option>
              <option value="reviews">💬 Most Reviewed</option>
              <option value="name">🔤 Name (A-Z)</option>
            </select>
          </div>
        </div>

        {/* Category Chips */}
        <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-thin">
          <button
            onClick={() => {
              setSelectedCategory("all")
              setVisibleCount(24)
            }}
            className={`flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-bold transition-all whitespace-nowrap ${
              selectedCategory === "all"
                ? "bg-navy text-white shadow-sm"
                : "bg-gray-100 text-gray-700 hover:bg-gray-200"
            }`}
          >
            <span>🏙️</span>
            <span>All Categories ({businesses.length})</span>
          </button>
          {BUSINESS_CATEGORIES.map((cat) => (
            <button
              key={cat.value}
              onClick={() => {
                setSelectedCategory(cat.value)
                setVisibleCount(24)
              }}
              className={`flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-bold transition-all whitespace-nowrap ${
                selectedCategory === cat.value
                  ? "bg-navy text-white shadow-sm"
                  : "bg-gray-100 text-gray-700 hover:bg-gray-200"
              }`}
            >
              <span>{CATEGORY_EMOJIS[cat.value]}</span>
              <span>{cat.label}</span>
            </button>
          ))}
        </div>

        {/* Result summary */}
        <div className="flex items-center justify-between text-xs text-gray-500 pt-2 border-t border-gray-100">
          <span>
            Showing <strong className="text-navy">{visibleBusinesses.length}</strong> of{" "}
            <strong className="text-navy">{filteredBusinesses.length}</strong> matching businesses in Katraj
          </span>
          {(searchQuery || selectedCategory !== "all" || selectedLocality !== "all") && (
            <button
              onClick={() => {
                setSearchQuery("")
                setSelectedCategory("all")
                setSelectedLocality("all")
                setVisibleCount(24)
              }}
              className="text-orange font-bold hover:underline"
            >
              Reset Filters
            </button>
          )}
        </div>
      </div>

      {/* Directory Grid */}
      {visibleBusinesses.length === 0 ? (
        <div className="bg-white rounded-2xl border border-navy/10 p-12 text-center my-8">
          <span className="text-5xl mb-4 block">🔍</span>
          <h3 className="text-lg font-bold text-navy mb-1">No businesses found</h3>
          <p className="text-sm text-gray-500 mb-4">
            Try adjusting your search terms, locality, or category filter.
          </p>
          <button
            onClick={() => {
              setSearchQuery("")
              setSelectedCategory("all")
              setSelectedLocality("all")
            }}
            className="px-4 py-2 bg-navy text-white text-sm font-semibold rounded-xl hover:bg-blue transition-colors"
          >
            Clear All Filters
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {visibleBusinesses.map((biz, index) => {
            const photoUrl =
              biz.logo_url || (biz.photos && biz.photos.length > 0 ? biz.photos[0] : null)
            const catColor = CATEGORY_COLORS[biz.category] || "#10243A"
            const emoji = CATEGORY_EMOJIS[biz.category] || "📍"

            return (
              <Fragment key={biz.slug}>
                {index === 3 && (
                  <div className="col-span-1">
                    <DhanDematBanner variant="card" className="h-full" />
                  </div>
                )}
                <div
                  className="bg-white rounded-2xl border border-navy/10 shadow-sm hover:shadow-lg transition-all overflow-hidden flex flex-col group"
                >
                {/* Photo & badges container */}
                <div className="relative h-44 overflow-hidden bg-gray-100">
                  {photoUrl ? (
                    <img
                      src={photoUrl}
                      alt={biz.name}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                  ) : (
                    <div
                      className="w-full h-full flex items-center justify-center"
                      style={{
                        background: `linear-gradient(135deg, #10243A 0%, ${catColor} 100%)`,
                      }}
                    >
                      <span className="text-5xl">{emoji}</span>
                    </div>
                  )}

                  {/* Gradient overlay */}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent pointer-events-none" />

                  {/* Category chip */}
                  <div className="absolute top-3 left-3">
                    <span
                      className="px-2.5 py-1 rounded-full text-[11px] font-bold uppercase tracking-wider backdrop-blur-md"
                      style={{
                        backgroundColor: "rgba(255, 255, 255, 0.9)",
                        color: catColor,
                      }}
                    >
                      {biz.category.replace(/_/g, " ")}
                    </span>
                  </div>

                  {/* Rating badge */}
                  {biz.rating && (
                    <div className="absolute top-3 right-3">
                      <span className="flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-bold bg-amber-500 text-white shadow-sm">
                        ★ {biz.rating.toFixed(1)}
                      </span>
                    </div>
                  )}

                  {/* Locality badge on image */}
                  {biz.locality && (
                    <div className="absolute bottom-3 left-3 text-white text-xs font-semibold drop-shadow-md">
                      📍 {biz.locality}, Katraj
                    </div>
                  )}
                </div>

                {/* Card Body */}
                <div className="p-4 flex-1 flex flex-col justify-between">
                  <div>
                    <div className="flex items-start justify-between gap-2 mb-1.5">
                      <Link
                        href={`/business/${biz.slug}`}
                        className="text-base font-bold text-navy hover:text-blue transition-colors line-clamp-1"
                      >
                        {biz.name}
                      </Link>
                      {biz.location_verified && (
                        <span
                          className="w-2 h-2 rounded-full bg-green-500 mt-1.5 shrink-0"
                          title="Verified Location"
                        />
                      )}
                    </div>

                    {biz.address && (
                      <p className="text-xs text-gray-500 line-clamp-2 leading-relaxed mb-3">
                        {biz.address}
                      </p>
                    )}

                    {biz.description && (
                      <p className="text-xs text-gray-600 line-clamp-2 leading-snug mb-3">
                        {biz.description}
                      </p>
                    )}
                  </div>

                  {/* Action buttons */}
                  <div className="pt-3 border-t border-gray-100 space-y-2">
                    <div className="flex items-center gap-2">
                      {biz.whatsapp ? (
                        <a
                          href={`https://wa.me/${biz.whatsapp.replace(/\D/g, "")}?text=${encodeURIComponent(
                            `Hello ${biz.name}, I found your business on KatrajPune.com!`
                          )}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="flex-1 py-2 px-3 bg-green-500 hover:bg-green-600 text-white text-xs font-bold rounded-xl text-center flex items-center justify-center gap-1.5 transition-colors shadow-sm"
                        >
                          <span>💬</span> WhatsApp
                        </a>
                      ) : null}

                      {biz.phone ? (
                        <a
                          href={`tel:${biz.phone}`}
                          className="flex-1 py-2 px-3 bg-navy hover:bg-blue text-white text-xs font-bold rounded-xl text-center flex items-center justify-center gap-1.5 transition-colors shadow-sm"
                        >
                          <span>📞</span> Call
                        </a>
                      ) : null}
                    </div>

                    <div className="flex items-center gap-2">
                      {onViewOnMap ? (
                        <button
                          onClick={() => onViewOnMap(biz)}
                          className="flex-1 py-1.5 px-2 bg-orange/10 hover:bg-orange/20 text-orange text-xs font-bold rounded-lg text-center transition-colors"
                        >
                          🗺️ View on Map
                        </button>
                      ) : (
                        <Link
                          href={`/?focus=${biz.slug}&lat=${biz.latitude}&lng=${biz.longitude}`}
                          className="flex-1 py-1.5 px-2 bg-orange/10 hover:bg-orange/20 text-orange text-xs font-bold rounded-lg text-center transition-colors"
                        >
                          🗺️ View on Map
                        </Link>
                      )}

                      <Link
                        href={`/business/${biz.slug}`}
                        className="flex-1 py-1.5 px-2 bg-gray-100 hover:bg-gray-200 text-navy text-xs font-bold rounded-lg text-center transition-colors"
                      >
                        Profile →
                      </Link>
                    </div>

                    <div className="pt-1 text-center">
                      <Link
                        href={`/claim?slug=${biz.slug}`}
                        className="text-[10px] text-gray-400 hover:text-orange font-medium transition-colors"
                      >
                        Own this business? Claim for ₹350 →
                      </Link>
                    </div>
                  </div>
                </div>
              </div>
            </Fragment>
          )
        })}
      </div>
      )}

      {/* Load More Button */}
      {visibleBusinesses.length < filteredBusinesses.length && (
        <div className="mt-10 text-center">
          <button
            onClick={handleLoadMore}
            className="px-8 py-3.5 bg-navy hover:bg-blue text-white text-sm font-bold rounded-2xl shadow-md transition-all hover:scale-[1.02] active:scale-[0.98]"
          >
            Load More Businesses ({filteredBusinesses.length - visibleBusinesses.length} remaining)
          </button>
        </div>
      )}
    </div>
  )
}

