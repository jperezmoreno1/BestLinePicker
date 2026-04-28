import Link from "next/link";
import { theme } from "@/styles/theme";
import type { League } from "@/types/odds";

type AppHeaderProps = {
  league: League;
  savingSnapshot: boolean;
  onLeagueChange: (league: League) => void;
  onRefresh: () => void;
  onSaveSnapshot: () => void;
};

export default function AppHeader({
  league,
  savingSnapshot,
  onLeagueChange,
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

        <div className={theme.headerActions}>
          <div>
            <label className={theme.labelLight}>League</label>
            <select
              value={league}
              onChange={(event) => onLeagueChange(event.target.value as League)}
              className={theme.selectDark}
            >
              <option value="NFL">NFL</option>
              <option value="NBA">NBA</option>
              <option value="MLB">MLB</option>
            </select>
          </div>

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