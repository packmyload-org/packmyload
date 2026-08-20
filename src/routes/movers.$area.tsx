import { createFileRoute, Link, notFound } from "@tanstack/react-router";
import { ArrowRight, Check, MapPin } from "lucide-react";
import { CtaBand } from "@/components/site/CtaBand";
import { PageHero } from "@/components/site/PageHero";
import { Reveal } from "@/components/site/Reveal";
import { SectionHeading } from "@/components/site/SectionHeading";
import { Button } from "@/components/ui/button";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { areaBySlug } from "@/lib/areas-data";
import { SITE_URL, services, site } from "@/lib/site-data";
import { costFactors } from "@/lib/seo-data";

const ogImage = `${SITE_URL}/images/coverge-pack.webp`;

export const Route = createFileRoute("/movers/$area")({
  loader: ({ params }) => {
    const area = areaBySlug(params.area);
    if (!area) throw notFound();
    return { area };
  },
  head: ({ params, loaderData }) => {
    const canonical = `${SITE_URL}/movers/${params.area}`;
    if (!loaderData) {
      return {
        meta: [{ title: "Area unavailable | Packmyload" }, { name: "robots", content: "noindex" }],
      };
    }
    const { area } = loaderData;
    const title = `Moving Company in ${area.name} | Movers Near Me — Packmyload`;
    const description = `Insured movers in ${area.name}, ${area.city}. Packmyload handles home and office moves, packing, storage and junk removal in ${area.neighbourhoods.slice(0, 3).join(", ")} — on demand in as little as 30 minutes or booked 30 days ahead.`;

    return {
      meta: [
        { title },
        { name: "description", content: description },
        { property: "og:title", content: title },
        { property: "og:description", content: description },
        { property: "og:type", content: "article" },
        { property: "og:url", content: canonical },
        { property: "og:image", content: ogImage },
        { name: "twitter:card", content: "summary_large_image" },
        { name: "twitter:title", content: title },
        { name: "twitter:description", content: description },
        { name: "twitter:image", content: ogImage },
      ],
      links: [{ rel: "canonical", href: canonical }],
      scripts: [
        {
          type: "application/ld+json",
          children: JSON.stringify([
            {
              "@context": "https://schema.org",
              "@type": ["LocalBusiness", "MovingCompany"],
              "@id": `${canonical}#business`,
              name: `${site.name} — movers in ${area.name}`,
              description,
              url: canonical,
              image: ogImage,
              telephone: site.phone,
              email: site.email,
              priceRange: "₦₦",
              currenciesAccepted: "NGN",
              address: {
                "@type": "PostalAddress",
                streetAddress: "2 Hundeyin St, Ogudu",
                addressLocality: "Lagos",
                addressRegion: "Lagos",
                postalCode: "105102",
                addressCountry: "NG",
              },
              geo: { "@type": "GeoCoordinates", latitude: area.lat, longitude: area.lng },
              areaServed: [
                { "@type": "Place", name: `${area.name}, ${area.city}` },
                ...area.neighbourhoods.map((hood) => ({ "@type": "Place", name: hood })),
              ],
              openingHoursSpecification: [
                {
                  "@type": "OpeningHoursSpecification",
                  dayOfWeek: [
                    "Monday",
                    "Tuesday",
                    "Wednesday",
                    "Thursday",
                    "Friday",
                    "Saturday",
                  ],
                  opens: "08:00",
                  closes: "18:00",
                },
              ],
              sameAs: Object.values(site.socials),
              parentOrganization: {
                "@type": "Organization",
                name: site.name,
                url: `${SITE_URL}/`,
              },
            },
            {
              "@context": "https://schema.org",
              "@type": "Service",
              "@id": `${canonical}#service`,
              name: `Moving services in ${area.name}`,
              serviceType: "Moving company",
              description,
              provider: { "@id": `${canonical}#business` },
              areaServed: { "@type": "Place", name: `${area.name}, ${area.city}, Nigeria` },
              hasOfferCatalog: {
                "@type": "OfferCatalog",
                name: `${area.name} moving services`,
                itemListElement: services.map((service) => ({
                  "@type": "Offer",
                  itemOffered: {
                    "@type": "Service",
                    name: service.title,
                    description: service.short,
                    url: `${SITE_URL}${service.path}`,
                  },
                })),
              },
            },
            {
              "@context": "https://schema.org",
              "@type": "FAQPage",
              mainEntity: area.faqs.map((faq) => ({
                "@type": "Question",
                name: faq.q,
                acceptedAnswer: { "@type": "Answer", text: faq.a },
              })),
            },
            {
              "@context": "https://schema.org",
              "@type": "BreadcrumbList",
              itemListElement: [
                { "@type": "ListItem", position: 1, name: "Home", item: `${SITE_URL}/` },
                { "@type": "ListItem", position: 2, name: "Service areas", item: `${SITE_URL}/movers` },
                { "@type": "ListItem", position: 3, name: `Movers in ${area.name}`, item: canonical },
              ],
            },
          ]),
        },
      ],
    };
  },
  component: AreaPage,
});

