"use client";

import { useEffect, useMemo, useState } from "react";
import LeagueGamesBoard from "@/components/odds/LeagueGamesBoard";
import AppHeader from "@/components/layout/AppHeader";
import FiltersCard from "@/components/odds/FiltersCard";
import MarketsCard from "@/components/odds/MarketsCard";
import CalculatorCard from "@/components/odds/CalculatorCard";
import SnapshotHistoryCard from "@/components/snapshots/SnapshotHistoryCard";
import { theme } from "@/styles/theme";
import {
  LEAGUE_TO_SPORT,
  MARKET_TO_KEY,
  type Book,
  type BooksMode,
  type DisplayEvent,
  type EventStatus,
  type Game,
  type League,
  type Market,
  type OddsEnvelope,
  type Snapshot,
  type SortBy,
  type SortOrder,
} from "@/types/odds";
import {
  bestOddsForSelection,
  buildBooksFromDisplayEvent,
  buildNormalizedOutcomesForSelection,
  getBestLineSummary,
  getInitialSelectionKey,
  getMatchupKey,
  getSelectionData,
  impliedProb,
  payoutForStake,
  profitForStake,
  toGame,
} from "@/utils/odds";

type OddsPageClientProps = {
  initialLeague: League;
};

export default function OddsPageClient({ initialLeague }: OddsPageClientProps) {
  const [region, setRegion] = useState("us");
  const [selectedBooks, setSelectedBooks] = useState<string[]>([]);

  const [league] = useState<League>(initialLeague);
  const [market, setMarket] = useState<Market>("Moneyline");

  const [booksMode, setBooksMode] = useState<BooksMode>("all");
  const [eventStatus, setEventStatus] = useState<EventStatus>("all");
  const [sortBy, setSortBy] = useState<SortBy>("start_time");
  const [sortOrder, setSortOrder] = useState<SortOrder>("asc");

  const [displayEvents, setDisplayEvents] = useState<DisplayEvent[]>([]);
  const [source, setSource] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string>("");

  const [snapshots, setSnapshots] = useState<Snapshot[]>([]);
  const [snapshotsLoading, setSnapshotsLoading] = useState<boolean>(false);
  const [snapshotError, setSnapshotError] = useState<string>("");
  const [savingSnapshot, setSavingSnapshot] = useState<boolean>(false);

  const [search, setSearch] = useState("");
  const [selectedMatchupKey, setSelectedMatchupKey] = useState<string>("");
  const [books, setBooks] = useState<Book[]>([]);
  const [lastUpdated, setLastUpdated] = useState<number>(Date.now());

  const [autoRefreshEnabled, setAutoRefreshEnabled] = useState(true);
  const [refreshSeconds, setRefreshSeconds] = useState<number>(30);

  const [stake, setStake] = useState<number>(100);
  const [selectedSelectionKey, setSelectedSelectionKey] = useState<string>(
    getInitialSelectionKey("Moneyline")
  );

  const games = useMemo(() => {
    const byMatchup = new Map<string, Game>();

    for (const event of displayEvents) {
      const game = toGame(league, event);

      if (!byMatchup.has(game.matchupKey)) {
        byMatchup.set(game.matchupKey, game);
      }
    }

    return Array.from(byMatchup.values());
  }, [displayEvents, league]);

  const filteredGames = useMemo(() => {
    const query = search.trim().toLowerCase();

    return games.filter((game) =>
      query ? `${game.away} ${game.home}`.toLowerCase().includes(query) : true
    );
  }, [games, search]);

  const selectedDisplayEvent = useMemo(() => {
    return (
      displayEvents.find(
        (event) => getMatchupKey(event) === selectedMatchupKey
      ) || null
    );
  }, [displayEvents, selectedMatchupKey]);

  const selectedGame = useMemo(() => {
    return games.find((game) => game.matchupKey === selectedMatchupKey) || null;
  }, [games, selectedMatchupKey]);

  const gameLabel = selectedGame
    ? `${selectedGame.away} @ ${selectedGame.home}`
    : "No game selected";

  const selectionOptions = useMemo(() => {
    const firstBook = books[0];

    return firstBook
      ? firstBook.outcomes.map((outcome) => ({
          key: outcome.key,
          label: outcome.label,
        }))
      : [];
  }, [books]);

  const bestForSelected = useMemo(() => {
    return bestOddsForSelection(books, selectedSelectionKey);
  }, [books, selectedSelectionKey]);

  const refreshOdds = async () => {
    setLoading(true);
    setError("");

    try {
      const sport = LEAGUE_TO_SPORT[league];
      const marketKey = MARKET_TO_KEY[market];

      const params = new URLSearchParams({
        sport,
        market: marketKey,
        regions: region,
        books_mode: booksMode,
        event_status: eventStatus,
        sort_by: sortBy,
        sort_order: sortOrder,
      });

      if (selectedBooks.length > 0) {
        params.set("bookmakers", selectedBooks.join(","));
      }

      const res = await fetch(`/api/odds?${params.toString()}`, {
        cache: "no-store",
      });

      const json: OddsEnvelope = await res.json();

      if (!res.ok) {
        throw new Error(json.error || json.detail || "Failed to fetch odds");
      }

      const nextDisplayEvents = json.display_events || [];

      setSource(json.source || "");
      setDisplayEvents(nextDisplayEvents);

      const nextSelectedMatchupKey =
        selectedMatchupKey &&
        nextDisplayEvents.some(
          (event) => getMatchupKey(event) === selectedMatchupKey
        )
          ? selectedMatchupKey
          : nextDisplayEvents[0]
            ? getMatchupKey(nextDisplayEvents[0])
            : "";

      setSelectedMatchupKey(nextSelectedMatchupKey);
      setLastUpdated(Date.now());
    } catch (error) {
      setError(error instanceof Error ? error.message : "Something went wrong");
      setDisplayEvents([]);
    } finally {
      setLoading(false);
    }
  };

  const saveSnapshot = async () => {
    if (!selectedDisplayEvent) {
      setSnapshotError("Select a game before saving a snapshot.");
      return;
    }

    if (books.length === 0) {
      setSnapshotError("No sportsbook data available to save.");
      return;
    }

    const selectionData = getSelectionData(books, selectedSelectionKey);

    if (!selectionData) {
      setSnapshotError("Select a valid line before saving.");
      return;
    }

    setSavingSnapshot(true);
    setSnapshotError("");

    try {
      const normalizedOutcomes = buildNormalizedOutcomesForSelection(
        books,
        selectedSelectionKey
      );

      const bestLineSummary = getBestLineSummary(books, selectedSelectionKey);
      const bestPrice = bestLineSummary.price;

      const payload = {
        sport: LEAGUE_TO_SPORT[league],
        sport_key: selectedDisplayEvent.sport_key,
        sport_title: selectedDisplayEvent.sport_title,
        event_id: selectedDisplayEvent.id,
        event_commence_time: selectedDisplayEvent.commence_time,
        home_team: selectedDisplayEvent.home_team,
        away_team: selectedDisplayEvent.away_team,
        market_key: MARKET_TO_KEY[market],
        selection_name: selectionData.selectionName,
        selection_type: selectionData.selectionType,
        point: selectionData.point,
        best_line_summary: bestLineSummary,
        calculator_context: {
          stake,
          payout: bestPrice !== null ? payoutForStake(bestPrice, stake) : null,
          profit: bestPrice !== null ? profitForStake(bestPrice, stake) : null,
          implied_probability:
            bestPrice !== null ? impliedProb(bestPrice) : null,
        },
        filters: {
          regions: [region],
          bookmakers: selectedBooks,
          odds_format: "american",
          books_mode: booksMode,
          event_status: eventStatus,
          sort_by: sortBy,
          sort_order: sortOrder,
        },
        normalized_outcomes: normalizedOutcomes,
        source: "the_odds_api",
      };

      const res = await fetch("/api/snapshots", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      });

      const json = await res.json();

      if (!res.ok) {
        throw new Error(json.error || "Failed to save snapshot");
      }

      if (json.data) {
        setSnapshots((prev) => [json.data, ...prev].slice(0, 25));
      }
    } catch (error) {
      setSnapshotError(
        error instanceof Error ? error.message : "Failed to save snapshot"
      );
    } finally {
      setSavingSnapshot(false);
    }
  };

  const loadSnapshots = async () => {
    if (!selectedDisplayEvent?.id) {
      setSnapshots([]);
      return;
    }

    setSnapshotsLoading(true);
    setSnapshotError("");

    try {
      const params = new URLSearchParams({
        event_id: selectedDisplayEvent.id,
        market_key: MARKET_TO_KEY[market],
        limit: "10",
      });

      const res = await fetch(`/api/snapshots?${params.toString()}`, {
        cache: "no-store",
      });

      const json = await res.json();

      if (!res.ok) {
        throw new Error(json.error || "Failed to load snapshots");
      }

      setSnapshots(json.data || []);
    } catch (error) {
      setSnapshotError(
        error instanceof Error ? error.message : "Failed to load snapshots"
      );
      setSnapshots([]);
    } finally {
      setSnapshotsLoading(false);
    }
  };

  const toggleBook = (bookValue: string) => {
    setSelectedBooks((prev) =>
      prev.includes(bookValue)
        ? prev.filter((book) => book !== bookValue)
        : [...prev, bookValue]
    );
  };

  useEffect(() => {
    refreshOdds();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [
    league,
    market,
    region,
    selectedBooks,
    booksMode,
    eventStatus,
    sortBy,
    sortOrder,
  ]);

  useEffect(() => {
    setBooks(buildBooksFromDisplayEvent(selectedDisplayEvent));
  }, [selectedDisplayEvent]);

  useEffect(() => {
    if (!autoRefreshEnabled) return;

    const ms = Math.max(5, refreshSeconds) * 1000;
    const id = window.setInterval(() => refreshOdds(), ms);

    return () => window.clearInterval(id);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [
    autoRefreshEnabled,
    refreshSeconds,
    league,
    market,
    region,
    selectedBooks,
    booksMode,
    eventStatus,
    sortBy,
    sortOrder,
    selectedMatchupKey,
  ]);

  useEffect(() => {
    setSelectedSelectionKey(getInitialSelectionKey(market));
  }, [market, selectedMatchupKey]);

  useEffect(() => {
    if (selectionOptions.length === 0) return;

    const stillExists = selectionOptions.some(
      (option) => option.key === selectedSelectionKey
    );

    if (!stillExists) {
      setSelectedSelectionKey(selectionOptions[0].key);
    }
  }, [selectionOptions, selectedSelectionKey]);

  useEffect(() => {
    loadSnapshots();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedDisplayEvent?.id, market]);

  return (
  <main className={theme.page}>
    <AppHeader
      activeLeague={league}
      savingSnapshot={savingSnapshot}
      onRefresh={refreshOdds}
      onSaveSnapshot={saveSnapshot}
    />

    <div className={theme.container}>
      <section className="mb-5 rounded-3xl border border-border bg-card p-6 shadow-sm">
        <p className="text-xs font-black uppercase tracking-[0.22em] text-primary">
          Live Odds Board
        </p>

        <div className="mt-3 flex flex-col justify-between gap-3 md:flex-row md:items-end">
          <div>
            <h1 className="text-3xl font-black tracking-tight text-foreground md:text-4xl">
              {league} Odds Comparison
            </h1>

            <p className="mt-2 max-w-2xl text-sm leading-6 text-muted-foreground">
              Compare live moneyline, spread, and total prices across books.
              Filter by region, preferred books, event status, and sort order.
            </p>
          </div>

          <span className={theme.metaPill}>
            Last updated{" "}
            <strong>
              {new Date(lastUpdated).toLocaleTimeString([], {
                hour: "2-digit",
                minute: "2-digit",
              })}
            </strong>
          </span>
        </div>
      </section>

        <LeagueGamesBoard
          league={league}
          games={filteredGames}
          selectedMatchupKey={selectedMatchupKey}
          onSelectGame={setSelectedMatchupKey}
        />

        <div className="mt-4 grid gap-4 lg:grid-cols-[1.3fr_1fr]">
          <MarketsCard
            league={league}
            market={market}
            gameLabel={gameLabel}
            gameId={selectedDisplayEvent?.id || null}
            stake={stake}
            books={books}
            selectionOptions={selectionOptions}
            onMarketChange={setMarket}
          />

          <CalculatorCard
            books={books}
            stake={stake}
            selectedSelectionKey={selectedSelectionKey}
            selectionOptions={selectionOptions}
            bestForSelected={bestForSelected}
            onStakeChange={setStake}
            onSelectedSelectionChange={setSelectedSelectionKey}
          />
        </div>

        <SnapshotHistoryCard
          snapshots={snapshots}
          snapshotsLoading={snapshotsLoading}
          snapshotError={snapshotError}
          mode="recent"
        />
      </div>
    </main>
  );
}