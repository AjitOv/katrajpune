import { NextRequest, NextResponse } from "next/server"
import { createServerClient } from "@/lib/supabase/server"
import { z } from "zod"

const submitSchema = z.object({
  name: z.string().min(1),
  description: z.string().optional(),
  category: z.enum([
    "shopping",
    "restaurants",
    "healthcare",
    "education",
    "home_services",
    "automotive",
    "fitness",
    "professional_services",
  ]),
  locality: z.string().optional(),
  address: z.string().optional(),
  phone: z.string().optional(),
  whatsapp: z.string().optional(),
  email: z.string().email().optional().or(z.literal("")),
  website: z.string().url().optional().or(z.literal("")),
  latitude: z.number(),
  longitude: z.number(),
})

export const dynamic = "force-dynamic"

export async function POST(request: NextRequest) {
  const supabase = createServerClient()

  const {
    data: { user },
    error: authError,
  } = await supabase.auth.getUser()

  if (authError || !user) {
    return new NextResponse("Unauthorized", { status: 401 })
  }

  const body = await request.json()
  const parsed = submitSchema.safeParse(body)

  if (!parsed.success) {
    return NextResponse.json({ error: "Invalid input", details: parsed.error.flatten() }, { status: 400 })
  }

  const { name, description, category, locality, address, phone, whatsapp, email, website, latitude, longitude } =
    parsed.data

  const slug = name.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-+|-+$/g, "")

  // Check slug uniqueness
  const { data: existing } = await supabase.from("businesses").select("slug").eq("slug", slug).single()
  const finalSlug = existing ? `${slug}-${Date.now().toString(36).slice(-4)}` : slug

  const { data, error } = await supabase
    .from("businesses")
    .insert({
      slug: finalSlug,
      name,
      description,
      category,
      locality,
      address,
      phone,
      whatsapp,
      email: email || null,
      website: website || null,
      location_verified: false,
      geocoding_source: "owner_submission",
      latitude,
      longitude,
      status: "pending",
      owner_id: user.id,
    })
    .select()
    .single()

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }

  return NextResponse.json(data)
}
