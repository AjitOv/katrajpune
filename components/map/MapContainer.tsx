"use client"

import { useEffect, useRef, useState, useCallback } from "react"
import "maplibre-gl/dist/maplibre-gl.css"
import { Business } from "@/types/business"
import { MAP_CONFIG, getMapStyle } from "@/lib/maplibre"
import {
  createClusterer,
  getClusters,
  getClusterLeaves,
} from "@/lib/cluster"
import { getMarkerColor, getMarkerEmoji, getClusterColor } from "@/lib/markers"

interface MapContainerProps {
  initialCenter: [number, number]
  initialZoom: number
  activeCategory: string | null
  onMarkerClick: (business: Business) => void
}

export default function MapContainer({
  initialCenter,
  initialZoom,
  activeCategory,
  onMarkerClick,
}: MapContainerProps) {
  const [allBusinesses, setAllBusinesses] = useState<Business[]>([])
  const [selectedBusiness, setSelectedBusiness] = useState<Business | null>(null)
  const mapRef = useRef<any>(null)
  const containerRef = useRef<HTMLDivElement>(null)
  const markersRef = useRef<any[]>([])
  const maplibreRef = useRef<any>(null)

  const fetchBusinesses = useCallback(async () => {
    if (!mapRef.current) return
    const bounds = mapRef.current.getBounds()
    try {
      const res = await fetch(
        `/api/businesses/bounds?west=${bounds.getWest()}&south=${bounds.getSouth()}&east=${bounds.getEast()}&north=${bounds.getNorth()}${
          activeCategory && activeCategory !== "all" ? `&category=${activeCategory}` : ""
        }&limit=500`
      )
      const data = await res.json()
      setAllBusinesses(data || [])
    } catch (err) {
      console.error("Failed to fetch businesses:", err)
    }
  }, [activeCategory])

  // ---- Map initialization — client-side only via dynamic import ----
  useEffect(() => {
    if (typeof window === "undefined") return
    if (mapRef.current) return

    let map: any = null
    let isMounted = true

    async function initMap() {
      try {
        // Dynamic import avoids any SSR / webpack bundling issues
        const maplibregl = await import("maplibre-gl")

        if (!isMounted || !containerRef.current) return

        // maplibre-gl is an ES module with NAMED exports only (no default).
        // Prefer the namespace itself; fall back to .default only if it wraps exports.
        const mod: any = maplibregl
        const ml: any = mod?.Map ? mod : mod?.default?.Map ? mod.default : mod
        if (typeof ml?.Map !== "function") {
          throw new Error("MapLibre failed to load: Map constructor unavailable")
        }
        maplibreRef.current = ml

        const MapClass = ml.Map

        map = new MapClass({
          container: containerRef.current,
          style: getMapStyle() as any,
          center: initialCenter,
          zoom: initialZoom,
          minZoom: MAP_CONFIG.minZoom,
          maxZoom: MAP_CONFIG.maxZoom,
        })

        mapRef.current = map

        map.addControl(new maplibreRef.current.NavigationControl())

        map.on("load", () => {
          if (isMounted) fetchBusinesses()
        })

        let debounce: ReturnType<typeof setTimeout> | null = null
        map.on("moveend", () => {
          if (debounce) clearTimeout(debounce)
          debounce = setTimeout(() => {
            if (isMounted) fetchBusinesses()
          }, 300)
        })
      } catch (err) {
        console.error("MapLibre init error:", err)
      }
    }

    initMap()

    return () => {
      isMounted = false
      markersRef.current.forEach((m) => m.remove())
      markersRef.current = []
      if (map) {
        map.remove()
        mapRef.current = null
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  // Re-fetch when category changes
  useEffect(() => {
    if (mapRef.current) fetchBusinesses()
  }, [activeCategory, fetchBusinesses])

  // ---- Render markers ----
  useEffect(() => {
    const map = mapRef.current
    const ml = maplibreRef.current
    if (!map || !ml || allBusinesses.length === 0) return

    markersRef.current.forEach((m) => m.remove())
    markersRef.current = []

    const zoom = map.getZoom()
    const { clusterer } = createClusterer(allBusinesses, zoom)

    const bounds = map.getBounds()
    const bbox = [
      bounds.getWest(),
      bounds.getSouth(),
      bounds.getEast(),
      bounds.getNorth(),
    ] as [number, number, number, number]

    const clusters = getClusters(clusterer, bbox, zoom) as any[]

    clusters.forEach((feature: any) => {
      if (feature.properties.cluster) {
        const count = feature.properties.point_count
        const color = getClusterColor(count)
        const size = Math.min(46, 26 + Math.min(count, 30))
        const el = document.createElement("div")
        el.style.cssText = `
          width:${size}px;height:${size}px;background:${color};
          border:3px solid #fff;border-radius:50%;color:#fff;
          font-weight:800;font-size:${Math.min(14, 9 + Math.floor(count / 10))}px;
          display:flex;align-items:center;justify-content:center;
          box-shadow:0 3px 10px rgba(0,0,0,.35);cursor:pointer;
          transition:transform .15s ease;
        `
        el.innerHTML = `<span>${count}</span>`
        el.onmouseenter = () => { el.style.transform = "scale(1.1)" }
        el.onmouseleave = () => { el.style.transform = "scale(1)" }
        el.onclick = (e) => {
          e.stopPropagation()
          const leaves = getClusterLeaves(clusterer, feature.properties.cluster_id, 100)
          if (leaves.length > 0) {
            const lons = leaves.map((l: any) => l.geometry.coordinates[0])
            const lats = leaves.map((l: any) => l.geometry.coordinates[1])
            map.fitBounds(
              [[Math.min(...lons), Math.min(...lats)], [Math.max(...lons), Math.max(...lats)]],
              { padding: 70, maxZoom: 17, duration: 800 }
            )
          }
        }
        const marker = new ml.Marker({ element: el })
          .setLngLat(feature.geometry.coordinates as [number, number])
          .addTo(map)
        markersRef.current.push(marker)
      } else {
        const props = feature.properties as any
        const coords = feature.geometry?.coordinates as [number, number] | undefined
        const biz =
          allBusinesses.find((b) => b.id === props?.id) ??
          (coords ? ({ ...props, longitude: coords[0], latitude: coords[1] } as Business) : null)
        if (!biz || !Number.isFinite(biz.longitude) || !Number.isFinite(biz.latitude)) return
        renderBusinessMarker(map, ml, biz, zoom, markersRef.current, onMarkerClick, setSelectedBusiness, selectedBusiness?.id)
      }
    })
  }, [allBusinesses, selectedBusiness, onMarkerClick])

  // Expose controls globally
  const resetToKatraj = useCallback(() => {
    if (mapRef.current) {
      mapRef.current.flyTo({ center: initialCenter, zoom: initialZoom, duration: 1500 })
      setSelectedBusiness(null)
    }
  }, [initialCenter, initialZoom])

  const flyTo = useCallback((lng: number, lat: number, zoom = 15) => {
    if (mapRef.current) mapRef.current.flyTo({ center: [lng, lat], zoom, duration: 1000 })
  }, [])

  const flyToBusiness = useCallback((business: Business) => {
    flyTo(business.longitude, business.latitude, 17)
  }, [flyTo])

  useEffect(() => {
    if (typeof window !== "undefined") {
      ;(window as any).__katrajpuneMap = { resetToKatraj, flyTo, flyToBusiness }
    }
  }, [resetToKatraj, flyTo, flyToBusiness])

  return (
    <div
      ref={containerRef}
      style={{ position: "absolute", inset: 0, width: "100%", height: "100%" }}
    />
  )
}

function renderBusinessMarker(
  map: any,
  ml: any,
  biz: Business,
  zoom: number,
  markers: any[],
  onMarkerClick: (b: Business) => void,
  setSelected: (b: Business | null) => void,
  selectedId: string | null | undefined
) {
  if (!Number.isFinite(biz.longitude) || !Number.isFinite(biz.latitude)) return

  const color = getMarkerColor(biz.category)
  const isSelected = selectedId === biz.id

  const container = document.createElement("div")
  container.style.cssText = "display:flex;flex-direction:column;align-items:center;cursor:pointer;position:relative;"

  // Floating hover / active label (tooltip)
  const label = document.createElement("div")
  label.style.cssText = `
    position:absolute;bottom:calc(100% + 4px);left:50%;transform:translateX(-50%);
    background:rgba(16,36,58,0.95);color:#fff;padding:3px 8px;
    border-radius:6px;font-size:11px;font-weight:700;
    white-space:nowrap;box-shadow:0 2px 8px rgba(0,0,0,.35);pointer-events:none;
    display:${isSelected ? "block" : "none"};z-index:100;
    backdrop-filter:blur(4px);border:1px solid rgba(255,255,255,0.15);
  `
  const ratingText = biz.rating ? ` · ★${biz.rating.toFixed(1)}` : ""
  label.innerHTML = `<span>${biz.name}${ratingText}</span>`
  container.appendChild(label)

  // Circular marker dot with category emoji
  const dot = document.createElement("div")
  const size = isSelected ? 40 : 32
  dot.style.cssText = `
    width:${size}px;height:${size}px;
    background:${color};border:${isSelected ? "3px" : "2px"} solid #fff;
    border-radius:50%;color:#fff;font-weight:800;
    font-size:${isSelected ? "14px" : "12px"};
    display:flex;align-items:center;justify-content:center;
    box-shadow:${isSelected ? "0 0 0 4px rgba(242,140,40,.5),0 4px 14px rgba(0,0,0,.35)" : "0 2px 8px rgba(0,0,0,.25)"};
    transition:transform .15s ease, box-shadow .15s ease;
  `
  dot.innerHTML = `<span>${getMarkerEmoji(biz.category)}</span>`
  dot.title = `${biz.name}${ratingText}`

  // Hover interactions
  container.onmouseenter = () => {
    dot.style.transform = "scale(1.15)"
    label.style.display = "block"
    container.style.zIndex = "50"
  }
  container.onmouseleave = () => {
    if (!isSelected) {
      dot.style.transform = "scale(1)"
      label.style.display = "none"
      container.style.zIndex = "1"
    }
  }

  container.onclick = (e) => {
    e.stopPropagation()
    setSelected(biz)
    onMarkerClick(biz)
  }

  container.appendChild(dot)

  const marker = new ml.Marker({ element: container }).setLngLat([biz.longitude, biz.latitude]).addTo(map)
  markers.push(marker)
}
