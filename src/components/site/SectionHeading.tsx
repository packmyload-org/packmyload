import { cn } from "@/lib/utils";
import { Reveal } from "./Reveal";

export function SectionHeading({
  eyebrow,
  title,
  body,
  align = "center",
  invert = false,
  className,
}: {
  eyebrow?: string;
  title: string;
  body?: string;
  align?: "center" | "left";
  invert?: boolean;
  className?: string;
}) {
  return (
    <Reveal
      className={cn(
        "max-w-3xl",
        align === "center" ? "mx-auto text-center" : "text-left",
        className,
      )}
    >
      {eyebrow ? (
        <p
          className={cn(
            "mb-3 text-xs font-semibold tracking-[0.22em] uppercase",
            invert ? "text-accent" : "text-accent-foreground/60",
          )}
        >
          {eyebrow}
        </p>
      ) : null}
      <h2
        className={cn(
          "text-3xl leading-[1.08] font-semibold sm:text-4xl lg:text-5xl",
          invert ? "text-primary-foreground" : "text-foreground",
        )}
      >
        {title}
      </h2>
      {body ? (
        <p
          className={cn(
            "mt-4 text-base leading-relaxed sm:text-lg",
            invert ? "text-primary-foreground/80" : "text-muted-foreground",
          )}
        >
          {body}
        </p>
      ) : null}
    </Reveal>
  );
}
