import Link from "next/link";
import { ArrowLeft, BookOpen } from "lucide-react";

export default function GuideHero() {
  return (
    <section className="rounded-3xl border border-border bg-card p-6 shadow-sm lg:p-8">
      <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-primary/10 text-primary">
          <BookOpen className="h-7 w-7" />
      </div>

      <div className="mt-6 grid gap-6 lg:grid-cols-[1fr_auto] lg:items-end">
        <div>
          <p className="text-xs font-black uppercase tracking-[0.22em] text-primary">
            BestLinePicker
          </p>

          <h1 className="mt-3 text-3xl font-black tracking-tight text-foreground md:text-5xl">
            Guides & Terminology
          </h1>

          <p className="mt-4 max-w-3xl text-sm leading-7 text-muted-foreground md:text-base">
            Learn the core betting terms behind the odds on BestLinePicker. This
            page explains market types, sportsbook pricing, line shopping, and
            calculator concepts used throughout the app.
          </p>

          <div className="flex justify-end lg:self-end">
            <Link href="/" className="inline-flex w-fit items-center gap-2 rounded-xl border border-border bg-muted px-4 py-2 text-sm font-black text-foreground transition hover:bg-secondary/40">
              <ArrowLeft className="h-4 w-4" />
              Back to Home
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}