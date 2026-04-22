from datetime import datetime, timezone

from api.services.best_line_logic import (
    find_best_lines_for_event,
    get_market_from_book,
)

def _parse_commence_time(value: str | None):
    if not value:
        return None
    try:
        return datetime.fromisoformat(value.replace("Z", "+00:00"))
    except ValueError:
        return None
    
def derive_event_status(event: dict) -> str:
    commende_dt = _parse_commence_time(event.get("commence_time"))
    if commende_dt is None:
        return "scheduled"
    
    now = datetime.now(timezone.utc)
    return "live" if commende_dt <= now else "scheduled"

def filter_events_by_status(events: list[dict], event_status: str) -> list[dict]:
    if event_status == "all":
        return events
    
    filtered = []
    for event in events:
        derived_status = derive_event_status(event)
        if derived_status == event_status:
            filtered.append(event)

    return filtered

def _safe_number(value):
    if value is None:
        return None
    try:
        return float(value)
    except(TypeError, ValueError):
        return None
    
def _get_price_for_h2h(event: dict, team_name: str) -> list[float]:
    prices = []

    for bookmaker in event.get("bookmakers", []):
        market_obj = get_market_from_book(bookmaker, "h2h")
        if not market_obj:
            continue

        for outcome in market_obj.get("outcomes", []):
            if outcome.get("name") == team_name:
                price = _safe_number(outcome.get("price"))
                if price is not None:
                    prices.append(price)

    return prices

def _compute_h2h_value_score(event: dict) -> float:
    home_team = event.get("home_team")
    away_team = event.get("away_team")

    home_prices = sorted(_get_price_for_h2h(event, home_team), reverse=True)
    away_prices = sorted(_get_price_for_h2h(event, away_team), reverse=True)

    home_edge = 0.0
    away_edge = 0.0

    if len(home_prices) >= 2:
        home_edge = home_prices[0] - home_prices[1]

    if len(away_prices) >= 2:
        away_edge = away_prices[0] - away_prices[1]

    return max(home_edge, away_edge)

def _spread_rank(entry: dict) -> tuple[float, float]:
    point = _safe_number(entry.get("point"))
    price = _safe_number(entry.get("price"))

    return (
        point if point is not None else float("-inf"),
        price if price is not None else float("-inf")
    )

def _compute_spreads_value_score(event: dict) -> float:
    home_team = event.get("home_team")
    away_team = event.get("away_team")

    per_team = {
        home_team: [],
        away_team: [],
    }

    for bookmaker in event.get("bookmakers", []):
        market_obj = get_market_from_book(bookmaker, "spreads")
        if not market_obj:
            continue

        for outcome in market_obj.get("outcomes", []):
            name = outcome.get("name")
            if name not in per_team:
                continue

            per_team[name].append({
                "point": outcome.get("point"),
                "price": outcome.get("price"),
            })

    best_score = 0.0

    for team_name, entries in per_team.items():
        ranked = sorted(entries, key=_spread_rank, reverse=True)
        if len(ranked) < 2:
            continue

        best = ranked[0]
        second = ranked[1]

        best_point = _safe_number(best.get("point")) or 0.0
        second_point = _safe_number(second.get("point")) or 0.0
        best_price = _safe_number(best.get("price")) or 0.0
        second_price = _safe_number(second.get("price")) or 0.0

        score = (best_point - second_point) * 1000 + (best_price - second_price)
        if score > best_score:
            best_score = score

    return best_score

def _total_rank(side: str, entry: dict) -> tuple[float, float]:
    point = _safe_number(entry.get("point"))
    price = _safe_number(entry.get("price"))

    if side == "Over":
        return (
            -(point if point is not None else float("inf")),
            price if price is not None else float("-inf"),
        )
    
    return (
        point if point is not None else float("-inf"),
        price if price is not None else float("-inf"),
    )

