import type { LineMovementStatus } from "@/lib/tracking/lineMovement";

type LineMovementBadgeProps = {
  status: LineMovementStatus;
};

const statusStyles: Record<LineMovementStatus, string> = {
  improved: "border-emerald-200 bg-emerald-50 text-emerald-800",
  worse: "border-red-200 bg-red-50 text-red-700",
  line_changed: "border-amber-200 bg-amber-50 text-amber-800",
  unchanged: "border-stone-200 bg-stone-50 text-stone-700",
  unavailable: "border-slate-200 bg-slate-50 text-slate-600",
};

const statusLabels: Record<LineMovementStatus, string> = {
  improved: "Improved",
  worse: "Worse",
  line_changed: "Line Changed",
  unchanged: "No Change",
  unavailable: "Unavailable",
};

export default function LineMovementBadge({ status }: LineMovementBadgeProps) {
  return (
    <span
      className={`w-fit rounded-full border px-3 py-1 text-xs font-black ${statusStyles[status]}`}
    >
      {statusLabels[status]}
    </span>
  );
}