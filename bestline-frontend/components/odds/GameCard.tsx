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
          ? "border-indigo-300 bg-indigo-50"
          : "border-slate-200 bg-white hover:border-indigo-200 hover:bg-indigo-50/40"
      }`}
    >
      <div className="mb-3 flex items-center justify-between gap-3">
        <span
          className={`rounded-full px-3 py-1 text-xs font-black ${
            isLive
              ? "bg-emerald-100 text-emerald-800"
              : "bg-slate-100 text-slate-700"
          }`}
        >
          {isLive ? "LIVE" : "SCHEDULED"}
        </span>

        <span className="text-xs font-bold text-slate-500">
          {formatDate(game.startTs)} • {formatTime(game.startTs)}
        </span>
      </div>

      <div className="space-y-2">
        <div>
          <div className="text-xs font-black uppercase tracking-wide text-slate-500">
            Away
          </div>
          <div className="text-base font-black text-slate-900">
            {game.away}
          </div>
        </div>

        <div>
          <div className="text-xs font-black uppercase tracking-wide text-slate-500">
            Home
          </div>
          <div className="text-base font-black text-slate-900">
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