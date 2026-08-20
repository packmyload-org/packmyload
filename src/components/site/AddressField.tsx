import { Suspense, lazy, useEffect, useId, useRef, useState } from "react";
import { ClientOnly } from "@tanstack/react-router";
import { useServerFn } from "@tanstack/react-start";
import { Loader2, LocateFixed, MapPin, Map as MapIcon } from "lucide-react";
import { toast } from "sonner";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { reverseGeocode, searchAddress } from "@/lib/geo.functions";
import { cn } from "@/lib/utils";

const MapPicker = lazy(() => import("@/components/site/MapPicker"));

type Suggestion = { id: string; label: string; lng: number; lat: number };

export function AddressField({
  label,
  value,
  onChange,
  placeholder,
  allowGeolocate = false,
  className,
}: {
  label: string;
  value: string;
  onChange: (value: string, coords?: { lng: number; lat: number }) => void;
  placeholder?: string;
  allowGeolocate?: boolean;
  className?: string;
}) {
  const id = useId();
  const search = useServerFn(searchAddress);
  const reverse = useServerFn(reverseGeocode);

  const [suggestions, setSuggestions] = useState<Suggestion[]>([]);
  const [open, setOpen] = useState(false);
  const [searchAvailable, setSearchAvailable] = useState(true);

  const [loading, setLoading] = useState(false);
  const [locating, setLocating] = useState(false);
  const [mapOpen, setMapOpen] = useState(false);
  const [coords, setCoords] = useState<{ lng: number; lat: number } | undefined>();
  const skipNextSearch = useRef(false);

  useEffect(() => {
    if (skipNextSearch.current) {
      skipNextSearch.current = false;
      return;
    }
    const query = value.trim();
    if (query.length < 3) {
      setSuggestions([]);
      setOpen(false);
      return;
    }
    let active = true;
    setLoading(true);
    const timer = setTimeout(() => {
      search({ data: { query } })
        .then((result) => {
          if (!active) return;
          setSearchAvailable(result.available);
          setSuggestions(result.suggestions);
          setOpen(result.suggestions.length > 0);
        })
        .catch(() => {
          if (active) {
            setSearchAvailable(false);
            setSuggestions([]);
            setOpen(false);
          }
        })

        .finally(() => {
          if (active) setLoading(false);
        });
    }, 300);
    return () => {
      active = false;
      clearTimeout(timer);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [value]);

  const pick = (suggestion: Suggestion) => {
    skipNextSearch.current = true;
    setCoords({ lng: suggestion.lng, lat: suggestion.lat });
    onChange(suggestion.label, { lng: suggestion.lng, lat: suggestion.lat });
    setSuggestions([]);
    setOpen(false);
  };

  const resolve = async (point: { lng: number; lat: number }) => {
    try {
      const result = await reverse({ data: point });
      return result.address;
    } catch {
      return null;
    }
  };

  const useMyLocation = () => {
    if (typeof navigator === "undefined" || !navigator.geolocation) {
      toast.error("Your browser doesn't support location detection.");
      return;
    }
    setLocating(true);
    navigator.geolocation.getCurrentPosition(
      async (position) => {
        const point = { lng: position.coords.longitude, lat: position.coords.latitude };
        const address = await resolve(point);
        skipNextSearch.current = true;
        setCoords(point);
        onChange(address ?? `${point.lat.toFixed(5)}, ${point.lng.toFixed(5)}`, point);
        setLocating(false);
        setOpen(false);
      },
      () => {
        setLocating(false);
        toast.error("We couldn't get your location. Please type your address or pick it on the map.");
      },
      { enableHighAccuracy: true, timeout: 10000 },
    );
  };

  return (
    <div className={cn("relative flex min-w-0 flex-1 items-center gap-3 rounded-2xl px-4 py-2 transition-colors focus-within:bg-secondary/70 md:rounded-full", className)}>
      <span className="text-accent">
        <MapPin className="size-4" aria-hidden="true" />
      </span>
      <div className="min-w-0 flex-1">
        <label htmlFor={id} className="block text-[0.7rem] font-semibold tracking-wide uppercase text-muted-foreground">
          {label}
        </label>
        <input
          id={id}
          type="text"
          autoComplete="off"
          value={value}
          placeholder={placeholder}
          onChange={(event) => onChange(event.target.value)}
          onFocus={() => suggestions.length > 0 && setOpen(true)}
          onBlur={() => window.setTimeout(() => setOpen(false), 150)}
          className="w-full bg-transparent text-sm font-medium text-foreground outline-none placeholder:text-muted-foreground/70"
        />
      </div>

      <div className="flex shrink-0 items-center gap-1">
        {loading || locating ? <Loader2 className="size-4 animate-spin text-accent" aria-hidden="true" /> : null}
        {allowGeolocate ? (
          <button
            type="button"
            onClick={useMyLocation}
            aria-label="Use my current location"
            title="Use my current location"
            className="rounded-full p-1.5 text-muted-foreground transition-colors hover:bg-secondary hover:text-accent"
          >
            <LocateFixed className="size-4" aria-hidden="true" />
          </button>
        ) : null}
        <button
          type="button"
          onClick={() => setMapOpen(true)}
          aria-label={`Pick ${label.toLowerCase()} on map`}
          title="Pick on map"
          className="rounded-full p-1.5 text-muted-foreground transition-colors hover:bg-secondary hover:text-accent"
        >
          <MapIcon className="size-4" aria-hidden="true" />
        </button>
      </div>

      {open && suggestions.length > 0 ? (
        <ul className="absolute top-full left-0 z-50 mt-2 w-full max-w-md overflow-hidden rounded-2xl border border-border bg-popover text-left shadow-lift">
          {suggestions.map((suggestion) => (
            <li key={suggestion.id}>
              <button
                type="button"
                onMouseDown={(event) => event.preventDefault()}
                onClick={() => pick(suggestion)}
                className="flex w-full items-start gap-2 px-4 py-2.5 text-left text-sm text-foreground transition-colors hover:bg-secondary"
              >
                <MapPin className="mt-0.5 size-3.5 shrink-0 text-accent" aria-hidden="true" />
                <span className="min-w-0">{suggestion.label}</span>
              </button>
            </li>
          ))}
        </ul>
      ) : null}

      <Dialog open={mapOpen} onOpenChange={setMapOpen}>
        <DialogContent className="max-w-lg">
          <DialogHeader>
            <DialogTitle>Pick {label.toLowerCase()} on the map</DialogTitle>
            <DialogDescription>Drag the pin or tap the map to set the exact spot.</DialogDescription>
          </DialogHeader>
          <ClientOnly fallback={<div className="h-[320px] w-full animate-pulse rounded-2xl bg-secondary" />}>
            <Suspense fallback={<div className="h-[320px] w-full animate-pulse rounded-2xl bg-secondary" />}>
              <MapPicker
                initial={coords}
                onResolve={resolve}
                onConfirm={({ lng, lat, address }) => {
                  skipNextSearch.current = true;
                  setCoords({ lng, lat });
                  onChange(address ?? `${lat.toFixed(5)}, ${lng.toFixed(5)}`, { lng, lat });
                  setMapOpen(false);
                }}
              />
            </Suspense>
          </ClientOnly>
        </DialogContent>
      </Dialog>
    </div>
  );
}
