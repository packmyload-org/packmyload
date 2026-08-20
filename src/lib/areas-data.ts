// Location landing page data. Every claim mirrors Packmyload's real service
// scope — no invented prices, ratings or testimonials.

export type AreaFaq = { q: string; a: string };

export type Area = {
  slug: string;
  name: string;
  city: "Lagos" | "Abuja";
  region: string;
  lat: number;
  lng: number;
  intro: string;
  localNote: string;
  neighbourhoods: string[];
  popularMoves: string[];
  faqs: AreaFaq[];
};

const commonFaq = (name: string): AreaFaq[] => [
  {
    q: `How quickly can Packmyload get a crew to ${name}?`,
    a: `Where a team is already nearby we can reach ${name} in as little as 30 minutes for an on-demand move. Otherwise you can book any slot up to 30 days ahead and choose a morning, midday or afternoon arrival window.`,
  },
  {
    q: `Is my move in ${name} insured?`,
    a: `Yes. Every Packmyload move, including local runs inside ${name}, is backed by a goods-in-transit insurance policy from the moment your items are in our hands. Claims are generally settled within two weeks of receiving the claim form and documentation.`,
  },
  {
    q: `How is a ${name} move priced?`,
    a: `We quote after confirming volume, route and access at both ends — never a flat number over the phone. Home size, floor level and lift availability, packing materials, specialty items such as pianos or safes, and your timing all shape the final price.`,
  },
];

