import { siteConfig } from "@/lib/site-config";

export default function ShippingPolicyPage() {
  return (
    <main className="policy-page">
      <div className="shell policy-card">
        <p className="section-kicker">Shipping Policy</p>
        <h1>Set expectations before the customer asks</h1>
        <div className="policy-list">
          <div className="policy-item">
            <strong>Processing time</strong>
            <span>{siteConfig.shippingBlurb}</span>
          </div>
          <div className="policy-item">
            <strong>Tracking</strong>
            <span>
              Tracking details are provided after fulfillment is confirmed by the
              supplier or shipping partner.
            </span>
          </div>
          <div className="policy-item">
            <strong>Delays</strong>
            <span>
              Delivery timelines can vary due to carrier volume, customs, weather,
              or supplier processing delays.
            </span>
          </div>
        </div>
      </div>
    </main>
  );
}
