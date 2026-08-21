import { estimateMove, naira, SURVEY_FEE } from "@/lib/quote";

export const TEAM_INBOX = "book@packmyload.com";
export const SURVEY_CONSULTATION_FEE = SURVEY_FEE;


export type BookingRow = {
  reference: string;
  service: string;
  move_size: string | null;
  pickup_address: string;
  destination_address: string | null;
  pickup_floor: string | null;
  destination_floor: string | null;
  moving_date: string | null;
  arrival_window: string | null;
  full_name: string;
  phone: string;
  email: string | null;
  notes: string | null;
  photo_paths: string[];
  estimate_min: number | null;
  estimate_max: number | null;
  deposit_amount: number | null;
  survey_requested: boolean | null;
  survey_fee: number | null;
  is_quick_request: boolean;

};

async function admin() {
  const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
  return supabaseAdmin;
}

export async function loadBooking(reference: string): Promise<BookingRow | null> {
  const client = await admin();
  const { data, error } = await client
    .from("bookings")
    .select("*")
    .eq("reference", reference)
    .maybeSingle();
  if (error || !data) return null;
  return data as unknown as BookingRow;
}

export async function signedPhotoLinks(paths: string[]): Promise<string[]> {
  if (!paths.length) return [];
  const client = await admin();
  const { data } = await client.storage
    .from("booking-photos")
    .createSignedUrls(paths, 60 * 60 * 24 * 7);
  return (data ?? []).map((item) => item.signedUrl).filter(Boolean) as string[];
}

export async function setBookingPayment(
  reference: string,
  patch: { payment_reference?: string; payment_status?: string },
) {
  const client = await admin();
  await client.from("bookings").update(patch).eq("reference", reference);
}

function row(label: string, value: string) {
  return `<tr><td style="padding:6px 12px 6px 0;color:#64748b;font-size:13px">${label}</td><td style="padding:6px 0;color:#0f172a;font-size:13px;font-weight:600">${value}</td></tr>`;
}

export function bookingEmailHtml(
  booking: BookingRow,
  options: { forTeam: boolean; photoLinks: string[] },
) {
  const estimate = estimateMove({
    service: booking.service,
    size: booking.move_size ?? undefined,
    interstate: false,
    pickupFloor: booking.pickup_floor,
    destinationFloor: booking.destination_floor,
  });
  const range =
    booking.estimate_min && booking.estimate_max
      ? `${naira(Number(booking.estimate_min))} – ${naira(Number(booking.estimate_max))}`
      : estimate
        ? `${naira(estimate.min)} – ${naira(estimate.max)}`
        : "To be confirmed";

  const details = [
    row("Reference", booking.reference),
    row("Service", booking.service),
    booking.move_size ? row("Size", booking.move_size) : "",
    row("Pick-up", `${booking.pickup_address}${booking.pickup_floor ? ` — ${booking.pickup_floor}` : ""}`),
    booking.destination_address
      ? row(
          "Destination",
          `${booking.destination_address}${booking.destination_floor ? ` — ${booking.destination_floor}` : ""}`,
        )
      : "",
    booking.moving_date
      ? row("Date", `${booking.moving_date}${booking.arrival_window ? ` · ${booking.arrival_window}` : ""}`)
      : "",
    row("Name", booking.full_name),
    row("Phone", booking.phone),
    booking.email ? row("Email", booking.email) : "",
    booking.notes ? row("Notes", booking.notes) : "",
    row("Estimate", range),
  ]
    .filter(Boolean)
    .join("");

  const photos = options.photoLinks.length
    ? `<p style="margin:18px 0 6px;font-size:13px;color:#64748b">Item photos (links valid 7 days):</p><ul style="padding-left:18px;margin:0">${options.photoLinks
        .map(
          (link, index) =>
            `<li style="font-size:13px"><a href="${link}" style="color:#1d4ed8">Photo ${index + 1}</a></li>`,
        )
        .join("")}</ul>`
    : "";

  const intro = options.forTeam
    ? `<p style="font-size:14px;color:#0f172a">New ${booking.is_quick_request ? "quick photo" : "booking"} request from ${booking.full_name} (${booking.phone}).</p>`
    : `<p style="font-size:14px;color:#0f172a">Hi ${booking.full_name.split(" ")[0]}, thanks for choosing Packmyload. We have your request and a move consultant will call you shortly to confirm your final price.</p>`;

  return `<!doctype html><html><body style="margin:0;background:#f1f5f9;font-family:Helvetica,Arial,sans-serif">
  <div style="max-width:600px;margin:0 auto;padding:28px">
    <div style="background:#ffffff;border-radius:18px;padding:28px">
      <h1 style="margin:0 0 12px;font-size:20px;color:#0f172a">${options.forTeam ? "New move request" : "Your Packmyload move request"}</h1>
      ${intro}
      <table style="width:100%;border-collapse:collapse;margin-top:14px">${details}</table>
      ${photos}
      <p style="margin-top:22px;font-size:12px;color:#94a3b8">Packmyload · Lagos &amp; Abuja, Nigeria · 0700 722 5776</p>
    </div>
  </div></body></html>`;
}

