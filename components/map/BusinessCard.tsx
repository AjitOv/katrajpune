"use client"

import { Business } from "@/types/business"
import { CATEGORY_COLORS } from "@/types/business"
import Link from "next/link"

interface BusinessCardProps {
  business: Business
  onClose: () => void
}

const CATEGORY_EMOJIS: Record<string, string> = {
  shopping: "🛒",
  restaurants: "🍴",
  healthcare: "🏥",
  education: "🎓",
  home_services: "🔧",
  automotive: "🚗",
  fitness: "💪",
  professional_services: "💼",
}

export default function BusinessCard({ business, onClose }: BusinessCardProps) {
  const categoryColor = CATEGORY_COLORS[business.category as keyof typeof CATEGORY_COLORS] || "#10b981"
  const emoji = CATEGORY_EMOJIS[business.category] || "📍"

  const openingHours = (business.opening_hours as Record<string, string> | null) || {}
  const currentDay = new Date()
    .toLocaleDateString("en-US", { weekday: "long" })
    .toLowerCase()
  const todayHours = openingHours[currentDay]
  const isOpen = todayHours && todayHours !== "closed"

  const displayImage = business.logo_url || (business.photos && business.photos.length > 0 ? business.photos[0] : null)

  return (
    <>
      <style>{`
        @keyframes slideUp {
          from { transform: translateY(20px); opacity: 0; }
          to { transform: translateY(0); opacity: 1; }
        }
        .business-card-anim { animation: slideUp 0.22s ease-out; }
      `}</style>
      <div
        className="business-card-anim fixed bottom-4 left-4 z-50 w-[calc(100vw-2rem)] max-w-sm bg-white rounded-2xl shadow-2xl border border-navy/10 overflow-hidden"
        role="dialog"
        aria-modal="true"
      >
        {/* Header image / gradient */}
        <div className="relative h-40 overflow-hidden">
          {displayImage ? (
            <img
              src={displayImage}
              alt={business.name}
              className="w-full h-full object-cover"
            />
          ) : (
            <div
              className="w-full h-full flex items-center justify-center"
              style={{ background: `linear-gradient(135deg, #10243A 0%, ${categoryColor} 100%)` }}
            >
              <span className="text-5xl drop-shadow-md">{emoji}</span>
            </div>
          )}
          {/* Close button */}
          <button
            onClick={onClose}
            className="absolute top-3 right-3 p-1.5 bg-black/40 backdrop-blur-sm rounded-full text-white hover:bg-black/60 transition-colors"
            aria-label="Close business card"
          >
            <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
              <path d="M1 1l12 12M13 1L1 13" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
            </svg>
          </button>
          {/* Open/closed badge */}
          {todayHours && (
            <div className="absolute bottom-3 left-3">
              <span
                className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold backdrop-blur-sm ${
                  isOpen ? "bg-green-500/90 text-white" : "bg-black/50 text-white/80"
                }`}
              >
                <span className={`w-1.5 h-1.5 rounded-full ${isOpen ? "bg-white animate-pulse" : "bg-white/50"}`} />
                {isOpen ? `Open · ${todayHours}` : "Closed today"}
              </span>
            </div>
          )}
        </div>

        {/* Content */}
        <div className="p-4">
          {/* Category + verified */}
          <div className="flex items-center gap-2 mb-1">
            <span
              className="px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider"
              style={{ backgroundColor: categoryColor + "20", color: categoryColor }}
            >
              {business.category.replace(/_/g, " ")}
            </span>
            {business.location_verified && (
              <span className="flex items-center gap-1 text-[10px] font-bold text-green-600">
                <span className="w-1.5 h-1.5 rounded-full bg-green-500" />
                Verified
              </span>
            )}
            {business.rating && (
              <span className="flex items-center gap-1 text-[11px] font-bold text-amber-700 bg-amber-50 px-1.5 py-0.5 rounded">
                ★ {business.rating.toFixed(1)}{business.reviews_count ? ` (${business.reviews_count})` : ''}
              </span>
            )}
          </div>

          <h3 className="text-lg font-bold text-navy leading-tight">{business.name}</h3>
          {business.locality && (
            <p className="text-sm font-medium mt-0.5" style={{ color: "#1769AA" }}>
              {business.locality}, Katraj, Pune
            </p>
          )}
          {business.description && (
            <p className="text-sm text-gray-500 mt-1.5 line-clamp-2 leading-snug">
              {business.description}
            </p>
          )}

          {/* Action buttons */}
          <div className="flex gap-2 mt-4">
            {business.phone && (
              <a
                href={`tel:${business.phone}`}
                className="flex-1 py-2 text-white text-sm font-semibold rounded-xl text-center transition-opacity hover:opacity-90"
                style={{ backgroundColor: "#10243A" }}
              >
                📞 Call
              </a>
            )}
            {business.whatsapp && (
              <a
                href={`https://wa.me/${business.whatsapp.replace(/\D/g, "")}`}
                target="_blank"
                rel="noopener noreferrer"
                className="flex-1 py-2 bg-green-500 text-white text-sm font-semibold rounded-xl text-center hover:bg-green-600 transition-colors"
              >
                💬 WA
              </a>
            )}
            {!business.phone && !business.whatsapp && (
              <a
                href={`https://www.google.com/maps/dir/?api=1&destination=${business.latitude},${business.longitude}`}
                target="_blank"
                rel="noopener noreferrer"
                className="flex-1 py-2 text-white text-sm font-semibold rounded-xl text-center transition-opacity hover:opacity-90"
                style={{ backgroundColor: "#F28C28" }}
              >
                🗺️ Directions
              </a>
            )}
            <Link
              href={`/business/${business.slug}`}
              className="flex-1 py-2 bg-gray-100 text-navy text-sm font-semibold rounded-xl text-center hover:bg-gray-200 transition-colors"
            >
              Profile →
            </Link>
          </div>

          <div className="mt-2.5 text-center">
            <Link
              href={`/claim?slug=${business.slug}`}
              className="text-[10px] text-gray-400 hover:text-orange font-medium transition-colors"
            >
              Own this business? Claim &amp; verify for ₹350 →
            </Link>
          </div>
        </div>
      </div>
    </>
  )
}
