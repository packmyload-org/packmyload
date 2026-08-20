import { Link } from "@tanstack/react-router";
import { ArrowRight, Check } from "lucide-react";
import { Button } from "@/components/ui/button";
import { services, steps, type Service } from "@/lib/site-data";
import { CtaBand } from "./CtaBand";
import { PageHero } from "./PageHero";
import { Reveal } from "./Reveal";
import { SectionHeading } from "./SectionHeading";

export function ServiceDetail({ service }: { service: Service }) {
  const others = services.filter((item) => item.slug !== service.slug).slice(0, 3);

  return (
    <>
      <PageHero eyebrow="Packmyload service" title={service.title} body={service.intro}>
        <div className="flex flex-wrap gap-3">
          <Button
            asChild
            size="lg"
            className="rounded-full bg-accent text-accent-foreground hover:bg-accent/90"
          >
            <Link to="/book">
              Get started
              <ArrowRight className="size-4" aria-hidden="true" />
            </Link>
          </Button>
          <Button
            asChild
            size="lg"
            variant="outline"
            className="rounded-full border-primary-foreground/35 bg-transparent text-primary-foreground hover:bg-primary-foreground/10 hover:text-primary-foreground"
          >
            <Link to="/services">All services</Link>
          </Button>
        </div>
      </PageHero>

      <section className="container-page grid items-start gap-12 py-16 sm:py-24 lg:grid-cols-2">
        <Reveal className="overflow-hidden rounded-4xl shadow-lift">
          <img
            src={service.image}
            alt={`Packmyload ${service.title.toLowerCase()} in Lagos and Abuja, Nigeria`}
            width={1000}
            height={700}
            className="size-full object-cover"
          />
        </Reveal>
        <div className="space-y-10">
          {service.sections.map((section, index) => (
            <Reveal key={section.heading} delay={index * 80}>
              <h2 className="text-2xl font-semibold text-foreground sm:text-3xl">
                {section.heading}
              </h2>
              <p className="mt-3 leading-relaxed text-muted-foreground">{section.body}</p>
            </Reveal>
          ))}
          <Reveal className="rounded-3xl border border-border bg-surface p-6">
            <h3 className="text-sm font-semibold tracking-[0.18em] uppercase text-accent-foreground/70">
              What's included
            </h3>
            <ul className="mt-4 grid gap-3 sm:grid-cols-2">
              {service.includes.map((item) => (
                <li key={item} className="flex items-start gap-2 text-sm text-foreground">
                  <Check className="mt-0.5 size-4 shrink-0 text-accent" aria-hidden="true" />
                  {item}
                </li>
              ))}
            </ul>
          </Reveal>
        </div>
      </section>

      <section className="bg-surface py-16 sm:py-24">
        <div className="container-page">
          <SectionHeading eyebrow="How to book" title="Three simple steps" align="center" />
          <div className="mt-12 grid gap-6 md:grid-cols-3">
            {steps.map((step, index) => (
              <Reveal
                key={step.title}
                delay={index * 90}
                className="rounded-3xl border border-border bg-card p-6 shadow-soft"
              >
                <span className="font-display text-4xl font-semibold text-accent">{`0${index + 1}`}</span>
                <h3 className="mt-3 text-lg font-semibold text-foreground">{step.title}</h3>
                <p className="mt-2 text-sm text-muted-foreground">{step.body}</p>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      <section className="container-page py-16 sm:py-24">
        <SectionHeading
          eyebrow="Keep exploring"
          title="Other services you may need"
          align="left"
        />
        <div className="mt-10 grid gap-4 sm:grid-cols-3">
          {others.map((item) => (
            <Reveal key={item.slug}>
              <Link
                to={item.path}
                className="group flex h-full flex-col justify-between rounded-3xl border border-border bg-card p-6 shadow-soft transition-all hover:-translate-y-1 hover:shadow-lift"
              >
                <h3 className="text-lg font-semibold text-foreground">{item.title}</h3>
                <p className="mt-2 text-sm text-muted-foreground">{item.short}</p>
                <span className="mt-4 inline-flex items-center gap-1 text-sm font-semibold text-accent-foreground">
                  {`View ${item.title} details`}
                  <ArrowRight
                    className="size-4 transition-transform group-hover:translate-x-1"
                    aria-hidden="true"
                  />
                </span>
              </Link>
            </Reveal>
          ))}
        </div>
      </section>

      <CtaBand />
    </>
  );
}
