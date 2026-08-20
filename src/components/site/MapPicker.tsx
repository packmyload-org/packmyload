import { useEffect, useRef, useState } from "react";
import mapboxgl from "mapbox-gl";
import "mapbox-gl/dist/mapbox-gl.css";
import { Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";

export const LAGOS_CENTER = { lng: 3.3792, lat: 6.5244 };

export default function MapPicker({
  initial,
  onConfirm,
  onResolve,
}: {
  initial?: { lng: number; lat: number };
  onConfirm: (value: { lng: number; lat: number; address: string | null }) => void;
  onResolve: (coords: { lng: number; lat: number }) => Promise<string | null>;
}) {
  const container = useRef<HTMLDivElement | null>(null);
  const mapRef = useRef<mapboxgl.Map | null>(null);
  const markerRef = useRef<mapboxgl.Marker | null>(null);
  const [coords, setCoords] = useState(initial ?? LAGOS_CENTER);
  const [address, setAddress] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const token = import.meta.env['VITE_LOVABLE_CONNECTOR_MAPBOX_PUBLIC_TOKEN'] as string | undefined;

  useEffect(() => {
    if (!container.current || !token || mapRef.current) return;
    mapboxgl.accessToken = token;
    const map = new mapboxgl.Map({
      container: container.current,
      style: "mapbox://styles/mapbox/streets-v12",
      center: [coords.lng, coords.lat],
      zoom: 12,
    });
    map.addControl(new mapboxgl.NavigationControl({ showCompass: false }), "top-right");
    const marker = new mapboxgl.Marker({ draggable: true, color: "#1d4ed8" })
      .setLngLat([coords.lng, coords.lat])
      .addTo(map);

    const update = (lngLat: mapboxgl.LngLat) => setCoords({ lng: lngLat.lng, lat: lngLat.lat });
    marker.on("dragend", () => update(marker.getLngLat()));
    map.on("click", (event) => {
      marker.setLngLat(event.lngLat);
      update(event.lngLat);
    });

    mapRef.current = map;
    markerRef.current = marker;
    return () => {
      map.remove();
      mapRef.current = null;
      markerRef.current = null;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [token]);

  useEffect(() => {
    let active = true;
    setLoading(true);
    const timer = setTimeout(() => {
      onResolve(coords)
        .then((value) => {
          if (active) setAddress(value);
        })
        .finally(() => {
          if (active) setLoading(false);
        });
    }, 350);
    return () => {
      active = false;
      clearTimeout(timer);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [coords.lng, coords.lat]);

  if (!token) {
    return (
      <p className="text-sm text-muted-foreground">
        Map picking is unavailable right now — please type the address instead.
      </p>
    );
  }

  return (
    <div className="space-y-3">
      <div ref={container} className="h-[320px] w-full overflow-hidden rounded-2xl border border-border" />
      <div className="flex items-center gap-2 rounded-xl bg-secondary/60 px-3 py-2 text-sm">
        {loading ? <Loader2 className="size-4 shrink-0 animate-spin text-accent" /> : null}
        <span className="min-w-0 flex-1 truncate text-foreground">
          {address ?? `${coords.lat.toFixed(5)}, ${coords.lng.toFixed(5)}`}
        </span>
      </div>
      <Button
        type="button"
        className="w-full text-white"
        onClick={() => onConfirm({ ...coords, address })}
      >
        Use this location
      </Button>
    </div>
  );
}
