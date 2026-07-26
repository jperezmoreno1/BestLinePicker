import { type GuideTerm } from "@/data/guidesContent";
import { getCategoryLabel, getRelatedTermNames } from "@/lib/guides";

interface TermCardProps {
  term: GuideTerm;
}

export default function TermCard({ term }: TermCardProps) {
  const relatedTerms = getRelatedTermNames(term);

  return (
    <article
      id={term.slug}
      className="rounded-2xl border border-border bg-card p-4 shadow-sm"
    >
      <div className="flex items-start justify-between gap-3">
        <div>
          <div className="text-lg font-black text-foreground">
            {term.term}
          </div>
          <div className="mt-1 text-sm text-muted-foreground">
            {term.shortDefinition}
          </div>
        </div>

        <span className="whitespace-nowrap rounded-full border border-primary/20 bg-primary/10 px-3 py-2 text-xs font-black text-primary">
          {getCategoryLabel(term.category)}
        </span>
      </div>

      <p className="mt-3 text-sm leading-7 text-foreground">
        {term.fullDefinition}
      </p>

      {term.examples?.length ? (
        <div className="mt-4">
          <div className="mb-2 text-xs font-black uppercase tracking-wide text-muted-foreground">
            Examples
          </div>
          <ul className="list-disc space-y-1 pl-[18px]">
            {term.examples.map((example) => (
              <li
                key={example}
                className="text-sm leading-7 text-foreground"
              >
                {example}
              </li>
            ))}
          </ul>
        </div>
      ) : null}

      {term.appRelevance?.length ? (
        <div className="mt-4">
          <div className="mb-2 text-xs font-black uppercase tracking-wide text-muted-foreground">
            Where this appears in the app
          </div>
          <div className="flex flex-wrap gap-2">
            {term.appRelevance.map((item) => (
              <span
                key={item}
                className="rounded-full border border-primary/20 bg-primary/10 px-3 py-1.5 text-xs font-extrabold text-primary"
              >
                {item}
              </span>
            ))}
          </div>
        </div>
      ) : null}

      {relatedTerms.length ? (
        <div className="mt-4">
          <div className="mb-2 text-xs font-black uppercase tracking-wide text-muted-foreground">
            Related terms
          </div>
          <div className="flex flex-wrap gap-2">
            {relatedTerms.map((related) => (
              <span
                key={related}
                className="rounded-full border border-border bg-muted px-3 py-1.5 text-xs font-extrabold text-foreground"
              >
                {related}
              </span>
            ))}
          </div>
        </div>
      ) : null}
    </article>
  );
}
