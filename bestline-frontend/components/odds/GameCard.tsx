import { theme } from "@/styles/theme";
import type { Game } from "@/types/odds";
import { formatDate, formatTime } from "@/utils/odds";

type GameCardProps = {
  game: Game;
  selected: boolean;
  onClick: () => void;
};

export default function GameCard({ game, selected, onClick }: GameCardProps) {
  const isLive = game.eventStatus === "live";

  return (
    <button
      type="button"
      onClick={onClick}
      className={`w-full rounded-2xl border p-4 text-left transition ${
        selected
          ? "border-primary bg-primary/10"
          : "border-border bg-card hover:border-primary/30 hover:bg-muted"
      }`}
    >
      <div className="mb-3 flex items-center justify-between gap-3">
        <span
          className={`rounded-full px-3 py-1 text-xs font-black ${
            isLive
              ? "bg-destructive/10 text-destructive"
              : "bg-muted text-muted-foreground"
          }`}
        >
          {isLive ? "LIVE" : "SCHEDULED"}
        </span>

        <span className="text-xs font-bold text-muted-foreground">
          {formatDate(game.startTs)} • {formatTime(game.startTs)}
        </span>
      </div>

      <div className="space-y-2">
        <div>
          <div className="text-xs font-black uppercase tracking-wide text-muted-foreground">
            Away
          </div>
          <div className="text-base font-black text-foreground">
            {game.away}
          </div>
        </div>

        <div>
          <div className="text-xs font-black uppercase tracking-wide text-muted-foreground">
            Home
          </div>
          <div className="text-base font-black text-foreground">
            {game.home}
          </div>
        </div>
      </div>

      <div className="mt-3 flex flex-wrap gap-2">
        <span className={theme.eventMetaPill}>
          Status: <strong>{game.eventStatus}</strong>
        </span>

        <span className={theme.eventMetaPill}>
          Value: <strong>{game.valueScore.toFixed(2)}</strong>
        </span>
      </div>
    </button>
  );
}