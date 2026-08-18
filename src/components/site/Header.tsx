import { Link } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { Menu, Phone, X, ChevronDown } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { services, site } from "@/lib/site-data";

const mainNav = [
  { label: "Gallery", to: "/gallery" },
  { label: "Partner", to: "/partner" },
  { label: "Hub", to: "/hub" },
  { label: "About us", to: "/about" },
  { label: "Contact", to: "/contact" },
];

export function Header() {
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [servicesOpen, setServicesOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 12);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <header
      className={cn(
        "sticky top-0 z-50 transition-colors duration-300",
        scrolled
          ? "border-b border-border/60 bg-background/85 backdrop-blur-xl"
          : "bg-background/60 backdrop-blur-sm",
      )}
    >
      <div className="container-page flex h-18 items-center justify-between gap-4">
        <Link to="/" className="group flex items-center gap-2" onClick={() => setOpen(false)}>
          <span className="bg-brand-gradient flex size-9 items-center justify-center rounded-xl text-sm font-bold text-primary-foreground shadow-soft">
            P
          </span>
          <span className="font-display text-xl font-semibold tracking-tight text-foreground">
            Packmyload
          </span>
        </Link>

        <nav className="hidden items-center gap-1 lg:flex">
          <div
            className="relative"
            onMouseEnter={() => setServicesOpen(true)}
            onMouseLeave={() => setServicesOpen(false)}
          >
            <Link
              to="/services"
              className="flex items-center gap-1 rounded-full px-4 py-2 text-sm font-medium text-foreground/80 transition-colors hover:bg-secondary hover:text-foreground"
            >
              Services
              <ChevronDown className="size-4" aria-hidden="true" />
            </Link>
            {servicesOpen ? (
              <div className="absolute top-full left-0 w-[30rem] pt-2">
                <div className="grid grid-cols-2 gap-1 rounded-2xl border border-border bg-popover p-3 shadow-lift">
                  {services.map((service) => (
                    <Link
                      key={service.slug}
                      to={service.path}
                      className="rounded-xl px-3 py-2 text-sm font-medium text-popover-foreground/80 transition-colors hover:bg-secondary hover:text-foreground"
                      onClick={() => setServicesOpen(false)}
                    >
                      {service.title}
                    </Link>
                  ))}
                </div>
              </div>
            ) : null}
          </div>

          {mainNav.map((item) => (
            <Link
              key={item.to}
              to={item.to}
              className="rounded-full px-4 py-2 text-sm font-medium text-foreground/80 transition-colors hover:bg-secondary hover:text-foreground"
              activeProps={{ className: "bg-secondary text-foreground" }}
            >
              {item.label}
            </Link>
          ))}
        </nav>

        <div className="flex items-center gap-2">
          <a
            href={`tel:${site.phone}`}
            className="hidden items-center gap-2 rounded-full px-3 py-2 text-sm font-medium text-foreground/80 transition-colors hover:text-foreground md:flex"
          >
            <Phone className="size-4 text-accent" aria-hidden="true" />
            {site.phoneDisplay}
          </a>
          <Button asChild size="lg" className="hidden rounded-full sm:inline-flex">
            <Link to="/book">Book now</Link>
          </Button>
          <button
            type="button"
            onClick={() => setOpen((v) => !v)}
            aria-label={open ? "Close menu" : "Open menu"}
            aria-expanded={open}
            className="inline-flex size-10 items-center justify-center rounded-xl border border-border text-foreground lg:hidden"
          >
            {open ? <Menu className="size-5" /> : <Menu className="size-5" />}
          </button>
        </div>
      </div>

      {open ? (
        <div className="border-t border-border bg-background lg:hidden">
          <div className="container-page space-y-1 py-4">
            <div className="flex items-center justify-between pb-2">
              <span className="text-xs font-semibold tracking-[0.2em] uppercase text-muted-foreground">
                Menu
              </span>
              <button
                type="button"
                aria-label="Close menu"
                onClick={() => setOpen(false)}
                className="inline-flex size-9 items-center justify-center rounded-lg border border-border"
              >
                <X className="size-4" />
              </button>
            </div>
            <Link
              to="/services"
              onClick={() => setOpen(false)}
              className="block rounded-xl px-3 py-3 text-base font-semibold"
            >
              Services
            </Link>
            <div className="grid grid-cols-2 gap-1 pb-2">
              {services.map((service) => (
                <Link
                  key={service.slug}
                  to={service.path}
                  onClick={() => setOpen(false)}
                  className="rounded-lg bg-secondary px-3 py-2 text-sm text-secondary-foreground"
                >
                  {service.title}
                </Link>
              ))}
            </div>
            {mainNav.map((item) => (
              <Link
                key={item.to}
                to={item.to}
                onClick={() => setOpen(false)}
                className="block rounded-xl px-3 py-3 text-base font-semibold"
              >
                {item.label}
              </Link>
            ))}
            <div className="flex flex-col gap-2 pt-3">
              <Button asChild size="lg" className="rounded-full">
                <Link to="/book" onClick={() => setOpen(false)}>
                  Book now
                </Link>
              </Button>
              <Button asChild variant="outline" size="lg" className="rounded-full">
                <a href={`tel:${site.phone}`}>Call {site.phoneDisplay}</a>
              </Button>
            </div>
          </div>
        </div>
      ) : null}
    </header>
  );
}
