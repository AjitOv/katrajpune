"use client"

import { useEffect, useState } from "react"

interface LocalityFilterProps {
  value: string | null
  onChange: (value: string | null) => void
}

export default function LocalityFilter({ value, onChange }: LocalityFilterProps) {
  const [localities, setLocalities] = useState<string[]>([])
  const [isOpen, setIsOpen] = useState(false)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    let cancelled = false
    async function fetchLocalities() {
      setLoading(true)
      try {
        const res = await fetch("/api/businesses/localities")
        const data = await res.json()
        if (!cancelled) setLocalities(Array.isArray(data) ? data : [])
      } catch (err) {
        console.error("Failed to load localities:", err)
      } finally {
        if (!cancelled) setLoading(false)
      }
    }
    fetchLocalities()
    return () => {
      cancelled = true
    }
  }, [])

  return (
    <div className="relative w-48 map-locality-filter">
      <button
        aria-expanded={isOpen}
        onClick={() => setIsOpen(!isOpen)}
        className="w-full px-3 py-2 rounded-lg bg-white/90 backdrop-blur border border-navy/10 text-sm text-navy flex items-center justify-between shadow-sm hover:bg-navy/5 transition-colors"
      >
        <span>{loading ? "Loading…" : value || "Locality"}</span>
        <span className="text-[10px]">{isOpen ? "▲" : "▼"}</span>
      </button>

      {isOpen && !loading && localities.length > 0 && (
        <div className="absolute z-50 w-full mt-1 bg-white rounded-xl shadow-lg border border-navy/10 overflow-hidden max-h-60 overflow-y-auto">
          <button
            onClick={() => {
              onChange(null)
              setIsOpen(false)
            }}
            className="w-full px-3 py-2 text-sm text-navy/60 hover:bg-gray-50 flex items-center justify-between"
          >
            <span>All localities</span>
            {value === null && <span className="text-green-600 text-xs">✓</span>}
          </button>
          {localities.map((loc) => (
            <button
              key={loc}
              onClick={() => {
                onChange(loc)
                setIsOpen(false)
              }}
              className="w-full px-3 py-2 text-sm text-navy hover:bg-gray-50 flex items-center justify-between"
            >
              <span>{loc}</span>
              {value === loc && <span className="text-green-600 text-xs">✓</span>}
            </button>
          ))}
        </div>
      )}
    </div>
  )
}
