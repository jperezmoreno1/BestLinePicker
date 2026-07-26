import { guideCategories } from "@/data/guidesContent";

export default function CategoryPills() {
  return (
    <div className="flex flex-wrap gap-2">
      {guideCategories.map((category) => (
        <a
          key={category.id}
          href={`#${category.id}`}
          className="rounded-full border border-border bg-card px-4 py-2 text-sm font-black text-foreground shadow-sm transition hover:border-primary/40 hover:bg-primary/10"
        >
          {category.label}
        </a>
      ))}
    </div>
  );
}