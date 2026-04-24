"use client";

import { useEffect, useState } from "react";

import { trackEvent } from "@/lib/tracking";

type PurchaseSummary = {
  sessionId: string;
  orderId: string;
  amountTotal: number;
  currency: string;
  itemName: string;
  quantity: number;
};

export function SuccessTracker({ sessionId }: { sessionId?: string }) {
  const [summary, setSummary] = useState<PurchaseSummary | null>(null);

  useEffect(() => {
    if (!sessionId) {
      return;
    }

    let isMounted = true;

    void fetch(`/api/checkout-session?session_id=${encodeURIComponent(sessionId)}`)
      .then(async (response) => {
        if (!response.ok) {
          return null;
        }

        return (await response.json()) as PurchaseSummary;
      })
      .then((payload) => {
        if (!payload || !isMounted) {
          return;
        }

        setSummary(payload);
        trackEvent(
          "purchase",
          {
            currency: payload.currency.toUpperCase(),
            content_name: payload.itemName,
            content_ids: [payload.sessionId],
            contents: [
              {
                content_name: payload.itemName,
                quantity: payload.quantity,
              },
            ],
                num_items: payload.quantity,
          },
          {
            gaEventName: "purchase",
            metaEventName: "Purchase",
            tiktokEventName: "CompletePayment",
            value: payload.amountTotal,
          },
        );
      });

    return () => {
      isMounted = false;
    };
  }, [sessionId]);

  if (!summary) {
    return null;
  }

  return (
    <div className="status-meta">
      <p>
        Tracked purchase: {summary.itemName} for {(summary.amountTotal / 100).toFixed(2)}{" "}
        {summary.currency.toUpperCase()}.
      </p>
      <p>
        Order number: <strong>{summary.orderId}</strong>
      </p>
    </div>
  );
}
