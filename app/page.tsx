import { BrandMark } from "@/components/brand-mark";
import { Storefront } from "@/components/storefront";
import {
  faqItems,
  featureCards,
  formatCurrency,
  heroProduct,
  painPoints,
  resultPoints,
  socialProof,
  trustBar,
} from "@/lib/catalog";

export default function Home() {
  return (
    <main>
      <section className="hero">
        <div className="shell">
          <div className="trust-bar" aria-label="Store highlights">
            {trustBar.map((item) => (
              <span key={item}>{item}</span>
            ))}
          </div>

          <header className="topbar">
            <div className="brand-lockup">
              <BrandMark />
              <div>
                <p className="eyebrow">Wellness best seller funnel</p>
                <h1>BOOST BUY</h1>
              </div>
            </div>
            <a className="secondary-button" href="/admin/orders">
              Admin orders
            </a>
          </header>

          <div className="hero-grid">
            <div className="hero-copy">
              <p className="kicker">Feel the difference in how you sit, work, and reset</p>
              <h2>
                Stop the all-day slouch before it turns into another sore evening.
              </h2>
              <p className="lede">
                {heroProduct.name} gives you a small, wearable reminder the moment
                your posture starts collapsing, so better alignment becomes easier
                to keep up with during long desk days.
              </p>
              <div className="hero-actions">
                <a className="primary-button" href="#store">
                  Claim Today's Offer
                </a>
                <a className="secondary-button" href="#results">
                  See How It Helps
                </a>
              </div>
              <ul className="stat-row" aria-label="Business highlights">
                <li>
                  <strong>{formatCurrency(heroProduct.price)}</strong>
                  <span>Starter offer today</span>
                </li>
                <li>
                  <strong>30-Day</strong>
                  <span>Satisfaction guarantee</span>
                </li>
                <li>
                  <strong>{heroProduct.shippingWindow}</strong>
                  <span>Tracked delivery window</span>
                </li>
              </ul>
            </div>

            <div className="hero-card hero-card--offer">
              <p className="card-label">Why it converts</p>
              <div className="service-spotlight service-spotlight--product">
                <h3>{heroProduct.shortName}</h3>
                <p>{heroProduct.promise}</p>
              </div>
              <div className="before-after-grid">
                <div className="state-card">
                  <span>Before</span>
                  <ul>
                    {painPoints.map((point) => (
                      <li key={point}>{point}</li>
                    ))}
                  </ul>
                </div>
                <div className="state-card state-card--after">
                  <span>After</span>
                  <ul>
                    {resultPoints.map((point) => (
                      <li key={point}>{point}</li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="content-section" id="results">
        <div className="shell">
          <div className="section-heading">
            <p className="section-kicker">Why customers buy</p>
            <h2>A tighter, clearer promise that matches a high-converting product page</h2>
            <p>
              Strong stores sell a believable transformation. This page is built
              around one product, one pain point, and one straightforward outcome.
            </p>
          </div>

          <div className="service-grid">
            {featureCards.map((card) => (
              <article className="service-card" key={card.title}>
                <p className="service-price">Benefit</p>
                <h3>{card.title}</h3>
                <p>{card.body}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="content-section accent-section">
        <div className="shell split-story">
          <div className="story-card">
            <p className="section-kicker">Offer stack</p>
            <h2>Everything on the page now reduces hesitation</h2>
            <div className="story-list">
              <div className="story-item">
                <strong>One-product focus</strong>
                <span>No split attention across weak categories or random items.</span>
              </div>
              <div className="story-item">
                <strong>Bundle pricing</strong>
                <span>Higher AOV without making the customer think too hard.</span>
              </div>
              <div className="story-item">
                <strong>Social proof + guarantee</strong>
                <span>More trust at the exact moment someone is deciding.</span>
              </div>
              <div className="story-item">
                <strong>Fast checkout path</strong>
                <span>Less friction between interest and payment completion.</span>
              </div>
            </div>
          </div>

          <div className="story-card story-card--quote">
            <p className="section-kicker">Best positioning line</p>
            <h2>"A small wearable reminder that helps you break the slouch habit."</h2>
            <p>
              That is a stronger sales message than a vague catalog pitch because it
              speaks directly to the daily problem and the easy-win outcome.
            </p>
          </div>
        </div>
      </section>

      <section className="content-section">
        <div className="shell">
          <div className="section-heading">
            <p className="section-kicker">Reviews</p>
            <h2>Believable proof makes a bigger difference than extra features</h2>
            <p>
              These sections should eventually be replaced with real customer
              reviews, but the layout is now built for that trust layer.
            </p>
          </div>

          <div className="review-grid">
            {socialProof.map((review) => (
              <article className="review-card" key={review.name}>
                <div className="review-stars" aria-label={`${review.rating} star review`}>
                  {"★".repeat(review.rating)}
                </div>
                <p>{review.quote}</p>
                <strong>{review.name}</strong>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="content-section accent-section" id="store">
        <div className="shell">
          <div className="section-heading compact">
            <p className="section-kicker">Checkout</p>
            <h2>Pick a bundle and move straight into payment</h2>
            <p>
              The purchase path is now tuned for mobile clarity, stronger offer
              framing, and faster decision-making.
            </p>
          </div>
          <Storefront />
        </div>
      </section>

      <section className="content-section">
        <div className="shell final-grid">
          <div className="guarantee-card">
            <p className="section-kicker">Guarantee</p>
            <h2>Try it for 30 days with less risk.</h2>
            <p>
              A clear satisfaction promise helps remove the fear that stops first-time
              buyers from completing checkout.
            </p>
          </div>
          <div className="faq-card">
            <p className="section-kicker">FAQ</p>
            <div className="faq-list">
              {faqItems.map((item) => (
                <div className="faq-item" key={item.question}>
                  <strong>{item.question}</strong>
                  <span>{item.answer}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section className="content-section">
        <div className="shell final-cta">
          <div>
            <p className="section-kicker">Ready to scale</p>
            <h2>Now the store sells like a focused offer instead of a placeholder.</h2>
            <p>
              The next real step is swapping in your actual brand assets, real
              reviews, tracking pixels, and supplier credentials.
            </p>
          </div>
          <div className="cta-links">
            <a className="primary-button" href="#store">
              Launch This Offer
            </a>
            <a className="secondary-button" href="/admin/orders">
              Review Orders
            </a>
          </div>
        </div>
      </section>
    </main>
  );
}
