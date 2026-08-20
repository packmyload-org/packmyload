import { Link } from "@tanstack/react-router";
import { Facebook, Instagram, Linkedin, Mail, MapPin, Phone, Twitter } from "lucide-react";
import { services, site } from "@/lib/site-data";

function ThreadsIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
      <path d="M12.186 24h-.007c-3.581-.024-6.182-2.338-6.182-5.92 0-1.834.853-3.483 2.31-4.633 1.312-1.036 3.036-1.553 4.987-1.496.052.002.105.004.158.004-.052-.617-.183-1.27-.486-1.86-.39-.79-1.05-1.467-1.918-1.962-.92-.527-2.037-.795-3.226-.795-.42 0-.832.04-1.228.12-1.066.22-2.014.73-2.75 1.476-.74.75-1.22 1.69-1.39 2.75-.17 1.05.04 2.09.59 2.99.55.89 1.38 1.56 2.39 1.89.36.12.74.18 1.12.18.78 0 1.52-.3 2.09-.85.57-.54.89-1.27.89-2.06 0-.58-.17-1.13-.5-1.59-.33-.47-.8-.81-1.35-.98-.55-.17-1.13-.15-1.66.07-.53.21-.97.6-1.23 1.08-.26.48-.33 1.03-.19 1.56.14.53.48.99.95 1.28l-.55 1.04c-.73-.39-1.24-1.06-1.45-1.89-.21-.83-.1-1.7.31-2.43.41-.73 1.07-1.27 1.85-1.52.78-.25 1.62-.17 2.35.23.73.39 1.29 1.02 1.58 1.77.29.75.3 1.58.03 2.34-.55 1.5-1.87 2.5-3.45 2.5-.56 0-1.12-.12-1.64-.37-1.25-.58-2.25-1.55-2.89-2.78-.64-1.23-.83-2.62-.54-3.99.29-1.37 1.03-2.58 2.12-3.47 1.09-.89 2.45-1.39 3.85-1.39 1.44 0 2.83.45 3.93 1.29 1.1.84 1.86 2.02 2.17 3.34.16.67.21 1.37.16 2.07 1.82-.25 3.37-1.04 4.45-2.28 1.2-1.38 1.85-3.2 1.85-5.14 0-1.93-.65-3.75-1.85-5.13-1.2-1.38-2.9-2.24-4.78-2.42-.33-.03-.66-.05-.99-.05-3.46 0-6.71 1.35-9.16 3.8C2.35 8.2 1 11.45 1 14.91c0 3.46 1.35 6.71 3.8 9.16 2.45 2.45 5.7 3.8 9.16 3.8.33 0 .66-.02.99-.05 1.88-.18 3.58-1.04 4.78-2.42 1.2-1.38 1.85-3.2 1.85-5.13 0-1.94-.65-3.76-1.85-5.14-1.08-1.24-2.63-2.03-4.45-2.28.05.7 0 1.4-.16 2.07-.31 1.32-1.07 2.5-2.17 3.34-1.1.84-2.49 1.29-3.93 1.29-.42 0-.83-.04-1.23-.12z" />
    </svg>
  );
}

function YouTubeIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
      <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.5 12 3.5 12 3.5s-7.505 0-9.377.55A3.016 3.016 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.55 9.376.55 9.376.55s7.505 0 9.377-.55a3.016 3.016 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z" />
    </svg>
  );
}

function PinterestIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
      <path d="M12 0C5.373 0 0 5.373 0 12c0 5.084 3.163 9.426 7.627 11.174-.105-.949-.2-2.405.042-3.441.218-.937 1.407-5.965 1.407-5.965s-.359-.719-.359-1.782c0-1.668.967-2.914 2.171-2.914 1.023 0 1.518.769 1.518 1.69 0 1.029-.655 2.568-.994 3.995-.283 1.194.599 2.169 1.777 2.169 2.133 0 3.772-2.249 3.772-5.495 0-2.873-2.064-4.882-5.012-4.882-3.414 0-5.418 2.561-5.418 5.207 0 1.031.397 2.138.893 2.738a.36.36 0 0 1 .083.345l-.333 1.36c-.053.22-.174.267-.402.161-1.499-.698-2.436-2.889-2.436-4.649 0-3.785 2.75-7.262 7.929-7.262 4.163 0 7.398 2.967 7.398 6.931 0 4.136-2.607 7.464-6.227 7.464-1.216 0-2.359-.632-2.75-1.378l-.748 2.853c-.271 1.043-1.002 2.35-1.492 3.146C9.57 23.812 10.763 24 12 24c6.627 0 12-5.373 12-12S18.627 0 12 0z" />
    </svg>
  );
}

const company = [
  { label: "Movers in Lagos", to: "/moving-company-lagos" },
  { label: "Movers near me", to: "/best-moving-company-near-me" },
  { label: "Service areas", to: "/movers" },

  { label: "Movers in Nigeria", to: "/moving-company-nigeria" },
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
          <Link to="/" className="inline-flex items-center">
            <img
              src="/logo-white.svg"
              alt="Packmyload"
              width={145}
              height={50}
              className="h-9 w-auto"
            />
          </Link>
          <p className="mt-4 max-w-sm text-sm leading-relaxed text-primary-foreground/70">
            We make moving seamless. Every move is unique and we have the right solutions to make
            your move feel effortless.
          </p>
          <div className="mt-6 flex flex-wrap gap-3">
            {[
              { href: site.socials.instagram, Icon: Instagram, label: "Instagram" },
              { href: site.socials.facebook, Icon: Facebook, label: "Facebook" },
              { href: site.socials.twitter, Icon: Twitter, label: "X" },
              { href: site.socials.linkedin, Icon: Linkedin, label: "LinkedIn" },
              { href: site.socials.threads, Icon: ThreadsIcon, label: "Threads" },
              { href: site.socials.youtube, Icon: YouTubeIcon, label: "YouTube" },
              { href: site.socials.pinterest, Icon: PinterestIcon, label: "Pinterest" },
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
