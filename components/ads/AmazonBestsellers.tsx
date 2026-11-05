"use client"

import { useState } from "react"
import { ExternalLink, Star, Flame, Zap, ShieldCheck, Tag } from "lucide-react"

interface Product {
  id: string
  name: string
  category: "tech" | "student" | "home" | "gadgets"
  dealPrice: string
  originalPrice: string
  discount: string
  rating: number
  reviewsCount: string
  badge?: string
  asin: string
  image: string
  customLink?: string
}

const AFFILIATE_TAG = "ftechindia-21"
const FEATURED_AMAZON_LINK = "https://link.amazon/B0a3kYYm7"

const BESTSELLER_PRODUCTS: Product[] = [
  {
    id: "1",
    name: "boAt Airdopes 141 Bluetooth Truly Wireless in Ear Earbuds with 42H Playtime",
    category: "tech",
    dealPrice: "₹999",
    originalPrice: "₹4,490",
    discount: "78% OFF",
    rating: 4.1,
    reviewsCount: "220,000+",
    badge: "#1 Bestseller in Audio",
    asin: "B09N3ZNHTY",
    image: "https://images.unsplash.com/photo-1590658268037-6bf12165a8df?w=600&auto=format&fit=crop&q=80",
    customLink: FEATURED_AMAZON_LINK,
  },
  {
    id: "2",
    name: "Noise ColorFit Pulse Grand Smart Watch with 1.69\" HD Display & 60 Sports Modes",
    category: "gadgets",
    dealPrice: "₹1,299",
    originalPrice: "₹3,999",
    discount: "68% OFF",
    rating: 4.0,
    reviewsCount: "135,000+",
    badge: "Trending Deal",
    asin: "B09NVPSCQT",
    image: "https://images.unsplash.com/photo-1579586337278-3befd40fd17a?w=600&auto=format&fit=crop&q=80",
  },
  {
    id: "3",
    name: "Mi 20000mAh Power Bank 3i with 18W Fast Charging & Triple Output Ports",
    category: "tech",
    dealPrice: "₹1,999",
    originalPrice: "₹2,499",
    discount: "20% OFF",
    rating: 4.3,
    reviewsCount: "180,000+",
    badge: "Must-Have for Students",
    asin: "B08HV88N5J",
    image: "https://images.unsplash.com/photo-1609592424109-dd9892f1b177?w=600&auto=format&fit=crop&q=80",
  },
  {
    id: "4",
    name: "Portronics Multi-Angle Adjustable Laptop Stand for Desk & Study Table",
    category: "student",
    dealPrice: "₹499",
    originalPrice: "₹1,299",
    discount: "62% OFF",
    rating: 4.4,
    reviewsCount: "45,000+",
    badge: "Ergonomic Pick",
    asin: "B08CDQ2GBS",
    image: "https://images.unsplash.com/photo-1527864550417-7fd91fc51a46?w=600&auto=format&fit=crop&q=80",
  },
  {
    id: "5",
    name: "Pigeon by Stovekraft Cruise 1800-Watt Induction Cooktop with 7 Preset Menus",
    category: "home",
    dealPrice: "₹1,499",
    originalPrice: "₹3,195",
    discount: "53% OFF",
    rating: 4.1,
    reviewsCount: "82,000+",
    badge: "Hostel & PG Favourite",
    asin: "B01GCELKMG",
    image: "https://images.unsplash.com/photo-1556911220-e15b29be8c8f?w=600&auto=format&fit=crop&q=80",
  },
  {
    id: "6",
    name: "Milton Thermosteel Flip Lid Flask 1000ml (24 Hours Hot & Cold)",
    category: "home",
    dealPrice: "₹899",
    originalPrice: "₹1,260",
    discount: "29% OFF",
    rating: 4.3,
    reviewsCount: "94,000+",
    badge: "All-Day Cold/Hot",
    asin: "B0073QO3E6",
    image: "https://images.unsplash.com/photo-1602143407151-7111542de6e8?w=600&auto=format&fit=crop&q=80",
  },
  {
    id: "7",
    name: "Amazon Echo Dot (5th Gen) Smart Speaker with Alexa & Deeper Bass",
    category: "gadgets",
    dealPrice: "₹3,999",
    originalPrice: "₹5,499",
    discount: "27% OFF",
    rating: 4.5,
    reviewsCount: "38,000+",
    badge: "Voice AI & Music",
    asin: "B09B8W5FW7",
    image: "https://images.unsplash.com/photo-1543512214-318c7553f230?w=600&auto=format&fit=crop&q=80",
  },
  {
    id: "8",
    name: "SanDisk Ultra Dual Drive Go 64GB USB Type-C & Type-A Flash Drive",
    category: "student",
    dealPrice: "₹679",
    originalPrice: "₹1,200",
    discount: "43% OFF",
    rating: 4.3,
    reviewsCount: "115,000+",
    badge: "Fast Phone Transfer",
    asin: "B07YFLFBY3",
    image: "https://images.unsplash.com/photo-1628191010210-a59de33e5941?w=600&auto=format&fit=crop&q=80",
  },
]

function getAmazonUrl(product: Product): string {
  if (product.customLink) return product.customLink
  return `https://www.amazon.in/dp/${product.asin}/?tag=${AFFILIATE_TAG}`
}

