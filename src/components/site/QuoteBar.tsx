import { useEffect, useMemo, useState } from "react";
import { useNavigate, useRouterState } from "@tanstack/react-router";
import { CalendarDays } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { AddressField } from "@/components/site/AddressField";
import { todayISO } from "@/lib/booking-rules";
import { cn } from "@/lib/utils";

const STORAGE_KEY = "packmyload:quote-draft";

type Draft = { from: string; to: string; date: string };

export function QuoteBar({ className }: { className?: string }) {
  const [draft, setDraft] = useState<Draft>({ from: "", to: "", date: "" });
  const navigate = useNavigate();
  const minDate = useMemo(() => todayISO(), []);
  const pathname = useRouterState({ select: (state) => state.location.pathname });

  useEffect(() => {
    try {
      const stored = window.sessionStorage.getItem(STORAGE_KEY);
      if (stored) setDraft({ from: "", to: "", date: "", ...(JSON.parse(stored) as Partial<Draft>) });
    } catch {
      /* ignore unavailable storage */
    }
  }, []);

  const update = (patch: Partial<Draft>) =>
    setDraft((current) => {
      const next = { ...current, ...patch };
      try {
        window.sessionStorage.setItem(STORAGE_KEY, JSON.stringify(next));
      } catch {
        /* ignore unavailable storage */
      }
      return next;
    });

  const submit = (event: React.FormEvent) => {
    event.preventDefault();
    if (!draft.from.trim() || !draft.to.trim()) {
      toast.error("Add both a pick up and a drop off location.");
      return;
    }
    if (pathname !== "/book") {
      void navigate({ to: "/book" });
      return;
    }
    toast.success("Locations saved", {
      description: "Finish the steps below and we'll confirm your quote.",
    });
  };

  return (
    <form
      onSubmit={submit}
      className={cn(
        "mx-auto w-full max-w-4xl rounded-3xl border border-border/70 bg-card p-2 shadow-lift md:rounded-full md:p-2.5",
        className,
      )}
    >
      <div className="flex flex-col gap-2 md:flex-row md:items-center">
        <AddressField
          label="Moving from"
          value={draft.from}
          onChange={(value) => update({ from: value })}
          placeholder="e.g. Lekki, Lagos"
          allowGeolocate
        />
        <span className="hidden h-8 w-px bg-border md:block" />
        <AddressField
          label="Moving to"
          value={draft.to}
          onChange={(value) => update({ to: value })}
          placeholder="e.g. Wuse, Abuja"
        />
        <span className="hidden h-8 w-px bg-border md:block" />
        <div className="flex min-w-0 flex-1 items-center gap-3 rounded-2xl px-4 py-2 transition-colors focus-within:bg-secondary/70 md:rounded-full">
          <span className="text-accent">
            <CalendarDays className="size-4" aria-hidden="true" />
          </span>
          <div className="min-w-0 flex-1">
            <label
              htmlFor="quote-moving-date"
              className="block text-[0.7rem] font-semibold tracking-wide uppercase text-muted-foreground"
            >
              Moving date
            </label>
            <input
              id="quote-moving-date"
              type="date"
              value={draft.date}
              min={minDate}
              onChange={(event) => update({ date: event.target.value })}
              aria-label="Moving date"
              className="w-full rounded-md focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-card appearance-none bg-transparent text-sm font-medium text-foreground outline-none [color-scheme:light_dark] [&::-webkit-calendar-picker-indicator]:hidden placeholder:text-muted-foreground/70"
            />
          </div>
        </div>
        <Button
          type="submit"
          size="lg"
          className="h-13 shrink-0 rounded-2xl bg-cta text-base font-semibold text-cta-foreground hover:bg-cta/90 md:rounded-full"
        >
          Get quote
        </Button>
      </div>
    </form>
  );
}
