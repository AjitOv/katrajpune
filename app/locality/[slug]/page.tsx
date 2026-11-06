import { PAGE_SIZE, pageNumber, pagePath, localitySlug, jsonLd } from "@/lib/seo"
import Pagination from "@/components/seo/Pagination"
import { notFound } from "next/navigation"
import Link from "next/link"
import { getAllApprovedBusinesses } from "@/lib/data/businesses"
import { getMarkerEmoji } from "@/lib/markers"
import DhanDematBanner from "@/components/ads/DhanDematBanner"

export const dynamic = "force-dynamic"

function matchLocality(value: string | null, slug: string) { return !!value && localitySlug(value) === slug }

export async function generateMetadata({ params, searchParams }: { params: { slug: string }; searchParams: { page?: string } }) {
  const page = pageNumber(searchParams.page)
  if (!page) notFound()
  const decoded = (await getAllApprovedBusinesses()).find(b => matchLocality(b.locality, params.slug))?.locality || params.slug
  const businesses = (await getAllApprovedBusinesses()).filter((b) => matchLocality(b.locality, params.slug))

  return {
    title: `${decoded}, Pune — Local Businesses${page > 1 ? ` — Page ${page}` : ""}`,
    description: `Discover ${businesses.length} local businesses in ${decoded}, Katraj, Pune with WhatsApp contact, ratings, and map locations.`,
    openGraph: {
      title: `${decoded}, Pune — Local Businesses${page > 1 ? ` — Page ${page}` : ""}`,
      description: `Find listed businesses in ${decoded}, Katraj, Pune on an interactive map.`,
      url: `https://katrajpune.com${pagePath(`/locality/${params.slug}`,page)}`,
      siteName: "KatrajPune",
    },
    alternates: {
      canonical: `https://katrajpune.com${pagePath(`/locality/${params.slug}`,page)}`,
    },
    other: {
      "geo.region": "IN-MH",
      "geo.placename": `${decoded}, Katraj, Pune, Maharashtra, India`,
      "geo.position": "18.452936;73.855301",
      ICBM: "18.452936, 73.855301",
    },
  }
}

