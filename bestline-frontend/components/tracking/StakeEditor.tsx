"use client";

import { useState } from "react";
import { theme } from "@/styles/theme";

type StakeEditorProps = {
  initialStake: number;
  onSave: (stake: number) => Promise<void>;
};

export default function StakeEditor({ initialStake, onSave }: StakeEditorProps) {
  const [stake, setStake] = useState(initialStake);
  const [saving, setSaving] = useState(false);

  const handleSave = async () => {
    if (stake <= 0) return;

    setSaving(true);

    try {
      await onSave(stake);
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="flex items-center gap-2">
      <input
        type="number"
        min={1}
        value={stake}
        onChange={(event) => setStake(Number(event.target.value))}
        className="w-24 rounded-xl border border-border bg-card px-3 py-2 text-sm font-bold text-foreground outline-none transition focus:border-primary focus:ring-2 focus:ring-primary/20"
      />

      <button
        type="button"
        onClick={handleSave}
        disabled={saving || stake <= 0}
        className={theme.buttonPrimary}
      >
        {saving ? "Saving..." : "Update"}
      </button>
    </div>
  );
}