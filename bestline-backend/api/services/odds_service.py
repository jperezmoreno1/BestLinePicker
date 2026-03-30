from api.services.best_line_logic import (
    filter_bookmakers,
    find_best_h2h_lines,
    find_best_total_lines, 
    find_best_spread_lines
)

from api.services.odds_api import get_odds_list
from api.services.odds_cache import (
    build_odds_cache_key,
    get_cached_odds,
    set_cached_odds,
)
from api.services.odds_normalizer import normalize_odds_request

def fetch_odds_data(normalized: dict) -> dict:
    cache_key = build_odds_cache_key(
        sport_key=normalized["sport_key"],
        market=normalized["market"],
        regions_csv=normalized["regions_csv"],
        bookmakers_csv=normalized["bookmakers_csv"],
        odds_format=normalized["odds_format"]
    )

    cached_data = get_cached_odds(cache_key)
    if cached_data is not None:
        return {
            "data": cached_data,
            "from_cache": True,
            "cache_key": cache_key
        }
    
    api_data = get_odds_list(
        sport_key=normalized["sport_key"],
        regions=normalized["regions_csv"],
        markets=normalized["market"],
        odds_format=normalized["odds_format"],
        bookmakers=normalized["bookmakers_csv"]
    )

    set_cached_odds(cache_key, api_data)

    return {
        "data": api_data,
        "from_cache": False,
        "cache_key": cache_key
    }

def compute_best_line_data(selected_market: str, bookmakers: list[dict], home_team: str, away_team: str) -> dict:
    if selected_market == "h2h":
        return find_best_h2h_lines(bookmakers, home_team, away_team)
    
    if selected_market == "spreads":
        return find_best_spread_lines(bookmakers, home_team, away_team)
    
    if selected_market == "totals":
        return find_best_total_lines(bookmakers)
    
    return None

def format_event(event: dict, selected_market: str, selected_bookmakers_list: list[str]) -> dict:
    home_team = event.get("home_team")
    away_team = event.get("away_team")

    relevant_bookmakers = filter_bookmakers(event, selected_bookmakers_list)

    best_line_data = compute_best_line_data(
        selected_market=selected_market,
        bookmakers=relevant_bookmakers,
        home_team=home_team,
        away_team=away_team
    )

    return {
        "event_id": event.get("id"),
        "sport_key": event.get("sport_key"),
        "sport_title": event.get("sport_title"),
        "commence_time": event.get("commence_time"),
        "home_team": home_team,
        "away_team": away_team,
        "market": selected_market,
        "bookmakers": relevant_bookmakers,
        "best_line_data": best_line_data
    }

def get_best_line_picker_odds(query_params) -> dict:
    normalized = normalize_odds_request(query_params)

    fetch_result = fetch_odds_data(normalized)
    raw_events = fetch_result["data"]

    formatted_events = []
    for event in raw_events:
        formatted_events.append(
            format_event(
                event=event,
                selected_market=normalized["market"],
                selected_bookmakers_list=normalized["bookmakers_list"]
            )
        )
        
    return {
        "filters": {
            "sport_key": normalized["sport_key"],
            "market": normalized["market"],
            "regions": normalized["regions_list"],
            "bookmakers": normalized["bookmakers_list"],
            "odds_format": normalized["odds_format"]
        },
        "meta": {
            "from_cache": fetch_result["from_cache"],
            "cache_key": fetch_result["cache_key"],
            "event_count": len(formatted_events)
        },
        "events": formatted_events
    }