import GuideHero from "@/components/guides/GuideHero";
import GuideSection from "@/components/guides/GuideSection";
import QuickStartSection from "@/components/guides/QuickStartSection";
import CategoryPills from "@/components/guides/CategoryPills";
import TermCard from "@/components/guides/TermCard";
import FAQSection from "@/components/guides/FAQSection";
import PageShell from "@/components/layout/PageShell";
import { getGroupedTerms } from "@/lib/guides";

export default function GuidesPage() {
  const groupedTerms = getGroupedTerms();

  return (
    <PageShell>
      <GuideHero />

      <QuickStartSection />

      <GuideSection
        title="Browse by Category"
        description="Jump to a section based on the type of concept you want to learn."
      >
        <CategoryPills />
      </GuideSection>

      {groupedTerms.map(({ category, terms }) => (
        <GuideSection
          key={category.id}
          id={category.id}
          title={category.label}
          description={category.description}
        >
          <div className="mt-3 grid gap-4 md:grid-cols-2">
            {terms.map((term) => (
              <TermCard key={term.id} term={term} />
            ))}
          </div>
        </GuideSection>
      ))}

      <FAQSection />

      <GuideSection title="Note">
        <p className="text-sm leading-7 text-muted-foreground">
          This page is intended for educational and informational use. It is
          designed to help users understand odds, market types, calculator
          outputs, and sportsbook comparison concepts used throughout
          BestLinePicker.
        </p>
      </GuideSection>
    </PageShell>
  );
}