/** Trades offered through the Packmyload Hub artisans marketplace. */
export const TRADES = [
  "Electrician",
  "Plumber",
  "Carpenter",
  "Painter",
  "AC technician",
  "Cleaner",
  "Fumigation",
  "Tiler",
  "Satellite & internet installer",
  "CCTV & smart locks",
  "Generator technician",
  "Furniture assembly",
  "Handyman",
] as const;

export const RATE_UNITS = ["per job", "per hour", "per day", "per visit"] as const;

export type Artisan = {
  id: string;
  full_name: string;
  trade: string;
  service_areas: string[];
  bio: string | null;
  rate_min: number | null;
  rate_max: number | null;
  rate_unit: string;
  photo_url: string | null;
  is_verified: boolean;
  is_active: boolean;
  created_at: string;
};

export type AdminArtisan = Artisan & {
  phone: string;
  whatsapp: string | null;
};

export const PUBLIC_ARTISAN_COLUMNS =
  "id, full_name, trade, service_areas, bio, rate_min, rate_max, rate_unit, photo_url, is_verified, is_active, created_at";

export const ADMIN_ARTISAN_COLUMNS = `${PUBLIC_ARTISAN_COLUMNS}, phone, whatsapp`;

export function rateLabel(artisan: Pick<Artisan, "rate_min" | "rate_max" | "rate_unit">) {
  const fmt = (value: number) =>
    new Intl.NumberFormat("en-NG", {
      style: "currency",
      currency: "NGN",
      maximumFractionDigits: 0,
    }).format(value);
  if (artisan.rate_min && artisan.rate_max)
    return `${fmt(artisan.rate_min)} – ${fmt(artisan.rate_max)} ${artisan.rate_unit}`;
  if (artisan.rate_min) return `From ${fmt(artisan.rate_min)} ${artisan.rate_unit}`;
  return "Rate on request";
}
