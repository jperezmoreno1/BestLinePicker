"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { theme } from "@/styles/theme";
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
    <main className={theme.page}>
      <header className={theme.header}>
        <div className={theme.headerInner}>
          <div className={theme.brandWrap}>
            <div className={theme.logoDot} />

            <div>
              <div className={theme.brandTitle}>Snapshot History</div>
              <div className={theme.brandSubtitle}>
                Review saved BestLinePicker odds snapshots
              </div>
            </div>
          </div>

          <div className={theme.headerActions}>
            <Link href="/" className={theme.navLink}>
              Back to Odds
            </Link>

            <Link href="/guides" className={theme.navLink}>
              Guides
            </Link>
          </div>
        </div>
      </header>

      <div className={theme.container}>
        <SnapshotHistoryCard
          snapshots={snapshots}
          snapshotsLoading={snapshotsLoading}
          snapshotError={snapshotError}
          mode="full"
        />
      </div>
    </main>
  );
}