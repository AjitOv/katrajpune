import fs from "fs"
import path from "path"
import { createClient } from "@supabase/supabase-js"

interface BusinessItem {
  slug: string
  name: string
  description: string
  category: string
  locality: string
  address: string
  phone: string
  whatsapp: string
  email: string | null
  website: string | null
  logo_url: string
  photos: string[]
  rating: number
  reviews_count: number
  latitude: number
  longitude: number
  opening_hours: Record<string, string>
  location_verified: boolean
  geocoding_source: string
  status: string
}

const newBusinesses: BusinessItem[] = [
  {
    slug: "maza-ghar-day-care-bharti-vidyapeeth",
    name: "Maza Ghar Day Care",
    description: "Maza Ghar Day Care is a verified, top-rated (5.0★) child care and family day care center located in Shreeram Sahaniwas Society, Bharati Vidyapeeth, Katraj, Pune.",
    category: "education",
    locality: "Bharati Vidyapeeth",
    address: "Fl E-3 Shreeram sahaniwas society, Bhartividyapeeth, Khashaba Jadhav Path, Katraj, Pune, Maharashtra 411046",
    phone: "+91 97621 24010",
    whatsapp: "+91 97621 24010",
    email: null,
    website: "http://mazaghardaycare.in/",
    logo_url: "https://lh3.googleusercontent.com/grass-cs/AABkmLe-7KFrFwqQ2Wt9oalPHgympNcXJCdgVfWzQoAygExGiCXNEiQ4VkdwPSZAA7WS5CrmhYJMUbePqeCZPh9YTY5xovDFmLmPwozo75GSxp4RFmHGP_khcivAwKtEwxnGRWUmJhNnHSGEdhtB=w800-h600-k-no",
    photos: [
      "https://lh3.googleusercontent.com/grass-cs/AABkmLe-7KFrFwqQ2Wt9oalPHgympNcXJCdgVfWzQoAygExGiCXNEiQ4VkdwPSZAA7WS5CrmhYJMUbePqeCZPh9YTY5xovDFmLmPwozo75GSxp4RFmHGP_khcivAwKtEwxnGRWUmJhNnHSGEdhtB=w800-h600-k-no",
      "https://lh3.googleusercontent.com/grass-cs/AABkmLdJ0Xozicx4LrccyHy8z0inMgmxmeTd3mZ5t222x0EpKRlOhwfBsDT2Co430f5_T3h_8WtsSA2A2hqRBfylnZeBYZegdnz4GVeCI5pq1RxI5XwbibN8YZzi3jSspfHfpKL3kibiNg=w800-h600-k-no"
    ],
    rating: 5.0,
    reviews_count: 59,
    latitude: 18.453918,
    longitude: 73.852761,
    opening_hours: {
      mon: "08:30-19:30",
      tue: "08:30-19:30",
      wed: "08:30-19:30",
      thu: "08:30-19:30",
      fri: "08:30-19:30",
      sat: "08:30-18:00",
      sun: "closed"
    },
    location_verified: true,
    geocoding_source: "google_maps_live",
    status: "approved"
  },
  {
    slug: "sachstar-enterprises-dhankawadi",
    name: "SACHSTAR ENTERPRISES",
    description: "SACHSTAR ENTERPRISES is a top-rated (5.0★) water filter supplier and RO water purification service center located in Chavan Nagar, Dhankawadi, Pune.",
    category: "home_services",
    locality: "Dhankawadi",
    address: "Chavan nagar, Dhankawadi, Pune, Maharashtra 411043",
    phone: "+91 73855 24449",
    whatsapp: "+91 73855 24449",
    email: null,
    website: "https://www.sachstar.com/",
    logo_url: "https://lh3.googleusercontent.com/grass-cs/AABkmLdGr7vM3YJlb2iFjkVauKOG1dpPQp9HgVhtJmH8ovKTJSeGeZPBSH8MeP28HLnHCsOnK3MeDGlBylFkNFe8wg_z5jQhm0RdOmYs_G6eBX586WjxtnWk2F-cX4PtZwaAdNtkeVxhCOwUnyld=w800-h600-k-no",
    photos: [
      "https://lh3.googleusercontent.com/grass-cs/AABkmLdGr7vM3YJlb2iFjkVauKOG1dpPQp9HgVhtJmH8ovKTJSeGeZPBSH8MeP28HLnHCsOnK3MeDGlBylFkNFe8wg_z5jQhm0RdOmYs_G6eBX586WjxtnWk2F-cX4PtZwaAdNtkeVxhCOwUnyld=w800-h600-k-no",
      "https://lh3.googleusercontent.com/grass-cs/AABkmLc5HK0M0r-YiEg6TDX-kSyhz59z3OijvmwoVASyKyYbbVN9K8LIfWZMGjHU1pQ5br59T1Zor0hgutgdBHT5H3kSgGHkTkzZ8eBovXSLdNF4Q6FWscKrE9tjcChtrBv_vqnEhiIF=w800-h600-k-no"
    ],
    rating: 5.0,
    reviews_count: 62,
    latitude: 18.470816,
    longitude: 73.855024,
    opening_hours: {
      mon: "09:30-20:30",
      tue: "09:30-20:30",
      wed: "09:30-20:30",
      thu: "09:30-20:30",
      fri: "09:30-20:30",
      sat: "09:30-20:30",
      sun: "10:00-14:00"
    },
    location_verified: true,
    geocoding_source: "google_maps_live",
    status: "approved"
  }
]

