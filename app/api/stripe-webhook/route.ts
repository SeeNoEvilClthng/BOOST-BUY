import Stripe from "stripe";
import { NextResponse } from "next/server";

import { autoSubmitSupplierOrder } from "@/lib/fulfillment";
import {
  createOrderFromSession,
  ensureOrderDatabaseForRuntime,
  upsertOrderRecord,
} from "@/lib/orders";
import { sendOrderNotifications } from "@/lib/notifications";
import { markRecoveryCompleted } from "@/lib/recovery";

const secretKey = process.env.STRIPE_SECRET_KEY;
const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET;

const stripe = secretKey
  ? new Stripe(secretKey, {
      apiVersion: "2025-02-24.acacia",
    })
  : null;

export async function POST(request: Request) {
  if (!stripe || !webhookSecret) {
    return NextResponse.json(
      { error: "Stripe webhook is not configured yet." },
      { status: 500 },
    );
  }

  const signature = request.headers.get("stripe-signature");

  if (!signature) {
    return NextResponse.json(
      { error: "Missing Stripe signature header." },
      { status: 400 },
    );
  }

  const payload = await request.text();

  try {
    ensureOrderDatabaseForRuntime();
    const event = stripe.webhooks.constructEvent(payload, signature, webhookSecret);

    if (event.type === "checkout.session.completed") {
      const session = event.data.object as Stripe.Checkout.Session;
      const draftOrder = createOrderFromSession(session);
      const fulfillment = await autoSubmitSupplierOrder(draftOrder);
      const completedOrder = createOrderFromSession(session, fulfillment);

      await upsertOrderRecord(completedOrder);
      await markRecoveryCompleted({
        checkoutSessionId: session.id,
        recoveredOrderId: completedOrder.id,
      });
      await sendOrderNotifications(completedOrder);
    }

    return NextResponse.json({ received: true });
  } catch (error) {
    const message =
      error instanceof Error ? error.message : "Unable to process webhook event.";

    return NextResponse.json({ error: message }, { status: 400 });
  }
}
