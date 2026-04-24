import type { OrderRecord } from "@/lib/orders";
import { formatCurrency } from "@/lib/catalog";

const resendApiKey = process.env.RESEND_API_KEY;
const notificationFromEmail = process.env.NOTIFICATION_FROM_EMAIL;
const businessNotificationEmail = process.env.BUSINESS_NOTIFICATION_EMAIL;

function buildCustomerEmail(order: OrderRecord) {
  return {
    subject: "Your BOOST BUY order is confirmed",
    html: `
      <div style="font-family:Arial,Helvetica,sans-serif;color:#111827;line-height:1.6">
        <h1 style="margin-bottom:12px;">Your order is in</h1>
        <p>Hi ${order.customerName},</p>
        <p>We received your order and payment successfully.</p>
        <p><strong>Total paid:</strong> ${formatCurrency(order.subtotalAmount)}</p>
        <p><strong>Shipping to:</strong> ${order.shippingName}, ${order.addressLine1} ${order.addressLine2}, ${order.city}, ${order.state} ${order.postalCode}, ${order.country}</p>
        <p><strong>Fulfillment status:</strong> ${order.fulfillmentStatus}</p>
        <p>We will send tracking as soon as your supplier confirms shipment.</p>
      </div>
    `,
  };
}

function buildBusinessEmail(order: OrderRecord) {
  const items = order.items
    .map((item) => `${item.name} x${item.quantity} (${item.supplierSku})`)
    .join(", ");

  return {
    subject: `New paid order: ${order.customerName}`,
    html: `
      <div style="font-family:Arial,Helvetica,sans-serif;color:#111827;line-height:1.6">
        <h1 style="margin-bottom:12px;">New paid order</h1>
        <p><strong>Customer:</strong> ${order.customerName} (${order.customerEmail})</p>
        <p><strong>Phone:</strong> ${order.customerPhone || "Not provided"}</p>
        <p><strong>Items:</strong> ${items}</p>
        <p><strong>Revenue:</strong> ${formatCurrency(order.subtotalAmount)}</p>
        <p><strong>Estimated profit:</strong> ${formatCurrency(order.estimatedProfitAmount)}</p>
        <p><strong>Supplier status:</strong> ${order.fulfillmentStatus}</p>
        <p><strong>Supplier response:</strong> ${order.supplierResponse}</p>
      </div>
    `,
  };
}

async function sendEmail(to: string, subject: string, html: string) {
  if (!resendApiKey || !notificationFromEmail) {
    return;
  }

  await fetch("https://api.resend.com/emails", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${resendApiKey}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      from: notificationFromEmail,
      to,
      subject,
      html,
    }),
  });
}

export async function sendOrderNotifications(order: OrderRecord) {
  const customerEmail = buildCustomerEmail(order);
  await sendEmail(order.customerEmail, customerEmail.subject, customerEmail.html);

  if (businessNotificationEmail) {
    const businessEmail = buildBusinessEmail(order);
    await sendEmail(
      businessNotificationEmail,
      businessEmail.subject,
      businessEmail.html,
    );
  }
}
