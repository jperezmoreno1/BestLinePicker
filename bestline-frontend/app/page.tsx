"use client";

import React, { useEffect, useMemo, useState } from "react";

type League = "NFL" | "NBA" | "MLB";
type Market = "Moneyline" | "Spread" | "Total";
type OddsMarketKey = "h2h" | "spreads" | "totals";

type BooksMode = "all" | "best_only";
type EventStatus = "all" | "scheduled" | "live";
type SortBy = "start_time" | "best_value";
type SortOrder = "asc" | "desc";

type BestLinesPayload =
  | {
      marketKey: "h2h";
      best_prices: Record<string, number | null>;
      best_books: Record<string, string | null>;
    }
  | {
      marketKey: "spreads";
      bestBySelection: Record<
        string,
        { point: number | null; price: number | null; bookmaker: string | null } | null
      >;
    }
  | {
      marketKey: "totals";
      over: { point: number | null; price: number | null; bookmaker: string | null } | null;
      under: { point: number | null; price: number | null; bookmaker: string | null } | null;
    }
  | Record<string, never>;

type DisplayEvent = {
  id: string;
  sport_key: string;
  sport_title: string;
  commence_time: string;
  home_team: string;
  away_team: string;
  event_status: EventStatus | string;
  market: OddsMarketKey;
  books_mode: BooksMode;
  bookmakers: Array<{
    key: string;
    title: string;
    markets?: Array<{
      key: OddsMarketKey;
      outcomes: Array<{
        name: string;
        price: number;
        point?: number;
      }>;
    }>;
    outcomes?: Array<{
      name: string;
      price: number;
      point?: number;
    }>;
  }>;
  bookmakers_count: number;
  best_lines: BestLinesPayload;
  value_score: number;
};

type OddsEnvelope = {
  source: "live" | "cache";
  data?: unknown[];
  display_events?: DisplayEvent[];
  filters?: Record<string, unknown>;
  error?: string;
  detail?: string;
};

type Game = {
  id: string;
  league: League;
  matchupKey: string,
  away: string;
  home: string;
  startTs: number;
  eventStatus: string;
  valueScore: number;
};

type Book = {
  key: string;
  name: string;
  outcomes: Array<{
    key: string;
    label: string;
    oddsAmerican: number;
    line?: number;
  }>;
};

type Snapshot = {
  id: string;
  ts: number;
  league: League;
  gameId: string;
  gameLabel: string;
  market: Market;
  selectionKey: string;
  selectionLabel: string;
  lineLabel?: string;
  books: Book[];
};

const BOOKS_OPTIONS = [
  { label: "FanDuel", value: "fanduel" },
  { label: "DraftKings", value: "draftkings" },
  { label: "BetMGM", value: "betmgm" },
  { label: "Caesars", value: "caesars" },
  { label: "PointsBet", value: "pointsbetus" },
] as const;

const REGIONS_OPTIONS = [
  { label: "United States", value: "us" },
  { label: "US 2", value: "us2" },
  { label: "United Kingdom", value: "uk" },
  { label: "Europe", value: "eu" },
  { label: "Australia", value: "au" },
] as const;

function americanToDecimal(odds: number): number {
  if (odds > 0) return 1 + odds / 100;
  return 1 + 100 / Math.abs(odds);
}

function impliedProb(oddsAmerican: number): number {
  return 1 / americanToDecimal(oddsAmerican);
}

function profitForStake(oddsAmerican: number, stake: number): number {
  return stake * (americanToDecimal(oddsAmerican) - 1);
}

function payoutForStake(oddsAmerican: number, stake: number): number {
  return stake * americanToDecimal(oddsAmerican);
}

function formatOdds(odds: number): string {
  return odds > 0 ? `+${odds}` : `${odds}`;
}

function formatTime(ts: number): string {
  return new Date(ts).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
}

function formatDate(ts: number): string {
  return new Date(ts).toLocaleDateString([], {
    weekday: "short",
    month: "short",
    day: "numeric",
  });
}

function getMatchupKey(ev: DisplayEvent): string {
  return `${ev.away_team}__${ev.home_team}__${ev.commence_time}`;
}

const LEAGUE_TO_SPORT: Record<League, string> = {
  NFL: "nfl",
  NBA: "nba",
  MLB: "mlb",
};

const MARKET_TO_KEY: Record<Market, OddsMarketKey> = {
  Moneyline: "h2h",
  Spread: "spreads",
  Total: "totals",
};

