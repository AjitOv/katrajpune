import fs from "fs"
import path from "path"
import { generateSpotlightPost, generateDiwaliPromoPost } from "../lib/social/generator"
import { publishToFacebookPage, publishToInstagram } from "../lib/social/meta"
import { publishToLinkedIn } from "../lib/social/linkedin"

const DATA_FILE = path.join(process.cwd(), "data", "katraj_businesses.json")

async function main() {
  const args = process.argv.slice(2)
  const isDryRun = args.includes("--dry-run")
  const typeArg = args.find((a) => a.startsWith("--type="))?.split("=")[1] || "spotlight"
  const channelArg = args.find((a) => a.startsWith("--channel="))?.split("=")[1] || "all"

  console.log("==================================================")
  console.log("📱 KATRAJPUNE SOCIAL MEDIA AUTO-POSTER")
  console.log("==================================================")
  console.log(`Type:     ${typeArg}`)
  console.log(`Channels: ${channelArg}`)
  console.log(`Mode:     ${isDryRun ? "DRY RUN (Preview Only)" : "LIVE PUBLISH"}`)
  console.log("==================================================\n")

  let post: { title: string; text: string; linkUrl?: string; imageUrl?: string }

  if (typeArg === "diwali") {
    post = generateDiwaliPromoPost()
  } else {
    if (!fs.existsSync(DATA_FILE)) {
      console.error("❌ Businesses data file not found:", DATA_FILE)
      process.exit(1)
    }

    const businesses: any[] = JSON.parse(fs.readFileSync(DATA_FILE, "utf-8"))
    // Filter businesses with high rating (>= 4.5) and valid photos
    const topCandidates = businesses.filter((b) => (b.rating || 0) >= 4.0 && b.photos && b.photos.length > 0)
    const candidate =
      topCandidates.length > 0
        ? topCandidates[Math.floor(Math.random() * topCandidates.length)]
        : businesses[Math.floor(Math.random() * businesses.length)]

    console.log(`Selected Business: "${candidate.name}" (${candidate.locality || "Katraj"}) - ⭐ ${candidate.rating || "N/A"}`)
    post = generateSpotlightPost(candidate)
  }

  console.log("\n📝 GENERATED POST COPY:")
  console.log("--------------------------------------------------")
  console.log(post.text)
  console.log("--------------------------------------------------")
  console.log(`🖼️ Image: ${post.imageUrl}`)
  console.log(`🔗 Link:  ${post.linkUrl}\n`)

  if (isDryRun) {
    console.log("✅ Dry run completed. No live posts were sent.")
    return
  }

  const channels =
    channelArg === "all"
      ? ["facebook", "instagram", "linkedin"]
      : channelArg.split(",")

  for (const channel of channels) {
    console.log(`🚀 Publishing to ${channel.toUpperCase()}...`)

    if (channel === "facebook") {
      const res = await publishToFacebookPage({
        message: post.text,
        imageUrl: post.imageUrl,
        linkUrl: post.linkUrl,
      })
      if (res.success) {
        console.log(`   ✅ Facebook: Published! (${res.url || res.postId})`)
      } else {
        console.log(`   ⚠️ Facebook: Failed -> ${res.error}`)
      }
    }

    if (channel === "instagram") {
      const res = await publishToInstagram({
        caption: post.text,
        imageUrl: post.imageUrl || "https://katrajpune.com/og-image.png",
      })
      if (res.success) {
        console.log(`   ✅ Instagram: Published! (${res.url || res.postId})`)
      } else {
        console.log(`   ⚠️ Instagram: Failed -> ${res.error}`)
      }
    }

    if (channel === "linkedin") {
      const res = await publishToLinkedIn({
        text: post.text,
        articleUrl: post.linkUrl,
        title: post.title,
      })
      if (res.success) {
        console.log(`   ✅ LinkedIn: Published! (${res.url || res.postId})`)
      } else {
        console.log(`   ⚠️ LinkedIn: Failed -> ${res.error}`)
      }
    }
  }

  console.log("\n🎉 Social media publishing run completed!")
}

main()

