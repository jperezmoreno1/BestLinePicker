from config.settings import (
    SUPPORTED_BOOKMAKERS,
    SUPPORTED_MARKETS,
    SUPPORTED_ODDS_FORMATS,
    SUPPORTED_REGIONS,
)

# Validating incoming request values before making any API calls.
def validate_sport_key(sport_key: str | None):
    if not sport_key or not sport_key.strip():
        raise ValueError("sport is required")
    
def validate_market(market: str):
    if market not in SUPPORTED_MARKETS:
        raise ValueError(
            f"Invalid market '{market}'. Supported markets: {SUPPORTED_MARKETS}"
        )
    
def validate_regions(regions_list: list[str]):
    for region in regions_list:
        if region not in SUPPORTED_MARKETS:
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
    
def validate_odds_request(
        sport_key: str | None,
        market: str,
        regions_list: list[str],
        bookmakers_list: list[str],
        odds_format: str
):
    validate_sport_key(sport_key)
    validate_market(market)
    validate_regions(regions_list)

    if bookmakers_list:
        validate_bookmakers
    
    validate_odds_format(odds_format)