export default function AmazonBestsellers({
  title = "Trending Amazon Bestsellers & Deals",
  subtitle = "Handpicked top deals on gadgets, college essentials & home appliances for Katraj residents and students.",
  limit = 8,
  compact = false,
  className = "",
}: {
  title?: string
  subtitle?: string
  limit?: number
  compact?: boolean
  className?: string
}) {
  const [activeTab, setActiveTab] = useState<"all" | "tech" | "student" | "home" | "gadgets">("all")

  const filtered = BESTSELLER_PRODUCTS.filter(
    (p) => activeTab === "all" || p.category === activeTab
  ).slice(0, limit)

  return (
    <section className={`bg-gradient-to-br from-amber-50/70 via-white to-orange/5 border border-amber-200/60 rounded-3xl p-6 sm:p-8 shadow-sm ${className}`}>
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-6">
        <div>
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-gradient-to-r from-amber-500 to-orange text-white text-xs font-bold uppercase tracking-wider mb-2 shadow-sm">
            <Flame className="w-3.5 h-3.5" />
            <span>Amazon Bestsellers &amp; Deals</span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-black text-navy tracking-tight">{title}</h2>
          {subtitle && <p className="text-xs sm:text-sm text-gray-500 mt-1 max-w-2xl">{subtitle}</p>}
        </div>

        {/* Tab filters */}
        <div className="flex flex-wrap gap-1.5 bg-white p-1 rounded-2xl border border-navy/10 shadow-xs">
          {[
            { id: "all", label: "All Deals" },
            { id: "tech", label: "Audio & Tech" },
            { id: "gadgets", label: "Smart Gadgets" },
            { id: "student", label: "Student Desk" },
            { id: "home", label: "Hostel & Home" },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`px-3 py-1.5 text-xs font-bold rounded-xl transition-all ${
                activeTab === tab.id
                  ? "bg-navy text-white shadow-xs"
                  : "text-navy/70 hover:text-navy hover:bg-navy/5"
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      {/* Grid of Products */}
      <div className={`grid grid-cols-1 sm:grid-cols-2 ${compact ? "lg:grid-cols-3" : "lg:grid-cols-4"} gap-5`}>
        {filtered.map((item) => {
          const buyUrl = getAmazonUrl(item)
          return (
            <div
              key={item.id}
              className="bg-white rounded-2xl border border-navy/10 shadow-xs hover:shadow-lg transition-all flex flex-col justify-between overflow-hidden group hover:border-amber-400/80"
            >
              <div>
                {/* Image & Badge */}
                <div className="relative h-44 overflow-hidden bg-gray-50 flex items-center justify-center p-3">
                  <img
                    src={item.image}
                    alt={item.name}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300 rounded-xl"
                  />
                  {item.badge && (
                    <span className="absolute top-3 left-3 bg-navy/90 backdrop-blur-md text-white text-[10px] font-extrabold px-2 py-0.5 rounded-md shadow-xs">
                      {item.badge}
                    </span>
                  )}
                  <span className="absolute bottom-3 right-3 bg-red-600 text-white text-[11px] font-black px-2 py-0.5 rounded-full shadow-xs">
                    {item.discount}
                  </span>
                </div>

                {/* Body */}
                <div className="p-4 space-y-2">
                  <h3 className="text-xs sm:text-sm font-bold text-navy line-clamp-2 leading-snug group-hover:text-blue transition-colors">
                    {item.name}
                  </h3>

                  {/* Rating */}
                  <div className="flex items-center gap-1.5 text-xs">
                    <div className="flex items-center gap-0.5 text-amber-500 font-bold bg-amber-50 px-1.5 py-0.5 rounded">
                      <Star className="w-3 h-3 fill-amber-400 text-amber-400" />
                      <span>{item.rating}</span>
                    </div>
                    <span className="text-[11px] text-gray-400">({item.reviewsCount})</span>
                  </div>

                  {/* Price */}
                  <div className="flex items-baseline gap-2 pt-1">
                    <span className="text-lg font-black text-navy">{item.dealPrice}</span>
                    <span className="text-xs text-gray-400 line-through">{item.originalPrice}</span>
                    <span className="text-[11px] font-bold text-emerald-600 uppercase">Prime</span>
                  </div>
                </div>
              </div>

              {/* Buy CTA */}
              <div className="p-4 pt-0">
                <a
                  href={buyUrl}
                  target="_blank"
                  rel="noopener noreferrer sponsored"
                  className="w-full py-2.5 px-3 bg-gradient-to-r from-amber-400 to-yellow-400 hover:from-amber-500 hover:to-yellow-500 text-navy font-black text-xs rounded-xl flex items-center justify-center gap-1.5 shadow-sm transition-all transform hover:scale-[1.02]"
                >
                  <span>Buy on Amazon</span>
                  <ExternalLink className="w-3.5 h-3.5" />
                </a>
              </div>
            </div>
          )
        })}
      </div>

      {/* Footer affiliate disclosure */}
      <div className="mt-6 pt-4 border-t border-amber-200/50 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-gray-500">
        <p className="flex items-center gap-1.5">
          <ShieldCheck className="w-4 h-4 text-emerald-600" />
          <span>Verified Amazon India deals • Prime eligible fast delivery in Katraj, Pune (411046).</span>
        </p>
        <a
          href={`https://www.amazon.in/gp/bestsellers/?tag=${AFFILIATE_TAG}`}
          target="_blank"
          rel="noopener noreferrer sponsored"
          className="text-xs font-bold text-navy hover:text-orange underline flex items-center gap-1 shrink-0"
        >
          <span>View All Amazon Bestsellers</span>
          <ExternalLink className="w-3 h-3" />
        </a>
      </div>
    </section>
  )
}

