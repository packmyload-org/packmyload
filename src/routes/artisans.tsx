import { useMemo, useState } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { BadgeCheck, Loader2, MapPin, Search, Wrench } from "lucide-react";
import { toast } from "sonner";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { CtaBand } from "@/components/site/CtaBand";
import { PageHero } from "@/components/site/PageHero";
import { Reveal } from "@/components/site/Reveal";
import { SectionHeading } from "@/components/site/SectionHeading";
import { supabase } from "@/integrations/supabase/client";
import { PUBLIC_ARTISAN_COLUMNS, TRADES, rateLabel, type Artisan } from "@/lib/artisans-data";
import { todayISO } from "@/lib/booking-rules";
import { IMG, SITE_URL, abs } from "@/lib/site-data";

const title = "Vetted Artisans in Lagos & Abuja | Packmyload Hub";
const description =
  "Packmyload Hub connects you with vetted electricians, plumbers, painters, cleaners and AC technicians in Lagos and Abuja. Tell us the job and we match you with the right artisan.";
const heroImage = `${IMG}/images/packman.webp`;

export const Route = createFileRoute("/artisans")({
  head: () => ({
    meta: [
      { title },
      { name: "description", content: description },
      { property: "og:title", content: title },
      { property: "og:description", content: description },
      { property: "og:image", content: abs(heroImage) },
      { name: "twitter:image", content: abs(heroImage) },
      { property: "og:type", content: "website" },
      { property: "og:url", content: `${SITE_URL}/artisans` },
      { name: "twitter:card", content: "summary_large_image" },
      { name: "twitter:title", content: title },
      { name: "twitter:description", content: description },
    ],
    links: [{ rel: "canonical", href: `${SITE_URL}/artisans` }],
  }),
  component: ArtisansPage,
});

type RequestForm = {
  full_name: string;
  phone: string;
  email: string;
  address: string;
  details: string;
  preferred_date: string;
};

const emptyForm: RequestForm = {
  full_name: "",
  phone: "",
  email: "",
  address: "",
  details: "",
  preferred_date: "",
};

