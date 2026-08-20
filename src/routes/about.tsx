import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowRight } from "lucide-react";
import { CtaBand } from "@/components/site/CtaBand";
import { PageHero } from "@/components/site/PageHero";
import { Reveal } from "@/components/site/Reveal";
import { SectionHeading } from "@/components/site/SectionHeading";
import { features, galleryImages, site, testimonials } from "@/lib/site-data";

const title = "About Packmyload | Moving Company in Lagos & Abuja";
const description =
  "Check out our history as well as the opportunities we offer. Packmyload makes moving seamless across Lagos, Abuja and beyond.";
const ogImage = galleryImages[0] ?? "";

const pillars = [
  {
    heading: "Our Story.",
    body: "Learn about our company's history and journey — from a small packing crew in Lagos to a nationwide moving and relocation marketplace.",
  },
  {
    heading: "Executive Leadership.",
    body: "Meet our dedicated executive team leading our organization, and the operations leads who run every move on the ground.",
  },
  {
    heading: "Newsroom/Blog.",
    body: "Stay updated with the latest news and press releases from our company.",
  },
  {
    heading: "Careers.",
    body: "Explore exciting career opportunities and join our team of packers, drivers and coordinators.",
  },
  {
    heading: "Track my orders.",
    body: "Track the status and location of your orders in real-time with your booking reference.",
  },
  {
    heading: "Become an Agent.",
    body: "Learn how to become an agent and partner with us.",
    to: "/partner" as const,
  },
  {
    heading: "File a Claim.",
    body: "File a claim for any issues or concerns related to our services. Settlements are generally processed within 2 weeks.",
    to: "/contact" as const,
  },
  {
    heading: "The Problem.",
    body: "Discover the problem we solve, and why thousands of households and businesses choose us.",
  },
  {
    heading: "Gallery.",
    body: "Explore a collection of photos and images showcasing our work and achievements.",
    to: "/gallery" as const,
  },
];

export const Route = createFileRoute("/about")({
  head: () => ({
    meta: [
      { title },
      { name: "description", content: description },
      { property: "og:title", content: title },
      { property: "og:description", content: description },
      { property: "og:type", content: "website" },
      { property: "og:url", content: "https://www.packmyload.com/about" },
      { property: "og:image", content: ogImage },
      { name: "twitter:card", content: "summary_large_image" },
      { name: "twitter:image", content: ogImage },
    ],
    links: [{ rel: "canonical", href: "https://www.packmyload.com/about" }],
  }),
  component: AboutPage,
});

function AboutPage() {
  return (
    <>
      <PageHero
        eyebrow="About Packmyload"
        title="About Packmyload — our story, our team and our services"
        body={`We make moving seamless. Every move is unique and we have the right solutions to make your move feel effortless — across ${site.cities}.`}
      />

      <section className="container-page py-16 sm:py-24">
        <div className="grid gap-10 lg:grid-cols-[1.1fr_1fr] lg:items-center">
          <Reveal className="overflow-hidden rounded-4xl shadow-lift">
            <img
              src={galleryImages[0]}
              alt="Packmyload moving team at work in Lagos, Nigeria"
              width={1000}
              height={700}
              className="size-full object-cover"
            />
          </Reveal>
          <div className="space-y-6">
            <h2 className="text-3xl font-semibold text-foreground sm:text-4xl">Our story</h2>
            <p className="text-base leading-relaxed text-muted-foreground">
              Packmyload started with a simple observation: moving in Nigeria was stressful,
              unpredictable and rarely accountable. We built a trained, uniformed team, insured every
              load in transit, and put the whole process — quote, schedule, move, rate and tip — in
              one place.
            </p>
            <p className="text-base leading-relaxed text-muted-foreground">
              Today we handle homes, offices, retail deliveries, storage, vehicle transport and
              international relocations, supported by the Packmyload Hub marketplace for everything
              that happens around a move.
            </p>
            <div className="flex flex-wrap gap-3">
              <Link
                to="/services"
                className="inline-flex items-center gap-2 rounded-full bg-primary px-5 py-3 text-sm font-semibold text-primary-foreground transition-colors hover:bg-primary/90"
              >
                Our services
                <ArrowRight className="size-4" aria-hidden="true" />
              </Link>
              <Link
                to="/gallery"
                className="inline-flex items-center gap-2 rounded-full border border-border px-5 py-3 text-sm font-semibold text-foreground transition-colors hover:bg-secondary"
              >
                View gallery
              </Link>
            </div>
          </div>
        </div>
      </section>

      <section className="bg-secondary/40 py-16 sm:py-24">
        <div className="container-page">
          <SectionHeading
            eyebrow="Explore"
            title="Everything about Packmyload"
            body="History, leadership, careers, claims and more."
          />
          <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {pillars.map((item, index) => (
              <Reveal key={item.heading} delay={(index % 3) * 70}>
                <div className="flex h-full flex-col rounded-3xl border border-border bg-card p-6 shadow-sm">
                  <h3 className="text-lg font-semibold text-foreground">{item.heading}</h3>
                  <p className="mt-3 flex-1 text-sm leading-relaxed text-muted-foreground">
                    {item.body}
                  </p>
                  {item.to ? (
                    <Link
                      to={item.to}
                      className="mt-5 inline-flex items-center gap-2 text-sm font-semibold text-primary hover:underline"
                    >
                      {`Learn more about ${item.heading}`}
                      <ArrowRight className="size-4" aria-hidden="true" />
                    </Link>
                  ) : null}
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      <section className="container-page py-16 sm:py-24">
        <SectionHeading eyebrow="Why us" title="What every move includes" />
        <div className="mt-12 grid gap-6 md:grid-cols-3">
          {features.map((feature, index) => (
            <Reveal key={feature.title} delay={index * 70}>
              <div className="h-full rounded-3xl border border-border bg-card p-7 shadow-sm">
                <img src={feature.icon} alt="" width={40} height={40} className="size-10" />
                <h3 className="mt-5 text-lg font-semibold text-foreground">{feature.title}</h3>
                <p className="mt-3 text-sm leading-relaxed text-muted-foreground">{feature.body}</p>
              </div>
            </Reveal>
          ))}
        </div>
      </section>

      <section className="bg-secondary/40 py-16 sm:py-24">
        <div className="container-page">
          <SectionHeading eyebrow="Testimonials" title="What our customers say" />
          <div className="mt-12 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {testimonials.slice(0, 6).map((item, index) => (
              <Reveal key={item.name} delay={(index % 3) * 70}>
                <figure className="h-full rounded-3xl border border-border bg-card p-7 shadow-sm">
                  <blockquote className="text-sm leading-relaxed text-muted-foreground">
                    “{item.body}”
                  </blockquote>
                  <figcaption className="mt-5 text-sm font-semibold text-foreground">
                    {item.name}
                  </figcaption>
                </figure>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      <CtaBand />
    </>
  );
}
