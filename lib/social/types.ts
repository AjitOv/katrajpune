export interface SocialPostPayload {
  title: string
  text: string
  linkUrl?: string
  imageUrl?: string
  tags?: string[]
}

export interface SocialPublishResult {
  platform: "facebook" | "instagram" | "linkedin"
  success: boolean
  postId?: string
  url?: string
  error?: string
}

export interface BusinessSpotlightData {
  name: string
  slug: string
  category: string
  locality: string | null
  address: string | null
  rating: number | null
  reviews_count: number
  phone: string | null
  whatsapp: string | null
  photos: string[]
  logo_url: string | null
}
