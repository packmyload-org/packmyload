export const IMG = "https://www.packmyload.com";

export const site = {
  name: "Packmyload",
  phone: "+2347007225776",
  phoneDisplay: "0700 722 5776",
  email: "enquiries@packmyload.com",
  address: "2 Hundeyin St, Ogudu, Lagos 105102, Nigeria",
  cities: "Lagos & Abuja, Nigeria",
  socials: {
    instagram: "https://www.instagram.com/packmyload/",
    facebook: "https://www.facebook.com/packmyload",
    twitter: "https://twitter.com/packmyload",
    linkedin: "https://www.linkedin.com/company/packmyload-com/about/",
  },
};

export const heroImages = [1, 2, 3, 4, 5].map((n) => ({
  src: `${IMG}/images/team/hero-img${n}.webp`,
  alt: `Moving company in Lagos & Abuja Nigeria: people discovering Packmyload, stage ${n}`,
}));

export const steps = [
  {
    step: "Step 1",
    title: "Select your addresses",
    body: "Select pick up and drop off locations.",
    image: `${IMG}/images/select-address.webp`,
    alt: "Step to select pick up and drop off locations",
  },
  {
    step: "Step 2",
    title: "Select a schedule",
    body: "Reserve a time that suits your schedule.",
    image: `${IMG}/images/select-schedule2.webp`,
    alt: "Step to reserve a time that suits your schedule",
  },
  {
    step: "Step 3",
    title: "Finalize your move",
    body: "Edit your move if necessary.",
    image: `${IMG}/images/final-move.webp`,
    alt: "Step to edit your move if necessary",
  },
];

export const marketplaceBenefits = [
  "Moving Services",
  "Connect utilities",
  "Storage",
  "Travel & Protocol",
  "Handy-Men",
  "School-search",
  "Home-search",
  "Laundry",
  "Employee-relocation",
  "Area Orientation",
  "Declutter",
  "Visa/Travel Support",
];

export const features = [
  {
    icon: `${IMG}/images/secure.svg`,
    title: "Protection",
    body: "Each move is backed by a Goods-in-transit insurance policy from the moment your items are in our hands.",
  },
  {
    icon: `${IMG}/images/ratetip.svg`,
    title: "Pay, rate & tip",
    body: "When your packing is complete you'll be asked to rate your Packer with the option to tip them in the app for a job well done.",
  },
  {
    icon: `${IMG}/images/calender.svg`,
    title: "30 mins or 30 days",
    body: "Schedule your pack ahead of time up to 30 days in advance or request on-demand and we'll arrive in as little as 30 minutes.",
  },
];

export type Service = {
  slug: string;
  path: string;
  title: string;
  short: string;
  image: string;
  intro: string;
  sections: { heading: string; body: string }[];
  includes: string[];
};

const banner = (key: string) =>
  `${IMG}/images/moving-company-lagos-nigeria-packmyload.com-${key}-banner_image.webp`;

