import Link from "next/link";

export default function CancelPage() {
  return (
    <main className="status-page">
      <div className="status-card">
        <p className="section-kicker">Checkout canceled</p>
        <h1>The order has not been paid yet.</h1>
        <p>
          No charge was completed. Customers can return to the storefront, adjust
          their cart, and try again.
        </p>
        <Link className="primary-button" href="/#store">
          Return to storefront
        </Link>
      </div>
    </main>
  );
}
