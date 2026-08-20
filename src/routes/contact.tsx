import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { Mail, MapPin, Phone, Send } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { PageHero } from "@/components/site/PageHero";
import { Reveal } from "@/components/site/Reveal";
import { site, abs } from "@/lib/site-data";

const title = "Contact Packmyload | Movers in Lagos & Abuja";
const description =
  "Get in touch with Packmyload. Call 0700 722 5776, email enquiries@packmyload.com or send us a message and we'll respond quickly.";

export const Route = createFileRoute("/contact")({
  head: () => ({
    meta: [
      { title },
      { name: "description", content: description },
      { property: "og:title", content: title },
      { property: "og:description", content: description },
      { property: "og:type", content: "website" },
      { property: "og:url", content: "https://www.packmyload.com/contact" },
      { property: "og:image", content: abs("/images/coverge-pack.webp") },
      { name: "twitter:card", content: "summary_large_image" },
      { name: "twitter:image", content: abs("/images/coverge-pack.webp") },
      { name: "twitter:title", content: title },
      { name: "twitter:description", content: description },
    ],
    links: [{ rel: "canonical", href: "https://www.packmyload.com/contact" }],
    scripts: [
      {
        type: "application/ld+json",
        children: JSON.stringify({
          "@context": "https://schema.org",
          "@type": "LocalBusiness",
          name: "Packmyload",
          telephone: site.phone,
          email: site.email,
          address: {
            "@type": "PostalAddress",
            streetAddress: "2 Hundeyin St, Ogudu",
            addressLocality: "Lagos",
            postalCode: "105102",
            addressCountry: "NG",
          },
          url: "/contact",
        }),
      },
    ],
  }),
  component: ContactPage,
});

function ContactPage() {
  const [sending, setSending] = useState(false);

  const submit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const form = event.currentTarget;
    setSending(true);
    toast.success("Message sent", {
      description: "Thanks for reaching out — our team will reply shortly.",
    });
    form.reset();
    setSending(false);
  };

  return (
    <>
      <PageHero
        eyebrow="Contact"
        title="Get in touch"
        body="Questions about a move, a quote or a partnership? Our team is one message away."
      />

      <section className="container-page grid gap-10 py-16 sm:py-24 lg:grid-cols-[1fr_1.15fr]">
        <Reveal className="space-y-4">
          {[
            {
              Icon: Phone,
              label: "Call us",
              value: site.phoneDisplay,
              href: `tel:${site.phone}`,
            },
            { Icon: Mail, label: "Email us", value: site.email, href: `mailto:${site.email}` },
            { Icon: MapPin, label: "Visit us", value: site.address },
          ].map(({ Icon, label, value, href }) => (
            <div
              key={label}
              className="flex items-start gap-4 rounded-3xl border border-border bg-card p-6 shadow-soft"
            >
              <span className="inline-flex size-11 shrink-0 items-center justify-center rounded-2xl bg-accent-soft">
                <Icon className="size-5 text-accent-foreground" aria-hidden="true" />
              </span>
              <div>
                <p className="text-xs font-semibold tracking-[0.18em] uppercase text-muted-foreground">
                  {label}
                </p>
                {href ? (
                  <a href={href} className="mt-1 block font-medium hover:text-accent-foreground">
                    {value}
                  </a>
                ) : (
                  <p className="mt-1 font-medium">{value}</p>
                )}
              </div>
            </div>
          ))}
          <div className="overflow-hidden rounded-3xl border border-border shadow-soft">
            <iframe
              title="Packmyload office location on Google Maps"
              src="https://www.google.com/maps?q=2%20Hundeyin%20St%20Ogudu%20Lagos%20105102&output=embed"
              loading="lazy"
              className="h-64 w-full border-0"
            />
          </div>
        </Reveal>

        <Reveal delay={120} className="rounded-4xl border border-border bg-card p-6 shadow-lift sm:p-8">
          <h2 className="text-2xl font-semibold">Send us a message</h2>
          <p className="mt-2 text-sm text-muted-foreground">
            Tell us a little about your move and we'll get right back to you.
          </p>
          <form onSubmit={submit} className="mt-6 space-y-4">
            <div className="grid gap-4 sm:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="name">Full name</Label>
                <Input id="name" name="name" required placeholder="Ada Obi" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="phone">Phone</Label>
                <Input id="phone" name="phone" required placeholder="0801 234 5678" />
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input id="email" name="email" type="email" required placeholder="you@email.com" />
            </div>
            <div className="space-y-2">
              <Label htmlFor="message">How can we help?</Label>
              <Textarea
                id="message"
                name="message"
                required
                rows={5}
                placeholder="I'm moving a 3-bedroom flat from Lekki to Abuja in June…"
              />
            </div>
            <Button type="submit" size="lg" disabled={sending} className="w-full rounded-full">
              <Send className="size-4" aria-hidden="true" />
              Send message
            </Button>
            <p className="text-center text-xs text-muted-foreground">
              We reply to every enquiry within one business day.
            </p>
          </form>
        </Reveal>
      </section>
    </>
  );
}
