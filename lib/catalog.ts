export type Product = {
  id: string;
  name: string;
  shortName: string;
  tagline: string;
  description: string;
  price: number;
  compareAtPrice?: number;
  supplierSku: string;
  supplierCost: number;
  shippingWindow: string;
  category: string;
  accent: string;
  bullets: string[];
  promise: string;
};

export const heroProduct: Product = {
  id: "posture-pulse",
  name: "Posture Pulse Trainer",
  shortName: "Posture Pulse",
  tagline: "The simple wearable that nudges you out of slouch mode in seconds.",
  description:
    "A lightweight posture trainer built for desk workers, students, and creators who spend hours rounded forward and want a visible reset without bulky gear.",
  price: 4900,
  compareAtPrice: 7900,
  supplierSku: "PULSE-001",
  supplierCost: 1850,
  shippingWindow: "6-10 business days",
  category: "Wellness",
  accent: "linear-gradient(135deg, #ffd18f, #ff7e5f 48%, #4d5eff)",
  bullets: [
    "Smart vibration reminder when your shoulders collapse",
    "Thin profile that fits under everyday clothes",
    "Rechargeable setup with no complicated app required",
  ],
  promise: "Sit straighter, feel more aware, and build better posture habits with less effort.",
};

export const products: Product[] = [heroProduct];

export const bundleOffers = [
  {
    id: "starter",
    label: "Starter Pack",
    quantity: 1,
    badge: "Most popular first try",
    headline: "1 device for daily desk use",
    price: heroProduct.price,
    compareAtPrice: heroProduct.compareAtPrice ?? 7900,
    savingsLabel: "Save 38%",
  },
  {
    id: "duo",
    label: "Duo Pack",
    quantity: 2,
    badge: "Best seller",
    headline: "Keep one at home and one at work",
    price: 8900,
    compareAtPrice: 15800,
    savingsLabel: "Save 44%",
  },
  {
    id: "family",
    label: "Family Pack",
    quantity: 3,
    badge: "Best value",
    headline: "The highest discount for partners or families",
    price: 11900,
    compareAtPrice: 23700,
    savingsLabel: "Save 49%",
  },
] as const;

export const trustBar = [
  "30-day posture reset guarantee",
  "Secure Stripe checkout",
  "Tracked shipping",
  "U.S. support inbox",
] as const;

export const painPoints = [
  "You catch yourself collapsing over a laptop by noon.",
  "Your neck and shoulders feel tight after work.",
  "You want a simple reminder, not a complicated routine.",
] as const;

export const resultPoints = [
  "Creates an instant cue to sit upright the moment you slouch.",
  "Makes desk sessions feel more intentional and less draining.",
  "Turns posture correction into a light daily habit instead of a chore.",
] as const;

export const featureCards = [
  {
    title: "Immediate feedback",
    body: "A gentle vibration helps correct posture the moment your upper back rounds forward.",
  },
  {
    title: "Easy to wear",
    body: "Lightweight and slim enough to fit under tees, sweaters, and work clothes.",
  },
  {
    title: "Built for routine",
    body: "Designed for workdays, study sessions, gaming setups, and long commutes.",
  },
] as const;

export const socialProof = [
  {
    name: "Maya R.",
    quote:
      "I bought it for long editing sessions and noticed I stopped folding into my chair after the first week.",
    rating: 5,
  },
  {
    name: "Chris T.",
    quote:
      "The Duo Pack was the move. One stays in my office bag and the other stays at home.",
    rating: 5,
  },
  {
    name: "Jenna L.",
    quote:
      "It feels subtle, not annoying. That was the main reason I kept using it every day.",
    rating: 5,
  },
] as const;

export const faqItems = [
  {
    question: "How long should I wear it each day?",
    answer:
      "Most customers start with short daily sessions and build up as posture awareness improves. It is meant to support better habits, not force discomfort.",
  },
  {
    question: "Does it work under clothing?",
    answer:
      "Yes. The slim design is intended to sit discreetly under everyday clothing for normal desk and home use.",
  },
  {
    question: "When will my order arrive?",
    answer: `Standard tracked delivery usually arrives in ${heroProduct.shippingWindow}.`,
  },
  {
    question: "What if it is not for me?",
    answer:
      "The offer includes a 30-day customer satisfaction guarantee so the purchase feels lower risk.",
  },
] as const;

export function getProductById(id: string) {
  return products.find((product) => product.id === id);
}

export function formatCurrency(amount: number) {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
  }).format(amount / 100);
}
