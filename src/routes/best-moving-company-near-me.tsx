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
import { SITE_URL, services, site } from "@/lib/site-data";
import { chooseChecklist, lagosAreas, nearMeFaqs, nigeriaRoutes } from "@/lib/seo-data";

const title = "Best Moving Company Near Me | Packmyload Lagos & Abuja";
const description =
  "Looking for the best moving company near you in Lagos or Abuja? Packmyload sends insured, vetted movers to your street — on-demand in as little as 30 minutes, or booked up to 30 days ahead.";
const ogImage = `${SITE_URL}/images/coverge-pack.webp`;
const canonical = "/best-moving-company-near-me";

export const Route = createFileRoute("/best-moving-company-near-me")({
  head: () => ({
    meta: [
      { title },
      { name: "description", content: description },
      { property: "og:title", content: title },
      { property: "og:description", content: description },
      { property: "og:type", content: "article" },
      { property: "og:url", content: canonical },
      { property: "og:image", content: ogImage },
      { name: "twitter:card", content: "summary_large_image" },
      { name: "twitter:image", content: ogImage },
    ],
    links: [{ rel: "canonical", href: canonical }],
    scripts: [
      {
        type: "application/ld+json",
        children: JSON.stringify([
          {
            "@context": "https://schema.org",
            "@type": "MovingCompany",
            "@id": "https://www.packmyload.com/#organization",
            name: site.name,
            description,
            url: `https://www.packmyload.com${canonical}`,
            telephone: site.phone,
            email: site.email,
            address: {
              "@type": "PostalAddress",
              streetAddress: "2 Hundeyin St, Ogudu",
              addressLocality: "Lagos",
              addressRegion: "Lagos",
              postalCode: "105102",
              addressCountry: "NG",
            },
            areaServed: [
              ...lagosAreas.map((area) => ({ "@type": "Place", name: `${area}, Lagos` })),
              { "@type": "City", name: "Abuja" },
              { "@type": "Country", name: "Nigeria" },
            ],
            hasOfferCatalog: {
              "@type": "OfferCatalog",
              name: "Local moving services near you",
              itemListElement: services.map((service) => ({
                "@type": "Offer",
                itemOffered: {
                  "@type": "Service",
                  name: service.title,
                  description: service.short,
                },
              })),
            },
          },
          {
            "@context": "https://schema.org",
            "@type": "FAQPage",
            mainEntity: nearMeFaqs.map((faq) => ({
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
              { "@type": "ListItem", position: 2, name: "Best moving company near me", item: canonical },
            ],
          },
        ]),
      },
    ],
  }),
  component: NearMePage,
});

function NearMePage() {
  return (
    <>
      <PageHero
        eyebrow="Movers near you"
        title="Best moving company near me"
        body="Packmyload dispatches insured, vetted crews to your address across Lagos and Abuja — on-demand in as little as 30 minutes where a team is nearby, or scheduled up to 30 days ahead."
      />

      <section className="container-page py-16 sm:py-20">
        <Reveal className="mx-auto max-w-3xl rounded-4xl border border-border bg-card p-6 shadow-soft sm:p-10">
          <h2 className="font-display text-2xl font-semibold sm:text-3xl">
            The short answer for anyone searching &ldquo;movers near me&rdquo;
          </h2>
          <p className="mt-4 text-muted-foreground">
            If you are in Lagos or Abuja, Packmyload already covers your area. Every move is backed
            by a goods-in-transit insurance policy from the moment your items are in our hands. We
            quote after confirming your volume, route and access at both ends rather than a flat
            number over the phone, send trained and uniformed packers you can rate and tip after the
            job, and settle claims generally within two weeks of receiving the claim form and
            documentation. Packing, storage, cleaning, junk removal, vehicle transport and utility
            set-up are handled by the same team, so there is only one vendor to call.
          </p>
          <div className="mt-8 flex flex-wrap gap-3">
            <Button asChild size="lg">
              <Link to="/book">
                Get a quote for your address
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
            eyebrow="How to judge a local mover"
            title="Six checks before you book the closest mover you find"
            body="Distance matters far less than insurance, quoting and crew quality."
          />
          <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {chooseChecklist.map((item) => (
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
          eyebrow="Near you"
          title="Neighbourhoods our crews reach"
          body="Mainland to island in Lagos, plus Abuja and every state in Nigeria for long-distance moves."
        />
        <Reveal className="mt-10 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {lagosAreas.map((area) => (
            <div
              key={area}
              className="flex items-center gap-3 rounded-2xl border border-border bg-card px-4 py-3 text-sm"
            >
              <Check className="size-4 shrink-0 text-primary" aria-hidden="true" />
              {area}
            </div>
          ))}
        </Reveal>
        <p className="mt-8 text-sm text-muted-foreground">
          Moving out of town? We run{" "}
          <Link to="/moving-company-nigeria" className="font-medium text-primary underline">
            interstate routes across Nigeria
          </Link>{" "}
          including {nigeriaRoutes.slice(0, 4).join(", ")}. Staying local?{" "}
          <Link to="/moving-company-lagos" className="font-medium text-primary underline">
            See how Lagos moves are priced
          </Link>
          .
        </p>
      </section>

      <section className="container-page pb-16 sm:pb-24">
        <SectionHeading eyebrow="FAQs" title="Movers near me: common questions" />
        <Reveal className="mx-auto mt-10 max-w-3xl rounded-4xl border border-border bg-card p-4 shadow-soft sm:p-8">
          <Accordion type="single" collapsible className="w-full">
            {nearMeFaqs.map((faq, index) => (
              <AccordionItem key={faq.q} value={`near-me-faq-${index}`}>
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
