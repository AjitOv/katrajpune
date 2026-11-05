import Link from "next/link"
import { CATEGORY_LABELS } from "@/types/business"
import { getLocalBusinesses } from "@/lib/data/businesses"
import { localities, localitySlug } from "@/lib/seo"
export default function DiscoveryLinks() {
 const businesses = getLocalBusinesses()
 return <footer className="border-t bg-white px-6 py-8 text-sm text-navy"><div className="max-w-6xl mx-auto space-y-4">
 <p className="font-bold">Explore Katraj and nearby Pune neighbourhoods</p>
 <nav aria-label="Business categories" className="flex flex-wrap gap-4">{Object.entries(CATEGORY_LABELS).map(([slug,label]) => <Link prefetch={false} key={slug} href={`/category/${slug}`}>{label}</Link>)}</nav>
 <nav aria-label="Neighbourhood directories" className="flex flex-wrap gap-4">{localities(businesses).map(label => <Link prefetch={false} key={label} href={`/locality/${localitySlug(label)}`}>{label}</Link>)}</nav>
 <nav aria-label="Directory information" className="flex flex-wrap gap-4"><Link href="/browse">Browse every business</Link><Link href="/directory">Search directory</Link><Link href="/about">About &amp; listing standards</Link><Link href="/add-business">Add a business</Link></nav>
 </div></footer>
}
