import type { Metadata } from "next"
import { notFound } from "next/navigation"
import Link from "next/link"
import { Clock, Calendar, ArrowLeft, Share2, MapPin, CheckCircle2, BookOpen } from "lucide-react"
import { KATRAJ_GUIDES } from "@/lib/guides/data"
import { jsonLd } from "@/lib/seo"

export async function generateStaticParams() {
  return KATRAJ_GUIDES.map((guide) => ({
    slug: guide.slug,
  }))
}

export async function generateMetadata({
  params,
}: {
  params: { slug: string }
}): Promise<Metadata> {
  const guide = KATRAJ_GUIDES.find((g) => g.slug === params.slug)
  if (!guide) return { title: "Guide Not Found — KatrajPune" }

  return {
    title: `${guide.metaTitle} — KatrajPune`,
    description: guide.description,
    alternates: { canonical: `/guides/${guide.slug}` },
    openGraph: {
      title: `${guide.title} — KatrajPune`,
      description: guide.description,
      url: `/guides/${guide.slug}`,
      type: "article",
      images: [guide.coverImage],
    },
  }
}

export default function GuideDetailPage({
  params,
}: {
  params: { slug: string }
}) {
  const guide = KATRAJ_GUIDES.find((g) => g.slug === params.slug)
  if (!guide) notFound()

  const articleSchema = {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: guide.title,
    description: guide.description,
    image: [guide.coverImage],
    datePublished: guide.publishedDate,
    dateModified: guide.updatedDate,
    author: {
      "@type": "Person",
      name: guide.author.name,
      jobTitle: guide.author.role,
      worksFor: {
        "@type": "Organization",
        name: "KatrajPune.com",
        url: "https://katrajpune.com",
      },
    },
    publisher: {
      "@type": "Organization",
      name: "KatrajPune",
      logo: {
        "@type": "ImageObject",
        url: "https://katrajpune.com/icon-512.png",
      },
    },
    mainEntityOfPage: `https://katrajpune.com/guides/${guide.slug}`,
  }

  const relatedGuides = KATRAJ_GUIDES.filter((g) => g.slug !== guide.slug).slice(0, 3)

  return (
    <div className="min-h-screen bg-background">
      {/* Schema.org Article JSON-LD */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: jsonLd(articleSchema) }}
      />

      <article className="max-w-4xl mx-auto px-4 sm:px-6 py-10 space-y-8 text-navy">
        {/* Breadcrumb Navigation */}
        <nav className="flex items-center gap-2 text-xs text-gray-500 flex-wrap">
          <Link href="/" className="hover:text-navy transition-colors">Home</Link>
          <span>/</span>
          <Link href="/guides" className="hover:text-navy transition-colors">Local Guides</Link>
          <span>/</span>
          <span className="text-navy font-semibold truncate max-w-xs">{guide.title}</span>
        </nav>

        {/* Article Header */}
        <header className="space-y-4 border-b border-navy/10 pb-6">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-orange/10 text-orange text-xs font-bold uppercase tracking-wider">
            <span>{guide.category}</span>
          </div>

          <h1 className="text-2xl sm:text-4xl lg:text-5xl font-black text-navy tracking-tight leading-tight">
            {guide.title}
          </h1>

          <p className="text-sm sm:text-base text-gray-600 leading-relaxed">
            {guide.description}
          </p>

          <div className="flex flex-wrap items-center gap-4 text-xs text-gray-500 pt-2">
            <span className="flex items-center gap-1.5">
              <Calendar className="w-3.5 h-3.5 text-orange" /> Published: {guide.publishedDate}
            </span>
            <span>•</span>
            <span className="flex items-center gap-1.5">
              <Clock className="w-3.5 h-3.5 text-orange" /> {guide.readTime}
            </span>
            <span>•</span>
            <span>Curated by <strong>{guide.author.name}</strong> ({guide.author.role})</span>
          </div>
        </header>

        {/* Featured Image */}
        <div className="rounded-2xl overflow-hidden shadow-md border border-navy/10 h-72 sm:h-96 bg-gray-100">
          <img
            src={guide.coverImage}
            alt={guide.title}
            className="w-full h-full object-cover"
          />
        </div>

        {/* Key Takeaways Callout */}
        {guide.highlights && guide.highlights.length > 0 && (
          <div className="p-6 rounded-2xl bg-gradient-to-br from-amber-50 to-orange/5 border border-amber-200/80 space-y-3">
            <h3 className="text-sm font-bold text-amber-950 uppercase tracking-wider flex items-center gap-1.5">
              <CheckCircle2 className="w-4 h-4 text-orange" />
              <span>Key Local Takeaways</span>
            </h3>
            <ul className="space-y-2 text-xs sm:text-sm text-gray-800">
              {guide.highlights.map((h, i) => (
                <li key={i} className="flex items-start gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-orange mt-2 shrink-0" />
                  <span>{h}</span>
                </li>
              ))}
            </ul>
          </div>
        )}

        {/* Article Body Content */}
        <div
          className="prose prose-navy max-w-none prose-headings:font-bold prose-headings:text-navy prose-h2:text-2xl prose-h2:mt-8 prose-h2:mb-3 prose-p:text-gray-700 prose-p:leading-relaxed prose-p:text-sm sm:prose-p:text-base prose-li:text-sm sm:prose-li:text-base prose-table:w-full prose-table:text-sm prose-th:bg-navy/5 prose-th:p-3 prose-td:p-3 prose-td:border-b prose-td:border-navy/10"
          dangerouslySetInnerHTML={{ __html: guide.contentHtml }}
        />

        {/* Author Footer Card */}
        <div className="p-6 bg-white rounded-2xl border border-navy/10 flex items-center gap-4 shadow-sm">
          <div className="w-12 h-12 rounded-full bg-navy text-white flex items-center justify-center font-bold text-lg shrink-0">
            KP
          </div>
          <div className="space-y-0.5">
            <h4 className="text-sm font-bold text-navy">{guide.author.name}</h4>
            <p className="text-xs text-gray-500">{guide.author.role}</p>
            <p className="text-xs text-gray-600 pt-1">
              Curating verified directory records, transit timetables, and local community guides for Katraj, Pune (PIN 411046).
            </p>
          </div>
        </div>

        {/* Related Guides */}
        {relatedGuides.length > 0 && (
          <div className="pt-8 border-t border-navy/10 space-y-4">
            <h3 className="text-lg font-bold text-navy">More Guides &amp; Insights</h3>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              {relatedGuides.map((rel) => (
                <Link
                  key={rel.slug}
                  href={`/guides/${rel.slug}`}
                  className="p-4 rounded-xl border border-navy/10 bg-white hover:border-orange/50 hover:shadow-sm transition-all flex flex-col justify-between"
                >
                  <div className="space-y-1">
                    <span className="text-[10px] font-bold uppercase tracking-wider text-orange">
                      {rel.category}
                    </span>
                    <h4 className="text-xs font-bold text-navy line-clamp-2">
                      {rel.title}
                    </h4>
                  </div>
                  <span className="text-[11px] text-gray-400 mt-3 pt-2 border-t border-navy/5 block">
                    {rel.readTime}
                  </span>
                </Link>
              ))}
            </div>
          </div>
        )}
      </article>
    </div>
  )
}
