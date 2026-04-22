import { guideFaqs } from "@/data/guidesContent";
import GuideSection from "./GuideSection";

export default function FAQSection() {
  return (
    <GuideSection
      title="Frequently Asked Questions"
      description="Quick answers to common beginner questions."
    >
      <div style={styles.list}>
        {guideFaqs.map((faq) => (
          <div key={faq.id} style={styles.item}>
            <div style={styles.question}>{faq.question}</div>
            <div style={styles.answer}>{faq.answer}</div>
          </div>
        ))}
      </div>
    </GuideSection>
  );
}

const styles: Record<string, React.CSSProperties> = {
  list: {
    display: "flex",
    flexDirection: "column",
    gap: 10,
  },
  item: {
    padding: 14,
    borderRadius: 14,
    border: "1px solid #e2e8f0",
    background: "#ffffff",
  },
  question: {
    fontWeight: 900,
    color: "#0f172a",
    marginBottom: 8,
  },
  answer: {
    fontSize: 14,
    lineHeight: 1.7,
    color: "#475569",
  },
};