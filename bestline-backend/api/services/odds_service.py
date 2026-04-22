
from config.settings import SUPPORTED_SPORTS

from api.services.best_line_logic import find_best_lines_for_event
from api.services.odds_api import get_event_odds, get_odds_list
from api.services.odds_cache import (
    EVENT_CACHE_TTL,
    LIST_CACHE_TTL,
    build_event_odds_cache_key,
    build_odds_list_cache_key,
    get_cached_value,
    set_cached_value,
)
from api.services.odds_normalizer import (
    normalize_event_odds_request,
    normalize_odds_list_request,
)
from api.services.odds_settings_logic import (
    build_display_events,
    sort_display_events,
)


def fetch_odds_list_with_cache(query_params) -> dict:
    normalized = normalize_odds_list_request(query_params)
    sport_key = SUPPORTED_SPORTS[normalized["sport"]]

    cache_key = build_odds_list_cache_key(
        sport_key=sport_key,
        regions_csv=normalized["regions_csv"],
        markets_csv=normalized["markets_csv"],
        odds_format=normalized["odds_format"],
        date_format=normalized["date_format"],
        bookmakers_csv=normalized["bookmakers_csv"],
    )

    cached = get_cached_value(cache_key)
    if cached is not None:
        display_events = build_display_events(
            raw_events=cached,
            active_market=normalized["active_market"],
            books_mode=normalized["books_mode"],
            event_status=normalized["event_status"],
        )
        display_events = sort_display_events(
            events=display_events,
            sort_by=normalized["sort_by"],
            sort_order=normalized["sort_order"],
        )

        return {
            "source": "cache",
            "data": cached,
            "display_events": display_events,
            "filters": normalized,
        }

    data = get_odds_list(
        sport_key=sport_key,
        regions=normalized["regions_csv"],
        markets=normalized["markets_csv"],
        odds_format=normalized["odds_format"],
        date_format=normalized["date_format"],
        bookmakers=normalized["bookmakers_csv"],
    )

    set_cached_value(cache_key, data, LIST_CACHE_TTL)

    display_events = build_display_events(
        raw_events=data,
        active_market=normalized["active_market"],
        books_mode=normalized["books_mode"],
        event_status=normalized["event_status"],
    )
    display_events = sort_display_events(
        events=display_events,
        sort_by=normalized["sort_by"],
        sort_order=normalized["sort_order"],
    )

    return {
        "source": "live",
        "data": data,
        "display_events": display_events,
        "filters": normalized,
    }


def fetch_event_odds_with_cache(query_params) -> dict:
    normalized = normalize_event_odds_request(query_params)
    sport_key = SUPPORTED_SPORTS[normalized["sport"]]

    cache_key = build_event_odds_cache_key(
        sport_key=sport_key,
        event_id=normalized["event_id"],
        regions_csv=normalized["regions_csv"],
        markets_csv=normalized["markets_csv"],
        odds_format=normalized["odds_format"],
        date_format=normalized["date_format"],
        bookmakers_csv=normalized["bookmakers_csv"],
    )

    cached = get_cached_value(cache_key)
    if cached is not None:
        raw_event = cached
        raw_events = [raw_event] if raw_event else []

        display_events = build_display_events(
            raw_events=raw_events,
            active_market=normalized["active_market"],
            books_mode=normalized["books_mode"],
            event_status=normalized["event_status"],
        )
        display_events = sort_display_events(
            events=display_events,
            sort_by=normalized["sort_by"],
            sort_order=normalized["sort_order"],
        )

        return {
            "source": "cache",
            "data": cached,
            "display_events": display_events,
            "filters": normalized,
        }

    data = get_event_odds(
        sport_key=sport_key,
        event_id=normalized["event_id"],
        regions=normalized["regions_csv"],
        markets=normalized["markets_csv"],
        odds_format=normalized["odds_format"],
        date_format=normalized["date_format"],
        bookmakers=normalized["bookmakers_csv"],
    )

    set_cached_value(cache_key, data, EVENT_CACHE_TTL)

    raw_events = [data] if data else []

    display_events = build_display_events(
        raw_events=raw_events,
        active_market=normalized["active_market"],
        books_mode=normalized["books_mode"],
        event_status=normalized["event_status"],
    )
    display_events = sort_display_events(
        events=display_events,
        sort_by=normalized["sort_by"],
        sort_order=normalized["sort_order"],
    )

    return {
        "source": "live",
        "data": data,
        "display_events": display_events,
        "filters": normalized,
    }


def build_best_lines_from_event_payload(event_payload: dict, market_key: str) -> dict:
    return find_best_lines_for_event(event_payload, market_key)