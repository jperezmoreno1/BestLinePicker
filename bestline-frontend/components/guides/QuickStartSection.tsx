import { quickStartItems } from "@/data/guidesContent";
import GuideSection from "./GuideSection";

export default function QuickStartSection() {
  return (
    <GuideSection
      title="How to Use BestLinePicker"
      description="A quick walkthrough of how the app features connect to betting terminology."
    >
      <div style={styles.grid}>
        {quickStartItems.map((item) => (
          <div key={item.id} style={styles.itemCard}>
            <div style={styles.itemTitle}>{item.title}</div>
            <div style={styles.itemDescription}>{item.description}</div>
          </div>
        ))}
      </div>
    </GuideSection>
  );
}

const styles: Record<string, React.CSSProperties> = {
  grid: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))",
    gap: 12,
  },
  itemCard: {
    border: "1px solid #e2e8f0",
    borderRadius: 16,
    padding: 14,
    background: "#ffffff",
  },
  itemTitle: {
    fontWeight: 900,
    color: "#0f172a",
    marginBottom: 8,
  },
  itemDescription: {
    fontSize: 14,
    lineHeight: 1.65,
    color: "#475569",
  },
};