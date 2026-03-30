from django.core.cache import cache

DEFAULT_ODDS_CACHE_TTL = 30

def build_odds_cache_key(
        sport_key: str,
        maket: str,
        regions_csv: str,
        bookmakers_csv: str | None,
        odds_format: str,
) -> str:
    normalized_bookmakers = bookmakers_csv or "none"
    return f"odds:{sport_key}:{maket}:{regions_csv}:{normalized_bookmakers}:{odds_format}"

def get_cached_odds(cache_key: str):
    return cache.get(cache_key)

def set_cached_odds(cache_key: str, data, ttl: int = DEFAULT_ODDS_CACHE_TTL):
    cache.set(cache_key, data, timeout=ttl)