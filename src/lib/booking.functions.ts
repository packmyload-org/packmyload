import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";

export const notifyBooking = createServerFn({ method: "POST" })
  .inputValidator((data) => z.object({ reference: z.string().min(4).max(40) }).parse(data))
  .handler(async ({ data }) => {
    const mod = await import("@/lib/booking.server");
    const booking = await mod.loadBooking(data.reference);
    if (!booking) return { sent: false, reason: "not-found" };

    const links = await mod.signedPhotoLinks(booking.photo_paths ?? []);
    const team = await mod.sendMail({
      to: [mod.TEAM_INBOX],
      subject: `${booking.is_quick_request ? "Quick quote request" : "New booking"} ${booking.reference} — ${booking.full_name}`,
      html: mod.bookingEmailHtml(booking, { forTeam: true, photoLinks: links }),
      ...(booking.email ? { replyTo: booking.email } : {}),
    });

    let customer: { sent: boolean } = { sent: false };
    if (booking.email) {
      customer = await mod.sendMail({
        to: [booking.email],
        subject: `Your Packmyload move request (${booking.reference})`,
        html: mod.bookingEmailHtml(booking, { forTeam: false, photoLinks: [] }),
      });
    }

    return { sent: team.sent, customerSent: customer.sent };
  });

export const startDepositPayment = createServerFn({ method: "POST" })
  .inputValidator((data) =>
    z
      .object({
        reference: z.string().min(4).max(40),
        origin: z.string().url().max(200),
      })
      .parse(data),
  )
  .handler(async ({ data }) => {
    const mod = await import("@/lib/booking.server");
    const booking = await mod.loadBooking(data.reference);
    if (!booking) return { ok: false as const, reason: "not-found" };
    if (!booking.email) return { ok: false as const, reason: "no-email" };
    const amount = Number(booking.deposit_amount ?? 0);
    if (!amount) return { ok: false as const, reason: "no-amount" };

    const init = await mod.paystackInitialize({
      email: booking.email,
      amount,
      reference: booking.reference,
      name: booking.full_name,
      callbackUrl: `${data.origin}/payment-status`,
    });
    if (!init.ok) return { ok: false as const, reason: init.reason };

    await mod.setBookingPayment(booking.reference, {
      payment_reference: init.paymentReference,
      payment_status: "pending",
    });
    return { ok: true as const, authorizationUrl: init.authorizationUrl };
  });

export const confirmDepositPayment = createServerFn({ method: "POST" })
  .inputValidator((data) => z.object({ paymentReference: z.string().min(4).max(120) }).parse(data))
  .handler(async ({ data }) => {
    const mod = await import("@/lib/booking.server");
    const result = await mod.paystackVerify(data.paymentReference);
    if (!result.ok) return { ok: false as const, status: "unknown" };
    const paid = result.status === "success";
    if (result.bookingReference) {
      await mod.setBookingPayment(result.bookingReference, {
        payment_status: paid ? "paid" : "failed",
      });
    }
    return {
      ok: true as const,
      status: result.status,
      reference: result.bookingReference ?? null,
    };
  });
