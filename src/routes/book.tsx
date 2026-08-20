import { createFileRoute } from "@tanstack/react-router";
import { CalendarClock, Check, ShieldCheck, Truck } from "lucide-react";
import { PageHero } from "@/components/site/PageHero";
import { QuoteBar } from "@/components/site/QuoteBar";
import { Reveal } from "@/components/site/Reveal";
import { SectionHeading } from "@/components/site/SectionHeading";
import { steps, abs } from "@/lib/site-data";

const title = "Book a Move | Packmyload";
const description =
  "Book your move with Packmyload in three simple steps: choose your addresses, pick a schedule and finalize your move.";

export const Route = createFileRoute("/book")({
  head: () => ({
    meta: [
      { title },
      { name: "description", content: description },
      { property: "og:title", content: title },
      { property: "og:description", content: description },
      { property: "og:type", content: "website" },
      { property: "og:url", content: "https://www.packmyload.com/book" },
      { property: "og:image", content: abs("/images/coverge-pack.webp") },
      { name: "twitter:card", content: "summary_large_image" },
      { name: "twitter:image", content: abs("/images/coverge-pack.webp") },
      { name: "twitter:title", content: title },
      { name: "twitter:description", content: description },
    ],
    links: [{ rel: "canonical", href: "https://www.packmyload.com/book" }],
  }),
  component: BookPage,
});

const assurances = [
  { Icon: ShieldCheck, label: "Goods-in-transit insured" },
  { Icon: CalendarClock, label: "30 minutes to 30 days notice" },
  { Icon: Truck, label: "Trained, uniformed packers" },
];

function BookPage() {
  return (
    <>
      <PageHero
        eyebrow="Book now"
        title="Book your move in minutes"
        body="Tell us where you're moving from, where you're going and when. We'll come back with your estimate."
      />

      <section className="container-page -mt-10 pb-16 sm:pb-24">
        <Reveal>
          <QuoteBar />
        </Reveal>
        <Reveal delay={100} className="mt-8 flex flex-wrap justify-center gap-4">
          {assurances.map(({ Icon, label }) => (
            <span
              key={label}
              className="inline-flex items-center gap-2 rounded-full border border-border bg-card px-4 py-2 text-sm font-medium shadow-soft"
            >
              <Icon className="size-4 text-accent" aria-hidden="true" />
              {label}
            </span>
          ))}
        </Reveal>
      </section>

      <section className="bg-surface py-16 sm:py-24">
        <div className="container-page">
          <SectionHeading eyebrow="How it works" title="Three simple steps" />
          <div className="mt-12 grid gap-6 md:grid-cols-3">
            {steps.map((step, index) => (
              <Reveal
                key={step.title}
                delay={index * 90}
                className="rounded-3xl border border-border bg-card p-6 shadow-soft"
              >
                <span className="font-display text-4xl font-semibold text-accent">{`0${index + 1}`}</span>
                <h3 className="mt-3 text-lg font-semibold">{step.title}</h3>
                <p className="mt-2 text-sm text-muted-foreground">{step.body}</p>
                <img
                  src={step.image}
                  alt={`Moving company in Lagos & Abuja Nigeria: ${step.alt}`}
                  width={520}
                  height={360}
                  loading="lazy"
                  className="mt-5 h-36 w-auto object-contain"
                />
              </Reveal>
            ))}
          </div>
          <Reveal delay={200} className="mx-auto mt-12 max-w-2xl rounded-3xl border border-border bg-card p-6 shadow-soft">
            <h3 className="text-sm font-semibold tracking-[0.18em] uppercase text-accent-foreground/70">
              What happens next
            </h3>
            <ul className="mt-4 space-y-3 text-sm">
              {[
                "We confirm your inventory and access details over chat or a quick call.",
                "You receive a written quote, with Pack Now, Pay Later available on long-distance moves.",
                "Your crew is assigned and arrives within your chosen window.",
              ].map((item) => (
                <li key={item} className="flex items-start gap-2">
                  <Check className="mt-0.5 size-4 shrink-0 text-accent" aria-hidden="true" />
                  {item}
                </li>
              ))}
            </ul>
          </Reveal>
        </div>
      </section>
    </>
  );
}
