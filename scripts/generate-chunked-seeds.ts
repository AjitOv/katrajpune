import fs from "fs"
import path from "path"

const jsonPath = path.join(process.cwd(), "data", "katraj_businesses.json")
const businesses = JSON.parse(fs.readFileSync(jsonPath, "utf-8"))

const seedsDir = path.join(process.cwd(), "database", "seeds")
if (!fs.existsSync(seedsDir)) {
  fs.mkdirSync(seedsDir, { recursive: true })
}

const CHUNK_SIZE = 350
const BATCH_SIZE = 50

for (let chunkIdx = 0; chunkIdx < Math.ceil(businesses.length / CHUNK_SIZE); chunkIdx++) {
  const start = chunkIdx * CHUNK_SIZE
  const end = Math.min(start + CHUNK_SIZE, businesses.length)
  const chunk = businesses.slice(start, end)
  const partNum = chunkIdx + 1

  let sqlContent = `-- Part ${partNum} of 4: Katraj Businesses (${start + 1} to ${end} of ${businesses.length})\n\n`

  for (let i = 0; i < chunk.length; i += BATCH_SIZE) {
    const batch = chunk.slice(i, i + BATCH_SIZE)
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

    sqlContent += values.join(",\n") + "\nON CONFLICT (slug) DO UPDATE SET\n" +
      "  address = EXCLUDED.address,\n" +
      "  rating = EXCLUDED.rating,\n" +
      "  reviews_count = EXCLUDED.reviews_count,\n" +
      "  photos = EXCLUDED.photos,\n" +
      "  logo_url = EXCLUDED.logo_url,\n" +
      "  phone = EXCLUDED.phone,\n" +
      "  whatsapp = EXCLUDED.whatsapp,\n" +
      "  location = EXCLUDED.location;\n\n"
  }

  const filePath = path.join(seedsDir, `part${partNum}_businesses_${start + 1}_to_${end}.sql`)
  fs.writeFileSync(filePath, sqlContent, "utf-8")
  console.log(`Saved: ${filePath} (${(sqlContent.length / 1024).toFixed(1)} KB)`)
}

