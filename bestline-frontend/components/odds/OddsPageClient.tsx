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
  getBestLineSummary,
  getInitialSelectionKey,
  getMatchupKey,
  getSelectionData,
  toGame,
} from "@/utils/odds";
import { useAuth } from "@/components/auth/AuthProvider";
import { useRequireVerifiedUser } from "@/lib/auth/useRequireVerifiedUser";
import {
  getSnapshots,
  saveSnapshot as saveSnapshotDocument,
  type NewSnapshotInput,
} from "@/lib/firestore/snapshots";

type OddsPageClientProps = {
  initialLeague: League;
};

const AUTO_REFRESH_STORAGE_KEY = "bestlinepicker:auto-refresh-enabled";
const REFRESH_SECONDS_STORAGE_KEY = "bestlinepicker:refresh-seconds";

const readSessionBoolean = (key: string, fallback: boolean) => {
  if (typeof window === "undefined") return fallback;

  const savedValue = window.sessionStorage.getItem(key);
  if (savedValue === null) return fallback;

  return savedValue === "true";
}

const readSessionNumber = (key: string, fallback: number) => {
  if (typeof window === "undefined") return fallback;

  const savedValue = window.sessionStorage.getItem(key);
  const parsedValue = savedValue ? Number(savedValue) : Number.NaN;

  return Number.isFinite(parsedValue) && parsedValue >= 5
    ? parsedValue
    : fallback;
};

