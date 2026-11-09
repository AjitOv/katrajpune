"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import { usePathname, useRouter } from "next/navigation"
import {
  LayoutDashboard,
  Building2,
  Megaphone,
  Sparkles,
  Settings,
  LogOut,
  MapPin,
  Shield,
  MessageCircle,
  Share2,
} from "lucide-react"
import { createClient } from "@/lib/supabase/client"

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname()
  const router = useRouter()
  const [userEmail, setUserEmail] = useState<string | null>(null)
  const supabase = createClient()

  useEffect(() => {
    supabase.auth.getUser().then(({ data }) => {
      if (data?.user) {
        setUserEmail(data.user.email || "Admin")
      } else if (pathname !== "/admin/login") {
        router.push("/admin/login")
      }
    })
  }, [supabase, pathname, router])

  // Don't render admin chrome on the login page itself
  if (pathname === "/admin/login") {
    return <>{children}</>
  }

  const handleSignOut = async () => {
    await supabase.auth.signOut()
    router.push("/admin/login")
  }

  const navItems = [
    { label: "Dashboard", href: "/admin/dashboard", icon: LayoutDashboard },
    { label: "Listings", href: "/admin/businesses", icon: Building2 },
    { label: "WhatsApp Outreach", href: "/admin/outreach", icon: MessageCircle },
    { label: "Social Media", href: "/admin/social", icon: Share2 },
    { label: "Advertisements", href: "/admin/ads", icon: Megaphone },
    { label: "AI Audits", href: "/admin/audits", icon: Sparkles },
    { label: "Moderation Map", href: "/admin/map", icon: MapPin },
    { label: "Settings", href: "/admin/settings", icon: Settings },
  ]

  return (
    <div className="min-h-screen bg-[#F4F6F9]">
      {/* Top Header */}
      <header className="bg-navy text-white sticky top-0 z-40 shadow-md">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            {/* Left: Branding */}
            <div className="flex items-center gap-3">
              <Link href="/admin/dashboard" className="flex items-center gap-2 group">
                <span className="text-xl">📍</span>
                <div className="flex items-center gap-1.5">
                  <span className="text-[11px] font-black tracking-widest text-white/60 uppercase">katraj</span>
                  <span className="w-1.5 h-1.5 rounded-full bg-orange" />
                  <span className="text-base font-bold text-white">pune</span>
                </div>
              </Link>
              <span className="text-xs bg-white/10 text-orange font-bold uppercase tracking-wider px-2 py-0.5 rounded-md flex items-center gap-1 border border-white/10">
                <Shield className="w-3 h-3" /> Admin Console
              </span>
            </div>

            {/* Middle: Navigation */}
            <nav className="hidden md:flex items-center gap-1">
              {navItems.map((item) => {
                const Icon = item.icon
                const isActive = pathname === item.href
                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold transition-colors ${
                      isActive
                        ? "bg-white/20 text-white shadow-sm"
                        : "text-white/70 hover:text-white hover:bg-white/10"
                    }`}
                  >
                    <Icon className="w-3.5 h-3.5" />
                    <span>{item.label}</span>
                  </Link>
                )
              })}
            </nav>

            {/* Right: User / Logout */}
            <div className="flex items-center gap-3">
              <span className="hidden lg:inline text-xs text-white/60 font-mono">
                {userEmail || "admin@katrajpune.com"}
              </span>
              <button
                onClick={handleSignOut}
                className="flex items-center gap-1 text-xs font-bold text-red-300 hover:text-red-100 bg-red-500/20 hover:bg-red-500/30 px-3 py-1.5 rounded-xl transition-colors border border-red-500/30"
              >
                <LogOut className="w-3.5 h-3.5" />
                <span>Sign Out</span>
              </button>
            </div>
          </div>
        </div>

        {/* Mobile Navigation Row */}
        <div className="md:hidden border-t border-white/10 px-4 py-2 overflow-x-auto flex items-center gap-2">
          {navItems.map((item) => {
            const Icon = item.icon
            const isActive = pathname === item.href
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`flex items-center gap-1 px-2.5 py-1 rounded-lg text-xs font-bold whitespace-nowrap ${
                  isActive ? "bg-white/20 text-white" : "text-white/70 hover:text-white"
                }`}
              >
                <Icon className="w-3 h-3" />
                <span>{item.label}</span>
              </Link>
            )
          })}
        </div>
      </header>

      {/* Main Container */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">{children}</main>
    </div>
  )
}
