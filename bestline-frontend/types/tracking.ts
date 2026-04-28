export type TrackingStatus = "watching" | "placed";

export type TrackLinePayload = {
  game_id?: string | null;
  matchup: string;
  league: string;
  market: string;
  selection: string;
  sportsbook: string;
  odds: number;
  stake: number;
  status?: TrackingStatus;
};

export type TrackedLine = {
  id: string;
  game_id?: string | null;

  matchup: string;
  league: string;
  market: string;
  selection: string;
  sportsbook: string;
  odds: number;

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