const normalizeSearchText = (value: string | null | undefined) => (value || "").toLowerCase().trim();

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

  const { user } = useAuth();
  const { requireVerifiedUid } = useRequireVerifiedUser();
  const uid = user?.emailVerified ? user.uid : null;

  const [allSnapshots, setAllSnapshots] = useState<Snapshot[]>([]);
  const [snapshotsLoading, setSnapshotsLoading] = useState<boolean>(false);
  const [snapshotError, setSnapshotError] = useState<string>("");
  const [savingSnapshot, setSavingSnapshot] = useState<boolean>(false);

  const [search, setSearch] = useState("");
  const [selectedMatchupKey, setSelectedMatchupKey] = useState<string>("");
  const [books, setBooks] = useState<Book[]>([]);
  const [lastUpdated, setLastUpdated] = useState<number>(Date.now());

  const [autoRefreshEnabled, setAutoRefreshEnabled] = useState(() =>
    readSessionBoolean(AUTO_REFRESH_STORAGE_KEY, true)
  );
  const [refreshSeconds, setRefreshSeconds] = useState<number>(() =>
    readSessionNumber(REFRESH_SECONDS_STORAGE_KEY, 30)
  );

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
    const query = normalizeSearchText(search);

    if (!query) return games;

    return games.filter((game) => {
      const matchingEvents = displayEvents.filter(
        (event) => getMatchupKey(event) === game.matchupKey
      );

      const bookmakerText = matchingEvents
        .flatMap((event) => event.bookmakers || [])
        .map((bookmaker) => `${bookmaker.key} ${bookmaker.title}`)
        .join(" ");

      const searchableText = normalizeSearchText(
        [
          game.away,
          game.home,
          `${game.away} @ ${game.home}`,
          `${game.home} vs ${game.away}`,
          game.league,
          game.eventStatus,
          bookmakerText,
        ].join(" ")
      );

      return searchableText.includes(query);
    });
  }, [displayEvents, games, search]);

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

  const recentSnapshots = useMemo(() => {
    if (!selectedDisplayEvent) return [];

    const marketKey = MARKET_TO_KEY[market];

    return allSnapshots.filter(
      (snapshot) =>
        snapshot.event_id === selectedDisplayEvent.id &&
        snapshot.market_key === marketKey
    );
  }, [allSnapshots, selectedDisplayEvent, market]);

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
    const activeUid = requireVerifiedUid();
    if (!activeUid) return;

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
      const bestLineSummary = getBestLineSummary(books, selectedSelectionKey);

      const snapshotInput: NewSnapshotInput = {
        sport: LEAGUE_TO_SPORT[league],
        event_id: selectedDisplayEvent.id,
        matchup_label: `${selectedDisplayEvent.away_team} @ ${selectedDisplayEvent.home_team}`,
        market_key: MARKET_TO_KEY[market],
        market_label: market,
        selection_key: selectedSelectionKey,
        selection_label: selectionData.label,
        best_bookmaker_title: bestLineSummary.bookmaker_title,
        best_price: bestLineSummary.price,
      };

      const saved = await saveSnapshotDocument(activeUid, snapshotInput);
      setAllSnapshots((prev) => [saved, ...prev]);
    } catch (error) {
      setSnapshotError(
        error instanceof Error ? error.message : "Failed to save snapshot"
      );
    } finally {
      setSavingSnapshot(false);
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
    if (!uid) {
      setAllSnapshots([]);
      setSnapshotError("");
      return;
    }

    let cancelled = false;

    async function loadSnapshots(currentUid: string) {
      setSnapshotsLoading(true);
      setSnapshotError("");

      try {
        const data = await getSnapshots(currentUid);
        if (!cancelled) setAllSnapshots(data);
      } catch (error) {
        if (!cancelled) {
          setSnapshotError(
            error instanceof Error ? error.message : "Failed to load snapshots"
          );
          setAllSnapshots([]);
        }
      } finally {
        if (!cancelled) setSnapshotsLoading(false);
      }
    }

    loadSnapshots(uid);

    return () => {
      cancelled = true;
    };
  }, [uid]);

  useEffect(() => {
    const query = normalizeSearchText(search);
    if (!query) return;

    const selectedGameStillVisible = filteredGames.some(
      (game) => game.matchupKey === selectedMatchupKey
    );

    if (!selectedGameStillVisible) {
      setSelectedMatchupKey(filteredGames[0]?.matchupKey || "");
    }
  }, [filteredGames, search, selectedMatchupKey]);

  useEffect(() => {
    window.sessionStorage.setItem(
      AUTO_REFRESH_STORAGE_KEY,
      String(autoRefreshEnabled)
    );
  }, [autoRefreshEnabled]);

  useEffect(() => {
    window.sessionStorage.setItem(
      REFRESH_SECONDS_STORAGE_KEY,
      String(refreshSeconds)
    );
  }, [refreshSeconds]);

  return (
  <main className={theme.page}>
    <AppHeader
      activeLeague={league}
      savingSnapshot={savingSnapshot}
      onRefresh={refreshOdds}
      onSaveSnapshot={saveSnapshot}
      searchValue={search}
      onSearchChange={setSearch}
      searchPlaceholder={`Search ${league} teams, matchups, books, or events...`}
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

        <div className="flex flex-col gap-2 sm:items-end">
          <span className={theme.metaPill}>
            Last updated{" "}
            <strong>
              {new Date(lastUpdated).toLocaleTimeString([], {
                hour: "2-digit",
                minute: "2-digit",
              })}
            </strong>
          </span>

          <div className="flex flex-wrap items-center gap-2">
            <button
              type="button"
              onClick={() => setAutoRefreshEnabled((currentValue) => !currentValue)}
              className={autoRefreshEnabled ? theme.buttonPrimary : theme.buttonSecondary}
              >
                Auto-refresh {autoRefreshEnabled ? "On" : "Off"}
              </button>

            <label className="flex items-center gap-2 rounded-xl border border-border bg-muted px-3 py-2 text-xs font-black text-muted-foreground">
                Every
                <input
                  type="number"
                  min={5}
                  step={5}
                  value={refreshSeconds}
                  onChange={(event) =>
                    setRefreshSeconds(Math.max(5, Number(event.target.value)))
                  }
                  className="w-16 rounded-lg border border-border bg-card px-2 py-1 text-sm font-bold text-foreground outline-none focus:border-primary focus:ring-2 focus:ring-primary/20"
                />
                sec
            </label>
          </div>
        </div>
          
        </div>
      </section>

        <LeagueGamesBoard
          league={league}
          games={filteredGames}
          selectedMatchupKey={selectedMatchupKey}
          onSelectGame={setSelectedMatchupKey}
          emptyMessage={
            search.trim()
              ? `No ${league} games match "${search.trim()}". Try a team, matchup, league, or sportsbooks name.`
              : undefined
          }
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
          snapshots={recentSnapshots}
          snapshotsLoading={snapshotsLoading}
          snapshotError={snapshotError}
          mode="recent"
        />
      </div>
    </main>
  );
}