def _compute_totals_value_score(event: dict) -> float:
    per_side = {
        "Over": [],
        "Under": [],
    }

    for bookmaker in event.get("bookmakers", []):
        market_obj = get_market_from_book(bookmaker, "totals")
        if not market_obj:
            continue

        for outcome in market_obj.get("outcomes", []):
            name = outcome.get("name")
            if name not in per_side:
                continue
            per_side[name].append({
                "point": outcome.get("point"),
                "price": outcome.get("price"),
            })

    best_score = 0.0

    for side, entries in per_side.items():
        ranked = sorted(entries, key=lambda item: _total_rank(side, item), reverse=True)
        if len(ranked) < 2:
            continue

        best = ranked[0]
        second = ranked[1]

        best_point = _safe_number(best.get("point")) or 0.0
        second_point = _safe_number(second.get("point")) or 0.0
        best_price = _safe_number(best.get("price")) or 0.0
        second_price = _safe_number(second.get("price")) or 0.0

        if side == "Over":
            point_component = second_point - best_point
        else:
            point_component = best_point - second_point
        
        score = point_component * 1000 + (best_price - second_price)
        if score > best_score:
            best_score = score

    return best_score

def compute_event_value_score(event: dict, market_key: str) -> float:
    if market_key == "h2h":
        return _compute_h2h_value_score(event)
    
    if market_key == "spreads":
        return _compute_spreads_value_score(event)
    
    if market_key == "totals":
        return _compute_totals_value_score(event)
    
    return 0.0

def _extract_best_bookmaker_keys(best_lines: dict, market_key: str) -> set[str]:
    keys = set()

    if market_key == "h2h":
        for book_key in best_lines.get("best_books", {}).values():
            if book_key:
                keys.add(book_key)

    elif market_key == "spreads":
        for entry in best_lines.get("bestBySelection", {}).values():
            if entry and entry.get("bookmaker"):
                keys.add(entry["bookmaker"])

    elif market_key == "totals":
        over = best_lines.get("over")
        under = best_lines.get("under")

        if over and over.get("bookmaker"):
            keys.add(over["bookmaker"])

        if under and under.get("bookmaker"):
            keys.add(under["bookmaker"])

    return keys

def reduce_event_to_best_only(event: dict, market_key: str, best_lines: dict) -> dict:
    best_bookmaker_keys = _extract_best_bookmaker_keys(best_lines, market_key)

    if not best_bookmaker_keys:
        return event
    
    reduced_event = {
        **event,
        "bookmakers": [
            bookmaker for bookmaker in event.get("bookmakers", [])
            if bookmaker.get("key") in best_bookmaker_keys
        ],
    }

    return reduced_event

def build_display_events(
        raw_events: list[dict],
        active_market: str,
        books_mode: str,
        event_status: str
) -> list[dict]:
    
    filtered_events = filter_events_by_status(raw_events, event_status)
    display_events = []

    for event in filtered_events:
        best_lines = find_best_lines_for_event(event, active_market)
        processed_event = event

        if books_mode == "best_only":
            processed_event = reduce_event_to_best_only(
                event=event,
                market_key=active_market,
                best_lines=best_lines
            )

        display_events.append({
            "id": processed_event.get("id"),
            "sport_key": processed_event.get("sport_key"),
            "sport_title": processed_event.get("sport_title"),
            "commence_time": processed_event.get("commence_time"),
            "home_team": processed_event.get("home_team"),
            "away_team": processed_event.get("away_team"),
            "event_status": derive_event_status(processed_event),
            "market": active_market,
            "books_mode": books_mode,
            "bookmakers": processed_event.get("bookmakers", []),
            "bookmakers_count": len(processed_event.get("bookmakers", [])),
            "best_lines": best_lines,
            "value_score": compute_event_value_score(processed_event, active_market)
        })

    return display_events

def sort_display_events(
        events: list[dict],
        sort_by: str,
        sort_order: str,
) -> list[dict]:
    
    reverse = sort_order == "desc"

    if sort_by == "best_value":
        return sorted(
            events,
            key=lambda event: event.get("value_score", 0),
            reverse=reverse,
        )
    
    return sorted(
        events,
        key=lambda event: event.get("commence_time") or "",
        reverse=reverse
    )