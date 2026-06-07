"use client";

import { useEffect, useMemo, useState } from "react";

import Link from "next/link";
import { ArrowLeft, Heart } from "lucide-react";
import PageShell from "@/components/layout/PageShell";

import TrackingList from "@/components/tracking/TrackingList";
import type { TrackedLine } from "@/types/tracking";
import {
  deleteTrackedLine,
  getTrackedLines,
  updateTrackedLineStake,
} from "@/lib/trackingApi";
import { theme } from "@/styles/theme";
import {
  compareTrackedLineToCurrentOffer,
  findCurrentOfferForTrackedLine,
  getTrackedMarketKeyForFetch,
  type LineComparisonResult,
  type OddsEvent,
} from "@/lib/tracking/lineMovement";

type TrackedLineWithComparison = TrackedLine & {
  comparison?: LineComparisonResult;
};

const SUPPORTED_LEAGUES = new Set(["nfl", "nba", "mlb"]);

function normalizeLeague(league: string) {
  return league.trim().toLowerCase();
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null;
}

function getOddsEventsFromResponse(json: unknown): OddsEvent[] {
  if (Array.isArray(json)) {
    return json as OddsEvent[];
  }

  if (!isRecord(json)) {
    return [];
  }

  if (Array.isArray(json.display_events)) {
    return json.display_events as OddsEvent[];
  }

  if (Array.isArray(json.events)) {
    return json.events as OddsEvent[];
  }

  if (Array.isArray(json.data)) {
    return json.data as OddsEvent[];
  }

  return [];
}

export default function TrackingPage() {
  const [trackedLines, setTrackedLines] = useState<TrackedLine[]>([]);
  const [currentEvents, setCurrentEvents] = useState<OddsEvent[]>([]);
  const [loading, setLoading] = useState(true);
  const [oddsLoading, setOddsLoading] = useState(false);
  const [error, setError] = useState("");

  const loadCurrentOddsForTrackedLines = async (lines: TrackedLine[]) => {
    if (lines.length === 0) {
      setCurrentEvents([]);
      return;
    }

    setOddsLoading(true);

    try {
      const fetchKeys = new Set<string>();

      for (const line of lines) {
        const league = normalizeLeague(line.league || "");
        const market = getTrackedMarketKeyForFetch(line);

        if (SUPPORTED_LEAGUES.has(league) && market) {
          fetchKeys.add(`${league}:${market}`);
        }
      }

      const responses = await Promise.all(
        Array.from(fetchKeys).map(async (key) => {
          const [sport, market] = key.split(":");

          const params = new URLSearchParams({
            sport,
            market,
            regions: "us",
          });

          const res = await fetch(`/api/odds?${params.toString()}`, {
            cache: "no-store",
          });

          const json: unknown = await res.json();

          if (!res.ok) {
            const message = isRecord(json)
              ? String(json.error || json.detail || "Failed to fetch odds")
              : "Failed to fetch odds";

            throw new Error(message);
          }

          return getOddsEventsFromResponse(json);
        })
      );

      setCurrentEvents(responses.flat());
    } catch (error) {
      setError(
        error instanceof Error
          ? `Failed to load current odds: ${error.message}`
          : "Failed to load current odds"
      );
      setCurrentEvents([]);
    } finally {
      setOddsLoading(false);
    }
  };

  const loadTrackedLines = async () => {
    setLoading(true);
    setError("");

    try {
      const data = await getTrackedLines();
      setTrackedLines(data);
      await loadCurrentOddsForTrackedLines(data);
    } catch (error) {
      setError(
        error instanceof Error ? error.message : "Failed to load tracked lines"
      );
    } finally {
      setLoading(false);
    }
  };

  const trackedLinesWithComparison = useMemo<TrackedLineWithComparison[]>(() => {
    return trackedLines.map((item) => {
      const currentOffer = findCurrentOfferForTrackedLine(item, currentEvents);
      const comparison = compareTrackedLineToCurrentOffer(item, currentOffer);

      return {
        ...item,
        comparison,
      };
    });
  }, [trackedLines, currentEvents]);

  const handleDelete = async (id: string) => {
    setError("");

    try {
      await deleteTrackedLine(id);
      setTrackedLines((current) => current.filter((item) => item.id !== id));
    } catch (error) {
      setError(
        error instanceof Error ? error.message : "Failed to delete tracked line"
      );
    }
  };

  const handleUpdateStake = async (id: string, stake: number) => {
    setError("");

    try {
      const updatedLine = await updateTrackedLineStake(id, stake);

      setTrackedLines((current) =>
        current.map((item) => (item.id === id ? updatedLine : item))
      );
    } catch (error) {
      setError(
        error instanceof Error ? error.message : "Failed to update stake"
      );
    }
  };

  useEffect(() => {
    loadTrackedLines();
  }, []);

  return (
  <PageShell>
    <div className={theme.trackingHero}>
      <div>
        <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-primary/10 text-primary">
          <Heart className="h-5 w-5" />
        </div>

        <p className={theme.trackingEyebrow}>BestLinePicker</p>

        <h1 className={theme.trackingTitle}>Tracked Lines</h1>

        <p className={theme.trackingDescription}>
          Save lines from the odds table and quickly review stake, payout,
          profit, implied probability, and current line movement.
        </p>
      </div>

      <div className="flex flex-col gap-2 sm:flex-row">
        <button
          type="button"
          onClick={() => loadCurrentOddsForTrackedLines(trackedLines)}
          disabled={oddsLoading || trackedLines.length === 0}
          className={theme.buttonPrimary}
        >
          {oddsLoading ? "Checking..." : "Check Movement"}
        </button>

        <Link href="/" className={theme.trackingBackButton}>
          <ArrowLeft className="h-4 w-4" />
          Back to Odds
        </Link>
      </div>
    </div>

    {error && <div className={theme.errorBox}>{error}</div>}

    {loading ? (
      <div className={theme.loadingBox}>Loading tracked lines...</div>
    ) : (
      <TrackingList
        trackedLines={trackedLinesWithComparison}
        onDelete={handleDelete}
        onUpdateStake={handleUpdateStake}
      />
    )}
  </PageShell>
);
}