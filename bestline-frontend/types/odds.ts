export type League = "NFL" | "NBA" | "MLB";

export type Market = "Moneyline" | "Spread" | "Total";

export type OddsMarketKey = "h2h" | "spreads" | "totals";

export type BooksMode = "all" | "best_only";

export type EventStatus = "all" | "scheduled" | "live";

export type SortBy = "start_time" | "best_value";

export type SortOrder = "asc" | "desc";

export type BestLinesPayload =
  | {
      marketKey: "h2h";
      best_prices: Record<string, number | null>;
      best_books: Record<string, string | null>;
    }
  | {
      marketKey: "spreads";
      bestBySelection: Record<
        string,
        {
          point: number | null;
          price: number | null;
          bookmaker: string | null;
        } | null
      >;
    }
  | {
      marketKey: "totals";
      over: {
        point: number | null;
        price: number | null;
        bookmaker: string | null;
      } | null;
      under: {
        point: number | null;
        price: number | null;
        bookmaker: string | null;
      } | null;
    }
  | Record<string, never>;

export type DisplayEvent = {
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

export type OddsEnvelope = {
  source: "live" | "cache";
  data?: unknown[];
  display_events?: DisplayEvent[];
  filters?: Record<string, unknown>;
  error?: string;
  detail?: string;
};

export type Game = {
  id: string;
  league: League;
  matchupKey: string;
  away: string;
  home: string;
  startTs: number;
  eventStatus: string;
  valueScore: number;
};

export type Book = {
  key: string;
  name: string;
  outcomes: Array<{
    key: string;
    label: string;
    oddsAmerican: number;
    line?: number;
  }>;
};

export type Snapshot = {
  id: string;
  sport: string;
  event_id: string;
  matchup_label: string;
  market_key: OddsMarketKey;
  market_label: string;
  selection_key: string;
  selection_label: string;
  best_bookmaker_title: string | null;
  best_price: number | null;
  created_at: string;
};

export const BOOKS_OPTIONS = [
  { label: "FanDuel", value: "fanduel" },
  { label: "DraftKings", value: "draftkings" },
  { label: "BetMGM", value: "betmgm" },
  { label: "Caesars", value: "caesars" },
  { label: "PointsBet", value: "pointsbetus" },
] as const;

export const REGIONS_OPTIONS = [
  { label: "United States", value: "us" },
  { label: "US 2", value: "us2" },
  { label: "United Kingdom", value: "uk" },
  { label: "Europe", value: "eu" },
  { label: "Australia", value: "au" },
] as const;

export const LEAGUE_TO_SPORT: Record<League, string> = {
  NFL: "nfl",
  NBA: "nba",
  MLB: "mlb",
};

export const MARKET_TO_KEY: Record<Market, OddsMarketKey> = {
  Moneyline: "h2h",
  Spread: "spreads",
  Total: "totals",
};