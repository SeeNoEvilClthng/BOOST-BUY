import Link from "next/link";

import { SuccessTracker } from "@/components/success-tracker";

export default async function SuccessPage({
  searchParams,
}: {
  searchParams: Promise<{ session_id?: string }>;
}) {
  const { session_id: sessionId } = await searchParams;

  return (
    <main className="status-page">
      <div className="status-card">
        <p className="section-kicker">Order confirmed</p>
        <h1>Your payment went through successfully.</h1>
        <p>
          The order has been captured for fulfillment. If supplier automation is
          configured, the handoff is attempted automatically after Stripe confirms
          payment.
        </p>
        <SuccessTracker sessionId={sessionId} />
        <Link className="primary-button" href="/">
          Return to storefront
        </Link>
      </div>
    </main>
  );
}
