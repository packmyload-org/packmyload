import { Link } from "@tanstack/react-router";
import { ArrowRight, Phone } from "lucide-react";
import { Button } from "@/components/ui/button";
import { site } from "@/lib/site-data";
import { Reveal } from "./Reveal";

export function CtaBand({
  title = "Ready to make your move seamless?",
  body = "Tell us where you're going and when. We'll handle the packing, the lifting and everything in between.",
}: {
  title?: string;
  body?: string;
}) {
  return (
    <section className="container-page py-16 sm:py-24">
      <Reveal className="bg-brand-gradient relative overflow-hidden rounded-4xl px-6 py-14 text-center shadow-lift sm:px-12">
        <div
          aria-hidden="true"
          className="pointer-events-none absolute -top-24 -right-16 size-72 rounded-full bg-accent/25 blur-3xl"
        />
        <div
          aria-hidden="true"
          className="pointer-events-none absolute -bottom-28 -left-20 size-80 rounded-full bg-accent/15 blur-3xl"
        />
        <div className="relative">
          <h2 className="mx-auto max-w-2xl text-3xl font-semibold text-primary-foreground sm:text-4xl">
            {title}
          </h2>
          <p className="mx-auto mt-4 max-w-xl text-base text-primary-foreground/80">{body}</p>
          <div className="mt-8 flex flex-wrap justify-center gap-3">
            <Button
              asChild
              size="lg"
              className="rounded-full bg-accent text-accent-foreground hover:bg-accent/90"
            >
              <Link to="/book">
                Book your move
                <ArrowRight className="size-4" aria-hidden="true" />
              </Link>
            </Button>
            <Button
              asChild
              size="lg"
              variant="outline"
              className="rounded-full border-primary-foreground/35 bg-transparent text-primary-foreground hover:bg-primary-foreground/10 hover:text-primary-foreground"
            >
              <a href={`tel:${site.phone}`}>
                <Phone className="size-4" aria-hidden="true" />
                {site.phoneDisplay}
              </a>
            </Button>
          </div>
        </div>
      </Reveal>
    </section>
  );
}
