import Link from "next/link"
import BrandLogo from "@/components/brand/BrandLogo"
import { ShieldCheck, MapPin, Mail, MessageCircle, Heart } from "lucide-react"

export default function SiteFooter() {
  return (
    <footer className="border-t border-navy/10 bg-white text-navy pt-12 pb-8 px-4 sm:px-6">
      <div className="max-w-6xl mx-auto space-y-10">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-8">
          {/* Column 1: Brand & Katraj Address */}
          <div className="lg:col-span-2 space-y-4">
            <Link href="/" aria-label="KatrajPune Home">
              <BrandLogo />
            </Link>
            <p className="text-xs text-gray-600 leading-relaxed max-w-sm">
              KatrajPune.com is the community directory, search engine, and 3D interactive map for Katraj, Pune (PIN 411046). Indexing verified businesses, clinics, restaurants, transit hubs, and essential local services.
            </p>
            <div className="text-xs text-gray-500 space-y-1">
              <p className="flex items-center gap-1.5">
                <MapPin className="w-3.5 h-3.5 text-orange shrink-0" />
                <span>Katraj Chowk, Pune, Maharashtra 411046</span>
              </p>
              <p className="flex items-center gap-1.5">
                <MessageCircle className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                <a href="https://wa.me/917020888195" target="_blank" rel="noopener noreferrer" className="hover:underline">
                  WhatsApp Support: +91 70208 88195
                </a>
              </p>
              <p className="flex items-center gap-1.5">
                <Mail className="w-3.5 h-3.5 text-blue-600 shrink-0" />
                <a href="mailto:contact@katrajpune.com" className="hover:underline">
                  contact@katrajpune.com
                </a>
              </p>
            </div>
          </div>

          {/* Column 2: Directory Hubs */}
          <div className="space-y-3 text-xs">
            <p className="font-bold text-navy uppercase tracking-wider text-[11px]">Explore Directory</p>
            <ul className="space-y-2 text-gray-600">
              <li><Link href="/directory" className="hover:text-orange transition-colors">Directory Grid</Link></li>
              <li><Link href="/" className="hover:text-orange transition-colors">3D Vector Map</Link></li>
              <li><Link href="/deals" className="hover:text-orange transition-colors">Local Deals &amp; Offers</Link></li>
              <li><Link href="/browse" className="hover:text-orange transition-colors">Browse All Categories</Link></li>
              <li><Link href="/locality/katraj-chowk" className="hover:text-orange transition-colors">Katraj Chowk Listings</Link></li>
              <li><Link href="/locality/bharati-vidyapeeth" className="hover:text-orange transition-colors">Bharati Vidyapeeth Area</Link></li>
            </ul>
          </div>

          {/* Column 3: Local Guides & Magazine */}
          <div className="space-y-3 text-xs">
            <p className="font-bold text-navy uppercase tracking-wider text-[11px]">Katraj City Guides</p>
            <ul className="space-y-2 text-gray-600">
              <li><Link href="/guides" className="hover:text-orange transition-colors font-bold text-navy">All Local Guides →</Link></li>
              <li><Link href="/guides/rajiv-gandhi-zoo-katraj-guide" className="hover:text-orange transition-colors">Katraj Zoo &amp; Safari Guide</Link></li>
              <li><Link href="/guides/best-misal-in-katraj" className="hover:text-orange transition-colors">Top 10 Misal Spots</Link></li>
              <li><Link href="/guides/katraj-bus-depot-pmpml-transit-guide" className="hover:text-orange transition-colors">PMPML Bus Depot Routes</Link></li>
              <li><Link href="/guides/student-living-guide-bharati-vidyapeeth-katraj" className="hover:text-orange transition-colors">Student Living &amp; Mess Guide</Link></li>
              <li><Link href="/guides/emergency-medicals-hospitals-katraj" className="hover:text-orange transition-colors">24/7 Medicals &amp; Emergency</Link></li>
            </ul>
          </div>

          {/* Column 4: Merchant & Trust */}
          <div className="space-y-3 text-xs">
            <p className="font-bold text-navy uppercase tracking-wider text-[11px]">For Business Owners</p>
            <ul className="space-y-2 text-gray-600">
              <li><Link href="/claim" className="hover:text-orange transition-colors font-semibold text-emerald-700">Claim Verified Listing (₹350)</Link></li>
              <li><Link href="/add-business" className="hover:text-orange transition-colors">List a New Business</Link></li>
              <li><Link href="/free-ai-audit" className="hover:text-orange transition-colors">Free AI Visibility Audit</Link></li>
              <li><Link href="/about" className="hover:text-orange transition-colors">Verification Standards</Link></li>
            </ul>
          </div>
        </div>

        {/* Legal, AdSense & Policy Strip */}
        <div className="pt-8 border-t border-navy/10 space-y-4">
          <div className="flex flex-wrap items-center justify-between gap-4 text-xs text-gray-600">
            <div className="flex flex-wrap items-center gap-6 font-semibold">
              <Link href="/privacy" className="hover:text-navy underline">Privacy Policy</Link>
              <Link href="/terms" className="hover:text-navy underline">Terms of Service</Link>
              <Link href="/contact" className="hover:text-navy underline">Contact Us</Link>
              <Link href="/about" className="hover:text-navy underline">About Us</Link>
              <Link href="/guides" className="hover:text-navy underline">Editorial Guides</Link>
            </div>
            <p className="text-gray-400 text-[11px]">
              © 2026 KatrajPune.com. Verified Hyperlocal Platform for Katraj, Pune.
            </p>
          </div>

          {/* Explicit Google AdSense Publisher & Editorial Disclosure */}
          <div className="p-3.5 bg-gray-50 rounded-xl border border-navy/5 text-[11px] text-gray-500 leading-relaxed">
            <p>
              <strong>Publisher &amp; Advertising Disclosure:</strong> KatrajPune.com is an independent community directory and map service. This website displays commercial advertisements served by Google AdSense and third-party advertising networks. We use cookies and data analytics to optimize user navigation and serve personalized advertisements. For advertising opt-outs, please visit Google Ad Settings or <a href="https://www.aboutads.info/choices/" target="_blank" rel="noopener noreferrer" className="underline">aboutads.info</a>. All trademarks, business logos, and brand names belong to their respective owners.
            </p>
          </div>
        </div>
      </div>
    </footer>
  )
}
