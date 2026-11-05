# KATRAJPUNE — Implementation Plan

Map-first hyperlocal business discovery platform for Katraj, Pune.

**Source:** Product Architecture Update (17 sections, acceptance criteria)
**Tech stack:** Next.js App Router · TypeScript · MapLibre GL JS · Supabase PostgreSQL + PostGIS

---

## 1. Project Context

KatrajPune is **not** a conventional directory. The interactive geographic map **is** the homepage and primary navigation. Users discover businesses by moving around and zooming into the map of Katraj, Pune.

**Map center (Katraj, Pune):** `18.4593° N, 73.8456° E` → `[18.4593, 73.8456]`

---

## 2. Tech Stack Decisions

| Layer | Choice | Rationale |
|-------|--------|-----------|
| Framework | Next.js App Router | SSR, SEO pages, route handlers, incremental adoption |
| Language | TypeScript | Type safety for geo data, Supabase bindings |
| Map engine | MapLibre GL JS | Open-source, clustering, custom markers, viewport events |
| Map tiles | MapTiler / Stadia / Thunderforest (evaluate pricing) | Avoid OSM demo tile servers for production |
| Database | Supabase PostgreSQL | Managed Postgres, built-in auth, real-time |
| Spatial | PostGIS extension | `geography(Point, 4326)`, spatial indexes, `ST_MakeEnvelope`, `ST_DWithin` |
| Auth | Supabase Auth | Owner + admin role separation |
| Hosting | Vercel | Already configured for katrajpune.com |
| Styling | Tailwind CSS | Rapid UI, dark/light, responsive map overlays |

---

## 3. Database Schema (Supabase + PostGIS)

Enable PostGIS in Supabase SQL editor:

```sql
CREATE EXTENSION IF NOT EXISTS postgis;

CREATE TABLE businesses (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  slug TEXT UNIQUE NOT NULL,
  name TEXT NOT NULL,
  description TEXT,
  category TEXT NOT NULL CHECK (category IN (
    'shopping','restaurants','healthcare','education',
    'home_services','automotive','fitness','professional_services'
  )),
  locality TEXT,
  address TEXT,
  phone TEXT,
  whatsapp TEXT,
  email TEXT,
  website TEXT,
  logo_url TEXT,
  photos TEXT[] DEFAULT '{}',
  opening_hours JSONB,
  location_verified BOOLEAN DEFAULT FALSE,
  geocoding_source TEXT,
  location geography(Point, 4326) NOT NULL,
  latitude DOUBLE PRECISION NOT NULL,
  longitude DOUBLE PRECISION NOT NULL,
  status TEXT DEFAULT 'pending' CHECK (status IN ('pending','approved','rejected')),
  owner_id UUID REFERENCES auth.users(id),
  submitted_at TIMESTAMPTZ DEFAULT NOW(),
  approved_at TIMESTAMPTZ,
  approved_by UUID REFERENCES auth.users(id),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Spatial index for viewport / radius queries
CREATE INDEX idx_businesses_location ON businesses USING GIST (location);
-- Regular indexes
CREATE INDEX idx_businesses_status ON businesses(status);
CREATE INDEX idx_businesses_category ON businesses(category);
CREATE INDEX idx_businesses_locality ON businesses(locality);
CREATE INDEX idx_businesses_slug ON businesses(slug);

-- Keep lat/long and geography in sync
CREATE OR REPLACE FUNCTION sync_lat_long()
RETURNS TRIGGER AS $$
BEGIN
  NEW.latitude := ST_Y(NEW.location::geometry);
  NEW.longitude := ST_X(NEW.location::geometry);
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trg_sync_lat_long
BEFORE INSERT OR UPDATE OF location ON businesses
FOR EACH ROW EXECUTE FUNCTION sync_lat_long();

-- Row Level Security
ALTER TABLE businesses ENABLE ROW LEVEL SECURITY;

-- Public read: only approved businesses
CREATE POLICY "Public can view approved businesses" ON businesses
  FOR SELECT USING (status = 'approved');

-- Owners can manage their own submissions
CREATE POLICY "Owners manage own businesses" ON businesses
  FOR ALL USING (auth.uid() = owner_id);

-- Admins manage all
CREATE POLICY "Admins manage all businesses" ON businesses
  FOR ALL USING (
    EXISTS (SELECT 1 FROM auth.users WHERE id = auth.uid() AND raw_user_meta_data->>'role' = 'admin')
  );
```

---

## 4. Implementation Phases

### Phase 1 — Foundation (Week 1)
**Goal:** Supabase + PostGIS ready, Next.js scaffold, seed Katraj data.

