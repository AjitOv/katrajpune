import type { Metadata } from "next"

export const metadata: Metadata = {
  title: "Free Zotoz AI Visibility Audit — Is Your Business Visible on AI Search?",
  description:
    "Discover how your local business appears across ChatGPT, Gemini, Perplexity, and AI search engines. Get a free comprehensive AI visibility audit from KatrajPune and Zotoz.",
  keywords: [
    "AI search visibility",
    "free AI audit Pune",
    "ChatGPT business visibility",
    "Perplexity business search",
    "Katraj business SEO",
    "AI visibility audit",
    "Zotoz AI audit",
  ],
  openGraph: {
    title: "Free Zotoz AI Visibility Audit — KatrajPune",
    description:
      "Is your business visible when users ask ChatGPT, Gemini, or Perplexity for local recommendations in Pune? Get a 100% free AI audit.",
    url: "https://katrajpune.com/free-ai-audit",
    type: "website",
    siteName: "KatrajPune",
  },
  twitter: {
    card: "summary_large_image",
    title: "Free Zotoz AI Visibility Audit — KatrajPune",
    description: "Check your business visibility across AI search and answer platforms.",
  },
  alternates: {
    canonical: "https://katrajpune.com/free-ai-audit",
  },
}

export default function FreeAIAuditLayout({ children }: { children: React.ReactNode }) {
  return children
}

