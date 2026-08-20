import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowRight, MapPin } from "lucide-react";
import { CtaBand } from "@/components/site/CtaBand";
import { PageHero } from "@/components/site/PageHero";
import { Reveal } from "@/components/site/Reveal";
import { SectionHeading } from "@/components/site/SectionHeading";
import { areas } from "@/lib/areas-data";
import { SITE_URL, site } from "@/lib/site-data";

const title = "Movers Near Me by Area | Packmyload Lagos & Abuja";
const description =
  "Find insured movers near you: Packmyload covers Lekki, Ikoyi, Ikeja, Yaba, Ogudu, Ajah, Alimosho and Abuja with on-demand and scheduled moving, packing and storage.";
const canonical = `${SITE_URL}/movers`;
const ogImage = `${SITE_URL}/images/coverge-pack.webp`;

export const Route = createFileRoute("/movers/")({
  head: () => ({
    meta: [
      { title },
      { name: "description", content: description },
      { property: "og:title", content: title },
      { property: "og:description", content: description },
      { property: "og:type", content: "website" },
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
            "@type": "ItemList",
            name: "Packmyload service areas",
            itemListElement: areas.map((area, index) => ({
              "@type": "ListItem",
              position: index + 1,
              name: `Movers in ${area.name}`,
              url: `${SITE_URL}/movers/${area.slug}`,
            })),
          },
          {
            "@context": "https://schema.org",
            "@type": "BreadcrumbList",
            itemListElement: [
              { "@type": "ListItem", position: 1, name: "Home", item: `${SITE_URL}/` },
              { "@type": "ListItem", position: 2, name: "Service areas", item: canonical },
            ],
          },
        ]),
      },
    ],
  }),
  component: MoversIndex,
});

function MoversIndex() {
  return (
    <>
      <PageHero
        eyebrow="Service areas"
        title="Movers near me, area by area"
        body="Pick your neighbourhood to see how Packmyload moves there — access, pricing factors, popular routes and answers to the questions we get most."
      />

      <section className="container-page py-16 sm:py-20">
        <SectionHeading
          eyebrow="Lagos & Abuja"
          title="Choose your area"
          body="Every area below is served by insured, vetted crews with 30 minutes to 30 days notice."
        />
        <div className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {areas.map((area) => (
            <Reveal key={area.slug}>
              <Link
                to="/movers/$area"
                params={{ area: area.slug }}
                className="flex h-full flex-col rounded-3xl border border-border bg-card p-6 shadow-soft transition-colors hover:border-primary"
              >
                <span className="inline-flex items-center gap-2 text-xs font-semibold tracking-[0.18em] uppercase text-primary">
                  <MapPin className="size-4" aria-hidden="true" />
                  {area.city}
                </span>
                <h2 className="mt-3 font-display text-lg font-semibold">
                  Movers in {area.name}
                </h2>
                <p className="mt-2 flex-1 text-sm leading-relaxed text-muted-foreground">
                  {area.intro}
                </p>
                <span className="mt-4 inline-flex items-center text-sm font-medium text-primary">
                  See {area.name} moving details
                  <ArrowRight className="ml-1.5 size-4" aria-hidden="true" />
                </span>
              </Link>
            </Reveal>
          ))}
        </div>
        <p className="mt-8 text-sm text-muted-foreground">
          Not sure which page applies?{" "}
          <Link to="/best-moving-company-near-me" className="font-medium text-primary underline">
            Read how to pick the best moving company near you
          </Link>{" "}
          or call {site.phoneDisplay} and we will confirm coverage for your street.
        </p>
      </section>

      <CtaBand />
    </>
  );
}
