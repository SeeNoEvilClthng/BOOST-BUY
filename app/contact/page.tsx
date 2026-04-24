import { siteConfig } from "@/lib/site-config";

export default function ContactPage() {
  return (
    <main className="policy-page">
      <div className="shell policy-card">
        <p className="section-kicker">Contact</p>
        <h1>How customers can reach support</h1>
        <p>
          Clear contact information increases trust and gives customers a direct way
          to get help before or after purchase.
        </p>
        <div className="policy-list">
          <div className="policy-item">
            <strong>Email</strong>
            <span>{siteConfig.supportEmail}</span>
          </div>
          <div className="policy-item">
            <strong>Phone</strong>
            <span>{siteConfig.supportPhone}</span>
          </div>
          <div className="policy-item">
            <strong>Hours</strong>
            <span>{siteConfig.supportHours}</span>
          </div>
          <div className="policy-item">
            <strong>Business location</strong>
            <span>{siteConfig.businessAddress}</span>
          </div>
        </div>
      </div>
    </main>
  );
}
