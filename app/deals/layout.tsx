import type { Metadata } from "next"
export const metadata: Metadata = {title:'Shopping Deals for Katraj, Pune',description:'Browse shopping offers and product links available through KatrajPune.',alternates:{canonical:"/deals"},openGraph:{title:'Shopping Deals for Katraj, Pune',description:'Browse shopping offers and product links available through KatrajPune.',url:"/deals"}}
export default function Layout({children}:{children:React.ReactNode}) {return <>{children}</>}
