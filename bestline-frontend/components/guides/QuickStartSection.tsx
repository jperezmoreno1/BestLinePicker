import GuideSection from "@/components/guides/GuideSection";
import { quickStartItems } from "@/data/guidesContent";

export default function QuickStartSection() {
  return (
    <GuideSection
      title="How to Use BestLinePicker"
      description="A quick walkthrough of how the app features connect to betting terminology."
    >
      <div className="grid gap-3 md:grid-cols-2 xl:grid-cols-4">
        {quickStartItems.map((item) => (
          <div
            key={item.id}
            className="rounded-2xl border border-border bg-muted/40 p-4"
          >
            <h3 className="font-black text-foreground">{item.title}</h3>
            <p className="mt-2 text-sm leading-6 text-muted-foreground">
              {item.description}
            </p>
          </div>
        ))}
      </div>
    </GuideSection>
  );
}