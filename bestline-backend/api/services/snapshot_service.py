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
            return f"{selection_name} + {point_value}"
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

def build_snapshot_document(payload):
    sport = _normalize_text(payload.get("sport"))
    sport_key = _normalize_text(payload.get("sport_key")) or sport
    sport_title = _normalize_text(payload.get("sport_title")) or sport.upper()

    event_id = _normalize_text(payload.get("event_id"))
    commence_time = payload.get("event_commence_time")

    home_team = _normalize_text(payload.get("home_team"))
    away_team = _normalize_text(payload.get("away_team"))

    market_key = _normalize_text(payload.get("market_key")).lower()
    market_label = build_market_label(market_key)

    selection_name = _normalize_text(payload.get("selection_name"))
    selection_type = _normalize_text(payload.get("selection_type")).lower()
    point = _safe_float(payload.get("point"))

    selection_key = build_selection_key(
        market_key=market_key,
        selection_name=selection_name,
        selection_type=selection_type,
        point=point
    )

    selection_label = build_selection_label(
        market_key=market_key,
        selection_name=selection_name,
        selection_type=selection_type,
        point=point
    )

    best_line_summary = payload.get("best_line_summary") or {}
    calculator_context = payload.get("calculator_context") or {}
    filters = payload.get("filters") or {}

    selected_regions = filters.get("regions") or payload.get("selected_regions") or []
    selected_bookmakers = filters.get("bookmakers") or payload.get("selected_bookmakers") or []

    normalized_outcomes = normalize_outcomes_subset(
        payload.get("normalized_outcomes") or []
    )

    created_at_iso = datetime.now(timezone.utc).isoformat()
    created_at_unix_ms = int(datetime.now(timezone.utc).timestamp() * 1000)

    return {
        "sport": sport,
        "sport_key": sport_key,
        "sport_title": sport_title,
        "event_id": event_id,
        "event_commence_time": commence_time,
        "home_team": home_team,
        "away_team": away_team,
        "matchup_label": build_matchup_label(home_team, away_team),
        "market_key": market_key,
        "market_label": market_label,
        "selection_key": selection_key,
        "selection_label": selection_label,
        "selection_name": selection_name,
        "selection_type": selection_type,
        "point": point,
        "best_bookmaker_key": best_line_summary.get("bookmaker_key"),
        "best_bookmaker_title": best_line_summary.get("bookmaker_title"),
        "best_price": _safe_int(best_line_summary.get("price")),
        "implied_probability": _safe_float(
            calculator_context.get("implied_probability")
        ),
        "stake_input": _safe_float(calculator_context.get("stake")),
        "payout_at_save": _safe_float(calculator_context.get("payout")),
        "profit_at_save": _safe_float(calculator_context.get("profit")),
        "books_compared_count": len(normalized_outcomes),
        "selected_regions": selected_regions,
        "selected_bookmakers": selected_bookmakers,
        "odds_format": filters.get("odds_format") or payload.get("odds_format") or "american",
        "source": payload.get("source") or "the_odds_api",
        "snapshot_data": {
            "normalized_outcomes": normalized_outcomes,
            "best_line_summary": best_line_summary,
            "filters_applied": filters,
        },
        "created_at": firestore.SERVER_TIMESTAMP,
        "created_at_iso": created_at_iso,
        "created_at_unix_ms": created_at_unix_ms,
    }

def validate_snapshot_payload(payload):
    required_fields = [
        "sport",
        "event_id",
        "market_key",
        "selection_name",
        "home_team",
        "away_team"
    ]

    missing = [field for field in required_fields if not payload.get(field)]
    if missing:
        raise ValueError(
            f"Missing required snapshot fields: {', '.join(missing)}"
        )
    
def create_snapshot(db, payload):
    validate_snapshot_payload(payload)
    doc = build_snapshot_document(payload)

    ref = db.collection(SNAPSHOTS_COLLECTION).document()
    ref.set(doc)

    saved = ref.get().to_dict() or {}

    return {
        "id": ref.id,
        "sport": saved.get("sport"),
        "event_id": saved.get("event_id"),
        "matchup_label": saved.get("matchup_label"),
        "market_key": saved.get("market_key"),
        "market_label": saved.get("market_label"),
        "selection_key": saved.get("selection_key"),
        "selection_label": saved.get("selection_label"),
        "best_bookmaker_title": saved.get("best_bookmaker_title"),
        "best_price": saved.get("best_price"),
        "created_at": saved.get("created_at_iso"),
    }

def list_snapshots(db, sport=None, event_id=None, market_key=None, limit=DEFAULT_SNAPSHOT_LIMIT):
    try:
        limit = int(limit)
    except (TypeError, ValueError):
        limit = DEFAULT_SNAPSHOT_LIMIT

    limit = max(1, min(limit, MAX_SNAPSHOT_LIMIT))

    query = db.collection(SNAPSHOTS_COLLECTION)

    if sport:
        query = query.where("sport", "==", sport)

    if event_id:
        query = query.where("event_id", "==", event_id)

    if market_key:
        query = query.where("market_key", "==", market_key)

    query = query.order_by("created_at_unix_ms", direction=firestore.Query.DESCENDING).limit(limit)

    docs = query.stream()

    out = []
    for doc in docs:
        data = doc.to_dict() or {}
        out.append(
            {
                "id": doc.id,
                "sport": data.get("sport"),
                "event_id": data.get("event_id"),
                "matchup_label": data.get("matchup_label"),
                "market_key": data.get("market_key"),
                "market_label": data.get("market_label"),
                "selection_key": data.get("selection_key"),
                "selection_label": data.get("selection_label"),
                "best_bookmaker_title": data.get("best_bookmaker_title"),
                "best_price": data.get("best_price"),
                "created_at": data.get("created_at_iso"),  
            }
        )
    return out

def get_snapshot_detail(db, snapshot_id):
    doc_ref = db.collection(SNAPSHOTS_COLLECTION).document(snapshot_id)
    snapshot = doc_ref.get()

    if not snapshot.exists:
        return None
    
    data = snapshot.to_dict() or {}
    data["id"] = snapshot.id
    return data