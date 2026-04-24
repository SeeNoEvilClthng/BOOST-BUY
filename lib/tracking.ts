"use client";

declare global {
  interface Window {
    dataLayer?: unknown[];
    gtag?: (...args: unknown[]) => void;
    fbq?: (...args: unknown[]) => void;
    ttq?: {
      track?: (event: string, payload?: Record<string, unknown>) => void;
    };
  }
}

type TrackingPayload = Record<string, unknown>;

function normalizeValue(value?: number) {
  return typeof value === "number" ? Number((value / 100).toFixed(2)) : undefined;
}

export function trackEvent(
  eventName: string,
  payload: TrackingPayload = {},
  options?: {
    gaEventName?: string;
    metaEventName?: string;
    tiktokEventName?: string;
    value?: number;
  },
) {
  if (typeof window === "undefined") {
    return;
  }

  const value = normalizeValue(options?.value);
  const eventPayload = {
    ...payload,
    ...(value !== undefined ? { value } : {}),
  };

  window.dataLayer?.push({
    event: eventName,
    ...eventPayload,
  });

  if (window.gtag) {
    window.gtag("event", options?.gaEventName ?? eventName, eventPayload);
  }

  if (window.fbq) {
    window.fbq("track", options?.metaEventName ?? eventName, eventPayload);
  }

  window.ttq?.track?.(options?.tiktokEventName ?? eventName, eventPayload);
}
