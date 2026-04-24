import { NextResponse } from "next/server";

import { sendRecoveryNotification } from "@/lib/notifications";
import {
  ensureRecoveryDatabaseForRuntime,
  markRecoveryEmailSent,
  readRecoveryRecordBySessionId,
} from "@/lib/recovery";

export async function POST(request: Request) {
  const body = (await request.json()) as { checkoutSessionId?: string };
  const checkoutSessionId = body.checkoutSessionId;

  if (!checkoutSessionId) {
    return NextResponse.json(
      { error: "Missing checkoutSessionId." },
      { status: 400 },
    );
  }

  ensureRecoveryDatabaseForRuntime();
  const record = await readRecoveryRecordBySessionId(checkoutSessionId);

  if (!record) {
    return NextResponse.json({ error: "Recovery record not found." }, { status: 404 });
  }

  if (record.status !== "open") {
    return NextResponse.json(
      { error: "Recovery email can only be sent for open carts." },
      { status: 400 },
    );
  }

  const sent = await sendRecoveryNotification(record);

  if (!sent) {
    return NextResponse.json(
      {
        error:
          "Recovery email is not configured. Add RESEND_API_KEY and NOTIFICATION_FROM_EMAIL.",
      },
      { status: 400 },
    );
  }

  await markRecoveryEmailSent(checkoutSessionId);

  return NextResponse.json({ success: true });
}
