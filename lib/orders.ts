import { mkdirSync } from "node:fs";
import path from "node:path";
import { DatabaseSync } from "node:sqlite";
import Stripe from "stripe";

export type OrderItem = {
  productId: string;
  name: string;
  supplierSku: string;
  quantity: number;
  unitAmount: number;
  supplierCost: number;
};

export type OrderRecord = {
  id: string;
  checkoutSessionId: string;
  paymentIntentId: string;
  customerName: string;
  customerEmail: string;
  customerPhone: string;
  shippingName: string;
  addressLine1: string;
  addressLine2: string;
  city: string;
  state: string;
  postalCode: string;
  country: string;
  notes: string;
  items: OrderItem[];
  subtotalAmount: number;
  supplierCostAmount: number;
  estimatedProfitAmount: number;
  paymentStatus: string;
  fulfillmentStatus: string;
  supplierName: string;
  supplierOrderId: string;
  supplierResponse: string;
  paidAt: string;
};

const dataDir = path.join(process.cwd(), "data");
const databasePath = path.join(dataDir, "orders.db");

function openDatabase() {
  mkdirSync(dataDir, { recursive: true });
  const db = new DatabaseSync(databasePath);

  db.exec(`
    CREATE TABLE IF NOT EXISTS orders (
      id TEXT PRIMARY KEY,
      checkout_session_id TEXT UNIQUE NOT NULL,
      payment_intent_id TEXT NOT NULL,
      customer_name TEXT NOT NULL,
      customer_email TEXT NOT NULL,
      customer_phone TEXT NOT NULL,
      shipping_name TEXT NOT NULL,
      address_line_1 TEXT NOT NULL,
      address_line_2 TEXT NOT NULL,
      city TEXT NOT NULL,
      state_region TEXT NOT NULL,
      postal_code TEXT NOT NULL,
      country TEXT NOT NULL,
      notes TEXT NOT NULL,
      items_json TEXT NOT NULL,
      subtotal_amount INTEGER NOT NULL,
      supplier_cost_amount INTEGER NOT NULL,
      estimated_profit_amount INTEGER NOT NULL,
      payment_status TEXT NOT NULL,
      fulfillment_status TEXT NOT NULL,
      supplier_name TEXT NOT NULL,
      supplier_order_id TEXT NOT NULL,
      supplier_response TEXT NOT NULL,
      paid_at TEXT NOT NULL
    )
  `);

  return db;
}

function insertOrReplaceOrder(db: DatabaseSync, order: OrderRecord) {
  db.prepare(`
    INSERT OR REPLACE INTO orders (
      id,
      checkout_session_id,
      payment_intent_id,
      customer_name,
      customer_email,
      customer_phone,
      shipping_name,
      address_line_1,
      address_line_2,
      city,
      state_region,
      postal_code,
      country,
      notes,
      items_json,
      subtotal_amount,
      supplier_cost_amount,
      estimated_profit_amount,
      payment_status,
      fulfillment_status,
      supplier_name,
      supplier_order_id,
      supplier_response,
      paid_at
    ) VALUES (
      ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?
    )
  `).run(
    order.id,
    order.checkoutSessionId,
    order.paymentIntentId,
    order.customerName,
    order.customerEmail,
    order.customerPhone,
    order.shippingName,
    order.addressLine1,
    order.addressLine2,
    order.city,
    order.state,
    order.postalCode,
    order.country,
    order.notes,
    JSON.stringify(order.items),
    order.subtotalAmount,
    order.supplierCostAmount,
    order.estimatedProfitAmount,
    order.paymentStatus,
    order.fulfillmentStatus,
    order.supplierName,
    order.supplierOrderId,
    order.supplierResponse,
    order.paidAt,
  );
}

export function ensureOrderDatabaseForRuntime() {
  const db = openDatabase();
  db.close();
}

export async function upsertOrderRecord(order: OrderRecord) {
  const db = openDatabase();
  insertOrReplaceOrder(db, order);
  db.close();
}

