import type { Metadata } from "next"
import Link from "next/link"
import { notFound } from "next/navigation"
import { getAllApprovedBusinesses } from "@/lib/data/businesses"
import { PAGE_SIZE, pageNumber, pagePath, SITE_URL, jsonLd } from "@/lib/seo"
import Pagination from "@/components/seo/Pagination"
type Props = { searchParams: { page?: string } }
export async function generateMetadata({searchParams}: Props): Promise<Metadata> {
 const page = pageNumber(searchParams.page)
 return {title: `All Katraj Business Profiles${page > 1 ? ` — Page ${page}` : ""}`, description: "Browse local business profiles in Katraj and nearby Pune neighbourhoods, with addresses, contact details and map locations.", alternates: {canonical: pagePath("/browse",page || 1)}, robots: page ? undefined : {index:false,follow:true} }
}
export default async function Browse({searchParams}: Props) {
 const all = (await getAllApprovedBusinesses()).sort((a,b) => a.name.localeCompare(b.name))
 const page = pageNumber(searchParams.page), total = Math.ceil(all.length/PAGE_SIZE)
 if (!page || page > Math.max(1,total)) notFound()
 const rows = all.slice((page-1)*PAGE_SIZE,page*PAGE_SIZE)
 const schema = {"@context":"https://schema.org","@type":"CollectionPage",url:SITE_URL+pagePath("/browse",page),name:`Katraj business profiles — page ${page}`,mainEntity:{"@type":"ItemList",numberOfItems:rows.length,itemListElement: rows.map((b,i)=>({"@type":"ListItem",position:(page-1)*PAGE_SIZE+i+1,url:`${SITE_URL}/business/${b.slug}`,name:b.name}))}}
 return <main className="max-w-6xl mx-auto px-6 py-8"><script type="application/ld+json" dangerouslySetInnerHTML={{__html:jsonLd(schema)}}/><h1 className="text-2xl font-bold text-navy">All business profiles in Katraj and nearby Pune</h1><p className="my-4">{all.length} listings. Page {page} of {total}. Contact businesses directly to confirm details.</p><div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">{rows.map(b => <article key={b.slug} className="bg-white border rounded-xl p-4"><h2 className="font-bold"><Link prefetch={false} href={`/business/${b.slug}`}>{b.name}</Link></h2><p>{b.locality} · {b.category.replace(/_/g," ")}</p><p className="text-sm mt-2">{b.address}</p></article>)}</div><Pagination path="/browse" page={page} total={total}/></main>
}
