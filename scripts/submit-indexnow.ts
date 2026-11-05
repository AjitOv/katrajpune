import sitemap from "../app/sitemap"
import { SITE_CONFIG } from "../lib/config"

async function submitIndexNow() {
  console.log("🚀 Preparing IndexNow URL submission for katrajpune.com...")

  const sitemapEntries = await sitemap()
  const urlList = sitemapEntries.map((item) => item.url)

  console.log(`📊 Discovered ${urlList.length} URLs in sitemap to submit.`)

  const payload = {
    host: SITE_CONFIG.domain,
    key: SITE_CONFIG.indexNow.key,
    keyLocation: SITE_CONFIG.indexNow.keyLocation,
    urlList,
  }

  // Endpoints: IndexNow Central Gateway and Bing
  const endpoints = [
    "https://api.indexnow.org/indexnow",
    "https://www.bing.com/indexnow",
  ]

  for (const endpoint of endpoints) {
    try {
      console.log(`📡 Submitting ${urlList.length} URLs to ${endpoint}...`)
      const res = await fetch(endpoint, {
        method: "POST",
        headers: {
          "Content-Type": "application/json; charset=utf-8",
        },
        body: JSON.stringify(payload),
      })

      if (res.status === 200 || res.status === 202) {
        console.log(`✅ [${res.status} ${res.statusText}] Successfully submitted to ${endpoint}`)
      } else {
        const text = await res.text()
        console.warn(`⚠️ [${res.status} ${res.statusText}] Response from ${endpoint}: ${text}`)
      }
    } catch (err: any) {
      console.error(`❌ Failed to send to ${endpoint}:`, err.message)
    }
  }

  console.log("\n🎉 IndexNow submission completed!")
  console.log("Bing, Yahoo, DuckDuckGo, and ChatGPT Search will now prioritize indexing these URLs.")
}

submitIndexNow()
