import type { Metadata } from "next"
import Link from "next/link"
import { ShieldCheck, Lock, Cookie, Eye, Mail, FileText, CheckCircle2 } from "lucide-react"

export const metadata: Metadata = {
  title: "Privacy Policy — KatrajPune.com",
  description:
    "Privacy Policy for KatrajPune.com explaining our data collection, cookie usage, Google AdSense third-party disclosures, and user data rights under Indian and international privacy laws.",
  alternates: { canonical: "/privacy" },
  openGraph: { title: "Privacy Policy — KatrajPune.com", url: "/privacy" },
}

export default function PrivacyPolicyPage() {
  return (
    <div className="min-h-screen bg-background">
      <main className="max-w-4xl mx-auto px-4 sm:px-6 py-12 space-y-10 text-navy">
        {/* Header */}
        <div className="border-b border-navy/10 pb-8 space-y-3">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-50 text-blue-700 text-xs font-bold uppercase tracking-wider">
            <ShieldCheck className="w-4 h-4" />
            <span>Legal &amp; Privacy Compliance</span>
          </div>
          <h1 className="text-3xl sm:text-5xl font-black text-navy tracking-tight">
            Privacy Policy
          </h1>
          <p className="text-sm text-gray-500">
            Last Updated: November 24, 2026 • Effective Date: November 24, 2026
          </p>
        </div>

        {/* Executive Summary Callout */}
        <div className="p-6 rounded-2xl bg-gradient-to-br from-navy via-[#162D4A] to-navy text-white space-y-3 shadow-sm border border-navy/20">
          <h2 className="text-lg font-bold flex items-center gap-2 text-white">
            <Lock className="w-5 h-5 text-amber-300" />
            Our Core Privacy Commitment
          </h2>
          <p className="text-xs sm:text-sm text-gray-200 leading-relaxed">
            KatrajPune (<strong>katrajpune.com</strong>) respects your privacy. We are committed to transparency in our data practices, cookie usage, and our partnership with certified advertising networks, including <strong>Google AdSense</strong>. This policy details how your information is handled when you browse our hyperlocal directory, view interactive maps, or submit business inquiries.
          </p>
        </div>

        {/* Section 1: Information We Collect */}
        <section className="space-y-4">
          <h2 className="text-xl sm:text-2xl font-bold text-navy flex items-center gap-2">
            <span>1. Information We Collect</span>
          </h2>
          <p className="text-sm text-gray-700 leading-relaxed">
            When you visit KatrajPune.com, we may collect two types of information:
          </p>
          <ul className="space-y-2 text-sm text-gray-700 list-disc list-inside">
            <li>
              <strong>Information You Voluntarily Provide:</strong> When you submit a business listing, claim an existing listing, request an AI visibility audit, or reach out to our team via WhatsApp/Contact forms, we collect details such as your name, business name, phone number, WhatsApp number, email address, physical store address, and opening hours.
            </li>
            <li>
              <strong>Automatically Collected Log Data:</strong> Like most online services, our web servers automatically collect standard technical log information, including your IP address, browser type and version, operating system, referring URLs, pages visited, time spent on pages, and date/time stamps.
            </li>
          </ul>
        </section>

        {/* Section 2: Google AdSense & Third-Party Advertising Disclosures */}
        <section className="space-y-4 p-6 bg-amber-50/60 border border-amber-200/80 rounded-2xl">
          <h2 className="text-xl font-bold text-amber-950 flex items-center gap-2">
            <Cookie className="w-5 h-5 text-amber-700" />
            2. Google AdSense &amp; Third-Party Advertising Disclosures
          </h2>
          <div className="space-y-3 text-sm text-amber-900/90 leading-relaxed">
            <p>
              KatrajPune uses <strong>Google AdSense</strong> to display advertisements to support the free operation of our directory and map services. Google's use of advertising cookies enables it and its partners to serve ads to our users based on their visits to our site and/or other sites on the Internet.
            </p>
            <div className="bg-white p-4 rounded-xl border border-amber-200 space-y-2 text-xs text-gray-800">
              <p className="font-bold text-navy text-sm">Key Advertising Disclosures Required by Google Policy:</p>
              <ul className="space-y-1.5 list-disc list-inside">
                <li>Third-party vendors, including Google, use cookies to serve ads based on a user's prior visits to this website or other websites.</li>
                <li>Google's use of advertising cookies enables it and its partners to serve ads based on your visit to KatrajPune.com and other sites on the Internet.</li>
                <li>
                  Users may opt out of personalized advertising by visiting{" "}
                  <a href="https://www.google.com/settings/ads" target="_blank" rel="noopener noreferrer" className="text-blue-600 underline font-semibold">
                    Google Ads Settings
                  </a>.
                </li>
                <li>
                  Alternatively, you can opt out of a third-party vendor's use of cookies for personalized advertising by visiting{" "}
                  <a href="https://www.aboutads.info/choices/" target="_blank" rel="noopener noreferrer" className="text-blue-600 underline font-semibold">
                    www.aboutads.info
                  </a>.
                </li>
              </ul>
            </div>
          </div>
        </section>

        {/* Section 3: Cookies & Web Beacons */}
        <section className="space-y-4">
          <h2 className="text-xl sm:text-2xl font-bold text-navy flex items-center gap-2">
            <span>3. Cookies &amp; Web Beacons</span>
          </h2>
          <p className="text-sm text-gray-700 leading-relaxed">
            Cookies are small text files stored on your device when you visit websites. KatrajPune uses cookies to understand user preferences, keep map view settings intact, measure analytics traffic, and deliver relevant advertisements via Google AdSense.
          </p>
          <p className="text-sm text-gray-700 leading-relaxed">
            You can instruct your browser to refuse all cookies or to indicate when a cookie is being sent. However, if you disable cookies, some portions of the interactive map and search filters may function with reduced speed or convenience.
          </p>
        </section>

        {/* Section 4: How We Use Collected Data */}
        <section className="space-y-4">
          <h2 className="text-xl sm:text-2xl font-bold text-navy flex items-center gap-2">
            <span>4. How We Use Your Information</span>
          </h2>
          <ul className="space-y-2 text-sm text-gray-700 list-disc list-inside">
            <li>To operate, index, and display authentic local business listings in Katraj, Pune.</li>
            <li>To facilitate direct WhatsApp customer inquiries to verified business owners.</li>
            <li>To process verification and listing claims via our secure payment partners (Razorpay).</li>
            <li>To prevent fraud, spam, automated scraping, and unauthorized directory modifications.</li>
            <li>To comply with statutory legal requirements and enforce our Terms of Service.</li>
          </ul>
        </section>

        {/* Section 5: Legal Framework (DPDP Act 2023 & GDPR/CCPA) */}
        <section className="space-y-4">
          <h2 className="text-xl sm:text-2xl font-bold text-navy flex items-center gap-2">
            <span>5. Privacy Rights &amp; Legal Framework</span>
          </h2>
          <p className="text-sm text-gray-700 leading-relaxed">
            KatrajPune complies with the <strong>Digital Personal Data Protection (DPDP) Act, 2023 of India</strong>, as well as applicable global standards such as GDPR and CCPA where relevant:
          </p>
          <ul className="space-y-2 text-sm text-gray-700 list-disc list-inside">
            <li><strong>Right to Correction &amp; Deletion:</strong> Any business owner or user may request the correction or removal of their listed information at any time.</li>
            <li><strong>No Sale of Personal Data:</strong> We never sell your personal contact numbers or emails to third-party data brokers.</li>
            <li><strong>Data Retention:</strong> We store business directory records until the business owner requests modification or removal.</li>
          </ul>
        </section>

        {/* Section 6: Grievance Officer & Contact */}
        <section className="space-y-4 p-6 bg-white border border-navy/10 rounded-2xl shadow-sm">
          <h2 className="text-xl font-bold text-navy flex items-center gap-2">
            <Mail className="w-5 h-5 text-orange" />
            6. Grievance Officer &amp; Contact Details
          </h2>
          <p className="text-sm text-gray-700 leading-relaxed">
            If you have any questions regarding this Privacy Policy, wish to exercise your data rights, or request updates to any published listing, please contact our Grievance Officer:
          </p>
          <div className="text-xs sm:text-sm text-gray-800 space-y-1.5 pt-1">
            <p><strong>Platform:</strong> KatrajPune.com (Hyperlocal Directory &amp; Map)</p>
            <p><strong>Location:</strong> Katraj Chowk, Pune, Maharashtra 411046, India</p>
            <p><strong>Official WhatsApp Helpline:</strong> +91 70208 88195</p>
            <p><strong>Email:</strong> contact@katrajpune.com / support@katrajpune.com</p>
            <p><strong>Response Time:</strong> Within 48 hours of receipt.</p>
          </div>
        </section>

        <div className="pt-6 border-t border-navy/10 text-xs text-gray-500 flex flex-wrap gap-4 justify-between items-center">
          <p>© 2026 KatrajPune.com. All rights reserved.</p>
          <div className="flex gap-4">
            <Link href="/terms" className="underline hover:text-navy">Terms of Service</Link>
            <Link href="/contact" className="underline hover:text-navy">Contact Us</Link>
            <Link href="/about" className="underline hover:text-navy">About Us</Link>
          </div>
        </div>
      </main>
    </div>
  )
}