async function run() {
  // 1. Update katraj_businesses.json
  const jsonPath = path.resolve(process.cwd(), "data", "katraj_businesses.json")
  const businesses = JSON.parse(fs.readFileSync(jsonPath, "utf-8"))

  for (const nb of newBusinesses) {
    const existingIdx = businesses.findIndex((b: any) => b.slug === nb.slug)
    if (existingIdx !== -1) {
      businesses[existingIdx] = nb
      console.log(`Updated existing in JSON: ${nb.name}`)
    } else {
      businesses.push(nb)
      console.log(`Added new to JSON: ${nb.name}`)
    }
  }

  fs.writeFileSync(jsonPath, JSON.stringify(businesses, null, 2), "utf-8")
  console.log(`Total businesses in JSON: ${businesses.length}`)

  // 2. Update katraj_businesses.csv
  const csvPath = path.resolve(process.cwd(), "data", "katraj_businesses.csv")
  let csvContent = fs.readFileSync(csvPath, "utf-8")
  for (const nb of newBusinesses) {
    const line = `"${nb.name}","${nb.category}","${nb.locality}","${nb.address}","${nb.whatsapp}","${nb.phone}",${nb.latitude},${nb.longitude},${nb.rating},${nb.reviews_count},"${nb.logo_url}"`
    if (!csvContent.includes(nb.name)) {
      csvContent = csvContent.trim() + "\n" + line + "\n"
      console.log(`Added to CSV: ${nb.name}`)
    }
  }
  fs.writeFileSync(csvPath, csvContent, "utf-8")

  // 3. Sync to Supabase
  const envPath = path.resolve(process.cwd(), ".env.local")
  if (fs.existsSync(envPath)) {
    const envLines = fs.readFileSync(envPath, "utf-8").split("\n")
    const envMap: Record<string, string> = {}
    for (const line of envLines) {
      const trimmed = line.trim()
      if (!trimmed || trimmed.startsWith("#")) continue
      const eqIdx = trimmed.indexOf("=")
      if (eqIdx !== -1) {
        envMap[trimmed.slice(0, eqIdx).trim()] = trimmed.slice(eqIdx + 1).trim().replace(/^["']|["']$/g, "")
      }
    }

    const supabaseUrl = envMap["NEXT_PUBLIC_SUPABASE_URL"]
    const serviceKey = envMap["SUPABASE_SERVICE_ROLE_KEY"]

    if (supabaseUrl && serviceKey) {
      const supabase = createClient(supabaseUrl, serviceKey)
      for (const b of newBusinesses) {
        const dbRow = {
          slug: b.slug,
          name: b.name,
          description: b.description,
          category: b.category,
          locality: b.locality,
          address: b.address,
          phone: b.phone,
          whatsapp: b.whatsapp,
          website: b.website,
          logo_url: b.logo_url,
          photos: b.photos,
          rating: b.rating,
          reviews_count: b.reviews_count,
          latitude: b.latitude,
          longitude: b.longitude,
          opening_hours: b.opening_hours,
          location_verified: b.location_verified,
          geocoding_source: b.geocoding_source,
          status: b.status,
        }

        const { error } = await supabase.from("businesses").upsert(dbRow, { onConflict: "slug" })
        if (error) {
          console.error(`Supabase upsert error for ${b.slug}:`, error.message)
        } else {
          console.log(`Successfully upserted into Supabase: ${b.name}`)
        }
      }
    }
  }
}

run().catch((err) => {
  console.error(err)
  process.exit(1)
})
