import { NextResponse } from "next/server";

import { ensureOrderDatabaseForRuntime, readOrderByLookup } from "@/lib/orders";

export async function POST(request: Request) {
  const body = (await request.json()) as {
    orderId?: string;
    email?: string;
  };

  const orderId = body.orderId?.trim();
  const email = body.email?.trim();

  if (!orderId || !email) {
    return NextResponse.json(
      { error: "Order number and email are required." },
      { status: 400 },
    );
  }

  ensureOrderDatabaseForRuntime();
  const order = await readOrderByLookup(orderId, email);

  if (!order) {
    return NextResponse.json(
      { error: "We could not find an order with that number and email." },
      { status: 404 },
    );
  }

  return NextResponse.json({
    id: order.id,
    customerName: order.customerName,
    customerEmail: order.customerEmail,
    shippingName: order.shippingName,
    city: order.city,
    state: order.state,
    postalCode: order.postalCode,
    country: order.country,
    items: order.items,
    subtotalAmount: order.subtotalAmount,
    paymentStatus: order.paymentStatus,
    fulfillmentStatus: order.fulfillmentStatus,
    supplierResponse: order.supplierResponse,
    supplierOrderId: order.supplierOrderId,
    paidAt: order.paidAt,
  });
}
