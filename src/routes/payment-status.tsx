import { createFileRoute, Link } from "@tanstack/react-router";
import { useServerFn } from "@tanstack/react-start";
import { useQuery } from "@tanstack/react-query";
import { CheckCircle2, CircleAlert, Loader2 } from "lucide-react";
import { confirmDepositPayment } from "@/lib/booking.functions";

const title = "Payment status | Packmyload";
const description = "Confirmation of your Packmyload move deposit payment.";

type Search = { reference?: string | undefined; trxref?: string | undefined };

export const Route = createFileRoute("/payment-status")({
  validateSearch: (search: Record<string, unknown>): Search => ({
    reference: typeof search["reference"] === "string" ? (search["reference"] as string) : undefined,
    trxref: typeof search["trxref"] === "string" ? (search["trxref"] as string) : undefined,
  }),
  head: () => ({
    meta: [
      { title },
      { name: "description", content: description },
      { property: "og:title", content: title },
      { property: "og:description", content: description },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary" },
      { name: "robots", content: "noindex" },
    ],
    links: [{ rel: "canonical", href: "https://www.packmyload.com/payment-status" }],
  }),
  component: PaymentStatusPage,
});

function PaymentStatusPage() {
  const { reference, trxref } = Route.useSearch();
  const paymentReference = reference ?? trxref ?? "";
  const confirm = useServerFn(confirmDepositPayment);

  const verification = useQuery({
    queryKey: ["payment-status", paymentReference],
    enabled: Boolean(paymentReference),
    queryFn: () => confirm({ data: { paymentReference } }),
  });

  const paid = verification.data?.ok && verification.data.status === "success";

  return (
    <section className="container-page py-20">
      <div className="mx-auto max-w-xl rounded-4xl border border-border bg-card p-8 text-center shadow-lift">
        {!paymentReference ? (
          <>
            <CircleAlert className="mx-auto size-8 text-muted-foreground" aria-hidden="true" />
            <h1 className="mt-4 text-2xl font-semibold">No payment to confirm</h1>
            <p className="mt-2 text-sm text-muted-foreground">
              Open this page from the payment link we sent you.
            </p>
          </>
        ) : verification.isLoading ? (
          <>
            <Loader2 className="mx-auto size-8 animate-spin text-accent" aria-hidden="true" />
            <h1 className="mt-4 text-2xl font-semibold">Confirming your payment…</h1>
          </>
        ) : paid ? (
          <>
            <CheckCircle2 className="mx-auto size-8 text-accent" aria-hidden="true" />
            <h1 className="mt-4 text-2xl font-semibold">Deposit received</h1>
            <p className="mt-2 text-sm text-muted-foreground">
              Thank you. Your move slot is secured
              {verification.data?.reference ? ` for booking ${verification.data.reference}` : ""}. A
              consultant will confirm the crew and arrival window.
            </p>
          </>
        ) : (
          <>
            <CircleAlert className="mx-auto size-8 text-destructive" aria-hidden="true" />
            <h1 className="mt-4 text-2xl font-semibold">We couldn't confirm that payment</h1>
            <p className="mt-2 text-sm text-muted-foreground">
              If you were charged, call us on 0700 722 5776 with your reference and we'll sort it out
              right away.
            </p>
          </>
        )}
        <Link
          to="/"
          className="mt-8 inline-flex items-center justify-center rounded-full bg-accent px-6 py-3 text-sm font-semibold text-white"
        >
          Back to Packmyload
        </Link>
      </div>
    </section>
  );
}
