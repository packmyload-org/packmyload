import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";

const NOMINATIM_URL = "https://nominatim.openstreetmap.org";
const USER_AGENT = "PackMyLoad/1.0 (https://packmyload.com)";

type Suggestion = { id: string; label: string; lng: number; lat: number };

type OsmPlace = {
  place_id?: number;
  display_name?: string;
  lat?: string;
  lon?: string;
};

async function osmFetch(path: string): Promise<unknown | null> {
  try {
    const response = await fetch(`${NOMINATIM_URL}${path}`, {
      headers: { "User-Agent": USER_AGENT, Accept: "application/json" },
    });
    if (!response.ok) {
      const body = await response.text();
      console.error(`Nominatim request failed [${response.status}]: ${body}`);
      return null;
    }
    return await response.json();
  } catch (error) {
    console.error("Nominatim request error", error);
    return null;
  }
}

function toSuggestion(place: OsmPlace, index: number): Suggestion | null {
  const lat = Number(place.lat);
  const lng = Number(place.lon);
  if (!place.display_name || Number.isNaN(lat) || Number.isNaN(lng)) return null;
  return { id: String(place.place_id ?? `place-${index}`), label: place.display_name, lng, lat };
}

export const searchAddress = createServerFn({ method: "GET" })
  .inputValidator((data) => z.object({ query: z.string().min(1).max(200) }).parse(data))
  .handler(async ({ data }) => {
    const query = encodeURIComponent(data.query);
    const result = await osmFetch(
      `/search?q=${query}&format=jsonv2&limit=6&countrycodes=ng&addressdetails=1&accept-language=en`,
    );
    if (result === null) return { suggestions: [], available: false };
    const places = Array.isArray(result) ? (result as OsmPlace[]) : [];
    const suggestions = places
      .map((place, index) => toSuggestion(place, index))
      .filter((item): item is Suggestion => item !== null);
    return { suggestions, available: true };
  });

export const reverseGeocode = createServerFn({ method: "GET" })
  .inputValidator((data) =>
    z.object({ lng: z.number().min(-180).max(180), lat: z.number().min(-90).max(90) }).parse(data),
  )
  .handler(async ({ data }) => {
    const result = await osmFetch(
      `/reverse?lat=${data.lat}&lon=${data.lng}&format=jsonv2&addressdetails=1&accept-language=en`,
    );
    if (result === null) return { address: null, available: false };
    const place = toSuggestion(result as OsmPlace, 0);
    return { address: place?.label ?? null, available: true };
  });
