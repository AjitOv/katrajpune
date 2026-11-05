import { createClient } from "@/lib/supabase/client"
import { Business } from "@/types/business"

const BATCH_SIZE = 50

// Seed Katraj, Pune businesses with real-ish coordinates
const SEED_BUSINESSES: Omit<Business, "id" | "submitted_at" | "created_at" | "updated_at" | "status" | "approved_at" | "approved_by">[] = [
  {
    slug: "katraj-mart",
    name: "Katraj Mart",
    description: "Daily groceries and household essentials",
    category: "shopping",
    locality: "Katraj",
    address: "Katraj Bus Stand, Katraj, Pune",
    phone: "+91 98765 43210",
    whatsapp: "+91 98765 43210",
    email: "contact@katrajmart.com",
    website: null,
    logo_url: null,
    photos: [],
    opening_hours: { mon: "08:00-22:00", tue: "08:00-22:00", wed: "08:00-22:00", thu: "08:00-22:00", fri: "08:00-22:00", sat: "08:00-22:00", sun: "09:00-21:00" },
    location_verified: true,
    geocoding_source: "manual",
    latitude: 18.4593,
    longitude: 73.8456,
    owner_id: null,
  },
  {
    slug: "sai-dining",
    name: "Sai Dining",
    description: "Family restaurant serving Maharashtrian and North Indian cuisine",
    category: "restaurants",
    locality: "Katraj",
    address: "Near Katraj Dairy, Katraj, Pune",
    phone: "+91 98765 43211",
    whatsapp: "+91 98765 43211",
    email: null,
    website: null,
    logo_url: null,
    photos: [],
    opening_hours: { mon: "11:00-23:00", tue: "11:00-23:00", wed: "11:00-23:00", thu: "11:00-23:00", fri: "11:00-23:00", sat: "11:00-00:00", sun: "11:00-23:00" },
    location_verified: true,
    geocoding_source: "manual",
    latitude: 18.456,
    longitude: 73.848,
    owner_id: null,
  },
  {
    slug: "katraj-hospital",
    name: "Katraj Community Hospital",
    description: "Multi-speciality hospital with emergency services",
    category: "healthcare",
    locality: "Katraj",
    address: "Katraj-Satara Road, Katraj, Pune",
    phone: "+91 98765 43212",
    whatsapp: "+91 98765 43212",
    email: "info@katrajhospital.com",
    website: null,
    logo_url: null,
    photos: [],
    opening_hours: { mon: "24 hrs", tue: "24 hrs", wed: "24 hrs", thu: "24 hrs", fri: "24 hrs", sat: "24 hrs", sun: "24 hrs" },
    location_verified: true,
    geocoding_source: "manual",
    latitude: 18.462,
    longitude: 73.842,
    owner_id: null,
  },
  {
    slug: "pune-public-school",
    name: "Pune Public School Katraj",
    description: "CBSE school for primary and secondary education",
    category: "education",
    locality: "Katraj",
    address: "Katraj-Satara Road, Katraj, Pune",
    phone: "+91 98765 43213",
    whatsapp: "+91 98765 43213",
    email: "admission@punepublicschool.com",
    website: null,
    logo_url: null,
    photos: [],
    opening_hours: { mon: "07:30-14:30", tue: "07:30-14:30", wed: "07:30-14:30", thu: "07:30-14:30", fri: "07:30-14:30", sat: "07:30-12:30", sun: "closed" },
    location_verified: true,
    geocoding_source: "manual",
    latitude: 18.465,
    longitude: 73.84,
    owner_id: null,
  },
  {
    slug: "raj-home-services",
    name: "Raj Home Services",
    description: "Plumbing, electrical and AC repair services",
    category: "home_services",
    locality: "Katraj",
    address: "Katraj, Pune",
    phone: "+91 98765 43214",
    whatsapp: "+91 98765 43214",
    email: null,
    website: null,
    logo_url: null,
    photos: [],
    opening_hours: { mon: "09:00-18:00", tue: "09:00-18:00", wed: "09:00-18:00", thu: "09:00-18:00", fri: "09:00-18:00", sat: "09:00-18:00", sun: "closed" },
    location_verified: true,
    geocoding_source: "manual",
    latitude: 18.458,
    longitude: 73.847,
    owner_id: null,
  },
  {
    slug: "katraj-auto",
    name: "Katraj Auto Care",
    description: "Car servicing and two-wheeler repair",
    category: "automotive",
    locality: "Katraj",
    address: "Katraj-Satara Road, Katraj, Pune",
    phone: "+91 98765 43215",
    whatsapp: "+91 98765 43215",
    email: null,
    website: null,
    logo_url: null,
    photos: [],
    opening_hours: { mon: "09:00-19:00", tue: "09:00-19:00", wed: "09:00-19:00", thu: "09:00-19:00", fri: "09:00-19:00", sat: "09:00-19:00", sun: "10:00-17:00" },
    location_verified: true,
    geocoding_source: "manual",
    latitude: 18.455,
    longitude: 73.85,
    owner_id: null,
  },
  {
    slug: "fitness-hub",
    name: "Fitness Hub Gym",
    description: "Gym and personal training center",
    category: "fitness",
    locality: "Katraj",
    address: "Near Katraj Bus Stand, Katraj, Pune",
    phone: "+91 98765 43216",
    whatsapp: "+91 98765 43216",
    email: null,
    website: null,
    logo_url: null,
    photos: [],
    opening_hours: { mon: "06:00-22:00", tue: "06:00-22:00", wed: "06:00-22:00", thu: "06:00-22:00", fri: "06:00-22:00", sat: "07:00-21:00", sun: "08:00-20:00" },
    location_verified: true,
    geocoding_source: "manual",
    latitude: 18.46,
    longitude: 73.846,
    owner_id: null,
  },
  {
    slug: "legal-assist",
    name: "Legal Assist Associates",
    description: "Professional legal and tax consultancy",
    category: "professional_services",
    locality: "Katraj",
    address: "Katraj, Pune",
    phone: "+91 98765 43217",
    whatsapp: "+91 98765 43217",
    email: "consult@legalassist.in",
    website: null,
    logo_url: null,
    photos: [],
    opening_hours: { mon: "10:00-18:00", tue: "10:00-18:00", wed: "10:00-18:00", thu: "10:00-18:00", fri: "10:00-18:00", sat: "10:00-15:00", sun: "closed" },
    location_verified: true,
    geocoding_source: "manual",
    latitude: 18.461,
    longitude: 73.844,
    owner_id: null,
  },
  {
    slug: "dairy-fresh",
    name: "Dairy Fresh Milk",
    description: "Fresh dairy products and milk delivery",
    category: "shopping",
    locality: "Katraj",
    address: "Katraj Dairy, Katraj, Pune",
    phone: "+91 98765 43218",
    whatsapp: "+91 98765 43218",
    email: null,
    website: null,
    logo_url: null,
    photos: [],
    opening_hours: { mon: "06:00-21:00", tue: "06:00-21:00", wed: "06:00-21:00", thu: "06:00-21:00", fri: "06:00-21:00", sat: "06:00-21:00", sun: "07:00-20:00" },
    location_verified: true,
    geocoding_source: "manual",
    latitude: 18.457,
    longitude: 73.843,
    owner_id: null,
  },
]

async function main() {
  const supabase = createClient()
  let inserted = 0
  let skipped = 0

  for (const biz of SEED_BUSINESSES) {
    // Check if slug exists
    const { data: existing } = await supabase
      .from("businesses")
      .select("slug")
      .eq("slug", biz.slug)
      .single()

    if (existing) {
      skipped++
      continue
    }

    const { error } = await supabase
      .from("businesses")
      .insert({ ...biz, status: "approved" })

    if (error) {
      console.error(`Failed to insert ${biz.slug}:`, error.message)
    } else {
      inserted++
    }
  }

  console.log(`Seed complete: ${inserted} inserted, ${skipped} skipped (already exist)`)
}

main().catch((err) => {
  console.error("Seed failed:", err)
  process.exit(1)
})
