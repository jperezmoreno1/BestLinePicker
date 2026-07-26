"use client";

import type { TrackedLine } from "@/types/tracking";
import type { LineComparisonResult } from "@/lib/tracking/lineMovement";
import TrackingCard from "@/components/tracking/TrackingCard";

type TrackedLineWithComparison = TrackedLine & {
  comparison?: LineComparisonResult;
};

type TrackingListProps = {
  trackedLines: TrackedLineWithComparison[];
  onDelete: (id: string) => Promise<void>;
  onUpdateStake: (id: string, stake: number) => Promise<void>;
};

export default function TrackingList({
  trackedLines,
  onDelete,
  onUpdateStake,
}: TrackingListProps) {
  if (trackedLines.length === 0) {
    return (
      <section className="rounded-3xl border border-border bg-card p-8 text-center shadow-sm">
        <h2 className="text-xl font-black text-foreground">
          No tracked lines yet
        </h2>

        <p className="mt-2 text-sm font-medium text-muted-foreground">
          Go to the odds page, choose a game, and click Track on any sportsbook
          line.
        </p>
      </section>
    );
  }

  return (
    <section className="space-y-4">
      {trackedLines.map((item) => (
        <TrackingCard
          key={item.id}
          item={item}
          onDelete={onDelete}
          onUpdateStake={onUpdateStake}
        />
      ))}
    </section>
  );
}