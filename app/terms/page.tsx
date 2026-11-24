import type { Metadata } from "next"
import Link from "next/link"
import { FileText, ShieldAlert, CheckCircle2 } from "lucide-react"

export const metadata: Metadata = {
  title: "Terms of Service — KatrajPune.com",
  description:
    "Terms of Service governing the use of KatrajPune.com, directory listing claims, advertising policies, and intellectual property.",
  alternates: { canonical: "/terms" },
  openGraph: { title: "Terms of Service — KatrajPune.com", url: "/terms" },
}

export default function TermsOfServicePage() {
  return (
    <div className="min-h-screen bg-background">
      <main className="max-w-4xl mx-auto px-4 sm:px-6 py-12 space-y-10 text-navy">
        {/* Header */}
        <div className="border-b border-navy/10 pb-8 space-y-3">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-50 text-blue-700 text-xs font-bold uppercase tracking-wider">
            <FileText className="w-4 h-4" />
            <span>User Agreement</span>
          </div>
          <h1 className="text-3xl sm:text-5xl font-black text-navy tracking-tight">
            Terms of Service
          </h1>
          <p className="text-sm text-gray-500">
            Last Updated: November 24, 2026 • Effective Date: November 24, 2026
          </p>
        </div>

        <section className="space-y-4">
          <h2 className="text-xl sm:text-2xl font-bold text-navy">1. Acceptance of Terms</h2>
          <p className="text-sm text-gray-700 leading-relaxed">
            By accessing or using KatrajPune.com (the "Platform"), you agree to be bound by these Terms of Service and our Privacy Policy. If you do not agree to these terms, please do not use our website or directory services.
          </p>
        </section>

        <section className="space-y-4">
          <h2 className="text-xl sm:text-2xl font-bold text-navy">2. Nature of Directory Services</h2>
          <p className="text-sm text-gray-700 leading-relaxed">
            KatrajPune is a community-first digital directory and map indexing commercial, healthcare, educational, dining, and retail services in Katraj, Pune (PIN 411046). While we make every effort to curate accurate addresses, phone numbers, and coordinates, business information may change. Users are strongly advised to confirm opening hours, pricing, and availability directly with the merchant before visiting.
          </p>
        </section>

        <section className="space-y-4">
          <h2 className="text-xl sm:text-2xl font-bold text-navy">3. Business Listing Claims &amp; Verification</h2>
          <p className="text-sm text-gray-700 leading-relaxed">
            Business owners or authorized representatives may claim their listing to update operating details, store photos, and direct WhatsApp links. Verification fees (e.g. ₹350/year promotional plan) cover directory moderation, manual verification, and platform infrastructure. Verification does not constitute an endorsement, guarantee, or warranty of service quality by KatrajPune.com.
          </p>
        </section>

        <section className="space-y-4">
          <h2 className="text-xl sm:text-2xl font-bold text-navy">4. Advertising &amp; Third-Party Links</h2>
          <p className="text-sm text-gray-700 leading-relaxed">
            KatrajPune.com displays advertisements served by third-party advertising partners, including <strong>Google AdSense</strong>, as well as sponsored merchant cards and affiliate links. We do not endorse or assume liability for third-party products, services, or claims displayed in automated advertisements.
          </p>
        </section>

        <section className="space-y-4">
          <h2 className="text-xl sm:text-2xl font-bold text-navy">5. Intellectual Property Rights</h2>
          <p className="text-sm text-gray-700 leading-relaxed">
            All proprietary software code, custom map vector layers, original guides and articles, brand graphics, and directory structure on KatrajPune.com are the intellectual property of KatrajPune. Unauthorized bulk scraping, automated harvesting, or commercial redistribution of this catalog without written permission is strictly prohibited.
          </p>
        </section>

        <section className="space-y-4">
          <h2 className="text-xl sm:text-2xl font-bold text-navy">6. Limitation of Liability &amp; Governing Law</h2>
          <p className="text-sm text-gray-700 leading-relaxed">
            To the maximum extent permitted by Indian law, KatrajPune.com and its operators shall not be liable for any indirect, incidental, or consequential damages arising from the use of, or inability to use, directory information. These terms are governed by the laws of India, with exclusive jurisdiction in the courts of Pune, Maharashtra.
          </p>
        </section>

        <div className="pt-6 border-t border-navy/10 text-xs text-gray-500 flex flex-wrap gap-4 justify-between items-center">
          <p>© 2026 KatrajPune.com. All rights reserved.</p>
          <div className="flex gap-4">
            <Link href="/privacy" className="underline hover:text-navy">Privacy Policy</Link>
            <Link href="/contact" className="underline hover:text-navy">Contact Us</Link>
            <Link href="/about" className="underline hover:text-navy">About Us</Link>
          </div>
        </div>
      </main>
    </div>
  )
}
