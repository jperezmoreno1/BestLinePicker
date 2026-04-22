export default function GuideHero() {
  return (
    <section style={styles.card}>
      <div style={styles.heroWrap}>
        <div>
          <div style={styles.eyebrow}>BestLinePicker</div>
          <h1 style={styles.title}>Guides & Terminology</h1>
          <p style={styles.description}>
            Learn the core betting terms behind the odds on BestLinePicker. This
            page explains market types, sportsbook pricing, line shopping, and
            calculator concepts used throughout the app.
          </p>
        </div>
      </div>
    </section>
  );
}

const styles: Record<string, React.CSSProperties> = {
  card: {
    background: "linear-gradient(180deg, rgba(255,255,255,0.96), rgba(255,255,255,0.92))",
    border: "1px solid rgba(255,255,255,0.18)",
    borderRadius: 18,
    padding: 18,
    boxShadow: "0 16px 40px rgba(0,0,0,0.25)",
    marginTop: 14,
  },
  heroWrap: {
    display: "flex",
    flexDirection: "column",
    gap: 10,
  },
  eyebrow: {
    fontSize: 12,
    fontWeight: 900,
    letterSpacing: 0.6,
    textTransform: "uppercase",
    color: "#3730a3",
  },
  title: {
    margin: 0,
    fontSize: 32,
    fontWeight: 900,
    color: "#0f172a",
    lineHeight: 1.1,
  },
  description: {
    marginTop: 10,
    marginBottom: 0,
    maxWidth: 780,
    fontSize: 15,
    lineHeight: 1.7,
    color: "#475569",
  },
};