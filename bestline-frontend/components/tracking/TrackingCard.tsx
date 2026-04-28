"use client";

import type { TrackedLine } from "@/types/tracking";
import StakeEditor from "@/components/tracking/StakeEditor";

type TrackingCardProps = {
  item: TrackedLine;
  onDelete: (id: string) => Promise<void>;
  onUpdateStake: (id: string, stake: number) => Promise<void>;
};

function formatAmericanOdds(odds: number) {
  return odds > 0 ? `+${odds}` : `${odds}`;
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

        <span className="w-fit rounded-full border border-emerald-200 bg-emerald-50 px-3 py-1 text-xs font-black text-emerald-800">
          {item.status}
        </span>
      </div>

      <div className="mt-5 grid gap-3 md:grid-cols-4">
        <div className="rounded-2xl bg-stone-50 p-4">
          <p className="text-xs font-black uppercase text-stone-500">Odds</p>
          <p className="mt-1 text-lg font-black text-stone-950">
            {formatAmericanOdds(item.odds)}
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
          <p className="text-xs font-black uppercase text-stone-500">Payout</p>
          <p className="mt-1 text-lg font-black text-stone-950">
            ${item.payout.toFixed(2)}
          </p>
        </div>

        <div className="rounded-2xl bg-stone-50 p-4">
          <p className="text-xs font-black uppercase text-stone-500">Profit</p>
          <p className="mt-1 text-lg font-black text-stone-950">
            ${item.profit.toFixed(2)}
          </p>
        </div>
      </div>

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