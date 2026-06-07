import Link from "next/link";
import {
  ArrowRight,
  BarChart3,
  BookOpen,
  Calculator,
  Clock,
  Heart,
  Trophy,
} from "lucide-react";
import PageShell from "@/components/layout/PageShell";

const leagueCards = [
  {
    label: "NFL",
    href: "/nfl",
    description: "Compare live NFL moneyline, spread, and total prices.",
  },
  {
    label: "NBA",
    href: "/nba",
    description: "Shop NBA lines across your preferred sportsbooks.",
  },
  {
    label: "MLB",
    href: "/mlb",
    description: "Find the best baseball prices before placing a bet.",
  },
];

const featureCards = [
  {
    title: "Best odds highlighting",
    description:
      "Quickly spot the strongest price across available books for each market.",
    icon: Trophy,
  },
  {
    title: "Line calculator",
    description:
      "Estimate payout, profit, implied probability, and best-line difference.",
    icon: Calculator,
  },
  {
    title: "Tracked lines",
    description:
      "Save lines you care about and check how they move over time.",
    icon: Heart,
  },
  {
    title: "Snapshot history",
    description:
      "Review saved odds snapshots for previous games and market checks.",
    icon: Clock,
  },
];

export default function HomePage() {
  return (
    <PageShell>
      <section className="grid gap-8 rounded-3xl border border-border bg-card p-6 shadow-sm lg:grid-cols-[1.1fr_0.9fr] lg:p-10">
        <div>
          <p className="text-sm font-black uppercase tracking-[0.22em] text-primary">
            Live Odds Comparison
          </p>

          <h1 className="mt-4 max-w-3xl text-4xl font-black tracking-tight text-foreground md:text-6xl">
            Shop the best line before you place the bet.
          </h1>

          <p className="mt-5 max-w-2xl text-base leading-8 text-muted-foreground md:text-lg">
            BestLinePicker compares live odds across sportsbooks, highlights the
            best available price, and helps you calculate payout, profit, and
            implied probability before locking in a line.
          </p>

          <div className="mt-7 flex flex-col gap-3 sm:flex-row">
            <Link
              href="/nfl"
              className="inline-flex items-center justify-center gap-2 rounded-xl bg-primary px-5 py-3 text-sm font-black text-primary-foreground shadow-sm transition hover:bg-primary/90"
            >
              Start Comparing
              <ArrowRight className="h-4 w-4" />
            </Link>

            <Link
              href="/guides"
              className="inline-flex items-center justify-center gap-2 rounded-xl border border-border bg-muted px-5 py-3 text-sm font-black text-foreground transition hover:bg-secondary/40"
            >
              <BookOpen className="h-4 w-4" />
              Read the Guide
            </Link>
          </div>
        </div>

        <div className="rounded-3xl border border-border bg-background p-4">
          <div className="rounded-2xl border border-border bg-card p-4 shadow-sm">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs font-black uppercase tracking-wide text-muted-foreground">
                  Featured board
                </p>
                <h2 className="mt-1 text-xl font-black text-foreground">
                  Choose a league
                </h2>
              </div>

              <BarChart3 className="h-6 w-6 text-primary" />
            </div>

            <div className="mt-4 grid gap-3">
              {leagueCards.map((league) => (
                <Link
                  key={league.label}
                  href={league.href}
                  className="group rounded-2xl border border-border bg-muted/40 p-4 transition hover:border-primary/40 hover:bg-muted"
                >
                  <div className="flex items-center justify-between gap-3">
                    <div>
                      <h3 className="font-black text-foreground">
                        {league.label}
                      </h3>
                      <p className="mt-1 text-sm leading-6 text-muted-foreground">
                        {league.description}
                      </p>
                    </div>

                    <ArrowRight className="h-4 w-4 text-muted-foreground transition group-hover:translate-x-1 group-hover:text-primary" />
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section className="mt-6 grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {featureCards.map((feature) => {
          const Icon = feature.icon;

          return (
            <div
              key={feature.title}
              className="rounded-2xl border border-border bg-card p-5 shadow-sm"
            >
              <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-primary/10 text-primary">
                <Icon className="h-5 w-5" />
              </div>

              <h3 className="mt-4 font-black text-foreground">
                {feature.title}
              </h3>

              <p className="mt-2 text-sm leading-6 text-muted-foreground">
                {feature.description}
              </p>
            </div>
          );
        })}
      </section>
    </PageShell>
  );
}