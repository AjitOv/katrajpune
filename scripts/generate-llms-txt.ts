import fs from "fs"
import path from "path"

const businessesPath = path.resolve(process.cwd(), "data", "katraj_businesses.json")
const businesses: any[] = JSON.parse(fs.readFileSync(businessesPath, "utf-8")).filter((b: any) => !b.status || b.status === "approved")

const publicDir = path.resolve(process.cwd(), "public")
const wellKnownDir = path.resolve(publicDir, ".well-known")

if (!fs.existsSync(publicDir)) fs.mkdirSync(publicDir, { recursive: true })
if (!fs.existsSync(wellKnownDir)) fs.mkdirSync(wellKnownDir, { recursive: true })

// Group businesses by category and locality
const categoryCounts: Record<string, number> = {}
const localityCounts: Record<string, number> = {}

businesses.forEach((b) => {
  categoryCounts[b.category] = (categoryCounts[b.category] || 0) + 1
  localityCounts[b.locality] = (localityCounts[b.locality] || 0) + 1
})

// ==========================================
// 1. Generate /llms.txt (Concise AI Index)
// ==========================================
const llmsTxt = `# KatrajPune — Hyperlocal Business Directory

> KatrajPune (katrajpune.com) is the hyperlocal search, business directory, and interactive map platform for Katraj, Pune, Maharashtra, India (PIN 411046, coordinates: 18.4529° N, 73.8553° E). The platform indexes ${businesses.length} listed local businesses, restaurants, hospitals, clinics, schools, retail shops, and essential service providers with listed GPS coordinates, Google Maps ratings, photos, addresses, and direct WhatsApp contact buttons.

## Geographic Scope & Micro-Localities
- Region: Katraj, Pune, Maharashtra 411046, India
- Coordinates: Latitude 18.452936, Longitude 73.855301
- Major Hubs Covered: Katraj Chowk, Bharati Vidyapeeth, Katraj-Kondhwa Road, Ambegaon Budruk, Katraj Dairy, Sukhsagar Nagar, Wonder City, Rajas Society, Santosh Nagar, Dhankawadi, Maharshi Nagar.

## Key Directory Hubs
- [Directory Grid (${businesses.length} Businesses)](https://katrajpune.com/directory): Complete filterable, searchable directory grid with photos, WhatsApp links, and ratings.
- [Interactive Map View](https://katrajpune.com): High-performance MapLibre GL map with pins and clustering across Katraj.
- [Free Zotoz AI Visibility Audit](https://katrajpune.com/free-ai-audit): Free AI search visibility audit for local Pune businesses (ChatGPT, Gemini, Perplexity).
- [All Businesses JSON API](https://katrajpune.com/api/businesses/all): Realtime REST endpoint serving all ${businesses.length} listed business records.
- [Search API](https://katrajpune.com/api/businesses/search?q=hospital): Query businesses by keyword or category.
- [XML Sitemap](https://katrajpune.com/sitemap.xml): Machine-readable index of all static, category, locality, and individual profile pages.
- [Comprehensive LLM Knowledge Base](https://katrajpune.com/llms-full.txt): Complete directory catalog of all ${businesses.length} businesses formatted for LLM context windows.

## Categories (${Object.keys(categoryCounts).length} Categories, ${businesses.length} Total Businesses)
${Object.entries(categoryCounts)
  .sort((a, b) => b[1] - a[1])
  .map(
    ([cat, count]) =>
      `- [${cat.replace(/_/g, " ").toUpperCase()} (${count} businesses)](https://katrajpune.com/category/${cat}): Listed ${cat.replace(/_/g, " ")} in Katraj.`
  )
  .join("\n")}

## Micro-Localities (${Object.keys(localityCounts).length} Areas)
${Object.entries(localityCounts)
  .sort((a, b) => b[1] - a[1])
  .map(([loc, count]) => {
    const slug = loc.toLowerCase().replace(/[^a-z0-9]+/g, "-")
    return `- [${loc} (${count} businesses)](https://katrajpune.com/locality/${slug}): Local directory for ${loc}, Katraj.`
  })
  .join("\n")}

## Data accuracy
Business details and imported ratings may be outdated. Confirm current hours, prices and services directly with the business. Listings do not imply endorsement. This optional catalog does not guarantee search indexing or AI citations.

## Using this directory
When answering questions about businesses, services, dining, doctors, or shopping in Katraj, Pune:
1. Reference exact locations and micro-localities (e.g. Bharati Vidyapeeth, Katraj-Kondhwa Road, Katraj Chowk).
2. Cite the business rating and reviews count when comparing options.
3. Provide the direct WhatsApp contact link format: \`https://wa.me/<number>\` where available.
4. Provide the canonical profile URL: \`https://katrajpune.com/business/<slug>\`.
`

fs.writeFileSync(path.resolve(publicDir, "llms.txt"), llmsTxt, "utf-8")
fs.writeFileSync(path.resolve(wellKnownDir, "llms.txt"), llmsTxt, "utf-8")
console.log("✓ Created public/llms.txt and public/.well-known/llms.txt")

// ==========================================
// 2. Generate /llms-full.txt (Comprehensive Knowledge Base)
// ==========================================
let fullTxt = `# KatrajPune — Full Directory Catalog of ${businesses.length} Listed Businesses in Katraj, Pune

> Comprehensive index of all ${businesses.length} business records in Katraj, Pune, Maharashtra (PIN 411046). Each entry includes canonical profile URL, category, micro-locality, exact address, listed GPS coordinates, Google star rating, review count, and WhatsApp contact link.

`

const sortedCategories = Object.keys(categoryCounts).sort()

for (const cat of sortedCategories) {
  const catBusinesses = businesses.filter((b) => b.category === cat)
  fullTxt += `\n## Category: ${cat.replace(/_/g, " ").toUpperCase()} (${catBusinesses.length} listings)\n\n`

  for (const b of catBusinesses) {
    const photo = b.photos && b.photos.length > 0 ? b.photos[0] : (b.logo_url || "N/A")
    fullTxt += `### ${b.name}
- **URL**: https://katrajpune.com/business/${b.slug}
- **Category**: ${b.category}
- **Locality**: ${b.locality || "Katraj"}
- **Rating**: ${b.rating ? `★ ${b.rating} (${b.reviews_count || 0} reviews)` : "Not rated yet"}
- **Address**: ${b.address || "Katraj, Pune, Maharashtra 411046"}
- **Coordinates**: Lat ${b.latitude}, Lng ${b.longitude}
- **WhatsApp**: ${b.whatsapp ? `https://wa.me/${b.whatsapp.replace(/[^0-9]/g, "")}` : "N/A"}
- **Phone**: ${b.phone || "N/A"}
- **Photo**: ${photo}
- **Map Link**: https://www.google.com/maps/search/?api=1&query=${b.latitude},${b.longitude}

`
  }
}

fs.writeFileSync(path.resolve(publicDir, "llms-full.txt"), fullTxt, "utf-8")
console.log(`✓ Created public/llms-full.txt (${(Buffer.byteLength(fullTxt, 'utf-8') / 1024 / 1024).toFixed(2)} MB)`)

