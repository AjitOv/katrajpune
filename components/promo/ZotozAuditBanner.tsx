"use client"

import Link from "next/link"
import { Sparkles, ArrowRight, Bot, ShieldCheck, MessageCircle } from "lucide-react"
import { SITE_CONFIG, getContextualWhatsAppUrl } from "@/lib/config"

interface ZotozAuditBannerProps {
  variant?: "hero" | "compact" | "card"
  className?: string
  businessName?: string
}

export default function ZotozAuditBanner({
  variant = "compact",
  className = "",
  businessName,
}: ZotozAuditBannerProps) {
  const whatsappUrl = getContextualWhatsAppUrl({ action: "audit", businessName })

  if (variant === "card") {
    return (
      <div
        className={`bg-gradient-to-br from-[#10243A] via-[#162D4A] to-indigo-950 text-white rounded-2xl p-6 border border-indigo-500/20 shadow-md space-y-4 ${className}`}
      >
        <div className="flex items-center justify-between">
          <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-indigo-500/30 text-indigo-200 text-[10px] font-bold uppercase tracking-wider">
            <Sparkles className="w-3 h-3 text-amber-300" />
            <span>AI Search Visibility</span>
          </span>
          <span className="text-[10px] font-bold text-emerald-400 bg-emerald-500/20 px-2 py-0.5 rounded-full">
            100% Free
          </span>
        </div>

        <div>
          <h3 className="text-base font-black text-white leading-snug">
            {SITE_CONFIG.zotozAudit.headline}
          </h3>
          <p className="text-xs text-indigo-100/80 mt-1.5 leading-relaxed line-clamp-3">
            {SITE_CONFIG.zotozAudit.subheadline}
          </p>
        </div>

        <div className="pt-1 flex flex-col sm:flex-row items-center gap-2">
          <Link
            href="/free-ai-audit"
            className="w-full sm:w-auto flex-1 inline-flex items-center justify-center gap-1.5 bg-white hover:bg-amber-300 text-navy font-bold text-xs px-4 py-2.5 rounded-xl shadow transition-all"
          >
            <span>{SITE_CONFIG.zotozAudit.ctaText}</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
          <a
            href={whatsappUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="w-full sm:w-auto inline-flex items-center justify-center gap-1 px-3 py-2.5 rounded-xl bg-white/10 hover:bg-white/20 text-white text-xs font-semibold transition-colors"
          >
            <MessageCircle className="w-3.5 h-3.5 text-[#25D366]" />
            <span>WhatsApp</span>
          </a>
        </div>
      </div>
    )
  }

  return (
    <section
      aria-label="Free Zotoz AI Visibility Audit"
      className={`relative overflow-hidden rounded-2xl sm:rounded-3xl bg-gradient-to-r from-indigo-950 via-[#10243A] to-blue-950 text-white p-5 sm:p-7 border border-indigo-500/30 shadow-lg ${className}`}
    >
      <div className="absolute top-0 right-0 w-80 h-80 bg-indigo-500/10 rounded-full blur-3xl pointer-events-none" />

      <div className="relative z-10 flex flex-col md:flex-row items-start md:items-center justify-between gap-5">
        <div className="space-y-2 max-w-2xl">
          <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-indigo-500/30 border border-indigo-400/30 text-indigo-200 text-[11px] font-bold uppercase tracking-wider">
            <Sparkles className="w-3 h-3 text-amber-300" />
            <span>Free Growth Audit for Katraj Businesses</span>
          </div>
          <h2 className="text-xl sm:text-2xl font-black text-white tracking-tight">
            {SITE_CONFIG.zotozAudit.headline}
          </h2>
          <p className="text-xs sm:text-sm text-indigo-100/90 leading-relaxed">
            {SITE_CONFIG.zotozAudit.subheadline}
          </p>
        </div>

        <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2.5 w-full md:w-auto shrink-0">
          <Link
            href="/free-ai-audit"
            className="inline-flex items-center justify-center gap-2 bg-gradient-to-r from-amber-400 to-orange hover:from-amber-300 hover:to-orange text-navy font-extrabold text-xs sm:text-sm px-5 py-3 rounded-xl shadow-md transition-all transform hover:scale-105"
          >
            <Bot className="w-4 h-4 text-navy" />
            <span>{SITE_CONFIG.zotozAudit.ctaText}</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
          <a
            href={whatsappUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center justify-center gap-1.5 bg-white/10 hover:bg-white/20 text-white text-xs font-bold px-4 py-3 rounded-xl border border-white/20 transition-colors"
          >
            <MessageCircle className="w-4 h-4 text-[#25D366]" />
            <span>WhatsApp Enquiry</span>
          </a>
        </div>
      </div>
    </section>
  )
}
