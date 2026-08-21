/**
 * Move quote estimator.
 *
 * Relocation services start from a flat base band of ₦450,000 – ₦800,000.
 * Size, interstate distance and floor access (stairs / walk-up) add on top of
 * that base. Non-relocation services keep their own standalone rate bands.
 * All figures are in Nigerian Naira.
 */

export const VAT_RATE = 0.075;
export const DEPOSIT_RATE = 0.3;

/** Flat fee for an on-site survey / consultation visit. */
export const SURVEY_FEE = 30_000;

type Band = { min: number; max: number };

/** Base band shared by every relocation service. */
export const RELOCATION_BASE: Band = { min: 450_000, max: 800_000 };

/** Larger homes start from their own base band instead of the standard one. */
const sizeBase: Record<string, Band> = {
  "4+ bedrooms": { min: 1_000_000, max: 1_500_000 },
};

/** Relocation services priced off RELOCATION_BASE. */
const relocationFactor: Record<string, number> = {
  "Home Relocations": 1,
  "Office Relocations": 1.15,
  "International Relocations": 2.5,
  "Store Delivery": 0.55,
  "Junk Removal": 0.45,
  "Wedding Gifts Handling": 0.6,
};

/** Size uplift applied on top of the base band (never below 1x). */
const sizeFactor: Record<string, number> = {
  "A few items only": 1,
  "Studio / single room": 1.1,
  "2 – 3 bedrooms": 1.25,
  "4+ bedrooms": 1,
  "Office / commercial": 1.4,
};


/** Interstate routes cost more fuel, tolls and crew time. */
const INTERSTATE_FACTOR = 1.6;

/** Floor access surcharge per address (share of the base band). */
const floorSurcharge: Record<string, number> = {
  "Ground floor": 0,
  "1st floor": 0.05,
  "2nd floor": 0.09,
  "3rd floor or higher": 0.15,
};

/** Stairs on a long-haul job hurt more — floor impact is amplified. */
const INTERSTATE_FLOOR_MULTIPLIER = 1.5;

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

const floorFactor = (floor: string | undefined | null) =>
  floor ? (floorSurcharge[floor] ?? 0) : 0;

export function estimateMove(input: {
  service: string;
  size?: string | undefined;
  interstate?: boolean | undefined;
  pickupFloor?: string | undefined | null;
  destinationFloor?: string | undefined | null;
}): Estimate | null {
  const flat = flatServices[input.service];
  const service = relocationFactor[input.service];
  if (!flat && service === undefined) return null;

  const size = input.size && input.size.length ? input.size : "2 – 3 bedrooms";
  const notes: string[] = [];

  let min: number;
  let max: number;

  if (flat) {
    min = flat.min;
    max = flat.max;
    notes.push(`${input.service} standard rate`);
  } else {
    const sizeUplift = sizeFactor[size] ?? 1;
    let factor = (service ?? 1) * sizeUplift;
    notes.push(size);

    if (input.interstate) {
      factor *= INTERSTATE_FACTOR;
      notes.push("interstate route");
    } else {
      notes.push("within-state move");
    }

    const floors = floorFactor(input.pickupFloor) + floorFactor(input.destinationFloor);
    if (floors > 0) {
      factor *= 1 + floors * (input.interstate ? INTERSTATE_FLOOR_MULTIPLIER : 1);
      notes.push("floor access");
    }

    min = RELOCATION_BASE.min * factor;
    max = RELOCATION_BASE.max * factor;
  }

  min = round(min);
  max = round(max);
  const vat = Math.round(((min + max) / 2) * VAT_RATE);
  const deposit = round(min * DEPOSIT_RATE);

  return { min, max, vat, deposit, basis: notes.join(" · ") };
}

export const naira = (value: number) =>
  `₦${Math.round(value).toLocaleString("en-NG", { maximumFractionDigits: 0 })}`;