1. Initialize Next.js App Router + TypeScript + Tailwind
2. Supabase project setup, enable PostGIS extension
3. Create `businesses` schema + RLS policies (above)
4. Seed 50–100 real/sample businesses across Katraj localities with categories
5. Create Supabase client helpers (`lib/supabase/server.ts`, `lib/supabase/client.ts`)
6. Preserve existing auth / admin / owner dashboards (do not remove)

**Exit criteria:** `supabase seed` loads; querying approved businesses returns rows with `location`.

---

### Phase 2 — Map MVP (Week 2–3)
**Goal:** Full-screen MapLibre map centered on Katraj, category markers, basic clustering.

1. Install `maplibre-gl`, `maplibre-gl-react` (or vanilla JS wrapper)
2. `app/page.tsx` → full-screen map container (most of viewport)
3. Floating KatrajPune logo (top-left)
4. Search bar (top-center)
5. Category filter chips (below search)
6. Map controls: zoom in/out, current-location (gated on permission), reset-to-Katraj
7. Fetch approved businesses within viewport bounds → render markers
8. Category-specific marker icons (SVG):
   - Shopping: 🛒 bag · Restaurants: 🍴 utensils · Healthcare: ❤️ · Education: 🎓 · Home services: 🔧 · Automotive: 🚗 · Fitness: 🏋️ · Professional: 💼
9. Marker states: unselected / hover / selected
10. Click marker → open business information card (compact)

**Exit criteria:** Map loads; markers appear at correct Katraj locations; clicking a marker shows a card.

---

### Phase 3 — Clustering & Zoom Behaviour (Week 3–4)
**Goal:** Dynamic clustering so hundreds of markers never overlap.

1. Implement MapLibre supercluster or `maplibre-gl-cluster`
2. Zoom thresholds:
   - Wide (z < 11): large clusters with counts
   - Neighbourhood (z 11–15): smaller clusters
   - Street (z 15+): individual business markers with category icons
3. Cluster click → `map.easeTo` zoom into cluster bounds
4. Business name labels appear at street-level zoom only (avoid clutter)
5. Clustering test with actual Katraj coordinates

**Exit criteria:** No overlapping markers; cluster counts visible; zoom into cluster works.

---

### Phase 4 — Search, Filters & Viewport Fetching (Week 4–5)
**Goal:** Debounced search, category chips, viewport-based data fetching.

1. Search bar: business name, category, locality, address, services
2. Debounce: 300ms before API call
3. Category filter chips: All, Food, Shopping, Healthcare, Education, Home services, Automotive, Professional services
4. Optional locality filters
5. Map viewport listeners (`moveend`, `zoomend`):
   - Detect new bounds (`map.getBounds()`)
   - Fetch businesses inside bounds via PostGIS `ST_MakeEnvelope`
   - Update markers + results panel
6. Avoid loading full database into browser (pagination + bounds filtering)
7. Server-side / database function for bounded queries:

```sql
-- Example bounded query
SELECT id, slug, name, category, locality, ST_AsGeoJSON(location) as geom
FROM businesses
WHERE status = 'approved'
  AND ST_Intersects(location, ST_MakeEnvelope($1, $2, $3, $4, 4326))
  AND ($5::text[] IS NULL OR category = ANY($5::text[]))
LIMIT $6 OFFSET $7;
```

**Exit criteria:** Panning/zooming fetches only visible businesses; search + filters update markers.

---

### Phase 5 — Business Cards & Profiles (Week 5–6)
**Goal:** Marker info card + SEO-indexable business pages.

1. Business info card (compact):
   - Photo/logo, name, category, locality, verification badge
   - Opening status (when hours available)
   - Call / WhatsApp / Directions / View full profile
2. Mobile: draggable/expandable bottom sheet
3. Desktop: floating card or left-side results panel
4. `/business/[slug]` dynamic route:
   - Description, address, contact, photos, hours, map mini-view, directions
   - Dynamic metadata (title, description, canonical URL)
   - Structured data (LocalBusiness schema.org)
5. SEO category pages: `/category/[slug]`, locality pages: `/locality/[slug]`
6. Sitemap generation (`sitemap.ts` / `robots.ts`)

**Exit criteria:** Tapping marker → info card; `/business/slug` page is indexable.

---

### Phase 6 — Owner Submission Flow (Week 6–7)
**Goal:** Business owners can add + place pins.

1. Owner auth (Supabase Auth)
2. "Add your business" form:
   - Name, category, address, contact, photos
   - Search address → place map pin manually
   - Drag pin to correct shop location
   - Preview location on admin-style map
   - Submit for approval (status = `pending`)
3. Prevent owners from arbitrarily relocating verified businesses without reapproval
4. Owner dashboard: view submissions, edit pending listings

**Exit criteria:** Owner can submit a business with a map pin; submission shows as pending.

---

### Phase 7 — Admin Map Management (Week 7–8)
**Goal:** Admin moderation interface.