export const areas: Area[] = [
  {
    slug: "lekki",
    name: "Lekki",
    city: "Lagos",
    region: "Lagos",
    lat: 6.4409,
    lng: 3.4805,
    intro:
      "Packmyload runs insured home and office moves across Lekki daily — from Phase 1 walk-ups to high-rise apartments on Admiralty Way and estates along the Lekki-Epe Expressway.",
    localNote:
      "Lekki moves live and die on access: estate entry clearance, gate hours, lift booking and how close a truck can park. We confirm all of that before your date so the crew is not stuck at a boom gate on the clock.",
    neighbourhoods: [
      "Lekki Phase 1",
      "Admiralty Way",
      "Ikate & Elegushi",
      "Chevron & Chevy View",
      "Agungi & Osapa London",
      "Ikota & VGC",
    ],
    popularMoves: ["Lekki to Ikoyi", "Lekki to Ajah", "Lekki to Ikeja", "Lekki to Abuja"],
    faqs: commonFaq("Lekki"),
  },
  {
    slug: "victoria-island-ikoyi",
    name: "Victoria Island & Ikoyi",
    city: "Lagos",
    region: "Lagos",
    lat: 6.4281,
    lng: 3.4219,
    intro:
      "For Victoria Island and Ikoyi we handle serviced-apartment moves, corporate office relocations and high-value item packing — fine art, antiques, marble and glassware included.",
    localNote:
      "Most VI and Ikoyi buildings require a facilities permit, a service lift booking and after-hours working. We plan office moves in phases over evenings and weekends so your team keeps working.",
    neighbourhoods: [
      "Victoria Island",
      "Oniru & Maroko",
      "Ikoyi & Banana Island",
      "Parkview Estate",
      "Dolphin & Osborne",
      "Lagos Island business district",
    ],
    popularMoves: ["Ikoyi to Lekki", "VI to Ikeja GRA", "Ikoyi to Abuja", "VI office relocations"],
    faqs: commonFaq("Victoria Island & Ikoyi"),
  },
  {
    slug: "ikeja",
    name: "Ikeja",
    city: "Lagos",
    region: "Lagos",
    lat: 6.6018,
    lng: 3.3515,
    intro:
      "Ikeja is our mainland base of operations for household moves, office relocations around the GRA and Allen Avenue, and interstate departures from Lagos.",
    localNote:
      "Ikeja traffic decides your arrival window. We schedule mainland-to-island runs early, and airport-area collections are timed around flight schedules for international relocations.",
    neighbourhoods: [
      "Ikeja GRA",
      "Allen Avenue & Opebi",
      "Oregun & Alausa",
      "Maryland",
      "Ogba & Agidingbi",
      "Airport Road & Ajao Estate",
    ],
    popularMoves: ["Ikeja to Lekki", "Ikeja to Yaba", "Ikeja to Abuja", "Ikeja to Ibadan"],
    faqs: commonFaq("Ikeja"),
  },
  {
    slug: "yaba-surulere",
    name: "Yaba & Surulere",
    city: "Lagos",
    region: "Lagos",
    lat: 6.5095,
    lng: 3.3711,
    intro:
      "Yaba and Surulere moves are usually compact and stair-heavy — student rooms, shared flats and startup offices. We bring the right crew size instead of over-quoting a small job.",
    localNote:
      "Narrow streets and walk-up buildings are the norm here, so we confirm floor level and parking distance upfront. Junk removal and cleaning can be bundled to get your deposit back.",
    neighbourhoods: [
      "Yaba & Akoka",
      "Sabo & Onike",
      "Surulere & Ojuelegba",
      "Ebute Metta",
      "Itire & Lawanson",
      "Costain & Iponri",
    ],
    popularMoves: ["Yaba to Lekki", "Surulere to Ikeja", "Yaba to Abuja", "Student moves"],
    faqs: commonFaq("Yaba & Surulere"),
  },
  {
    slug: "ogudu-ketu",
    name: "Ogudu & Ketu",
    city: "Lagos",
    region: "Lagos",
    lat: 6.5833,
    lng: 3.3833,
    intro:
      "Our office sits on Hundeyin Street in Ogudu, so Ogudu, Ojota, Ketu and Magodo are the fastest areas for us to reach — often the same day you call.",
    localNote:
      "Because our crews and materials are stored here, on-demand requests in Ogudu and Ketu are the most likely to be filled within 30 minutes, and storage drop-offs need no extra trip.",
    neighbourhoods: [
      "Ogudu GRA",
      "Ojota & Alapere",
      "Ketu & Mile 12",
      "Magodo Phase 1 & 2",
      "Gbagada & Oworonshoki",
      "Anthony Village",
    ],
    popularMoves: ["Ogudu to Lekki", "Ketu to Ikeja", "Magodo to Ikoyi", "Ogudu to Abuja"],
    faqs: commonFaq("Ogudu & Ketu"),
  },
  {
    slug: "ajah-sangotedo",
    name: "Ajah & Sangotedo",
    city: "Lagos",
    region: "Lagos",
    lat: 6.4698,
    lng: 3.5852,
    intro:
      "Ajah, Sangotedo and Ibeju-Lekki moves cover new estates and first homes. We handle furniture assembly, appliance installation and utility set-up in the same visit.",
    localNote:
      "Corridor distance matters east of Ajah: we price on truck time along the Lekki-Epe Expressway, and estates that require gate approval are cleared in advance.",
    neighbourhoods: [
      "Ajah & Thomas Estate",
      "Sangotedo & Lagos Business School axis",
      "Abraham Adesanya",
      "Awoyaya & Lakowe",
      "Ibeju-Lekki",
      "Badore & Addo Road",
    ],
    popularMoves: ["Ajah to Lekki Phase 1", "Ajah to VI", "Sangotedo to Ikeja", "Ajah to Port Harcourt"],
    faqs: commonFaq("Ajah & Sangotedo"),
  },
  {
    slug: "alimosho-ikotun",
    name: "Alimosho & Ikotun",
    city: "Lagos",
    region: "Lagos",
    lat: 6.5426,
    lng: 3.2649,
    intro:
      "Alimosho, Ikotun, Egbeda and Ikeja-bound moves from the far mainland are a core route for us, including long mainland-to-island runs that need an early start.",
    localNote:
      "These are our longest in-state routes, so we sequence loading to start early and avoid a second day of truck hire. Packing materials are brought in full so nothing stalls mid-load.",
    neighbourhoods: [
      "Alimosho & Akowonjo",
      "Egbeda & Idimu",
      "Ikotun & Igando",
      "Ipaja & Ayobo",
      "Iyana Ipaja",
      "Abule Egba & Meiran",
    ],
    popularMoves: ["Alimosho to Lekki", "Ikotun to Ikeja", "Egbeda to Ajah", "Ipaja to Abuja"],
    faqs: commonFaq("Alimosho & Ikotun"),
  },
  {
    slug: "abuja",
    name: "Abuja",
    city: "Abuja",
    region: "FCT",
    lat: 9.0765,
    lng: 7.3986,
    intro:
      "Packmyload covers Abuja for household moves, government and corporate office relocations, storage and interstate runs to and from Lagos.",
    localNote:
      "Abuja moves often pair with a Lagos leg. We coordinate both ends on one booking, including vehicle transport, so your car and your furniture arrive on the same plan.",
    neighbourhoods: [
      "Maitama & Asokoro",
      "Wuse & Wuse 2",
      "Garki & Area 11",
      "Jabi & Utako",
      "Gwarinpa & Life Camp",
      "Lugbe & Kubwa",
    ],
    popularMoves: ["Abuja to Lagos", "Lagos to Abuja", "Abuja to Kaduna", "Abuja office moves"],
    faqs: commonFaq("Abuja"),
  },
];

export const areaBySlug = (slug: string) => areas.find((area) => area.slug === slug);
