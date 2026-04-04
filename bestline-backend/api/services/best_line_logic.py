def get_market_from_book(book: dict, market_key: str) -> dict | None:
    markets = book.get("markets", [])
    for market_obj in markets:
        if market_obj.get("key") == market_key:
            return market_obj
    return None


def find_best_lines_for_event(event: dict, market_key: str) -> dict:
    books = event.get("bookmakers", [])
    home_team = event.get("home_team")
    away_team = event.get("away_team")

    if market_key == "h2h":
        return find_best_h2h_lines(books, home_team, away_team)

    if market_key == "spreads":
        return find_best_spread_lines(books, home_team, away_team)

    if market_key == "totals":
        return find_best_total_lines(books)

    return {}

def find_best_h2h_lines(bookmakers: list[dict], home_team: str, away_team: str) -> dict:
    best_prices = {
        home_team: None,
        away_team: None,
    }

    best_books = {
        home_team: None,
        away_team: None,
    }

    for bookmaker in bookmakers:
        market_obj = get_market_from_book(bookmaker, "h2h")
        if not market_obj:
            continue

        for outcome in market_obj.get("outcomes", []):
            team_name = outcome.get("name")
            price = outcome.get("price")

            if team_name not in best_prices or price is None:
                continue

            current_best = best_prices[team_name]
            if current_best is None or price > current_best:
                best_prices[team_name] = price
                best_books[team_name] = bookmaker.get("key")

    return {
        "marketKey": "h2h",
        "best_prices": best_prices,
        "best_books": best_books,
    }

def _is_better_spread(candidate_point, candidate_price, current_entry) -> bool:
    if current_entry is None:
        return True
    
    current_point = current_entry["point"]
    current_price = current_entry["price"]

    if candidate_point is None:
        return False
    
    if current_point is None:
        return True
    
    if candidate_point > current_point:
        return True
    
    if candidate_point == current_point and candidate_price is not None:
        if current_price is None or candidate_price > current_price:
            return True
        
    return False

def find_best_spread_lines(bookmakers: list[dict], home_team: str, away_team: str) -> dict:
    best_spreads = {
        home_team: None,
        away_team: None,
    }

    for bookmaker in bookmakers:
        market_obj = get_market_from_book(bookmaker, "spreads")
        if not market_obj:
            continue
        
        for outcome in market_obj.get("outcomes", []):
            team_name = outcome.get("name")
            point = outcome.get("point")
            price = outcome.get("price")

            if team_name not in best_spreads:
                continue

            candidate = {
                "point": point,
                "price": price,
                "bookmaker": bookmaker.get("key")
            }

            if _is_better_spread(point, price, best_spreads[team_name]):
                best_spreads[team_name] = candidate

    return {
        "marketKey": "spreads",
        "bestBySelection": best_spreads,
    }

def _is_better_total(side: str, candidate_point, candidate_price, current_entry) -> bool:
    if current_entry is None:
        return True
    
    current_point = current_entry["point"]
    current_price = current_entry["price"]

    if candidate_point is None:
        return False
    
    if current_point is None:
        return True
    
    if side == "Over":
        if candidate_point < current_point:
            return True
        if candidate_point == current_point and candidate_price is not None:
            if current_price is None or candidate_price > current_price:
                return True
    
    elif side == "Under":
        if candidate_point > current_point:
            return True
        if candidate_point == current_point and candidate_price is not None:
            if current_price is None or candidate_price > current_price:
                return True
            
    return False

def find_best_total_lines(bookmakers: list[dict]) -> dict:
    best_over = None
    best_under = None

    for bookmaker in bookmakers:
        market_obj = get_market_from_book(bookmaker, "totals")
        if not market_obj:
            continue

        for outcome in market_obj.get("outcomes", []):
            side = outcome.get("name")
            point = outcome.get("point")
            price = outcome.get("price")

            candidate = {
                "point": point,
                "price": price,
                "bookmaker": bookmaker.get("key")
            }

            if side == "Over":
                if _is_better_total("Over", point, price, best_over):
                    best_over = candidate

            elif side == "Under":
                if _is_better_total("Under", point, price, best_under):
                    best_under = candidate
        
    return {
        "marketKey": "totals",
        "over": best_over,
        "under": best_under,
    }