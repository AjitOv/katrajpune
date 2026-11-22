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
    return process.env.NEXT_PUBLIC_MAP_STYLE_URL;
  }
  // OpenFreeMap Liberty: Free Vector Tiles with 3D building heights
  return "https://tiles.openfreemap.org/styles/liberty";
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
