from datetime import datetime, timezone
from firebase_admin import firestore

SNAPSHOTS_COLLECTION = "snapshots"
DEFAULT_SNAPSHOT_LIMIT = 20
MAX_SNAPSHOT_LIMIT = 50

def _safe_float(value, default=None):
    try:
        if value is None or value == "":
            return default
        return float(value)
    except (TypeError, ValueError):
        return default
    
def _safe_int(value, default=None):
    try:
        if value is None or value == "":
            return default
        return int(value)
    except (TypeError, ValueError):
        return default
    
def _normalize_text(value):
    if value is None:
        return ""
    return str(value).strip()

def _slugify_piece(value):
    return _normalize_text(value).lower().replace(" ", "_")

def build_selection_key(market_key, selection_name, selection_type=None, point=None):
    market_key = _normalize_text(market_key).lower()
    selection_name = _normalize_text(selection_name)
    selection_type = _normalize_text(selection_type).lower()
    point_value = _safe_float(point)

    if market_key == "h2h":
        return f"h2h: {_slugify_piece(selection_name)}"
    
    if market_key == "spreads":

        if point_value is None:

            return f"spreads:{_slugify_piece(selection_name)}"

        return f"spreads:{_slugify_piece(selection_name)}:{point_value}"

    if market_key == "totals":

        if point_value is None:

            return f"totals:{_slugify_piece(selection_type)}"

        return f"totals:{_slugify_piece(selection_type)}:{point_value}"

    suffix = _slugify_piece(selection_type) if selection_type else _slugify_piece(selection_name)

    if point_value is not None:

        return f"{market_key}:{suffix}:{point_value}"

    return f"{market_key}:{suffix}"


def build_market_label(market_key):
    labels = {
        "h2h": "Moneyline",
        "spreads": "Spread",
        "totals": "Total:,"
    }
    return labels.get(_normalize_text(market_key).lower(), _normalize_text(market_key))

def build_matchup_label(home_team, away_team):
    home_team = _normalize_text(home_team)
    away_team = _normalize_text(away_team)

    if home_team and away_team:
        return f"{away_team} @ {home_team}"
    return f"{away_team} vs {home_team}".strip()

def build_selection_label(market_key, selection_name, selection_type = None, point = None):
    market_key = _normalize_text(market_key).lower()
    selection_name = _normalize_text(selection_name)
    selection_type = _normalize_text(selection_type).lower()
    point_value = _safe_float(point)

    if market_key == "h2h":
        return f"{selection_name} ML"

    if market_key == "spreads":
        if point_value is None:
            return selection_name

        if point_value > 0:
            return f"{selection_name} +{point_value}"
        return f"{selection_name} {point_value}"

    if market_key == "totals":
        if point_value is None:
            return selection_type.title()
        return f"{selection_type.title()} {point_value}"
    
    return selection_name or selection_type.title()

def normalize_outcomes_subset(normalized_outcomes):
    if not isinstance(normalized_outcomes, list):
        return []
    
    subset = []
    for item in normalized_outcomes:
        if not isinstance(item, dict):
            continue

        subset.append(
            {
                "bookmaker_key": item.get("bookmaker_key") or item.get("key"),
                "bookmaker_title": item.get("bookmaker_title") or item.get("title"),
                "outcome_name": item.get("outcome_name") or item.get("name"),
                "selection_type": item.get("selection_type"),
                "price": _safe_int(item.get("price")),
                "point": _safe_float(item.get("point")),
                "last_update": item.get("last_update"),
            }
        )

    return subset