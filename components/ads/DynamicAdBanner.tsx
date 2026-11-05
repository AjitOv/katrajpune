"use client"

import { useEffect, useState } from "react"
import { ExternalLink, Tag } from "lucide-react"

export type AdPlacement =
  | "homepage_top"
  | "homepage_promo"
  | "directory_between"
  | "category_banner"
  | "business_profile"
  | "sponsored_listing"

interface AdCampaign {
  id: string
  name: string
  advertiser_name: string
  image_url: string
  destination_url: string
  placement: AdPlacement
  priority: number
}

interface DynamicAdBannerProps {
  placement: AdPlacement
  fallback?: React.ReactNode
  className?: string
}

export default function DynamicAdBanner({
  placement,
  fallback = null,
  className = "",
}: DynamicAdBannerProps) {
  const [ads, setAds] = useState<AdCampaign[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    let isMounted = true

    fetch(`/api/ads?placement=${placement}`)
      .then((res) => res.json())
      .then((data) => {
        if (isMounted && Array.isArray(data) && data.length > 0) {
          setAds(data)
          // Track impressions for the top active ad
          fetch("/api/ads/track", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ id: data[0].id, type: "impression" }),
          }).catch(() => {})
        }
      })
      .catch(() => {})
      .finally(() => {
        if (isMounted) setLoading(false)
      })

    return () => {
      isMounted = false
    }
  }, [placement])

  const handleAdClick = (ad: AdCampaign) => {
    fetch("/api/ads/track", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id: ad.id, type: "click" }),
    }).catch(() => {})
  }

  if (loading) return null

  if (ads.length === 0) {
    return <>{fallback}</>
  }

  const activeAd = ads[0]

  return (
    <div
      aria-label={`Advertisement: ${activeAd.advertiser_name}`}
      className={`relative overflow-hidden rounded-2xl bg-white border border-navy/10 shadow-sm transition-all hover:shadow-md ${className}`}
    >
      {/* Sponsored Pill Badge */}
      <div className="absolute top-2.5 right-2.5 z-10 flex items-center gap-1 bg-black/60 backdrop-blur-md text-white text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full">
        <Tag className="w-2.5 h-2.5" />
        <span>Sponsored</span>
      </div>

      <a
        href={activeAd.destination_url}
        target="_blank"
        rel="noopener noreferrer sponsored"
        onClick={() => handleAdClick(activeAd)}
        className="block group"
      >
        <div className="relative aspect-[21/9] sm:aspect-[3/1] max-h-48 overflow-hidden bg-navy/5">
          <img
            src={activeAd.image_url}
            alt={activeAd.name}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
          />
        </div>

        <div className="p-3.5 flex items-center justify-between gap-3 bg-white">
          <div className="min-w-0">
            <p className="font-bold text-navy text-sm truncate">{activeAd.name}</p>
            <p className="text-xs text-gray-500 truncate">Promoted by {activeAd.advertiser_name}</p>
          </div>
          <span className="shrink-0 flex items-center gap-1 bg-navy text-white text-xs font-bold px-3 py-1.5 rounded-xl group-hover:bg-blue transition-colors">
            <span>Visit</span>
            <ExternalLink className="w-3 h-3" />
          </span>
        </div>
      </a>
    </div>
  )
}
