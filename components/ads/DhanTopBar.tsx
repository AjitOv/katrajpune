"use client"

import { useState } from "react"
import { TrendingUp, ArrowRight, X } from "lucide-react"

export default function DhanTopBar() {
  const [dismissed, setDismissed] = useState(false)

  if (dismissed) return null

  return (
    <div
      className="bg-gradient-to-r from-emerald-600 via-teal-600 to-indigo-700 text-white text-xs py-2 px-3 sm:px-4 shadow-sm relative z-50 w-full shrink-0"
      style={{
        background: "linear-gradient(90deg, #059669 0%, #0d9488 50%, #4338ca 100%)",
        color: "#ffffff",
        padding: "8px 16px",
        zIndex: 50,
        position: "relative",
        width: "100%",
        flexShrink: 0,
      }}
    >
      <div className="max-w-7xl mx-auto flex items-center justify-between gap-3">
        <div className="flex items-center gap-2 flex-1 min-w-0">
          <span className="flex items-center justify-center w-5 h-5 rounded-full bg-white/20 text-white shrink-0">
            <TrendingUp className="w-3 h-3" />
          </span>
          <p className="truncate font-medium text-white/95">
            <span className="font-bold text-white bg-white/20 px-1.5 py-0.5 rounded text-[10px] uppercase tracking-wider mr-1.5">
              Special Offer
            </span>
            <span>Open a <strong>Free Demat Account</strong> on Dhan — Zero Brokerage on Equity &amp; Fast KYC.</span>
          </p>
        </div>

        <div className="flex items-center gap-2 shrink-0">
          <a
            href="https://invite.dhan.co/?join=AJAL11"
            target="_blank"
            rel="noopener noreferrer sponsored"
            className="inline-flex items-center gap-1 bg-white hover:bg-yellow-300 text-emerald-900 font-bold px-3 py-1 rounded-full text-xs shadow-sm transition-all transform hover:scale-105"
          >
            <span>Open Free Account</span>
            <ArrowRight className="w-3 h-3" />
          </a>
          <button
            onClick={() => setDismissed(true)}
            aria-label="Dismiss banner"
            className="text-white/70 hover:text-white p-1 rounded-full hover:bg-white/10 transition-colors"
          >
            <X className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>
    </div>
  )
}

