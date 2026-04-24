"use client";

import { FormEvent, useState } from "react";

import { formatCurrency } from "@/lib/catalog";

type LookupResult = {
  id: string;
  customerName: string;
  shippingName: string;
  city: string;
  state: string;
  postalCode: string;
  country: string;
  items: Array<{ name: string; quantity: number }>;
  subtotalAmount: number;
  paymentStatus: string;
  fulfillmentStatus: string;
  supplierResponse: string;
  supplierOrderId: string;
  paidAt: string;
};

function formatDate(value: string) {
  return new Intl.DateTimeFormat("en-US", {
    dateStyle: "medium",
    timeStyle: "short",
  }).format(new Date(value));
}

function getStatusLabel(status: string) {
  switch (status) {
    case "submitted_to_supplier":
      return "Your order was paid and sent to the supplier.";
    case "supplier_error":
      return "Your order is paid, but the supplier handoff needs manual attention.";
    case "awaiting_supplier_setup":
      return "Your order is paid and waiting for fulfillment setup.";
    default:
      return "Your order has been received and is moving through fulfillment.";
  }
}

export function OrderLookup({ initialOrderId = "" }: { initialOrderId?: string }) {
  const [orderId, setOrderId] = useState(initialOrderId);
  const [email, setEmail] = useState("");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [result, setResult] = useState<LookupResult | null>(null);

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setError("");
    setResult(null);
    setIsLoading(true);

    try {
      const response = await fetch("/api/order-lookup", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ orderId, email }),
      });

      const payload = (await response.json()) as LookupResult & { error?: string };

      if (!response.ok) {
        throw new Error(payload.error ?? "Unable to find that order.");
      }

      setResult(payload);
    } catch (lookupError) {
      setError(
        lookupError instanceof Error
          ? lookupError.message
          : "Unable to find that order.",
      );
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="order-lookup-layout">
      <form className="lookup-card" onSubmit={handleSubmit}>
        <div className="section-heading compact">
          <p className="section-kicker">Track order</p>
          <h2>Find your order in seconds.</h2>
          <p>
            Enter your order number and the email you used at checkout to see the
            latest status.
          </p>
        </div>

        <div className="field-grid">
          <label>
            Order number
            <input
              required
              value={orderId}
              onChange={(event) => setOrderId(event.target.value)}
              placeholder="Example: 4f2d7c18-..."
            />
          </label>
          <label>
            Email
            <input
              required
              type="email"
              value={email}
              onChange={(event) => setEmail(event.target.value)}
              placeholder="you@example.com"
            />
          </label>
        </div>

        <div className="lookup-actions">
          <button className="primary-button" disabled={isLoading} type="submit">
            {isLoading ? "Checking order..." : "Track my order"}
          </button>
        </div>

        {error ? <p className="error-text">{error}</p> : null}
      </form>

      <div className="lookup-card">
        <div className="section-heading compact">
          <p className="section-kicker">Status</p>
          <h2>What customers see after purchase.</h2>
        </div>

        {result ? (
          <div className="lookup-result">
            <div className="lookup-status-strip">
              <span className="status-pill">{result.fulfillmentStatus}</span>
              <strong>{getStatusLabel(result.fulfillmentStatus)}</strong>
            </div>
            <div className="lookup-grid">
              <div className="lookup-item">
                <strong>Order number</strong>
                <span>{result.id}</span>
              </div>
              <div className="lookup-item">
                <strong>Paid at</strong>
                <span>{formatDate(result.paidAt)}</span>
              </div>
              <div className="lookup-item">
                <strong>Payment</strong>
                <span>{result.paymentStatus}</span>
              </div>
              <div className="lookup-item">
                <strong>Ship to</strong>
                <span>
                  {result.shippingName}, {result.city}, {result.state}{" "}
                  {result.postalCode}, {result.country}
                </span>
              </div>
              <div className="lookup-item lookup-item--wide">
                <strong>Items</strong>
                <span>
                  {result.items.map((item) => `${item.name} x${item.quantity}`).join(", ")}
                </span>
              </div>
              <div className="lookup-item">
                <strong>Total</strong>
                <span>{formatCurrency(result.subtotalAmount)}</span>
              </div>
              <div className="lookup-item lookup-item--wide">
                <strong>Fulfillment note</strong>
                <span>{result.supplierResponse}</span>
              </div>
              <div className="lookup-item">
                <strong>Supplier reference</strong>
                <span>{result.supplierOrderId || "Pending"}</span>
              </div>
            </div>
          </div>
        ) : (
          <p className="lookup-empty">
            Buyers get a clear order summary, payment confirmation, and fulfillment
            status without needing to contact support first.
          </p>
        )}
      </div>
    </div>
  );
}
