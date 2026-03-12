def american_to_decimal(odds: int) -> float:
    if odds > 0:
        return 1 + (odds / 100.0)
    return 1 + (100.0 / abs(odds))

def implied_probability_from_decimal(decimal_odds: float) -> float:
    return 1.0 / decimal_odds if decimal_odds > 0 else 0.0