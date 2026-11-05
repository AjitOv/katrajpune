import { Metadata } from "next"
import Link from "next/link"
import { Flame, ShoppingBag, ShieldCheck, ArrowRight } from "lucide-react"
import AmazonBestsellers from "@/components/ads/AmazonBestsellers"
import DhanDematBanner from "@/components/ads/DhanDematBanner"

export const metadata: Metadata = {
  title: "Trending Amazon Bestsellers & Shopping Deals — KatrajPune",
  description:
    "Curated Amazon bestsellers, student electronics, smart gadgets, and home essentials with fast Prime delivery in Katraj, Pune (PIN 411046).",
  openGraph: {
    title: "Trending Amazon Bestsellers & Shopping Deals — KatrajPune",
    description: "Best Amazon deals on electronics, study desk gadgets, and daily home essentials.",
    url: "https://katrajpune.com/deals",
    siteName: "KatrajPune",
  },
  alternates: {
    canonical: "https://katrajpune.com/deals",
  },
}

export default function DealsPage() {
  return (
    <div className="min-h-screen bg-background">
      {/* Top Header */}
      <header className="sticky top-0 z-30 bg-white/95 backdrop-blur-md border-b border-navy/10 px-4 sm:px-6 py-3.5">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2 group">
            <span className="text-xl">📍</span>
            <div className="flex items-center gap-1.5">
              <span className="text-xs font-black tracking-widest text-navy/60 uppercase">katraj</span>
              <span className="w-1.5 h-1.5 rounded-full bg-orange" />
              <span className="text-lg font-bold text-navy">pune</span>
            </div>
          </Link>
          <div className="flex items-center gap-2 sm:gap-3">
            <Link
              href="/directory"
              className="text-xs font-bold text-navy hover:text-orange px-3 py-1.5 rounded-lg hover:bg-navy/5 transition-colors"
            >
              Local Directory
            </Link>
            <Link
              href="/add-business"
              className="text-xs font-bold px-3 py-1.5 rounded-lg bg-orange text-white hover:bg-orange/90 transition-colors"
            >
              + List Business (₹350)
            </Link>
          </div>
        </div>
      </header>

      {/* Hero Banner */}
      <section className="bg-gradient-to-br from-[#10243A] via-[#1A365D] to-amber-900/60 text-white py-12 px-4 sm:px-6">
        <div className="max-w-4xl mx-auto text-center space-y-3">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-400/20 border border-amber-300/40 text-amber-200 text-xs font-bold uppercase tracking-wider">
            <Flame className="w-3.5 h-3.5" />
            <span>Curated Deals for Katraj &amp; Pune</span>
          </div>
          <h1 className="text-3xl sm:text-5xl font-black tracking-tight leading-tight">
            Amazon Bestsellers &amp; Trending Deals
          </h1>
          <p className="text-sm sm:text-base text-gray-300 max-w-2xl mx-auto">
            Top trending electronics, wireless earbuds, smart watches, laptop accessories, and hostel &amp; PG essentials with 1-day Prime delivery in Katraj, Pune (411046).
          </p>
        </div>
      </section>

      {/* Main Deals Showcase */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-10">
        <AmazonBestsellers
          title="Top Rated Deals on Amazon India"
          subtitle="Prices and availability are verified. Supports fast same-day &amp; next-day delivery across Katraj, Bharati Vidyapeeth, and Kondhwa."
        />

        {/* Local Shopping Alternative Callout */}
        <div className="bg-white rounded-3xl p-6 sm:p-8 border border-navy/10 shadow-sm flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="space-y-1">
            <div className="inline-flex items-center gap-1 text-xs font-bold text-orange uppercase tracking-wider">
              <ShoppingBag className="w-4 h-4" />
              <span>Shop Local First</span>
            </div>
            <h3 className="text-xl font-bold text-navy">Prefer to buy from a local store in Katraj?</h3>
            <p className="text-xs sm:text-sm text-gray-500">
              Explore 300+ verified electronics, mobile stores, and grocery markets in Katraj Chowk &amp; Bharati Vidyapeeth with direct WhatsApp contact.
            </p>
          </div>
          <Link
            href="/category/shopping"
            className="shrink-0 px-5 py-3 bg-navy hover:bg-blue text-white text-xs font-bold rounded-xl transition-colors flex items-center gap-2"
          >
            <span>Browse Katraj Local Shops</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>

        {/* Dhan Demat Ad */}
        <DhanDematBanner variant="horizontal" />
      </main>
    </div>
  )
}

