import { createFileRoute, Link } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { naira } from "@/lib/quote";

export const Route = createFileRoute("/_authenticated/admin/")({
  head: () => ({
    meta: [
      { title: "Operations overview | Packmyload admin" },
      {
        name: "description",
        content: "Internal overview of Packmyload bookings, chat leads and deposits.",
      },
      { property: "og:title", content: "Operations overview | Packmyload admin" },
      { property: "og:description", content: "Internal Packmyload operations overview." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary" },
      { name: "robots", content: "noindex" },
    ],
  }),
  component: AdminOverview,
});

type BookingSummary = {
  id: string;
  reference: string;
  full_name: string;
  service: string;
  status: string;
  payment_status: string;
  estimate_min: number | null;
  estimate_max: number | null;
  created_at: string;
};

function AdminOverview() {
  const bookings = useQuery({
    queryKey: ["admin-overview-bookings"],
    queryFn: async (): Promise<BookingSummary[]> => {
      const { data, error } = await supabase
        .from("bookings")
        .select("id, reference, full_name, service, status, payment_status, estimate_min, estimate_max, created_at")
        .order("created_at", { ascending: false })
        .limit(50);
      if (error) throw error;
      return (data ?? []) as unknown as BookingSummary[];
    },
  });

  const leads = useQuery({
    queryKey: ["admin-overview-leads"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("lead_inquiries")
        .select("id, status")
        .limit(500);
      if (error) throw error;
      return data ?? [];
    },
  });

  const rows = bookings.data ?? [];
  const pending = rows.filter((row) => row.status === "Pending").length;
  const paid = rows.filter((row) => row.payment_status === "paid").length;
  const pipeline = rows.reduce((total, row) => total + Number(row.estimate_min ?? 0), 0);
  const openLeads = (leads.data ?? []).filter((lead) => lead.status === "Pending").length;

  return (
    <section className="container-page py-10">
      <h1 className="text-2xl font-semibold text-foreground sm:text-3xl">Today at a glance</h1>
      <p className="mt-2 text-sm text-muted-foreground">
        Latest 50 bookings plus open chat leads. Jump into a section from the tabs above.
      </p>

      <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <Stat label="Bookings (recent)" value={String(rows.length)} />
        <Stat label="Awaiting first contact" value={String(pending)} />
        <Stat label="Deposits paid" value={String(paid)} />
        <Stat label="Open chat leads" value={String(openLeads)} />
      </div>

      <div className="mt-4 rounded-2xl border border-border bg-card p-5 shadow-soft">
        <p className="text-xs font-semibold tracking-wide uppercase text-muted-foreground">
          Estimated pipeline (low end)
        </p>
        <p className="mt-1 text-2xl font-semibold">{naira(pipeline)}</p>
      </div>

      <div className="mt-8 rounded-2xl border border-border bg-card shadow-soft">
        <div className="flex flex-wrap items-center justify-between gap-3 border-b border-border p-5">
          <h2 className="text-lg font-semibold">Newest bookings</h2>
          <Link to="/admin/bookings" className="text-sm font-semibold text-primary underline">
            Open bookings
          </Link>
        </div>
        <ul className="divide-y divide-border">
          {rows.slice(0, 8).map((row) => (
            <li key={row.id} className="grid grid-cols-[minmax(0,1fr)_auto] items-center gap-3 p-4">
              <div className="min-w-0">
                <p className="truncate text-sm font-semibold">
                  {row.reference} · {row.full_name}
                </p>
                <p className="truncate text-xs text-muted-foreground">
                  {row.service} · {new Date(row.created_at).toLocaleString("en-NG")}
                </p>
              </div>
              <span className="shrink-0 text-xs font-semibold text-muted-foreground">
                {row.status} · {row.payment_status}
              </span>
            </li>
          ))}
          {!rows.length ? (
            <li className="p-5 text-sm text-muted-foreground">
              {bookings.isLoading ? "Loading…" : "No bookings yet."}
            </li>
          ) : null}
        </ul>
      </div>
    </section>
  );
}

function Stat({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-2xl border border-border bg-card p-5 shadow-soft">
      <p className="text-xs font-semibold tracking-wide uppercase text-muted-foreground">{label}</p>
      <p className="mt-1 text-2xl font-semibold">{value}</p>
    </div>
  );
}
