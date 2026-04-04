import os
import requests

BASE_URL = "https://api.the-odds-api.com/v4"

class OddsApiError(Exception):
    pass

def _api_key() -> str:
    key = os.getenv("ODDS_API_KEY", "").strip()
    if not key:
        raise OddsApiError("ODDS_API_KEY MISSING IN .env FILE")
    return key

def _make_request(url: str, params: dict):
    try:
        response = requests.get(url, params=params, timeout=20)
    except requests.RequestException as exc:
        raise OddsApiError(f"Network error while calling Odds API: {exc}") from exc
    
    if response.status_code != 200:
        raise OddsApiError(f"Odds API error ({response.status_code}): {response.text}")
    
    return response.json()

def get_odds_list(
        sport_key: str,
        regions: str = "us",
        markets: str = "h2h,spreads,totals",
        odds_format: str = "american",
        date_format: str = "iso",
        bookmakers: str | None = None,
):
    params = {
        "apiKey": _api_key(),
        "regions": regions,
        "markets": markets,
        "oddsFormat": odds_format,
        "dateFormat": date_format,
    }

    if bookmakers:
        params["bookmakers"] = bookmakers

    url = f"{BASE_URL}/sports/{sport_key}/odds"
    return _make_request(url, params)
    
def get_event_odds(
        sport_key: str,
        event_id: str,
        regions: str,
        markets: str,
        odds_format: str = "american",
        date_format: str = "iso",
        bookmakers: str | None = None,
):
    params = {
        "apiKey": _api_key(),
        "regions": regions,
        "markets": markets,
        "oddsFormat": odds_format,
        "dateFormat": date_format,
    }

    if bookmakers:
        params["bookmakers"] = bookmakers

    url = f"{BASE_URL}/sports/{sport_key}/events/{event_id}/odds"
    return _make_request(url, params)