"use client";

import type { TrackedLine } from "@/types/tracking";
import StakeEditor from "@/components/tracking/StakeEditor";
import LineMovementBadge from "@/components/tracking/lineMovementBadge";
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
    <article className="rounded-3xl border border-stone-200 bg-white p-5 shadow-sm">
      <div className="flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
        <div>
          <div className="text-xs font-black uppercase tracking-wide text-stone-500">
            {item.league} • {item.market}
          </div>

          <h2 className="mt-1 text-xl font-black text-stone-950">
            {item.matchup}
          </h2>

          <p className="mt-1 text-sm font-semibold text-stone-600">
            {item.selection} · {item.sportsbook}
          </p>
        </div>

        {comparison ? (
          <LineMovementBadge status={comparison.status} />
        ) : (
          <span className="w-fit rounded-full border border-stone-200 bg-stone-50 px-3 py-1 text-xs font-black text-stone-700">
            Watching
          </span>
        )}
      </div>

      <div className="mt-5 grid gap-3 md:grid-cols-4">
        <div className="rounded-2xl bg-stone-50 p-4">
          <p className="text-xs font-black uppercase text-stone-500">
            Tracked Line
          </p>
          <p className="mt-1 text-lg font-black text-stone-950">
            {formatLine(item.selection, trackedPoint, trackedPrice)}
          </p>
        </div>

        <div className="rounded-2xl bg-stone-50 p-4">
          <p className="text-xs font-black uppercase text-stone-500">
            Current Line
          </p>
          <p className="mt-1 text-lg font-black text-stone-950">
            {comparison?.status === "unavailable"
              ? "Unavailable"
              : formatLine(
                  item.selection,
                  comparison?.current_point,
                  comparison?.current_price
                )}
          </p>
        </div>

        <div className="rounded-2xl bg-stone-50 p-4">
          <p className="text-xs font-black uppercase text-stone-500">
            Implied Prob.
          </p>
          <p className="mt-1 text-lg font-black text-stone-950">
            {item.implied_probability}%
          </p>
        </div>

        <div className="rounded-2xl bg-stone-50 p-4">
          <p className="text-xs font-black uppercase text-stone-500">Profit</p>
          <p className="mt-1 text-lg font-black text-stone-950">
            ${item.profit.toFixed(2)}
          </p>
        </div>
      </div>

      {comparison && (
        <div className="mt-4 rounded-2xl border border-stone-100 bg-stone-50 px-4 py-3">
          <p className="text-sm font-semibold text-stone-700">
            {comparison.message}
          </p>
        </div>
      )}

      <div className="mt-5 flex flex-col gap-4 border-t border-stone-100 pt-5 md:flex-row md:items-end md:justify-between">
        <div>
          <p className="mb-2 text-xs font-black uppercase text-stone-500">
            Stake
          </p>

          <StakeEditor
            initialStake={item.stake}
            onSave={(stake) => onUpdateStake(item.id, stake)}
          />
        </div>

        <div className="flex flex-col items-start gap-2 md:items-end">
          <p className="text-xs font-semibold text-stone-500">
            Payout: ${item.payout.toFixed(2)}
          </p>

          <p className="text-xs font-semibold text-stone-500">
            Saved {savedDate}
          </p>

          <button
            type="button"
            onClick={() => onDelete(item.id)}
            className="rounded-xl border border-red-200 bg-red-50 px-3 py-2 text-sm font-black text-red-700 transition hover:bg-red-100"
          >
            Remove
          </button>
        </div>
      </div>
    </article>
  );
}