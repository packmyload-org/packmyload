/** Per-service form rules so the booking wizard only asks what it needs. */

export type ServiceRule = {
  needsDestination: boolean;
  needsSize: boolean;
  needsDistance: boolean;
  alwaysInterstate?: boolean;
  pickupLabel: string;
  destinationLabel: string;
  sizeLabel: string;
};

const base: ServiceRule = {
  needsDestination: true,
  needsSize: true,
  needsDistance: true,
  pickupLabel: "Moving from",
  destinationLabel: "Moving to",
  sizeLabel: "Size of the move",
};

const rules: Record<string, Partial<ServiceRule>> = {
  "Home Relocations": {},
  "Office Relocations": {},
  "Store Delivery": {
    needsSize: false,
    pickupLabel: "Collect from",
    destinationLabel: "Deliver to",
  },
  "Interstate Car Transport": {
    needsSize: false,
    needsDistance: false,
    alwaysInterstate: true,
    pickupLabel: "Pick-up address",
    destinationLabel: "Delivery address",
  },
  "Junk Removal": {
    needsDestination: false,
    needsDistance: false,
    pickupLabel: "Address to clear",
    sizeLabel: "How much is there?",
  },
  "Wedding Gifts Handling": {
    needsSize: false,
    pickupLabel: "Venue address",
    destinationLabel: "Deliver gifts to",
  },
  "International Relocations": {
    needsDistance: false,
    alwaysInterstate: true,
    destinationLabel: "Destination country / city",
  },
  "Cleaning Services": {
    needsDestination: false,
    needsDistance: false,
    pickupLabel: "Property address",
    sizeLabel: "Property size",
  },
  Storage: {
    needsDestination: false,
    needsDistance: false,
    pickupLabel: "Collect from",
    sizeLabel: "How much are we storing?",
  },
};

export function ruleFor(service: string): ServiceRule {
  return { ...base, ...(rules[service] ?? {}) };
}

/** Local (not UTC) date in YYYY-MM-DD — used as the calendar min. */
export function todayISO(): string {
  const now = new Date();
  const offset = now.getTimezoneOffset() * 60_000;
  return new Date(now.getTime() - offset).toISOString().slice(0, 10);
}
