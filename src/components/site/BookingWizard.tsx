import { useEffect, useMemo, useRef, useState } from "react";
import { useServerFn } from "@tanstack/react-start";
import {
  ArrowLeft,
  ArrowRight,
  CalendarDays,
  Camera,
  Check,
  ClipboardList,
  CreditCard,
  MapPin,
  ImagePlus,
  Loader2,
  PartyPopper,
  Send,
  User,
  X,
} from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { AddressField } from "@/components/site/AddressField";
import { supabase } from "@/integrations/supabase/client";
import { notifyBooking, startDepositPayment } from "@/lib/booking.functions";
import { ruleFor, todayISO } from "@/lib/booking-rules";
import { estimateMove, naira, type Estimate } from "@/lib/quote";
import { services } from "@/lib/site-data";
import { cn } from "@/lib/utils";

type Booking = {
  service: string;
  size: string;
  distance: string;
  from: string;
  to: string;
  fromFloor: string;
  toFloor: string;
  date: string;
  window: string;
  name: string;
  phone: string;
  email: string;
  notes: string;
};

const empty: Booking = {
  service: "",
  size: "",
  distance: "",
  from: "",
  to: "",
  fromFloor: "",
  toFloor: "",
  date: "",
  window: "",
  name: "",
  phone: "",
  email: "",
  notes: "",
};

const sizes = [
  "A few items only",
  "Studio / single room",
  "2 – 3 bedrooms",
  "4+ bedrooms",
  "Office / commercial",
];

const distances = ["Within the same state", "Interstate (state to state)"];

const floors = [
  "Ground floor",
  "1st floor",
  "2nd floor",
  "3rd floor or higher",
  "Lift / elevator available",
];

const MAX_PHOTOS = 8;
const MAX_PHOTO_BYTES = 8 * 1024 * 1024;

const windows = ["Morning (8am – 11am)", "Midday (11am – 2pm)", "Afternoon (2pm – 5pm)", "Flexible"];

type StepKey = "service" | "photos" | "route" | "schedule" | "contact";

const meta: Record<StepKey, { label: string; Icon: typeof User }> = {
  service: { label: "Service", Icon: ClipboardList },
  photos: { label: "Photos", Icon: Camera },
  route: { label: "Route", Icon: MapPin },
  schedule: { label: "Schedule", Icon: CalendarDays },
  contact: { label: "Details", Icon: User },
};

const addressFieldClass =
  "rounded-xl border border-border bg-card px-4 py-2.5 md:rounded-xl focus-within:border-accent";