function toGame(league: League, ev: DisplayEvent): Game {
  return {
    id: ev.id,
    matchupKey: getMatchupKey(ev),
    league,
    away: ev.away_team,
    home: ev.home_team,
    startTs: Date.parse(ev.commence_time),
    eventStatus: ev.event_status,
    valueScore: ev.value_score ?? 0,
  };
}

function buildBooksFromDisplayEvent(ev: DisplayEvent | null): Book[] {
  if (!ev?.bookmakers?.length) return [];

  const marketKey = ev.market;

  return ev.bookmakers.map((bk) => {
    const marketObj =
      bk.markets?.find((m) => m.key === marketKey) ??
      (bk.outcomes ? { key: marketKey, outcomes: bk.outcomes } : undefined);

    const outcomes = (marketObj?.outcomes || []).map((o) => {
      let key = o.name.toUpperCase().replace(/\s+/g, "_");
      let label = o.name;

      if (marketKey === "h2h") {
        label = `${o.name} ML`;
        key =
          o.name === ev.home_team
            ? "HOME_ML"
            : o.name === ev.away_team
              ? "AWAY_ML"
              : key;
      }

      if (marketKey === "spreads") {
        const p = o.point;
        const pointStr = p === undefined ? "" : p > 0 ? `+${p}` : `${p}`;
        label = `${o.name} ${pointStr}`.trim();
        key =
          o.name === ev.home_team
            ? "HOME_SPD"
            : o.name === ev.away_team
              ? "AWAY_SPD"
              : key;
      }

      if (marketKey === "totals") {
        label = o.point !== undefined ? `${o.name} ${o.point}` : o.name;
        key =
          o.name.toLowerCase() === "over"
            ? "OVER"
            : o.name.toLowerCase() === "under"
              ? "UNDER"
              : key;
      }

      return {
        key,
        label,
        oddsAmerican: o.price,
        line: o.point,
      };
    });

    return {
      key: bk.key,
      name: bk.title,
      outcomes,
    };
  });
}

function bestOddsForSelection(books: Book[], selectionKey: string): number | null {
  let best: number | null = null;

  for (const b of books) {
    const o = b.outcomes.find((x) => x.key === selectionKey);
    if (!o) continue;

    if (best === null || americanToDecimal(o.oddsAmerican) > americanToDecimal(best)) {
      best = o.oddsAmerican;
    }
  }

  return best;
}

function getInitialSelectionKey(market: Market): string {
  if (market === "Moneyline") return "HOME_ML";
  if (market === "Spread") return "HOME_SPD";
  return "OVER";
}

