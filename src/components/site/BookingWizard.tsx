import { useEffect, useMemo, useRef, useState } from "react";
import {
  ArrowLeft,
  ArrowRight,
  CalendarDays,
  Check,
  ClipboardList,
  MapPin,
  ImagePlus,
  Loader2,
  PartyPopper,
  User,
  X,
} from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { supabase } from "@/integrations/supabase/client";
import { services } from "@/lib/site-data";
import { cn } from "@/lib/utils";

type Booking = {
  service: string;
  size: string;
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
  "Studio / single room",
  "2 – 3 bedrooms",
  "4+ bedrooms",
  "Office / commercial",
  "A few items only",
];

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

const stepMeta = [
  { label: "Service", Icon: ClipboardList },
  { label: "Route", Icon: MapPin },
  { label: "Schedule", Icon: CalendarDays },
  { label: "Details", Icon: User },
];

export function BookingWizard() {
  const [step, setStep] = useState(0);
  const [data, setData] = useState<Booking>(empty);
  const [done, setDone] = useState(false);
  const [photos, setPhotos] = useState<File[]>([]);
  const [submitting, setSubmitting] = useState(false);
  const [reference, setReference] = useState("");
  const fileInput = useRef<HTMLInputElement>(null);

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
        destination_address: data.to.trim(),
        pickup_floor: data.fromFloor || null,
        destination_floor: data.toFloor || null,
        moving_date: data.date || null,
        arrival_window: data.window || null,
        full_name: data.name.trim(),
        phone: data.phone.trim(),
        email: data.email.trim() || null,
        notes: data.notes.trim() || null,
        photo_paths: paths,
      });
      if (error) throw error;

      setReference(ref);
      setDone(true);
      toast.success("Booking request received", {
        description: `Reference ${ref} · ${data.from.trim()} → ${data.to.trim()}`,
      });
    } catch (error) {
      console.error(error);
      toast.error("We couldn't submit your booking", {
        description: "Please try again, or call us and we'll take the details over the phone.",
      });
    } finally {
      setSubmitting(false);
    }
  };

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

  const valid = useMemo(() => {
    if (step === 0) return Boolean(data.service && data.size);
    if (step === 1) return Boolean(data.from.trim() && data.to.trim());
    if (step === 2) return Boolean(data.date && data.window);
    return Boolean(data.name.trim() && data.phone.trim());
  }, [step, data]);

  const next = () => {
    if (!valid) {
      toast.error("Please complete this step to continue.");
      return;
    }
    if (step < 3) {
      setStep(step + 1);
      return;
    }
    void submit();
  };

  if (done) {
    return (
      <div className="mx-auto max-w-2xl rounded-4xl border border-border bg-card p-8 text-center shadow-lift sm:p-12">
        <span className="mx-auto flex size-14 items-center justify-center rounded-full bg-accent-soft">
          <PartyPopper className="size-6 text-accent-foreground" aria-hidden="true" />
        </span>
        <h2 className="mt-5 text-2xl font-semibold">Your move is booked in</h2>
        <p className="mt-2 text-sm font-semibold">Reference {reference}</p>
        <p className="mt-3 text-sm text-muted-foreground">
          A move consultant will call {data.phone} shortly to confirm your inventory, access details
          and final price.
        </p>
        <dl className="mt-8 grid gap-3 text-left text-sm">
          <Row label="Service" value={`${data.service} · ${data.size}`} />
          <Row label="Route" value={`${data.from} → ${data.to}`} />
          <Row label="Schedule" value={`${data.date} · ${data.window}`} />
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
      <ol className="flex items-center gap-2">
        {stepMeta.map(({ label, Icon }, index) => {
          const active = index === step;
          const complete = index < step;
          return (
            <li key={label} className="flex flex-1 items-center gap-2">
              <span
                className={cn(
                  "flex size-9 shrink-0 items-center justify-center rounded-full border text-xs font-semibold transition-colors",
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
                  "hidden text-xs font-semibold tracking-wide uppercase sm:block",
                  active ? "text-foreground" : "text-muted-foreground",
                )}
              >
                {label}
              </span>
              {index < stepMeta.length - 1 ? (
                <span
                  className={cn(
                    "ml-1 h-px flex-1 transition-colors",
                    complete ? "bg-accent" : "bg-border",
                  )}
                />
              ) : null}
            </li>
          );
        })}
      </ol>

      <div className="mt-8 min-h-[19rem]">
        {step === 0 ? (
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
            <p className="mt-6 text-sm font-semibold">Size of the move</p>
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
          </div>
        ) : null}

        {step === 1 ? (
          <div>
            <StepTitle title="Where are we going?" body="Add the pick up and drop off addresses." />
            <div className="mt-5 grid gap-4 sm:grid-cols-2">
              <FieldInput
                id="from"
                label="Moving from"
                value={data.from}
                onChange={(v) => set("from", v)}
                placeholder="e.g. 12 Admiralty Way, Lekki"
              />
              <FieldInput
                id="to"
                label="Moving to"
                value={data.to}
                onChange={(v) => set("to", v)}
                placeholder="e.g. 4 Aminu Kano Cres, Wuse"
              />
            </div>
            <div className="mt-6 grid gap-6 sm:grid-cols-2">
              <div>
                <p className="text-sm font-semibold">Pick-up floor</p>
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

        {step === 2 ? (
          <div>
            <StepTitle title="When should we arrive?" body="We move with 30 minutes to 30 days notice." />
            <div className="mt-5 max-w-xs">
              <FieldInput
                id="date"
                type="date"
                label="Moving date"
                value={data.date}
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

        {step === 3 ? (
          <div>
            <StepTitle title="Where do we send the quote?" body="We'll confirm your price before anything is charged." />
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
                  label="Email (optional)"
                  value={data.email}
                  onChange={(v) => set("email", v)}
                />
              </div>
            </div>
            <div className="mt-6">
              <p className="text-sm font-semibold">Photos of your items (optional)</p>
              <p className="mt-1 text-xs text-muted-foreground">
                Up to {MAX_PHOTOS} images, 8MB each. Photos help us size the truck and crew, so your
                quote is accurate first time.
              </p>
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
                className="mt-3 rounded-full"
                onClick={() => fileInput.current?.click()}
              >
                <ImagePlus className="size-4" aria-hidden="true" />
                Add photos
              </Button>
              {photos.length ? (
                <ul className="mt-4 grid grid-cols-3 gap-3 sm:grid-cols-4">
                  {photos.map((file, index) => (
                    <li key={`${file.name}-${index}`} className="relative">
                      <img
                        src={URL.createObjectURL(file)}
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
            </div>
            <div className="mt-6 rounded-3xl bg-surface p-5 text-sm">
              <p className="font-semibold">Your move summary</p>
              <dl className="mt-3 grid gap-2">
                <Row label="Service" value={`${data.service} · ${data.size}`} />
                <Row label="Route" value={`${data.from} → ${data.to}`} />
                <Row label="Schedule" value={`${data.date} · ${data.window}`} />
                <Row
                  label="Floors"
                  value={[data.fromFloor, data.toFloor].filter(Boolean).join(" → ") || "Not specified"}
                />
                <Row label="Photos" value={photos.length ? `${photos.length} attached` : "None"} />
              </dl>
            </div>
          </div>
        ) : null}
      </div>

      <div className="mt-8 flex items-center justify-between gap-3 border-t border-border pt-6">
        <Button
          variant="ghost"
          className="rounded-full"
          onClick={() => setStep(Math.max(0, step - 1))}
          disabled={step === 0}
        >
          <ArrowLeft className="size-4" aria-hidden="true" />
          Back
        </Button>
        <span className="text-xs font-semibold tracking-wide uppercase text-muted-foreground">
          Step {step + 1} of 4
        </span>
        <Button
          onClick={next}
          size="lg"
          disabled={submitting}
          className="rounded-full bg-accent text-accent-foreground hover:bg-accent/90"
        >
          {submitting ? (
            <>
              <Loader2 className="size-4 animate-spin" aria-hidden="true" />
              Submitting…
            </>
          ) : (
            <>
              {step === 3 ? "Confirm booking" : "Continue"}
              <ArrowRight className="size-4" aria-hidden="true" />
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
}: {
  id: string;
  label: string;
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  type?: string;
}) {
  return (
    <div>
      <Label htmlFor={id}>{label}</Label>
      <Input
        id={id}
        type={type}
        value={value}
        placeholder={placeholder}
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
