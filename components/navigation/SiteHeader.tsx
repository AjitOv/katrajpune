"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { useEffect, useRef, useState } from "react"
import { Menu, X, ArrowUpRight } from "lucide-react"
import BrandLogo from "@/components/brand/BrandLogo"

const links = [
  { href: "/", label: "Map" },
  { href: "/directory", label: "Directory" },
  { href: "/deals", label: "Deals" },
  { href: "/free-ai-audit", label: "Free AI audit" },
  { href: "/claim", label: "Claim listing" },
]

export default function SiteHeader() {
  const pathname = usePathname()
  const [open, setOpen] = useState(false)
  const header = useRef<HTMLElement>(null)
  const toggle = useRef<HTMLButtonElement>(null)

  useEffect(() => setOpen(false), [pathname])
  useEffect(() => {
    if (!open) return
    const closeOnEscape = (event: KeyboardEvent) => {
      if (event.key === "Escape") { setOpen(false); toggle.current?.focus() }
    }
    const closeOutside = (event: PointerEvent) => {
      if (!header.current?.contains(event.target as Node)) setOpen(false)
    }
    document.addEventListener("keydown", closeOnEscape)
    document.addEventListener("pointerdown", closeOutside)
    return () => {
      document.removeEventListener("keydown", closeOnEscape)
      document.removeEventListener("pointerdown", closeOutside)
    }
  }, [open])

  if (/^\/(admin|owner|auth|payment)(\/|$)/.test(pathname)) return null
  const active = (href: string) => href === "/directory"
    ? /^\/(directory|browse|category|locality|business)(\/|$)/.test(pathname)
    : pathname === href

  return (
    <header className="site-header" ref={header}>
      <div className="site-header-inner">
        <Link href="/" aria-label="KatrajPune home" className="site-brand" onClick={() => setOpen(false)}><BrandLogo /></Link>
        <button ref={toggle} type="button" className="site-menu-toggle" aria-label={open ? "Close navigation" : "Open navigation"} aria-expanded={open} aria-controls="primary-navigation" onClick={() => setOpen(!open)}>
          {open ? <X size={22} /> : <Menu size={22} />}<span>Menu</span>
        </button>
        <nav id="primary-navigation" aria-label="Main navigation" className={`site-navigation${open ? " is-open" : ""}`}>
          {links.map(({href,label}) => <Link key={href} href={href} className="site-nav-link" aria-current={active(href) ? "page" : undefined} onClick={() => setOpen(false)}>{label}</Link>)}
          <Link href="/add-business" className="site-nav-cta" aria-current={pathname === "/add-business" ? "page" : undefined} onClick={() => setOpen(false)}>Add business <ArrowUpRight size={16} aria-hidden="true" /></Link>
        </nav>
      </div>
    </header>
  )
}
