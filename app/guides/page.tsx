import type { Metadata } from "next"
import Link from "next/link"
import { BookOpen, Clock, Calendar, ArrowRight, Sparkles, MapPin, CheckCircle2 } from "lucide-react"
import { KATRAJ_GUIDES } from "@/lib/guides/data"

export const metadata: Metadata = {
  title: "Katraj Local Guides & City Magazine — KatrajPune.com",
  description:
    "Authoritative local guides, transit roadmaps, food reviews, and student living tips curated for Katraj, Pune (PIN 411046).",
  alternates: { canonical: "/guides" },
  openGraph: {
    title: "Katraj Local Guides & City Magazine — KatrajPune.com",
    url: "/guides",
    description: "Curated local guides for Katraj residents, students, and visitors.",
  },
}

export default function GuidesDirectoryPage() {
  const categories = [
    { key: "all", label: "All Guides" },
    { key: "attractions", label: "Katraj Zoo & Parks" },
    { key: "food", label: "Food & Misal" },
    { key: "transit", label: "Bus & Transit" },
    { key: "student", label: "Student Living" },
    { key: "heritage", label: "History & Heritage" },
    { key: "emergency", label: "Emergency & Health" },
  ]

  return (
    <div className="min-h-screen bg-background">
      <main className="max-w-6xl mx-auto px-4 sm:px-6 py-12 space-y-12 text-navy">
        {/* Hero Section */}
        <div className="text-center max-w-3xl mx-auto space-y-4">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-orange/10 text-orange text-xs font-bold uppercase tracking-wider">
            <BookOpen className="w-4 h-4" />
            <span>Hyperlocal Editorial Hub</span>
          </div>
          <h1 className="text-3xl sm:text-5xl font-black text-navy tracking-tight leading-tight">
            Katraj Local Guides &amp; Insights
          </h1>
          <p className="text-sm sm:text-base text-gray-600 leading-relaxed max-w-2xl mx-auto">
            Deeply researched, verified local guides written for Katraj residents, daily commuters, and 50,000+ university students.
          </p>
        </div>

        {/* Featured Guide Hero Banner */}
        {KATRAJ_GUIDES[0] && (
          <div className="bg-gradient-to-br from-navy via-[#162D4A] to-navy rounded-3xl overflow-hidden shadow-lg border border-navy/20 grid grid-cols-1 lg:grid-cols-12 text-white">
            <div className="lg:col-span-7 p-6 sm:p-10 flex flex-col justify-between space-y-6">
              <div className="space-y-3">
                <div className="inline-flex items-center gap-1.5 px-3 py-0.5 rounded-full bg-amber-400/20 text-amber-300 text-xs font-bold uppercase tracking-wider">
                  <Sparkles className="w-3.5 h-3.5" />
                  <span>Featured City Guide</span>
                </div>
                <h2 className="text-2xl sm:text-3xl font-black leading-snug text-white">
                  <Link href={`/guides/${KATRAJ_GUIDES[0].slug}`} className="hover:text-amber-300 transition-colors">
                    {KATRAJ_GUIDES[0].title}
                  </Link>
                </h2>
                <p className="text-xs sm:text-sm text-gray-300 leading-relaxed">
                  {KATRAJ_GUIDES[0].description}
                </p>
              </div>

              <div className="flex flex-wrap items-center gap-4 text-xs text-gray-400 pt-2 border-t border-white/10">
                <span className="flex items-center gap-1.5">
                  <Clock className="w-3.5 h-3.5 text-amber-300" /> {KATRAJ_GUIDES[0].readTime}
                </span>
                <span>•</span>
                <span className="flex items-center gap-1.5">
                  <Calendar className="w-3.5 h-3.5 text-amber-300" /> {KATRAJ_GUIDES[0].publishedDate}
                </span>
                <span>•</span>
                <span>By {KATRAJ_GUIDES[0].author.name}</span>
                <Link
                  href={`/guides/${KATRAJ_GUIDES[0].slug}`}
                  className="ml-auto inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-orange hover:bg-orange/90 text-white font-extrabold text-xs shadow transition-all"
                >
                  <span>Read Complete Guide</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </Link>
              </div>
            </div>

            <div className="lg:col-span-5 relative min-h-[260px] lg:min-h-full">
              <img
                src={KATRAJ_GUIDES[0].coverImage}
                alt={KATRAJ_GUIDES[0].title}
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-navy/80 via-transparent to-transparent lg:hidden" />
            </div>
          </div>
        )}

        {/* Guides Grid */}
        <div className="space-y-6">
          <div className="flex items-center justify-between border-b border-navy/10 pb-4">
            <div>
              <h2 className="text-xl font-bold text-navy">All Curated Katraj Guides</h2>
              <p className="text-xs text-gray-500">Authentic insights from our local editorial board</p>
            </div>
            <span className="text-xs font-bold text-orange">{KATRAJ_GUIDES.length} Comprehensive Articles</span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {KATRAJ_GUIDES.slice(1).map((guide) => (
              <article
                key={guide.slug}
                className="bg-white rounded-2xl border border-navy/10 overflow-hidden shadow-sm hover:shadow-md hover:border-orange/40 transition-all flex flex-col justify-between group"
              >
                <div>
                  <div className="relative h-48 overflow-hidden bg-gray-100">
                    <img
                      src={guide.coverImage}
                      alt={guide.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                    <span className="absolute top-3 left-3 px-2.5 py-1 rounded-lg bg-navy/90 backdrop-blur-md text-[10px] font-bold text-white uppercase tracking-wider">
                      {guide.category}
                    </span>
                  </div>

                  <div className="p-5 space-y-2.5">
                    <div className="flex items-center gap-2 text-[11px] text-gray-500">
                      <Clock className="w-3 h-3 text-orange" />
                      <span>{guide.readTime}</span>
                      <span>•</span>
                      <span>{guide.publishedDate}</span>
                    </div>

                    <h3 className="font-bold text-navy text-base leading-snug group-hover:text-orange transition-colors">
                      <Link href={`/guides/${guide.slug}`}>
                        {guide.title}
                      </Link>
                    </h3>

                    <p className="text-xs text-gray-600 leading-relaxed line-clamp-3">
                      {guide.description}
                    </p>
                  </div>
                </div>

                <div className="p-5 pt-0">
                  <Link
                    href={`/guides/${guide.slug}`}
                    className="inline-flex items-center gap-1.5 text-xs font-bold text-orange group-hover:translate-x-1 transition-transform"
                  >
                    <span>Read Article</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </Link>
                </div>
              </article>
            ))}
          </div>
        </div>
      </main>
    </div>
  )
}