export function BookingWizard() {
  const [step, setStep] = useState(0);
  const [data, setData] = useState<Booking>(empty);
  const [quick, setQuick] = useState(false);
  const [done, setDone] = useState(false);
  const [photos, setPhotos] = useState<File[]>([]);
  const [previews, setPreviews] = useState<string[]>([]);
  const [submitting, setSubmitting] = useState(false);
  const [paying, setPaying] = useState(false);
  const [reference, setReference] = useState("");
  const fileInput = useRef<HTMLInputElement>(null);
  const notify = useServerFn(notifyBooking);
  const startPayment = useServerFn(startDepositPayment);
  const minDate = useMemo(() => todayISO(), []);

  const rule = ruleFor(data.service);
  const flow: StepKey[] = quick
    ? ["service", "photos", "contact"]
    : ["service", "photos", "route", "schedule", "contact"];
  const current = flow[Math.min(step, flow.length - 1)] as StepKey;
  const isLast = step === flow.length - 1;

  const interstate = Boolean(
    rule.alwaysInterstate || data.distance === "Interstate (state to state)",
  );
  const estimate: Estimate | null = data.service
    ? estimateMove({ service: data.service, size: data.size || undefined, interstate })
    : null;

  useEffect(() => {
    const urls = photos.map((file) => URL.createObjectURL(file));
    setPreviews(urls);
    return () => urls.forEach((url) => URL.revokeObjectURL(url));
  }, [photos]);

  useEffect(() => {
    try {
      const stored = window.sessionStorage.getItem("packmyload:quote-draft");
      if (!stored) return;
      const draft = JSON.parse(stored) as Partial<Pick<Booking, "from" | "to" | "date">>;
      setData((prev) => ({
        ...prev,
        from: draft.from ?? prev.from,
        to: draft.to ?? prev.to,
        date: draft.date ?? prev.date,
      }));
    } catch {
      /* ignore unavailable storage */
    }
  }, []);

  const set = <K extends keyof Booking>(key: K, value: Booking[K]) =>
    setData((prev) => ({ ...prev, [key]: value }));

  const addPhotos = (incoming: FileList | null) => {
    if (!incoming) return;
    const picked = Array.from(incoming).filter((file) => {
      if (!file.type.startsWith("image/")) {
        toast.error(`${file.name} is not an image.`);
        return false;
      }
      if (file.size > MAX_PHOTO_BYTES) {
        toast.error(`${file.name} is larger than 8MB.`);
        return false;
      }
      return true;
    });
    setPhotos((prev) => [...prev, ...picked].slice(0, MAX_PHOTOS));
    if (fileInput.current) fileInput.current.value = "";
  };

  const submit = async () => {
    setSubmitting(true);
    const ref = `PML-${Date.now().toString(36).toUpperCase()}`;
    try {
      const paths: string[] = [];
      for (const [index, file] of photos.entries()) {
        const ext = file.name.split(".").pop()?.toLowerCase() ?? "jpg";
        const path = `${ref}/${index + 1}.${ext}`;
        const { error } = await supabase.storage
          .from("booking-photos")
          .upload(path, file, { contentType: file.type, upsert: false });
        if (error) throw error;
        paths.push(path);
      }

      const { error } = await supabase.from("bookings").insert({
        reference: ref,
        service: data.service,
        move_size: data.size || null,
        pickup_address: data.from.trim(),
        destination_address: rule.needsDestination ? data.to.trim() || null : null,
        pickup_floor: data.fromFloor || null,
        destination_floor: rule.needsDestination ? data.toFloor || null : null,
        moving_date: data.date || null,
        arrival_window: data.window || null,
        full_name: data.name.trim(),
        phone: data.phone.trim(),
        email: data.email.trim() || null,
        notes: data.notes.trim() || null,
        photo_paths: paths,
        estimate_min: estimate?.min ?? null,
        estimate_max: estimate?.max ?? null,
        deposit_amount: estimate?.deposit ?? null,
        is_quick_request: quick,
      });
      if (error) throw error;

      setReference(ref);
      setDone(true);
      void notify({ data: { reference: ref } }).catch(() => undefined);
      toast.success(quick ? "Photos and details sent" : "Booking request received", {
        description: `Reference ${ref}`,
      });
    } catch (error) {
      console.error(error);
      toast.error("We couldn't submit your request", {
        description: "Please try again, or call us and we'll take the details over the phone.",
      });
    } finally {
      setSubmitting(false);
    }
  };

  const payDeposit = async () => {
    setPaying(true);
    try {
      const result = await startPayment({
        data: { reference, origin: window.location.origin },
      });
      if (!result.ok || !("authorizationUrl" in result)) {
        toast.error("Online payment isn't available yet", {
          description: "Your consultant will send you a payment link shortly.",
        });
        return;
      }
      window.open(result.authorizationUrl, "_blank", "noopener,noreferrer");
    } catch {
      toast.error("We couldn't start the payment. Please try again.");
    } finally {
      setPaying(false);
    }
  };

  const valid = useMemo(() => {
    if (current === "service") return Boolean(data.service && (!rule.needsSize || data.size));
    if (current === "photos") return true;
    if (current === "route")
      return Boolean(
        data.from.trim() &&
          (!rule.needsDestination || data.to.trim()) &&
          (!rule.needsDistance || data.distance),
      );
    if (current === "schedule") return Boolean(data.date && data.window);
    return Boolean(data.name.trim() && data.phone.trim() && (!quick || data.from.trim()));
  }, [current, data, rule, quick]);

  const next = () => {
    if (!valid) {
      toast.error("Please complete this step to continue.");
      return;
    }
    if (!isLast) {
      setStep(step + 1);
      return;
    }
    void submit();
  };

  const startQuick = () => {
    setQuick(true);
    setStep(2);
  };

  if (done) {
    return (
      <div className="mx-auto max-w-2xl rounded-4xl border border-border bg-card p-8 text-center shadow-lift sm:p-12">
        <span className="mx-auto flex size-14 items-center justify-center rounded-full bg-accent-soft">
          <PartyPopper className="size-6 text-accent-foreground" aria-hidden="true" />
        </span>
        <h2 className="mt-5 text-2xl font-semibold">
          {quick ? "Your details are with our team" : "Your move is booked in"}
        </h2>
        <p className="mt-2 text-sm font-semibold">Reference {reference}</p>
        <p className="mt-3 text-sm text-muted-foreground">
          A move consultant will call {data.phone} shortly to confirm your inventory, access details
          and final price. {data.email ? `A copy is on its way to ${data.email}.` : ""}
        </p>

        {estimate ? (
          <div className="mt-6 rounded-3xl bg-surface p-5 text-left text-sm">
            <p className="text-xs font-semibold tracking-wide uppercase text-muted-foreground">
              Indicative estimate
            </p>
            <p className="mt-1 text-2xl font-semibold">
              {naira(estimate.min)} – {naira(estimate.max)}
            </p>
            <p className="mt-1 text-xs text-muted-foreground">
              {estimate.basis} · excludes 7.5% VAT. Final price is confirmed after our survey.
            </p>
            <p className="mt-3 text-sm">
              Secure your slot with a {naira(estimate.deposit)} deposit.
            </p>
            <Button
              className="mt-3 rounded-full bg-accent text-accent-foreground hover:bg-accent/90"
              onClick={() => void payDeposit()}
              disabled={paying || !data.email.trim()}
            >
              {paying ? (
                <Loader2 className="size-4 animate-spin" aria-hidden="true" />
              ) : (
                <CreditCard className="size-4" aria-hidden="true" />
              )}
              Pay deposit securely
            </Button>
            {!data.email.trim() ? (
              <p className="mt-2 text-xs text-muted-foreground">
                Add an email address to pay online — otherwise we'll send you a payment link.
              </p>
            ) : null}
          </div>
        ) : null}

        <dl className="mt-8 grid gap-3 text-left text-sm">
          <Row label="Service" value={[data.service, data.size].filter(Boolean).join(" · ")} />
          <Row
            label={rule.needsDestination ? "Route" : "Address"}
            value={rule.needsDestination ? `${data.from} → ${data.to}` : data.from}
          />
          {data.date ? <Row label="Schedule" value={[data.date, data.window].filter(Boolean).join(" · ")} /> : null}
          <Row label="Contact" value={[data.name, data.phone, data.email].filter(Boolean).join(" · ")} />
          <Row label="Photos" value={photos.length ? `${photos.length} uploaded` : "None"} />
        </dl>
        <Button
          variant="outline"
          className="mt-8 rounded-full"
          onClick={() => {
            setData(empty);
            setPhotos([]);
            setReference("");
            setQuick(false);
            setStep(0);
            setDone(false);
          }}
        >
          Book another move
        </Button>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-3xl rounded-4xl border border-border bg-card p-6 shadow-lift sm:p-10">
      <ol className="flex items-center gap-1.5 sm:gap-2">
        {flow.map((key, index) => {
          const { label, Icon } = meta[key];
          const active = index === step;
          const complete = index < step;
          return (
            <li key={key} className="flex min-w-0 flex-1 items-center gap-1.5 last:flex-none sm:gap-2">
              <span
                className={cn(
                  "flex size-8 shrink-0 items-center justify-center rounded-full border text-xs font-semibold transition-colors sm:size-9",
                  complete && "border-accent bg-accent text-accent-foreground",
                  active && "border-accent bg-accent-soft text-accent-foreground",
                  !active && !complete && "border-border bg-secondary text-muted-foreground",
                )}
              >
                {complete ? (
                  <Check className="size-4" aria-hidden="true" />
                ) : (
                  <Icon className="size-4" aria-hidden="true" />
                )}
              </span>
              <span
                className={cn(
                  "hidden truncate text-xs font-semibold tracking-wide uppercase md:block",
                  active ? "text-foreground" : "text-muted-foreground",
                )}
              >
                {label}
              </span>
              {index < flow.length - 1 ? (
                <span
                  className={cn(
                    "h-px min-w-2 flex-1 transition-colors",
                    complete ? "bg-accent" : "bg-border",
                  )}
                />
              ) : null}
            </li>
          );
        })}
      </ol>
      <p className="mt-3 text-xs font-semibold tracking-wide uppercase text-muted-foreground md:hidden">
        Step {step + 1} of {flow.length} · {meta[current].label}
      </p>

      <div className="mt-8 min-h-[19rem]">
        {current === "service" ? (
          <div>
            <StepTitle title="What are we moving?" body="Pick the service closest to your move." />
            <div className="mt-5 grid gap-2 sm:grid-cols-2">
              {services.map((service) => (
                <Choice
                  key={service.title}
                  label={service.title}
                  selected={data.service === service.title}
                  onSelect={() => set("service", service.title)}
                />
              ))}
            </div>
            {data.service && rule.needsSize ? (
              <>
                <p className="mt-6 text-sm font-semibold">{rule.sizeLabel}</p>
                <div className="mt-2 flex flex-wrap gap-2">
                  {sizes.map((size) => (
                    <Choice
                      key={size}
                      label={size}
                      compact
                      selected={data.size === size}
                      onSelect={() => set("size", size)}
                    />
                  ))}
                </div>
              </>
            ) : null}
          </div>
        ) : null}

        {current === "photos" ? (
          <div>
            <StepTitle
              title="Show us what we're moving"
              body="Photos help us size the truck and crew, so your quote is accurate first time."
            />
            <input
              ref={fileInput}
              id="booking-photos"
              type="file"
              accept="image/*"
              multiple
              className="sr-only"
              onChange={(event) => addPhotos(event.target.files)}
            />
            <Button
              type="button"
              variant="outline"
              className="mt-5 rounded-full"
              onClick={() => fileInput.current?.click()}
            >
              <ImagePlus className="size-4" aria-hidden="true" />
              Add photos
            </Button>
            <p className="mt-2 text-xs text-muted-foreground">
              Up to {MAX_PHOTOS} images, 8MB each. Optional, but it speeds up your quote.
            </p>
            {photos.length ? (
              <ul className="mt-4 grid grid-cols-3 gap-3 sm:grid-cols-4">
                {photos.map((file, index) => (
                  <li key={`${file.name}-${index}`} className="relative">
                    <img
                      src={previews[index]}
                      alt={`Item photo ${index + 1} for your Packmyload move`}
                      width={160}
                      height={120}
                      className="aspect-4/3 w-full rounded-2xl border border-border object-cover"
                    />
                    <button
                      type="button"
                      aria-label={`Remove photo ${index + 1}`}
                      onClick={() => setPhotos((prev) => prev.filter((_, i) => i !== index))}
                      className="absolute -top-2 -right-2 flex size-6 items-center justify-center rounded-full border border-border bg-card shadow-soft"
                    >
                      <X className="size-3.5" aria-hidden="true" />
                    </button>
                  </li>
                ))}
              </ul>
            ) : null}

            <div className="mt-8 rounded-3xl border border-dashed border-border bg-surface p-5">
              <p className="text-sm font-semibold">In a hurry?</p>
              <p className="mt-1 text-sm text-muted-foreground">
                Skip the rest of the form. Send us your photos, address and phone number and an agent
                will price the move and call you back.
              </p>
              <Button
                type="button"
                variant="outline"
                className="mt-3 rounded-full"
                onClick={startQuick}
              >
                <Send className="size-4" aria-hidden="true" />
                Just send photos &amp; my details
              </Button>
            </div>
          </div>
        ) : null}

        {current === "route" ? (
          <div>
            <StepTitle
              title={rule.needsDestination ? "Where are we going?" : "Where are we working?"}
              body={
                rule.needsDestination
                  ? "Start typing and pick your address, drop a pin on the map, or use your location."
                  : "This service only needs one address. Start typing and pick your address."
              }
            />
            <div className={cn("mt-5 grid gap-4", rule.needsDestination && "sm:grid-cols-2")}>
              <AddressField
                label={rule.pickupLabel}
                value={data.from}
                onChange={(value) => set("from", value)}
                placeholder="e.g. 12 Admiralty Way, Lekki"
                allowGeolocate
                className={addressFieldClass}
              />
              {rule.needsDestination ? (
                <AddressField
                  label={rule.destinationLabel}
                  value={data.to}
                  onChange={(value) => set("to", value)}
                  placeholder="e.g. 4 Aminu Kano Cres, Wuse"
                  className={addressFieldClass}
                />
              ) : null}
            </div>

            {rule.needsDistance ? (
              <div className="mt-6">
                <p className="text-sm font-semibold">Is this a local or interstate move?</p>
                <div className="mt-2 flex flex-wrap gap-2">
                  {distances.map((option) => (
                    <Choice
                      key={option}
                      label={option}
                      compact
                      selected={data.distance === option}
                      onSelect={() => set("distance", option)}
                    />
                  ))}
                </div>
              </div>
            ) : null}

            <div className={cn("mt-6 grid gap-6", rule.needsDestination && "sm:grid-cols-2")}>
              <div>
                <p className="text-sm font-semibold">
                  {rule.needsDestination ? "Pick-up floor" : "Floor level"}
                </p>
                <div className="mt-2 flex flex-wrap gap-2">
                  {floors.map((floor) => (
                    <Choice
                      key={`from-${floor}`}
                      label={floor}
                      compact
                      selected={data.fromFloor === floor}
                      onSelect={() => set("fromFloor", floor)}
                    />
                  ))}
                </div>
              </div>
              {rule.needsDestination ? (
                <div>
                  <p className="text-sm font-semibold">Destination floor</p>
                  <div className="mt-2 flex flex-wrap gap-2">
                    {floors.map((floor) => (
                      <Choice
                        key={`to-${floor}`}
                        label={floor}
                        compact
                        selected={data.toFloor === floor}
                        onSelect={() => set("toFloor", floor)}
                      />
                    ))}
                  </div>
                </div>
              ) : null}
            </div>

            <div className="mt-4">
              <Label htmlFor="notes">Access notes (optional)</Label>
              <Textarea
                id="notes"
                value={data.notes}
                onChange={(event) => set("notes", event.target.value)}
                placeholder="Floor number, lift availability, parking, fragile items…"
                className="mt-2 min-h-28"
              />
            </div>
          </div>
        ) : null}

        {current === "schedule" ? (
          <div>
            <StepTitle title="When should we arrive?" body="We move with 30 minutes to 30 days notice." />
            <div className="mt-5 max-w-xs">
              <FieldInput
                id="date"
                type="date"
                label="Moving date"
                value={data.date}
                min={minDate}
                onChange={(v) => set("date", v)}
              />
            </div>
            <p className="mt-6 text-sm font-semibold">Preferred arrival window</p>
            <div className="mt-2 grid gap-2 sm:grid-cols-2">
              {windows.map((window) => (
                <Choice
                  key={window}
                  label={window}
                  selected={data.window === window}
                  onSelect={() => set("window", window)}
                />
              ))}
            </div>
          </div>
        ) : null}

        {current === "contact" ? (
          <div>
            <StepTitle
              title="Where do we send the quote?"
              body="We'll confirm your price before anything is charged."
            />
            {quick ? (
              <div className="mt-5">
                <AddressField
                  label={rule.pickupLabel}
                  value={data.from}
                  onChange={(value) => set("from", value)}
                  placeholder="e.g. 12 Admiralty Way, Lekki"
                  allowGeolocate
                  className={addressFieldClass}
                />
              </div>
            ) : null}
            <div className="mt-5 grid gap-4 sm:grid-cols-2">
              <FieldInput id="name" label="Full name" value={data.name} onChange={(v) => set("name", v)} />
              <FieldInput
                id="phone"
                type="tel"
                label="Phone number"
                value={data.phone}
                onChange={(v) => set("phone", v)}
                placeholder="0801 234 5678"
              />
              <div className="sm:col-span-2">
                <FieldInput
                  id="email"
                  type="email"
                  label="Email (for your quote and receipt)"
                  value={data.email}
                  onChange={(v) => set("email", v)}
                />
              </div>
            </div>

            {quick ? (
              <div className="mt-4">
                <Label htmlFor="quick-notes">Anything we should know? (optional)</Label>
                <Textarea
                  id="quick-notes"
                  value={data.notes}
                  onChange={(event) => set("notes", event.target.value)}
                  placeholder="Where you're moving to, preferred dates, fragile items…"
                  className="mt-2 min-h-24"
                />
              </div>
            ) : null}

            <div className="mt-6 rounded-3xl bg-surface p-5 text-sm">
              <p className="font-semibold">Your move summary</p>
              <dl className="mt-3 grid gap-2">
                <Row label="Service" value={[data.service, data.size].filter(Boolean).join(" · ") || "—"} />
                <Row
                  label={rule.needsDestination ? "Route" : "Address"}
                  value={
                    rule.needsDestination ? `${data.from || "—"} → ${data.to || "—"}` : data.from || "—"
                  }
                />
                {!quick ? (
                  <Row label="Schedule" value={[data.date, data.window].filter(Boolean).join(" · ") || "—"} />
                ) : null}
                <Row label="Photos" value={photos.length ? `${photos.length} attached` : "None"} />
                {estimate ? (
                  <Row
                    label="Estimate"
                    value={`${naira(estimate.min)} – ${naira(estimate.max)} + VAT`}
                  />
                ) : null}
              </dl>
            </div>
          </div>
        ) : null}
      </div>

      <div className="mt-8 flex flex-col-reverse gap-3 border-t border-border pt-6 sm:flex-row sm:items-center sm:justify-between">
        <Button
          variant="ghost"
          className="w-full rounded-full sm:w-auto"
          onClick={() => {
            if (quick && step === 2) {
              setQuick(false);
              setStep(1);
              return;
            }
            setStep(Math.max(0, step - 1));
          }}
          disabled={step === 0}
        >
          <ArrowLeft className="size-4" aria-hidden="true" />
          Back
        </Button>
        <span className="hidden text-xs font-semibold tracking-wide uppercase text-muted-foreground md:block">
          Step {step + 1} of {flow.length}
        </span>
        <Button
          onClick={next}
          size="lg"
          disabled={submitting}
          className="w-full rounded-full bg-accent text-accent-foreground hover:bg-accent/90 sm:w-auto"
        >
          {submitting ? (
            <>
              <Loader2 className="size-4 animate-spin" aria-hidden="true" />
              Submitting…
            </>
          ) : (
            <>
              <span className="truncate">
                {isLast ? (quick ? "Send to an agent" : "Confirm booking") : "Continue"}
              </span>
              <ArrowRight className="size-4 shrink-0" aria-hidden="true" />
            </>
          )}
        </Button>
      </div>
    </div>
  );
}

function StepTitle({ title, body }: { title: string; body: string }) {
  return (
    <div>
      <h2 className="text-xl font-semibold sm:text-2xl">{title}</h2>
      <p className="mt-1.5 text-sm text-muted-foreground">{body}</p>
    </div>
  );
}

function Choice({
  label,
  selected,
  onSelect,
  compact,
}: {
  label: string;
  selected: boolean;
  onSelect: () => void;
  compact?: boolean;
}) {
  return (
    <button
      type="button"
      onClick={onSelect}
      aria-pressed={selected}
      className={cn(
        "rounded-2xl border px-4 text-left text-sm font-medium transition-colors",
        compact ? "py-2 rounded-full" : "py-3",
        selected
          ? "border-accent bg-accent-soft text-accent-foreground"
          : "border-border bg-card hover:bg-secondary",
      )}
    >
      {label}
    </button>
  );
}

function FieldInput({
  id,
  label,
  value,
  onChange,
  placeholder,
  type = "text",
  min,
}: {
  id: string;
  label: string;
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  type?: string;
  min?: string;
}) {
  return (
    <div>
      <Label htmlFor={id}>{label}</Label>
      <Input
        id={id}
        type={type}
        value={value}
        placeholder={placeholder}
        min={min}
        onChange={(event) => onChange(event.target.value)}
        className="mt-2 h-11 rounded-xl"
      />
    </div>
  );
}

function Row({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex flex-wrap justify-between gap-2 border-b border-border/70 pb-2 last:border-0 last:pb-0">
      <dt className="text-muted-foreground">{label}</dt>
      <dd className="font-medium">{value}</dd>
    </div>
  );
}
