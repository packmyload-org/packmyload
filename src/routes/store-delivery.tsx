import { createFileRoute } from "@tanstack/react-router";
import { ServiceDetail } from "@/components/site/ServiceDetail";
import { services, abs } from "@/lib/site-data";

const service = services.find((item) => item.slug === "store-delivery")!;

const title = `${service.title} | Packmyload Movers Lagos & Abuja`;
const description = service.intro.slice(0, 155);

export const Route = createFileRoute("/store-delivery")({
  head: () => ({
    meta: [
      { title },
      { name: "description", content: description },
      { property: "og:title", content: title },
      { property: "og:description", content: description },
      { property: "og:type", content: "website" },
      { property: "og:url", content: "https://www.packmyload.com/store-delivery" },
      { property: "og:image", content: abs(service.image) },
      { name: "twitter:card", content: "summary_large_image" },
      { name: "twitter:image", content: abs(service.image) },
      { name: "twitter:title", content: title },
      { name: "twitter:description", content: description },
    ],
    links: [{ rel: "canonical", href: "https://www.packmyload.com/store-delivery" }],
  }),
  component: () => <ServiceDetail service={service} />,
});
