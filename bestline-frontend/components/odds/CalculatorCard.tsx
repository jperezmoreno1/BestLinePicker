import { theme } from "@/styles/theme";
import type { Book } from "@/types/odds";
import {
  formatOdds,
  impliedProb,
  payoutForStake,
  profitForStake,
} from "@/utils/odds";

type CalculatorCardProps = {
  books: Book[];
  stake: number;
  selectedSelectionKey: string;
  selectionOptions: Array<{
    key: string;
    label: string;
  }>;
  bestForSelected: number | null;
  onStakeChange: (stake: number) => void;
  onSelectedSelectionChange: (selectionKey: string) => void;
};

export default function CalculatorCard({
  books,
  stake,
  selectedSelectionKey,
  selectionOptions,
  bestForSelected,
  onStakeChange,
  onSelectedSelectionChange,
}: CalculatorCardProps) {
  return (
    <section className={theme.cardNoMargin}>
      <div className={theme.cardHeader}>
        <div>
          <div className={theme.cardTitle}>Calculator</div>
          <div className={theme.cardSubtitle}>
            Compare payout, implied probability, and profit.
          </div>
        </div>
      </div>

      <div className="mt-3 flex flex-col gap-2">
        <label className={theme.labelDark}>Selection</label>
        <select
          value={selectedSelectionKey}
          onChange={(event) => onSelectedSelectionChange(event.target.value)}
          className={theme.selectLight}
        >
          {selectionOptions.map((option) => (
            <option key={option.key} value={option.key}>
              {option.label}
            </option>
          ))}
        </select>

        <label className={theme.labelDark}>Stake</label>
        <input
          type="number"
          min={1}
          step={1}
          value={stake}
          onChange={(event) => onStakeChange(Number(event.target.value))}
          className="w-32 rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm text-slate-900 outline-none"
        />
      </div>

      <div className={theme.calcGrid}>
        {books
          .map((book) => {
            const outcome = book.outcomes.find(
              (item) => item.key === selectedSelectionKey
            );

            if (!outcome) return null;

            const implied = impliedProb(outcome.oddsAmerican) * 100;
            const profit = profitForStake(outcome.oddsAmerican, stake);
            const payout = payoutForStake(outcome.oddsAmerican, stake);

            const isBest =
              bestForSelected !== null &&
              outcome.oddsAmerican === bestForSelected;

            const delta = bestForSelected
              ? payoutForStake(bestForSelected, stake) - payout
              : 0;

            return (
              <div
                key={`${book.name}-${selectedSelectionKey}`}
                className={isBest ? theme.calcCardBest : theme.calcCard}
              >
                <div className="mb-2 flex items-baseline justify-between gap-2">
                  <div className="font-black text-slate-900">{book.name}</div>

                  <div
                    className={
                      isBest
                        ? "font-black text-indigo-800"
                        : "font-black text-slate-900"
                    }
                  >
                    {formatOdds(outcome.oddsAmerican)}
                  </div>
                </div>

                <div className={theme.calcRow}>
                  <span className={theme.calcLabel}>Implied</span>
                  <span className={theme.calcValue}>{implied.toFixed(2)}%</span>
                </div>

                <div className={theme.calcRow}>
                  <span className={theme.calcLabel}>Profit</span>
                  <span className={theme.calcValue}>${profit.toFixed(2)}</span>
                </div>

                <div className={theme.calcRow}>
                  <span className={theme.calcLabel}>Payout</span>
                  <span className={theme.calcValue}>${payout.toFixed(2)}</span>
                </div>

                {!isBest ? (
                  <div className={theme.deltaRow}>
                    <span className={theme.deltaLabel}>Below best</span>
                    <span className={theme.deltaValue}>
                      -${delta.toFixed(2)}
                    </span>
                  </div>
                ) : (
                  <div className="mt-2 text-xs font-extrabold text-indigo-800">
                    Best price for this selection
                  </div>
                )}
              </div>
            );
          })
          .filter(Boolean)}
      </div>
    </section>
  );
}