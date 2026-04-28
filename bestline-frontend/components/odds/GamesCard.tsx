import { theme } from "@/styles/theme";
import type { Game, League } from "@/types/odds";
import { formatDate, formatTime } from "@/utils/odds";

type GamesCardProps = {
  league: League;
  source: string;
  error: string;
  loading: boolean;
  search: string;
  selectedMatchupKey: string;
  filteredGames: Game[];
  lastUpdated: number;
  autoRefreshEnabled: boolean;
  refreshSeconds: number;
  selectedEventMeta: {
    status: string;
    valueScore: number;
    booksCount: number;
  } | null;
  onSearchChange: (value: string) => void;
  onSelectedMatchupChange: (value: string) => void;
  onAutoRefreshChange: (value: boolean) => void;
  onRefreshSecondsChange: (value: number) => void;
};

export default function GamesCard({
  league,
  source,
  error,
  loading,
  search,
  selectedMatchupKey,
  filteredGames,
  lastUpdated,
  autoRefreshEnabled,
  refreshSeconds,
  selectedEventMeta,
  onSearchChange,
  onSelectedMatchupChange,
  onAutoRefreshChange,
  onRefreshSecondsChange,
}: GamesCardProps) {
  return (
    <section className={theme.card}>
      <div className={theme.cardHeader}>
        <div>
          <div className={theme.cardTitle}>Games</div>
          <div className={theme.cardSubtitle}>
            Pick a matchup, then shop lines across sportsbooks.
          </div>
        </div>

        <span className={theme.metaPill}>
          Last updated <strong>{formatTime(lastUpdated)}</strong> •{" "}
          <strong>{source || "-"}</strong>
        </span>
      </div>

      {error && <div className={theme.errorBox}>Error: {error}</div>}

      {loading && <div className={theme.loadingBox}>Loading live odds...</div>}

      <div className={theme.gameGrid}>
        <input
          value={search}
          onChange={(event) => onSearchChange(event.target.value)}
          placeholder={`Search ${league} teams...`}
          className={theme.inputLight}
        />

        <select
          value={selectedMatchupKey}
          onChange={(event) => onSelectedMatchupChange(event.target.value)}
          className={theme.selectLight}
        >
          {filteredGames.length === 0 ? (
            <option value="" disabled>
              No games loaded yet
            </option>
          ) : (
            filteredGames.map((game) => (
              <option key={game.matchupKey} value={game.matchupKey}>
                {formatDate(game.startTs)} • {formatTime(game.startTs)} •{" "}
                {game.away} @ {game.home}
              </option>
            ))
          )}
        </select>

        <div className={theme.autoBox}>
          <label className="flex items-center gap-2 text-sm font-black text-slate-900">
            <input
              type="checkbox"
              checked={autoRefreshEnabled}
              onChange={(event) => onAutoRefreshChange(event.target.checked)}
              className="h-4 w-4"
            />
            Auto refresh
          </label>

          <div className="flex items-center gap-2">
            <span className="text-xs font-black text-slate-600">Every</span>
            <input
              type="number"
              min={5}
              step={5}
              value={refreshSeconds}
              onChange={(event) =>
                onRefreshSecondsChange(Number(event.target.value))
              }
              className="w-20 rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm outline-none"
            />
            <span className="text-xs font-black text-slate-600">sec</span>
          </div>
        </div>
      </div>

      {selectedEventMeta && (
        <div className={theme.eventMetaRow}>
          <span className={theme.eventMetaPill}>
            Status: <strong>{selectedEventMeta.status}</strong>
          </span>

          <span className={theme.eventMetaPill}>
            Books shown: <strong>{selectedEventMeta.booksCount}</strong>
          </span>

          <span className={theme.eventMetaPill}>
            Value score:{" "}
            <strong>{selectedEventMeta.valueScore.toFixed(2)}</strong>
          </span>
        </div>
      )}
    </section>
  );
}