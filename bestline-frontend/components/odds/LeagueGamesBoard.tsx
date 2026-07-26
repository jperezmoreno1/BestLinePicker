"use client";

import { useState } from "react";
import { theme } from "@/styles/theme";
import type { Game, League } from "@/types/odds";
import GameCard from "@/components/odds/GameCard";

type LeagueGamesBoardProps = {
  league: League;
  games: Game[];
  selectedMatchupKey: string;
  onSelectGame: (matchupKey: string) => void;
  emptyMessage?: string;
};

const SCHEDULED_PREVIEW_COUNT = 3;

export default function LeagueGamesBoard({
  league,
  games,
  selectedMatchupKey,
  onSelectGame,
  emptyMessage,
}: LeagueGamesBoardProps) {
  const [showAllScheduledGames, setShowAllScheduledGames] = useState(false);

  const liveGames = games.filter((game) => game.eventStatus === "live");
  const scheduledGames = games.filter((game) => game.eventStatus !== "live");

  const visibleScheduledGames = showAllScheduledGames
    ? scheduledGames
    : scheduledGames.slice(0, SCHEDULED_PREVIEW_COUNT);

  const hasMoreScheduledGames =
    scheduledGames.length > SCHEDULED_PREVIEW_COUNT;

  return (
    <section className={theme.card}>
      <div className={theme.cardHeader}>
        <div>
          <div className={theme.cardTitle}>{league} Games</div>
          <div className={theme.cardSubtitle}>
            Select a game to compare markets, odds, and payouts.
          </div>
        </div>

        <span className={theme.metaPill}>{games.length} games loaded</span>
      </div>

      {games.length === 0 && emptyMessage ? (
        <div className={theme.emptyState}>{emptyMessage}</div>
      ) : (
        <div className="mt-5 space-y-8">
          <div>
            <div className="mb-3 flex items-center justify-between gap-3">
              <h2 className="text-sm font-black uppercase tracking-wide text-muted-foreground">
                Live Games
              </h2>

              <span className={theme.metaPill}>{liveGames.length}</span>
            </div>

            <div className="space-y-3">
              {liveGames.length === 0 ? (
                <div className={theme.emptyState}>No live games right now.</div>
              ) : (
                liveGames.map((game) => (
                  <GameCard
                    key={game.matchupKey}
                    game={game}
                    selected={game.matchupKey === selectedMatchupKey}
                    onClick={() => onSelectGame(game.matchupKey)}
                  />
                ))
              )}
            </div>
          </div>

          <div>
            <div className="mb-3 flex items-center justify-between gap-3">
              <h2 className="text-sm font-black uppercase tracking-wide text-muted-foreground">
                Scheduled Games
              </h2>

              <span className={theme.metaPill}>
                Showing {visibleScheduledGames.length} of {scheduledGames.length}
              </span>
            </div>

            <div className="space-y-3">
              {scheduledGames.length === 0 ? (
                <div className={theme.emptyState}>No scheduled games found.</div>
              ) : (
                visibleScheduledGames.map((game) => (
                  <GameCard
                    key={game.matchupKey}
                    game={game}
                    selected={game.matchupKey === selectedMatchupKey}
                    onClick={() => onSelectGame(game.matchupKey)}
                  />
                ))
              )}
            </div>

            {hasMoreScheduledGames && (
              <div className="mt-4 flex justify-center">
                <button
                  type="button"
                  onClick={() =>
                    setShowAllScheduledGames((currentValue) => !currentValue)
                  }
                  className={theme.buttonSecondary}
                >
                  {showAllScheduledGames
                    ? "Show Fewer Games"
                    : `See More Games (${
                        scheduledGames.length - SCHEDULED_PREVIEW_COUNT
                      } more)`}
                </button>
              </div>
            )}
          </div>
        </div>
      )}
    </section>
  );
}