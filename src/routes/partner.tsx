import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowRight, Check } from "lucide-react";
import { CtaBand } from "@/components/site/CtaBand";
import { PageHero } from "@/components/site/PageHero";
import { Reveal } from "@/components/site/Reveal";
import { SectionHeading } from "@/components/site/SectionHeading";
import { IMG, abs } from "@/lib/site-data";

const title = "Become a Business Partner | Packmyload";
const description =
  "Find out how your business can benefit by partnering with Packmyload — business & retail delivery, integrations and lead monetization, transportation and logistics.";
const ogImage = `${IMG}/images/partner/packmyload_1695798527485.webp`;

const categories = [
  {
    heading: "Business & Retail",
    items: ["Furniture companies", "Big Box Stores", "Any other business that needs to move large items"],
  },
  {
    heading: "Integrations & Lead Monetization",
    items: ["Prop-tech", "Property Managers", "Storage Companies"],
  },
  {
    heading: "Transportation & Logistics",
    items: ["Logistics Companies", "Courier Services", "Transportation Providers"],
  },
];

const blocks = [
  {
    heading: "Business & Retail",
    list: [
      "Residential moves (apartments, homes, condos)",
      "Moving belongings into storage",
      "One-off deliveries (piece of furniture)",
    ],
    body: "Packmyload can manage your business delivery logistics for you. If you deliver large items to your clients but you don't want to waste time managing the moves.",
    image: `${IMG}/images/partner/packmyload_1695798527485.webp`,
  },
  {
    heading: "Integration & Lead Monetization",
    list: [
      "Residential moves (apartments, homes, condos)",
      "Moving belongings into storage",
      "One off deliveries (piece of furniture)",
    ],
    body: "You don't have to be in the space to be a part of the moving and delivery ecosystem. If you have leads and users that move often, you can get a commission for each user you send our way.",
    image: `${IMG}/images/partner/packmyload_1695798593791.webp`,
  },
];

export const Route = createFileRoute("/partner")({
  head: () => ({
    meta: [
      { title },
      { name: "description", content: description },
      { property: "og:title", content: title },
      { property: "og:description", content: description },
      { property: "og:type", content: "website" },
      { property: "og:url", content: "https://www.packmyload.com/partner" },
      { property: "og:image", content: abs(ogImage) },
      { name: "twitter:card", content: "summary_large_image" },
      { name: "twitter:image", content: abs(ogImage) },
      { name: "twitter:title", content: title },
      { name: "twitter:description", content: description },
    ],
    links: [{ rel: "canonical", href: "https://www.packmyload.com/partner" }],
  }),
  component: PartnerPage,
});

function PartnerPage() {
  return (
    <>
      <PageHero
        eyebrow="Partner with us"
        title="Become a Business Partner"
        body="Find out how your business can benefit by partnering with Packmyload."
      >
        <Link
          to="/contact"
          className="inline-flex items-center gap-2 rounded-full bg-accent px-5 py-3 text-sm font-semibold text-accent-foreground transition-colors hover:bg-accent/90"
        >
          Talk to a representative
          <ArrowRight className="size-4" aria-hidden="true" />
        </Link>
      </PageHero>

      <section className="container-page py-16 sm:py-24">
        <div className="grid gap-6 md:grid-cols-3">
          {categories.map((category, index) => (
            <Reveal key={category.heading} delay={index * 70}>
              <div className="h-full rounded-3xl border border-border bg-card p-7 shadow-sm">
                <h2 className="text-lg font-semibold text-foreground">{category.heading}</h2>
                <ul className="mt-4 space-y-2 text-sm text-muted-foreground">
                  {category.items.map((item) => (
                    <li key={item} className="flex gap-2">
                      <Check className="mt-0.5 size-4 shrink-0 text-accent" aria-hidden="true" />
                      {item}
                    </li>
                  ))}
                </ul>
              </div>
            </Reveal>
          ))}
        </div>
      </section>

      <section className="bg-secondary/40 py-16 sm:py-24">
        <div className="container-page space-y-16">
          {blocks.map((block, index) => (
            <div
              key={block.heading}
              className="grid items-center gap-10 lg:grid-cols-2"
            >
              <Reveal
                className={
                  index % 2 === 1
                    ? "overflow-hidden rounded-4xl shadow-lift lg:order-2"
                    : "overflow-hidden rounded-4xl shadow-lift"
                }
              >
                <img
                  src={block.image}
                  alt={`Packmyload partnership: ${block.heading.toLowerCase()}`}
                  width={1000}
                  height={700}
                  className="size-full object-cover"
                />
              </Reveal>
              <Reveal delay={80}>
                <h2 className="text-2xl font-semibold text-foreground sm:text-3xl">
                  {block.heading}
                </h2>
                <ul className="mt-5 space-y-2 text-sm text-muted-foreground">
                  {block.list.map((item) => (
                    <li key={item} className="flex gap-2">
                      <Check className="mt-0.5 size-4 shrink-0 text-accent" aria-hidden="true" />
                      {item}
                    </li>
                  ))}
                </ul>
                <p className="mt-5 text-base leading-relaxed text-muted-foreground">{block.body}</p>
              </Reveal>
            </div>
          ))}
        </div>
      </section>

      <section className="container-page pt-16 sm:pt-24">
        <SectionHeading
          eyebrow="Next step"
          title="Talk to a representative"
          body="Tell us about your business and the volume you move. We'll design a partnership that fits."
        />
        <div className="mt-8 flex justify-center">
          <Link
            to="/contact"
            className="inline-flex items-center gap-2 rounded-full bg-primary px-6 py-3 text-sm font-semibold text-primary-foreground transition-colors hover:bg-primary/90"
          >
            Contact us
            <ArrowRight className="size-4" aria-hidden="true" />
          </Link>
        </div>
      </section>

      <CtaBand
        title="Partner with a team your customers will thank you for"
        body="Uniformed, insured and tracked — every delivery reflects your brand."
      />
    </>
  );
}
