import { supabase } from "@/integrations/supabase/client";

export type OutboundUtm = {
  utm_source?: string;
  utm_medium?: string;
  utm_campaign?: string;
  utm_content?: string;
  utm_term?: string;
};

/** Appends UTM parameters to an outbound URL without clobbering existing query params. */
export function withUtm(url: string, utm: OutboundUtm) {
  const target = new URL(url);
  for (const [key, value] of Object.entries(utm)) {
    if (value) target.searchParams.set(key, value);
  }
  return target.toString();
}

type TrackArgs = {
  destination: string;
  label: string;
  utm?: OutboundUtm;
};

/**
 * Logs an outbound link click to the database and to gtag/dataLayer when present.
 * Fire-and-forget: never blocks or breaks navigation.
 */
export function trackOutboundClick({ destination, label, utm }: TrackArgs) {
  if (typeof window === "undefined") return;

  const payload = {
    destination,
    label,
    source_path: window.location.pathname,
    referrer: document.referrer || null,
    utm: utm && Object.keys(utm).length ? utm : null,
  };

  try {
    const w = window as unknown as {
      gtag?: (...args: unknown[]) => void;
      dataLayer?: unknown[];
    };
    w.gtag?.("event", "outbound_click", {
      link_url: destination,
      link_label: label,
      page_path: payload.source_path,
      ...utm,
    });
    w.dataLayer?.push({ event: "outbound_click", ...payload });
  } catch {
    // analytics must never break the click
  }

  void supabase
    .from("outbound_clicks")
    .insert(payload)
    .then(({ error }) => {
      if (error) console.warn("outbound click not logged", error.message);
    });
}
