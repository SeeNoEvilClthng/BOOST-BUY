import Stripe from "stripe";
import { NextResponse } from "next/server";

import { summarizeCart, type CheckoutInput } from "@/lib/checkout";
import { ensureRecoveryDatabaseForRuntime, upsertRecoveryRecord } from "@/lib/recovery";

const secretKey = process.env.STRIPE_SECRET_KEY;

const stripe = secretKey
  ? new Stripe(secretKey, {
      apiVersion: "2025-02-24.acacia",
    })
  : null;

export async function POST(request: Request) {
  if (!stripe) {
    return NextResponse.json(
      { error: "Stripe is not configured yet. Add STRIPE_SECRET_KEY first." },
      { status: 500 },
    );
  }

  const body = (await request.json()) as CheckoutInput;

  if (!body.customerName || !body.email || !body.phone) {
    return NextResponse.json(
      { error: "Missing customer details for checkout." },
      { status: 400 },
    );
  }

  const summary = summarizeCart(body.cart ?? []);

  if (summary.items.length === 0) {
    return NextResponse.json(
      { error: "Add at least one product before checkout." },
      { status: 400 },
    );
  }

  const origin = process.env.NEXT_PUBLIC_SITE_URL ?? new URL(request.url).origin;

  try {
    const session = await stripe.checkout.sessions.create({
      mode: "payment",
      client_reference_id: crypto.randomUUID(),
      customer_email: body.email,
      success_url: `${origin}/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${origin}/cancel`,
      billing_address_collection: "required",
      shipping_address_collection: {
        allowed_countries: ["US", "CA", "GB", "AU"],
      },
      phone_number_collection: {
        enabled: true,
      },
      metadata: {
        customerName: body.customerName,
        customerEmail: body.email,
        customerPhone: body.phone,
        notes: body.notes || "",
        itemsJson: JSON.stringify(summary.items),
        subtotalAmount: String(summary.subtotal),
        supplierCostAmount: String(summary.supplierCost),
        estimatedProfitAmount: String(summary.estimatedProfit),
      },
      line_items: summary.items.map((item) => ({
        quantity: 1,
        price_data: {
          currency: "usd",
          unit_amount: item.lineAmount,
          product_data: {
            name: item.name,
            metadata: {
              supplierSku: item.supplierSku,
              productId: item.productId,
            },
          },
        },
      })),
    });

    ensureRecoveryDatabaseForRuntime();
    await upsertRecoveryRecord({
      id: session.client_reference_id ?? session.id,
      checkoutSessionId: session.id,
      customerName: body.customerName,
      customerEmail: body.email,
      customerPhone: body.phone,
      notes: body.notes || "",
      items: summary.items,
      subtotalAmount: summary.subtotal,
      status: "open",
      recoveryUrl: session.url ?? "",
      expiresAt: session.expires_at
        ? new Date(session.expires_at * 1000).toISOString()
        : "",
      createdAt: new Date().toISOString(),
      completedAt: "",
      recoveredOrderId: "",
      lastRecoveryEmailSentAt: "",
      recoveryEmailCount: 0,
    });

    return NextResponse.json({ sessionId: session.id });
  } catch (error) {
    const message =
      error instanceof Error ? error.message : "Unable to create checkout session.";

    return NextResponse.json({ error: message }, { status: 500 });
  }
}
