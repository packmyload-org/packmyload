import { createFileRoute } from "@tanstack/react-router";
import { ServiceDetail } from "@/components/site/ServiceDetail";
import { services } from "@/lib/site-data";

const service = services.find((item) => item.slug === "office-moves")!;

const title = `${service.title} | Packmyload Movers Lagos & Abuja`;
const description = service.intro.slice(0, 155);

export const Route = createFileRoute("/office-moves")({
  head: () => ({
    meta: [
      { title },
      { name: "description", content: description },
      { property: "og:title", content: title },
      { property: "og:description", content: description },
      { property: "og:type", content: "website" },
      { property: "og:url", content: "https://www.packmyload.com/office-moves" },
      { property: "og:image", content: service.image },
      { name: "twitter:card", content: "summary_large_image" },
      { name: "twitter:image", content: service.image },
    ],
    links: [{ rel: "canonical", href: "https://www.packmyload.com/office-moves" }],
  }),
  component: () => <ServiceDetail service={service} />,
});
