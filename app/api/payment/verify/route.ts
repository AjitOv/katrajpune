import { NextRequest, NextResponse } from "next/server"
import { createServerClient } from "@/lib/supabase/server"
import crypto from "crypto"
import { z } from "zod"

export const dynamic = "force-dynamic"

const verifySchema = z.object({
  razorpay_order_id: z.string().optional(),
  razorpay_payment_id: z.string().min(4, "Payment ID is required"),
  razorpay_signature: z.string().optional(),
  transaction_ref: z.string().min(4, "Transaction reference is required"),
})

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const parsed = verifySchema.safeParse(body)

    if (!parsed.success) {
      return NextResponse.json(
        { error: "Invalid payment verification payload", details: parsed.error.flatten() },
        { status: 400 }
      )
    }

    const { razorpay_order_id, razorpay_payment_id, razorpay_signature, transaction_ref } = parsed.data
    const secret = process.env.RAZORPAY_KEY_SECRET

    // 1. Signature Verification if order_id & signature & secret are available
    let isSignatureValid = false
    if (secret && razorpay_order_id && razorpay_signature) {
      const expectedSignature = crypto
        .createHmac("sha256", secret)
        .update(`${razorpay_order_id}|${razorpay_payment_id}`)
        .digest("hex")

      isSignatureValid = expectedSignature === razorpay_signature
      if (!isSignatureValid) {
        return NextResponse.json(
          { error: "Invalid signature. Payment could not be verified." },
          { status: 400 }
        )
      }
    }

    const supabase = createServerClient()

    // 2. Fetch transaction
    const { data: transaction, error: txError } = await supabase
      .from("payment_transactions")
      .select("*")
      .eq("transaction_ref", transaction_ref)
      .single()

    if (txError || !transaction) {
      return NextResponse.json({ error: "Transaction not found" }, { status: 404 })
    }

    // 3. Mark transaction as verified (or pending manual review if using standard payment link)
    const newStatus = isSignatureValid ? "verified" : "pending"
    const verifiedAt = isSignatureValid ? new Date().toISOString() : null

    await supabase
      .from("payment_transactions")
      .update({
        gateway_payment_id: razorpay_payment_id,
        gateway_order_id: razorpay_order_id || null,
        gateway_signature: razorpay_signature || null,
        status: newStatus,
        verified_at: verifiedAt,
        updated_at: new Date().toISOString(),
      })
      .eq("transaction_ref", transaction_ref)

    // 4. Update business payment status if verified
    if (isSignatureValid && transaction.business_slug) {
      await supabase
        .from("businesses")
        .update({
          payment_status: "paid",
          payment_id: razorpay_payment_id,
          updated_at: new Date().toISOString(),
        })
        .eq("slug", transaction.business_slug)
    }

    return NextResponse.json({
      success: true,
      verified: isSignatureValid,
      status: newStatus,
      transactionRef: transaction_ref,
      businessName: transaction.business_name,
      amount: transaction.amount,
      message: isSignatureValid
        ? "Payment verified successfully. Listing queued for review within 48 hours."
        : "Payment details recorded. Final verification pending confirmation within 48 hours.",
    })
  } catch (err: any) {
    console.error("Verification error:", err)
    return NextResponse.json({ error: "Verification server error", message: err?.message }, { status: 500 })
  }
}
