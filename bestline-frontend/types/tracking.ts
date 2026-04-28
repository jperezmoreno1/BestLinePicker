export type TrackingStatus = "watching" | "placed";

export type OddsMarketKey = "h2h" | "spreads" | "totals";

export type TrackLinePayload = {
  game_id?: string | null;
  event_id?: string | null;

  matchup: string;
  league: string;

  market: string;
  market_key?: OddsMarketKey | string | null;

  selection: string;
  selection_name?: string | null;

  sportsbook: string;
  sportsbook_key?: string | null;
  sportsbook_title?: string | null;

  odds: number;
  tracked_price?: number | null;

  point?: number | null;
  tracked_point?: number | null;

  stake: number;
  status?: TrackingStatus;
};

export type TrackedLine = {
  id: string;

  game_id?: string | null;
  event_id?: string | null;

  matchup: string;
  league: string;

  market: string;
  market_key?: OddsMarketKey | string | null;

  selection: string;
  selection_name?: string | null;

  sportsbook: string;
  sportsbook_key?: string | null;
  sportsbook_title?: string | null;

  odds: number;
  tracked_price?: number | null;

  point?: number | null;
  tracked_point?: number | null;

  stake: number;
  implied_probability: number;
  payout: number;
  profit: number;

  status: TrackingStatus;

  created_at: string;
  created_at_unix_ms: number;
  updated_at: string;
  updated_at_unix_ms: number;
};