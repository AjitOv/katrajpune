import Link from "next/link"
import { pagePath } from "@/lib/seo"
export default function Pagination({ path, page, total }: { path: string; page: number; total: number }) {
 if (total <= 1) return null
 return <nav aria-label="Listing pages" className="flex flex-wrap justify-center gap-3 py-8">
 {Array.from({length: total}, (_, i) => i + 1).map(n => <Link prefetch={false} key={n} href={pagePath(path,n)} aria-current={n === page ? "page" : undefined} className={`px-3 py-2 rounded-lg border ${n === page ? "bg-navy text-white" : "bg-white text-navy"}`}>{n}</Link>)}
 </nav>
}
