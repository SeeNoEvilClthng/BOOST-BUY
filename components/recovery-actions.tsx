"use client";

import { useState } from "react";

export function RecoveryActions({
  checkoutSessionId,
  recoveryUrl,
  disabled,
}: {
  checkoutSessionId: string;
  recoveryUrl: string;
  disabled: boolean;
}) {
  const [message, setMessage] = useState("");
  const [isSending, setIsSending] = useState(false);

  const sendRecoveryEmail = async () => {
    setIsSending(true);
    setMessage("");

    try {
      const response = await fetch("/api/send-recovery-email", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ checkoutSessionId }),
      });

      const payload = (await response.json()) as { error?: string };

      if (!response.ok) {
        throw new Error(payload.error ?? "Unable to send recovery email.");
      }

      setMessage("Recovery email sent.");
    } catch (error) {
      setMessage(error instanceof Error ? error.message : "Send failed.");
    } finally {
      setIsSending(false);
    }
  };

  return (
    <div className="recovery-actions-cell">
      {recoveryUrl && !disabled ? (
        <a
          className="secondary-button admin-link-button"
          href={recoveryUrl}
          target="_blank"
          rel="noreferrer"
        >
          Open cart
        </a>
      ) : (
        <span>No active recovery link</span>
      )}

      {!disabled ? (
        <button
          className="secondary-button admin-link-button"
          type="button"
          disabled={isSending}
          onClick={() => void sendRecoveryEmail()}
        >
          {isSending ? "Sending..." : "Send email"}
        </button>
      ) : null}

      {message ? <span className="recovery-message">{message}</span> : null}
    </div>
  );
}
