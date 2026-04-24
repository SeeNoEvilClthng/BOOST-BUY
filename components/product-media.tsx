import Image from "next/image";

const media = [
  {
    src: "/product-hero.svg",
    alt: "Hero image of the Posture Pulse Trainer with offer framing.",
    title: "Hero angle",
    description: "Main product image used for the landing section and top-of-page conversion framing.",
  },
  {
    src: "/product-detail.svg",
    alt: "Detail product rendering of the Posture Pulse Trainer.",
    title: "Product detail",
    description: "Close-up product view for PDP trust and product-focused creative.",
  },
  {
    src: "/lifestyle-scene.svg",
    alt: "Lifestyle scene showing the posture trainer in a desk-work setting.",
    title: "Lifestyle scene",
    description: "A contextual asset designed to support ad-to-landing-page message match.",
  },
] as const;

export function ProductMedia() {
  return (
    <section className="media-section" aria-label="Product media">
      <div className="media-lead">
        <p className="section-kicker">Creative Assets</p>
        <h2>The store now ships with reusable branded media instead of placeholders.</h2>
        <p>
          These assets create a stronger first impression, support ad creative
          consistency, and give the product page a more complete brand surface.
        </p>
      </div>

      <div className="media-grid">
        {media.map((item) => (
          <article className="media-card" key={item.src}>
            <div className="media-frame">
              <Image
                src={item.src}
                alt={item.alt}
                width={1200}
                height={900}
                className="media-image"
              />
            </div>
            <div className="media-copy">
              <strong>{item.title}</strong>
              <span>{item.description}</span>
            </div>
          </article>
        ))}
      </div>
    </section>
  );
}
