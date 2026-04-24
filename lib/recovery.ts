import { mkdirSync } from "node:fs";
import path from "node:path";
import { DatabaseSync } from "node:sqlite";

type RecoveryItem = {
  productId: string;
  name: string;
  supplierSku: string;
  unitAmount: number;
  lineAmount: number;
  supplierCost: number;
  quantity: number;
};

export type RecoveryRecord = {
  id: string;
  checkoutSessionId: string;
  customerName: string;
  customerEmail: string;
  customerPhone: string;
  notes: string;
  items: RecoveryItem[];
  subtotalAmount: number;
  status: string;
  recoveryUrl: string;
  expiresAt: string;
  createdAt: string;
  completedAt: string;
  recoveredOrderId: string;
};

const dataDir = path.join(process.cwd(), "data");
const databasePath = path.join(dataDir, "recovery.db");

function openDatabase() {
  mkdirSync(dataDir, { recursive: true });
  const db = new DatabaseSync(databasePath);

  db.exec(`
    CREATE TABLE IF NOT EXISTS recovery_carts (
      id TEXT PRIMARY KEY,
      checkout_session_id TEXT UNIQUE NOT NULL,
      customer_name TEXT NOT NULL,
      customer_email TEXT NOT NULL,
      customer_phone TEXT NOT NULL,
      notes TEXT NOT NULL,
      items_json TEXT NOT NULL,
      subtotal_amount INTEGER NOT NULL,
      status TEXT NOT NULL,
      recovery_url TEXT NOT NULL,
      expires_at TEXT NOT NULL,
      created_at TEXT NOT NULL,
      completed_at TEXT NOT NULL,
      recovered_order_id TEXT NOT NULL
    )
  `);

  return db;
}

function mapRow(row: Record<string, string | number>): RecoveryRecord {
  return {
    id: String(row.id),
    checkoutSessionId: String(row.checkout_session_id),
    customerName: String(row.customer_name),
    customerEmail: String(row.customer_email),
    customerPhone: String(row.customer_phone),
    notes: String(row.notes),
    items: JSON.parse(String(row.items_json)) as RecoveryItem[],
    subtotalAmount: Number(row.subtotal_amount),
    status: String(row.status),
    recoveryUrl: String(row.recovery_url),
    expiresAt: String(row.expires_at),
    createdAt: String(row.created_at),
    completedAt: String(row.completed_at),
    recoveredOrderId: String(row.recovered_order_id),
  };
}

export function ensureRecoveryDatabaseForRuntime() {
  const db = openDatabase();
  db.close();
}

export async function upsertRecoveryRecord(record: RecoveryRecord) {
  const db = openDatabase();
  db.prepare(`
    INSERT OR REPLACE INTO recovery_carts (
      id,
      checkout_session_id,
      customer_name,
      customer_email,
      customer_phone,
      notes,
      items_json,
      subtotal_amount,
      status,
      recovery_url,
      expires_at,
      created_at,
      completed_at,
      recovered_order_id
    ) VALUES (
      ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?
    )
  `).run(
    record.id,
    record.checkoutSessionId,
    record.customerName,
    record.customerEmail,
    record.customerPhone,
    record.notes,
    JSON.stringify(record.items),
    record.subtotalAmount,
    record.status,
    record.recoveryUrl,
    record.expiresAt,
    record.createdAt,
    record.completedAt,
    record.recoveredOrderId,
  );
  db.close();
}

export async function readRecoveryRecords() {
  const db = openDatabase();
  const rows = db.prepare(`
    SELECT
      id,
      checkout_session_id,
      customer_name,
      customer_email,
      customer_phone,
      notes,
      items_json,
      subtotal_amount,
      status,
      recovery_url,
      expires_at,
      created_at,
      completed_at,
      recovered_order_id
    FROM recovery_carts
    ORDER BY created_at DESC
  `).all() as Array<Record<string, string | number>>;
  db.close();

  return rows.map(mapRow);
}

export async function countOpenRecoveryRecords() {
  const db = openDatabase();
  const row = db.prepare(`
    SELECT COUNT(*) AS count
    FROM recovery_carts
    WHERE status = 'open'
  `).get() as { count: number };
  db.close();
  return row.count;
}

export async function markRecoveryCompleted(input: {
  checkoutSessionId: string;
  recoveredOrderId: string;
}) {
  const db = openDatabase();
  db.prepare(`
    UPDATE recovery_carts
    SET
      status = 'completed',
      completed_at = ?,
      recovered_order_id = ?
    WHERE checkout_session_id = ?
  `).run(new Date().toISOString(), input.recoveredOrderId, input.checkoutSessionId);
  db.close();
}
