"use client"

import { useState } from "react"

export default function SearchBar({
  value,
  onChange,
  placeholder,
}: {
  value: string
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void
  placeholder?: string
}) {
  return (
    <div className="relative flex-1 max-w-md">
      <input
        type="text"
        value={value}
        onChange={onChange}
        placeholder={placeholder ?? "Search businesses, locality, category…"}
        className="w-full px-4 py-2.5 rounded-full bg-white/90 backdrop-blur-md border border-navy/10 text-navy text-sm placeholder-navy/40 focus:outline-none focus:ring-2 focus:ring-navy focus:ring-offset-1 shadow-sm transition-all"
      />
    </div>
  )
}
