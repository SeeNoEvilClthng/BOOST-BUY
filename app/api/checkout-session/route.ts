import Stripe from "stripe";
import { NextResponse } from "next/server";

const secretKey = process.env.STRIPE_SECRET_KEY;

const stripe = secretKey
  ? new Stripe(secretKey, {
      apiVersion: "2025-02-24.acacia",
    })
  : null;

export async function GET(request: Request) {
  if (!stripe) {
    return NextResponse.json(
      { error: "Stripe is not configured yet. Add STRIPE_SECRET_KEY first." },
      { status: 500 },
    );
  }

  const { searchParams } = new URL(request.url);
  const sessionId = searchParams.get("session_id");

  if (!sessionId) {
    return NextResponse.json({ error: "Missing session_id." }, { status: 400 });
  }

  try {
    const session = await stripe.checkout.sessions.retrieve(sessionId);
    const items = JSON.parse(session.metadata?.itemsJson ?? "[]") as Array<{
      name: string;
      quantity: number;
    }>;
    const quantity = items.reduce((sum, item) => sum + item.quantity, 0);

    return NextResponse.json({
      sessionId: session.id,
      amountTotal: session.amount_total ?? 0,
      currency: session.currency ?? "usd",
      itemName: items[0]?.name ?? "Order",
      quantity,
    });
  } catch (error) {
    const message =
      error instanceof Error ? error.message : "Unable to fetch checkout session.";

    return NextResponse.json({ error: message }, { status: 500 });
  }
}
