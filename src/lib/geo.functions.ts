import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";

const GATEWAY_URL = "https://connector-gateway.lovable.dev/mapbox";

type Suggestion = { id: string; label: string; lng: number; lat: number };

async function mapboxFetch(path: string) {
  const lovableKey = process.env["LOVABLE_API_KEY"];
  const connectionKey = process.env["MAPBOX_API_KEY"];
  if (!lovableKey || !connectionKey) return null;

  const response = await fetch(`${GATEWAY_URL}${path}`, {
    headers: {
      Authorization: `Bearer ${lovableKey}`,
      "X-Connection-Api-Key": connectionKey,
    },
  });

  if (!response.ok) {
    const body = await response.text();
    console.error(`Mapbox gateway failed [${response.status}]: ${body}`);
    return null;
  }
  return (await response.json()) as {
    features?: Array<{ id?: string; place_name?: string; center?: [number, number] }>;
  };
}

function toSuggestions(data: Awaited<ReturnType<typeof mapboxFetch>>): Suggestion[] {
  if (!data?.features) return [];
  return data.features
    .filter((f) => f.place_name && Array.isArray(f.center))
    .map((f, index) => ({
      id: f.id ?? `feature-${index}`,
      label: f.place_name!,
      lng: f.center![0],
      lat: f.center![1],
    }));
}

export const searchAddress = createServerFn({ method: "GET" })
  .inputValidator((data) => z.object({ query: z.string().min(1).max(200) }).parse(data))
  .handler(async ({ data }) => {
    const query = encodeURIComponent(data.query);
    const result = await mapboxFetch(
      `/geocoding/v5/mapbox.places/${query}.json?limit=6&country=ng&language=en&types=address,place,locality,neighborhood,poi,postcode,district`,
    );
    return { suggestions: toSuggestions(result), available: result !== null };
  });

export const reverseGeocode = createServerFn({ method: "GET" })
  .inputValidator((data) =>
    z.object({ lng: z.number().min(-180).max(180), lat: z.number().min(-90).max(90) }).parse(data),
  )
  .handler(async ({ data }) => {
    const result = await mapboxFetch(
      `/geocoding/v5/mapbox.places/${data.lng},${data.lat}.json?limit=1&language=en`,
    );
    const suggestions = toSuggestions(result);
    return { address: suggestions[0]?.label ?? null, available: result !== null };
  });
