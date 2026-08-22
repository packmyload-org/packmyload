import { useEffect, useState } from "react";
import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowRight, Check, PlayCircle, Star } from "lucide-react";
import heroVideo from "@/assets/hero-move.mp4.asset.json";
import { Button } from "@/components/ui/button";
import { CtaBand } from "@/components/site/CtaBand";
import { QuoteBar } from "@/components/site/QuoteBar";
import { Reveal } from "@/components/site/Reveal";
import { SectionHeading } from "@/components/site/SectionHeading";
import { ServiceCard } from "@/components/site/ServiceCard";
import {
  IMG,
  SITE_URL,
  features,
  heroImages,
  marketplaceBenefits,
  services,
  site,
  steps,
  testimonials, abs } from "@/lib/site-data";

const title = "Best Moving Company in Lagos & Abuja | Packmyload";
const description =
  "Top-rated movers and packers in Lagos & Abuja. Insured home and office relocation, interstate moves across Nigeria, storage, junk removal and set-up.";
const keywords = [
  "best moving company",
  "best moving companies",
  "best moving companies near me",
  "best moving company near me",
  "best moving company in Lagos",
  "best moving company in Nigeria",
  "best movers and packers near me",
  "top rated movers near me",
  "affordable moving company near me",
  "interstate moving company Nigeria",
].join(", ");
const ogImage = `${SITE_URL}/images/Packmyload.com-home-office-relocations.webp`;

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title },
      { name: "description", content: description },
      { property: "og:title", content: title },
      { property: "og:description", content: description },
      { property: "og:image", content: abs(ogImage) },
      { name: "twitter:image", content: abs(ogImage) },
      { property: "og:url", content: `${SITE_URL}/` },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
      { name: "twitter:title", content: title },
      { name: "twitter:description", content: description },
    ],
    links: [{ rel: "canonical", href: `${SITE_URL}/` }],
    scripts: [
      {
        type: "application/ld+json",
        children: JSON.stringify([
          {
            "@context": "https://schema.org",
            "@type": "MovingCompany",
            "@id": "https://www.packmyload.com/#organization",
            name: "Packmyload",
            alternateName: "Packmyload.com",
            description,
            url: "https://www.packmyload.com/",
            logo: `${SITE_URL}/logo.svg`,
            image: ogImage,
            telephone: site.phone,
            email: site.email,
            address: {
              "@type": "PostalAddress",
              streetAddress: "2 Hundeyin St, Ogudu",
              addressLocality: "Lagos",
              addressRegion: "Lagos",
              postalCode: "105102",
              addressCountry: "NG",
            },
            areaServed: [
              { "@type": "City", name: "Lagos" },
              { "@type": "City", name: "Abuja" },
              { "@type": "Country", name: "Nigeria" },
            ],
            knowsLanguage: ["en-NG"],
            openingHoursSpecification: [
              {
                "@type": "OpeningHoursSpecification",
                dayOfWeek: [
                  "Monday",
                  "Tuesday",
                  "Wednesday",
                  "Thursday",
                  "Friday",
                  "Saturday",
                  "Sunday",
                ],
                opens: "08:00",
                closes: "20:00",
              },
            ],
            hasOfferCatalog: {
              "@type": "OfferCatalog",
              name: "Moving and relocation services",
              itemListElement: services.map((service) => ({
                "@type": "Offer",
                itemOffered: {
                  "@type": "Service",
                  name: service.title,
                  description: service.short,
                },
              })),
            },
            sameAs: Object.values(site.socials),
          },
          {
            "@context": "https://schema.org",
            "@type": "WebSite",
            name: "Packmyload",
            url: "https://www.packmyload.com/",
            publisher: { "@id": "https://www.packmyload.com/#organization" },
          },
          {
            "@context": "https://schema.org",
            "@type": "ItemList",
            name: "Best moving company searches answered by Packmyload",
            itemListElement: [
              {
                "@type": "ListItem",
                position: 1,
                name: "Best moving company in Lagos",
                url: `${SITE_URL}/moving-company-lagos`,
              },
              {
                "@type": "ListItem",
                position: 2,
                name: "Best moving companies near me",
                url: `${SITE_URL}/best-moving-company-near-me`,
              },
              {
                "@type": "ListItem",
                position: 3,
                name: "Best interstate moving company in Nigeria",
                url: `${SITE_URL}/moving-company-nigeria`,
              },
            ],
          },
        ]),
      },
    ],
  }),
  component: Home,
});