function AreaPage() {
  const { area } = Route.useLoaderData();

  return (
    <>
      <PageHero
        eyebrow={`${area.city} · ${area.region}`}
        title={`Moving company in ${area.name}`}
        body={area.intro}
      />

      <section className="container-page py-16 sm:py-20">
        <Reveal className="mx-auto max-w-3xl rounded-4xl border border-border bg-card p-6 shadow-soft sm:p-10">
          <h2 className="font-display text-2xl font-semibold sm:text-3xl">
            Booking movers in {area.name}
          </h2>
          <p className="mt-4 text-muted-foreground">{area.localNote}</p>
          <p className="mt-4 text-muted-foreground">
            Every {area.name} job is covered by goods-in-transit insurance from pick-up, run by
            trained, uniformed packers you can rate and tip, and quoted only after we confirm volume,
            route and access. Packing, storage, cleaning, junk removal, vehicle transport and utility
            set-up are handled by the same team.
          </p>
          <div className="mt-8 flex flex-wrap gap-3">
            <Button asChild size="lg">
              <Link to="/book">
                Get a {area.name} quote
                <ArrowRight className="ml-2 size-4" aria-hidden="true" />
              </Link>
            </Button>
            <Button asChild size="lg" variant="outline">
              <a href={`tel:${site.phone}`}>Call {site.phoneDisplay}</a>
            </Button>
          </div>
        </Reveal>
      </section>

      <section className="bg-secondary/40 py-16 sm:py-20">
        <div className="container-page">
          <SectionHeading
            eyebrow="Coverage"
            title={`Streets and estates we reach in ${area.name}`}
            body="If your address is not listed, call us — coverage extends beyond these landmarks."
          />
          <Reveal className="mt-10 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {area.neighbourhoods.map((hood) => (
              <div
                key={hood}
                className="flex items-center gap-3 rounded-2xl border border-border bg-background px-4 py-3 text-sm"
              >
                <MapPin className="size-4 shrink-0 text-primary" aria-hidden="true" />
                {hood}
              </div>
            ))}
          </Reveal>
          <div className="mt-8 flex flex-wrap gap-2">
            {area.popularMoves.map((move) => (
              <span
                key={move}
                className="inline-flex items-center gap-2 rounded-full border border-border bg-card px-4 py-2 text-sm"
              >
                <Check className="size-4 text-primary" aria-hidden="true" />
                {move}
              </span>
            ))}
          </div>
        </div>
      </section>

      <section className="container-page py-16 sm:py-20">
        <SectionHeading
          eyebrow="Pricing"
          title={`What shapes the cost of a move in ${area.name}`}
          body="We quote per move, not per postcode. These six factors decide your price."
        />
        <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {costFactors.map((item) => (
            <Reveal key={item.title} className="rounded-3xl border border-border bg-card p-6 shadow-soft">
              <h3 className="font-display text-lg font-semibold">{item.title}</h3>
              <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{item.body}</p>
            </Reveal>
          ))}
        </div>
      </section>

      <section className="container-page pb-16 sm:pb-20">
        <SectionHeading
          eyebrow="Services"
          title={`What we handle in ${area.name}`}
          body="One team for the move and everything around it."
        />
        <div className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {services.map((service) => (
            <Link
              key={service.slug}
              to={service.path}
              className="rounded-3xl border border-border bg-card p-6 shadow-soft transition-colors hover:border-primary"
            >
              <h3 className="font-display text-lg font-semibold">{service.title}</h3>
              <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{service.short}</p>
              <span className="mt-4 inline-flex items-center text-sm font-medium text-primary">
                View {service.title} details
                <ArrowRight className="ml-1.5 size-4" aria-hidden="true" />
              </span>
            </Link>
          ))}
        </div>
      </section>

      <section className="container-page pb-16 sm:pb-24">
        <SectionHeading eyebrow="FAQs" title={`Moving in ${area.name}: common questions`} />
        <Reveal className="mx-auto mt-10 max-w-3xl rounded-4xl border border-border bg-card p-4 shadow-soft sm:p-8">
          <Accordion type="single" collapsible className="w-full">
            {area.faqs.map((faq, index) => (
              <AccordionItem key={faq.q} value={`area-faq-${index}`}>
                <AccordionTrigger className="text-left text-base font-semibold">
                  {faq.q}
                </AccordionTrigger>
                <AccordionContent className="text-sm leading-relaxed text-muted-foreground">
                  {faq.a}
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </Reveal>
        <p className="mx-auto mt-8 max-w-3xl text-sm text-muted-foreground">
          Nearby pages:{" "}
          <Link to="/movers" className="font-medium text-primary underline">
            all Packmyload service areas
          </Link>
          ,{" "}
          <Link to="/moving-company-lagos" className="font-medium text-primary underline">
            moving company in Lagos
          </Link>
          ,{" "}
          <Link to="/moving-company-nigeria" className="font-medium text-primary underline">
            interstate moving across Nigeria
          </Link>{" "}
          and{" "}
          <Link to="/best-moving-company-near-me" className="font-medium text-primary underline">
            best moving company near me
          </Link>
          .
        </p>
      </section>

      <CtaBand />
    </>
  );
}
