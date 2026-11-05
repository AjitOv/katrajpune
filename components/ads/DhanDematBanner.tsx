import React from "react"
import { TrendingUp, ShieldCheck, Zap, ArrowRight, ExternalLink } from "lucide-react"

interface DhanDematBannerProps {
  variant?: "horizontal" | "card" | "compact"
  className?: string
}

export default function DhanDematBanner({
  variant = "horizontal",
  className = "",
}: DhanDematBannerProps) {
  const joinUrl = "https://invite.dhan.co/?join=AJAL11"

  if (variant === "compact") {
    return (
      <div
        className={`bg-gradient-to-r from-emerald-50 to-teal-50 border border-emerald-200 rounded-2xl p-4 flex items-center justify-between gap-4 ${className}`}
      >
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-emerald-600 text-white flex items-center justify-center font-bold text-lg shadow-sm">
            📈
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xs font-bold uppercase tracking-wider text-emerald-800">
                Dhan Demat
              </span>
              <span className="bg-emerald-100 text-emerald-800 text-[10px] px-1.5 py-0.2 rounded font-semibold">
                Free
              </span>
            </div>
            <p className="text-sm font-semibold text-navy">
              Invest in Stocks, ETFs &amp; Mutual Funds with ₹0 Brokerage
            </p>
          </div>
        </div>

        <a
          href={joinUrl}
          target="_blank"
          rel="noopener noreferrer sponsored"
          className="shrink-0 bg-emerald-600 hover:bg-emerald-700 text-white font-bold px-4 py-2 rounded-xl text-xs flex items-center gap-1.5 shadow-sm transition-all"
        >
          <span>Open Account</span>
          <ExternalLink className="w-3.5 h-3.5" />
        </a>
      </div>
    )
  }

  if (variant === "card") {
    return (
      <div
        className={`bg-white rounded-2xl border-2 border-emerald-500/20 shadow-md p-5 relative overflow-hidden ${className}`}
      >
        <div className="absolute top-0 right-0 bg-gradient-to-l from-emerald-600 to-teal-600 text-white text-[10px] font-bold uppercase tracking-widest px-3 py-1 rounded-bl-xl shadow-sm">
          Sponsored
        </div>

        <div className="flex items-center gap-2.5 mb-3">
          <div className="w-9 h-9 rounded-xl bg-emerald-600 text-white flex items-center justify-center font-bold">
            <TrendingUp className="w-5 h-5" />
          </div>
          <div>
            <h4 className="text-sm font-bold text-navy">Open Free Demat Account</h4>
            <p className="text-[11px] text-gray-500">Fast 5-Min Paperless KYC on Dhan</p>
          </div>
        </div>

        <p className="text-xs text-gray-600 mb-4 leading-relaxed">
          Start investing in Indian stock markets, SIPs, IPOs, and mutual funds with zero account opening fee.
        </p>

        <div className="space-y-1.5 text-xs text-navy/80 mb-4 bg-emerald-50/60 p-3 rounded-xl border border-emerald-100">
          <div className="flex items-center gap-2">
            <ShieldCheck className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
            <span><strong>₹0</strong> Account Opening Fee</span>
          </div>
          <div className="flex items-center gap-2">
            <Zap className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
            <span><strong>₹0</strong> Brokerage on Equity Delivery</span>
          </div>
          <div className="flex items-center gap-2">
            <ShieldCheck className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
            <span>Lightning-fast TradingView Charts</span>
          </div>
        </div>

        <a
          href={joinUrl}
          target="_blank"
          rel="noopener noreferrer sponsored"
          className="w-full bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 text-white font-bold py-2.5 px-4 rounded-xl text-xs flex items-center justify-center gap-2 shadow-md transition-all transform hover:scale-[1.02]"
        >
          <span>Open Free Account Now</span>
          <ArrowRight className="w-3.5 h-3.5" />
        </a>
      </div>
    )
  }

  // Horizontal Banner
  return (
    <div
      className={`bg-gradient-to-r from-emerald-900 via-teal-900 to-navy text-white rounded-2xl p-6 sm:p-8 shadow-xl relative overflow-hidden border border-emerald-500/30 ${className}`}
    >
      <div className="absolute top-0 right-0 w-64 h-64 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none" />

      <div className="relative z-10 flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
        <div className="space-y-2 max-w-xl">
          <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-emerald-400/20 text-emerald-300 text-[11px] font-bold uppercase tracking-wider">
            <span>📈</span> Special Promotion
          </div>
          <h3 className="text-xl sm:text-2xl font-black tracking-tight text-white">
            Grow Your Wealth with a <span className="text-emerald-400">Free Demat Account</span>
          </h3>
          <p className="text-sm text-gray-300 leading-relaxed">
            Open your demat and trading account on <strong>Dhan</strong> in less than 5 minutes. Enjoy ₹0 account opening charges, ₹0 brokerage on equity delivery, and instant access to Indian stock markets.
          </p>

          <div className="flex flex-wrap gap-4 pt-1 text-xs text-emerald-200">
            <span className="flex items-center gap-1.5">
              <ShieldCheck className="w-4 h-4 text-emerald-400" /> ₹0 Account Opening
            </span>
            <span className="flex items-center gap-1.5">
              <Zap className="w-4 h-4 text-emerald-400" /> ₹0 Delivery Brokerage
            </span>
            <span className="flex items-center gap-1.5">
              <ShieldCheck className="w-4 h-4 text-emerald-400" /> SEBI Registered Broker
            </span>
          </div>
        </div>

        <div className="shrink-0 w-full md:w-auto flex flex-col sm:flex-row gap-3">
          <a
            href={joinUrl}
            target="_blank"
            rel="noopener noreferrer sponsored"
            className="inline-flex items-center justify-center gap-2 bg-gradient-to-r from-emerald-400 to-teal-400 hover:from-emerald-300 hover:to-teal-300 text-navy font-extrabold text-sm px-6 py-3.5 rounded-xl shadow-lg transition-all transform hover:scale-105 text-center"
          >
            <span>Open Free Demat Account</span>
            <ArrowRight className="w-4 h-4" />
          </a>
        </div>
      </div>
    </div>
  )
}

