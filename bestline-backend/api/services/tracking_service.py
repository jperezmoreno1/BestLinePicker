from datetime import datetime, timezone
from firebase_admin import firestore


TRACKED_LINES_COLLECTION = "tracked_lines"


def now_iso():
    return datetime.now(timezone.utc).isoformat()


def now_unix_ms():
    return int(datetime.now(timezone.utc).timestamp() * 1000)


def calculate_implied_probability(american_odds):
    odds = int(american_odds)

    if odds > 0:
        probability = 100 / (odds + 100)
    else:
        probability = abs(odds) / (abs(odds) + 100)

    return round(probability * 100, 2)


def calculate_profit(american_odds, stake):
    odds = int(american_odds)
    stake = float(stake)

    if odds > 0:
        profit = stake * (odds / 100)
    else:
        profit = stake * (100 / abs(odds))

    return round(profit, 2)


def calculate_payout(american_odds, stake):
    stake = float(stake)
    profit = calculate_profit(american_odds, stake)

    return round(stake + profit, 2)


def validate_tracked_line_payload(payload):
    required_fields = [
        "matchup",
        "league",
        "market",
        "selection",
        "sportsbook",
        "odds",
    ]

    missing_fields = [
        field for field in required_fields if payload.get(field) in [None, ""]
    ]

    if missing_fields:
        raise ValueError(f"Missing required fields: {', '.join(missing_fields)}")

    try:
        int(payload.get("odds"))
    except (TypeError, ValueError):
        raise ValueError("odds must be a valid number")

    stake = payload.get("stake", 10)

    try:
        stake = float(stake)
    except (TypeError, ValueError):
        raise ValueError("stake must be a valid number")

    if stake <= 0:
        raise ValueError("stake must be greater than 0")


def create_tracked_line(db, payload):
    validate_tracked_line_payload(payload)

    timestamp_iso = now_iso()
    timestamp_ms = now_unix_ms()

    odds = int(payload.get("odds"))
    stake = float(payload.get("stake", 10))

    doc_data = {
    "game_id": payload.get("game_id"),
    "event_id": payload.get("event_id") or payload.get("game_id"),

    "matchup": payload.get("matchup"),
    "league": payload.get("league"),

    "market": payload.get("market"),
    "market_key": payload.get("market_key"),

    "selection": payload.get("selection"),
    "selection_name": payload.get("selection_name") or payload.get("selection"),

    "sportsbook": payload.get("sportsbook"),
    "sportsbook_key": payload.get("sportsbook_key"),
    "sportsbook_title": payload.get("sportsbook_title") or payload.get("sportsbook"),

    "odds": odds,
    "tracked_price": payload.get("tracked_price") or odds,

    "point": payload.get("point"),
    "tracked_point": payload.get("tracked_point") or payload.get("point"),

    "stake": stake,
    "implied_probability": calculate_implied_probability(odds),
    "payout": calculate_payout(odds, stake),
    "profit": calculate_profit(odds, stake),
    "status": payload.get("status", "watching"),
    "created_at": timestamp_iso,
    "created_at_unix_ms": timestamp_ms,
    "updated_at": timestamp_iso,
    "updated_at_unix_ms": timestamp_ms,
}

    doc_ref = db.collection(TRACKED_LINES_COLLECTION).document()
    doc_ref.set(doc_data)

    return {
        "id": doc_ref.id,
        **doc_data,
    }


def list_tracked_lines(db, limit=50):
    try:
        limit = int(limit)
    except (TypeError, ValueError):
        limit = 50

    limit = max(1, min(limit, 100))

    docs = (
        db.collection(TRACKED_LINES_COLLECTION)
        .order_by("created_at_unix_ms", direction=firestore.Query.DESCENDING)
        .limit(limit)
        .stream()
    )

    tracked_lines = []

    for doc in docs:
        data = doc.to_dict()
        tracked_lines.append({
            "id": doc.id,
            **data,
        })

    return tracked_lines


def delete_tracked_line(db, tracking_id):
    doc_ref = db.collection(TRACKED_LINES_COLLECTION).document(tracking_id)
    doc = doc_ref.get()

    if not doc.exists:
        return False

    doc_ref.delete()
    return True


def update_tracked_line_stake(db, tracking_id, stake):
    try:
        new_stake = float(stake)
    except (TypeError, ValueError):
        raise ValueError("stake must be a valid number")

    if new_stake <= 0:
        raise ValueError("stake must be greater than 0")

    doc_ref = db.collection(TRACKED_LINES_COLLECTION).document(tracking_id)
    doc = doc_ref.get()

    if not doc.exists:
        return None

    data = doc.to_dict()
    odds = int(data.get("odds"))

    updated_data = {
        "stake": new_stake,
        "payout": calculate_payout(odds, new_stake),
        "profit": calculate_profit(odds, new_stake),
        "updated_at": now_iso(),
        "updated_at_unix_ms": now_unix_ms(),
    }

    doc_ref.update(updated_data)

    updated_doc = doc_ref.get().to_dict()

    return {
        "id": tracking_id,
        **updated_doc,
    }