import { Link } from "@tanstack/react-router";
import { Facebook, Instagram, Linkedin, Mail, MapPin, Phone, Twitter } from "lucide-react";
import { services, site } from "@/lib/site-data";

const company = [
  { label: "About us", to: "/about" },
  { label: "Gallery", to: "/gallery" },
  { label: "Partner with us", to: "/partner" },
  { label: "Packmyload Hub", to: "/hub" },
  { label: "FAQs", to: "/Faqs" },
  { label: "Contact", to: "/contact" },
];

export function Footer() {
  return (
    <footer className="bg-primary-deep text-primary-foreground">
      <div className="container-page grid gap-12 py-16 lg:grid-cols-[1.3fr_1fr_1fr_1fr]">
        <div>
          <Link to="/" className="flex items-center gap-2">
            <span className="flex size-9 items-center justify-center rounded-xl bg-accent text-sm font-bold text-accent-foreground">
              P
            </span>
            <span className="font-display text-xl font-semibold">Packmyload</span>
          </Link>
          <p className="mt-4 max-w-sm text-sm leading-relaxed text-primary-foreground/70">
            We make moving seamless. Every move is unique and we have the right solutions to make
            your move feel effortless.
          </p>
          <div className="mt-6 flex gap-3">
            {[
              { href: site.socials.instagram, Icon: Instagram, label: "Instagram" },
              { href: site.socials.facebook, Icon: Facebook, label: "Facebook" },
              { href: site.socials.twitter, Icon: Twitter, label: "X" },
              { href: site.socials.linkedin, Icon: Linkedin, label: "LinkedIn" },
            ].map(({ href, Icon, label }) => (
              <a
                key={label}
                href={href}
                target="_blank"
                rel="noreferrer noopener"
                aria-label={label}
                className="inline-flex size-10 items-center justify-center rounded-xl border border-primary-foreground/20 transition-colors hover:border-accent hover:text-accent"
              >
                <Icon className="size-4" aria-hidden="true" />
              </a>
            ))}
          </div>
        </div>

        <nav aria-label="Services">
          <h2 className="text-sm font-semibold tracking-[0.18em] uppercase text-accent">Services</h2>
          <ul className="mt-4 space-y-2 text-sm">
            {services.map((service) => (
              <li key={service.slug}>
                <Link
                  to={service.path}
                  className="text-primary-foreground/75 transition-colors hover:text-primary-foreground"
                >
                  {service.title}
                </Link>
              </li>
            ))}
          </ul>
        </nav>

        <nav aria-label="Company">
          <h2 className="text-sm font-semibold tracking-[0.18em] uppercase text-accent">Company</h2>
          <ul className="mt-4 space-y-2 text-sm">
            {company.map((item) => (
              <li key={item.to}>
                <Link
                  to={item.to}
                  className="text-primary-foreground/75 transition-colors hover:text-primary-foreground"
                >
                  {item.label}
                </Link>
              </li>
            ))}
          </ul>
        </nav>

        <div>
          <h2 className="text-sm font-semibold tracking-[0.18em] uppercase text-accent">Contact</h2>
          <ul className="mt-4 space-y-3 text-sm text-primary-foreground/75">
            <li className="flex gap-3">
              <Phone className="mt-0.5 size-4 shrink-0 text-accent" aria-hidden="true" />
              <a href={`tel:${site.phone}`} className="hover:text-primary-foreground">
                {site.phoneDisplay}
              </a>
            </li>
            <li className="flex gap-3">
              <Mail className="mt-0.5 size-4 shrink-0 text-accent" aria-hidden="true" />
              <a href={`mailto:${site.email}`} className="hover:text-primary-foreground">
                {site.email}
              </a>
            </li>
            <li className="flex gap-3">
              <MapPin className="mt-0.5 size-4 shrink-0 text-accent" aria-hidden="true" />
              <span>{site.address}</span>
            </li>
          </ul>
        </div>
      </div>

      <div className="border-t border-primary-foreground/15">
        <div className="container-page flex flex-col gap-2 py-6 text-xs text-primary-foreground/60 sm:flex-row sm:items-center sm:justify-between">
          <p>© {new Date().getFullYear()} Packmyload. All rights reserved.</p>
          <p>Moving company in Lagos &amp; Abuja, Nigeria.</p>
        </div>
      </div>
    </footer>
  );
}
