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
import { IMG,
  SITE_URL, services, site } from "@/lib/site-data";
import { chooseChecklist, costFactors, lagosAreas, lagosFaqs } from "@/lib/seo-data";

const title = "Moving Company in Lagos | Insured Home & Office Movers";
const description =
  "Packmyload is a Lagos moving company offering insured home and office relocations, packing, storage and junk removal across Lekki, Ikoyi, Ikeja, Yaba, Ogudu, Alimosho and Ikorodu.";
const ogImage = `${SITE_URL}/images/Packmyload.com-home-office-relocations.webp`;
const canonical = "/moving-company-lagos";

export const Route = createFileRoute("/moving-company-lagos")({
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
            name: "Moving services in Lagos",
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
            areaServed: { "@type": "City", name: "Lagos", containedInPlace: "Nigeria" },
            hasOfferCatalog: {
              "@type": "OfferCatalog",
              name: "Lagos moving services",
              itemListElement: services.map((service) => ({
                "@type": "Offer",
                itemOffered: { "@type": "Service", name: service.title, description: service.short },
              })),
            },
          },
          {
            "@context": "https://schema.org",
            "@type": "FAQPage",
            mainEntity: lagosFaqs.map((faq) => ({
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
              { "@type": "ListItem", position: 2, name: "Moving company in Lagos", item: canonical },
            ],
          },
        ]),
      },
    ],
  }),
  component: LagosPage,
});

function LagosPage() {
  return (
    <>
      <PageHero
        eyebrow="Lagos"
        title="Moving company in Lagos"
        body="Insured home and office relocations across mainland and island Lagos, with packing, storage, cleaning and junk removal handled by one team."
      />

      <section className="container-page py-16 sm:py-20">
        <Reveal className="mx-auto max-w-3xl rounded-4xl border border-border bg-card p-6 shadow-soft sm:p-10">
          <h2 className="font-display text-2xl font-semibold sm:text-3xl">
            What to look for in a Lagos mover
          </h2>
          <p className="mt-4 text-muted-foreground">
            Every Packmyload move in Lagos is backed by a goods-in-transit insurance policy from the
            moment your items are in our hands. We quote after understanding your volume, route and
            access at both ends, send trained and uniformed packers you can rate and tip, and settle
            claims generally within two weeks of receiving the claim form and documentation. You can
            book up to 30 days ahead or request on-demand and we arrive in as little as 30 minutes
            where a team is nearby.
          </p>
          <div className="mt-8 flex flex-wrap gap-3">
            <Button asChild size="lg">
              <Link to="/book">
                Get a Lagos moving quote <ArrowRight className="ml-2 size-4" aria-hidden="true" />
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
          eyebrow="Checklist"
          title="Six things a good moving company should give you"
          body="Use this to compare any mover in Lagos, including us."
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

      <section className="bg-secondary/40 py-16 sm:py-20">
        <div className="container-page">
          <SectionHeading
            eyebrow="Pricing"
            title="What decides the cost of a move in Lagos"
            body="We don't quote a flat number over the phone. These six factors shape every quote."
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
          eyebrow="Coverage"
          title="Lagos areas we move to and from"
          body="Mainland to island and back, including estate and high-rise access."
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
        <p className="mt-6 text-sm text-muted-foreground">
          Moving beyond the state?{" "}
          <Link to="/moving-company-nigeria" className="font-medium text-primary underline">
            See our interstate moving service across Nigeria
          </Link>
          .
        </p>
      </section>

      <section className="container-page pb-16 sm:pb-20">
        <SectionHeading
          eyebrow="Services"
          title="What we handle in Lagos"
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
        <SectionHeading eyebrow="FAQs" title="Moving in Lagos: common questions" />
        <Reveal className="mx-auto mt-10 max-w-3xl rounded-4xl border border-border bg-card p-4 shadow-soft sm:p-8">
          <Accordion type="single" collapsible className="w-full">
            {lagosFaqs.map((faq, index) => (
              <AccordionItem key={faq.q} value={`lagos-faq-${index}`}>
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