function ArtisansPage() {
  const [trade, setTrade] = useState("all");
  const [search, setSearch] = useState("");
  const [target, setTarget] = useState<Artisan | null>(null);
  const [openTrade, setOpenTrade] = useState<string | null>(null);
  const [form, setForm] = useState<RequestForm>(emptyForm);
  const [sending, setSending] = useState(false);
  const minDate = useMemo(() => todayISO(), []);

  const artisansQuery = useQuery({
    queryKey: ["artisans", "public"],
    queryFn: async (): Promise<Artisan[]> => {
      const { data, error } = await supabase
        .from("artisans")
        .select(PUBLIC_ARTISAN_COLUMNS)
        .eq("is_active", true)
        .order("is_verified", { ascending: false })
        .order("full_name", { ascending: true });
      if (error) throw error;
      return (data ?? []) as Artisan[];
    },
  });

  const artisans = (artisansQuery.data ?? []).filter((artisan) => {
    const matchesTrade = trade === "all" || artisan.trade === trade;
    const term = search.trim().toLowerCase();
    const matchesSearch =
      !term ||
      [artisan.full_name, artisan.trade, artisan.bio ?? "", artisan.service_areas.join(" ")]
        .join(" ")
        .toLowerCase()
        .includes(term);
    return matchesTrade && matchesSearch;
  });

  const dialogOpen = Boolean(target || openTrade);
  const requestedTrade = target?.trade ?? openTrade ?? "";

  const closeDialog = () => {
    setTarget(null);
    setOpenTrade(null);
    setForm(emptyForm);
  };

  const submit = async (event: React.FormEvent) => {
    event.preventDefault();
    if (!form.full_name.trim() || !form.phone.trim()) {
      toast.error("Please add your name and phone number.");
      return;
    }
    setSending(true);
    const { error } = await supabase.from("artisan_requests").insert({
      artisan_id: target?.id ?? null,
      trade: requestedTrade,
      full_name: form.full_name.trim(),
      phone: form.phone.trim(),
      email: form.email.trim() || null,
      address: form.address.trim() || null,
      details: form.details.trim() || null,
      preferred_date: form.preferred_date || null,
    });
    setSending(false);
    if (error) {
      toast.error("We couldn't send your request", { description: "Please try again or call us." });
      return;
    }
    toast.success("Request received", {
      description: "A Packmyload coordinator will call you to confirm the job and the artisan.",
    });
    closeDialog();
  };

  return (
    <>
      <PageHero
        eyebrow="Packmyload Hub"
        title="Vetted artisans for your new home"
        body="Electricians, plumbers, painters, cleaners and technicians we already work with on moves. Pick a trade and we'll match you with the right hand — you deal with Packmyload, not strangers."
      >
        <Button
          size="lg"
          className="mt-2 rounded-full bg-cta text-cta-foreground hover:bg-cta/90"
          onClick={() => setOpenTrade(TRADES[0])}
        >
          Request an artisan
        </Button>
      </PageHero>

      <section className="container-page py-16 sm:py-24">
        <SectionHeading
          eyebrow="Marketplace"
          title="Browse the artisan directory"
          body="Every artisan is interviewed, address-verified and rated after each job."
        />

        <div className="mt-8 grid gap-3 sm:grid-cols-[minmax(0,1fr)_14rem]">
          <div className="relative">
            <Search
              className="pointer-events-none absolute top-1/2 left-3 size-4 -translate-y-1/2 text-muted-foreground"
              aria-hidden="true"
            />
            <Input
              value={search}
              onChange={(event) => setSearch(event.target.value)}
              placeholder="Search a trade, area or name"
              aria-label="Search artisans"
              className="h-11 rounded-full pl-9"
            />
          </div>
          <Select value={trade} onValueChange={setTrade}>
            <SelectTrigger className="h-11 rounded-full" aria-label="Filter by trade">
              <SelectValue placeholder="All trades" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All trades</SelectItem>
              {TRADES.map((item) => (
                <SelectItem key={item} value={item}>
                  {item}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {artisansQuery.isLoading ? (
          <div
            className="mt-10 grid gap-5 sm:grid-cols-2 lg:grid-cols-3"
            aria-busy="true"
            aria-label="Loading artisans"
          >
            {Array.from({ length: 6 }).map((_, index) => (
              <div
                key={index}
                className="flex flex-col rounded-3xl border border-border bg-card p-5 shadow-soft"
              >
                <div className="grid grid-cols-[auto_minmax(0,1fr)] items-center gap-3">
                  <Skeleton className="size-12 rounded-2xl" />
                  <div className="min-w-0 space-y-2">
                    <Skeleton className="h-4 w-2/3" />
                    <Skeleton className="h-3 w-1/3" />
                  </div>
                </div>
                <Skeleton className="mt-4 h-5 w-40 rounded-full" />
                <div className="mt-3 space-y-2">
                  <Skeleton className="h-3 w-full" />
                  <Skeleton className="h-3 w-11/12" />
                  <Skeleton className="h-3 w-3/5" />
                </div>
                <Skeleton className="mt-3 h-3 w-2/3" />
                <Skeleton className="mt-4 h-4 w-32" />
                <Skeleton className="mt-5 h-10 w-full rounded-full" />
              </div>
            ))}
          </div>
        ) : null}

        {!artisansQuery.isLoading && artisans.length === 0 ? (
          <div className="mt-10 rounded-3xl border border-dashed border-border bg-surface p-8 text-center">
            <p className="text-sm font-semibold">No listings match this view yet.</p>
            <p className="mt-2 text-sm text-muted-foreground">
              Tell us the job you need done and we'll assign a vetted artisan from our network.
            </p>
            <Button
              className="mt-5 rounded-full bg-cta text-cta-foreground hover:bg-cta/90"
              onClick={() => setOpenTrade(trade === "all" ? TRADES[0] : trade)}
            >
              Request an artisan
            </Button>
          </div>
        ) : null}

        <div className="mt-10 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {artisans.map((artisan, index) => (
            <Reveal
              key={artisan.id}
              delay={(index % 3) * 70}
              className="flex flex-col rounded-3xl border border-border bg-card p-5 shadow-soft"
            >
              <div className="grid grid-cols-[auto_minmax(0,1fr)] items-center gap-3">
                <span className="grid size-12 shrink-0 place-items-center overflow-hidden rounded-2xl bg-accent-soft">
                  {artisan.photo_url ? (
                    <img
                      src={artisan.photo_url}
                      alt={`${artisan.full_name}, ${artisan.trade} on Packmyload Hub`}
                      width={96}
                      height={96}
                      loading="lazy"
                      className="size-full object-cover"
                    />
                  ) : (
                    <Wrench className="size-5 text-accent-foreground" aria-hidden="true" />
                  )}
                </span>
                <div className="min-w-0">
                  <h3 className="truncate text-base font-semibold">{artisan.full_name}</h3>
                  <p className="truncate text-sm text-muted-foreground">{artisan.trade}</p>
                </div>
              </div>

              {artisan.is_verified ? (
                <Badge variant="secondary" className="mt-4 w-fit gap-1">
                  <BadgeCheck className="size-3.5" aria-hidden="true" />
                  Packmyload verified
                </Badge>
              ) : null}

              {artisan.bio ? (
                <p className="mt-3 line-clamp-3 text-sm text-muted-foreground">{artisan.bio}</p>
              ) : null}

              {artisan.service_areas.length ? (
                <p className="mt-3 flex items-start gap-2 text-sm text-muted-foreground">
                  <MapPin className="mt-0.5 size-4 shrink-0 text-accent" aria-hidden="true" />
                  <span className="min-w-0">{artisan.service_areas.join(", ")}</span>
                </p>
              ) : null}

              <p className="mt-4 text-sm font-semibold">{rateLabel(artisan)}</p>

              <Button
                className="mt-5 w-full rounded-full bg-cta text-cta-foreground hover:bg-cta/90"
                onClick={() => setTarget(artisan)}
              >
                Request this artisan
              </Button>
            </Reveal>
          ))}
        </div>
      </section>

      <Dialog open={dialogOpen} onOpenChange={(open) => (open ? null : closeDialog())}>
        <DialogContent className="max-h-[90vh] overflow-y-auto sm:max-w-lg">
          <DialogHeader>
            <DialogTitle>
              {target ? `Request ${target.full_name}` : "Request an artisan"}
            </DialogTitle>
            <DialogDescription>
              Share your details and a Packmyload coordinator will confirm availability and price
              before any visit.
            </DialogDescription>
          </DialogHeader>
          <form onSubmit={(event) => void submit(event)} className="grid gap-4">
            {!target ? (
              <div>
                <Label htmlFor="artisan-trade">Trade needed</Label>
                <Select value={openTrade ?? ""} onValueChange={setOpenTrade}>
                  <SelectTrigger id="artisan-trade" className="mt-2 h-11 rounded-xl">
                    <SelectValue placeholder="Choose a trade" />
                  </SelectTrigger>
                  <SelectContent>
                    {TRADES.map((item) => (
                      <SelectItem key={item} value={item}>
                        {item}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            ) : null}
            <div className="grid gap-4 sm:grid-cols-2">
              <div>
                <Label htmlFor="artisan-name">Full name</Label>
                <Input
                  id="artisan-name"
                  value={form.full_name}
                  onChange={(event) => setForm({ ...form, full_name: event.target.value })}
                  className="mt-2 h-11 rounded-xl"
                />
              </div>
              <div>
                <Label htmlFor="artisan-phone">Phone</Label>
                <Input
                  id="artisan-phone"
                  type="tel"
                  value={form.phone}
                  onChange={(event) => setForm({ ...form, phone: event.target.value })}
                  className="mt-2 h-11 rounded-xl"
                />
              </div>
              <div>
                <Label htmlFor="artisan-email">Email (optional)</Label>
                <Input
                  id="artisan-email"
                  type="email"
                  value={form.email}
                  onChange={(event) => setForm({ ...form, email: event.target.value })}
                  className="mt-2 h-11 rounded-xl"
                />
              </div>
              <div>
                <Label htmlFor="artisan-date">Preferred date (optional)</Label>
                <Input
                  id="artisan-date"
                  type="date"
                  min={minDate}
                  value={form.preferred_date}
                  onChange={(event) => setForm({ ...form, preferred_date: event.target.value })}
                  className="mt-2 h-11 rounded-xl"
                />
              </div>
            </div>
            <div>
              <Label htmlFor="artisan-address">Address</Label>
              <Input
                id="artisan-address"
                value={form.address}
                onChange={(event) => setForm({ ...form, address: event.target.value })}
                placeholder="e.g. 12 Admiralty Way, Lekki"
                className="mt-2 h-11 rounded-xl"
              />
            </div>
            <div>
              <Label htmlFor="artisan-details">What needs doing?</Label>
              <Textarea
                id="artisan-details"
                value={form.details}
                onChange={(event) => setForm({ ...form, details: event.target.value })}
                placeholder="Describe the job, and mention anything we should bring."
                className="mt-2 min-h-24"
              />
            </div>
            <DialogFooter className="flex-col-reverse gap-2 sm:flex-row">
              <Button
                type="button"
                variant="ghost"
                className="w-full rounded-full sm:w-auto"
                onClick={closeDialog}
              >
                Cancel
              </Button>
              <Button
                type="submit"
                disabled={sending}
                className="w-full rounded-full bg-cta text-cta-foreground hover:bg-cta/90 sm:w-auto"
              >
                {sending ? <Loader2 className="size-4 animate-spin" aria-hidden="true" /> : null}
                Send request
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      <CtaBand
        title="Moving and need the house ready?"
        body="Book your move and we'll line up the artisans for the same week."
      />
    </>
  );
}
