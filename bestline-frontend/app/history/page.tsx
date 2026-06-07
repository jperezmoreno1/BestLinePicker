"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { ArrowLeft, Clock } from "lucide-react";
import PageShell from "@/components/layout/PageShell";
import SnapshotHistoryCard from "@/components/snapshots/SnapshotHistoryCard";
import type { Snapshot } from "@/types/odds";

export default function HistoryPage() {
  const [snapshots, setSnapshots] = useState<Snapshot[]>([]);
  const [snapshotsLoading, setSnapshotsLoading] = useState(true);
  const [snapshotError, setSnapshotError] = useState("");

  useEffect(() => {
    async function loadSnapshots() {
      try {
        setSnapshotsLoading(true);
        setSnapshotError("");

        const res = await fetch("/api/snapshots?limit=25", {
          cache: "no-store",
        });

        const json = await res.json();

        if (!res.ok) {
          throw new Error(json.error || "Failed to load snapshots");
        }

        setSnapshots(json.data || []);
      } catch (error) {
        setSnapshotError(
          error instanceof Error ? error.message : "Failed to load snapshots"
        );
      } finally {
        setSnapshotsLoading(false);
      }
    }

    loadSnapshots();
  }, []);

  return (
    <PageShell>
      <section className="mb-5 rounded-3xl border border-border bg-card p-6 shadow-sm">
        <div className="flex flex-col justify-between gap-4 md:flex-row md:items-end">
          <div>
            <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-primary/10 text-primary">
              <Clock className="h-5 w-5" />
            </div>

            <p className="mt-4 text-xs font-black uppercase tracking-[0.22em] text-primary">
              Snapshot History
            </p>

            <h1 className="mt-2 text-3xl font-black tracking-tight text-foreground md:text-4xl">
              Saved Odds Snapshots
            </h1>

            <p className="mt-2 max-w-2xl text-sm leading-6 text-muted-foreground">
              Review saved BestLinePicker odds snapshots, including the market,
              selection, calculator context, and best line at the time saved.
            </p>
          </div>

          <Link
            href="/"
            className="inline-flex w-fit items-center gap-2 rounded-xl border border-border bg-muted px-4 py-2 text-sm font-black text-foreground transition hover:bg-secondary/40"
          >
            <ArrowLeft className="h-4 w-4" />
            Back to Odds
          </Link>
        </div>
      </section>

      <SnapshotHistoryCard
        snapshots={snapshots}
        snapshotsLoading={snapshotsLoading}
        snapshotError={snapshotError}
        mode="full"
      />
    </PageShell>
  );
}