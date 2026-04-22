import { guideCategories } from "@/data/guidesContent";

export default function CategoryPills() {
  return (
    <div style={styles.wrap}>
      {guideCategories.map((category) => (
        <a key={category.id} href={`#${category.id}`} style={styles.pill}>
          {category.label}
        </a>
      ))}
    </div>
  );
}

const styles: Record<string, React.CSSProperties> = {
  wrap: {
    display: "flex",
    flexWrap: "wrap",
    gap: 10,
  },
  pill: {
    padding: "10px 12px",
    borderRadius: 999,
    border: "1px solid #c7d2fe",
    background: "#eef2ff",
    color: "#3730a3",
    fontWeight: 800,
    fontSize: 14,
    textDecoration: "none",
  },
};