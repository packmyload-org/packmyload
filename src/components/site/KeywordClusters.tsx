import { Link } from "@tanstack/react-router";
import { Reveal } from "@/components/site/Reveal";
import { SectionHeading } from "@/components/site/SectionHeading";
import { keywordClusters } from "@/lib/seo-data";

type Props = {
  eyebrow?: string;
  title?: string;
  body?: string;
};

export function KeywordClusters({
  eyebrow = "Moving services",
  title = "What people search for, and where we answer it",
  body = "Whether you need movers and packers, an office relocation company or interstate transport, every service below is delivered by one insured team in Lagos, Abuja and across Nigeria.",
}: Props) {
  return (
    <section className="container-page pb-16 sm:pb-20">
      <SectionHeading eyebrow={eyebrow} title={title} body={body} />
      <div className="mt-10 grid gap-6 sm:grid-cols-2">
        {keywordClusters.map((cluster) => (
          <Reveal
            key={cluster.heading}
            className="rounded-3xl border border-border bg-card p-6 shadow-soft"
          >
            <h3 className="font-display text-lg font-semibold">{cluster.heading}</h3>
            <ul className="mt-4 flex flex-wrap gap-2">
              {cluster.terms.map((term) => (
                <li key={term.label}>
                  <Link
                    to={term.to}
                    className="inline-flex rounded-full border border-border px-3 py-1.5 text-sm text-muted-foreground transition-colors hover:border-primary hover:text-primary"
                  >
                    {term.label}
                  </Link>
                </li>
              ))}
            </ul>
          </Reveal>
        ))}
      </div>
    </section>
  );
}
