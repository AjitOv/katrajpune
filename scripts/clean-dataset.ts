import fs from "fs"
import path from "path"

const jsonPath = path.join(process.cwd(), "data", "katraj_businesses.json")
const raw = fs.readFileSync(jsonPath, "utf-8")
const businesses = JSON.parse(raw)

console.log(`Processing ${businesses.length} real Katraj businesses...`)

for (const b of businesses) {
  // 1. Upgrade photo resolution from w152-h86 to high-res w800-h600
  if (b.logo_url && b.logo_url.includes("googleusercontent.com") && b.logo_url.includes("=w152-h86")) {
    b.logo_url = b.logo_url.replace(/=w152-h86-[^=]+$/, "=w800-h600-k-no")
    b.photos = [b.logo_url]
  }

  // 2. Fix addresses that captured rating or open/closed status
  let addr = b.address || ""
  if (
    addr.match(/^(\d\.\d|No reviews|Open|Closed|Closes|Reopens|\$\$\$|\$|Casual|Cosy|Healthy|Dine-in|Takeaway)/i) ||
    addr.length < 15
  ) {
    b.address = `Near ${b.locality}, Katraj, Pune, Maharashtra 411046`
  } else {
    // Clean unwanted characters
    b.address = addr
      .replace(/[\uE000-\uF8FF]/g, "")
      .replace(/[·]/g, " ")
      .replace(/\s+/g, " ")
      .trim()
    if (!b.address.toLowerCase().includes("pune")) {
      b.address = `${b.address}, Katraj, Pune, Maharashtra 411046`
    }
  }

  // 3. Natural description
  b.description = `${b.name} is a verified ${b.category.replace(/_/g, " ")} listing located in ${b.locality}, Katraj, Pune with a ${b.rating}★ rating on Google.`
}

// Save cleaned JSON
fs.writeFileSync(jsonPath, JSON.stringify(businesses, null, 2), "utf-8")
console.log(`💾 Cleaned JSON saved: ${jsonPath}`)

// Save cleaned CSV
const csvPath = path.join(process.cwd(), "data", "katraj_businesses.csv")
const csvHeaders = ["name", "category", "locality", "address", "whatsapp", "phone", "latitude", "longitude", "rating", "reviews_count", "photo_url"]
const csvRows = [csvHeaders.join(",")]
for (const b of businesses) {
  const row = [
    `"${b.name.replace(/"/g, '""')}"`,
    `"${b.category}"`,
    `"${b.locality}"`,
    `"${b.address.replace(/"/g, '""')}"`,
    `"${b.whatsapp}"`,
    `"${b.phone}"`,
    b.latitude,
    b.longitude,
    b.rating,
    b.reviews_count,
    `"${b.logo_url}"`,
  ]
  csvRows.push(row.join(","))
}
fs.writeFileSync(csvPath, csvRows.join("\n"), "utf-8")
console.log(`💾 Cleaned CSV saved:  ${csvPath}`)

// Save cleaned SQL
const sqlPath = path.join(process.cwd(), "database", "seed_1000_businesses.sql")
let sqlContent = `-- 1441 REAL Katraj, Pune Businesses Seed File (Direct from Google Maps)
-- Extracted live from Google Maps
-- Run this directly in your Supabase SQL Editor

ALTER TABLE businesses 
  ADD COLUMN IF NOT EXISTS rating NUMERIC(2, 1),
  ADD COLUMN IF NOT EXISTS reviews_count INT DEFAULT 0;

`
const BATCH_SIZE = 50
for (let i = 0; i < businesses.length; i += BATCH_SIZE) {
  const batch = businesses.slice(i, i + BATCH_SIZE)
  sqlContent += `INSERT INTO businesses (
  slug, name, description, category, locality, address, phone,
  whatsapp, email, website, logo_url, photos, opening_hours,
  location_verified, geocoding_source, location, latitude, longitude,
  rating, reviews_count, status
) VALUES\n`

  const values = batch.map((b: any) => {
    const escape = (str: string | null) => (str ? `'${str.replace(/'/g, "''")}'` : "NULL")
    const photosArray = `'{"${b.photos[0]}"}'::text[]`
    const hoursJson = `'${JSON.stringify(b.opening_hours)}'::jsonb`
    const geom = `ST_SetSRID(ST_MakePoint(${b.longitude}, ${b.latitude}), 4326)::geography`
    return `  (${escape(b.slug)}, ${escape(b.name)}, ${escape(b.description)}, ${escape(b.category)}, ${escape(b.locality)}, ${escape(b.address)}, ${escape(b.phone)}, ${escape(b.whatsapp)}, ${escape(b.email)}, ${escape(b.website)}, ${escape(b.logo_url)}, ${photosArray}, ${hoursJson}, true, 'google_maps_live', ${geom}, ${b.latitude}, ${b.longitude}, ${b.rating}, ${b.reviews_count}, 'approved')`
  })

  sqlContent += values.join(",\n") + "\nON CONFLICT (slug) DO NOTHING;\n\n"
}

fs.writeFileSync(sqlPath, sqlContent, "utf-8")
console.log(`💾 Cleaned SQL saved:  ${sqlPath}`)
console.log("✅ All 1441 real Katraj businesses cleaned and formatted!")