export const services: Service[] = [
  {
    slug: "home-moves",
    path: "/home-moves",
    title: "Home Relocations",
    short: "Full-service household moves within a city or across states.",
    image: banner("home_moves"),
    intro:
      "Whether it's just a few items that need to be moved to another room, or an entire apartment or house, Packmyload Moving is the cost-effective option. Our moving services eliminate the hassle of renting a van and doing the heavy lifting yourself.",
    sections: [
      {
        heading: "Residential / local move",
        body: "Any relocation within a state is a local move. Whether we have to climb the stairs or not, it requires care and professionalism. Packmyload offers a full range of local moving services within Lagos including full packing and set up services. We also offer professional packing for fragile items like fine art, antiques, marble and glassware. Whether you're moving from the 6th to the 12th floor or from Alimosho to Lekki, Packmyload is the best way to get there.",
      },
      {
        heading: "Interstate / long distance move",
        body: "Whether you are moving just across state lines or across the country, our interstate movers can help transport your belongings to your new home with ease and simplicity. Interstate moving requires proper planning to make it a smooth and stress-free experience. Starting with the moving quote process, we partner with you to gather all the information needed to complete your long distance move on budget and on time.",
      },
    ],
    includes: [
      "Packing and unpacking",
      "Storage services",
      "Fragile & specialty item handling",
      "Furniture dismantling and set up",
    ],
  },
  {
    slug: "office-moves",
    path: "/office-moves",
    title: "Office Relocations",
    short: "Planned, after-hours capable office and workplace moves.",
    image: banner("office_moves"),
    intro:
      "Move your workplace with minimal downtime. We plan around your business hours, label and track every crate, and set your team up ready to work in the new space.",
    sections: [
      {
        heading: "Planned with your operations in mind",
        body: "From a single floor to a whole headquarters, our project leads survey the site, agree a sequence with your facilities team and move you in phases so business continues. IT equipment, server racks, workstations, files and fittings are packed and inventoried.",
      },
      {
        heading: "Set up and ready to work",
        body: "We reassemble desks and shelving, position workstations to your floor plan and clear all packaging so your team walks into a working office on day one.",
      },
    ],
    includes: [
      "Site survey and move plan",
      "Crate hire and labelled inventory",
      "IT and workstation handling",
      "Weekend and after-hours moves",
    ],
  },
  {
    slug: "store-delivery",
    path: "/store-delivery",
    title: "Store Delivery",
    short: "Reliable last-mile delivery for retailers and their customers.",
    image: banner("store_moves"),
    intro:
      "Retailers use Packmyload as their delivery arm. We collect from your store or warehouse and deliver to your customers with the care your brand deserves.",
    sections: [
      {
        heading: "Last-mile that protects your brand",
        body: "Uniformed, trained handlers deliver furniture, appliances and bulky goods, install where required and remove packaging. Every delivery is confirmed so your team always knows where an order is.",
      },
      {
        heading: "Flexible capacity",
        body: "Scale up for sale periods and festive peaks without adding vehicles to your books. Same-day and scheduled delivery windows are available across Lagos and Abuja.",
      },
    ],
    includes: [
      "Scheduled and same-day windows",
      "Bulky goods and appliance delivery",
      "Packaging removal",
      "Delivery confirmation",
    ],
  },
  {
    slug: "Interstate-Car-Transport",
    path: "/Interstate-Car-Transport",
    title: "Interstate Car Transport",
    short: "Move your vehicle between states without driving it there.",
    image: banner("students_move"),
    intro:
      "Relocating and don't want to add hundreds of kilometres to your odometer? We move your vehicle between states safely and hand it back exactly as we collected it.",
    sections: [
      {
        heading: "Door to door vehicle transport",
        body: "We collect your car from your address, transport it interstate and deliver it to your new location. Vehicles are inspected and documented at pick up and again on delivery, so condition is never in question.",
      },
      {
        heading: "Coordinated with your move",
        body: "Book vehicle transport alongside your household move and we'll sequence both so your car arrives when you do.",
      },
    ],
    includes: [
      "Door to door collection and delivery",
      "Condition report at both ends",
      "Goods-in-transit coverage",
      "Bundled with household moves",
    ],
  },
  {
    slug: "Junk-moves",
    path: "/Junk-moves",
    title: "Junk Removal",
    short: "Clear out what you're not taking with you.",
    image: banner("junk_removal"),
    intro:
      "Moving is the best time to declutter. We haul away the furniture, appliances and general junk you no longer need, and dispose of it responsibly.",
    sections: [
      {
        heading: "One visit, cleared space",
        body: "Point at what should go. Our team lifts, carries and loads it, sweeps up afterwards and leaves the space ready for handover or renovation.",
      },
      {
        heading: "Responsible disposal",
        body: "Usable items are routed for donation or resale where possible; the rest goes to approved disposal partners.",
      },
    ],
    includes: [
      "Furniture and appliance removal",
      "Post-renovation debris",
      "Office clear-outs",
      "Donation and recycling routing",
    ],
  },
  {
    slug: "wedding-handling",
    path: "/wedding-handling",
    title: "Wedding Gifts Handling",
    short: "Your gifts collected, packed and delivered safely after the party.",
    image: banner("wedding_gift"),
    intro:
      "On your wedding day the last thing you should think about is who is carrying the gifts home. Our team handles collection, packing and delivery of every item.",
    sections: [
      {
        heading: "At the venue",
        body: "Our handlers receive gifts as they arrive, record them, pack fragile items properly and keep everything together and supervised until it leaves the venue.",
      },
      {
        heading: "To your home or storage",
        body: "Gifts are delivered to your home, your family's home or into short-term storage while you travel. Unpacking and set up are available on request.",
      },
    ],
    includes: [
      "On-site gift receiving",
      "Itemised record",
      "Fragile packing",
      "Delivery or short-term storage",
    ],
  },
  {
    slug: "international-relocations",
    path: "/international-relocations",
    title: "International Relocations",
    short: "Door to door moves in and out of Nigeria.",
    image: banner("international_moves"),
    intro:
      "Relocating abroad, or moving home to Nigeria? We coordinate export packing, documentation and freight with vetted partners at destination.",
    sections: [
      {
        heading: "Export packing and documentation",
        body: "Items are packed to international standards, inventoried and prepared with the paperwork your shipment needs for customs at both ends.",
      },
      {
        heading: "Air and sea freight",
        body: "Choose air freight for speed or sea freight for volume. We advise on the right mix, keep you updated in transit and arrange delivery and unpacking at destination.",
      },
    ],
    includes: [
      "Export-grade packing",
      "Customs documentation support",
      "Air and sea freight options",
      "Destination delivery and unpacking",
    ],
  },
  {
    slug: "cleaning",
    path: "/cleaning",
    title: "Cleaning Services",
    short: "Move-in and move-out deep cleaning.",
    image: banner("cleaning"),
    intro:
      "Hand back a spotless property, or walk into a fresh one. Our cleaning teams work around your moving schedule.",
    sections: [
      {
        heading: "Move-out cleaning",
        body: "Deep clean of an emptied property so it meets handover expectations: kitchens, bathrooms, floors, windows, fittings and cupboards inside and out.",
      },
      {
        heading: "Move-in cleaning",
        body: "We clean before your items arrive, so your furniture goes into a clean, sanitised home.",
      },
    ],
    includes: [
      "Kitchen and bathroom deep clean",
      "Floors, windows and fittings",
      "Post-renovation cleaning",
      "Scheduled around your move",
    ],
  },
  {
    slug: "storage",
    path: "/storage",
    title: "Storage",
    short: "Short and long-term storage between moves.",
    image: banner("storage_moves"),
    intro:
      "Dates that don't line up? Store your belongings with us for as long as you need and we'll deliver them when your new space is ready.",
    sections: [
      {
        heading: "Secure, inventoried storage",
        body: "Everything that goes into storage is packed, labelled and recorded, so you know exactly what is held and can request specific items back.",
      },
      {
        heading: "By the week or by the year",
        body: "Flexible terms for a few days between handovers, or months while you're abroad. Collection and redelivery are handled by the same team that packed you.",
      },
    ],
    includes: [
      "Short and long-term terms",
      "Itemised inventory",
      "Collection and redelivery",
      "Goods-in-transit coverage in transit",
    ],
  },
];

