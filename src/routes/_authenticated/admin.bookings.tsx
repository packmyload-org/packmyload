import { createFileRoute } from "@tanstack/react-router";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useState } from "react";
import { toast } from "sonner";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { supabase } from "@/integrations/supabase/client";
import { naira } from "@/lib/quote";

const STATUSES = ["Pending", "Contacted", "Quoted", "Scheduled", "Completed", "Cancelled"] as const;

type Booking = {
  id: string;
  reference: string;
  service: string;
  move_size: string | null;
  pickup_address: string;
  destination_address: string;
  pickup_floor: string | null;
  destination_floor: string | null;
  moving_date: string | null;
  arrival_window: string | null;
  full_name: string;
  phone: string;
  email: string | null;
  notes: string | null;
  photo_paths: string[];
  status: string;
  created_at: string;
  estimate_min: number | null;
  estimate_max: number | null;
  deposit_amount: number | null;
  survey_requested: boolean | null;
  survey_fee: number | null;
  payment_status: string;
  is_quick_request: boolean;
};

export const Route = createFileRoute("/_authenticated/admin/bookings")({
  head: () => ({
    meta: [
      { title: "Move bookings | Packmyload admin" },
      {
        name: "description",
        content: "Internal dashboard to review Packmyload move bookings and item photos.",
      },
      { property: "og:title", content: "Move bookings | Packmyload admin" },
      { property: "og:description", content: "Internal dashboard for Packmyload move bookings." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary" },
      { name: "robots", content: "noindex" },
    ],
  }),
  component: BookingsAdmin,
});

function BookingsAdmin() {
  const queryClient = useQueryClient();
  const [statusFilter, setStatusFilter] = useState("all");
  const [search, setSearch] = useState("");

  const bookingsQuery = useQuery({
    queryKey: ["bookings"],
    queryFn: async (): Promise<Booking[]> => {
      const { data, error } = await supabase
        .from("bookings")
        .select("*")
        .order("created_at", { ascending: false });
      if (error) throw error;
      return (data ?? []) as Booking[];
    },
  });

  const updateStatus = useMutation({
    mutationFn: async ({ id, status }: { id: string; status: string }) => {
      const { error } = await supabase.from("bookings").update({ status }).eq("id", id);
      if (error) throw error;
    },
    onSuccess: () => {
      toast.success("Status updated");
      void queryClient.invalidateQueries({ queryKey: ["bookings"] });
    },
    onError: () => toast.error("Couldn't update the status. Do you have admin access?"),
  });

  const bookings = (bookingsQuery.data ?? []).filter((booking) => {
    const matchesStatus = statusFilter === "all" || booking.status === statusFilter;
    const term = search.trim().toLowerCase();
    const matchesSearch =
      !term ||
      [
        booking.reference,
        booking.full_name,
        booking.phone,
        booking.email ?? "",
        booking.pickup_address,
        booking.destination_address,
      ]
        .join(" ")
        .toLowerCase()
        .includes(term);
    return matchesStatus && matchesSearch;
  });

  async function openPhoto(path: string) {
    const { data, error } = await supabase.storage
      .from("booking-photos")
      .createSignedUrl(path, 60 * 60);
    if (error || !data?.signedUrl) {
      toast.error("Couldn't open that photo.");
      return;
    }
    window.open(data.signedUrl, "_blank", "noopener,noreferrer");
  }

  return (
    <section className="container-page py-10">
      <div>
        <h1 className="text-2xl font-semibold text-foreground sm:text-3xl">Move bookings</h1>
        <p className="mt-2 text-sm text-muted-foreground">
          Every booking submitted through the site wizard, with item photos, estimates and access
          details.
        </p>
      </div>

      <div className="mt-6 flex flex-wrap gap-3">
        <Input
          value={search}
          onChange={(event) => setSearch(event.target.value)}
          placeholder="Search reference, name, phone or address"
          className="max-w-xs"
        />
        <Select value={statusFilter} onValueChange={setStatusFilter}>
          <SelectTrigger className="w-44">
            <SelectValue placeholder="All statuses" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All statuses</SelectItem>
            {STATUSES.map((status) => (
              <SelectItem key={status} value={status}>
                {status}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div className="mt-8 space-y-3">
        {bookingsQuery.isLoading ? (
          <p className="text-sm text-muted-foreground">Loading bookings…</p>
        ) : null}
        {bookingsQuery.isError ? (
          <p className="text-sm text-destructive">
            We couldn't load bookings. Your account may not have admin access yet.
          </p>
        ) : null}
        {!bookingsQuery.isLoading && !bookingsQuery.isError && bookings.length === 0 ? (
          <p className="text-sm text-muted-foreground">No bookings match this view yet.</p>
        ) : null}

        {bookings.map((booking) => (
          <article key={booking.id} className="rounded-2xl border border-border bg-card p-5 shadow-soft">
            <div className="flex flex-wrap items-start justify-between gap-4">
              <div>
                <h2 className="text-lg font-semibold text-foreground">
                  {booking.reference} · {booking.full_name}
                </h2>
                <p className="text-sm text-muted-foreground">
                  {[booking.phone, booking.email].filter(Boolean).join(" · ")}
                </p>
                <p className="mt-1 text-sm text-muted-foreground">
                  {booking.service}
                  {booking.move_size ? ` · ${booking.move_size}` : ""}
                </p>
              </div>
              <div className="flex items-center gap-3">
                {booking.is_quick_request ? <Badge variant="outline">Photo request</Badge> : null}
                <Badge variant="secondary">{booking.status}</Badge>
                <Select
                  value={booking.status}
                  onValueChange={(status) => updateStatus.mutate({ id: booking.id, status })}
                >
                  <SelectTrigger className="w-36">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {STATUSES.map((status) => (
                      <SelectItem key={status} value={status}>
                        {status}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            <dl className="mt-4 grid gap-3 text-sm sm:grid-cols-2">
              <div>
                <dt className="text-xs tracking-wide uppercase text-muted-foreground">Pick-up</dt>
                <dd className="text-foreground">
                  {booking.pickup_address}
                  {booking.pickup_floor ? ` — ${booking.pickup_floor}` : ""}
                </dd>
              </div>
              <div>
                <dt className="text-xs tracking-wide uppercase text-muted-foreground">Destination</dt>
                <dd className="text-foreground">
                  {booking.destination_address}
                  {booking.destination_floor ? ` — ${booking.destination_floor}` : ""}
                </dd>
              </div>
              <div>
                <dt className="text-xs tracking-wide uppercase text-muted-foreground">Schedule</dt>
                <dd className="text-foreground">
                  {[booking.moving_date ?? "No date", booking.arrival_window].filter(Boolean).join(" · ")}
                </dd>
              </div>
              <div>
                <dt className="text-xs tracking-wide uppercase text-muted-foreground">Submitted</dt>
                <dd className="text-foreground">
                  {new Date(booking.created_at).toLocaleString("en-NG")}
                </dd>
              </div>
              <div>
                <dt className="text-xs tracking-wide uppercase text-muted-foreground">Estimate</dt>
                <dd className="text-foreground">
                  {booking.estimate_min && booking.estimate_max
                    ? `${naira(Number(booking.estimate_min))} – ${naira(Number(booking.estimate_max))}`
                    : "Not calculated"}
                </dd>
              </div>
              <div>
                <dt className="text-xs tracking-wide uppercase text-muted-foreground">Deposit</dt>
                <dd className="text-foreground">
                  {booking.deposit_amount ? naira(Number(booking.deposit_amount)) : "—"} ·{" "}
                  {booking.payment_status}
                </dd>
              </div>
              {booking.notes ? (
                <div className="sm:col-span-2">
                  <dt className="text-xs tracking-wide uppercase text-muted-foreground">Notes</dt>
                  <dd className="text-foreground">{booking.notes}</dd>
                </div>
              ) : null}
            </dl>

            {booking.photo_paths.length ? (
              <div className="mt-4 flex flex-wrap gap-2">
                {booking.photo_paths.map((path, index) => (
                  <Button
                    key={path}
                    size="sm"
                    variant="outline"
                    className="rounded-full"
                    onClick={() => void openPhoto(path)}
                  >
                    Photo {index + 1}
                  </Button>
                ))}
              </div>
            ) : null}
          </article>
        ))}
      </div>
    </section>
  );
}
