import { createFileRoute } from "@tanstack/react-router";
import { CtaBand } from "@/components/site/CtaBand";
import { PageHero } from "@/components/site/PageHero";
import { Reveal } from "@/components/site/Reveal";
import { ServiceCard } from "@/components/site/ServiceCard";
import { services, abs } from "@/lib/site-data";

const ogImage = services[0]?.image ?? "";

const title = "Our Services | Packmyload Movers Lagos & Abuja";
const description =
  "Browse the full Packmyload catalog: home and office relocations, store delivery, interstate car transport, junk removal, storage, cleaning and international moves.";

export const Route = createFileRoute("/services")({
  head: () => ({
    meta: [
      { title },
      { name: "description", content: description },
      { property: "og:title", content: title },
      { property: "og:description", content: description },
      { property: "og:image", content: abs(ogImage) },
      { name: "twitter:image", content: abs(ogImage) },
      { property: "og:type", content: "website" },
      { property: "og:url", content: "https://www.packmyload.com/services" },
      { name: "twitter:card", content: "summary_large_image" },
      { name: "twitter:title", content: title },
      { name: "twitter:description", content: description },
    ],
    links: [{ rel: "canonical", href: "https://www.packmyload.com/services" }],
  }),
  component: ServicesPage,
});

function ServicesPage() {
  return (
    <>
      <PageHero
        eyebrow="Catalog of services"
        title="Services"
        body="Browse through our services to find the one relevant to you."
      />
      <section className="container-page py-16 sm:py-24">
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {services.map((service, index) => (
            <Reveal key={service.slug} delay={(index % 3) * 70}>
              <ServiceCard service={service} eager={index < 3} />
            </Reveal>
          ))}
        </div>
      </section>
      <CtaBand
        title="Do you have questions?"
        body="Check out our frequently asked questions, or talk to us and we'll walk you through your options."
      />
    </>
  );
}
