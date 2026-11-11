import { jsonLd, localitySlug } from "@/lib/seo"
import { getBusinessBySlug, getAllApprovedBusinesses } from "@/lib/data/businesses"
import { Business } from "@/types/business"
import { notFound } from "next/navigation"
import Link from "next/link"
import { getMarkerEmoji } from "@/lib/markers"
import DhanDematBanner from "@/components/ads/DhanDematBanner"
import DynamicAdBanner from "@/components/ads/DynamicAdBanner"
import ZotozAuditBanner from "@/components/promo/ZotozAuditBanner"

export const dynamic = "force-dynamic"

export async function generateMetadata({ params }: { params: { slug: string } }) {
  const business = await getBusinessBySlug(params.slug)

  if (!business) {
    return { title: "Business Not Found — KatrajPune" }
  }

  const title = `${business.name} in ${business.locality || "Katraj"}, Pune`
  const description = business.description
    ? `${business.name} — ${business.category.replace("_", " ")} in ${business.locality}, Katraj, Pune. ${business.description}`
    : `Find ${business.name}, a ${business.category.replace("_", " ")} business in ${business.locality}, Katraj, Pune.`

  return {
    title,
    description,
    openGraph: {
      title,
      description,
      type: "website",
      url: `https://katrajpune.com/business/${params.slug}`,
      siteName: "KatrajPune",
      images: business.photos && business.photos.length > 0 ? [business.photos[0]] : undefined,
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: business.photos && business.photos.length > 0 ? [business.photos[0]] : undefined,
    },
    alternates: {
      canonical: `https://katrajpune.com/business/${params.slug}`,
    },
    other: {
      "geo.region": "IN-MH",
      "geo.placename": `${business.locality || "Katraj"}, Pune, Maharashtra, India`,
      "geo.position": `${business.latitude};${business.longitude}`,
      ICBM: `${business.latitude}, ${business.longitude}`,
    },
  }
}

