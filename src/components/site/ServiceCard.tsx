import { Link } from "@tanstack/react-router";
import { ArrowUpRight } from "lucide-react";
import type { Service } from "@/lib/site-data";

export function ServiceCard({ service, eager = false }: { service: Service; eager?: boolean }) {
  return (
    <Link
      to={service.path}
      className="group relative flex flex-col overflow-hidden rounded-3xl border border-border/70 bg-card shadow-soft transition-all duration-300 hover:-translate-y-1 hover:shadow-lift"
    >
      <div className="aspect-16/10 overflow-hidden bg-secondary">
        <img
          src={service.image}
          alt={`${service.title} service by Packmyload in Lagos and Abuja`}
          width={800}
          height={500}
          loading={eager ? "eager" : "lazy"}
          className="size-full object-cover transition-transform duration-500 group-hover:scale-105"
        />
      </div>
      <div className="flex flex-1 flex-col p-5">
        <h3 className="flex items-start justify-between gap-3 text-lg font-semibold text-foreground">
          {service.title}
          <ArrowUpRight
            className="mt-1 size-5 shrink-0 text-accent transition-transform duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5"
            aria-hidden="true"
          />
        </h3>
        <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{service.short}</p>
      </div>
    </Link>
  );
}
