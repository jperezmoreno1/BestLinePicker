import Link from "next/link";
import { theme } from "@/styles/theme";

export default function HomePage() {
  return (
    <main className={theme.page}>
      <header className={theme.header}>
        <div className={theme.headerInner}>
          <div className={theme.brandWrap}>
            <div className={theme.logoDot} />

            <div>
              <div className={theme.brandTitle}>BestLinePicker</div>
              <div className={theme.brandSubtitle}>
                Compare odds across books and find the best line fast.
              </div>
            </div>
          </div>

          <div className={theme.headerActions}>
            <Link href="/guides" className={theme.navLink}>
              Guides
            </Link>

            <Link href="/history" className={theme.navLink}>
              History
            </Link>
          </div>
        </div>
      </header>

      <section className="mx-auto flex min-h-[calc(100vh-90px)] max-w-7xl flex-col justify-center px-4 py-12">
        <div className="max-w-3xl">
          <p className="mb-3 text-sm font-black uppercase tracking-[0.25em] text-indigo-300">
            Live Odds Comparison
          </p>

          <h1 className="text-5xl font-black tracking-tight text-white md:text-7xl">
            Shop the best line before you place the bet.
          </h1>

          <p className="mt-6 max-w-2xl text-lg leading-8 text-slate-300">
            BestLinePicker compares sportsbook odds across NFL, NBA, and MLB
            games so you can quickly spot the best price, calculate payouts,
            and save snapshots of the market.
          </p>
        </div>

        <div className="mt-10 grid gap-4 md:grid-cols-3">
          <Link
            href="/nfl"
            className="rounded-[18px] border border-white/20 bg-gradient-to-b from-white/95 to-white/90 p-6 text-slate-900 shadow-[0_16px_40px_rgba(0,0,0,0.25)] transition hover:-translate-y-1 hover:border-indigo-200 hover:bg-indigo-50"
          >
            <div className="text-sm font-black uppercase tracking-wide text-slate-500">
              Football
            </div>
            <div className="mt-2 text-3xl font-black text-slate-950">NFL</div>
            <p className="mt-3 text-sm leading-6 text-slate-600">
              View live and scheduled NFL games, compare moneyline, spread, and
              total markets.
            </p>
          </Link>

          <Link
            href="/nba"
            className="rounded-[18px] border border-white/20 bg-gradient-to-b from-white/95 to-white/90 p-6 text-slate-900 shadow-[0_16px_40px_rgba(0,0,0,0.25)] transition hover:-translate-y-1 hover:border-indigo-200 hover:bg-indigo-50"
          >
            <div className="text-sm font-black uppercase tracking-wide text-slate-500">
              Basketball
            </div>
            <div className="mt-2 text-3xl font-black text-slate-950">NBA</div>
            <p className="mt-3 text-sm leading-6 text-slate-600">
              Browse NBA matchups, check live status, and find the best
              available sportsbook line.
            </p>
          </Link>

          <Link
            href="/mlb"
            className="rounded-[18px] border border-white/20 bg-gradient-to-b from-white/95 to-white/90 p-6 text-slate-900 shadow-[0_16px_40px_rgba(0,0,0,0.25)] transition hover:-translate-y-1 hover:border-indigo-200 hover:bg-indigo-50"
          >
            <div className="text-sm font-black uppercase tracking-wide text-slate-500">
              Baseball
            </div>
            <div className="mt-2 text-3xl font-black text-slate-950">MLB</div>
            <p className="mt-3 text-sm leading-6 text-slate-600">
              Compare MLB odds by game and market, then save snapshots for later
              review.
            </p>
          </Link>
        </div>
      </section>
    </main>
  );
}