import type { ReactNode } from "react";

export function PageHero({
  eyebrow,
  title,
  body,
  children,
}: {
  eyebrow?: string;
  title: string;
  body?: string;
  children?: ReactNode;
}) {
  return (
    <section className="bg-brand-gradient relative overflow-hidden">
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -top-32 right-0 size-96 rounded-full bg-accent/20 blur-3xl"
      />
      <div className="container-page relative py-16 sm:py-24">
        {eyebrow ? (
          <p className="text-xs font-semibold tracking-[0.24em] uppercase text-accent">{eyebrow}</p>
        ) : null}
        <h1 className="mt-3 max-w-3xl text-4xl leading-[1.05] font-semibold text-primary-foreground sm:text-5xl lg:text-6xl">
          {title}
        </h1>
        {body ? (
          <p className="mt-5 max-w-2xl text-base leading-relaxed text-primary-foreground/80 sm:text-lg">
            {body}
          </p>
        ) : null}
        {children ? <div className="mt-8">{children}</div> : null}
      </div>
    </section>
  );
}
