import type { Metadata } from "next";
import { Analytics } from "@/components/analytics";
import { SiteFooter } from "@/components/site-footer";
import { siteConfig } from "@/lib/site-config";
import "./globals.css";

export const metadata: Metadata = {
  metadataBase: new URL(siteConfig.domain),
  title: {
    default: "BOOST BUY | Posture Pulse Trainer",
    template: "%s | BOOST BUY",
  },
  description:
    "A conversion-focused one-product store with Stripe checkout, trust-building pages, and supplier automation hooks.",
  openGraph: {
    title: "BOOST BUY | Posture Pulse Trainer",
    description:
      "A sharper one-product dropshipping store with stronger trust signals, checkout flow, and analytics hooks.",
    url: siteConfig.domain,
    siteName: "BOOST BUY",
    type: "website",
    images: [
      {
        url: "/og-cover.svg",
        width: 1200,
        height: 630,
        alt: "BOOST BUY Posture Pulse Trainer social preview",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "BOOST BUY | Posture Pulse Trainer",
    description:
      "A sharper one-product dropshipping store with stronger trust signals, checkout flow, and analytics hooks.",
    images: ["/og-cover.svg"],
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>
        <Analytics />
        {children}
        <SiteFooter />
      </body>
    </html>
  );
}