export default async function LocalityPage({
  params, searchParams,
}: {
  params: { slug: string }; searchParams: { page?: string }
}) {
  const decoded = (await getAllApprovedBusinesses()).find(b => matchLocality(b.locality, params.slug))?.locality || params.slug
  const businesses = (await getAllApprovedBusinesses()).filter((b) => matchLocality(b.locality, params.slug))

  if (businesses.length === 0) {
    notFound()
  }

  const page = pageNumber(searchParams.page)
  const total = Math.max(1, Math.ceil(businesses.length / PAGE_SIZE))
  if (!page || page > total) notFound()
  const visible = businesses.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE)

  const structuredData = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "CollectionPage",
        "@id": `https://katrajpune.com/locality/${params.slug}#webpage`,
        url: `https://katrajpune.com${pagePath(`/locality/${params.slug}`,page)}`,
        name: `Local Businesses in ${decoded}, Katraj`,
        description: `Explore ${businesses.length} listed businesses in ${decoded}, Katraj, Pune.`,
        mainEntity: {
          "@type": "ItemList",
          numberOfItems: visible.length,
          itemListElement: visible.map((b, i) => ({
            "@type": "ListItem",
            position: (page - 1) * PAGE_SIZE + i + 1,
            name: b.name,
            url: `https://katrajpune.com/business/${b.slug}`,
          })),
        },
      },
      {
        "@type": "BreadcrumbList",
        "@id": `https://katrajpune.com/locality/${params.slug}#breadcrumb`,
        itemListElement: [
          { "@type": "ListItem", position: 1, name: "Home", item: "https://katrajpune.com" },
          { "@type": "ListItem", position: 2, name: "Directory", item: "https://katrajpune.com/directory" },
          { "@type": "ListItem", position: 3, name: decoded, item: `https://katrajpune.com${pagePath(`/locality/${params.slug}`,page)}` },
        ],
      },
    ],
  }

  return (
    <div className="min-h-screen bg-background">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: jsonLd(structuredData) }}
      />
      <header className="bg-white border-b border-navy/10">
        <div className="max-w-6xl mx-auto px-4 py-4 sm:px-6 lg:px-8 flex items-center justify-between">
          <div>
            <nav className="flex items-center gap-2 text-xs text-gray-400 mb-1">
              <Link href="/" className="hover:text-navy">KatrajPune</Link>
              <span>/</span>
              <Link href="/directory" className="hover:text-navy">Directory</Link>
              <span>/</span>
              <span className="text-navy font-bold">{decoded}</span>
            </nav>
            <h1 className="text-2xl font-bold text-navy flex items-center gap-2">
              <span>📍</span>
              <span>{decoded}, Katraj, Pune</span>
            </h1>
            <p className="text-xs text-gray-500 mt-0.5">
              {businesses.length} listed businesses found in {decoded}
            </p>
          </div>

          <div className="flex items-center gap-2">
            <Link
              href="/add-business"
              className="px-3 py-2 bg-orange hover:bg-orange/90 text-white text-xs font-bold rounded-xl shadow-sm transition-all"
            >
              + Add Listing (₹350)
            </Link>
            <Link
              href="/"
              className="px-3.5 py-2 bg-navy text-white text-xs font-bold rounded-xl hover:bg-blue transition-colors flex items-center gap-1.5"
            >
              <span>🗺️</span> View on Map
            </Link>
          </div>
        </div>
      </header>

      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <p className="mb-6 text-sm text-gray-600">Browse {decoded} listings and compare addresses, map locations and available contact details. Confirm hours, services and availability directly with each business. Page {page} of {total}.</p>
        {/* Sponsored Dhan Demat Banner */}
        <DhanDematBanner variant="horizontal" className="mb-8" />
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {visible.map((biz) => {
            const photoUrl = biz.logo_url || (biz.photos && biz.photos.length > 0 ? biz.photos[0] : null)
            return (
              <div
                key={biz.slug}
                className="bg-white rounded-2xl border border-navy/10 shadow-sm hover:shadow-md transition-all overflow-hidden flex flex-col group"
              >
                <div className="h-44 bg-gray-100 relative overflow-hidden">
                  {photoUrl ? (
                    <img
                      loading="lazy"
                      decoding="async"
                      src={photoUrl}
                      alt={biz.name}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center bg-navy text-white text-4xl">
                      {getMarkerEmoji(biz.category)}
                    </div>
                  )}

                  {biz.rating && (
                    <div className="absolute top-3 right-3">
                      <span className="flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-bold bg-amber-500 text-white shadow-sm">
                        ★ {biz.rating.toFixed(1)}
                      </span>
                    </div>
                  )}

                  <div className="absolute bottom-3 left-3">
                    <span className="px-2 py-0.5 bg-white/90 backdrop-blur-md rounded-full text-[10px] font-bold text-navy uppercase">
                      {biz.category.replace(/_/g, " ")}
                    </span>
                  </div>
                </div>

                <div className="p-4 flex-1 flex flex-col justify-between">
                  <div>
                    <h3 className="text-base font-bold text-navy group-hover:text-blue transition-colors mb-1">
                      {biz.name}
                    </h3>
                    <p className="text-xs text-gray-500 line-clamp-2 mb-2">{biz.address}</p>
                    {biz.description && (
                      <p className="text-xs text-gray-600 line-clamp-2">{biz.description}</p>
                    )}
                  </div>

                  <div className="pt-3 mt-3 border-t border-gray-100 flex items-center gap-2">
                    {biz.whatsapp && (
                      <a
                        href={`https://wa.me/${biz.whatsapp.replace(/\D/g, "")}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex-1 py-1.5 px-2 bg-green-500 text-white text-xs font-bold rounded-lg text-center hover:bg-green-600 transition-colors"
                      >
                        💬 WA
                      </a>
                    )}
                    <Link
                      href={`/?focus=${biz.slug}&lat=${biz.latitude}&lng=${biz.longitude}`}
                      className="flex-1 py-1.5 px-2 bg-orange/10 text-orange text-xs font-bold rounded-lg text-center hover:bg-orange/20 transition-colors"
                    >
                      🗺️ Map
                    </Link>
                    <Link
                      href={`/business/${biz.slug}`}
                      className="flex-1 py-1.5 px-2 bg-gray-100 text-navy text-xs font-bold rounded-lg text-center hover:bg-gray-200 transition-colors"
                    >
                      Details →
                    </Link>
                  </div>
                </div>
              </div>
            )
          })}
        </div>
        <Pagination path={`/locality/${params.slug}`} page={page} total={total} />
      </div>
    </div>
  )
}
