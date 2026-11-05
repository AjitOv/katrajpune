import HomeExperience from "@/components/map/HomeExperience"
import Link from "next/link"
export default function HomePage() {
 return <><section className="bg-white px-6 py-5 text-navy"><div className="max-w-6xl mx-auto"><h1 className="text-2xl font-bold">Find local businesses in Katraj, Pune</h1><p className="mt-2">Explore restaurants, healthcare, shops, education and services in Katraj and nearby neighbourhoods. Compare listed addresses and contact details, then confirm current hours and availability directly with the business.</p><Link href="/browse" className="inline-block mt-3 underline">Browse all business profiles</Link></div></section><HomeExperience /></>
}
