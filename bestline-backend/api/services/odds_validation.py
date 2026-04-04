from config.settings import (
    SUPPORTED_BOOKMAKERS,
    SUPPORTED_MARKETS,
    SUPPORTED_ODDS_FORMATS,
    SUPPORTED_REGIONS,
    SUPPORTED_DATE_FORMATS,
    SUPPORTED_SPORTS
)

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

def validate_event_id(event_id: str | None):
    if not event_id:
        raise ValueError("eventId is required.")