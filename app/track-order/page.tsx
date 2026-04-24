import { OrderLookup } from "@/components/order-lookup";

export default async function TrackOrderPage({
  searchParams,
}: {
  searchParams: Promise<{ order_id?: string }>;
}) {
  const { order_id: orderId } = await searchParams;

  return (
    <main className="policy-page">
      <div className="shell">
        <OrderLookup initialOrderId={orderId ?? ""} />
      </div>
    </main>
  );
}