export const testimonials = [
  {
    name: "Eno Sabo",
    body: "So let me just say these guys are amazing. Mr. Shogo was very polite and gentle. They were quick, professional and helpful. They did an unbelievable job and we will be hiring them for all future moves.",
  },
  {
    name: "Chukwuma Azodo",
    body: "The driver arrived super early and in great spirits. He handled my items with great care and the move was successful. I am happy about Packmyload services and would recommend it to anyone. Thank you!",
  },
  {
    name: "Olajide Olatunji",
    body: "Never have I looked forward to packing, but these guys did it smoothly without any hassle and were timely also. Love their work ethics and professionalism. Best office relocation.",
  },
  {
    name: "Olayinka Adu",
    body: "No regrets contacting these guys. Excellent customer service, friendly, hardworking and efficient moving team. They were prompt and pretty timely. I will refer Packmyload to friends and family any day!",
  },
  {
    name: "Millie Slade",
    body: "Thank you guys for doing an amazing job getting my mum moved. The process was stress free and easy. They were patient and very considerate and I will recommend them anytime any day!",
  },
  {
    name: "Lawrence Olugbenga",
    body: "Patrick and the team were amazing. Arrived early, worked hard throughout the day and did not leave till I was satisfied. If you need a great moving company, I strongly recommend Packmyload.",
  },
  {
    name: "Tobi Adeniyi",
    body: "We had to quickly move and searched the internet for a moving company. First impression of the website was really great, and the customer service up till the moving process was superb.",
  },
  {
    name: "Saheed Aloba",
    body: "If there was 10 stars, it would still not be enough. The guys at Packmyload did amazing and we didn't feel like we were moving. It was an ace team led by Sogo and nothing was much trouble for them.",
  },
  {
    name: "Ayodeji Ajibade",
    body: "Packing and unpacking has been a nightmare since my secondary school days. I trusted Packmyload with my recent relocation and I was very impressed. No damages, no complaints, very professional.",
  },
];

export const galleryImages = [
  `${IMG}/images/about/packmyload_1696572786359.webp`,
  `${IMG}/images/about/packmyload_1696572694895.webp`,
  `${IMG}/images/partner/packmyload_1695798593791.webp`,
  `${IMG}/images/partner/packmyload_1697583737398.webp`,
  `${IMG}/images/partner/packmyload_1697583683638.webp`,
  `${IMG}/images/coverge-pack.webp`,
  `${IMG}/images/Packmyload.com-home-office-relocations.webp`,
  `${IMG}/images/packman.webp`,
];

export const faqs = [
  {
    q: "How do I get a moving quote?",
    a: "Enter your pick up and drop off locations and your preferred date in the quote bar on the home page, or chat with us. We confirm the details and send a quote for your move.",
  },
  {
    q: "Are my belongings insured?",
    a: "Yes. Each move is backed by a Goods-in-transit insurance policy from the moment your items are in our hands.",
  },
  {
    q: "How far in advance should I book?",
    a: "You can schedule up to 30 days in advance, or request on-demand and we'll arrive in as little as 30 minutes where a team is available.",
  },
  {
    q: "Can I pay after my move?",
    a: "Yes, for long-distance moves. Choose Pack Now, Pay Later when you pick your moving quote, through our partnership with Alt Bank.",
  },
  {
    q: "Do you pack for me?",
    a: "We offer full packing and unpacking, including professional packing for fragile items like fine art, antiques, marble and glassware.",
  },
  {
    q: "How are claims handled?",
    a: "Claim settlements are fair and accurate and generally processed within 2 weeks of receipt of the claim form and required documentation.",
  },
  {
    q: "Which areas do you cover?",
    a: "We operate across Lagos and Abuja, with interstate moves to any state in Nigeria and international relocations in and out of the country.",
  },
];
