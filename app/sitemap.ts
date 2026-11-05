import { MetadataRoute } from "next"
import { getLocalBusinesses } from "@/lib/data/businesses"

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const businesses = getLocalBusinesses()
  const baseUrl = "https://katrajpune.com"
  const now = new Date()

  // 1. Static Pages
  const staticUrls: MetadataRoute.Sitemap = [
    {
      url: baseUrl,
      lastModified: now,
      changeFrequency: "daily",
      priority: 1.0,
    },
    {
      url: `${baseUrl}/directory`,
      lastModified: now,
      changeFrequency: "daily",
      priority: 0.95,
    },
    {
      url: `${baseUrl}/add-business`,
      lastModified: now,
      changeFrequency: "monthly",
      priority: 0.9,
    },
    {
      url: `${baseUrl}/claim`,
      lastModified: now,
      changeFrequency: "monthly",
      priority: 0.9,
    },
    {
      url: `${baseUrl}/deals`,
      lastModified: now,
      changeFrequency: "daily",
      priority: 0.85,
    },
  ]

  // 2. Category Pages (8 Categories)
  const categories = [
    "restaurants",
    "healthcare",
    "shopping",
    "education",
    "fitness",
    "automotive",
    "home_services",
    "professional_services",
  ]
  const categoryUrls: MetadataRoute.Sitemap = categories.map((cat) => ({
    url: `${baseUrl}/category/${cat}`,
    lastModified: now,
    changeFrequency: "daily",
    priority: 0.85,
  }))

  // 3. Locality Pages (9 Micro-Localities)
  const localities = [
    "bharati-vidyapeeth",
    "katraj-kondhwa-road",
    "katraj-chowk",
    "ambegaon-budruk",
    "rajas-society",
    "katraj-dairy",
    "sukhsagar-nagar",
    "santosh-nagar",
    "wonder-city",
  ]
  const localityUrls: MetadataRoute.Sitemap = localities.map((loc) => ({
    url: `${baseUrl}/locality/${loc}`,
    lastModified: now,
    changeFrequency: "daily",
    priority: 0.85,
  }))

  // 4. All 1,441 Individual Business Pages
  const businessUrls: MetadataRoute.Sitemap = businesses.map((b) => ({
    url: `${baseUrl}/business/${b.slug}`,
    lastModified: now,
    changeFrequency: "weekly",
    priority: 0.75,
  }))

  return [...staticUrls, ...categoryUrls, ...localityUrls, ...businessUrls]
}
