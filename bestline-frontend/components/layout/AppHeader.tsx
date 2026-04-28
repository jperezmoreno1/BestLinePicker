import Link from "next/link";
import { theme } from "@/styles/theme";
import type { League } from "@/types/odds";

type AppHeaderProps = {
  activeLeague: League;
  savingSnapshot: boolean;
  onRefresh: () => void;
  onSaveSnapshot: () => void;
};

const LEAGUE_LINKS: Array<{
  label: League;
  href: string;
}> = [
  { label: "NFL", href: "/nfl" },
  { label: "NBA", href: "/nba" },
  { label: "MLB", href: "/mlb" },
];

export default function AppHeader({
  activeLeague,
  savingSnapshot,
  onRefresh,
  onSaveSnapshot,
}: AppHeaderProps) {
  return (
    <header className={theme.header}>
      <div className={theme.headerInner}>
        <div className={theme.brandWrap}>
          <div className={theme.logoDot} />

          <div>
            <div className={theme.brandTitle}>BestLinePicker</div>
            <div className={theme.brandSubtitle}>
              Compare Odds Across Books
            </div>
          </div>
        </div>

        <nav className="flex flex-wrap items-center gap-2">
          {LEAGUE_LINKS.map((link) => {
            const active = link.label === activeLeague;

            return (
              <Link
                key={link.label}
                href={link.href}
                className={`${theme.navLink} ${
                  active
                    ? "border-indigo-300 bg-indigo-500/30 text-white"
                    : ""
                }`}
              >
                {link.label}
              </Link>
            );
          })}
        </nav>

        <div className={theme.headerActions}>
          <button
            type="button"
            onClick={onRefresh}
            className={theme.buttonSecondary}
          >
            Refresh
          </button>

          <Link href="/guides" className={theme.navLink}>
            Guides
          </Link>

          <Link href="/history" className={theme.navLink}>
            History
          </Link>

          <button
            type="button"
            onClick={onSaveSnapshot}
            disabled={savingSnapshot}
            className={theme.buttonPrimary}
          >
            {savingSnapshot ? "Saving..." : "Save Snapshot"}
          </button>
        </div>
      </div>
    </header>
  );
}