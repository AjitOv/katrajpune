import type { Metadata } from "next"
import Link from "next/link"
import { ShieldCheck, CheckCircle2, ArrowRight } from "lucide-react"

export const metadata: Metadata = {
  title: "About KatrajPune & Merchant Verification Standards",
  description:
    "How KatrajPune business listings work, what the official Gold Verified Seal means, and our directory listing standards.",
  alternates: { canonical: "/about" },
  openGraph: { title: "About KatrajPune & Verification Standards", url: "/about" },
}

export default function About() {
  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b border-navy/10 bg-white/95 backdrop-blur-md px-4 sm:px-6 py-3.5">
        <div className="max-w-4xl mx-auto flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2 group">
            <span className="text-xl">📍</span>
            <div className="flex items-center gap-1.5">
              <span className="text-xs font-black tracking-widest text-navy/60 uppercase">katraj</span>
              <span className="w-1.5 h-1.5 rounded-full bg-orange" />
              <span className="text-lg font-bold text-navy">pune</span>
            </div>
          </Link>
          <div className="flex items-center gap-4 text-xs font-bold text-navy">
            <Link href="/directory" className="hover:text-orange transition-colors">Directory</Link>
            <Link href="/claim" className="hover:text-orange transition-colors">Claim Listing</Link>
          </div>
        </div>
      </header>

      <main className="max-w-3xl mx-auto px-6 py-12 space-y-8 text-navy">
        <div className="space-y-3">
          <span className="text-xs font-bold uppercase tracking-wider text-orange">About Us</span>
          <h1 className="text-3xl sm:text-4xl font-black text-navy">
            About KatrajPune.com
          </h1>
          <p className="text-sm sm:text-base text-gray-600 leading-relaxed">
            KatrajPune is the hyperlocal commercial directory, search engine, and interactive map platform built specifically for the residents, students, and businesses of Katraj, Pune (PIN 411046).
          </p>
        </div>

        {/* Official Verification Seal Card */}
        <div className="bg-gradient-to-br from-navy via-[#162D4A] to-navy text-white rounded-2xl p-6 sm:p-8 shadow-sm border border-amber-400/30 flex flex-col sm:flex-row items-center gap-6">
          <img
            src="/images/katraj-verified-seal.jpg"
            alt="Official KatrajPune Verified Seal"
            className="w-28 h-28 rounded-full shadow-2xl border-2 border-amber-400/60 object-cover shrink-0"
          />
          <div className="space-y-2 text-center sm:text-left">
            <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-amber-400/20 text-amber-300 text-[11px] font-bold uppercase tracking-wider">
              <ShieldCheck className="w-3.5 h-3.5" />
              <span>Official Accreditation</span>
            </div>
            <h2 className="text-lg font-bold text-white">
              The KatrajPune Verified Trust Seal
            </h2>
            <p className="text-xs text-gray-300 leading-relaxed">
              When you see the Gold Verified Seal on a business profile or shop storefront, it certifies that the business owner or manager has verified their physical location, direct WhatsApp contact details, and operating hours with our directory team.
            </p>
          </div>
        </div>

        <section className="space-y-3">
          <h2 className="text-xl font-bold text-navy">Listing Information &amp; Verification</h2>
          <p className="text-sm text-gray-600 leading-relaxed">
            Profiles index available business names, categories, addresses, GPS map coordinates, and contact details. A location verification badge confirms verified geocoding and merchant claim; it does not constitute a warranty of specific service quality. Confirm hours and prices directly with the merchant before visiting.
          </p>
        </section>

        <section className="space-y-3">
          <h2 className="text-xl font-bold text-navy">Ratings &amp; Directory Reference</h2>
          <p className="text-sm text-gray-600 leading-relaxed">
            Imported Google Maps ratings and review counts are indexed as directory reference data. Listing claims and sponsor badges give business owners ownership of their communication channels and priority placement in category searches.
          </p>
        </section>

        <section className="space-y-3">
          <h2 className="text-xl font-bold text-navy">For Business Owners &amp; Healthcare Clinics</h2>
          <p className="text-sm text-gray-600 leading-relaxed">
            Are you a shop owner, clinic head, or service professional in Katraj? Claim your verified listing to display direct WhatsApp contact buttons and the official verification seal.
          </p>
          <div className="flex flex-wrap gap-3 pt-2">
            <Link
              href="/claim"
              className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-orange hover:bg-orange/90 text-white font-bold text-xs shadow-sm transition-all"
            >
              <span>Claim Your Listing</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
            <Link
              href="/add-business"
              className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-navy hover:bg-navy/90 text-white font-bold text-xs shadow-sm transition-all"
            >
              <span>+ List New Business</span>
            </Link>
          </div>
        </section>

        <div className="pt-6 border-t border-navy/10 text-xs text-gray-500">
          <p>
            Have questions or want to request a listing update? Message us directly on WhatsApp at{" "}
            <a
              href="https://wa.me/917020888195"
              target="_blank"
              rel="noopener noreferrer"
              className="text-emerald-700 font-bold underline"
            >
              +91 70208 88195
            </a>.
          </p>
        </div>
      </main>
    </div>
  )
}
