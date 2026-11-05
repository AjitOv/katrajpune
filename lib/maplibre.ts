export const MAP_CONFIG = {
  center: [73.8456, 18.4593] as [number, number], // [lng, lat] - Katraj, Pune
  zoom: 13,
  minZoom: 10,
  maxZoom: 19,
  bearing: 0,
  pitch: 0,
} as const

/**
 * Map tile style URL.
 * Using OpenStreetMap-based Americana style from MapTiler CDN (free tier, no key required for basic tiles).
 * Falls back to OSM Bright style which is reliable and free.
 *
 * To use a production tile provider (MapTiler, Stadia, etc.),
 * set NEXT_PUBLIC_MAP_STYLE_URL in .env.local
 */
export function getMapStyle(): any {
  if (process.env.NEXT_PUBLIC_MAP_STYLE_URL) {
    return process.env.NEXT_PUBLIC_MAP_STYLE_URL
  }
  // Inline OSM raster style — zero dependencies, always works, no API key needed.
  // For a prettier vector style, set NEXT_PUBLIC_MAP_STYLE_URL in .env.local
  // e.g. a MapTiler or Stadia Maps style URL.
  return {
    version: 8,
    sources: {
      osm: {
        type: "raster",
        tiles: ["https://tile.openstreetmap.org/{z}/{x}/{y}.png"],
        tileSize: 256,
        attribution: "© <a href='https://www.openstreetmap.org/copyright'>OpenStreetMap</a> contributors",
        maxzoom: 19,
      },
    },
    layers: [
      {
        id: "osm-tiles",
        type: "raster",
        source: "osm",
        minzoom: 0,
        maxzoom: 19,
      },
    ],
  }
}

export const BUSINESS_CATEGORIES = [
  { value: "all", label: "All" },
  { value: "shopping", label: "Shopping" },
  { value: "restaurants", label: "Restaurants" },
  { value: "healthcare", label: "Healthcare" },
  { value: "education", label: "Education" },
  { value: "home_services", label: "Home Services" },
  { value: "automotive", label: "Automotive" },
  { value: "fitness", label: "Fitness" },
  { value: "professional_services", label: "Professional Services" },
] as const
