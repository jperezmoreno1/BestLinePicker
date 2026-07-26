"use client";

import { useState } from "react";
import type { TrackLinePayload } from "@/types/tracking";
import { saveTrackedLine } from "@/lib/trackingApi";

type TrackLineButtonProps = {
  line: TrackLinePayload;
};

export default function TrackLineButton({ line }: TrackLineButtonProps) {
  const [saving, setSaving] = useState(false);
  const [tracked, setTracked] = useState(false);
  const [error, setError] = useState("");

  const handleTrack = async () => {
    setSaving(true);
    setError("");

    try {
      await saveTrackedLine({
        ...line,
        status: line.status || "watching",
      });

      setTracked(true);
    } catch (error) {
      setError(error instanceof Error ? error.message : "Failed to track line");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="flex flex-col items-end gap-1">
      <button
        type="button"
        onClick={handleTrack}
        disabled={saving || tracked}
        className="rounded-full border border-best-line bg-best-line/10 px-3 py-1 text-xs font-black text-[#6b7652] transition hover:bg-best-line/20 disabled:cursor-not-allowed disabled:opacity-60"
      >
        {tracked ? "Tracked" : saving ? "Saving..." : "Track"}
      </button>

      {error && <span className="max-w-32 text-right text-[11px] text-destructive">{error}</span>}
    </div>
  );
}