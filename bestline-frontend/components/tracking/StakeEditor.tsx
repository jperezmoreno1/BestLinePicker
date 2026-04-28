"use client";

import { useState } from "react";

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
        className="w-24 rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm font-semibold text-slate-900 outline-none"
      />

      <button
        type="button"
        onClick={handleSave}
        disabled={saving || stake <= 0}
        className="rounded-xl bg-slate-950 px-3 py-2 text-sm font-black text-white transition hover:bg-slate-800 disabled:cursor-not-allowed disabled:opacity-60"
      >
        {saving ? "Saving..." : "Update"}
      </button>
    </div>
  );
}