import { useState } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { Loader2, Plus, Trash2 } from "lucide-react";
import { toast } from "sonner";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { Textarea } from "@/components/ui/textarea";
import { supabase } from "@/integrations/supabase/client";
import {
  ADMIN_ARTISAN_COLUMNS,
  RATE_UNITS,
  TRADES,
  rateLabel,
  type AdminArtisan,
} from "@/lib/artisans-data";

export const Route = createFileRoute("/_authenticated/admin/artisans")({
  head: () => ({
    meta: [
      { title: "Artisans | Packmyload admin" },
      {
        name: "description",
        content: "Internal dashboard to add and manage Packmyload Hub artisans and job requests.",
      },
      { property: "og:title", content: "Artisans | Packmyload admin" },
      { property: "og:description", content: "Manage the Packmyload Hub artisan directory." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary" },
      { name: "robots", content: "noindex" },
    ],
  }),
  component: ArtisansAdmin,
});

type Draft = {
  full_name: string;
  trade: string;
  phone: string;
  whatsapp: string;
  service_areas: string;
  bio: string;
  rate_min: string;
  rate_max: string;
  rate_unit: string;
  photo_url: string;
  is_verified: boolean;
  is_active: boolean;
};

const emptyDraft: Draft = {
  full_name: "",
  trade: TRADES[0],
  phone: "",
  whatsapp: "",
  service_areas: "",
  bio: "",
  rate_min: "",
  rate_max: "",
  rate_unit: RATE_UNITS[0],
  photo_url: "",
  is_verified: true,
  is_active: true,
};

type ArtisanRequest = {
  id: string;
  trade: string;
  full_name: string;
  phone: string;
  email: string | null;
  address: string | null;
  details: string | null;
  preferred_date: string | null;
  status: string;
  created_at: string;
};

const REQUEST_STATUSES = ["Pending", "Assigned", "Completed", "Cancelled"] as const;

function ArtisansAdmin() {
  const queryClient = useQueryClient();
  const [draft, setDraft] = useState<Draft>(emptyDraft);

  const artisansQuery = useQuery({
    queryKey: ["artisans", "admin"],
    queryFn: async (): Promise<AdminArtisan[]> => {
      const { data, error } = await supabase
        .from("artisans")
        .select(ADMIN_ARTISAN_COLUMNS)
        .order("created_at", { ascending: false });
      if (error) throw error;
      return (data ?? []) as AdminArtisan[];
    },
  });

  const requestsQuery = useQuery({
    queryKey: ["artisan_requests"],
    queryFn: async (): Promise<ArtisanRequest[]> => {
      const { data, error } = await supabase
        .from("artisan_requests")
        .select(
          "id, trade, full_name, phone, email, address, details, preferred_date, status, created_at",
        )
        .order("created_at", { ascending: false });
      if (error) throw error;
      return (data ?? []) as ArtisanRequest[];
    },
  });

  const refresh = () => {
    void queryClient.invalidateQueries({ queryKey: ["artisans"] });
  };

  const addArtisan = useMutation({
    mutationFn: async () => {
      const { error } = await supabase.from("artisans").insert({
        full_name: draft.full_name.trim(),
        trade: draft.trade,
        phone: draft.phone.trim(),
        whatsapp: draft.whatsapp.trim() || null,
        service_areas: draft.service_areas
          .split(",")
          .map((area) => area.trim())
          .filter(Boolean),
        bio: draft.bio.trim() || null,
        rate_min: draft.rate_min ? Number(draft.rate_min) : null,
        rate_max: draft.rate_max ? Number(draft.rate_max) : null,
        rate_unit: draft.rate_unit,
        photo_url: draft.photo_url.trim() || null,
        is_verified: draft.is_verified,
        is_active: draft.is_active,
      });
      if (error) throw error;
    },
    onSuccess: () => {
      toast.success("Artisan added");
      setDraft(emptyDraft);
      refresh();
    },
    onError: () => toast.error("Couldn't add the artisan. Do you have admin access?"),
  });

  const toggle = useMutation({
    mutationFn: async ({
      id,
      patch,
    }: {
      id: string;
      patch: Partial<Pick<AdminArtisan, "is_active" | "is_verified">>;
    }) => {
      const { error } = await supabase.from("artisans").update(patch).eq("id", id);
      if (error) throw error;
    },
    onSuccess: refresh,
    onError: () => toast.error("Couldn't update the artisan."),
  });

  const remove = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase.from("artisans").delete().eq("id", id);
      if (error) throw error;
    },
    onSuccess: () => {
      toast.success("Artisan removed");
      refresh();
    },
    onError: () => toast.error("Couldn't remove the artisan."),
  });

  const setRequestStatus = useMutation({
    mutationFn: async ({ id, status }: { id: string; status: string }) => {
      const { error } = await supabase.from("artisan_requests").update({ status }).eq("id", id);
      if (error) throw error;
    },
    onSuccess: () => {
      toast.success("Request updated");
      void queryClient.invalidateQueries({ queryKey: ["artisan_requests"] });
    },
    onError: () => toast.error("Couldn't update the request."),
  });

  const submit = (event: React.FormEvent) => {
    event.preventDefault();
    if (!draft.full_name.trim() || !draft.phone.trim()) {
      toast.error("Name and phone number are required.");
      return;
    }
    addArtisan.mutate();
  };

  const artisans = artisansQuery.data ?? [];
  const requests = requestsQuery.data ?? [];

  return (
    <section className="container-page py-10">
      <div>
        <h1 className="text-2xl font-semibold text-foreground sm:text-3xl">Hub artisans</h1>
        <p className="mt-2 text-sm text-muted-foreground">
          Add artisans to the public marketplace and handle the job requests customers send in.
        </p>
      </div>

      <form
        onSubmit={submit}
        className="mt-8 rounded-3xl border border-border bg-card p-5 shadow-soft sm:p-6"
      >
        <h2 className="text-lg font-semibold">Add an artisan</h2>
        <div className="mt-5 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          <div>
            <Label htmlFor="artisan-full-name">Full name</Label>
            <Input
              id="artisan-full-name"
              value={draft.full_name}
              onChange={(event) => setDraft({ ...draft, full_name: event.target.value })}
              className="mt-2 h-11 rounded-xl"
            />
          </div>
          <div>
            <Label htmlFor="artisan-trade-select">Trade</Label>
            <Select value={draft.trade} onValueChange={(trade) => setDraft({ ...draft, trade })}>
              <SelectTrigger id="artisan-trade-select" className="mt-2 h-11 rounded-xl">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {TRADES.map((trade) => (
                  <SelectItem key={trade} value={trade}>
                    {trade}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div>
            <Label htmlFor="artisan-phone-input">Phone</Label>
            <Input
              id="artisan-phone-input"
              type="tel"
              value={draft.phone}
              onChange={(event) => setDraft({ ...draft, phone: event.target.value })}
              className="mt-2 h-11 rounded-xl"
            />
          </div>
          <div>
            <Label htmlFor="artisan-whatsapp">WhatsApp (optional)</Label>
            <Input
              id="artisan-whatsapp"
              value={draft.whatsapp}
              onChange={(event) => setDraft({ ...draft, whatsapp: event.target.value })}
              placeholder="2348012345678"
              className="mt-2 h-11 rounded-xl"
            />
          </div>
          <div>
            <Label htmlFor="artisan-areas">Service areas (comma separated)</Label>
            <Input
              id="artisan-areas"
              value={draft.service_areas}
              onChange={(event) => setDraft({ ...draft, service_areas: event.target.value })}
              placeholder="Lekki, Ikoyi, Yaba"
              className="mt-2 h-11 rounded-xl"
            />
          </div>
          <div>
            <Label htmlFor="artisan-photo">Photo URL (optional)</Label>
            <Input
              id="artisan-photo"
              value={draft.photo_url}
              onChange={(event) => setDraft({ ...draft, photo_url: event.target.value })}
              className="mt-2 h-11 rounded-xl"
            />
          </div>
          <div>
            <Label htmlFor="artisan-rate-min">Rate from (₦)</Label>
            <Input
              id="artisan-rate-min"
              type="number"
              min="0"
              value={draft.rate_min}
              onChange={(event) => setDraft({ ...draft, rate_min: event.target.value })}
              className="mt-2 h-11 rounded-xl"
            />
          </div>
          <div>
            <Label htmlFor="artisan-rate-max">Rate to (₦)</Label>
            <Input
              id="artisan-rate-max"
              type="number"
              min="0"
              value={draft.rate_max}
              onChange={(event) => setDraft({ ...draft, rate_max: event.target.value })}
              className="mt-2 h-11 rounded-xl"
            />
          </div>
          <div>
            <Label htmlFor="artisan-rate-unit">Rate unit</Label>
            <Select
              value={draft.rate_unit}
              onValueChange={(rate_unit) => setDraft({ ...draft, rate_unit })}
            >
              <SelectTrigger id="artisan-rate-unit" className="mt-2 h-11 rounded-xl">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {RATE_UNITS.map((unit) => (
                  <SelectItem key={unit} value={unit}>
                    {unit}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>

        <div className="mt-4">
          <Label htmlFor="artisan-bio">Short bio</Label>
          <Textarea
            id="artisan-bio"
            value={draft.bio}
            onChange={(event) => setDraft({ ...draft, bio: event.target.value })}
            placeholder="Experience, specialities, languages, tools they bring."
            className="mt-2 min-h-24"
          />
        </div>

        <div className="mt-5 flex flex-wrap items-center gap-6">
          <label className="flex items-center gap-3 text-sm font-medium">
            <Switch
              checked={draft.is_verified}
              onCheckedChange={(is_verified) => setDraft({ ...draft, is_verified })}
            />
            Packmyload verified
          </label>
          <label className="flex items-center gap-3 text-sm font-medium">
            <Switch
              checked={draft.is_active}
              onCheckedChange={(is_active) => setDraft({ ...draft, is_active })}
            />
            Live on the marketplace
          </label>
          <Button
            type="submit"
            disabled={addArtisan.isPending}
            className="w-full rounded-full bg-cta text-cta-foreground hover:bg-cta/90 sm:w-auto"
          >
            {addArtisan.isPending ? (
              <Loader2 className="size-4 animate-spin" aria-hidden="true" />
            ) : (
              <Plus className="size-4" aria-hidden="true" />
            )}
            Add artisan
          </Button>
        </div>
      </form>

      <h2 className="mt-12 text-lg font-semibold">Directory ({artisans.length})</h2>
      {artisansQuery.isError ? (
        <p className="mt-3 text-sm text-destructive">
          We couldn't load artisans. Your account may not have admin access yet.
        </p>
      ) : null}
      <div className="mt-4 space-y-3">
        {artisans.map((artisan) => (
          <article
            key={artisan.id}
            className="rounded-2xl border border-border bg-card p-5 shadow-soft"
          >
            <div className="grid gap-4 sm:grid-cols-[minmax(0,1fr)_auto] sm:items-start">
              <div className="min-w-0">
                <div className="flex flex-wrap items-center gap-2">
                  <h3 className="text-base font-semibold">{artisan.full_name}</h3>
                  <Badge variant="secondary">{artisan.trade}</Badge>
                  {artisan.is_verified ? <Badge>Verified</Badge> : null}
                  {!artisan.is_active ? <Badge variant="outline">Hidden</Badge> : null}
                </div>
                <p className="mt-1 text-sm text-muted-foreground">
                  {artisan.phone}
                  {artisan.whatsapp ? ` · WhatsApp ${artisan.whatsapp}` : ""}
                </p>
                {artisan.service_areas.length ? (
                  <p className="mt-1 text-sm text-muted-foreground">
                    {artisan.service_areas.join(", ")}
                  </p>
                ) : null}
                <p className="mt-1 text-sm font-medium">{rateLabel(artisan)}</p>
              </div>
              <div className="flex flex-wrap items-center gap-4">
                <label className="flex items-center gap-2 text-xs font-semibold uppercase">
                  <Switch
                    checked={artisan.is_active}
                    onCheckedChange={(is_active) =>
                      toggle.mutate({ id: artisan.id, patch: { is_active } })
                    }
                    aria-label={`Show ${artisan.full_name} on the marketplace`}
                  />
                  Live
                </label>
                <label className="flex items-center gap-2 text-xs font-semibold uppercase">
                  <Switch
                    checked={artisan.is_verified}
                    onCheckedChange={(is_verified) =>
                      toggle.mutate({ id: artisan.id, patch: { is_verified } })
                    }
                    aria-label={`Mark ${artisan.full_name} as verified`}
                  />
                  Verified
                </label>
                <Button
                  variant="ghost"
                  size="sm"
                  className="rounded-full text-destructive"
                  onClick={() => remove.mutate(artisan.id)}
                  aria-label={`Remove ${artisan.full_name}`}
                >
                  <Trash2 className="size-4" aria-hidden="true" />
                  Remove
                </Button>
              </div>
            </div>
          </article>
        ))}
        {!artisansQuery.isLoading && artisans.length === 0 ? (
          <p className="text-sm text-muted-foreground">No artisans yet — add your first above.</p>
        ) : null}
      </div>

      <h2 className="mt-12 text-lg font-semibold">Job requests ({requests.length})</h2>
      <div className="mt-4 space-y-3">
        {requests.map((request) => (
          <article
            key={request.id}
            className="rounded-2xl border border-border bg-card p-5 shadow-soft"
          >
            <div className="grid gap-4 sm:grid-cols-[minmax(0,1fr)_auto] sm:items-start">
              <div className="min-w-0">
                <div className="flex flex-wrap items-center gap-2">
                  <h3 className="text-base font-semibold">{request.full_name}</h3>
                  <Badge variant="secondary">{request.trade}</Badge>
                </div>
                <p className="mt-1 text-sm text-muted-foreground">
                  {request.phone}
                  {request.email ? ` · ${request.email}` : ""}
                </p>
                {request.address ? <p className="mt-1 text-sm">{request.address}</p> : null}
                {request.details ? (
                  <p className="mt-1 text-sm text-muted-foreground">{request.details}</p>
                ) : null}
                <p className="mt-1 text-xs text-muted-foreground">
                  {request.preferred_date ? `Preferred ${request.preferred_date} · ` : ""}
                  {new Date(request.created_at).toLocaleString("en-NG")}
                </p>
              </div>
              <Select
                value={request.status}
                onValueChange={(status) => setRequestStatus.mutate({ id: request.id, status })}
              >
                <SelectTrigger className="w-40" aria-label={`Status for ${request.full_name}`}>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {REQUEST_STATUSES.map((status) => (
                    <SelectItem key={status} value={status}>
                      {status}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </article>
        ))}
        {!requestsQuery.isLoading && requests.length === 0 ? (
          <p className="text-sm text-muted-foreground">No artisan requests yet.</p>
        ) : null}
      </div>
    </section>
  );
}
