from config.settings import (
    DEFAULT_MARKETS,
    DEFAULT_ODDS_FORMAT,
    DEFAULT_REGION,
    DEFAULT_DATE_FORMAT,
    DEFAULT_SPORT,
)
from api.services.odds_validation import (
    validate_bookmakers,
    validate_date_format,
    validate_event_id,
    validate_event_status,
    validate_markets,
    validate_odds_format,
    validate_regions,
    validate_sort_by,
    validate_sort_order,
    validate_sport_alias,
    validate_books_mode,
)


DEFAULT_BOOKS_MODE = "all"
DEFAULT_EVENT_STATUS = "all"
DEFAULT_SORT_BY = "start_time"
DEFAULT_SORT_ORDER = "asc"


def _get_first(query_params, *keys, default=None):
    for key in keys:
        value = query_params.get(key)
        if value is not None:
            return value
    return default


# Turns raw GET request values into a cleaner, normalized format.
def _split_csv(value: str | None) -> list[str]:
    if not value:
        return []
    return [item.strip().lower() for item in value.split(",") if item.strip()]


def _dedupe_and_sort(values: list[str]) -> list[str]:
    return sorted(set(values))


def normalize_odds_list_request(query_params) -> dict:
    sport = (_get_first(query_params, "sport", default=DEFAULT_SPORT) or "").strip().lower()
    validate_sport_alias(sport)

    raw_markets = _get_first(query_params, "markets", "market")
    if raw_markets:
        markets_list = _dedupe_and_sort(_split_csv(raw_markets))
    else:
        markets_list = DEFAULT_MARKETS[:]

    raw_regions = _get_first(query_params, "regions", default=DEFAULT_REGION)
    regions_list = _dedupe_and_sort(_split_csv(raw_regions))
    if not regions_list:
        regions_list = [DEFAULT_REGION]

    raw_bookmakers = _get_first(query_params, "bookmakers", default="")
    bookmakers_list = _dedupe_and_sort(_split_csv(raw_bookmakers))

    odds_format = (
        _get_first(query_params, "oddsFormat", "odds_format", default=DEFAULT_ODDS_FORMAT) or ""
    ).strip().lower()

    date_format = (
        _get_first(query_params, "dateFormat", "date_format", default=DEFAULT_DATE_FORMAT) or ""
    ).strip().lower()

    books_mode = (
        _get_first(query_params, "booksMode", "books_mode", default=DEFAULT_BOOKS_MODE) or ""
    ).strip().lower()

    event_status = (
        _get_first(query_params, "eventStatus", "event_status", default=DEFAULT_EVENT_STATUS) or ""
    ).strip().lower()

    sort_by = (
        _get_first(query_params, "sortBy", "sort_by", default=DEFAULT_SORT_BY) or ""
    ).strip().lower()

    sort_order = (
        _get_first(query_params, "sortOrder", "sort_order", default=DEFAULT_SORT_ORDER) or ""
    ).strip().lower()

    validate_markets(markets_list)
    validate_regions(regions_list)
    validate_bookmakers(bookmakers_list)
    validate_odds_format(odds_format)
    validate_date_format(date_format)
    validate_books_mode(books_mode)
    validate_event_status(event_status)
    validate_sort_by(sort_by)
    validate_sort_order(sort_order)

    active_market = markets_list[0]

    return {
        "sport": sport,
        "markets_list": markets_list,
        "markets_csv": ",".join(markets_list),
        "active_market": active_market,
        "regions_list": regions_list,
        "regions_csv": ",".join(regions_list),
        "bookmakers_list": bookmakers_list,
        "bookmakers_csv": ",".join(bookmakers_list) if bookmakers_list else None,
        "odds_format": odds_format,
        "date_format": date_format,
        "books_mode": books_mode,
        "event_status": event_status,
        "sort_by": sort_by,
        "sort_order": sort_order,
    }


def normalize_event_odds_request(query_params) -> dict:
    normalized = normalize_odds_list_request(query_params)

    event_id = (_get_first(query_params, "eventId", "event_id") or "").strip()
    validate_event_id(event_id)

    normalized["event_id"] = event_id
    return normalized