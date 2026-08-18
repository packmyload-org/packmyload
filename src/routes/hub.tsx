import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowRight, Check } from "lucide-react";
import { Button } from "@/components/ui/button";
import { CtaBand } from "@/components/site/CtaBand";
import { PageHero } from "@/components/site/PageHero";
import { Reveal } from "@/components/site/Reveal";
import { SectionHeading } from "@/components/site/SectionHeading";
import { IMG, marketplaceBenefits } from "@/lib/site-data";

const title = "Packmyload Hub | Utilities & Home Services After Your Move";
const description =
  "Packmyload Hub is one concierge service to connect your utilities and home services after a move — electricity, internet, cleaning, security and more.";
const heroImage = `${IMG}/images/packman.webp`;

export const Route = createFileRoute("/hub")({
  head: () => ({
    meta: [
      { title },
      { name: "description", content: description },
      { property: "og:title", content: title },
      { property: "og:description", content: description },
      { property: "og:image", content: heroImage },
      { name: "twitter:image", content: heroImage },
    ],
    links: [{ rel: "canonical", href: "/hub" }],
  }),
  component: HubPage,
});

const connections = [
  "Electricity and prepaid meter setup",
  "Internet and cable television",
  "Water, waste and estate levies",
  "Home cleaning and fumigation",
  "Security, CCTV and smart locks",
  "Furniture assembly and handyman visits",
];

function HubPage() {
  return (
    <>
      <PageHero
        eyebrow="Packmyload Hub"
        title="One call to connect all your utilities and home services"
        body="Moving in is more than boxes. Hub is one concierge service that gets your new home switched on and running."
      >
        <Button asChild size="lg" className="mt-8 rounded-full">
          <Link to="/contact">
            Get estimate
            <ArrowRight className="size-4" aria-hidden="true" />
          </Link>
        </Button>
      </PageHero>

      <section className="container-page grid items-center gap-10 py-16 sm:py-24 lg:grid-cols-2">
        <Reveal className="overflow-hidden rounded-4xl shadow-lift">
          <img
            src={heroImage}
            alt="Packmyload employee holding a box ready for a move"
            width={900}
            height={640}
            className="size-full object-cover"
          />
        </Reveal>
        <Reveal delay={120}>
          <SectionHeading
            eyebrow="What Hub covers"
            title="Everything switched on before you unpack"
            align="left"
          />
          <ul className="mt-8 space-y-3 text-sm">
            {connections.map((item) => (
              <li key={item} className="flex items-start gap-3">
                <Check className="mt-0.5 size-4 shrink-0 text-accent" aria-hidden="true" />
                {item}
              </li>
            ))}
          </ul>
        </Reveal>
      </section>

      <section className="bg-surface py-16 sm:py-24">
        <div className="container-page">
          <SectionHeading eyebrow="Why Hub" title="A marketplace built around your move" />
          <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {marketplaceBenefits.map((benefit, index) => (
              <Reveal
                key={benefit.title}
                delay={(index % 3) * 90}
                className="rounded-3xl border border-border bg-card p-6 shadow-soft"
              >
                <h3 className="text-lg font-semibold">{benefit.title}</h3>
                <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{benefit.body}</p>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      <CtaBand
        title="Ready to switch on your new home?"
        body="Tell us your address and move date, and Hub handles the rest."
      />
    </>
  );
}
