import GuideSection from "@/components/guides/GuideSection";
import { guideFaqs } from "@/data/guidesContent";

export default function FAQSection() {
  return (
    <GuideSection
      title="Frequently Asked Questions"
      description="Quick answers to common beginner questions."
    >
      <div className="flex flex-col gap-3">
        {guideFaqs.map((faq) => (
          <div
            key={faq.id}
            className="rounded-2xl border border-border bg-muted/40 p-4"
          >
            <h3 className="font-black text-foreground">{faq.question}</h3>
            <p className="mt-2 text-sm leading-7 text-muted-foreground">
              {faq.answer}
            </p>
          </div>
        ))}
      </div>
    </GuideSection>
  );
}