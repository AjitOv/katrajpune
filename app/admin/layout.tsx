"use client"

import { useEffect, useState } from "react"
import Link from "next/link"

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-background">
      <header className="bg-white border-b border-navy/10">
        <div className="max-w-5xl mx-auto px-4 py-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <span className="text-[10px] font-bold tracking-widest text-navy/60 uppercase">katrajpune</span>
              <span className="w-1 h-1 rounded-full bg-orange mx-1 mt-[2px]"></span>
              <span className="text-lg font-bold text-navy">Admin Console</span>
            </div>
            <nav className="flex items-center gap-4">
              <Link href="/admin/dashboard" className="text-sm text-navy/60 hover:text-navy font-medium">Dashboard</Link>
              <Link href="/admin/map" className="text-sm text-navy/60 hover:text-navy font-medium">Moderation Map</Link>
              <Link href="/admin/businesses" className="text-sm text-navy/60 hover:text-navy font-medium">All Listings</Link>
              <a
                href="/api/auth/logout"
                className="text-sm text-red-600 hover:text-red-800 font-medium"
                rel="noopener noreferrer"
              >
                Sign out
              </a>
            </nav>
          </div>
        </div>
      </header>

      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {children}
      </div>
    </div>
  )
}
