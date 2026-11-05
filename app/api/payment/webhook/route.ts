import { NextRequest, NextResponse } from "next/server"
import { createServerClient } from "@/lib/supabase/server"
import crypto from "crypto"

export const dynamic = "force-dynamic"

export async function POST(request: NextRequest) {
  try {
    const rawBody = await request.text()
    const signature = request.headers.get("x-razorpay-signature")
    const webhookSecret = process.env.RAZORPAY_WEBHOOK_SECRET

    if (webhookSecret && signature) {
      const expectedSignature = crypto
        .createHmac("sha256", webhookSecret)
        .update(rawBody)
        .digest("hex")

      if (expectedSignature !== signature) {
        return NextResponse.json({ error: "Invalid webhook signature" }, { status: 400 })
      }
    }

    const payload = JSON.parse(rawBody)
    const event = payload.event

    const supabase = createServerClient()

    if (event === "payment.captured" || event === "payment_link.paid") {
      const paymentEntity = payload.payload?.payment?.entity || payload.payload?.payment_link?.entity
      const paymentId = paymentEntity?.id
      const notes = paymentEntity?.notes || {}
      const transactionRef = notes.transaction_ref || notes.reference_id

      if (transactionRef) {
        // Update payment transaction
        const { data: updatedTx } = await supabase
          .from("payment_transactions")
          .update({
            gateway_payment_id: paymentId,
            status: "verified",
            verified_at: new Date().toISOString(),
            updated_at: new Date().toISOString(),
          })
          .eq("transaction_ref", transactionRef)
          .select("business_slug")
          .single()

        if (updatedTx?.business_slug) {
          await supabase
            .from("businesses")
            .update({
              payment_status: "paid",
              payment_id: paymentId,
              updated_at: new Date().toISOString(),
            })
            .eq("slug", updatedTx.business_slug)
        }
      }
    }

    return NextResponse.json({ status: "ok", received: true })
  } catch (err: any) {
    console.error("Webhook processing error:", err)
    return NextResponse.json({ error: "Webhook processing error" }, { status: 500 })
  }
}
