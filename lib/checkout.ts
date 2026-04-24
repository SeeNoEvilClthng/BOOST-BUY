import { bundleOffers, getProductById, heroProduct } from "@/lib/catalog";

export type CartLineInput = {
  productId: string;
  quantity: number;
};

export type CheckoutInput = {
  customerName: string;
  email: string;
  phone: string;
  notes: string;
  cart: CartLineInput[];
};

function getBundlePrice(productId: string, quantity: number) {
  if (productId !== heroProduct.id) {
    return null;
  }

  const bundle = bundleOffers.find((entry) => entry.quantity === quantity);
  return bundle?.price ?? null;
}

export function normalizeCart(cart: CartLineInput[]) {
  return cart
    .map((line) => ({
      ...line,
      quantity: Number.isFinite(line.quantity) ? Math.floor(line.quantity) : 0,
    }))
    .filter((line) => line.quantity > 0)
    .map((line) => {
      const product = getProductById(line.productId);
      return product
        ? {
            productId: product.id,
            name:
              getBundlePrice(product.id, line.quantity) !== null
                ? `${line.quantity}x ${product.name} Bundle`
                : product.name,
            supplierSku: product.supplierSku,
            unitAmount: product.price,
            lineAmount:
              getBundlePrice(product.id, line.quantity) ??
              product.price * line.quantity,
            supplierCost: product.supplierCost,
            quantity: line.quantity,
          }
        : null;
    })
    .filter(Boolean) as Array<{
    productId: string;
    name: string;
    supplierSku: string;
    unitAmount: number;
    lineAmount: number;
    supplierCost: number;
    quantity: number;
  }>;
}

export function summarizeCart(cart: CartLineInput[]) {
  const normalized = normalizeCart(cart);
  const subtotal = normalized.reduce((sum, item) => sum + item.lineAmount, 0);
  const supplierCost = normalized.reduce(
    (sum, item) => sum + item.supplierCost * item.quantity,
    0,
  );

  return {
    items: normalized,
    subtotal,
    supplierCost,
    estimatedProfit: subtotal - supplierCost,
  };
}
