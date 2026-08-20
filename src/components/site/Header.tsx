import { Link } from "@tanstack/react-router";
import { useState } from "react";
import { AlignRight, X, ChevronDown, Phone } from "lucide-react";
import { services, site } from "@/lib/site-data";

const partnerNav = [
  { label: "Partner with us", to: "/partner" },
  { label: "Packmyload Hub", to: "/hub" },
  { label: "Contact", to: "/contact" },
];

export function Header() {
  const [open, setOpen] = useState(false);
  const [menu, setMenu] = useState<"services" | "partner" | null>(null);

  const linkClass =
    "flex items-center gap-1.5 rounded-full px-3 py-2 text-sm font-bold tracking-wide text-primary-foreground/90 transition-colors hover:text-primary-foreground";

  return (
    <header className="sticky top-0 z-50 bg-primary text-primary-foreground">
      <div className="container-page flex h-20 items-center justify-between gap-4">
        <Link to="/" className="inline-flex items-center" onClick={() => setOpen(false)}>
          <img
            src="/logo-white.svg"
            alt="Packmyload"
            width={145}
            height={50}
            className="h-10 w-auto drop-shadow-[0_1px_2px_rgba(0,0,0,0.18)]"
          />
        </Link>

        <nav className="hidden items-center gap-2 lg:flex">
          <div
            className="relative"
            onMouseEnter={() => setMenu("services")}
            onMouseLeave={() => setMenu(null)}
          >
            <Link to="/services" className={linkClass}>
              Services
              <ChevronDown className="size-4" aria-hidden="true" />
            </Link>
            {menu === "services" ? (
              <div className="absolute top-full left-0 w-[30rem] pt-2">
                <div className="grid grid-cols-2 gap-1 rounded-2xl border border-border bg-popover p-3 shadow-lift">
                  {services.map((service) => (
                    <Link
                      key={service.slug}
                      to={service.path}
                      className="rounded-xl px-3 py-2 text-sm font-medium text-popover-foreground/80 transition-colors hover:bg-secondary hover:text-foreground"
                      onClick={() => setMenu(null)}
                    >
                      {service.title}
                    </Link>
                  ))}
                </div>
              </div>
            ) : null}
          </div>

          <Link to="/gallery" className={linkClass}>
            Gallery
          </Link>

          <div
            className="relative"
            onMouseEnter={() => setMenu("partner")}
            onMouseLeave={() => setMenu(null)}
          >
            <Link to="/partner" className={linkClass}>
              Partner
              <ChevronDown className="size-4" aria-hidden="true" />
            </Link>
            {menu === "partner" ? (
              <div className="absolute top-full left-0 w-60 pt-2">
                <div className="grid gap-1 rounded-2xl border border-border bg-popover p-3 shadow-lift">
                  {partnerNav.map((item) => (
                    <Link
                      key={item.to}
                      to={item.to}
                      className="rounded-xl px-3 py-2 text-sm font-medium text-popover-foreground/80 transition-colors hover:bg-secondary hover:text-foreground"
                      onClick={() => setMenu(null)}
                    >
                      {item.label}
                    </Link>
                  ))}
                </div>
              </div>
            ) : null}
          </div>

          <Link to="/about" className={linkClass}>
            About Us
          </Link>
        </nav>

        <div className="flex items-center gap-3">
          <a
            href={`tel:${site.phone}`}
            className="hidden items-center gap-2 text-sm font-bold text-primary-foreground/90 transition-colors hover:text-primary-foreground lg:inline-flex"
          >
            <Phone className="size-4" aria-hidden="true" />
            call us
          </a>
          <span className="hidden h-8 w-px bg-primary-foreground/30 lg:block" />
          <Link
            to="/book"
            className="inline-flex items-center justify-center rounded-full bg-[oklch(0.72_0.13_235)] px-7 py-3 text-sm font-extrabold tracking-wide uppercase text-white ring-4 ring-primary-foreground/15 transition-transform hover:scale-[1.03]"
          >
            Book now
          </Link>
          <button
            type="button"
            onClick={() => setOpen((v) => !v)}
            aria-label={open ? "Close menu" : "Open menu"}
            aria-expanded={open}
            className="inline-flex size-10 items-center justify-center rounded-xl border border-primary-foreground/30 text-primary-foreground lg:hidden"
          >
            {open ? <X className="size-5" /> : <AlignRight className="size-5" />}
          </button>
        </div>
      </div>

      {open ? (
        <div className="border-t border-primary-foreground/15 bg-primary lg:hidden">
          <div className="container-page space-y-1 py-4">
            <Link
              to="/services"
              onClick={() => setOpen(false)}
              className="block rounded-xl px-3 py-3 text-base font-bold"
            >
              Services
            </Link>
            <div className="grid grid-cols-2 gap-1 pb-2">
              {services.map((service) => (
                <Link
                  key={service.slug}
                  to={service.path}
                  onClick={() => setOpen(false)}
                  className="rounded-lg bg-primary-foreground/10 px-3 py-2 text-sm"
                >
                  {service.title}
                </Link>
              ))}
            </div>
            <Link
              to="/gallery"
              onClick={() => setOpen(false)}
              className="block rounded-xl px-3 py-3 text-base font-bold"
            >
              Gallery
            </Link>
            {partnerNav.map((item) => (
              <Link
                key={item.to}
                to={item.to}
                onClick={() => setOpen(false)}
                className="block rounded-xl px-3 py-3 text-base font-bold"
              >
                {item.label}
              </Link>
            ))}
            <Link
              to="/about"
              onClick={() => setOpen(false)}
              className="block rounded-xl px-3 py-3 text-base font-bold"
            >
              About Us
            </Link>
            <div className="flex flex-col gap-2 pt-3">
              <a
                href={`tel:${site.phone}`}
                className="inline-flex items-center justify-center gap-2 rounded-full border border-primary-foreground/30 px-6 py-3 text-sm font-bold"
              >
                <Phone className="size-4" aria-hidden="true" /> call us
              </a>
              <Link
                to="/book"
                onClick={() => setOpen(false)}
                className="inline-flex items-center justify-center rounded-full bg-[oklch(0.72_0.13_235)] px-6 py-3 text-sm font-extrabold uppercase text-white"
              >
                Book now
              </Link>
            </div>
          </div>
        </div>
      ) : null}
    </header>
  );
}
