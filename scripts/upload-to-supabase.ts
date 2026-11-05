import fs from "fs"
import path from "path"
import { createClient } from "@supabase/supabase-js"

function loadEnv() {
  const envPath = path.resolve(process.cwd(), ".env.local")
  if (fs.existsSync(envPath)) {
    const lines = fs.readFileSync(envPath, "utf-8").split("\n")
    for (const line of lines) {
      const trimmed = line.trim()
      if (!trimmed || trimmed.startsWith("#")) continue
      const eqIdx = trimmed.indexOf("=")
      if (eqIdx !== -1) {
        const key = trimmed.slice(0, eqIdx).trim()
        const val = trimmed.slice(eqIdx + 1).trim().replace(/^["']|["']$/g, "")
        if (!process.env[key]) {
          process.env[key] = val
        }
      }
    }
  }
}

loadEnv()

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY

if (!supabaseUrl || !serviceKey) {
  console.error("Missing NEXT_PUBLIC_SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY in .env.local")
  process.exit(1)
}

const supabase = createClient(supabaseUrl, serviceKey, {
  auth: { persistSession: false },
})

async function main() {
  console.log("Connecting to production Supabase at:", supabaseUrl)

  const jsonPath = path.resolve(process.cwd(), "data", "katraj_businesses.json")
  const businesses = JSON.parse(fs.readFileSync(jsonPath, "utf-8"))
  console.log(`Loaded ${businesses.length} real Katraj businesses to seed.`)

  const BATCH_SIZE = 50
  let uploaded = 0
  let errors = 0

  for (let i = 0; i < businesses.length; i += BATCH_SIZE) {
    const batch = businesses.slice(i, i + BATCH_SIZE).map((b: any) => ({
      slug: b.slug,
      name: b.name,
      description: b.description,
      category: b.category,
      locality: b.locality,
      address: b.address,
      phone: b.phone,
      whatsapp: b.whatsapp,
      email: b.email,
      website: b.website,
      logo_url: b.logo_url,
      photos: b.photos,
      opening_hours: b.opening_hours,
      location_verified: true,
      geocoding_source: b.geocoding_source,
      latitude: b.latitude,
      longitude: b.longitude,
      rating: b.rating,
      reviews_count: b.reviews_count,
      status: "approved",
    }))

    const { error } = await supabase.from("businesses").upsert(batch, { onConflict: "slug" })
    if (error) {
      console.error(`Batch ${Math.floor(i / BATCH_SIZE) + 1} error:`, error.message)
      errors++
    } else {
      uploaded += batch.length
      process.stdout.write(`   ✓ Uploaded ${uploaded} / ${businesses.length} businesses\r`)
    }
  }

  console.log(`\n🎉 Upload Complete! ${uploaded} businesses successfully uploaded to Supabase production.`)
  if (errors > 0) {
    console.log(`⚠️ ${errors} batches had errors.`)
  }
}

main().catch((err) => {
  console.error("Fatal:", err)
  process.exit(1)
})

