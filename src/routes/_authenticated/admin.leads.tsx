import { createFileRoute } from "@tanstack/react-router";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useState } from "react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { supabase } from "@/integrations/supabase/client";

const STATUSES = ["Pending", "Contacted", "Quoted", "Won", "Lost"] as const;

type Lead = {
  id: string;
  full_name: string;
  email: string;
  phone: string;
  pickup_address: string;
  destination_address: string;
  pickup_floor: string | null;
  destination_floor: string | null;
  moving_date: string | null;
  status: string;
  created_at: string;
};

export const Route = createFileRoute("/_authenticated/admin/leads")({
  head: () => ({
    meta: [
      { title: "Lead inquiries | Packmyload admin" },
      {
        name: "description",
        content: "Internal dashboard to review and update Packmyload moving lead inquiries.",
      },
      { property: "og:title", content: "Lead inquiries | Packmyload admin" },
      {
        property: "og:description",
        content: "Internal dashboard for Packmyload moving lead inquiries.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary" },
      { name: "robots", content: "noindex" },
    ],
  }),
  component: LeadsAdmin,
});

function LeadsAdmin() {
  const queryClient = useQueryClient();
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [search, setSearch] = useState("");

  const leadsQuery = useQuery({
    queryKey: ["lead_inquiries"],
    queryFn: async (): Promise<Lead[]> => {
      const { data, error } = await supabase
        .from("lead_inquiries")
        .select(
          "id, full_name, email, phone, pickup_address, destination_address, pickup_floor, destination_floor, moving_date, status, created_at",
        )
        .order("created_at", { ascending: false });
      if (error) throw error;
      return (data ?? []) as Lead[];
    },
  });

  const updateStatus = useMutation({
    mutationFn: async ({ id, status }: { id: string; status: string }) => {
      const { error } = await supabase.from("lead_inquiries").update({ status }).eq("id", id);
      if (error) throw error;
    },
    onSuccess: () => {
      toast.success("Status updated");
      void queryClient.invalidateQueries({ queryKey: ["lead_inquiries"] });
    },
    onError: () => toast.error("Couldn't update the status. Do you have admin access?"),
  });

  const leads = (leadsQuery.data ?? []).filter((lead) => {
    const matchesStatus = statusFilter === "all" || lead.status === statusFilter;
    const term = search.trim().toLowerCase();
    const matchesSearch =
      !term ||
      [lead.full_name, lead.email, lead.phone, lead.pickup_address, lead.destination_address]
        .join(" ")
        .toLowerCase()
        .includes(term);
    return matchesStatus && matchesSearch;
  });

  return (
    <section className="container-page py-10">
      <div>
        <h1 className="text-2xl font-semibold text-foreground sm:text-3xl">Lead inquiries</h1>
        <p className="mt-2 text-sm text-muted-foreground">
          Every request captured by the WhatsApp assistant. Update the status as your team works each
          lead.
        </p>
      </div>

      <div className="mt-6 flex flex-wrap gap-3">
        <Input
          value={search}
          onChange={(event) => setSearch(event.target.value)}
          placeholder="Search name, email, phone or address"
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
        {leadsQuery.isLoading ? (
          <p className="text-sm text-muted-foreground">Loading inquiries…</p>
        ) : null}
        {leadsQuery.isError ? (
          <p className="text-sm text-destructive">
            We couldn't load inquiries. Your account may not have admin access yet.
          </p>
        ) : null}
        {!leadsQuery.isLoading && !leadsQuery.isError && leads.length === 0 ? (
          <p className="text-sm text-muted-foreground">No inquiries match this view yet.</p>
        ) : null}

        {leads.map((lead) => (
          <article
            key={lead.id}
            className="rounded-2xl border border-border bg-card p-5 shadow-soft"
          >
            <div className="flex flex-wrap items-start justify-between gap-4">
              <div>
                <h2 className="text-lg font-semibold text-foreground">{lead.full_name}</h2>
                <p className="text-sm text-muted-foreground">
                  {lead.email} · {lead.phone}
                </p>
              </div>
              <div className="flex items-center gap-3">
                <Badge variant="secondary">{lead.status}</Badge>
                <Select
                  value={lead.status}
                  onValueChange={(status) => updateStatus.mutate({ id: lead.id, status })}
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
                  {lead.pickup_address}
                  {lead.pickup_floor ? ` — ${lead.pickup_floor}` : ""}
                </dd>
              </div>
              <div>
                <dt className="text-xs tracking-wide uppercase text-muted-foreground">
                  Destination
                </dt>
                <dd className="text-foreground">
                  {lead.destination_address}
                  {lead.destination_floor ? ` — ${lead.destination_floor}` : ""}
                </dd>
              </div>
              <div>
                <dt className="text-xs tracking-wide uppercase text-muted-foreground">
                  Preferred date
                </dt>
                <dd className="text-foreground">{lead.moving_date ?? "Not provided"}</dd>
              </div>
              <div>
                <dt className="text-xs tracking-wide uppercase text-muted-foreground">Received</dt>
                <dd className="text-foreground">
                  {new Date(lead.created_at).toLocaleString("en-NG")}
                </dd>
              </div>
            </dl>
          </article>
        ))}
      </div>
    </section>
  );
}
