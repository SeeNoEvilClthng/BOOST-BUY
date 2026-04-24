import type { Metadata } from "next";
import { Analytics } from "@/components/analytics";
import { SiteFooter } from "@/components/site-footer";
import "./globals.css";

export const metadata: Metadata = {
  metadataBase: new URL("https://boost-buy.example"),
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
    url: "https://boost-buy.example",
    siteName: "BOOST BUY",
    type: "website",
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