1. Admin auth (role-based, preserve existing admin permissions)
2. Map-based management interface:
   - Search addresses
   - Place business pin manually
   - Drag existing pin to correct location
   - See duplicate coordinates
   - Verify location accuracy
   - Approve / reject location
   - Filter by approval status and category
3. Audit log: all location changes authorized and recorded (`approved_by`, `approved_at`)
4. Only `approved` businesses appear on public map

**Exit criteria:** Admin can approve/reject; rejected businesses do not appear publicly.

---

### Phase 8 — Performance & Mobile (Week 8–9)
**Goal:** Fast map on low-end Android, slow networks.

1. Marker clustering (already in Phase 3)
2. PostGIS spatial indexes (already in Phase 1)
3. Viewport debouncing (already in Phase 4)
4. Cache search responses (SWR / React Query or Next.js cache)
5. Lazy-load business photographs (next/image, blur placeholders)
6. Avoid excessive map re-renders (React.memo, useMapEvents)
7. Test on low-end Android devices
8. Handle slow network: skeleton states, retry logic

**Exit criteria:** Map loads < 3s on 3G; smooth panning on Android.

---

### Phase 9 — SEO (Week 9)
**Goal:** Map discovery does not replace SEO.

1. Individual business pages `/business/[slug]` with dynamic metadata
2. Category landing pages
3. Locality landing pages
4. Canonical URLs, sitemap, robots.txt
5. JSON-LD `LocalBusiness` structured data
6. Internal links from map cards → business pages

**Exit criteria:** Business pages indexable; sitemap validates.

---

### Phase 10 — Polish, Testing & Launch (Week 10)
**Goal:** Acceptance criteria met.

1. All 15 acceptance criteria verified (see below)
2. Desktop + Android testing
3. Security + permissions testing (RLS, role checks)
4. Deploy to Vercel production (katrajpune.com)
5. Custom domain DNS already configured (A record → 76.76.21.21)

---

## 5. Acceptance Criteria Mapping

| # | Criterion | Phase |
|---|-----------|-------|
| 1 | App opens on map centered on Katraj | Phase 2 |
| 2 | Approved businesses at correct locations | Phase 1, 2 |
| 3 | Nearby businesses cluster | Phase 3 |
| 4 | Zooming reveals individual businesses | Phase 3 |
| 5 | Tapping marker opens info card | Phase 2, 5 |
| 6 | Search updates visible results | Phase 4 |
| 7 | Category filters update markers | Phase 4 |
| 8 | Panning/zooming fetches relevant businesses | Phase 4 |
| 9 | Owners submit exact map locations | Phase 6 |
| 10 | Admins correct and approve locations | Phase 7 |
| 11 | Only approved listings appear publicly | Phase 1 (RLS), Phase 7 |
| 12 | Full business profiles accessible | Phase 5 |
| 13 | Map works on desktop and Android | Phase 8 |
| 14 | SEO remains functional | Phase 5, 9 |
| 15 | Security and permissions pass testing | Phase 7, 10 |

---

## 6. Directory Structure (Next.js App Router)

```
katrajpune/
├── app/
│   ├── layout.tsx
│   ├── page.tsx              # Full-screen map homepage
│   ├── business/[slug]/      # SEO business profile
│   ├── category/[slug]/      # Category landing page
│   ├── locality/[slug]/      # Locality landing page
│   ├── owner/
│   │   ├── dashboard/
│   │   └── add-business/     # Owner submission + pin placement
│   ├── admin/
│   │   └── map/              # Admin moderation map
│   └── api/
│       ├── businesses/       # Bounded fetch, search, filters
│       ├── submissions/      # Owner submissions
│       └── admin/            # Approve/reject, audit
├── components/
│   ├── map/
│   │   ├── MapContainer.tsx
│   │   ├── Markers.tsx
│   │   ├── Clustering.tsx
│   │   ├── Controls.tsx      # Zoom, location, reset
│   │   └── BusinessCard.tsx
│   ├── search/
│   │   ├── SearchBar.tsx
│   │   └── CategoryChips.tsx
│   └── ui/
├── lib/
│   ├── supabase/
│   │   ├── server.ts
│   │   └── client.ts
│   ├── maplibre.ts           # MapLibre config, token, tile URL
│   └── utils.ts
├── types/
│   └── business.ts
├── PLAN.md                   # This file
└── vercel.json               # Existing config preserved
```

---

## 7. Immediate Next Steps

1. **Review & approve this plan** — confirm tech stack choices and Katraj coordinates.
2. **Supabase setup** — enable PostGIS, create `businesses` table + RLS.
3. **Seed data** — load 50–100 sample Katraj businesses with real lat/long.
4. **Scaffold Next.js** — install MapLibre GL JS, build `app/page.tsx` map shell.

Would you like me to begin with Phase 1 (Supabase schema + Next.js scaffold), or adjust any part of the plan first?
