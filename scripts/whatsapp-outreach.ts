import fs from "fs"
import path from "path"
import { execFile } from "child_process"
import { promisify } from "util"
import { getDiwaliOfferOutreachMessage, getWhatsAppWebUrl, SITE_CONFIG } from "../lib/config"

const execFileAsync = promisify(execFile)

const DATA_FILE = path.join(process.cwd(), "data", "katraj_businesses.json")
const CAMPAIGN_FILE = path.join(process.cwd(), "data", "outreach_campaign.json")

function loadCampaign(): Record<string, { status: string; sentAt?: string; notes?: string }> {
  try {
    if (fs.existsSync(CAMPAIGN_FILE)) {
      return JSON.parse(fs.readFileSync(CAMPAIGN_FILE, "utf-8"))
    }
  } catch {}
  return {}
}

function saveCampaign(data: Record<string, any>) {
  fs.writeFileSync(CAMPAIGN_FILE, JSON.stringify(data, null, 2), "utf-8")
}

function sleep(ms: number) {
  return new Promise((resolve) => setTimeout(resolve, ms))
}

async function run() {
  const args = process.argv.slice(2)
  const isStatus = args.includes("--status")
  const isExportCsv = args.includes("--export-csv")
  const isOpen = args.includes("--open")
  const batchArg = args.find((a) => a.startsWith("--batch="))
  const batchSize = batchArg ? parseInt(batchArg.split("=")[1], 10) : 10
  const delayArg = args.find((a) => a.startsWith("--delay="))
  const delaySec = delayArg ? parseInt(delayArg.split("=")[1], 10) : 12

  if (!fs.existsSync(DATA_FILE)) {
    console.error("❌ Businesses data file not found at:", DATA_FILE)
    process.exit(1)
  }

  const raw = fs.readFileSync(DATA_FILE, "utf-8")
  const businesses: any[] = JSON.parse(raw)
  const campaign = loadCampaign()

  // 1. Calculate Stats
  let sentCount = 0
  let convertedCount = 0
  let repliedCount = 0
  let skippedCount = 0

  Object.values(campaign).forEach((c) => {
    if (c.status === "sent") sentCount++
    if (c.status === "converted") convertedCount++
    if (c.status === "replied") repliedCount++
    if (c.status === "skipped") skippedCount++
  })

  const uncontacted = businesses.filter((b) => !campaign[b.slug] || campaign[b.slug].status === "uncontacted")

  console.log("==================================================")
  console.log("🪔 KATRAJPUNE DIWALI OUTREACH ENGINE (WHATSAPP WEB)")
  console.log("==================================================")
  console.log(`📊 Total Businesses in Katraj:   ${businesses.length}`)
  console.log(`🎯 Goal (First 100 Businesses):   ${convertedCount} / 100 converted`)
  console.log(`💰 Revenue Earned @ ₹350:        ₹${(convertedCount * SITE_CONFIG.listing.feeINR).toLocaleString("en-IN")}`)
  console.log(`📨 Sent / Contacted:             ${sentCount}`)
  console.log(`💬 Replied / Interested:         ${repliedCount}`)
  console.log(`⏳ Uncontacted Remaining:        ${uncontacted.length}`)
  console.log("==================================================\n")

  if (isStatus) {
    return
  }

  // 2. Export CSV Mode
  if (isExportCsv) {
    const csvLines = [
      "Name,Category,Locality,Phone,ProfileUrl,ClaimUrl,WhatsAppWebUrl",
    ]

    businesses.forEach((b) => {
      const phone = b.whatsapp || b.phone || ""
      const cleanPhone = phone.replace(/[^0-9]/g, "")
      const fullPhone = cleanPhone.length === 10 ? `91${cleanPhone}` : cleanPhone
      const message = getDiwaliOfferOutreachMessage(b)
      const webUrl = getWhatsAppWebUrl(fullPhone, message)

      csvLines.push(
        `"${b.name.replace(/"/g, '""')}","${b.category}","${b.locality || "Katraj"}","${fullPhone}","https://katrajpune.com/business/${b.slug}","https://katrajpune.com/claim?slug=${b.slug}","${webUrl.replace(/"/g, '""')}"`
      )
    })

    const exportPath = path.join(process.cwd(), "data", "katraj_outreach_whatsapp.csv")
    fs.writeFileSync(exportPath, csvLines.join("\n"), "utf-8")
    console.log(`✅ Exported all ${businesses.length} businesses to CSV with WhatsApp Web URLs:`)
    console.log(`📁 ${exportPath}`)
    console.log("\nYou can import this CSV into Google Sheets, Excel, or any WhatsApp Web bulk tool!")
    return
  }

  // 3. Automated Queue Processing
  console.log(`🚀 Starting batch of ${batchSize} businesses with ${delaySec}s delay between messages...`)
  console.log("Press Ctrl+C at any time to pause. Progress is auto-saved.\n")

  const queue = uncontacted.slice(0, batchSize)

  for (let i = 0; i < queue.length; i++) {
    const b = queue[i]
    const phone = b.whatsapp || b.phone
    if (!phone) {
      console.log(`[${i + 1}/${queue.length}] ⏭️ Skipping "${b.name}" (no phone number)`)
      campaign[b.slug] = { status: "skipped", notes: "No phone number" }
      saveCampaign(campaign)
      continue
    }

    const message = getDiwaliOfferOutreachMessage(b)
    const webUrl = getWhatsAppWebUrl(phone, message)

    console.log(`[${i + 1}/${queue.length}] 📤 Preparing: "${b.name}" (${phone}) - ${b.locality || "Katraj"}`)

    if (isOpen) {
      // In macOS, open URL in default browser
      try {
        await execFileAsync("open", [webUrl])
        console.log(`   🌐 Opened in WhatsApp Web! Review and press Enter to send.`)
      } catch (err: any) {
        console.warn(`   ⚠️ Could not open browser:`, err.message)
      }
    } else {
      console.log(`   🔗 Direct WhatsApp Link: ${webUrl.slice(0, 80)}...`)
    }

    campaign[b.slug] = {
      status: "sent",
      sentAt: new Date().toISOString(),
    }
    saveCampaign(campaign)

    if (i < queue.length - 1) {
      console.log(`   ⏳ Waiting ${delaySec} seconds before next contact to keep account safe...\n`)
      await sleep(delaySec * 1000)
    }
  }

  console.log("\n🎉 Batch completed successfully!")
  console.log(`Use --status to inspect progress or open /admin/outreach in your browser.`)
}

run()

