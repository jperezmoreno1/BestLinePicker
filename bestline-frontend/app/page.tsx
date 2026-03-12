"use client";

import { useState } from "react";

type SportOption = "nfl" | "nba" | "mlb";

export default function HomePage() {
  const [selectedSport, setSelectedSport] = useState<SportOption>("nfl");

  const handleFetchOdds = () => {
    alert(`Fetch Odds clicked for ${selectedSport.toUpperCase()}`);
  };

  return (
    <main style={styles.page}>
      <nav style={styles.navbar}>
        <div style={styles.logo}>BestLine Picker</div>

        <div style={styles.controls}>
          <select
            value={selectedSport}
            onChange={(e) => setSelectedSport(e.target.value as SportOption)}
            style={styles.select}
          >
            <option value="nfl">NFL</option>
            <option value="nba">NBA</option>
            <option value="mlb">MLB</option>
          </select>

          <button onClick={handleFetchOdds} style={styles.button}>
            Fetch Odds
          </button>
        </div>
      </nav>

      <section style={styles.content}>
        <h1 style={styles.heading}>Sports Odds Dashboard</h1>
        <p style={styles.subtext}>
          Selected sport: <strong>{selectedSport.toUpperCase()}</strong>
        </p>
      </section>
    </main>
  );
}

const styles: Record<string, React.CSSProperties> = {
  page: {
    minHeight: "100vh",
    margin: 0,
    backgroundColor: "#f7f8fc",
    fontFamily: "Arial, sans-serif",
    color: "#111827",
  },
  navbar: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    padding: "16px 24px",
    backgroundColor: "#111827",
    color: "#ffffff",
  },
  logo: {
    fontSize: "1.25rem",
    fontWeight: 700,
  },
  controls: {
    display: "flex",
    alignItems: "center",
    gap: "12px",
  },
  select: {
    padding: "10px 12px",
    borderRadius: "8px",
    border: "1px solid #d1d5db",
    fontSize: "0.95rem",
    backgroundColor: "#ffffff",
    color: "#111827",
  },
  button: {
    padding: "10px 16px",
    borderRadius: "8px",
    border: "none",
    backgroundColor: "#2563eb",
    color: "#ffffff",
    fontWeight: 600,
    cursor: "pointer",
  },
  content: {
    padding: "40px 24px",
  },
  heading: {
    fontSize: "2rem",
    marginBottom: "8px",
  },
  subtext: {
    fontSize: "1rem",
    color: "#4b5563",
  },
};