export async function sendMail(input: { to: string[]; subject: string; html: string; replyTo?: string }) {
  const connectionKey = process.env["RESEND_API_KEY"];
  const lovableKey = process.env["LOVABLE_API_KEY"];
  if (!connectionKey || !lovableKey) {
    console.warn("Resend connector not configured — skipping email send");
    return { sent: false as const, reason: "missing-key" };
  }
  const from = process.env["RESEND_FROM"] ?? "Packmyload <onboarding@resend.dev>";
  const response = await fetch("https://connector-gateway.lovable.dev/resend/emails", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${lovableKey}`,
      "X-Connection-Api-Key": connectionKey,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      from,
      to: input.to,
      subject: input.subject,
      html: input.html,
      ...(input.replyTo ? { reply_to: input.replyTo } : {}),
    }),
  });
  if (!response.ok) {
    const body = await response.text();
    console.error("Resend send failed", response.status, body);
    return { sent: false as const, reason: `send-failed:${response.status}` };
  }
  return { sent: true as const };
}

export async function paystackInitialize(input: {
  email: string;
  amount: number;
  reference: string;
  callbackUrl: string;
  name: string;
}) {
  const key = process.env["PAYSTACK_SECRET_KEY"];
  if (!key) return { ok: false as const, reason: "missing-key" };
  const response = await fetch("https://api.paystack.co/transaction/initialize", {
    method: "POST",
    headers: { Authorization: `Bearer ${key}`, "Content-Type": "application/json" },
    body: JSON.stringify({
      email: input.email,
      amount: Math.round(input.amount * 100),
      callback_url: input.callbackUrl,
      metadata: { booking_reference: input.reference, customer_name: input.name },
    }),
  });
  const payload = (await response.json()) as {
    status?: boolean;
    data?: { authorization_url?: string; reference?: string };
    message?: string;
  };
  if (!response.ok || !payload.status || !payload.data?.authorization_url) {
    console.error("Paystack init failed", payload.message);
    return { ok: false as const, reason: payload.message ?? "init-failed" };
  }
  return {
    ok: true as const,
    authorizationUrl: payload.data.authorization_url,
    paymentReference: payload.data.reference ?? input.reference,
  };
}

export async function paystackVerify(paymentReference: string) {
  const key = process.env["PAYSTACK_SECRET_KEY"];
  if (!key) return { ok: false as const, status: "unknown" };
  const response = await fetch(
    `https://api.paystack.co/transaction/verify/${encodeURIComponent(paymentReference)}`,
    { headers: { Authorization: `Bearer ${key}` } },
  );
  const payload = (await response.json()) as {
    status?: boolean;
    data?: { status?: string; metadata?: { booking_reference?: string } };
  };
  if (!response.ok || !payload.status) return { ok: false as const, status: "unknown" };
  return {
    ok: true as const,
    status: payload.data?.status ?? "unknown",
    bookingReference: payload.data?.metadata?.booking_reference,
  };
}
