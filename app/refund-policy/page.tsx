import { siteConfig } from "@/lib/site-config";

export default function RefundPolicyPage() {
  return (
    <main className="policy-page">
      <div className="shell policy-card">
        <p className="section-kicker">Refund Policy</p>
        <h1>Simple policy language reduces checkout hesitation</h1>
        <div className="policy-list">
          <div className="policy-item">
            <strong>Guarantee window</strong>
            <span>
              {siteConfig.refundBlurb}
            </span>
          </div>
          <div className="policy-item">
            <strong>Damaged or incorrect orders</strong>
            <span>
              Customers should contact support with their order information and
              photos if an item arrives damaged or incorrect.
            </span>
          </div>
          <div className="policy-item">
            <strong>How to request help</strong>
            <span>
              Email {siteConfig.supportEmail} with the order number and reason for
              the request.
            </span>
          </div>
        </div>
      </div>
    </main>
  );
}
