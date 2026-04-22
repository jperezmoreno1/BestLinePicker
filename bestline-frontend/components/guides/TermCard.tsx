import { type GuideTerm } from "@/data/guidesContent";
import { getCategoryLabel, getRelatedTermNames } from "@/lib/guides";

interface TermCardProps {
  term: GuideTerm;
}

export default function TermCard({ term }: TermCardProps) {
  const relatedTerms = getRelatedTermNames(term);

  return (
    <article id={term.slug} style={styles.card}>
      <div style={styles.topRow}>
        <div>
          <div style={styles.term}>{term.term}</div>
          <div style={styles.shortDefinition}>{term.shortDefinition}</div>
        </div>

        <span style={styles.categoryBadge}>
          {getCategoryLabel(term.category)}
        </span>
      </div>

      <p style={styles.fullDefinition}>{term.fullDefinition}</p>

      {term.examples?.length ? (
        <div style={styles.block}>
          <div style={styles.blockTitle}>Examples</div>
          <ul style={styles.list}>
            {term.examples.map((example) => (
              <li key={example} style={styles.listItem}>
                {example}
              </li>
            ))}
          </ul>
        </div>
      ) : null}

      {term.appRelevance?.length ? (
        <div style={styles.block}>
          <div style={styles.blockTitle}>Where this appears in the app</div>
          <div style={styles.tagWrap}>
            {term.appRelevance.map((item) => (
              <span key={item} style={styles.appTag}>
                {item}
              </span>
            ))}
          </div>
        </div>
      ) : null}

      {relatedTerms.length ? (
        <div style={styles.block}>
          <div style={styles.blockTitle}>Related terms</div>
          <div style={styles.tagWrap}>
            {relatedTerms.map((related) => (
              <span key={related} style={styles.relatedTag}>
                {related}
              </span>
            ))}
          </div>
        </div>
      ) : null}
    </article>
  );
}

const styles: Record<string, React.CSSProperties> = {
  card: {
    border: "1px solid #e2e8f0",
    borderRadius: 16,
    padding: 14,
    background: "#ffffff",
  },
  topRow: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "flex-start",
    gap: 12,
  },
  term: {
    fontSize: 18,
    fontWeight: 900,
    color: "#0f172a",
  },
  shortDefinition: {
    marginTop: 4,
    fontSize: 13,
    color: "#64748b",
  },
  categoryBadge: {
    fontSize: 12,
    fontWeight: 900,
    color: "#3730a3",
    background: "#eef2ff",
    border: "1px solid #c7d2fe",
    padding: "8px 10px",
    borderRadius: 999,
    whiteSpace: "nowrap",
  },
  fullDefinition: {
    marginTop: 12,
    marginBottom: 0,
    fontSize: 14,
    lineHeight: 1.7,
    color: "#334155",
  },
  block: {
    marginTop: 14,
  },
  blockTitle: {
    fontSize: 12,
    fontWeight: 900,
    color: "#475569",
    marginBottom: 8,
    textTransform: "uppercase",
    letterSpacing: 0.4,
  },
  list: {
    margin: 0,
    paddingLeft: 18,
  },
  listItem: {
    color: "#334155",
    fontSize: 14,
    lineHeight: 1.7,
    marginBottom: 4,
  },
  tagWrap: {
    display: "flex",
    flexWrap: "wrap",
    gap: 8,
  },
  appTag: {
    fontSize: 12,
    fontWeight: 800,
    color: "#3730a3",
    background: "#eef2ff",
    border: "1px solid #c7d2fe",
    padding: "6px 10px",
    borderRadius: 999,
  },
  relatedTag: {
    fontSize: 12,
    fontWeight: 800,
    color: "#334155",
    background: "#f8fafc",
    border: "1px solid #e2e8f0",
    padding: "6px 10px",
    borderRadius: 999,
  },
};