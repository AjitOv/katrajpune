import { MetadataRoute } from "next"
export default function robots(): MetadataRoute.Robots {
 const disallow = ["/admin", "/api/admin", "/api/owner", "/api/auth", "/api/payment", "/owner", "/auth", "/payment"]
 return {rules: [{userAgent:"*",allow:"/",disallow}, {userAgent:["OAI-SearchBot","ChatGPT-User","GPTBot","ClaudeBot","PerplexityBot","Google-Extended","Applebot"],allow:"/",disallow}],sitemap:"https://katrajpune.com/sitemap.xml",host:"https://katrajpune.com"}
}
