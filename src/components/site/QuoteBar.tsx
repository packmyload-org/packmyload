import { useState } from "react";
import { CalendarDays, MapPin, Search } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

export function QuoteBar({ className }: { className?: string }) {
  const [from, setFrom] = useState("");
  const [to, setTo] = useState("");
  const [date, setDate] = useState("");

  const submit = (event: React.FormEvent) => {
    event.preventDefault();
    if (!from.trim() || !to.trim()) {
      toast.error("Add both a pick up and a drop off location.");
      return;
    }
    toast.success("Quote request received", {
      description: `We'll send your estimate for ${from.trim()} → ${to.trim()}${
        date ? ` on ${date}` : ""
      } shortly.`,
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
        <Field
          icon={<MapPin className="size-4" aria-hidden="true" />}
          label="Moving from"
          value={from}
          onChange={setFrom}
          placeholder="e.g. Lekki, Lagos"
        />
        <span className="hidden h-8 w-px bg-border md:block" />
        <Field
          icon={<MapPin className="size-4" aria-hidden="true" />}
          label="Moving to"
          value={to}
          onChange={setTo}
          placeholder="e.g. Wuse, Abuja"
        />
        <span className="hidden h-8 w-px bg-border md:block" />
        <Field
          icon={<CalendarDays className="size-4" aria-hidden="true" />}
          label="Moving date"
          value={date}
          onChange={setDate}
          type="date"
        />
        <Button
          type="submit"
          size="lg"
          className="h-13 shrink-0 gap-2 rounded-2xl bg-accent text-base font-semibold text-white hover:bg-accent/90 md:rounded-full"
        >
          <Search className="size-4" aria-hidden="true" />
          Get quote
        </Button>
      </div>
    </form>
  );
}

function Field({
  icon,
  label,
  value,
  onChange,
  placeholder,
  type = "text",
}: {
  icon: React.ReactNode;
  label: string;
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  type?: string;
}) {
  const id = `quote-${label.toLowerCase().replace(/\s+/g, "-")}`;
  return (
    <div className="flex min-w-0 flex-1 items-center gap-3 rounded-2xl px-4 py-2 transition-colors focus-within:bg-secondary/70 md:rounded-full">
      <span className="text-accent">{icon}</span>
      <div className="min-w-0 flex-1">
        <label htmlFor={id} className="block text-[0.7rem] font-semibold tracking-wide uppercase text-muted-foreground">
          {label}
        </label>
        <input
          id={id}
          type={type}
          value={value}
          placeholder={placeholder}
          onChange={(event) => onChange(event.target.value)}
          className="w-full bg-transparent text-sm font-medium text-foreground outline-none placeholder:text-muted-foreground/70"
        />
      </div>
    </div>
  );
}
