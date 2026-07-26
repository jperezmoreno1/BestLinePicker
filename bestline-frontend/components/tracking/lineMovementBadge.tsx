import type { LineMovementStatus } from "@/lib/tracking/lineMovement";

type LineMovementBadgeProps = {
  status: LineMovementStatus;
};

const statusStyles: Record<LineMovementStatus, string> = {
  improved: "border-best-line bg-best-line/10 text-[#6b7652]",
  worse: "border-destructive/30 bg-destructive/10 text-destructive",
  line_changed: "border-accent/30 bg-accent/10 text-accent",
  unchanged: "border-border bg-muted text-muted-foreground",
  unavailable: "border-border bg-muted/50 text-muted-foreground",
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