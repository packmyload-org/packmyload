import { createFileRoute } from "@tanstack/react-router";
import { ServiceDetail } from "@/components/site/ServiceDetail";
import { services, abs } from "@/lib/site-data";

const service = services.find((item) => item.slug === "international-relocations")!;

const title = `${service.title} | Packmyload Movers Lagos & Abuja`;
const description = service.intro.slice(0, 155);

export const Route = createFileRoute("/international-relocations")({
  head: () => ({
    meta: [
      { title },
      { name: "description", content: description },
      { property: "og:title", content: title },
      { property: "og:description", content: description },
      { property: "og:type", content: "website" },
      { property: "og:url", content: "https://www.packmyload.com/international-relocations" },
      { property: "og:image", content: abs(service.image) },
      { name: "twitter:card", content: "summary_large_image" },
      { name: "twitter:image", content: abs(service.image) },
      { name: "twitter:title", content: title },
      { name: "twitter:description", content: description },
    ],
    links: [{ rel: "canonical", href: "https://www.packmyload.com/international-relocations" }],
  }),
  component: () => <ServiceDetail service={service} />,
});
