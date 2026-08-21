import { createFileRoute } from "@tanstack/react-router";
import { ArrowUpRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ServiceDetail } from "@/components/site/ServiceDetail";
import { SectionHeading } from "@/components/site/SectionHeading";
import { Reveal } from "@/components/site/Reveal";
import { services, abs } from "@/lib/site-data";

const service = services.find((item) => item.slug === "storage")!;

const title = `${service.title} | Packmyload Movers Lagos & Abuja`;
const description = service.intro.slice(0, 155);

export const Route = createFileRoute("/storage")({
  head: () => ({
    meta: [
      { title },
      { name: "description", content: description },
      { property: "og:title", content: title },
      { property: "og:description", content: description },
      { property: "og:type", content: "website" },
      { property: "og:url", content: "https://www.packmyload.com/storage" },
      { property: "og:image", content: abs(service.image) },
      { name: "twitter:card", content: "summary_large_image" },
      { name: "twitter:image", content: abs(service.image) },
      { name: "twitter:title", content: title },
      { name: "twitter:description", content: description },
    ],
    links: [{ rel: "canonical", href: "https://www.packmyload.com/storage" }],
  }),
  component: () => <StoragePage />,
});

function StoragePage() {
  return (
    <>
      <ServiceDetail service={service} />
      <section className="container-page pb-16 sm:pb-24">
        <Reveal className="rounded-4xl border border-border bg-surface p-8 shadow-soft sm:p-12 lg:p-16">
          <div className="mx-auto max-w-3xl text-center">
            <SectionHeading
              eyebrow="Sister company"
              title="Need dedicated long-term storage?"
              body="For flexible, secure self-storage units and warehouse space, visit our sister company Spacedey — built for homes, businesses and inventory in Lagos and Abuja."
              align="center"
            />
            <Button
              asChild
              size="lg"
              className="mt-8 rounded-full bg-cta text-cta-foreground hover:bg-cta/90"
            >
              <a
                href="https://spacedey.com"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Visit Spacedey storage (opens in a new tab)"
              >
                Visit spacedey.com
                <ArrowUpRight className="size-4" aria-hidden="true" />
              </a>
            </Button>
          </div>
        </Reveal>
      </section>
    </>
  );
}
