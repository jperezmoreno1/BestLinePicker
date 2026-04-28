import type { Book, DisplayEvent, Game, League, Market } from "@/types/odds";

export function americanToDecimal(odds: number): number {
  if (odds > 0) return 1 + odds / 100;
  return 1 + 100 / Math.abs(odds);
}

export function impliedProb(oddsAmerican: number): number {
  return 1 / americanToDecimal(oddsAmerican);
}

export function profitForStake(oddsAmerican: number, stake: number): number {
  return stake * (americanToDecimal(oddsAmerican) - 1);
}

export function payoutForStake(oddsAmerican: number, stake: number): number {
  return stake * americanToDecimal(oddsAmerican);
}

export function formatOdds(odds: number): string {
  return odds > 0 ? `+${odds}` : `${odds}`;
}

export function formatTime(ts: number): string {
  return new Date(ts).toLocaleTimeString([], {
    hour: "2-digit",
    minute: "2-digit",
  });
}

export function formatDate(ts: number): string {
  return new Date(ts).toLocaleDateString([], {
    weekday: "short",
    month: "short",
    day: "numeric",
  });
}

export function getMatchupKey(ev: DisplayEvent): string {
  return `${ev.away_team}__${ev.home_team}__${ev.commence_time}`;
}

export function toGame(league: League, ev: DisplayEvent): Game {
  return {
    id: ev.id,
    matchupKey: getMatchupKey(ev),
    league,
    away: ev.away_team,
    home: ev.home_team,
    startTs: Date.parse(ev.commence_time),
    eventStatus: ev.event_status,
    valueScore: ev.value_score ?? 0,
  };
}

export function buildBooksFromDisplayEvent(ev: DisplayEvent | null): Book[] {
  if (!ev?.bookmakers?.length) return [];

  const marketKey = ev.market;

  return ev.bookmakers.map((bk) => {
    const marketObj =
      bk.markets?.find((m) => m.key === marketKey) ??
      (bk.outcomes ? { key: marketKey, outcomes: bk.outcomes } : undefined);

    const outcomes = (marketObj?.outcomes || []).map((o) => {
      let key = o.name.toUpperCase().replace(/\s+/g, "_");
      let label = o.name;

      if (marketKey === "h2h") {
        label = `${o.name} ML`;
        key =
          o.name === ev.home_team
            ? "HOME_ML"
            : o.name === ev.away_team
              ? "AWAY_ML"
              : key;
      }

      if (marketKey === "spreads") {
        const p = o.point;
        const pointStr = p === undefined ? "" : p > 0 ? `+${p}` : `${p}`;
        label = `${o.name} ${pointStr}`.trim();
        key =
          o.name === ev.home_team
            ? "HOME_SPD"
            : o.name === ev.away_team
              ? "AWAY_SPD"
              : key;
      }

      if (marketKey === "totals") {
        label = o.point !== undefined ? `${o.name} ${o.point}` : o.name;
        key =
          o.name.toLowerCase() === "over"
            ? "OVER"
            : o.name.toLowerCase() === "under"
              ? "UNDER"
              : key;
      }

      return {
        key,
        label,
        oddsAmerican: o.price,
        line: o.point,
      };
    });

    return {
      key: bk.key,
      name: bk.title,
      outcomes,
    };
  });
}

export function bestOddsForSelection(
  books: Book[],
  selectionKey: string
): number | null {
  let best: number | null = null;

  for (const book of books) {
    const outcome = book.outcomes.find((x) => x.key === selectionKey);
    if (!outcome) continue;

    if (
      best === null ||
      americanToDecimal(outcome.oddsAmerican) > americanToDecimal(best)
    ) {
      best = outcome.oddsAmerican;
    }
  }

  return best;
}

export function getInitialSelectionKey(market: Market): string {
  if (market === "Moneyline") return "HOME_ML";
  if (market === "Spread") return "HOME_SPD";
  return "OVER";
}

export function getSelectionData(
  books: Book[],
  selectionKey: string
): {
  label: string;
  selectionName: string;
  selectionType: string;
  point: number | null;
} | null {
  for (const book of books) {
    const out = book.outcomes.find((o) => o.key === selectionKey);
    if (!out) continue;

    if (selectionKey === "HOME_ML" || selectionKey === "AWAY_ML") {
      return {
        label: out.label,
        selectionName: out.label.replace(" ML", ""),
        selectionType: "team",
        point: null,
      };
    }

    if (selectionKey === "HOME_SPD" || selectionKey === "AWAY_SPD") {
      const point = typeof out.line === "number" ? out.line : null;

      const selectionName =
        point !== null
          ? out.label.replace(
              new RegExp(
                `\\s*[+-]?${Math.abs(point)
                  .toString()
                  .replace(".", "\\.")}$`
              ),
              ""
            )
          : out.label;

      return {
        label: out.label,
        selectionName,
        selectionType: "team",
        point,
      };
    }

    if (selectionKey === "OVER" || selectionKey === "UNDER") {
      return {
        label: out.label,
        selectionName: out.label.split(" ")[0],
        selectionType: out.label.split(" ")[0].toLowerCase(),
        point: typeof out.line === "number" ? out.line : null,
      };
    }

    return {
      label: out.label,
      selectionName: out.label,
      selectionType: "unknown",
      point: typeof out.line === "number" ? out.line : null,
    };
  }

  return null;
}

export function buildNormalizedOutcomesForSelection(
  books: Book[],
  selectionKey: string
) {
  return books
    .map((book) => {
      const out = book.outcomes.find((o) => o.key === selectionKey);
      if (!out) return null;

      let selectionType = "team";

      if (selectionKey === "OVER") selectionType = "over";
      if (selectionKey === "UNDER") selectionType = "under";

      return {
        bookmaker_key: book.key,
        bookmaker_title: book.name,
        outcome_name:
          selectionKey === "HOME_ML" || selectionKey === "AWAY_ML"
            ? out.label.replace(" ML", "")
            : selectionKey === "OVER" || selectionKey === "UNDER"
              ? out.label.toLowerCase().startsWith("over")
                ? "Over"
                : "Under"
              : out.label,
        selection_type: selectionType,
        price: out.oddsAmerican,
        point: typeof out.line === "number" ? out.line : null,
        last_update: new Date().toISOString(),
      };
    })
    .filter((item): item is NonNullable<typeof item> => item !== null);
}

export function getBestLineSummary(
  books: Book[],
  selectionKey: string
): {
  bookmaker_key: string | null;
  bookmaker_title: string | null;
  price: number | null;
} {
  let bestBook: { key: string; name: string } | null = null;
  let bestPrice: number | null = null;

  for (const book of books) {
    const out = book.outcomes.find((o) => o.key === selectionKey);
    if (!out) continue;

    if (
      bestPrice === null ||
      americanToDecimal(out.oddsAmerican) > americanToDecimal(bestPrice)
    ) {
      bestPrice = out.oddsAmerican;
      bestBook = { key: book.key, name: book.name };
    }
  }

  return {
    bookmaker_key: bestBook?.key || null,
    bookmaker_title: bestBook?.name || null,
    price: bestPrice,
  };
}