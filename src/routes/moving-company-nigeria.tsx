import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowRight, Check } from "lucide-react";
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
import { IMG, services, site } from "@/lib/site-data";
import { chooseChecklist, costFactors, nigeriaFaqs, nigeriaRoutes } from "@/lib/seo-data";

const title = "Moving Company in Nigeria | Interstate & International Movers";
const description =
  "Packmyload moves homes, offices and vehicles across Nigeria — Lagos to Abuja, Port Harcourt, Ibadan and every state — plus international relocations, all insured in transit.";
const ogImage = `${IMG}/images/Packmyload.com-home-office-relocations.webp`;
const canonical = "/moving-company-nigeria";

export const Route = createFileRoute("/moving-company-nigeria")({
  head: () => ({
    meta: [
      { title },
      { name: "description", content: description },
      { property: "og:title", content: title },
      { property: "og:description", content: description },
      { property: "og:type", content: "article" },
      { property: "og:url", content: canonical },
      { property: "og:image", content: ogImage },
      { name: "twitter:image", content: ogImage },
    ],
    links: [{ rel: "canonical", href: canonical }],
    scripts: [
      {
        type: "application/ld+json",
        children: JSON.stringify([
          {
            "@context": "https://schema.org",
            "@type": "Service",
            name: "Interstate and international moving services in Nigeria",
            serviceType: "Moving company",
            description,
            provider: {
              "@type": "MovingCompany",
              name: site.name,
              telephone: site.phone,
              email: site.email,
              address: {
                "@type": "PostalAddress",
                streetAddress: "2 Hundeyin St, Ogudu",
                addressLocality: "Lagos",
                postalCode: "105102",
                addressCountry: "NG",
              },
            },
            areaServed: { "@type": "Country", name: "Nigeria" },
            hasOfferCatalog: {
              "@type": "OfferCatalog",
              name: "Nigeria moving services",
              itemListElement: services.map((service) => ({
                "@type": "Offer",
                itemOffered: { "@type": "Service", name: service.title, description: service.short },
              })),
            },
          },
          {
            "@context": "https://schema.org",
            "@type": "FAQPage",
            mainEntity: nigeriaFaqs.map((faq) => ({
              "@type": "Question",
              name: faq.q,
              acceptedAnswer: { "@type": "Answer", text: faq.a },
            })),
          },
          {
            "@context": "https://schema.org",
            "@type": "BreadcrumbList",
            itemListElement: [
              { "@type": "ListItem", position: 1, name: "Home", item: "/" },
              {
                "@type": "ListItem",
                position: 2,
                name: "Moving company in Nigeria",
                item: canonical,
              },
            ],
          },
        ]),
      },
    ],
  }),
  component: NigeriaPage,
});

function NigeriaPage() {
  return (
    <>
      <PageHero
        eyebrow="Nigeria"
        title="Moving company in Nigeria"
        body="Interstate relocations from Lagos and Abuja to every state, vehicle transport, storage and international moves in and out of the country."
      />

      <section className="container-page py-16 sm:py-20">
        <Reveal className="mx-auto max-w-3xl rounded-4xl border border-border bg-card p-6 shadow-soft sm:p-10">
          <h2 className="font-display text-2xl font-semibold sm:text-3xl">
            How our interstate moves work
          </h2>
          <p className="mt-4 text-muted-foreground">
            Long-distance moving needs planning, not improvisation. We start with the quote process —
            gathering your volume, access at both ends and dates — then pack, inventory and load, run
            the route, and unpack and set up at destination. Your belongings are covered by a
            goods-in-transit insurance policy throughout, and long-distance moves can be paid after
            the move with Pack Now, Pay Later through our partnership with Alt Bank.
          </p>
          <div className="mt-8 flex flex-wrap gap-3">
            <Button asChild size="lg">
              <Link to="/book">
                Plan an interstate move <ArrowRight className="ml-2 size-4" aria-hidden="true" />
              </Link>
            </Button>
            <Button asChild size="lg" variant="outline">
              <a href={`tel:${site.phone}`}>Call {site.phoneDisplay}</a>
            </Button>
          </div>
        </Reveal>
      </section>

      <section className="container-page pb-16 sm:pb-20">
        <SectionHeading
          eyebrow="Routes"
          title="Popular interstate routes"
          body="We cover any state in Nigeria — these are the routes we run most often."
        />
        <Reveal className="mt-10 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
          {nigeriaRoutes.map((route) => (
            <div
              key={route}
              className="flex items-center gap-3 rounded-2xl border border-border bg-card px-4 py-3 text-sm"
            >
              <Check className="size-4 shrink-0 text-primary" aria-hidden="true" />
              {route}
            </div>
          ))}
        </Reveal>
        <p className="mt-6 text-sm text-muted-foreground">
          Moving within one city?{" "}
          <Link to="/moving-company-lagos" className="font-medium text-primary underline">
            See our Lagos moving service
          </Link>
          .
        </p>
      </section>

      <section className="bg-secondary/40 py-16 sm:py-20">
        <div className="container-page">
          <SectionHeading
            eyebrow="Pricing"
            title="What decides the cost of a long-distance move"
            body="Distance is only part of it — these factors shape every interstate quote."
          />
          <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {costFactors.map((item) => (
              <Reveal
                key={item.title}
                className="rounded-3xl border border-border bg-background p-6 shadow-soft"
              >
                <h3 className="font-display text-lg font-semibold">{item.title}</h3>
                <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{item.body}</p>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      <section className="container-page py-16 sm:py-20">
        <SectionHeading
          eyebrow="Standards"
          title="How to compare movers before you book"
          body="The same checks apply whether you're moving one state over or abroad."
        />
        <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {chooseChecklist.map((item) => (
            <Reveal
              key={item.title}
              className="rounded-3xl border border-border bg-card p-6 shadow-soft"
            >
              <h3 className="font-display text-lg font-semibold">{item.title}</h3>
              <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{item.body}</p>
            </Reveal>
          ))}
        </div>
      </section>

      <section className="container-page pb-16 sm:pb-24">
        <SectionHeading eyebrow="FAQs" title="Moving across Nigeria: common questions" />
        <Reveal className="mx-auto mt-10 max-w-3xl rounded-4xl border border-border bg-card p-4 shadow-soft sm:p-8">
          <Accordion type="single" collapsible className="w-full">
            {nigeriaFaqs.map((faq, index) => (
              <AccordionItem key={faq.q} value={`nigeria-faq-${index}`}>
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
      </section>

      <CtaBand />
    </>
  );
}
