import { createFileRoute } from "@tanstack/react-router";
import { Instagram } from "lucide-react";
import { CtaBand } from "@/components/site/CtaBand";
import { PageHero } from "@/components/site/PageHero";
import { Reveal } from "@/components/site/Reveal";
import { galleryImages, site } from "@/lib/site-data";

const title = "Gallery | Packmyload Movers Lagos & Abuja";
const description =
  "Packmyload on Instagram — a collection of photos showcasing our moving teams, packing work and completed relocations across Nigeria.";
const ogImage = galleryImages[0] ?? "";

export const Route = createFileRoute("/gallery")({
  head: () => ({
    meta: [
      { title },
      { name: "description", content: description },
      { property: "og:title", content: title },
      { property: "og:description", content: description },
      { property: "og:type", content: "website" },
      { property: "og:url", content: "/gallery" },
      { property: "og:image", content: ogImage },
      { name: "twitter:card", content: "summary_large_image" },
      { name: "twitter:image", content: ogImage },
    ],
    links: [{ rel: "canonical", href: "/gallery" }],
  }),
  component: GalleryPage,
});

function GalleryPage() {
  return (
    <>
      <PageHero
        eyebrow="Packmyload on Instagram"
        title="Gallery"
        body="A collection of photos and images showcasing our work and achievements."
      >
        <a
          href={site.socials.instagram}
          target="_blank"
          rel="noreferrer noopener"
          className="inline-flex items-center gap-2 rounded-full bg-accent px-5 py-3 text-sm font-semibold text-accent-foreground transition-colors hover:bg-accent/90"
        >
          <Instagram className="size-4" aria-hidden="true" />
          @packmyload — View profile
        </a>
      </PageHero>

      <section className="container-page py-16 sm:py-24">
        <div className="columns-1 gap-6 sm:columns-2 lg:columns-3 [&>*]:mb-6">
          {galleryImages.map((src, index) => (
            <Reveal key={src} delay={(index % 3) * 60}>
              <figure className="overflow-hidden rounded-3xl border border-border shadow-sm">
                <img
                  src={src}
                  alt={`Packmyload moving and packing work in Nigeria, photo ${index + 1}`}
                  width={900}
                  height={700}
                  loading={index < 3 ? "eager" : "lazy"}
                  className="w-full object-cover transition-transform duration-500 hover:scale-[1.03]"
                />
              </figure>
            </Reveal>
          ))}
        </div>
      </section>

      <CtaBand
        title="Like what you see?"
        body="Book a team for your next move and we'll bring the same care to your home or office."
      />
    </>
  );
}
