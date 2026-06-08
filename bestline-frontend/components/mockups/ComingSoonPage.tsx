import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import PageShell from "@/components/layout/PageShell";

type ComingSoonPageProps = {
  eyebrow?: string;
  title: string;
  description: string;
};

export default function ComingSoonPage({
  eyebrow = "Coming Soon",
  title,
  description,
}: ComingSoonPageProps) {
  return (
    <PageShell>
      <section className="rounded-3xl border border-border bg-card p-6 shadow-sm md:p-10">
        <p className="text-xs font-black uppercase tracking-[0.22em] text-primary">
          {eyebrow}
        </p>

        <h1 className="mt-3 max-w-3xl text-4xl font-black tracking-tight text-foreground md:text-5xl">
          {title}
        </h1>

        <p className="mt-4 max-w-2xl text-sm leading-7 text-muted-foreground md:text-base">
          {description}
        </p>

        <Link
          href="/"
          className="mt-7 inline-flex items-center gap-2 rounded-xl border border-border bg-muted px-4 py-2 text-sm font-black text-foreground transition hover:bg-secondary/40"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to Odds
        </Link>
      </section>
    </PageShell>
  );
}