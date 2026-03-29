from config.settings import (
    DEFAULT_MARKET,
    DEFAULT_ODDS_FORMAT,
    DEFAULT_REGION
    )
from api.services.odds_validation import validate_odds_request

# Turns raw GET requests values into a much cleaner format
def _split_csv(value: str | None) -> list[str]:
    if not value:
        return []
    
    parts = value.split(",")
    cleaned = []

    for part in parts:
        item = part.strip.lower()
        if item:
            cleaned.append(item)

    return cleaned

def _dedupe_and_sort(values: list[str]) -> list[str]:
    return sorted(set(values))

def normalize_odds_request(query_params) -> dict:
    sport_key = query_params.get("sport")
    market = query_params.get("market", DEFAULT_MARKET).strip().lower()
    odds_format = query_params.get("odds_format", DEFAULT_ODDS_FORMAT).strip().lower()

    raw_regions = query_params.get("regions", DEFAULT_REGION)
    raw_bookmakers = query_params.get("bookmakers", "")

    regions_list = _dedupe_and_sort(_split_csv(raw_regions))
    bookmakers_list = _dedupe_and_sort(_split_csv(raw_bookmakers))

    if not regions_list:
        regions_list = [DEFAULT_REGION]

        validate_odds_request(
            sport_key=sport_key,
            market=market,
            regions_list=regions_list,
            bookmakers_list=bookmakers_list,
            odds_format=odds_format
        )
    
    return {
        "sport_key": sport_key.strip(),
        "market": market,
        "odds_format": odds_format,
        "regions_list": regions_list,
        "regions_csv": ",".join(regions_list),
        "bookmakers_list": bookmakers_list,
        "bookmakers_csv": ",".join(bookmakers_list) if bookmakers_list else None
    }