function Home() {
  const [showVideo, setShowVideo] = useState(false);

  useEffect(() => {
    // The hero video is decorative: skip it entirely on small screens and slow
    // connections, and defer it elsewhere so it never competes with LCP.
    const connection = (
      navigator as Navigator & { connection?: { saveData?: boolean; effectiveType?: string } }
    ).connection;
    const slow =
      connection?.saveData === true || /2g|3g/.test(connection?.effectiveType ?? "") === true;
    if (slow || window.innerWidth < 1024 || window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      return;
    }
    const timer = window.setTimeout(() => setShowVideo(true), 2500);
    return () => window.clearTimeout(timer);
  }, []);

  return (
    <>
      <section className="bg-primary-deep relative overflow-hidden">
        <div aria-hidden="true" className="absolute inset-0">
          {showVideo ? (
            <video
              src={heroVideo.url}
              autoPlay
              muted
              loop
              playsInline
              preload="none"
              className="size-full object-cover"
            />
          ) : null}
          <div className="bg-brand-gradient absolute inset-0 opacity-80" />
          <div className="absolute inset-x-0 bottom-0 h-40 bg-gradient-to-b from-transparent to-background" />
        </div>
        <div className="container-page relative pt-16 pb-16 sm:pt-24 sm:pb-24">
          <Reveal className="mx-auto max-w-3xl text-center">
            <h1 className="text-4xl leading-[1.03] font-semibold text-primary-foreground sm:text-6xl lg:text-7xl">
              We make moving <span className="text-accent">seamless</span>
            </h1>
            <p className="mx-auto mt-5 max-w-xl text-base leading-relaxed text-white sm:text-lg">
              Every move is unique and we have the right solutions to make your move feel
              effortless.
            </p>
          </Reveal>

          <Reveal delay={120} className="mt-10">
            <QuoteBar />
          </Reveal>

          <Reveal delay={200} className="mt-14">
            <ul className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-5">
              {heroImages.map((image, index) => {
                const base = image.src.replace(".webp", "");
                return (
                  <li
                    key={image.src}
                    className={
                      "overflow-hidden rounded-3xl bg-card shadow-[0_10px_30px_-12px_rgba(0,0,0,0.35)] ring-1 ring-primary-foreground/15" +
                      (index === 4 ? " col-span-2 sm:col-span-1" : "")
                    }
                  >
                    <img
                      src={`${base}-320.webp`}
                      srcSet={`${base}-320.webp 320w, ${base}-640.webp 640w`}
                      sizes="(max-width: 640px) 45vw, (max-width: 1024px) 30vw, 18vw"
                      alt={image.alt}
                      width={420}
                      height={320}
                      loading={index < 2 ? "eager" : "lazy"}
                      decoding="async"
                      {...(index === 0 ? { fetchPriority: "high" as const } : {})}
                      className="block h-full w-full bg-card object-cover"
                      style={{ aspectRatio: "4 / 3" }}
                    />
                  </li>
                );
              })}
            </ul>
          </Reveal>
        </div>
      </section>


      <section className="bg-brand-gradient relative overflow-hidden">
        <div className="container-page grid items-center gap-10 py-16 sm:py-24 lg:grid-cols-2">
          <Reveal>
            <p className="font-display text-3xl font-semibold text-primary-foreground sm:text-4xl">
              Packmyload <span className="text-accent">Hub</span>
            </p>
            <h2 className="mt-4 text-2xl font-semibold text-primary-foreground sm:text-3xl">
              One call to connect all your utilities and home services.
            </h2>
            <p className="mt-3 max-w-lg text-primary-foreground/80">
              One concierge service to connect utilities and home services after a move.
            </p>
            <div className="mt-8 flex flex-wrap gap-3">
              <Button
                asChild
                size="lg"
                className="rounded-full bg-accent text-accent-foreground hover:bg-accent/90"
              >
                <Link to="/hub">
                  Get estimate
                  <ArrowRight className="size-4" aria-hidden="true" />
                </Link>
              </Button>
              <Button
                asChild
                size="lg"
                variant="outline"
                className="rounded-full border-primary-foreground/35 bg-transparent text-primary-foreground hover:bg-primary-foreground/10 hover:text-primary-foreground"
              >
                <Link to="/services">Browse services</Link>
              </Button>
            </div>
          </Reveal>
          <Reveal delay={120} className="relative overflow-hidden rounded-4xl shadow-lift">
            <img
              src={`${IMG}/images/packman.webp`}
              srcSet={`${IMG}/images/packman-480.webp 480w, ${IMG}/images/packman-720.webp 720w, ${IMG}/images/packman.webp 667w`}
              sizes="(max-width: 1024px) 92vw, 46vw"
              alt="Packmyload employee holding a box ready for a move"
              width={900}
              height={640}
              loading="lazy"
              className="size-full object-cover"
            />
            <span className="pointer-events-none absolute inset-0 flex items-center justify-center">
              <PlayCircle className="size-16 text-primary-foreground/80" aria-hidden="true" />
            </span>
          </Reveal>
        </div>
      </section>

      <section className="container-page py-16 sm:py-24">
        <SectionHeading
          eyebrow="How to book"
          title="Book a move in three simple steps"
          body="From your first address to your final confirmation, the whole move is arranged in minutes."
        />
        <div className="mt-12 grid gap-6 md:grid-cols-3">
          {steps.map((step, index) => (
            <Reveal
              key={step.title}
              delay={index * 100}
              className="group flex flex-col rounded-3xl border border-border bg-card p-6 shadow-soft transition-all duration-300 hover:-translate-y-1 hover:shadow-lift"
            >
              <span className="text-xs font-semibold tracking-[0.22em] uppercase text-accent-foreground/60">
                {step.step}
              </span>
              <h3 className="mt-2 text-xl font-semibold text-foreground">{step.title}</h3>
              <p className="mt-2 text-sm text-muted-foreground">{step.body}</p>
              <div className="mt-6 overflow-hidden rounded-2xl bg-surface p-4">
                <img
                  src={step.image}
                  alt={`Moving company in Lagos & Abuja Nigeria: ${step.alt}`}
                  width={520}
                  height={360}
                  loading="lazy"
                  className="mx-auto h-40 w-auto object-contain transition-transform duration-500 group-hover:scale-105"
                />
              </div>
            </Reveal>
          ))}
        </div>
      </section>

      <section className="bg-surface py-16 sm:py-24">
        <div className="container-page">
          <SectionHeading
            eyebrow="Marketplace"
            title="Packmyload is your one-stop moving marketplace"
            body="Through a quick chat, you can organize your entire move and access exclusive discounts from our verified vendors."
          />
          <Reveal delay={100} className="mt-10 flex flex-wrap justify-center gap-3">
            {marketplaceBenefits.map((benefit) => (
              <span
                key={benefit}
                className="inline-flex items-center gap-2 rounded-full border border-border bg-card px-4 py-2 text-sm font-medium text-foreground shadow-soft"
              >
                <Check className="size-4 text-accent" aria-hidden="true" />
                {benefit}
              </span>
            ))}
          </Reveal>
          <Reveal delay={160} className="mx-auto mt-8 max-w-2xl text-center">
            <p className="text-muted-foreground">
              Discover more than just moving services, and enjoy a moving experience that
              prioritizes safety and security.
            </p>
          </Reveal>
        </div>
      </section>

      <section className="container-page py-16 sm:py-24">
        <SectionHeading
          eyebrow="Catalog of services"
          title="Services"
          body="Browse through our services to find the one relevant to you."
        />
        <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {services.slice(0, 6).map((service, index) => (
            <Reveal key={service.slug} delay={index * 60}>
              <ServiceCard service={service} />
            </Reveal>
          ))}
        </div>
        <div className="mt-10 text-center">
          <Button asChild size="lg" variant="outline" className="rounded-full">
            <Link to="/services">
              View all services
              <ArrowRight className="size-4" aria-hidden="true" />
            </Link>
          </Button>
        </div>
      </section>

      <section className="bg-surface py-16 sm:py-24">
        <div className="container-page">
          <SectionHeading
            eyebrow="One seamless experience"
            title="Your possessions, treated like our own"
            body="Our teams ensure that the greatest care and diligence is taken on every single move."
          />
          <div className="mt-12 grid gap-6 md:grid-cols-3">
            {features.map((feature, index) => (
              <Reveal
                key={feature.title}
                delay={index * 90}
                className="rounded-3xl border border-border bg-card p-7 shadow-soft"
              >
                <span className="inline-flex size-14 items-center justify-center rounded-2xl bg-accent-soft">
                  <img
                    src={feature.icon}
                    alt=""
                    aria-hidden="true"
                    width={32}
                    height={32}
                    loading="lazy"
                    className="size-7"
                  />
                </span>
                <h3 className="mt-5 text-lg font-semibold text-foreground">{feature.title}</h3>
                <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{feature.body}</p>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      <section className="container-page grid items-center gap-12 py-16 sm:py-24 lg:grid-cols-2">
        <Reveal>
          <span className="text-xs font-semibold tracking-[0.22em] uppercase text-accent-foreground/60">
            Flexible payment
          </span>
          <h2 className="mt-3 text-3xl font-semibold sm:text-4xl">Pack now, pay later</h2>
          <p className="mt-4 leading-relaxed text-muted-foreground">
            Gone are the days of paying in full for your move. With Packmyload, you can now Pack
            Now, Pay Later through our partnership with Alt Bank. Simply choose Pack Now, Pay Later
            when you pick your moving quote — it really is that easy.*
          </p>
          <p className="mt-3 text-sm text-muted-foreground italic">
            *Only applicable for long-distance moves.
          </p>
        </Reveal>
        <Reveal delay={120} className="overflow-hidden rounded-4xl shadow-lift">
          <img
            src={`${IMG}/images/Packmyload.com-home-office-relocations.webp`}
            alt="Moving company in Lagos & Abuja Nigeria: happy Packmyload customers"
            width={1200}
            height={800}
            loading="lazy"
            className="size-full object-cover"
          />
        </Reveal>
      </section>

      <section className="container-page grid items-center gap-12 pb-16 sm:pb-24 lg:grid-cols-2">
        <Reveal className="order-2 overflow-hidden rounded-4xl shadow-lift lg:order-1">
          <img
            src={`${IMG}/images/coverge-pack.webp`}
            alt="Moving company in Lagos & Abuja Nigeria: Packmyload team packing a home"
            width={1200}
            height={800}
            loading="lazy"
            className="size-full object-cover"
          />
        </Reveal>
        <Reveal delay={120} className="order-1 lg:order-2">
          <span className="text-xs font-semibold tracking-[0.22em] uppercase text-accent-foreground/60">
            Protection
          </span>
          <h2 className="mt-3 text-3xl font-semibold sm:text-4xl">Coverage for your move</h2>
          <p className="mt-4 leading-relaxed text-muted-foreground">
            Packmyload offers comprehensive protection for your move across our offerings. Our
            coverage is specifically built for the household goods moving industry. Claim settlements
            are fair and accurate and generally processed within 2 weeks of receipt of claim form and
            required documentation.
          </p>
          <Button asChild size="lg" className="mt-8 rounded-full">
            <Link to="/Faqs">
              Read the FAQs
              <ArrowRight className="size-4" aria-hidden="true" />
            </Link>
          </Button>
        </Reveal>
      </section>

      <section className="bg-surface py-16 sm:py-24">
        <div className="container-page">
          <SectionHeading
            eyebrow="Testimonials"
            title="What our customers say"
            body="Over a thousand customers have relied on Packmyload to safely transport them and their belongings to their new homes."
          />
          <div className="mt-12 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {testimonials.map((testimonial, index) => (
              <Reveal
                key={testimonial.name}
                delay={(index % 3) * 80}
                className="flex h-full flex-col rounded-3xl border border-border bg-card p-6 shadow-soft"
              >
                <div className="flex gap-0.5 text-accent" role="img" aria-label="5 out of 5 stars">
                  {[0, 1, 2, 3, 4].map((star) => (
                    <Star key={star} className="size-4 fill-current" aria-hidden="true" />
                  ))}
                </div>
                <p className="mt-4 flex-1 text-sm leading-relaxed text-muted-foreground">
                  “{testimonial.body}”
                </p>
                <div className="mt-5 flex items-center gap-3">
                  <span className="flex size-9 items-center justify-center rounded-full bg-primary-soft text-sm font-semibold text-secondary-foreground">
                    {testimonial.name.charAt(0)}
                  </span>
                  <span className="text-sm font-semibold text-foreground">{testimonial.name}</span>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      <CtaBand />
    </>
  );
}
