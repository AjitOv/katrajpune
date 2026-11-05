import Supercluster from "supercluster"
import { Business } from "@/types/business"

export type ClusterPoint = {
  lng: number
  lat: number
  id: string
  name: string
  category: string
  locality: string
  logo_url: string | null
}

// Zoom thresholds for clustering behaviour
export const ZOOM_THRESHOLDS = {
  // Below this: large clusters only
  WIDE: 12,
  // 12-16.5: clusters group nearby pins cleanly
  NEIGHBORHOOD: 16.5,
  // 17+: street level
  STREET: 17,
} as const

export function createClusterer(businesses: Business[], zoom: number) {
  const points: GeoJSON.Feature<GeoJSON.Point, ClusterPoint>[] = businesses.map(
    (b) => ({
      type: "Feature",
      properties: {
        lng: b.longitude,
        lat: b.latitude,
        id: b.id,
        name: b.name,
        category: b.category,
        locality: b.locality || "",
        logo_url: b.logo_url || null,
      },
      geometry: {
        type: "Point",
        coordinates: [b.longitude, b.latitude],
      },
    })
  )

  const clusterer = new Supercluster<ClusterPoint, any>({
    radius: 60, // pixels
    maxZoom: 17,
    minZoom: 9,
    extent: 512,
    nodeSize: 64,
  })

  clusterer.load(points)

  // Determine clustering mode based on zoom
  let showClusters: "none" | "small" | "large"
  if (zoom < ZOOM_THRESHOLDS.WIDE) {
    showClusters = "large"
  } else if (zoom < ZOOM_THRESHOLDS.NEIGHBORHOOD) {
    showClusters = "small"
  } else {
    showClusters = "none"
  }

  return { clusterer, showClusters }
}

export function getClusters(
  clusterer: any,
  bbox: [number, number, number, number],
  zoom: number
) {
  return clusterer.getClusters(bbox, Math.floor(zoom))
}

export function getClusterLeaves(
  clusterer: any,
  clusterId: number,
  limit: number = 10
) {
  return clusterer.getLeaves(clusterId, limit)
}

export function shouldShowLabels(zoom: number): boolean {
  return zoom >= ZOOM_THRESHOLDS.STREET
}

export function shouldShowClusters(zoom: number): boolean {
  return zoom < ZOOM_THRESHOLDS.NEIGHBORHOOD
}
