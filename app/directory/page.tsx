import { jsonLd } from "@/lib/seo"
import { Metadata } from "next"
import Link from "next/link"
import { getAllApprovedBusinesses } from "@/lib/data/businesses"
import DirectoryGrid from "@/components/directory/DirectoryGrid"
import DhanDematBanner from "@/components/ads/DhanDematBanner"
import AmazonBestsellers from "@/components/ads/AmazonBestsellers"
import DynamicAdBanner from "@/components/ads/DynamicAdBanner"
import ZotozAuditBanner from "@/components/promo/ZotozAuditBanner"

export const dynamic = "force-dynamic"

export const metadata: Metadata = {
  title: "Katraj Business Directory — 1,440+ Verified Local Businesses in Katraj, Pune",
  description:
    "Explore 1,440+ verified shops, restaurants, doctors, schools, and services in Katraj, Pune (411046) with direct WhatsApp contact, photos, ratings, and map locations.",
  openGraph: {
    title: "Katraj Business Directory — 1,440+ Verified Local Businesses in Katraj, Pune",
    description:
      "Find any business in Katraj with phone numbers, WhatsApp, photos, ratings, and exact GPS locations.",
    url: "https://katrajpune.com/directory",
    siteName: "KatrajPune",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Katraj Business Directory — 1,440+ Verified Local Businesses",
    description: "Explore 1,440+ shops, doctors, cafes, and services in Katraj, Pune.",
  },
  alternates: {
    canonical: "https://katrajpune.com/directory",
  },
  other: {
    "geo.region": "IN-MH",
    "geo.placename": "Katraj, Pune, Maharashtra, India",
    "geo.position": "18.452936;73.855301",
    ICBM: "18.452936, 73.855301",
  },
}

