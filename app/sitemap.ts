import { MetadataRoute } from "next"
import { getAllApprovedBusinesses } from "@/lib/data/businesses"
import { CATEGORY_LABELS } from "@/types/business"
import { SITE_URL, localities, localitySlug } from "@/lib/seo"
export const revalidate = 3600
export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
 const businesses = await getAllApprovedBusinesses()
 const paths = ["", "/directory", "/browse", "/about", "/free-ai-audit", "/add-business", "/claim", "/deals",
 ...Object.keys(CATEGORY_LABELS).filter(cat => businesses.some(b=>b.category===cat)).map(cat=>`/category/${cat}`),
 ...localities(businesses).map(label=>`/locality/${localitySlug(label)}`),
 ...businesses.map(b=>`/business/${b.slug}`)]
 return Array.from(new Set(paths)).map(path=>({url:SITE_URL+path}))
}
