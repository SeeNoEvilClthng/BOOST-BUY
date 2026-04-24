import type { OrderRecord } from "@/lib/orders";

export async function autoSubmitSupplierOrder(order: Omit<OrderRecord, "fulfillmentStatus" | "supplierName" | "supplierOrderId" | "supplierResponse">) {
  const supplierUrl = process.env.SUPPLIER_API_URL;
  const supplierKey = process.env.SUPPLIER_API_KEY;
  const supplierName = process.env.SUPPLIER_NAME ?? "Connected Supplier";

  if (!supplierUrl || !supplierKey) {
    return {
      fulfillmentStatus: "awaiting_supplier_setup",
      supplierName,
      supplierOrderId: "",
      supplierResponse:
        "No supplier API credentials found. Add SUPPLIER_API_URL and SUPPLIER_API_KEY to enable automatic fulfillment.",
    };
  }

  const response = await fetch(supplierUrl, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${supplierKey}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      externalOrderId: order.id,
      customer: {
        name: order.shippingName,
        email: order.customerEmail,
        phone: order.customerPhone,
      },
      shippingAddress: {
        line1: order.addressLine1,
        line2: order.addressLine2,
        city: order.city,
        state: order.state,
        postalCode: order.postalCode,
        country: order.country,
      },
      notes: order.notes,
      items: order.items.map((item) => ({
        sku: item.supplierSku,
        quantity: item.quantity,
      })),
    }),
  });

  const text = await response.text();

  if (!response.ok) {
    return {
      fulfillmentStatus: "supplier_error",
      supplierName,
      supplierOrderId: "",
      supplierResponse: text || `Supplier returned ${response.status}.`,
    };
  }

  let parsed: Record<string, unknown> = {};

  try {
    parsed = JSON.parse(text) as Record<string, unknown>;
  } catch {
    parsed = {};
  }

  return {
    fulfillmentStatus: "submitted_to_supplier",
    supplierName,
    supplierOrderId: String(parsed.orderId ?? parsed.id ?? ""),
    supplierResponse: text || "Supplier accepted the order.",
  };
}
