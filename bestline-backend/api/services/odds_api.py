import os
import requests

BASE_URL = "https://api.the-odds-api.com/v4"

class OddsApiError(Exception):
    pass

def _api_key() -> str:
    key = os.getenv("ODDS_API_KEY", "")
    if not key:
        raise OddsApiError("ODDS_API_KEY MISSING IN .env FILE")
    return key

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

    r = requests.get(
        f"{BASE_URL}/sports/{sport_key}/odds",
        params=params,
        timeout=20,
    )

    if r.status_code != 200:
        raise OddsApiError(f"Odds API error ({r.status_code}): {r.text}")

    return r.json()
    
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

    r = requests.get(
        f"{BASE_URL}/sports/{sport_key}/events/{event_id}/odds",
        params=params,
        timeout=20
    )

    if r.status_code != 200:
        raise OddsApiError(f"Odds API error ({r.status_code}): {r.text}")
    return r.json()