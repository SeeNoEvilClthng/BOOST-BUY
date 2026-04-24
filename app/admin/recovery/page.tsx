import Link from "next/link";

import { RecoveryActions } from "@/components/recovery-actions";
import { formatCurrency } from "@/lib/catalog";
import { readRecoveryRecords } from "@/lib/recovery";

function formatDate(value: string) {
  if (!value) {
    return "Pending";
  }

  return new Intl.DateTimeFormat("en-US", {
    dateStyle: "medium",
    timeStyle: "short",
  }).format(new Date(value));
}

export const dynamic = "force-dynamic";

export default async function AdminRecoveryPage() {
  const records = await readRecoveryRecords();
  const openRecords = records.filter((record) => record.status === "open");
  const openValue = openRecords.reduce(
    (sum, record) => sum + record.subtotalAmount,
    0,
  );

  return (
    <main className="admin-page">
      <div className="shell">
        <div className="admin-header">
          <div>
            <p className="section-kicker">Admin</p>
            <h1>Abandoned cart recovery</h1>
            <p>
              Every initiated checkout is stored here so you can see missed revenue
              and recover open carts before they go cold.
            </p>
          </div>
          <div className="admin-chip-group">
            <div className="admin-chip">
              <strong>{openRecords.length}</strong>
              <span>Open recovery leads</span>
            </div>
            <div className="admin-chip">
              <strong>{formatCurrency(openValue)}</strong>
              <span>Recoverable revenue</span>
            </div>
            <div className="admin-chip">
              <strong>{records.length}</strong>
              <span>Total tracked checkouts</span>
            </div>
          </div>
        </div>

        <div className="admin-actions">
          <Link className="secondary-button" href="/admin/orders">
            View paid orders
          </Link>
        </div>

        <div className="admin-table-card">
          <table className="admin-table">
            <thead>
              <tr>
                <th>Customer</th>
                <th>Cart</th>
                <th>Value</th>
                <th>Status</th>
                <th>Recovery</th>
                <th>Created</th>
              </tr>
            </thead>
            <tbody>
              {records.length ? (
                records.map((record) => (
                  <tr key={record.id}>
                    <td>
                      <strong>{record.customerName}</strong>
                      <span>{record.customerEmail}</span>
                      <span>{record.customerPhone || "No phone"}</span>
                    </td>
                    <td>
                      <strong>
                        {record.items
                          .map((item) => `${item.name} x${item.quantity}`)
                          .join(", ")}
                      </strong>
                      <span>{record.notes || "No order notes"}</span>
                    </td>
                    <td>{formatCurrency(record.subtotalAmount)}</td>
                    <td>
                      <span className="status-pill">{record.status}</span>
                      <span>
                        {record.status === "completed"
                          ? `Recovered order: ${record.recoveredOrderId || "linked"}`
                          : `Expires: ${formatDate(record.expiresAt)}`}
                      </span>
                      <span>
                        {record.recoveryEmailCount
                          ? `Emails sent: ${record.recoveryEmailCount} (${formatDate(record.lastRecoveryEmailSentAt)})`
                          : "No recovery emails sent yet"}
                      </span>
                    </td>
                    <td>
                      <RecoveryActions
                        checkoutSessionId={record.checkoutSessionId}
                        recoveryUrl={record.recoveryUrl}
                        disabled={record.status !== "open"}
                      />
                    </td>
                    <td>{formatDate(record.createdAt)}</td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={6}>
                    No initiated checkouts yet. Once a customer starts checkout, the
                    recovery log will appear here.
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