export async function readOrderRecords() {
  const db = openDatabase();
  const rows = db.prepare(`
    SELECT
      id,
      checkout_session_id,
      payment_intent_id,
      customer_name,
      customer_email,
      customer_phone,
      shipping_name,
      address_line_1,
      address_line_2,
      city,
      state_region,
      postal_code,
      country,
      notes,
      items_json,
      subtotal_amount,
      supplier_cost_amount,
      estimated_profit_amount,
      payment_status,
      fulfillment_status,
      supplier_name,
      supplier_order_id,
      supplier_response,
      paid_at
    FROM orders
    ORDER BY paid_at DESC
  `).all() as Array<Record<string, string | number>>;
  db.close();

  return rows.map((row) => ({
    id: String(row.id),
    checkoutSessionId: String(row.checkout_session_id),
    paymentIntentId: String(row.payment_intent_id),
    customerName: String(row.customer_name),
    customerEmail: String(row.customer_email),
    customerPhone: String(row.customer_phone),
    shippingName: String(row.shipping_name),
    addressLine1: String(row.address_line_1),
    addressLine2: String(row.address_line_2),
    city: String(row.city),
    state: String(row.state_region),
    postalCode: String(row.postal_code),
    country: String(row.country),
    notes: String(row.notes),
    items: JSON.parse(String(row.items_json)) as OrderItem[],
    subtotalAmount: Number(row.subtotal_amount),
    supplierCostAmount: Number(row.supplier_cost_amount),
    estimatedProfitAmount: Number(row.estimated_profit_amount),
    paymentStatus: String(row.payment_status),
    fulfillmentStatus: String(row.fulfillment_status),
    supplierName: String(row.supplier_name),
    supplierOrderId: String(row.supplier_order_id),
    supplierResponse: String(row.supplier_response),
    paidAt: String(row.paid_at),
  }));
}

export function createOrderFromSession(
  session: Stripe.Checkout.Session,
  fulfillment?: {
    fulfillmentStatus: string;
    supplierName: string;
    supplierOrderId: string;
    supplierResponse: string;
  },
): OrderRecord {
  const metadata = session.metadata ?? {};
  const shipping = session.shipping_details;
  const address = shipping?.address;
  const items = JSON.parse(metadata.itemsJson ?? "[]") as OrderItem[];

  return {
    id: session.client_reference_id ?? session.id,
    checkoutSessionId: session.id,
    paymentIntentId:
      typeof session.payment_intent === "string" ? session.payment_intent : "",
    customerName: metadata.customerName ?? shipping?.name ?? "Unknown customer",
    customerEmail:
      metadata.customerEmail ?? session.customer_details?.email ?? "Unknown email",
    customerPhone: metadata.customerPhone ?? session.customer_details?.phone ?? "",
    shippingName: shipping?.name ?? metadata.customerName ?? "Unknown recipient",
    addressLine1: address?.line1 ?? "",
    addressLine2: address?.line2 ?? "",
    city: address?.city ?? "",
    state: address?.state ?? "",
    postalCode: address?.postal_code ?? "",
    country: address?.country ?? "",
    notes: metadata.notes ?? "",
    items,
    subtotalAmount: Number(metadata.subtotalAmount ?? session.amount_total ?? 0),
    supplierCostAmount: Number(metadata.supplierCostAmount ?? 0),
    estimatedProfitAmount: Number(metadata.estimatedProfitAmount ?? 0),
    paymentStatus: session.payment_status ?? "paid",
    fulfillmentStatus: fulfillment?.fulfillmentStatus ?? "awaiting_supplier_setup",
    supplierName: fulfillment?.supplierName ?? process.env.SUPPLIER_NAME ?? "Unconfigured supplier",
    supplierOrderId: fulfillment?.supplierOrderId ?? "",
    supplierResponse: fulfillment?.supplierResponse ?? "Supplier automation not configured yet.",
    paidAt: new Date().toISOString(),
  };
}
