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
    validate_markets,
    validate_odds_format,
    validate_regions,
    validate_sport_alias,
)


# Turns raw GET request values into a cleaner, normalized format.
def _split_csv(value: str | None) -> list[str]:
    if not value:
        return []
    return [item.strip().lower() for item in value.split(",") if item.strip()]


def _dedupe_and_sort(values: list[str]) -> list[str]:
    return sorted(set(values))


def normalize_odds_list_request(query_params) -> dict:
    sport = (query_params.get("sport", DEFAULT_SPORT) or "").strip().lower()
    validate_sport_alias(sport)

    raw_markets = query_params.get("markets")
    if raw_markets:
        markets_list = _dedupe_and_sort(_split_csv(raw_markets))
    else:
        markets_list = DEFAULT_MARKETS[:]

    raw_regions = query_params.get("regions", DEFAULT_REGION)
    regions_list = _dedupe_and_sort(_split_csv(raw_regions))
    if not regions_list:
        regions_list = [DEFAULT_REGION]

    raw_bookmakers = query_params.get("bookmakers", "")
    bookmakers_list = _dedupe_and_sort(_split_csv(raw_bookmakers))

    odds_format = (query_params.get("oddsFormat", DEFAULT_ODDS_FORMAT) or "").strip().lower()
    date_format = (query_params.get("dateFormat", DEFAULT_DATE_FORMAT) or "").strip().lower()

    validate_markets(markets_list)
    validate_regions(regions_list)
    validate_bookmakers(bookmakers_list)
    validate_odds_format(odds_format)
    validate_date_format(date_format)

    return {
        "sport": sport,
        "markets_list": markets_list,
        "markets_csv": ",".join(markets_list),
        "regions_list": regions_list,
        "regions_csv": ",".join(regions_list),
        "bookmakers_list": bookmakers_list,
        "bookmakers_csv": ",".join(bookmakers_list) if bookmakers_list else None,
        "odds_format": odds_format,
        "date_format": date_format,
    }


def normalize_event_odds_request(query_params) -> dict:
    normalized = normalize_odds_list_request(query_params)

    event_id = (query_params.get("eventId") or "").strip()
    validate_event_id(event_id)

    normalized["event_id"] = event_id
    return normalized