export default async function DirectoryPage({ searchParams }: { searchParams: { search?: string; q?: string } }) {
  const businesses = await getAllApprovedBusinesses()

  // AEO FAQ Schema & CollectionPage ItemList Schema
  const structuredData = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "CollectionPage",
        "@id": "https://katrajpune.com/directory#webpage",
        url: "https://katrajpune.com/directory",
        name: "Katraj Business Directory",
        description: `Explore ${businesses.length} verified businesses in Katraj, Pune with WhatsApp contact and ratings.`,
        mainEntity: {
          "@type": "ItemList",
          numberOfItems: businesses.length,
          itemListElement: businesses.slice(0, 30).map((b, index) => ({
            "@type": "ListItem",
            position: index + 1,
            name: b.name,
            url: `https://katrajpune.com/business/${b.slug}`,
            image: b.photos && b.photos.length > 0 ? b.photos[0] : b.logo_url || undefined,
          })),
        },
      },
      {
        "@type": "FAQPage",
        "@id": "https://katrajpune.com/directory#faq",
        mainEntity: [
          {
            "@type": "Question",
            name: "How many businesses are listed in the Katraj directory?",
            acceptedAnswer: {
              "@type": "Answer",
              text: `KatrajPune indexes ${businesses.length} verified businesses in Katraj, Pune across 8 main categories including restaurants, healthcare, education, shopping, fitness, automotive, home services, and professional services.`,
            },
          },
          {
            "@type": "Question",
            name: "What areas in Katraj are covered?",
            acceptedAnswer: {
              "@type": "Answer",
              text: "The directory covers all major micro-localities in southern Pune: Katraj Chowk, Bharati Vidyapeeth, Katraj-Kondhwa Road, Ambegaon Budruk, Katraj Dairy, Sukhsagar Nagar, Wonder City, Rajas Society, and Santosh Nagar.",
            },
          },
          {
            "@type": "Question",
            name: "How can I contact businesses in Katraj directly?",
            acceptedAnswer: {
              "@type": "Answer",
              text: "Each verified listing on KatrajPune provides direct click-to-chat WhatsApp links (wa.me), verified phone numbers, and exact Google Maps GPS navigation coordinates.",
            },
          },
          {
            "@type": "Question",
            name: "What is the postal code (PIN code) of Katraj, Pune?",
            acceptedAnswer: {
              "@type": "Answer",
              text: "The postal code (PIN code) for Katraj, Pune, Maharashtra is 411046.",
            },
          },
        ],
      },
      {
        "@type": "BreadcrumbList",
        "@id": "https://katrajpune.com/directory#breadcrumb",
        itemListElement: [
          {
            "@type": "ListItem",
            position: 1,
            name: "Home",
            item: "https://katrajpune.com",
          },
          {
            "@type": "ListItem",
            position: 2,
            name: "Katraj Business Directory",
            item: "https://katrajpune.com/directory",
          },
        ],
      },
    ],
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Structured Data for SEO, GEO & AEO */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: jsonLd(structuredData) }}
      />

      {/* Hero Banner */}
      <section className="bg-gradient-to-r from-navy via-navy to-blue text-white py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto text-center space-y-3">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 backdrop-blur-md text-xs font-semibold text-orange tracking-wider uppercase">
            ⚡ Hyperlocal Discovery Platform
          </div>
          <h1 className="text-3xl sm:text-5xl font-extrabold tracking-tight">
            Katraj Business Directory
          </h1>
          <p className="text-sm sm:text-base text-gray-300 max-w-2xl mx-auto">
            Discover <span className="text-white font-bold">{businesses.length}+ verified local businesses</span> across Katraj Chowk, Bharati Vidyapeeth, Katraj Dairy, Ambegaon, Sukhsagar Nagar, and more.
          </p>

          <div className="pt-2 flex flex-wrap justify-center gap-4 text-xs text-gray-300">
            <span className="flex items-center gap-1">✅ 1,440+ Listings</span>
            <span className="flex items-center gap-1">💬 Direct WhatsApp Chat</span>
            <span className="flex items-center gap-1">⭐ Verified Ratings</span>
            <span className="flex items-center gap-1">🗺️ Exact Map Coordinates</span>
          </div>
        </div>
      </section>

      {/* Sponsored Demat Account Banner */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-6">
        <DhanDematBanner variant="horizontal" />
      </div>

      {/* Dynamic Ad Placement - Between Directory Banner */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-6">
        <DynamicAdBanner placement="directory_between" />
      </div>

      {/* Zotoz AI Visibility Audit Promotion */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-6">
        <ZotozAuditBanner variant="hero" />
      </div>

      <p className="text-center my-5"><Link className="underline" href="/browse">Browse every business profile by page →</Link></p>
      {/* Directory Grid Component */}
      <main>
        <DirectoryGrid businesses={businesses} initialQuery={searchParams.search || searchParams.q || ""} />
      </main>

      {/* Amazon Bestsellers & Deals Showcase */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 my-14">
        <AmazonBestsellers />
      </div>

      {/* Footer with SEO & LLM Links */}
      <footer className="mt-16 border-t border-navy/10 bg-white py-8 px-4 text-center text-xs text-gray-500">
        <div className="max-w-7xl mx-auto space-y-3">
          <p className="font-semibold text-navy">
            KatrajPune.com — Hyperlocal business directory & map for Katraj, Pune, Maharashtra 411046
          </p>
          <div className="flex flex-wrap justify-center gap-4 text-gray-400 text-xs">
            <Link href="/" className="hover:text-navy">Interactive Map</Link>
            <span>•</span>
            <Link href="/directory" className="hover:text-navy">Directory Grid</Link>
            <span>•</span>
            <Link href="/deals" className="hover:text-orange font-bold text-navy">🛍️ Amazon Deals</Link>
            <span>•</span>
            <Link href="/free-ai-audit" className="hover:text-blue font-bold text-navy">🤖 Free AI Audit</Link>
            <span>•</span>
            <Link href="/sitemap.xml" className="hover:text-navy" target="_blank">Sitemap.xml</Link>
            <span>•</span>
            <Link href="/llms.txt" className="hover:text-navy" target="_blank">LLMs.txt</Link>
            <span>•</span>
            <Link href="/llms-full.txt" className="hover:text-navy" target="_blank">LLMs-full.txt</Link>
            <span>•</span>
            <Link href="/add-business" className="hover:text-navy">List Your Business (₹350)</Link>
          </div>
        </div>
      </footer>
    </div>
  )
}
