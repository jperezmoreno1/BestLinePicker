"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import TrackingList from "@/components/tracking/TrackingList";
import type { TrackedLine } from "@/types/tracking";
import {
  deleteTrackedLine,
  getTrackedLines,
  updateTrackedLineStake,
} from "@/lib/trackingApi";
import { theme } from "@/styles/theme";

export default function TrackingPage() {
  const [trackedLines, setTrackedLines] = useState<TrackedLine[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const loadTrackedLines = async () => {
    setLoading(true);
    setError("");

    try {
      const data = await getTrackedLines();
      setTrackedLines(data);
    } catch (error) {
      setError(
        error instanceof Error ? error.message : "Failed to load tracked lines"
      );
    } finally {
      setLoading(false);
    }
  };

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
    <main className={theme.page}>
      <div className={theme.container}>
        <div className={theme.trackingHero}>
          <div>
            <p className={theme.trackingEyebrow}>BestLinePicker</p>

            <h1 className={theme.trackingTitle}>Tracked Lines</h1>

            <p className={theme.trackingDescription}>
              Save lines from the odds table and quickly review stake, payout,
              profit, and implied probability. Version 1 stays intentionally
              simple.
            </p>
          </div>

          <Link href="/" className={theme.trackingBackButton}>
            Back to Odds
          </Link>
        </div>

        {error && <div className={theme.errorBox}>{error}</div>}

        {loading ? (
          <div className={theme.loadingBox}>Loading tracked lines...</div>
        ) : (
          <TrackingList
            trackedLines={trackedLines}
            onDelete={handleDelete}
            onUpdateStake={handleUpdateStake}
          />
        )}
      </div>
    </main>
  );
}