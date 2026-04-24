"use client";

import { FormEvent, useEffect, useMemo, useRef, useState } from "react";
import { loadStripe } from "@stripe/stripe-js";

import { bundleOffers, formatCurrency, heroProduct } from "@/lib/catalog";
import { summarizeCart, type CheckoutInput } from "@/lib/checkout";
import { trackEvent } from "@/lib/tracking";

const stripePromise = loadStripe(
  process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY ?? "",
);

const initialCheckout: CheckoutInput = {
  customerName: "",
  email: "",
  phone: "",
  notes: "",
  cart: [{ productId: heroProduct.id, quantity: 2 }],
};

export function Storefront() {
  const [checkout, setCheckout] = useState<CheckoutInput>(initialCheckout);
  const [error, setError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [selectedBundleId, setSelectedBundleId] = useState<string>("duo");
  const hasTrackedView = useRef(false);

  const cartSummary = useMemo(() => summarizeCart(checkout.cart), [checkout.cart]);
  const activeQuantity = checkout.cart[0]?.quantity ?? 0;

  useEffect(() => {
    if (hasTrackedView.current) {
      return;
    }

    hasTrackedView.current = true;
    trackEvent(
      "view_item",
      {
        content_name: heroProduct.name,
        content_ids: [heroProduct.id],
        content_type: "product",
      },
      {
        gaEventName: "view_item",
        metaEventName: "ViewContent",
        tiktokEventName: "ViewContent",
        value: heroProduct.price,
      },
    );
  }, []);

  const updateQuantity = (quantity: number) => {
    setCheckout((current) => ({
      ...current,
      cart: current.cart.map((line) => ({
        ...line,
        quantity: Math.max(0, quantity),
      })),
    }));
  };

  const selectBundle = (bundleId: string) => {
    const bundle = bundleOffers.find((entry) => entry.id === bundleId);

    if (!bundle) {
      return;
    }

    setSelectedBundleId(bundleId);
    updateQuantity(bundle.quantity);
    trackEvent(
      "select_bundle",
      {
        content_name: heroProduct.name,
        content_ids: [heroProduct.id],
        bundle_name: bundle.label,
        quantity: bundle.quantity,
      },
      {
        gaEventName: "add_to_cart",
        metaEventName: "AddToCart",
        tiktokEventName: "AddToCart",
        value: bundle.price,
      },
    );
  };

  const updateField = <K extends keyof CheckoutInput>(
    key: K,
    value: CheckoutInput[K],
  ) => {
    setCheckout((current) => ({ ...current, [key]: value }));
  };

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setError("");
    setIsSubmitting(true);

    trackEvent(
      "begin_checkout",
      {
        content_name: heroProduct.name,
        content_ids: [heroProduct.id],
        quantity: activeQuantity,
        num_items: activeQuantity,
      },
      {
        gaEventName: "begin_checkout",
        metaEventName: "InitiateCheckout",
        tiktokEventName: "InitiateCheckout",
        value: cartSummary.subtotal,
      },
    );

    try {
      const response = await fetch("/api/create-checkout-session", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(checkout),
      });

      const payload = (await response.json()) as {
        error?: string;
        sessionId?: string;
      };

      if (!response.ok || !payload.sessionId) {
        throw new Error(payload.error ?? "Unable to start checkout.");
      }

      const stripe = await stripePromise;

      if (!stripe) {
        throw new Error(
          "Stripe publishable key is missing. Add NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY.",
        );
      }

      const result = await stripe.redirectToCheckout({
        sessionId: payload.sessionId,
      });

      if (result.error?.message) {
        throw new Error(result.error.message);
      }
    } catch (submitError) {
      setError(
        submitError instanceof Error
          ? submitError.message
          : "Something went wrong while starting checkout.",
      );
      setIsSubmitting(false);
    }
  };

  return (
    <div className="storefront-layout">
      <section className="product-showcase" aria-label="Featured product">
        <article className="hero-product-card">
          <div className="product-visual product-visual--hero" style={{ background: heroProduct.accent }}>
            <div className="visual-orbit visual-orbit--one" />
            <div className="visual-orbit visual-orbit--two" />
            <div className="visual-device">
              <div className="visual-device__screen" />
            </div>
          </div>
          <div className="product-copy">
            <p className="product-category">{heroProduct.category}</p>
            <h3>{heroProduct.name}</h3>
            <p className="product-tagline">{heroProduct.tagline}</p>
            <p>{heroProduct.description}</p>
            <ul className="product-bullets">
              {heroProduct.bullets.map((bullet) => (
                <li key={bullet}>{bullet}</li>
              ))}
            </ul>
          </div>
          <div className="mini-proof-grid">
            <div className="mini-proof">
              <strong>4.8/5</strong>
              <span>Average customer rating</span>
            </div>
            <div className="mini-proof">
              <strong>30 days</strong>
              <span>Risk-free guarantee window</span>
            </div>
            <div className="mini-proof">
              <strong>{heroProduct.shippingWindow}</strong>
              <span>Tracked delivery estimate</span>
            </div>
          </div>
        </article>
      </section>

      <form className="checkout-card" onSubmit={handleSubmit}>
        <div className="section-heading compact">
          <p className="section-kicker">Offer</p>
          <h2>Choose the bundle that makes the purchase easy to say yes to.</h2>
          <p>
            Customers convert better when the decision is simple. The Duo Pack is
            preselected as the strongest everyday value.
          </p>
        </div>

        <div className="bundle-grid">
          {bundleOffers.map((bundle) => {
            const isSelected = selectedBundleId === bundle.id;

            return (
              <button
                className={`bundle-card${isSelected ? " bundle-card--selected" : ""}`}
                key={bundle.id}
                type="button"
                onClick={() => selectBundle(bundle.id)}
              >
                <div className="bundle-card__top">
                  <span className="bundle-badge">{bundle.badge}</span>
                  <strong>{bundle.label}</strong>
                </div>
                <p>{bundle.headline}</p>
                <div className="bundle-pricing">
                  <strong>{formatCurrency(bundle.price)}</strong>
                  <span>{formatCurrency(bundle.compareAtPrice)}</span>
                </div>
                <small>{bundle.savingsLabel}</small>
              </button>
            );
          })}
        </div>

        <div className="field-grid">
          <label>
            Full name
            <input
              required
              value={checkout.customerName}
              onChange={(event) => updateField("customerName", event.target.value)}
            />
          </label>
          <label>
            Email
            <input
              required
              type="email"
              value={checkout.email}
              onChange={(event) => updateField("email", event.target.value)}
            />
          </label>
          <label>
            Phone
            <input
              required
              value={checkout.phone}
              onChange={(event) => updateField("phone", event.target.value)}
            />
          </label>
          <label className="span-2">
            Order notes
            <textarea
              rows={4}
              value={checkout.notes}
              onChange={(event) => updateField("notes", event.target.value)}
              placeholder="Gift note or shipping instruction"
            />
          </label>
        </div>

        <div className="estimate-panel">
          <div>
            <p className="card-label">Today's order total</p>
            <h3>{formatCurrency(cartSummary.subtotal)}</h3>
            <p>
              {activeQuantity} {activeQuantity === 1 ? "trainer" : "trainers"} selected.
              Shipping details are collected securely during Stripe checkout.
            </p>
          </div>
          <button
            className="primary-button"
            disabled={isSubmitting || cartSummary.items.length === 0}
            type="submit"
          >
            {isSubmitting ? "Redirecting to Stripe..." : "Get My Posture Pulse"}
          </button>
        </div>

        <div className="checkout-trust">
          <span>30-day guarantee</span>
          <span>Secure payment</span>
          <span>Tracked shipping</span>
        </div>

        {error ? <p className="error-text">{error}</p> : null}
      </form>
    </div>
  );
}
