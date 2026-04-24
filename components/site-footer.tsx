import Link from "next/link";

import { siteConfig } from "@/lib/site-config";

const footerLinks = [
  { href: "/shipping-policy", label: "Shipping Policy" },
  { href: "/refund-policy", label: "Refund Policy" },
  { href: "/privacy", label: "Privacy Policy" },
  { href: "/contact", label: "Contact" },
] as const;

export function SiteFooter() {
  return (
    <footer className="site-footer">
      <div className="shell footer-grid">
        <div>
          <p className="section-kicker">Support</p>
          <h2>{siteConfig.brandName}</h2>
          <p className="footer-copy">
            {siteConfig.aboutBlurb}
          </p>
          <p className="footer-note">{siteConfig.founderNote}</p>
        </div>

        <div className="footer-column">
          <strong>Customer care</strong>
          <a href={`mailto:${siteConfig.supportEmail}`}>{siteConfig.supportEmail}</a>
          <a href={`tel:${siteConfig.supportPhone.replace(/[^+\d]/g, "")}`}>
            {siteConfig.supportPhone}
          </a>
          <span>{siteConfig.supportHours}</span>
        </div>

        <div className="footer-column">
          <strong>Policies</strong>
          {footerLinks.map((link) => (
            <Link key={link.href} href={link.href}>
              {link.label}
            </Link>
          ))}
        </div>
      </div>
    </footer>
  );
}
