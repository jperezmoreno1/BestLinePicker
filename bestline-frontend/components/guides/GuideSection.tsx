import { ReactNode } from "react";

interface GuideSectionProps {
  id?: string;
  title: string;
  description?: string;
  children: ReactNode;
}

export default function GuideSection({
  id,
  title,
  description,
  children,
}: GuideSectionProps) {
  return (
    <section id={id} style={styles.card}>
      <div style={styles.header}>
        <div style={styles.title}>{title}</div>
        {description ? <div style={styles.description}>{description}</div> : null}
      </div>

      <div style={styles.content}>{children}</div>
    </section>
  );
}

const styles: Record<string, React.CSSProperties> = {
  card: {
    background: "linear-gradient(180deg, rgba(255,255,255,0.96), rgba(255,255,255,0.92))",
    border: "1px solid rgba(255,255,255,0.18)",
    borderRadius: 18,
    padding: 16,
    boxShadow: "0 16px 40px rgba(0,0,0,0.25)",
    marginTop: 14,
  },
  header: {
    display: "flex",
    flexDirection: "column",
    gap: 4,
  },
  title: {
    fontSize: 16,
    fontWeight: 900,
    color: "#0f172a",
  },
  description: {
    fontSize: 13,
    color: "#475569",
  },
  content: {
    marginTop: 12,
  },
};