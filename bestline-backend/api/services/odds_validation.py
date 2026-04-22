
from config.settings import (
    SUPPORTED_BOOKMAKERS,
    SUPPORTED_MARKETS,
    SUPPORTED_ODDS_FORMATS,
    SUPPORTED_REGIONS,
    SUPPORTED_DATE_FORMATS,
    SUPPORTED_SPORTS,
)

SUPPORTED_BOOKS_MODES = {"all", "best_only"}
SUPPORTED_EVENT_STATUSES = {"all", "scheduled", "live"}
SUPPORTED_SORT_BY = {"start_time", "best_value"}
SUPPORTED_SORT_ORDER = {"asc", "desc"}


# Validating incoming request values before making any API calls.

def validate_sport_alias(sport: str):
    if sport not in SUPPORTED_SPORTS:
        raise ValueError(
            f"sport must be one of: {', '.join(SUPPORTED_SPORTS.keys())}"
        )


def validate_markets(markets_list: list[str]):
    if not markets_list:
        raise ValueError("at least one market is required")

    for market in markets_list:
        if market not in SUPPORTED_MARKETS:
            raise ValueError(
                f"Invalid market '{market}'. Supported markets: {SUPPORTED_MARKETS}"
            )


def validate_regions(regions_list: list[str]):
    if not regions_list:
        raise ValueError("at least one region is required")

    for region in regions_list:
        if region not in SUPPORTED_REGIONS:
            raise ValueError(
                f"Invalid region '{region}'. Supported regions: {SUPPORTED_REGIONS}"
            )


def validate_bookmakers(bookmakers_list: list[str]):
    for bookmaker in bookmakers_list:
        if bookmaker not in SUPPORTED_BOOKMAKERS:
            raise ValueError(
                f"Invalid bookmaker '{bookmaker}'. Supported bookmakers: {SUPPORTED_BOOKMAKERS}"
            )


def validate_odds_format(odds_format: str):
    if odds_format not in SUPPORTED_ODDS_FORMATS:
        raise ValueError(
            f"Invalid odds_format '{odds_format}'. Supported formats: {SUPPORTED_ODDS_FORMATS}"
        )


def validate_date_format(date_format: str):
    if date_format not in SUPPORTED_DATE_FORMATS:
        raise ValueError(
            f"invalid dateFormat '{date_format}'. Supported values: {SUPPORTED_DATE_FORMATS}"
        )


def validate_books_mode(books_mode: str):
    if books_mode not in SUPPORTED_BOOKS_MODES:
        raise ValueError(
            f"Invalid books_mode '{books_mode}'. Supported values: {sorted(SUPPORTED_BOOKS_MODES)}"
        )


def validate_event_status(event_status: str):
    if event_status not in SUPPORTED_EVENT_STATUSES:
        raise ValueError(
            f"Invalid event_status '{event_status}'. Supported values: {sorted(SUPPORTED_EVENT_STATUSES)}"
        )


def validate_sort_by(sort_by: str):
    if sort_by not in SUPPORTED_SORT_BY:
        raise ValueError(
            f"Invalid sort_by '{sort_by}'. Supported values: {sorted(SUPPORTED_SORT_BY)}"
        )


def validate_sort_order(sort_order: str):
    if sort_order not in SUPPORTED_SORT_ORDER:
        raise ValueError(
            f"Invalid sort_order '{sort_order}'. Supported values: {sorted(SUPPORTED_SORT_ORDER)}"
        )


def validate_odds_request(
    sport: str,
    markets_list: list[str],
    regions_list: list[str],
    bookmakers_list: list[str],
    odds_format: str,
    date_format: str,
):
    validate_sport_alias(sport)
    validate_markets(markets_list)
    validate_regions(regions_list)

    if bookmakers_list:
        validate_bookmakers(bookmakers_list)

    validate_odds_format(odds_format)
    validate_date_format(date_format)


def validate_odds_settings_request(
    books_mode: str,
    event_status: str,
    sort_by: str,
    sort_order: str,
):
    validate_books_mode(books_mode)
    validate_event_status(event_status)
    validate_sort_by(sort_by)
    validate_sort_order(sort_order)


def validate_event_id(event_id: str | None):
    if not event_id:
        raise ValueError("eventId is required.")