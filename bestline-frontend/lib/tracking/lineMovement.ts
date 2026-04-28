import type { TrackedLine } from "@/types/tracking";

export type LineMovementStatus =
  | "improved"
  | "worse"
  | "line_changed"
  | "unchanged"
  | "unavailable";

export type CurrentOffer = {
  name: string;
  price: number;
  point?: number | null;
};

export type LineComparisonResult = {
  status: LineMovementStatus;
  message: string;
  current_price: number | null;
  current_point: number | null;
};

type OddsOutcome = {
  name: string;
  price: number;
  point?: number | null;
};

type OddsMarket = {
  key: string;
  outcomes: OddsOutcome[];
};

type OddsBookmaker = {
  key: string;
  title?: string;
  markets: OddsMarket[];
};

export type OddsEvent = {
  id: string;
  home_team?: string;
  away_team?: string;
  bookmakers?: OddsBookmaker[];
};

function normalize(value: unknown) {
  return String(value ?? "")
    .trim()
    .toLowerCase();
}

function normalizeSelectionName(value: unknown) {
  return String(value ?? "")
    .trim()
    .replace(/\s+ML$/i, "")
    .replace(/\s+Moneyline$/i, "")
    .toLowerCase();
}

function getTrackedEventId(item: TrackedLine) {
  return item.event_id || item.game_id || "";
}

function getTrackedMarketKey(item: TrackedLine) {
  if (item.market_key) {
    return item.market_key;
  }

  const market = normalize(item.market);

  if (market === "moneyline") return "h2h";
  if (market === "spread" || market === "spreads") return "spreads";
  if (market === "total" || market === "totals") return "totals";

  return market;
}

function getTrackedSportsbookKey(item: TrackedLine) {
  return item.sportsbook_key || "";
}

function getTrackedSportsbookName(item: TrackedLine) {
  return item.sportsbook || item.sportsbook_title || "";
}

function getTrackedPrice(item: TrackedLine) {
  return Number(item.tracked_price ?? item.odds);
}

function getTrackedPoint(item: TrackedLine) {
  const point = item.tracked_point ?? item.point;

  if (point === undefined || point === null) {
    return null;
  }

  return Number(point);
}

function compareAmericanOdds(trackedPrice: number, currentPrice: number) {
  if (currentPrice > trackedPrice) {
    return "improved";
  }

  if (currentPrice < trackedPrice) {
    return "worse";
  }

  return "unchanged";
}

export function findCurrentOfferForTrackedLine(
  trackedLine: TrackedLine,
  currentEvents: OddsEvent[]
): CurrentOffer | null {
  const eventId = getTrackedEventId(trackedLine);
  const marketKey = getTrackedMarketKey(trackedLine);
  const sportsbookKey = getTrackedSportsbookKey(trackedLine);
  const sportsbookName = getTrackedSportsbookName(trackedLine);
  const selectionName = trackedLine.selection_name || trackedLine.selection;

  const matchingEvents = currentEvents.filter((event) => event.id === eventId);

  for (const event of matchingEvents) {
    const bookmaker = event.bookmakers?.find((bookmaker) => {
      const keyMatches =
        sportsbookKey && normalize(bookmaker.key) === normalize(sportsbookKey);

      const titleMatches =
        sportsbookName &&
        normalize(bookmaker.title) === normalize(sportsbookName);

      return keyMatches || titleMatches;
    });

    if (!bookmaker) {
      continue;
    }

    const market = bookmaker.markets?.find(
      (market) => normalize(market.key) === normalize(marketKey)
    );

    if (!market) {
      continue;
    }

    const outcome = market.outcomes?.find(
      (outcome) =>
        normalizeSelectionName(outcome.name) ===
        normalizeSelectionName(selectionName)
    );

    if (!outcome) {
      continue;
    }

    return {
      name: outcome.name,
      price: Number(outcome.price),
      point:
        outcome.point === undefined || outcome.point === null
          ? null
          : Number(outcome.point),
    };
  }

  return null;
}

export function compareTrackedLineToCurrentOffer(
  trackedLine: TrackedLine,
  currentOffer: CurrentOffer | null
): LineComparisonResult {
  const trackedPrice = getTrackedPrice(trackedLine);
  const trackedPoint = getTrackedPoint(trackedLine);
  const marketKey = getTrackedMarketKey(trackedLine);

  if (!currentOffer) {
    return {
      status: "unavailable",
      message: "This offer is no longer available.",
      current_price: null,
      current_point: null,
    };
  }

  const currentPrice = Number(currentOffer.price);
  const currentPoint =
    currentOffer.point === undefined || currentOffer.point === null
      ? null
      : Number(currentOffer.point);

  if (marketKey === "h2h") {
    const priceStatus = compareAmericanOdds(trackedPrice, currentPrice);

    if (priceStatus === "improved") {
      return {
        status: "improved",
        message: "Better moneyline price is now available.",
        current_price: currentPrice,
        current_point: null,
      };
    }

    if (priceStatus === "worse") {
      return {
        status: "worse",
        message: "Moneyline price has gotten worse.",
        current_price: currentPrice,
        current_point: null,
      };
    }

    return {
      status: "unchanged",
      message: "Moneyline price has not changed.",
      current_price: currentPrice,
      current_point: null,
    };
  }

  if (marketKey === "spreads" || marketKey === "totals") {
    if (
      trackedPoint !== null &&
      currentPoint !== null &&
      trackedPoint !== currentPoint
    ) {
      return {
        status: "line_changed",
        message: "The line number changed.",
        current_price: currentPrice,
        current_point: currentPoint,
      };
    }

    const priceStatus = compareAmericanOdds(trackedPrice, currentPrice);

    if (priceStatus === "improved") {
      return {
        status: "improved",
        message: "Same line, better price.",
        current_price: currentPrice,
        current_point: currentPoint,
      };
    }

    if (priceStatus === "worse") {
      return {
        status: "worse",
        message: "Same line, worse price.",
        current_price: currentPrice,
        current_point: currentPoint,
      };
    }

    return {
      status: "unchanged",
      message: "Line and price have not changed.",
      current_price: currentPrice,
      current_point: currentPoint,
    };
  }

  return {
    status: "unavailable",
    message: "Unsupported market type.",
    current_price: null,
    current_point: null,
  };
}

export function getTrackedMarketKeyForFetch(item: TrackedLine) {
  return getTrackedMarketKey(item);
}

export function getTrackedPriceForDisplay(item: TrackedLine) {
  return getTrackedPrice(item);
}

export function getTrackedPointForDisplay(item: TrackedLine) {
  return getTrackedPoint(item);
}