export default async function BusinessProfilePage({
  params,
}: {
  params: { slug: string }
}) {
  const business = await getBusinessBySlug(params.slug)

  if (!business) {
    notFound()
  }

  const categoryLabel = business.category.replace(/_/g, " ")
  const categoryColor = getCategoryColor(business.category)
  const openingHours = (business.opening_hours as Record<string, string> | null) || {}
  const currentDay = new Date()
    .toLocaleDateString("en-US", { weekday: "short", timeZone: "Asia/Kolkata" })
    .toLowerCase() as string
  const isOpenToday = !!openingHours[currentDay] && openingHours[currentDay] !== "closed"

  const heroImage =
    business.photos && business.photos.length > 0 ? business.photos[0] : business.logo_url || null
  const schemaType = getSchemaType(business.category)
  const whatsappUrl = business.whatsapp
    ? `https://wa.me/${business.whatsapp.replace(/[^0-9]/g, "")}`
    : null

  // Fetch related/nearby businesses for internal linking (SEO crawl graph & topical authority)
  const allBusinesses = await getAllApprovedBusinesses()
  const relatedBusinesses = allBusinesses
    .filter(
      (b) =>
        b.slug !== business.slug &&
        (b.locality === business.locality || b.category === business.category)
    )
    .slice(0, 4)

  // Direct Answer / AEO Q&A data
  const faqs = [
    {
      question: `Where is ${business.name} located in Katraj, Pune?`,
      answer: `${business.name} is located at ${business.address || `${business.locality || "Katraj"}, Pune, Maharashtra 411046`}. Exact GPS coordinates: Latitude ${business.latitude.toFixed(5)}, Longitude ${business.longitude.toFixed(5)}.`,
    },
    {
      question: `How can I contact ${business.name} or reach out via WhatsApp?`,
      answer: business.whatsapp || business.phone
        ? `You can reach ${business.name} directly via WhatsApp or phone at ${business.whatsapp || business.phone}.`
        : `${business.name} is a verified listing under ${categoryLabel} on KatrajPune.com.`,
    },
    {
      question: `What is the rating and customer feedback for ${business.name}?`,
      answer: business.rating
        ? `${business.name} has a rating of ${business.rating} out of 5 based on ${business.reviews_count || 1} review(s) in ${business.locality || "Katraj"}, Pune.`
        : `${business.name} is a verified ${categoryLabel} business located in Katraj, Pune.`,
    },
  ]

  const jsonLdGraph = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": schemaType,
        "@id": `https://katrajpune.com/business/${business.slug}#business`,
        name: business.name,
        description: business.description || `${business.name} in ${business.locality || "Katraj"}, Pune`,
        image: heroImage,
        url: `https://katrajpune.com/business/${business.slug}`,
        telephone: business.phone || business.whatsapp || undefined,
        sameAs: whatsappUrl ? [whatsappUrl] : undefined,
        mainEntityOfPage: `https://katrajpune.com/business/${business.slug}`,
        address: {
          "@type": "PostalAddress",
          streetAddress: business.address || "Katraj",
          addressLocality: business.locality || "Katraj",
          addressRegion: "Maharashtra",
          postalCode: business.address?.match(/\b4\d{5}\b/)?.[0] || "411046",
          addressCountry: "IN",
        },
        geo: {
          "@type": "GeoCoordinates",
          latitude: business.latitude,
          longitude: business.longitude,
        },
        hasMap: `https://www.google.com/maps/search/?api=1&query=${business.latitude},${business.longitude}`,
        priceRange: "₹₹",
        areaServed: [
          {
            "@type": "AdministrativeArea",
            name: business.locality || "Katraj",
          },
          {
            "@type": "City",
            name: "Pune",
          },
        ],
        ...(business.rating
          ? {
              aggregateRating: {
                "@type": "AggregateRating",
                ratingValue: Number(business.rating),
                reviewCount: Number(business.reviews_count || 1),
                bestRating: "5",
                worstRating: "1",
              },
            }
          : {}),
      },
      {
        "@type": "FAQPage",
        "@id": `https://katrajpune.com/business/${business.slug}#faq`,
        mainEntity: faqs.map((f) => ({
          "@type": "Question",
          name: f.question,
          acceptedAnswer: {
            "@type": "Answer",
            text: f.answer,
          },
        })),
      },
      {
        "@type": "BreadcrumbList",
        "@id": `https://katrajpune.com/business/${business.slug}#breadcrumb`,
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
            name: "Directory",
            item: "https://katrajpune.com/directory",
          },
          {
            "@type": "ListItem",
            position: 3,
            name: categoryLabel,
            item: `https://katrajpune.com/category/${business.category}`,
          },
          {
            "@type": "ListItem",
            position: 4,
            name: business.name,
            item: `https://katrajpune.com/business/${business.slug}`,
          },
        ],
      },
    ],
  }

  return (
    <div className="min-h-screen bg-background">
      {/* JSON-LD structured data for SEO, GEO & AEO */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: jsonLd(jsonLdGraph) }}
      />

      {/* Header / hero */}
      {(() => {
        const heroImage = business.logo_url || (business.photos && business.photos.length > 0 ? business.photos[0] : null)
        return (
          <header className="relative h-64 overflow-hidden">
            {heroImage ? (
              <img
                src={heroImage}
                alt={business.name}
                className="w-full h-full object-cover"
              />
            ) : (
              <div className="w-full h-full bg-gradient-to-br from-navy to-blue flex items-center justify-center">
                <span className="text-6xl">{getMarkerEmoji(business.category)}</span>
              </div>
            )}
            <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent"></div>
            <div className="absolute bottom-6 left-6 right-6">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/90 backdrop-blur text-sm font-bold uppercase tracking-wider" style={{ backgroundColor: categoryColor + "20", color: categoryColor }}>
                {categoryLabel}
              </div>
              {business.location_verified && (
                <span className="ml-2 inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/95 backdrop-blur text-navy text-xs font-extrabold shadow-sm border border-amber-300">
                  <img
                    src="/images/katraj-verified-seal.jpg"
                    alt="Verified Seal"
                    className="w-4 h-4 rounded-full object-cover"
                  />
                  <span>Verified Merchant</span>
                </span>
              )}
            </div>
          </header>
        )
      })()}

      <div className="max-w-4xl mx-auto pt-6 pb-12 px-4 sm:px-6 lg:px-8">
        <section className="bg-white border rounded-xl p-4 mb-6 text-sm">
          <h2 className="font-bold">Find {business.name} in {business.locality || "Katraj"}</h2>
          <p>{business.name} is listed under {categoryLabel} in {business.locality || "Katraj"}, Pune. {business.address ? `Address: ${business.address}.` : "Contact the business to confirm its address."} Confirm current opening hours and services before visiting.</p>
          {business.locality && <Link className="underline" href={`/locality/${localitySlug(business.locality)}`}>More businesses in {business.locality}</Link>}
        </section>
        {/* Breadcrumb */}
        <nav className="flex items-center gap-2 text-sm text-navy/50 mb-6 flex-wrap">
          <a href="/" className="hover:text-navy transition-colors">KatrajPune</a>
          <span>/</span>
          <a href="/directory" className="hover:text-navy transition-colors">Directory</a>
          <span>/</span>
          <a href={`/category/${business.category}`} className="hover:text-navy transition-colors">{categoryLabel}</a>
          <span>/</span>
          <span className="text-navy font-semibold">{business.name}</span>
        </nav>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left column: Business details card */}
          <div className="lg:col-span-2 space-y-6">
            <div className="bg-white rounded-2xl shadow-sm border border-navy/10 overflow-hidden">
              <div className="p-6">
                <div className="flex items-start justify-between gap-4 mb-2">
                  <h1 className="text-2xl font-bold text-navy leading-tight">{business.name}</h1>
                  {isOpenToday ? (
                    <span className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-green-50 text-green-700 text-sm font-semibold">
                      <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></span> Open
                    </span>
                  ) : (
                    <span className="px-3 py-1 rounded-full bg-gray-100 text-gray-600 text-sm font-semibold">Closed</span>
                  )}
                </div>
                {business.locality && (
                  <p className="text-blue-600 font-medium text-sm mb-2">{business.locality}, Katraj, Pune</p>
                )}
                {business.rating && (
                  <div className="flex items-center gap-2 mb-4">
                    <span className="flex items-center gap-1 bg-amber-50 text-amber-800 font-bold px-2.5 py-1 rounded-lg text-sm border border-amber-200">
                      ★ {business.rating.toFixed(1)}
                    </span>
                    {business.reviews_count ? (
                      <span className="text-sm text-gray-500">
                        ({business.reviews_count} Google reviews)
                      </span>
                    ) : null}
                  </div>
                )}
                {business.description && (
                  <p className="text-gray-700 leading-relaxed mb-6">{business.description}</p>
                )}

                {/* Contact info */}
                <div className="space-y-4">
                  <div className="flex items-start gap-4">
                    <div className="w-10 h-10 rounded-lg bg-blue-50 flex items-center justify-center text-blue-600 shrink-0">
                      📍
                    </div>
                    <div>
                      <p className="text-sm font-semibold text-navy">Address</p>
                      <p className="text-gray-600 text-sm">{business.address}</p>
                    </div>
                  </div>
                  {business.phone && (
                    <div className="flex items-start gap-4">
                      <div className="w-10 h-10 rounded-lg bg-blue-50 flex items-center justify-center text-blue-600 shrink-0">
                        📞
                      </div>
                      <div>
                        <p className="text-sm font-semibold text-navy">Phone</p>
                        <p className="text-gray-600 text-sm">{business.phone}</p>
                      </div>
                    </div>
                  )}
                  {business.whatsapp && (
                    <div className="flex items-start gap-4">
                      <div className="w-10 h-10 rounded-lg bg-green-50 flex items-center justify-center text-green-600 shrink-0">
                        💬
                      </div>
                      <div>
                        <p className="text-sm font-semibold text-navy">WhatsApp</p>
                        <p className="text-gray-600 text-sm">{business.whatsapp}</p>
                      </div>
                    </div>
                  )}
                  {business.email && (
                    <div className="flex items-start gap-4">
                      <div className="w-10 h-10 rounded-lg bg-blue-50 flex items-center justify-center text-blue-600 shrink-0">
                        ✉️
                      </div>
                      <div>
                        <p className="text-sm font-semibold text-navy">Email</p>
                        <p className="text-gray-600 text-sm">{business.email}</p>
                      </div>
                    </div>
                  )}
                  {business.website && (
                    <div className="flex items-start gap-4">
                      <div className="w-10 h-10 rounded-lg bg-blue-50 flex items-center justify-center text-blue-600 shrink-0">
                        🌐
                      </div>
                      <div>
                        <p className="text-sm font-semibold text-navy">Website</p>
                        <a
                          href={business.website}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-blue-600 text-sm hover:underline"
                        >
                          {business.website}
                        </a>
                      </div>
                    </div>
                  )}
                </div>

                {/* Opening hours */}
                {openingHours && Object.keys(openingHours).length > 0 && (
                  <div className="pt-6 border-t border-navy/5">
                    <h3 className="text-sm font-bold text-navy uppercase tracking-wider mb-4">Opening Hours</h3>
                    <div className="space-y-2">
                      {Object.entries(openingHours).map(([day, hours]) => (
                        <div key={day} className="flex justify-between text-sm">
                          <span className={`
                            font-medium capitalize ${day === currentDay ? "text-navy" : "text-gray-600"}
                          `}>
                            {day.charAt(0).toUpperCase() + day.slice(1)}
                          </span>
                          <span className="text-gray-600">{hours === "closed" ? "Closed" : hours}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Action buttons */}
            <div className="bg-white rounded-2xl shadow-sm border border-navy/10 p-6">
              <h3 className="text-sm font-bold text-navy uppercase tracking-wider mb-4">Contact & Directions</h3>
              <div className="space-y-3">
                {business.phone && (
                  <a
                    href={`tel:${business.phone}`}
                    className="flex items-center gap-3 w-full px-4 py-3 bg-navy text-white text-sm font-medium rounded-xl text-center hover:bg-blue transition-colors"
                  >
                    📞 Call Now
                  </a>
                )}
                {business.whatsapp && (
                  <a
                    href={`https://wa.me/${business.whatsapp.replace(/\+/g, "")}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-3 w-full px-4 py-3 bg-green-500 text-white text-sm font-medium rounded-xl text-center hover:bg-green-600 transition-colors"
                  >
                    💬 WhatsApp
                  </a>
                )}
                <a
                  href={`https://www.google.com/maps/dir/?api=1&destination=${business.latitude},${business.longitude}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-3 w-full px-4 py-3 bg-orange text-white text-sm font-medium rounded-xl text-center hover:bg-orange/90 transition-colors"
                >
                  🗺️ Get Directions
                </a>
                <a
                  href={`/?focus=${business.slug}&lat=${business.latitude}&lng=${business.longitude}`}
                  className="flex items-center gap-3 w-full px-4 py-3 bg-gray-100 text-gray-700 text-sm font-medium rounded-xl hover:bg-gray-200 transition-colors"
                >
                  📍 View on Map
                </a>
              </div>
            </div>

            {/* Photos */}
            {business.photos && business.photos.length > 0 && (
              <div className="bg-white rounded-2xl shadow-sm border border-navy/10 p-6">
                <h3 className="text-sm font-bold text-navy uppercase tracking-wider mb-4">Photos</h3>
                <div className="grid grid-cols-3 gap-3">
                  {business.photos.map((photo: string, i: number) => (
                    <img
                      key={i}
                      loading="lazy"
                      src={photo}
                      alt={business.name}
                      className="w-full h-32 object-cover rounded-xl"
                    />
                  ))}
                </div>
              </div>
            )}

            {/* AEO / AI Search Direct Answer Q&A Section */}
            <div className="bg-white rounded-2xl shadow-sm border border-navy/10 p-6 space-y-4">
              <div className="flex items-center gap-2">
                <span className="text-xl">🤖</span>
                <div>
                  <h3 className="text-sm font-bold text-navy uppercase tracking-wider">
                    Frequently Asked Questions (AI &amp; Local Search)
                  </h3>
                  <p className="text-xs text-gray-500">
                    Direct answers for search engines and AI assistants
                  </p>
                </div>
              </div>
              <div className="space-y-3 pt-2">
                {faqs.map((faq, idx) => (
                  <div key={idx} className="border-b border-navy/5 pb-3 last:border-b-0 last:pb-0">
                    <h4 className="text-sm font-bold text-navy mb-1">{faq.question}</h4>
                    <p className="text-xs text-gray-600 leading-relaxed">{faq.answer}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Right column: mini map + quick facts */}
          <div className="lg:col-span-1 space-y-6">
            <div className="bg-white rounded-2xl shadow-sm border border-navy/10 overflow-hidden h-fit">
              <div className="relative h-52 overflow-hidden bg-gray-100">
                <iframe
                  title={`Map location of ${business.name}`}
                  width="100%"
                  height="100%"
                  style={{ border: 0 }}
                  loading="lazy"
                  src={`https://maps.google.com/maps?q=${business.latitude},${business.longitude}&zoom=15&output=embed`}
                />
              </div>
              <div className="p-4">
                <h3 className="text-sm font-bold text-navy uppercase tracking-wider mb-2">Location</h3>
                <p className="text-xs text-gray-500 font-mono mb-3">{business.latitude.toFixed(5)}, {business.longitude.toFixed(5)}</p>
                <a
                  href={`https://www.google.com/maps/search/?api=1&query=${business.latitude},${business.longitude}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="block w-full px-4 py-2 bg-blue-50 text-blue-600 text-sm font-medium rounded-xl text-center hover:bg-blue-100 transition-colors"
                >
                  Open in Google Maps ↗
                </a>
              </div>
            </div>

            {/* Dynamic Ad Placement */}
            <DynamicAdBanner placement="business_profile" />

            {/* Claim Listing Card */}
            <div className="bg-gradient-to-br from-navy/[0.03] via-amber-50/40 to-white rounded-2xl shadow-sm border border-amber-200/80 p-5 space-y-3.5">
              <div className="flex items-center gap-3">
                <img
                  src="/images/katraj-verified-seal.jpg"
                  alt="KatrajPune Official Verified Seal"
                  className="w-12 h-12 rounded-full shadow-md border border-amber-300 shrink-0 object-cover"
                />
                <div>
                  <span className="text-[10px] font-bold uppercase tracking-wider text-amber-800 bg-amber-100/80 px-2 py-0.5 rounded-full inline-block mb-0.5">
                    Official Verification
                  </span>
                  <h4 className="text-sm font-bold text-navy">Claim &amp; Verify Listing</h4>
                </div>
              </div>
              <p className="text-xs text-gray-600 leading-relaxed">
                Are you the owner of <strong>{business.name}</strong>? Get official verification, direct customer WhatsApp inquiries, and earn the <strong>KatrajPune Gold Verified Seal</strong> for <strong>₹350/year</strong>.
              </p>
              <div className="space-y-2 pt-1">
                <Link
                  href={`/claim?slug=${business.slug}`}
                  className="w-full bg-emerald-600 hover:bg-emerald-700 text-white font-extrabold text-xs py-2.5 px-4 rounded-xl flex items-center justify-center gap-1.5 shadow-sm transition-all text-center"
                >
                  <span>Claim &amp; Get Verified Seal (₹350)</span>
                  <span>→</span>
                </Link>
                <p className="text-[11px] text-gray-500 text-center">
                  Verification &amp; listing activation within 24–48 hours.
                </p>
              </div>
            </div>

            {/* Zotoz AI Visibility Audit Promo */}
            <ZotozAuditBanner variant="card" businessName={business.name} />

            <div className="bg-white rounded-2xl shadow-sm border border-navy/10 p-6">
              <h3 className="text-sm font-bold text-navy uppercase tracking-wider mb-4">Quick Facts</h3>
              <div className="space-y-4">
                <div className="flex justify-between text-sm border-b border-navy/5 pb-2 last:border-none last:pb-0">
                  <span className="text-gray-600">Category</span>
                  <span className="font-medium text-navy">{categoryLabel}</span>
                </div>
                <div className="flex justify-between text-sm border-b border-navy/5 pb-2 last:border-none last:pb-0">
                  <span className="text-gray-600">Locality</span>
                  <span className="font-medium text-navy">{business.locality}</span>
                </div>
                <div className="flex justify-between text-sm border-b border-navy/5 pb-2 last:border-none last:pb-0">
                  <span className="text-gray-600">Verified</span>
                  <span className={`font-medium ${business.location_verified ? "text-green-600" : "text-gray-600"}`}>
                    {business.location_verified ? "Yes" : "No"}
                  </span>
                </div>
                <div className="flex justify-between text-sm border-b border-navy/5 pb-2 last:border-none last:pb-0">
                  <span className="text-gray-600">Status</span>
                  <span className="font-medium text-navy">Approved</span>
                </div>
              </div>
            </div>

            {/* Sponsored Dhan Demat Card in Sidebar */}
            <DhanDematBanner variant="card" />
          </div>
        </div>

        {/* SEO & GEO Cross-Linking: Nearby & Similar Businesses in Katraj */}
        {relatedBusinesses.length > 0 && (
          <div className="mt-10 pt-8 border-t border-navy/10">
            <div className="flex items-center justify-between mb-4 flex-wrap gap-2">
              <div>
                <h3 className="text-lg font-bold text-navy">
                  More {categoryLabel} &amp; Nearby in {business.locality || "Katraj"}
                </h3>
                <p className="text-xs text-gray-500">
                  Explore other verified local services and shops in Pune 411046
                </p>
              </div>
              <Link
                href={`/locality/${localitySlug(business.locality || "Katraj")}`}
                className="text-xs font-bold text-orange hover:underline"
              >
                View all in {business.locality || "Katraj"} →
              </Link>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              {relatedBusinesses.map((rel) => (
                <Link
                  key={rel.slug}
                  href={`/business/${rel.slug}`}
                  className="group bg-white rounded-xl border border-navy/10 p-4 hover:border-orange/40 hover:shadow-md transition-all flex flex-col justify-between"
                >
                  <div>
                    <span className="text-[11px] font-bold text-gray-400 uppercase tracking-wider">
                      {rel.category.replace(/_/g, " ")}
                    </span>
                    <h4 className="font-bold text-navy text-sm mt-1 group-hover:text-orange transition-colors line-clamp-1">
                      {rel.name}
                    </h4>
                    <p className="text-xs text-gray-500 mt-1 line-clamp-1">
                      📍 {rel.locality || "Katraj"}
                    </p>
                  </div>
                  <div className="mt-3 pt-2 border-t border-navy/5 flex items-center justify-between text-xs">
                    {rel.rating ? (
                      <span className="text-amber-600 font-semibold flex items-center gap-1">
                        ★ {rel.rating} ({rel.reviews_count || 1})
                      </span>
                    ) : (
                      <span className="text-gray-400">Verified</span>
                    )}
                    <span className="text-orange font-bold group-hover:translate-x-0.5 transition-transform">
                      →
                    </span>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        )}

        {/* Bottom Full-Width Dhan Demat Banner */}
        <div className="mt-12">
          <DhanDematBanner variant="horizontal" />
        </div>
      </div>
    </div>
  )
}

function getCategoryColor(category: string): string {
  const colors: Record<string, string> = {
    shopping: "#10b981",
    restaurants: "#f43f5e",
    healthcare: "#3b82f6",
    education: "#8b5cf6",
    home_services: "#f59e0b",
    automotive: "#ef4444",
    fitness: "#06b6d4",
    professional_services: "#6366f1",
  }
  return colors[category] || "#10b981"
}

function getSchemaType(category: string): string {
  switch (category) {
    case "restaurants":
      return "Restaurant"
    case "healthcare":
      return "MedicalBusiness"
    case "education":
      return "EducationalOrganization"
    case "shopping":
      return "Store"
    case "fitness":
      return "ExerciseGym"
    case "automotive":
      return "AutoRepair"
    case "home_services":
      return "HomeAndConstructionBusiness"
    case "professional_services":
      return "ProfessionalService"
    default:
      return "LocalBusiness"
  }
}
