import { theme } from "@/styles/theme";
import type { Book, League, Market } from "@/types/odds";
import { bestOddsForSelection, formatOdds } from "@/utils/odds";

type MarketsCardProps = {
  league: League;
  market: Market;
  gameLabel: string;
  books: Book[];
  selectionOptions: Array<{
    key: string;
    label: string;
  }>;
  onMarketChange: (market: Market) => void;
};

export default function MarketsCard({
  league,
  market,
  gameLabel,
  books,
  selectionOptions,
  onMarketChange,
}: MarketsCardProps) {
  return (
    <section className={theme.cardNoMargin}>
      <div className={theme.cardHeader}>
        <div>
          <div className={theme.cardTitle}>Markets</div>
          <div className={theme.cardSubtitle}>
            {league} • {gameLabel}
          </div>
        </div>
      </div>

      <div className={theme.tabs}>
        {(["Moneyline", "Spread", "Total"] as Market[]).map((marketOption) => {
          const active = marketOption === market;

          return (
            <button
              key={marketOption}
              type="button"
              onClick={() => onMarketChange(marketOption)}
              className={`${theme.tab} ${active ? theme.tabActive : ""}`}
            >
              {marketOption}
            </button>
          );
        })}
      </div>

      <div className={theme.tableWrap}>
        <table className={theme.table}>
          <thead>
            <tr>
              <th className={theme.th}>Sportsbook</th>

              {selectionOptions.map((selection) => (
                <th key={selection.key} className={theme.thRight}>
                  {selection.label}
                </th>
              ))}
            </tr>
          </thead>

          <tbody>
            {books.map((book) => (
              <tr key={book.key || book.name} className={theme.tr}>
                <td className={theme.td}>
                  <div className="flex items-center gap-2.5">
                    <span className={theme.bookDot} />
                    <span className={theme.bookName}>{book.name}</span>
                  </div>
                </td>

                {selectionOptions.map((selection) => {
                  const outcome = book.outcomes.find(
                    (item) => item.key === selection.key
                  );

                  const best = bestOddsForSelection(books, selection.key);

                  const isBest =
                    outcome && best !== null && outcome.oddsAmerican === best;

                  return (
                    <td
                      key={`${book.name}-${selection.key}`}
                      className={`${theme.tdRight} ${
                        isBest ? theme.tdBest : ""
                      }`}
                    >
                      {outcome ? (
                        <div className="inline-flex items-center justify-end gap-2">
                          <span
                            className={isBest ? theme.oddsBest : theme.odds}
                          >
                            {formatOdds(outcome.oddsAmerican)}
                          </span>

                          {isBest && (
                            <span className={theme.bestPill}>Best</span>
                          )}
                        </div>
                      ) : (
                        <span className={theme.mutedDash}>—</span>
                      )}
                    </td>
                  );
                })}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </section>
  );
}