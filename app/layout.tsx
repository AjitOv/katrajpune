import type { Metadata, Viewport } from "next"
import { Analytics } from "@vercel/analytics/react"
import DhanTopBar from "@/components/ads/DhanTopBar"
import FloatingWhatsAppButton from "@/components/support/FloatingWhatsAppButton"
import "./tailwind.css"
import SiteHeader from "@/components/navigation/SiteHeader"
import DiscoveryLinks from "@/components/seo/DiscoveryLinks"
import { jsonLd } from "@/lib/seo"

export const viewport: Viewport = {
  themeColor: "#FF7A00",
  width: "device-width",
  initialScale: 1,
  maximumScale: 5,
}

export const metadata: Metadata = {
  icons: {
    icon: [{ url: "/favicon.ico", sizes: "any" }, { url: "/favicon.svg", type: "image/svg+xml" }, { url: "/favicon-32.png", sizes: "32x32", type: "image/png" }],
    apple: [{ url: "/apple-touch-icon.png", sizes: "180x180", type: "image/png" }],
  },
  metadataBase: new URL("https://katrajpune.com"),
  title: {
    default: "KatrajPune — Discover 1,440+ Local Businesses in Katraj, Pune",
    template: "%s | KatrajPune",
  },
  description:
    "Definitive hyperlocal search, business directory, and interactive map platform for Katraj, Pune. Explore 1,440+ listed restaurants, doctors, shops, schools, and services with WhatsApp contact, photos, and ratings.",
  keywords: [
    "Katraj Pune",
    "Katraj business directory",
    "Katraj map",
    "Bharati Vidyapeeth shops",
    "restaurants in Katraj",
    "hospitals in Katraj",
    "schools in Katraj",
    "Katraj Kondhwa road",
    "Katraj Chowk",
    "Pune 411046 businesses",
    "local services Katraj",
    "hyperlocal Pune",
  ],
  authors: [{ name: "KatrajPune", url: "https://katrajpune.com" }],
  creator: "KatrajPune",
  publisher: "KatrajPune",
  category: "Hyperlocal Business Directory & Map",
  formatDetection: {
    telephone: true,
    email: true,
    address: true,
  },
  openGraph: {
    title: "KatrajPune — 1,440+ Local Businesses on Map & Directory",
    description:
      "Find groceries, restaurants, healthcare, schools, and essential services in Katraj, Pune on an interactive map and directory grid.",
    type: "website",
    url: "https://katrajpune.com",
    siteName: "KatrajPune",
    locale: "en_IN",
  },
  twitter: {
    card: "summary_large_image",
    title: "KatrajPune — Katraj Business Directory & Interactive Map",
    description: "1,440+ listed businesses in Katraj, Pune with WhatsApp contact and ratings.",
  },
  alternates: {
    canonical: "https://katrajpune.com",
  },
  other: {
    // Geographic Search Engine Optimization (GEO) Tags
    "geo.region": "IN-MH",
    "geo.placename": "Katraj, Pune, Maharashtra, India",
    "geo.position": "18.452936;73.855301",
    ICBM: "18.452936, 73.855301",
    "DC.title": "KatrajPune Hyperlocal Directory",
    "DC.coverage": "Katraj, Pune, Maharashtra 411046, India",
    "DC.subject": "Local businesses, restaurants, doctors, hospitals, schools, shops in Katraj Pune",
  },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  // Global JSON-LD Schema (WebSite + Organization + Place for AEO & GEO)
  const websiteSchema = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "WebSite",
        "@id": "https://katrajpune.com/#website",
        url: "https://katrajpune.com",
        name: "KatrajPune",
        description:
          "Hyperlocal business directory and interactive map for Katraj, Pune, Maharashtra 411046.",
        inLanguage: "en-IN",
        potentialAction: {
          "@type": "SearchAction",
          target: {
            "@type": "EntryPoint",
            urlTemplate: "https://katrajpune.com/directory?search={search_term_string}",
          },
          "query-input": "required name=search_term_string",
        },
      },
      {
        "@type": "Organization",
        "@id": "https://katrajpune.com/#organization",
        name: "KatrajPune",
        url: "https://katrajpune.com",
        logo: "https://katrajpune.com/icon-512.png",
        address: {
          "@type": "PostalAddress",
          addressLocality: "Katraj",
          addressRegion: "Maharashtra",
          postalCode: "411046",
          addressCountry: "IN",
        },
      },
      {
        "@type": "Place",
        "@id": "https://katrajpune.com/#place",
        name: "Katraj, Pune",
        description: "A prominent suburb and educational-commercial hub in southern Pune, Maharashtra.",
        geo: {
          "@type": "GeoCoordinates",
          latitude: 18.452936,
          longitude: 73.855301,
        },
        address: {
          "@type": "PostalAddress",
          addressLocality: "Katraj",
          addressRegion: "Maharashtra",
          postalCode: "411046",
          addressCountry: "IN",
        },
        containedInPlace: {
          "@type": "City",
          name: "Pune",
        },
      },
    ],
  }

  return (
    <html lang="en">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800&display=swap"
          rel="stylesheet"
        />
        <link rel="manifest" href="/manifest.json" />
        <link rel="author" href="/humans.txt" />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: jsonLd(websiteSchema) }}
        />
      </head>
      <body
        className="antialiased min-h-screen flex flex-col"
        style={{
          fontFamily: "'Inter', system-ui, sans-serif",
          backgroundColor: "#F7F9FC",
          color: "#10243A",
        }}
      >
        <DhanTopBar />
        <SiteHeader />
        <div className="flex-1 flex flex-col relative w-full">
          {children}
        </div>
        <DiscoveryLinks />
        <FloatingWhatsAppButton />
        <Analytics />
      </body>
    </html>
  )
}
