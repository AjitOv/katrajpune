export type BusinessCategory =
  | "shopping"
  | "restaurants"
  | "healthcare"
  | "education"
  | "home_services"
  | "automotive"
  | "fitness"
  | "professional_services"

export type BusinessStatus = "pending" | "approved" | "rejected"

export interface Business {
  id: string
  slug: string
  name: string
  description: string | null
  category: BusinessCategory
  locality: string | null
  address: string | null
  phone: string | null
  whatsapp: string | null
  email: string | null
  website: string | null
  logo_url: string | null
  photos: string[]
  rating?: number | null
  reviews_count?: number | null
  opening_hours: Record<string, any> | null
  location_verified: boolean
  geocoding_source: string | null
  latitude: number
  longitude: number
  status: BusinessStatus
  owner_id: string | null
  submitted_at: string
  approved_at: string | null
  approved_by: string | null
  created_at: string
  updated_at: string
}

export interface BusinessMarker extends Business {
  distance_meters?: number
}

export interface ViewportBounds {
  north: number
  south: number
  east: number
  west: number
}

export interface MarkerIconProps {
  category: BusinessCategory
  selected?: boolean
  size?: number
}

export const CATEGORY_LABELS: Record<BusinessCategory, string> = {
  shopping: "Shopping",
  restaurants: "Restaurants",
  healthcare: "Healthcare",
  education: "Education",
  home_services: "Home Services",
  automotive: "Automotive",
  fitness: "Fitness",
  professional_services: "Professional Services",
}

export const CATEGORY_COLORS: Record<BusinessCategory, string> = {
  shopping: "#10b981",
  restaurants: "#f43f5e",
  healthcare: "#3b82f6",
  education: "#8b5cf6",
  home_services: "#f59e0b",
  automotive: "#ef4444",
  fitness: "#06b6d4",
  professional_services: "#6366f1",
}
