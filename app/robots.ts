import { MetadataRoute } from "next"

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: "*",
        allow: "/",
        disallow: [
          "/admin",
          "/admin/*",
          "/api/admin",
          "/api/admin/*",
          "/api/owner",
          "/api/owner/*",
          "/owner",
          "/owner/*",
          "/auth/*",
        ],
      },
      // Explicit AI / LLM / Answer Engine permissions for AEO & GEO
      {
        userAgent: [
          "GPTBot",
          "ChatGPT-User",
          "ClaudeBot",
          "Claude-Web",
          "PerplexityBot",
          "Google-Extended",
          "Applebot",
          "Applebot-Extended",
          "Amazonbot",
          "cohere-ai",
          "Bytespider",
          "Diffbot",
        ],
        allow: [
          "/",
          "/directory",
          "/business/*",
          "/category/*",
          "/locality/*",
          "/api/businesses/*",
          "/llms.txt",
          "/llms-full.txt",
        ],
        disallow: ["/admin/*", "/owner/*"],
      },
    ],
    sitemap: "https://katrajpune.com/sitemap.xml",
    host: "https://katrajpune.com",
  }
}
