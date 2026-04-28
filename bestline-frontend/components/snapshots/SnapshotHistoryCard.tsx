import Link from "next/link";
import { theme } from "@/styles/theme";
import type { Snapshot } from "@/types/odds";
import { formatOdds, formatTime } from "@/utils/odds";

type SnapshotHistoryCardProps = {
  snapshots: Snapshot[];
  snapshotsLoading: boolean;
  snapshotError: string;
  mode?: "recent" | "full";
};

export default function SnapshotHistoryCard({
  snapshots,
  snapshotsLoading,
  snapshotError,
  mode = "full",
}: SnapshotHistoryCardProps) {
  const isRecentMode = mode === "recent";
  const visibleSnapshots = isRecentMode ? snapshots.slice(0, 1) : snapshots;

  return (
    <section className={theme.card}>
      <div className={theme.cardHeader}>
        <div>
          <div className={theme.cardTitle}>
            {isRecentMode ? "Recent Saved Snapshot" : "Snapshot History"}
          </div>

          <div className={theme.cardSubtitle}>
            {isRecentMode
              ? "Your most recently saved odds snapshot for this game and market."
              : "Saved snapshots are tied to a specific game, market, and selection."}
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <span className={theme.metaPill}>
            Saved <strong>{snapshots.length}</strong>
          </span>

          {isRecentMode && (
            <Link href="/history" className={theme.metaPill}>
              View Full History
            </Link>
          )}
        </div>
      </div>

      {snapshotError && (
        <div className={theme.errorBox}>Error: {snapshotError}</div>
      )}

      {snapshotsLoading ? (
        <div className={theme.loadingBox}>Loading snapshots...</div>
      ) : visibleSnapshots.length === 0 ? (
        <div className={theme.emptyState}>
          {isRecentMode ? (
            <>
              No recent snapshot yet. Select a line, then click{" "}
              <strong>Save Snapshot</strong>.
            </>
          ) : (
            <>
              No snapshots yet. Let auto refresh run for a bit, then click{" "}
              <strong>Save Snapshot</strong>.
            </>
          )}
        </div>
      ) : (
        <div className={theme.snapshotList}>
          {visibleSnapshots.map((snapshot) => (
            <div key={snapshot.id} className={theme.snapshotItem}>
              <div>
                <div className={theme.snapshotTitle}>
                  {snapshot.matchup_label}
                </div>

                <div className={theme.snapshotSub}>
                  {snapshot.market_label} • {snapshot.selection_label} • Saved{" "}
                  {formatTime(Date.parse(snapshot.created_at))}
                </div>
              </div>

              <div>
                <span className={theme.snapshotBest}>
                  Best at save:{" "}
                  {snapshot.best_price !== null
                    ? formatOdds(snapshot.best_price)
                    : "N/A"}
                  {snapshot.best_bookmaker_title
                    ? ` • ${snapshot.best_bookmaker_title}`
                    : ""}
                </span>
              </div>
            </div>
          ))}
        </div>
      )}

      {isRecentMode && visibleSnapshots.length > 0 && (
        <div className="mt-3">
          <Link href="/history" className={theme.navLink}>
            View Full Snapshot History
          </Link>
        </div>
      )}
    </section>
  );
}