import type { CSSProperties } from "react";
import Link from "next/link";
import GuideHero from "@/components/guides/GuideHero";
import GuideSection from "@/components/guides/GuideSection";
import QuickStartSection from "@/components/guides/QuickStartSection";
import CategoryPills from "@/components/guides/CategoryPills";
import TermCard from "@/components/guides/TermCard";
import FAQSection from "@/components/guides/FAQSection";
import { getGroupedTerms } from "@/lib/guides";

export default function GuidesPage() {
  const groupedTerms = getGroupedTerms();

  return (
    <main style={styles.page}>
      <div style={styles.container}>
        <div style={styles.topBar}>
            <Link href="/" style={styles.backButton}>
                ← Back to Home
            </Link>
        </div>
        
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
            <div style={styles.gridTwo}>
              {terms.map((term) => (
                <TermCard key={term.id} term={term} />
              ))}
            </div>
          </GuideSection>
        ))}

        <FAQSection />

        <GuideSection title="Note">
          <p style={styles.noteText}>
            This page is intended for educational and informational use. It is
            designed to help users understand odds, market types, calculator
            outputs, and sportsbook comparison concepts used throughout
            BestLinePicker.
          </p>
        </GuideSection>
      </div>
    </main>
  );
}

const styles: Record<string, CSSProperties> = {
  page: {
    minHeight: "100vh",
    background: "#0b1020",
  },
  container: {
    maxWidth: 1180,
    margin: "0 auto",
    padding: "18px 18px 52px",
  },
  gridTwo: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit, minmax(320px, 1fr))",
    gap: 14,
    marginTop: 12,
  },
  noteText: {
    color: "#475569",
    fontSize: 14,
    lineHeight: 1.7,
  },
};