# KatrajPune (katrajpune.com)

> **Map-first hyperlocal business discovery platform for Katraj, Pune (PIN: 411046)**  
> Live production website: [https://katrajpune.com](https://katrajpune.com)

![KatrajPune Platform](https://katrajpune.com/og-image.png)

---

## 🌟 Overview

**KatrajPune** is a production-grade, map-first discovery directory indexing **1,440+ verified local businesses** across Katraj, Bharati Vidyapeeth, Katraj-Kondhwa Road, Katraj Ghat, Ambegaon, Bibvewadi, and Dhankawadi in Pune, Maharashtra.

Built with Next.js 14 App Router, MapLibre GL, Supercluster, PostGIS / Supabase, and Tailwind CSS.

---

## 🚀 Key Features

* **🗺️ Interactive Map & Dynamic Clustering:**
  * MapLibre GL rendering with vector basemaps.
  * Supercluster spatial indexing clustering pins cleanly at neighborhood levels.
  * Street-level zoom with individual category pins and sleek hover tooltips.
  * One-tap Business Card preview with WhatsApp chat, direct calling, and directions.
* **📋 Business Directory Grid & Search:**
  * Real-time autocomplete search across 1,440+ listings with locality filtering.
  * Categorized under Shopping, Restaurants, Healthcare, Education, Home Services, Automotive, Fitness, and Professional Services.
* **💰 Monetization & Merchant Portal:**
  * **Add Business Listing (₹350/-):** Dedicated self-serve onboarding portal at `/add-business` with instant Razorpay checkout.
  * **Claim Listing (₹350/-):** Searchable owner verification portal at `/claim` for merchants to update phone numbers, WhatsApp, and photos.
* **📈 Affiliate & Ad Integrations:**
  * **Dhan Demat Partnership:** Sponsored banner and top announcement bar promoting zero-brokerage Demat accounts.
  * **Amazon Deals Showcase:** Curated deals hub at `/deals` featuring bestsellers with Amazon affiliate integration (`tag=ftechindia-21`).
* **🤖 SEO, GEO & AEO Optimization:**
  * Dynamic 1,460+ URL `sitemap.xml` and `robots.txt`.
  * Comprehensive AI agent discovery endpoints: `/llms.txt` and `/llms-full.txt`.
  * Schema.org `LocalBusiness`, `Organization`, and `BreadcrumbList` JSON-LD structured data on all profile pages.
  * Hyperlocal Dublin Core and ICBM geo tags (`IN-MH`, `18.452936, 73.855301`).

---

## 🛠️ Tech Stack

* **Framework:** [Next.js 14](https://nextjs.org/) (App Router, React 18, TypeScript)
* **Styling:** [Tailwind CSS 3](https://tailwindcss.com/)
* **Maps & Geo:** [MapLibre GL](https://maplibre.org/), [Supercluster](https://github.com/mapbox/supercluster)
* **Database & Auth:** [Supabase](https://supabase.com/) (PostgreSQL + PostGIS)
* **Analytics:** [@vercel/analytics](https://vercel.com/analytics)
* **Payments:** Razorpay Payment Gateway integration

---

## 💻 Getting Started Locally

### 1. Clone the repository
```bash
git clone https://github.com/AjitOv/katrajpune.git
cd katrajpune
```

### 2. Install dependencies
```bash
npm install
```

### 3. Environment variables
Copy the example file:
```bash
cp .env.example .env.local
```
Fill in your Supabase credentials if running with remote database:
```env
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
NEXT_PUBLIC_APP_URL=http://localhost:3000
```

### 4. Run the development server
```bash
npm run dev
```
Open [http://localhost:3000](http://localhost:3000) to view the application.

### 5. Build for production
```bash
npm run build
npm start
```

---

## 📁 Project Structure

```
├── app/                  # Next.js 14 App Router routes & layouts
│   ├── add-business/     # ₹350/- New listing submission portal
│   ├── business/[slug]/  # SEO/GEO business profile pages
│   ├── claim/            # ₹350/- Listing claim verification flow
│   ├── deals/            # Amazon affiliate bestsellers & deals
│   ├── directory/        # Searchable grid view of businesses
│   ├── sitemap.ts        # Dynamic multi-page XML sitemap
│   └── llms.txt/         # AEO LLM-readable directory metadata
├── components/           # Reusable UI & map components
│   ├── ads/              # Dhan and Amazon promotional modules
│   ├── directory/        # Business cards & directory filters
│   └── map/              # MapContainer, BusinessCard, controls
├── data/                 # 1,440+ verified Katraj business records
├── database/             # PostgreSQL PostGIS schema & seed scripts
├── lib/                  # Supercluster, MapLibre & data helpers
└── public/               # Static assets & icons
```

---

## 📄 License

Private & Proprietary © 2026 KatrajPune. All rights reserved.
