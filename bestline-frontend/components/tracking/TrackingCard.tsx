"use client";

import type { TrackedLine } from "@/types/tracking";
import StakeEditor from "@/components/tracking/StakeEditor";
import LineMovementBadge from "@/components/tracking/lineMovementBadge";
import { theme } from "@/styles/theme";
import {
  getTrackedPointForDisplay,
  getTrackedPriceForDisplay,
  type LineComparisonResult,
} from "@/lib/tracking/lineMovement";

type TrackingCardItem = TrackedLine & {
  comparison?: LineComparisonResult;
};

type TrackingCardProps = {
  item: TrackingCardItem;
  onDelete: (id: string) => Promise<void>;
  onUpdateStake: (id: string, stake: number) => Promise<void>;
};

function formatAmericanOdds(odds: number | null | undefined) {
  if (odds === null || odds === undefined || Number.isNaN(Number(odds))) {
    return "-";
  }

  return Number(odds) > 0 ? `+${odds}` : `${odds}`;
}

function formatPoint(point: number | null | undefined) {
  if (point === null || point === undefined || Number.isNaN(Number(point))) {
    return "";
  }

  return Number(point) > 0 ? `+${point}` : `${point}`;
}

function formatLine(
  selection: string,
  point: number | null | undefined,
  price: number | null | undefined
) {
  const pointDisplay = formatPoint(point);
  const priceDisplay = formatAmericanOdds(price);

  return pointDisplay
    ? `${selection} ${pointDisplay} (${priceDisplay})`
    : `${selection} (${priceDisplay})`;
}

export default function TrackingCard({
  item,
  onDelete,
  onUpdateStake,
}: TrackingCardProps) {
  const savedDate = item.created_at
    ? new Date(item.created_at).toLocaleString([], {
        month: "short",
        day: "numeric",
        hour: "2-digit",
        minute: "2-digit",
      })
    : "Unknown";

  const trackedPrice = getTrackedPriceForDisplay(item);
  const trackedPoint = getTrackedPointForDisplay(item);

  const comparison = item.comparison;

  return (
    <article className={theme.trackingCard}>
      <div className={theme.trackingCardHeader}>
        <div>
          <div className={theme.trackingMeta}>
            {item.league} • {item.market}
          </div>

          <h2 className={theme.trackingMatchup}>{item.matchup}</h2>

          <p className={theme.trackingSub}>
            {item.selection} · {item.sportsbook}
          </p>
        </div>

        {comparison ? (
          <LineMovementBadge status={comparison.status} />
        ) : (
          <span className="w-fit rounded-full border border-border bg-muted px-3 py-1 text-xs font-black text-muted-foreground">
            Watching
          </span>
        )}
      </div>

      <div className={theme.trackingStatGrid}>
        <div className={theme.trackingStatBox}>
          <p className={theme.trackingStatLabel}>Tracked Line</p>
          <p className={theme.trackingStatValue}>
            {formatLine(item.selection, trackedPoint, trackedPrice)}
          </p>
        </div>

        <div className={theme.trackingStatBox}>
          <p className={theme.trackingStatLabel}>Current Line</p>
          <p className={theme.trackingStatValue}>
            {comparison?.status === "unavailable"
              ? "Unavailable"
              : formatLine(
                  item.selection,
                  comparison?.current_point,
                  comparison?.current_price
                )}
          </p>
        </div>

        <div className={theme.trackingStatBox}>
          <p className={theme.trackingStatLabel}>Implied Prob.</p>
          <p className={theme.trackingStatValue}>
            {item.implied_probability}%
          </p>
        </div>

        <div className={theme.trackingStatBox}>
          <p className={theme.trackingStatLabel}>Profit</p>
          <p className={theme.trackingStatValue}>
            ${item.profit.toFixed(2)}
          </p>
        </div>
      </div>

      {comparison && (
        <div className="mt-4 rounded-2xl border border-border bg-muted/40 px-4 py-3">
          <p className="text-sm font-bold text-foreground">
            {comparison.message}
          </p>
        </div>
      )}

      <div className={theme.trackingFooter}>
        <div>
          <p className="mb-2 text-xs font-black uppercase text-muted-foreground">
            Stake
          </p>

          <StakeEditor
            initialStake={item.stake}
            onSave={(stake) => onUpdateStake(item.id, stake)}
          />
        </div>

        <div className="flex flex-col items-start gap-2 md:items-end">
          <p className="text-xs font-bold text-muted-foreground">
            Payout: ${item.payout.toFixed(2)}
          </p>

          <p className="text-xs font-bold text-muted-foreground">
            Saved {savedDate}
          </p>

          <button
            type="button"
            onClick={() => onDelete(item.id)}
            className={theme.trackingRemoveButton}
          >
            Remove
          </button>
        </div>
      </div>
    </article>
  );
}