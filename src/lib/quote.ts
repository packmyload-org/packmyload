/**
 * Move quote estimator.
 *
 * Ported from the pricing tables used on the previous Packmyload site
 * (intra-state and inter-state bedroom bands, plus 7.5% VAT).
 * All figures are in Nigerian Naira.
 */

export const VAT_RATE = 0.075;
export const DEPOSIT_RATE = 0.3;

type Band = { min: number; max: number };

const intraState: Record<string, Band> = {
  "A few items only": { min: 60_000, max: 120_000 },
  "Studio / single room": { min: 150_000, max: 200_000 },
  "2 – 3 bedrooms": { min: 250_000, max: 315_000 },
  "4+ bedrooms": { min: 450_000, max: 550_000 },
  "Office / commercial": { min: 400_000, max: 750_000 },
};

const interState: Record<string, Band> = {
  "A few items only": { min: 180_000, max: 350_000 },
  "Studio / single room": { min: 550_000, max: 650_000 },
  "2 – 3 bedrooms": { min: 700_000, max: 1_200_000 },
  "4+ bedrooms": { min: 1_450_000, max: 1_700_000 },
  "Office / commercial": { min: 1_200_000, max: 2_000_000 },
};

/** Service level multipliers / overrides applied on top of the size band. */
const serviceFactor: Record<string, number> = {
  "Home Relocations": 1,
  "Office Relocations": 1.15,
  "International Relocations": 2.5,
  "Store Delivery": 0.35,
  "Junk Removal": 0.3,
  "Wedding Gifts Handling": 0.4,
  "Cleaning Services": 0.25,
  Storage: 0.2,
  "Interstate Car Transport": 1,
};

const flatServices: Record<string, Band> = {
  "Interstate Car Transport": { min: 250_000, max: 450_000 },
  Storage: { min: 45_000, max: 150_000 },
  "Cleaning Services": { min: 60_000, max: 180_000 },
};

export type Estimate = {
  min: number;
  max: number;
  vat: number;
  deposit: number;
  basis: string;
};

const round = (value: number) => Math.round(value / 1000) * 1000;

export function estimateMove(input: {
  service: string;
  size?: string | undefined;
  interstate?: boolean | undefined;
}): Estimate | null {
  const flat = flatServices[input.service];
  const size = input.size && input.size.length ? input.size : "Studio / single room";
  const table = input.interstate ? interState : intraState;
  const band = flat ?? table[size];
  if (!band) return null;

  const factor = flat ? 1 : (serviceFactor[input.service] ?? 1);
  const min = round(band.min * factor);
  const max = round(band.max * factor);
  const vat = Math.round(((min + max) / 2) * VAT_RATE);
  const deposit = round(min * DEPOSIT_RATE);

  return {
    min,
    max,
    vat,
    deposit,
    basis: flat
      ? `${input.service} standard rate`
      : `${size} · ${input.interstate ? "interstate" : "within-state"} move`,
  };
}

export const naira = (value: number) =>
  `₦${Math.round(value).toLocaleString("en-NG", { maximumFractionDigits: 0 })}`;