export default function Page() {
  const [region, setRegion] = useState("us");
  const [selectedBooks, setSelectedBooks] = useState<string[]>([]);

  const [league, setLeague] = useState<League>("NFL");
  const [market, setMarket] = useState<Market>("Moneyline");

  const [booksMode, setBooksMode] = useState<BooksMode>("all");
  const [eventStatus, setEventStatus] = useState<EventStatus>("all");
  const [sortBy, setSortBy] = useState<SortBy>("start_time");
  const [sortOrder, setSortOrder] = useState<SortOrder>("asc");

  const [displayEvents, setDisplayEvents] = useState<DisplayEvent[]>([]);
  const [source, setSource] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string>("");

  const [search, setSearch] = useState("");
  const games = useMemo(() => {
    const byMatchup = new Map<string, Game>();

    for (const ev of displayEvents) {
      const game = toGame(league, ev);
      if (!byMatchup.has(game.matchupKey)) {
        byMatchup.set(game.matchupKey, game)
      }
    }

    return Array.from(byMatchup.values())
  }, [displayEvents, league]);

  const filteredGames = useMemo(() => {
    const q = search.trim().toLowerCase();

    return games.filter((g) =>
      q ? `${g.away} ${g.home}`.toLowerCase().includes(q) : true
    );
  }, [games, search]);

  const [selectedMatchupKey, setSelectedMatchupKey] = useState<string>("");

  const selectedDisplayEvent = useMemo(() => {
    return displayEvents.find((ev) => getMatchupKey(ev) === selectedMatchupKey) || null;
  }, [displayEvents, selectedMatchupKey]);

  const [books, setBooks] = useState<Book[]>([]);
  const [lastUpdated, setLastUpdated] = useState<number>(Date.now());

  const [autoRefreshEnabled, setAutoRefreshEnabled] = useState(true);
  const [refreshSeconds, setRefreshSeconds] = useState<number>(30);

  const [stake, setStake] = useState<number>(100);

  const selectionOptions = useMemo(() => {
    const first = books[0];
    return first ? first.outcomes.map((o) => ({ key: o.key, label: o.label })) : [];
  }, [books]);


  const [selectedSelectionKey, setSelectedSelectionKey] = useState<string>(
    getInitialSelectionKey("Moneyline")
  );

  useEffect(() => {
    setSelectedSelectionKey(getInitialSelectionKey(market));
  }, [market, selectedMatchupKey]);

  useEffect(() => {
    if (selectionOptions.length === 0) return;

    const stillExists = selectionOptions.some(
      (opt) => opt.key == selectedSelectionKey
    );

    if (!stillExists) {
      setSelectedSelectionKey(selectionOptions[0].key);
    }
  }, [selectionOptions, selectedSelectionKey]);

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
        selectedMatchupKey && nextDisplayEvents.some((ev) => getMatchupKey(ev) === selectedMatchupKey)
          ? selectedMatchupKey
          : nextDisplayEvents[0] ? getMatchupKey(nextDisplayEvents[0]) : "";

      setSelectedMatchupKey(nextSelectedMatchupKey);
      setLastUpdated(Date.now());
    } catch (e) {
      setError(e instanceof Error ? e.message : "Something went wrong");
      setDisplayEvents([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    refreshOdds();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [league, market, region, selectedBooks, booksMode, eventStatus, sortBy, sortOrder]);

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

  const [snapshots, setSnapshots] = useState<Snapshot[]>([]);
  const selectedGame = useMemo(
    () => games.find((g) => g.matchupKey === selectedMatchupKey) || null,
    [games, selectedMatchupKey]
  );

  const gameLabel = selectedGame
    ? `${selectedGame.away} @ ${selectedGame.home}`
    : "No game selected";

  const lineLabel = useMemo(() => {
    const first = books[0]?.outcomes?.[0];
    if (first?.line === undefined) return undefined;

    if (market === "Total") return `Total ${first.line}`;
    if (market === "Spread") return `Spread ±${Math.abs(first.line)}`;
    return undefined;
  }, [books, market]);

  const saveSnapshot = () => {
    const sel = selectionOptions.find((s) => s.key === selectedSelectionKey);

    const snap: Snapshot = {
      id: crypto.randomUUID(),
      ts: Date.now(),
      league,
      gameId: selectedMatchupKey,
      gameLabel,
      market,
      selectionKey: selectedSelectionKey,
      selectionLabel: sel?.label || selectedSelectionKey,
      lineLabel,
      books: [...books],
    };

    setSnapshots((prev) => [snap, ...prev].slice(0, 25));
  };

  const toggleBook = (bookValue: string) => {
    setSelectedBooks((prev) =>
      prev.includes(bookValue)
        ? prev.filter((b) => b !== bookValue)
        : [...prev, bookValue]
    );
  };

  const bestForSelected = useMemo(
    () => bestOddsForSelection(books, selectedSelectionKey),
    [books, selectedSelectionKey]
  );

  const selectedEventMeta = selectedDisplayEvent
    ? {
        status: selectedDisplayEvent.event_status,
        valueScore: selectedDisplayEvent.value_score,
        booksCount: selectedDisplayEvent.bookmakers_count,
      }
    : null;

  return (
    <main style={styles.page}>
      <header style={styles.header}>
        <div style={styles.brand}>
          <div style={styles.logoDot} />
          <div>
            <div style={styles.brandName}>BestLinePicker</div>
            <div style={styles.brandTag}>Compare Odds Across Books</div>
          </div>
        </div>

        <div style={styles.headerRight}>
          <div style={styles.controlGroup}>
            <label style={styles.label}>League</label>
            <select
              value={league}
              onChange={(e) => setLeague(e.target.value as League)}
              style={styles.select}
            >
              <option value="NFL">NFL</option>
              <option value="NBA">NBA</option>
              <option value="MLB">MLB</option>
            </select>
          </div>

          <button onClick={refreshOdds} style={styles.secondaryButton}>
            Refresh
          </button>

          <button onClick={saveSnapshot} style={styles.primaryButton}>
            Save Snapshot
          </button>
        </div>
      </header>

      <div style={styles.container}>
        <section style={styles.card}>
          <div style={styles.filtersGrid}>
            <div style={styles.controlGroup}>
              <label style={styles.labelDark}>Region</label>
              <select value={region} onChange={(e) => setRegion(e.target.value)} style={styles.selectLight}>
                {REGIONS_OPTIONS.map((option) => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
            </div>

            <div style={styles.controlGroup}>
              <label style={styles.labelDark}>Books View</label>
              <select
                value={booksMode}
                onChange={(e) => setBooksMode(e.target.value as BooksMode)}
                style={styles.selectLight}
              >
                <option value="all">All Books</option>
                <option value="best_only">Best Only</option>
              </select>
            </div>

            <div style={styles.controlGroup}>
              <label style={styles.labelDark}>Event Status</label>
              <select
                value={eventStatus}
                onChange={(e) => setEventStatus(e.target.value as EventStatus)}
                style={styles.selectLight}
              >
                <option value="all">All Events</option>
                <option value="scheduled">Scheduled</option>
                <option value="live">Live</option>
              </select>
            </div>

            <div style={styles.controlGroup}>
              <label style={styles.labelDark}>Sort By</label>
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value as SortBy)}
                style={styles.selectLight}
              >
                <option value="start_time">Start Time</option>
                <option value="best_value">Best Value</option>
              </select>
            </div>

            <div style={styles.controlGroup}>
              <label style={styles.labelDark}>Sort Order</label>
              <select
                value={sortOrder}
                onChange={(e) => setSortOrder(e.target.value as SortOrder)}
                style={styles.selectLight}
              >
                <option value="asc">Ascending</option>
                <option value="desc">Descending</option>
              </select>
            </div>
          </div>

          <div style={styles.booksFilterWrapLight}>
            <div style={styles.booksFilterTitleDark}>My Books</div>
            <div style={styles.booksFilterList}>
              {BOOKS_OPTIONS.map((book) => {
                const checked = selectedBooks.includes(book.value);

                return (
                  <label key={book.value} style={styles.bookCheckboxLabelDark}>
                    <input
                      type="checkbox"
                      checked={checked}
                      onChange={() => toggleBook(book.value)}
                      style={{ width: 16, height: 16 }}
                    />
                    <span>{book.label}</span>
                  </label>
                );
              })}
            </div>
          </div>
        </section>

        <section style={styles.card}>
          <div style={styles.cardTitleRow}>
            <div>
              <div style={styles.cardTitle}>Games</div>
              <div style={styles.cardSub}>
                Pick a matchup, then shop lines across sportsbooks.
              </div>
            </div>

            <div style={styles.metaRight}>
              <span style={styles.metaPill}>
                Last updated <strong style={styles.metaStrong}>{formatTime(lastUpdated)}</strong> •{" "}
                <strong style={styles.metaStrong}>{source || "-"}</strong>
              </span>
            </div>
          </div>

          {error && (
            <div style={styles.errorBox}>
              Error: {error}
            </div>
          )}

          {loading && (
            <div style={styles.loadingBox}>
              Loading live odds...
            </div>
          )}

          <div style={styles.gameRow}>
            <input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder={`Search ${league} teams...`}
              style={styles.search}
            />

            <select
              value={selectedMatchupKey}
              onChange={(e) => setSelectedMatchupKey(e.target.value)}
              style={styles.selectWide}
            >
              {filteredGames.length === 0 ? (
                <option value="" disabled>
                  No games loaded yet
                </option>
              ) : (
                filteredGames.map((g) => (
                  <option key={g.matchupKey} value={g.matchupKey}>
                    {formatDate(g.startTs)} • {formatTime(g.startTs)} • {g.away} @ {g.home}
                  </option>
                ))
              )}
            </select>

            <div style={styles.autoBox}>
              <label style={styles.autoLabel}>
                <input
                  type="checkbox"
                  checked={autoRefreshEnabled}
                  onChange={(e) => setAutoRefreshEnabled(e.target.checked)}
                  style={{ width: 16, height: 16 }}
                />
                Auto refresh
              </label>

              <div style={styles.everyWrap}>
                <span style={styles.everyText}>Every</span>
                <input
                  type="number"
                  min={5}
                  step={5}
                  value={refreshSeconds}
                  onChange={(e) => setRefreshSeconds(Number(e.target.value))}
                  style={styles.numberInput}
                />
                <span style={styles.everyText}>sec</span>
              </div>
            </div>
          </div>

          {selectedEventMeta && (
            <div style={styles.eventMetaRow}>
              <span style={styles.eventMetaPill}>
                Status: <strong>{selectedEventMeta.status}</strong>
              </span>
              <span style={styles.eventMetaPill}>
                Books shown: <strong>{selectedEventMeta.booksCount}</strong>
              </span>
              <span style={styles.eventMetaPill}>
                Value score: <strong>{selectedEventMeta.valueScore.toFixed(2)}</strong>
              </span>
            </div>
          )}
        </section>

        <div style={styles.gridTwo}>
          <section style={styles.card}>
            <div style={styles.cardTitleRow}>
              <div>
                <div style={styles.cardTitle}>Markets</div>
                <div style={styles.cardSub}>
                  {league} • {gameLabel}
                </div>
              </div>
            </div>

            <div style={styles.tabs}>
              {(["Moneyline", "Spread", "Total"] as Market[]).map((m) => {
                const active = m === market;
                return (
                  <button
                    key={m}
                    onClick={() => setMarket(m)}
                    style={{ ...styles.tab, ...(active ? styles.tabActive : {}) }}
                  >
                    {m}
                  </button>
                );
              })}
            </div>

            <div style={styles.tableWrap}>
              <table style={styles.table}>
                <thead>
                  <tr>
                    <th style={styles.th}>Sportsbook</th>
                    {selectionOptions.map((s) => (
                      <th key={s.key} style={styles.thRight}>
                        {s.label}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {books.map((b) => (
                    <tr key={b.key || b.name} style={styles.tr}>
                      <td style={styles.td}>
                        <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                          <span style={styles.bookDot} />
                          <span style={styles.bookName}>{b.name}</span>
                        </div>
                      </td>

                      {selectionOptions.map((s) => {
                        const out = b.outcomes.find((o) => o.key === s.key);
                        const best = bestOddsForSelection(books, s.key);
                        const isBest = out && best !== null && out.oddsAmerican === best;

                        return (
                          <td
                            key={`${b.name}-${s.key}`}
                            style={{
                              ...styles.tdRight,
                              ...(isBest ? styles.tdBest : {}),
                            }}
                          >
                            {out ? (
                              <div style={styles.cellStack}>
                                <span style={isBest ? styles.oddsBest : styles.odds}>
                                  {formatOdds(out.oddsAmerican)}
                                </span>
                                {isBest && <span style={styles.bestPill}>Best</span>}
                              </div>
                            ) : (
                              <span style={styles.mutedDash}>—</span>
                            )}
                          </td>
                        );
                      })}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </section>

          <section style={styles.card}>
            <div style={styles.cardTitleRow}>
              <div>
                <div style={styles.cardTitle}>Calculator</div>
                <div style={styles.cardSub}>
                  Compare payout, implied probability, and profit for the selected line.
                </div>
              </div>
            </div>

            <div style={styles.calcControls}>
              <label style={styles.smallLabel}>Selection</label>
              <select
                value={selectedSelectionKey}
                onChange={(e) => setSelectedSelectionKey(e.target.value)}
                style={styles.selectLight}
              >
                {selectionOptions.map((opt) => (
                  <option key={opt.key} value={opt.key}>
                    {opt.label}
                  </option>
                ))}
              </select>

              <label style={styles.smallLabel}>Stake</label>
              <input
                type="number"
                min={1}
                step={1}
                value={stake}
                onChange={(e) => setStake(Number(e.target.value))}
                style={styles.numberInputWide}
              />
            </div>

            <div style={styles.calcGrid}>
              {books
                .map((b) => {
                  const out = b.outcomes.find((o) => o.key === selectedSelectionKey);
                  if (!out) return null;

                  const implied = impliedProb(out.oddsAmerican) * 100;
                  const profit = profitForStake(out.oddsAmerican, stake);
                  const payout = payoutForStake(out.oddsAmerican, stake);

                  const isBest =
                    bestForSelected !== null && out.oddsAmerican === bestForSelected;

                  const delta = bestForSelected
                    ? payoutForStake(bestForSelected, stake) - payout
                    : 0;

                  return (
                    <div
                      key={`${b.name}-${selectedSelectionKey}`}
                      style={isBest ? styles.calcCardBest : styles.calcCard}
                    >
                      <div style={styles.calcTop}>
                        <div style={styles.calcBook}>{b.name}</div>
                        <div style={isBest ? styles.calcOddsBest : styles.calcOdds}>
                          {formatOdds(out.oddsAmerican)}
                        </div>
                      </div>

                      <div style={styles.calcRow}>
                        <span style={styles.calcLabel}>Implied</span>
                        <span style={styles.calcValue}>{implied.toFixed(2)}%</span>
                      </div>

                      <div style={styles.calcRow}>
                        <span style={styles.calcLabel}>Profit</span>
                        <span style={styles.calcValue}>${profit.toFixed(2)}</span>
                      </div>

                      <div style={styles.calcRow}>
                        <span style={styles.calcLabel}>Payout</span>
                        <span style={styles.calcValue}>${payout.toFixed(2)}</span>
                      </div>

                      {!isBest ? (
                        <div style={styles.deltaRow}>
                          <span style={styles.deltaLabel}>Below best</span>
                          <span style={styles.deltaValue}>-${delta.toFixed(2)}</span>
                        </div>
                      ) : (
                        <div style={styles.bestHint}>Best price for this selection</div>
                      )}
                    </div>
                  );
                })
                .filter(Boolean)}
            </div>
          </section>
        </div>

        <section style={styles.card}>
          <div style={styles.cardTitleRow}>
            <div>
              <div style={styles.cardTitle}>Snapshot History</div>
              <div style={styles.cardSub}>
                Saved snapshots are tied to a specific game, market, and selection.
              </div>
            </div>

            <div style={styles.metaRight}>
              <span style={styles.metaPill}>
                Saved <strong style={styles.metaStrong}>{snapshots.length}</strong>
              </span>
            </div>
          </div>

          {snapshots.length === 0 ? (
            <div style={styles.emptyState}>
              No snapshots yet. Let auto refresh run for a bit, then click <strong>Save Snapshot</strong>.
            </div>
          ) : (
            <div style={styles.snapshotList}>
              {snapshots.map((s) => {
                const best = bestOddsForSelection(s.books, s.selectionKey);

                return (
                  <div key={s.id} style={styles.snapshotItem}>
                    <div style={styles.snapshotLeft}>
                      <div style={styles.snapshotTitle}>
                        {s.league} • {s.gameLabel}
                      </div>
                      <div style={styles.snapshotSub}>
                        {s.market} • {s.selectionLabel}
                        {s.lineLabel ? ` • ${s.lineLabel}` : ""} • Saved {formatTime(s.ts)}
                      </div>
                    </div>

                    <div style={styles.snapshotRight}>
                      <span style={styles.snapshotBest}>
                        Best at save: {best !== null ? formatOdds(best) : "N/A"}
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </section>
      </div>
    </main>
  );
}

const styles: Record<string, React.CSSProperties> = {
  page: { minHeight: "100vh", background: "#0b1020" },

  header: {
    position: "sticky",
    top: 0,
    zIndex: 50,
    background: "rgba(11, 16, 32, 0.88)",
    backdropFilter: "blur(10px)",
    borderBottom: "1px solid rgba(255,255,255,0.08)",
    padding: "16px 18px",
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    gap: 16,
    color: "#e5e7eb",
  },

  brand: { display: "flex", alignItems: "center", gap: 12 },

  logoDot: {
    width: 14,
    height: 14,
    borderRadius: 999,
    background: "linear-gradient(135deg, #60a5fa, #a78bfa)",
    boxShadow: "0 0 0 4px rgba(96,165,250,0.15)",
  },

  brandName: { fontWeight: 900, letterSpacing: 0.3 },
  brandTag: { fontSize: 12, opacity: 0.78, marginTop: 2 },

  headerRight: { display: "flex", alignItems: "end", gap: 12, flexWrap: "wrap" },
  controlGroup: { display: "flex", flexDirection: "column", gap: 6 },
  label: { fontSize: 12, opacity: 0.9 },
  labelDark: { fontSize: 12, fontWeight: 800, color: "#334155" },

  select: {
    padding: "10px 12px",
    borderRadius: 12,
    border: "1px solid rgba(255,255,255,0.14)",
    background: "rgba(255,255,255,0.06)",
    color: "#e5e7eb",
    outline: "none",
  },

  selectLight: {
    padding: "10px 12px",
    borderRadius: 12,
    border: "1px solid #e2e8f0",
    background: "#ffffff",
    color: "#0f172a",
    outline: "none",
  },

  selectWide: {
    padding: "10px 12px",
    borderRadius: 12,
    border: "1px solid #e2e8f0",
    background: "#ffffff",
    color: "#0f172a",
    outline: "none",
    width: "100%",
  },

  primaryButton: {
    padding: "10px 14px",
    borderRadius: 12,
    border: "1px solid rgba(96,165,250,0.35)",
    background: "linear-gradient(135deg, rgba(96,165,250,0.25), rgba(167,139,250,0.18))",
    color: "#e5e7eb",
    fontWeight: 800,
    cursor: "pointer",
  },

  secondaryButton: {
    padding: "10px 14px",
    borderRadius: 12,
    border: "1px solid rgba(255,255,255,0.14)",
    background: "rgba(255,255,255,0.06)",
    color: "#e5e7eb",
    fontWeight: 700,
    cursor: "pointer",
  },

  container: { maxWidth: 1180, margin: "0 auto", padding: "18px 18px 52px" },

  card: {
    background: "linear-gradient(180deg, rgba(255,255,255,0.96), rgba(255,255,255,0.92))",
    border: "1px solid rgba(255,255,255,0.18)",
    borderRadius: 18,
    padding: 16,
    boxShadow: "0 16px 40px rgba(0,0,0,0.25)",
    marginTop: 14,
  },

  filtersGrid: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit, minmax(180px, 1fr))",
    gap: 12,
  },

  cardTitleRow: {
    display: "flex",
    alignItems: "flex-start",
    justifyContent: "space-between",
    gap: 12,
    flexWrap: "wrap",
  },

  cardTitle: { fontSize: 16, fontWeight: 900, color: "#0f172a" },
  cardSub: { fontSize: 13, color: "#475569", marginTop: 4 },

  metaRight: { display: "flex", alignItems: "center", gap: 10 },

  metaPill: {
    fontSize: 12,
    background: "#eef2ff",
    border: "1px solid #e0e7ff",
    color: "#3730a3",
    padding: "8px 10px",
    borderRadius: 999,
  },

  metaStrong: { fontWeight: 900 },

  gameRow: {
    marginTop: 12,
    display: "grid",
    gridTemplateColumns: "1fr 2fr 1.2fr",
    gap: 12,
    alignItems: "center",
  },

  search: {
    padding: "10px 12px",
    borderRadius: 12,
    border: "1px solid #e2e8f0",
    outline: "none",
    background: "#ffffff",
    color: "#0f172a",
  },

  autoBox: {
    border: "1px solid #e2e8f0",
    borderRadius: 14,
    padding: 10,
    background: "#ffffff",
    display: "flex",
    flexDirection: "column",
    gap: 10,
  },

  autoLabel: { display: "flex", alignItems: "center", gap: 10, fontWeight: 800, color: "#0f172a" },
  everyWrap: { display: "flex", alignItems: "center", gap: 8 },
  everyText: { fontSize: 12, fontWeight: 800, color: "#475569" },

  numberInput: {
    width: 80,
    padding: "8px 10px",
    borderRadius: 12,
    border: "1px solid #e2e8f0",
    background: "#ffffff",
    outline: "none",
  },

  numberInputWide: {
    width: 120,
    padding: "8px 10px",
    borderRadius: 12,
    border: "1px solid #e2e8f0",
    background: "#ffffff",
    outline: "none",
  },

  gridTwo: {
    display: "grid",
    gridTemplateColumns: "1.3fr 1fr",
    gap: 14,
    marginTop: 14,
  },

  tabs: { marginTop: 12, display: "flex", gap: 10, flexWrap: "wrap" },

  tab: {
    padding: "10px 12px",
    borderRadius: 999,
    border: "1px solid #e2e8f0",
    background: "#ffffff",
    cursor: "pointer",
    fontWeight: 800,
    color: "#0f172a",
  },

  tabActive: {
    border: "1px solid #c7d2fe",
    background: "#eef2ff",
    color: "#3730a3",
  },

  tableWrap: { marginTop: 12, overflowX: "auto" },
  table: { width: "100%", borderCollapse: "collapse" },

  th: { textAlign: "left", fontSize: 12, color: "#64748b", padding: "10px 10px" },
  thRight: {
    textAlign: "right",
    fontSize: 12,
    color: "#64748b",
    padding: "10px 10px",
    whiteSpace: "nowrap",
  },

  tr: { borderTop: "1px solid #e2e8f0" },
  td: { padding: "12px 10px", color: "#0f172a" },
  tdRight: { padding: "12px 10px", textAlign: "right", color: "#0f172a" },
  tdBest: { background: "#eef2ff" },

  cellStack: {
    display: "inline-flex",
    alignItems: "center",
    gap: 8,
    justifyContent: "flex-end",
  },

  bookDot: { width: 10, height: 10, borderRadius: 999, background: "#cbd5e1" },
  bookName: { fontWeight: 900 },

  bestPill: {
    fontSize: 11,
    fontWeight: 900,
    color: "#3730a3",
    background: "#e0e7ff",
    border: "1px solid #c7d2fe",
    padding: "4px 8px",
    borderRadius: 999,
  },

  odds: { fontWeight: 900, color: "#0f172a" },
  oddsBest: { fontWeight: 900, color: "#3730a3" },
  mutedDash: { color: "#94a3b8", fontWeight: 700 },

  calcControls: { marginTop: 12, display: "flex", flexDirection: "column", gap: 6 },
  smallLabel: { fontSize: 12, fontWeight: 900, color: "#475569" },

  calcGrid: {
    marginTop: 12,
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit, minmax(210px, 1fr))",
    gap: 12,
  },

  calcCard: { border: "1px solid #e2e8f0", borderRadius: 16, padding: 12, background: "#ffffff" },
  calcCardBest: { border: "1px solid #c7d2fe", borderRadius: 16, padding: 12, background: "#eef2ff" },
  calcTop: { display: "flex", alignItems: "baseline", justifyContent: "space-between", gap: 10, marginBottom: 8 },
  calcBook: { fontWeight: 900, color: "#0f172a" },
  calcOdds: { fontWeight: 900, color: "#0f172a" },
  calcOddsBest: { fontWeight: 900, color: "#3730a3" },
  calcRow: { display: "flex", justifyContent: "space-between", color: "#0f172a", padding: "6px 0" },
  calcLabel: { color: "#64748b", fontWeight: 900, fontSize: 12 },
  calcValue: { fontWeight: 900 },

  deltaRow: {
    marginTop: 8,
    display: "flex",
    justifyContent: "space-between",
    background: "#fff7ed",
    border: "1px solid #fed7aa",
    borderRadius: 12,
    padding: "8px 10px",
  },

  deltaLabel: { color: "#9a3412", fontWeight: 900, fontSize: 12 },
  deltaValue: { color: "#9a3412", fontWeight: 900 },
  bestHint: { marginTop: 8, color: "#3730a3", fontWeight: 800, fontSize: 12 },

  booksFilterWrapLight: {
    marginTop: 16,
    border: "1px solid #e2e8f0",
    borderRadius: 14,
    padding: 12,
    background: "#ffffff",
  },

  booksFilterTitleDark: {
    fontSize: 13,
    fontWeight: 900,
    color: "#334155",
    marginBottom: 10,
  },

  booksFilterList: {
    display: "flex",
    flexWrap: "wrap",
    gap: 12,
  },

  bookCheckboxLabelDark: {
    display: "flex",
    alignItems: "center",
    gap: 8,
    color: "#0f172a",
    fontWeight: 700,
  },

  eventMetaRow: {
    marginTop: 12,
    display: "flex",
    gap: 10,
    flexWrap: "wrap",
  },

  eventMetaPill: {
    fontSize: 12,
    background: "#f8fafc",
    border: "1px solid #e2e8f0",
    color: "#334155",
    padding: "8px 10px",
    borderRadius: 999,
  },

  errorBox: {
    marginTop: 12,
    padding: 12,
    borderRadius: 12,
    background: "#fee2e2",
    border: "1px solid #fecaca",
    color: "#991b1b",
    fontWeight: 800,
  },

  loadingBox: {
    marginTop: 12,
    padding: 12,
    borderRadius: 12,
    background: "#ecfeff",
    border: "1px solid #cffafe",
    color: "#155e75",
    fontWeight: 800,
  },

  emptyState: {
    marginTop: 12,
    padding: 16,
    borderRadius: 14,
    background: "#f8fafc",
    color: "#475569",
    border: "1px solid #e2e8f0",
  },

  snapshotList: { marginTop: 12, display: "flex", flexDirection: "column", gap: 10 },
  snapshotItem: {
    display: "flex",
    justifyContent: "space-between",
    gap: 12,
    padding: 12,
    borderRadius: 14,
    border: "1px solid #e2e8f0",
    background: "#ffffff",
  },
  snapshotLeft: { display: "flex", flexDirection: "column", gap: 4 },
  snapshotTitle: { fontWeight: 900, color: "#0f172a" },
  snapshotSub: { color: "#475569", fontSize: 13 },
  snapshotRight: { display: "flex", alignItems: "center" },
  snapshotBest: {
    fontSize: 12,
    fontWeight: 900,
    color: "#3730a3",
    background: "#eef2ff",
    border: "1px solid #c7d2fe",
    padding: "8px 10px",
    borderRadius: 999,
  },
};