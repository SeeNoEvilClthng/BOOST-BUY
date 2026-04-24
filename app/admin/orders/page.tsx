import Link from "next/link";

import { formatCurrency } from "@/lib/catalog";
import { readOrderRecords } from "@/lib/orders";
import { countOpenRecoveryRecords } from "@/lib/recovery";

function formatDate(value: string) {
  return new Intl.DateTimeFormat("en-US", {
    dateStyle: "medium",
    timeStyle: "short",
  }).format(new Date(value));
}

export const dynamic = "force-dynamic";

export default async function AdminOrdersPage() {
  const orders = await readOrderRecords();
  const openRecoveryCount = await countOpenRecoveryRecords();
  const totalRevenue = orders.reduce((sum, order) => sum + order.subtotalAmount, 0);
  const totalProfit = orders.reduce(
    (sum, order) => sum + order.estimatedProfitAmount,
    0,
  );

  return (
    <main className="admin-page">
      <div className="shell">
        <div className="admin-header">
          <div>
            <p className="section-kicker">Admin</p>
            <h1>Paid orders</h1>
            <p>
              Orders appear here after `checkout.session.completed` reaches the
              webhook route.
            </p>
          </div>
          <div className="admin-chip-group">
            <div className="admin-chip">
              <strong>{orders.length}</strong>
              <span>Total orders</span>
            </div>
            <div className="admin-chip">
              <strong>{formatCurrency(totalRevenue)}</strong>
              <span>Total revenue</span>
            </div>
            <div className="admin-chip">
              <strong>{formatCurrency(totalProfit)}</strong>
              <span>Estimated profit</span>
            </div>
            <div className="admin-chip">
              <strong>{openRecoveryCount}</strong>
              <span>Open abandoned carts</span>
            </div>
          </div>
        </div>

        <div className="admin-actions">
          <Link className="secondary-button" href="/admin/recovery">
            Open recovery dashboard
          </Link>
        </div>

        <div className="admin-table-card">
          <table className="admin-table">
            <thead>
              <tr>
                <th>Customer</th>
                <th>Items</th>
                <th>Revenue</th>
                <th>Fulfillment</th>
                <th>Ship to</th>
                <th>Paid at</th>
              </tr>
            </thead>
            <tbody>
              {orders.length ? (
                orders.map((order) => (
                  <tr key={order.id}>
                    <td>
                      <strong>{order.customerName}</strong>
                      <span>{order.customerEmail}</span>
                      <span>{order.customerPhone || "No phone"}</span>
                    </td>
                    <td>
                      <strong>
                        {order.items.map((item) => `${item.name} x${item.quantity}`).join(", ")}
                      </strong>
                      <span>Supplier: {order.supplierName}</span>
                      <span>Supplier ID: {order.supplierOrderId || "Pending"}</span>
                    </td>
                    <td>
                      <strong>{formatCurrency(order.subtotalAmount)}</strong>
                      <span>Profit: {formatCurrency(order.estimatedProfitAmount)}</span>
                    </td>
                    <td>
                      <span className="status-pill">{order.fulfillmentStatus}</span>
                      <span>{order.supplierResponse}</span>
                    </td>
                    <td>
                      <strong>{order.shippingName}</strong>
                      <span>{order.addressLine1}</span>
                      {order.addressLine2 ? <span>{order.addressLine2}</span> : null}
                      <span>
                        {order.city}, {order.state} {order.postalCode}
                      </span>
                    </td>
                    <td>{formatDate(order.paidAt)}</td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={6}>
                    No paid orders yet. Complete a live Stripe checkout and webhook
                    delivery to populate this dashboard.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </main>
  );
}
