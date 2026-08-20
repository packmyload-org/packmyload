import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";

const GATEWAY_URL = "https://connector-gateway.lovable.dev/mapbox";

type Suggestion = { id: string; label: string; lng: number; lat: number };

type GeoResponse = {
  features?: Array<{
    id?: string;
    properties?: { full_address?: string; place_formatted?: string; name?: string; coordinates?: { longitude: number; latitude: number } };
  }>;
};

async function mapboxFetch(path: string): Promise<GeoResponse | null> {
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
  return (await response.json()) as GeoResponse;
}

function toSuggestions(data: GeoResponse | null): Suggestion[] {
  if (!data?.features) return [];
  return data.features
    .map((feature, index) => {
      const props = feature.properties ?? {};
      const label = props.full_address ?? (props.name ? `${props.name}${props.place_formatted ? `, ${props.place_formatted}` : ""}` : null);
      if (!label || !props.coordinates) return null;
      return {
        id: feature.id ?? `feature-${index}`,
        label,
        lng: props.coordinates.longitude,
        lat: props.coordinates.latitude,
      };
    })
    .filter((item): item is Suggestion => item !== null);
}

export const searchAddress = createServerFn({ method: "GET" })
  .inputValidator((data) => z.object({ query: z.string().min(1).max(200) }).parse(data))
  .handler(async ({ data }) => {
    const query = encodeURIComponent(data.query);
    const result = await mapboxFetch(
      `/search/geocode/v6/forward?q=${query}&limit=6&country=ng&language=en&proximity=3.3792,6.5244`,
    );
    return { suggestions: toSuggestions(result), available: result !== null };
  });

export const reverseGeocode = createServerFn({ method: "GET" })
  .inputValidator((data) =>
    z.object({ lng: z.number().min(-180).max(180), lat: z.number().min(-90).max(90) }).parse(data),
  )
  .handler(async ({ data }) => {
    const result = await mapboxFetch(
      `/search/geocode/v6/reverse?longitude=${data.lng}&latitude=${data.lat}&limit=1&language=en`,
    );
    const suggestions = toSuggestions(result);
    return { address: suggestions[0]?.label ?? null, available: result !== null };
  });
