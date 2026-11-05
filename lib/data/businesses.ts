import fs from "fs"
import path from "path"
import { createClient } from "@supabase/supabase-js"
import { Business } from "@/types/business"

function getPublicSupabase() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL
  const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
  if (!url || !key) return null
  return createClient(url, key, {
    auth: { persistSession: false, autoRefreshToken: false },
  })
}

let cachedBusinesses: Business[] | null = null
let lastMtime: number = 0

/**
 * Load all approved businesses (Supabase first, fallback to local dataset)
 */
export async function getAllApprovedBusinesses(): Promise<Business[]> {
  try {
    const supabase = getPublicSupabase()
    if (!supabase) return getLocalBusinesses()
    const { data, error } = await supabase
      .from("businesses")
      .select("*")
      .eq("status", "approved")
      .order("name", { ascending: true })

    if (!error && data && data.length > 0) {
      return data.map((b: any) => ({
        ...b,
        rating: b.rating ? Number(b.rating) : null,
        reviews_count: b.reviews_count ? Number(b.reviews_count) : 0,
        latitude: Number(b.latitude),
        longitude: Number(b.longitude),
      }))
    }
  } catch (err) {
    console.warn("Supabase fetch failed, falling back to local dataset:", err)
  }

  return getLocalBusinesses()
}

/**
 * Load local businesses dataset with automatic mtime cache invalidation
 */
export function getLocalBusinesses(): Business[] {
  try {
    const filePath = path.join(process.cwd(), "data", "katraj_businesses.json")
    if (fs.existsSync(filePath)) {
      const stats = fs.statSync(filePath)
      if (cachedBusinesses && stats.mtimeMs === lastMtime) {
        return cachedBusinesses
      }
      lastMtime = stats.mtimeMs
      const raw = fs.readFileSync(filePath, "utf-8")
      const parsed = JSON.parse(raw)
      cachedBusinesses = parsed.map((item: any, index: number) => ({
        id: item.id || `local-${index + 1}`,
        slug: item.slug,
        name: item.name,
        description: item.description || null,
        category: item.category,
        locality: item.locality || null,
        address: item.address || null,
        phone: item.phone || null,
        whatsapp: item.whatsapp || null,
        email: item.email || null,
        website: item.website || null,
        logo_url: item.logo_url || null,
        photos: Array.isArray(item.photos) ? item.photos : item.logo_url ? [item.logo_url] : [],
        opening_hours: item.opening_hours || null,
        location_verified: item.location_verified ?? true,
        geocoding_source: item.geocoding_source || "tinyfish_google_maps",
        latitude: Number(item.latitude),
        longitude: Number(item.longitude),
        rating: item.rating ? Number(item.rating) : null,
        reviews_count: item.reviews_count ? Number(item.reviews_count) : 0,
        status: item.status || "approved",
        owner_id: null,
        submitted_at: new Date().toISOString(),
        approved_at: new Date().toISOString(),
        approved_by: null,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      }))
      return cachedBusinesses!
    }
  } catch (err) {
    console.error("Failed to load local businesses:", err)
  }
  return []
}

/**
 * Get a single business by slug (Supabase first, fallback to 1000 dataset)
 */
export async function getBusinessBySlug(slug: string): Promise<Business | null> {
  try {
    const supabase = getPublicSupabase()
    if (!supabase) throw new Error("No supabase client")
    const { data, error } = await supabase
      .from("businesses")
      .select("*")
      .eq("slug", slug)
      .eq("status", "approved")
      .single()

    if (!error && data) {
      return {
        ...data,
        rating: data.rating ? Number(data.rating) : null,
        reviews_count: data.reviews_count ? Number(data.reviews_count) : 0,
        latitude: Number(data.latitude),
        longitude: Number(data.longitude),
      }
    }
  } catch (err) {
    // network or supabase not available, fallback
  }

  const locals = getLocalBusinesses()
  const found = locals.find((b) => b.slug === slug)
  return found || null
}

/**
 * Filter businesses within viewport bounds
 */
export async function fetchBusinessesInBounds({
  west,
  south,
  east,
  north,
  category,
  limit = 500,
  offset = 0,
}: {
  west: number
  south: number
  east: number
  north: number
  category?: string | null
  limit?: number
  offset?: number
}): Promise<Business[]> {
  try {
    const supabase = getPublicSupabase()
    if (!supabase) throw new Error("Supabase public client not configured")
    let query = supabase
      .from("businesses")
      .select("*")
      .eq("status", "approved")
      .gte("latitude", south)
      .lte("latitude", north)
      .gte("longitude", west)
      .lte("longitude", east)

    if (category && category !== "all") {
      query = query.eq("category", category)
    }

    const { data, error } = await query
      .order("name")
      .range(offset, offset + limit - 1)

    if (!error && data && data.length > 0) {
      return data.map((b: any) => ({
        ...b,
        rating: b.rating ? Number(b.rating) : null,
        reviews_count: b.reviews_count ? Number(b.reviews_count) : 0,
        latitude: Number(b.latitude),
        longitude: Number(b.longitude),
      }))
    }
  } catch (err) {
    // fallback to local
  }

  // Filter in memory from 1000 dataset
  const locals = getLocalBusinesses()
  return locals
    .filter((b) => {
      const matchBounds =
        b.latitude >= south &&
        b.latitude <= north &&
        b.longitude >= west &&
        b.longitude <= east
      const matchCat = !category || category === "all" || b.category === category
      return matchBounds && matchCat
    })
    .slice(offset, offset + limit)
}

/**
 * Search businesses with query, category, locality
 */
export async function searchBusinessesList({
  query,
  category,
  locality,
  limit = 50,
  offset = 0,
}: {
  query?: string
  category?: string | null
  locality?: string | null
  limit?: number
  offset?: number
}): Promise<Business[]> {
  try {
    const supabase = getPublicSupabase()
    if (!supabase) throw new Error("Supabase public client not configured")
    let dbQuery = supabase.from("businesses").select("*").eq("status", "approved")

    if (category && category !== "all") {
      dbQuery = dbQuery.eq("category", category)
    }
    if (locality) {
      dbQuery = dbQuery.eq("locality", locality)
    }
    if (query) {
      dbQuery = dbQuery.ilike("name", `%${query}%`)
    }

    const { data, error } = await dbQuery
      .order("name")
      .range(offset, offset + limit - 1)

    if (!error && data && data.length > 0) {
      return data.map((b: any) => ({
        ...b,
        rating: b.rating ? Number(b.rating) : null,
        reviews_count: b.reviews_count ? Number(b.reviews_count) : 0,
        latitude: Number(b.latitude),
        longitude: Number(b.longitude),
      }))
    }
  } catch (err) {
    // fallback
  }

  const locals = getLocalBusinesses()
  const qLower = (query || "").toLowerCase().trim()

  return locals
    .filter((b) => {
      const matchCat = !category || category === "all" || b.category === category
      const matchLoc = !locality || b.locality?.toLowerCase() === locality.toLowerCase()
      const matchQuery =
        !qLower ||
        b.name.toLowerCase().includes(qLower) ||
        b.address?.toLowerCase().includes(qLower) ||
        b.locality?.toLowerCase().includes(qLower) ||
        b.category.toLowerCase().includes(qLower) ||
        b.description?.toLowerCase().includes(qLower)
      return matchCat && matchLoc && matchQuery
    })
    .slice(offset, offset + limit)
}

