import { BusinessSpotlightData } from "./types"

const PUNE_HASHTAGS = [
  "#Katraj",
  "#Pune",
  "#KatrajPune",
  "#PuneLocal",
  "#PuneBusiness",
  "#BharatiVidyapeeth",
  "#KatrajChowk",
  "#PuneDirectory",
  "#VocalForLocal",
  "#PuneDiaries",
]

/**
 * Generate a high-engagement Social Media Spotlight Post
 */
export function generateSpotlightPost(b: BusinessSpotlightData) {
  const ratingText = b.rating
    ? `⭐ ${b.rating.toFixed(1)} / 5.0 (${b.reviews_count || 0} Google Reviews)`
    : "⭐ Highly Recommended Local Business"

  const localityText = b.locality || "Katraj, Pune"
  const categoryClean = b.category.replace("_", " ").toUpperCase()

  const text = `🌟 KATRAJ LOCAL SPOTLIGHT: ${b.name.toUpperCase()} 🌟

Looking for verified ${categoryClean} in ${localityText}? 

📍 Location: ${b.address || `${localityText}, Katraj 411046`}
${ratingText}
${b.whatsapp ? `💬 WhatsApp Orders/Inquiry: ${b.whatsapp}` : b.phone ? `📞 Contact: ${b.phone}` : ""}

👉 View Full Profile, Photos & Directions on KatrajPune:
https://katrajpune.com/business/${b.slug}

━━━━━━━━━━━━━━━━━━━━━
📢 ARE YOU THE OWNER OF THIS BUSINESS?
Claim your verified badge, add your direct WhatsApp button, and reach 50,000+ local Pune residents:
👉 https://katrajpune.com/claim?slug=${b.slug}

${PUNE_HASHTAGS.slice(0, 7).join(" ")}`

  // Best available image or fallback branded image
  const imageUrl =
    b.photos && b.photos.length > 0
      ? b.photos[0]
      : b.logo_url || "https://katrajpune.com/og-image.png"

  return {
    title: `Local Spotlight: ${b.name}`,
    text,
    linkUrl: `https://katrajpune.com/business/${b.slug}`,
    imageUrl,
    tags: PUNE_HASHTAGS,
  }
}

/**
 * Generate Diwali Special Offer Promotion Post (B2B Owner Outreach)
 */
export function generateDiwaliPromoPost() {
  const text = `🪔 ATTENTION KATRAJ BUSINESS OWNERS & SERVICE PROVIDERS! 🪔

Diwali Limited Offer: Get Your Business Officially Verified on Katraj's #1 Local Search & Map Platform!

• Regular Annual Price: ~₹1,499/year~
• 🌟 DIWALI SPECIAL: ONLY ₹350 FOR 1 FULL YEAR!
👉 That is LESS THAN ₹1 PER DAY (₹0.95/day)!

🔥 WHAT YOU GET:
✅ Official Green Verified Trust Badge
✅ Direct "Chat on WhatsApp" Button for instant customer orders
✅ Priority Top Placement in Category & Search Results
✅ Interactive Map Pin on KatrajPune.com
✅ Complete Control: Photos, Timings, Contact Info

⏳ STRICTLY LIMITED TO THE FIRST 100 BUSINESSES ONLY!
Offer ending soon. Over 40+ businesses have already claimed their listings!

👉 Claim Your Business Listing Today:
https://katrajpune.com/claim

Support & Inquiries: WhatsApp +91 70208 88195

#Katraj #Pune #LocalBusiness #PuneEntrepreneurs #KatrajPune #DiwaliOffer #VocalForLocalPune`

  return {
    title: "Diwali Special Offer — ₹350/year for First 100 Businesses",
    text,
    linkUrl: "https://katrajpune.com/claim",
    imageUrl: "https://katrajpune.com/og-image.png",
    tags: PUNE_HASHTAGS,
  }
}

