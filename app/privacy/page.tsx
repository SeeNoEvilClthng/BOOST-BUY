import { siteConfig } from "@/lib/site-config";

export default function PrivacyPage() {
  return (
    <main className="policy-page">
      <div className="shell policy-card">
        <p className="section-kicker">Privacy Policy</p>
        <h1>How customer information is handled</h1>
        <div className="policy-list">
          <div className="policy-item">
            <strong>Information collected</strong>
            <span>
              Customer name, email, phone number, shipping details, and order data
              needed to process purchases and provide support.
            </span>
          </div>
          <div className="policy-item">
            <strong>Why it is collected</strong>
            <span>
              To complete checkout, arrange fulfillment, send confirmations, and
              respond to support questions.
            </span>
          </div>
          <div className="policy-item">
            <strong>Third-party services</strong>
            <span>
              Payment processing may use Stripe, communication may use email
              providers, and advertising analytics may use optional tracking tools.
            </span>
          </div>
          <div className="policy-item">
            <strong>Support contact</strong>
            <span>
              Privacy-related questions can be sent to {siteConfig.supportEmail}.
            </span>
          </div>
        </div>
      </div>
    </main>
  );
}
