from django.core.cache import cache

LIST_CACHE_TTL = 45
EVENT_CACHE_TTL = 45


def build_odds_list_cache_key(
    sport_key: str,
    regions_csv: str,
    markets_csv: str,
    odds_format: str,
    date_format: str,
    bookmakers_csv: str | None,
) -> str:
    bookmakers_part = bookmakers_csv or "none"
    return f"odds:list:{sport_key}:{regions_csv}:{markets_csv}:{odds_format}:{date_format}:{bookmakers_part}"


def build_event_odds_cache_key(
    sport_key: str,
    event_id: str,
    regions_csv: str,
    markets_csv: str,
    odds_format: str,
    date_format: str,
    bookmakers_csv: str | None,
) -> str:
    bookmakers_part = bookmakers_csv or "none"
    return f"odds:event:{sport_key}:{event_id}:{regions_csv}:{markets_csv}:{odds_format}:{date_format}:{bookmakers_part}"


def get_cached_value(cache_key: str):
    return cache.get(cache_key)


def set_cached_value(cache_key: str, data, ttl: int):
    cache.set(cache_key, data, timeout=ttl)