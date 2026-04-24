# BOOST BUY

Conversion-focused dropshipping starter built with Next.js and Stripe.

## Included

- polished storefront with sample winning-product catalog
- quantity-based cart and Stripe Checkout flow
- webhook-based paid order capture
- SQLite-backed local order persistence
- admin dashboard at `/admin/orders`
- abandoned cart recovery dashboard at `/admin/recovery`
- optional customer and business email notifications via Resend
- one-click abandoned cart recovery email sending from the admin dashboard
- optional automatic supplier order submission through a generic supplier API
- optional analytics hooks for GA4, Meta Pixel, and TikTok Pixel
- trust pages for shipping, refunds, privacy, and contact
- reusable branded SVG product media and social preview assets in `public/`

## Local setup

1. Install dependencies:

   ```bash
   npm install
   ```

2. Copy the environment file:

   ```bash
   cp .env.example .env.local
   ```

3. Add your Stripe keys and optional supplier credentials.
   You can also add optional analytics IDs for GA4, Meta Pixel, and TikTok Pixel.

4. Start the app:

   ```bash
   npm run dev
   ```

5. Open `http://localhost:3000`

## Stripe requirements

- `NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY` powers browser checkout redirect.
- `STRIPE_SECRET_KEY` creates checkout sessions.
- `STRIPE_WEBHOOK_SECRET` verifies incoming webhook events.
- Configure Stripe to send `checkout.session.completed` to:

```text
https://your-domain.com/api/stripe-webhook
```

## Supplier automation

Set these to enable automatic supplier submission after payment:

- `SUPPLIER_API_URL`
- `SUPPLIER_API_KEY`
- `SUPPLIER_NAME`

The app sends a JSON payload containing:

- `externalOrderId`
- customer details
- shipping address
- notes
- supplier SKUs and quantities

If these vars are missing, orders still save successfully and show
`awaiting_supplier_setup` in the admin dashboard.

## Analytics

Set any of these optional public env vars to enable traffic tracking:

- `NEXT_PUBLIC_GA_MEASUREMENT_ID`
- `NEXT_PUBLIC_META_PIXEL_ID`
- `NEXT_PUBLIC_TIKTOK_PIXEL_ID`

These are injected site-wide from the shared layout.

## Admin

- Visit `/admin/orders` to review paid orders.
- Visit `/admin/recovery` to inspect open and completed checkout attempts.
- Use the recovery dashboard to open saved Stripe checkout links and send recovery emails when Resend is configured.
- Set `ADMIN_USERNAME` and `ADMIN_PASSWORD` to protect the admin route with basic auth.

## Important note

This repo is a real operating starter, but "fully automatic" dropshipping still depends on your actual supplier or fulfillment partner exposing an API you can legally and reliably use. The storefront, checkout, paid-order logging, and automation hook are done here; the last mile is connecting your chosen supplier credentials.
