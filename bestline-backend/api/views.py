from django.core.cache import cache
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from datetime import datetime, timezone

from .services.odds_api import get_odds_list, get_event_odds, OddsApiError
from .services.firestore import get_db
from .services.calc import american_to_decimal, implied_probability_from_decimal

SUPPORTED_SPORTS = {
    "nfl": "americanfootball_nfl",
    "nba": "basketball_nba",
    "mlb": "baseball_mlb"
}
# Pulls featured markets across upcoming/live events (GET endpoint)
class OddsView(APIView):
    """ Returns featured odds (h2h/spreads/totals) for a sport. Cached briefly to reduce API usage."""
    def get(self, request):
        sport = request.query_params.get("sport", "nfl").lower()
        sport_key = SUPPORTED_SPORTS.get(sport)
        if not sport_key:
            return Response(
                {"error": "sport must be one of: nfl, nba, mlb"},
                status=status.HTTP_400_BAD_REQUEST
            )
        
        markets = (request.query_params.get("markets", "h2h,spreads,totals") or "").replace(" ", "")
        regions = (request.query_params.get("regions", "us") or "").replace(" ", "")
        odds_format = request.query_params.get("oddsFormat", "american")
        date_format = request.query_params.get("dateFormat", "iso")
        bookmakers = request.query_params.get("bookmakers") or ""

        cache_key = f"odds:list:{sport_key}:{regions}:{markets}:{odds_format}:{date_format}:{bookmakers}"
        cached = cache.get(cache_key)
        if cached is not None:
            return Response({"source": "cache", "data": cached})
        try:
            data = get_odds_list(
                sport_key=sport_key,
                regions=regions,
                markets=markets,
                odds_format=odds_format,
                date_format=date_format,
                bookmakers=bookmakers
            )
        except OddsApiError as e:
            return Response({"error": str(e)}, status=status.HTTP_502_BAD_GATEWAY)
        
        cache.set(cache_key, data, timeout=45)
        return Response({"source": "live", "data": data})
    
class EventOddsView(APIView):
    def get(self, request):
        sport = (request.query_params.get("sport", "nfl") or "").lower()
        sport_key = SUPPORTED_SPORTS.get(sport)
        if not sport_key:
            return Response({"error": "sport must be nfl, nba, or mlb"}, status=400)
        
        event_id = request.query_params.get("eventId")
        if not event_id:
            return Response({"error": "eventId is required"}, status=400)

        markets = request.query_params.get("markets")
        if not markets:
            return Response({"error": "markets is required"}, status=400)

        regions = request.query_params.get("regions", "us")

        cache_key = f"odds:event:{sport_key}:{event_id}:{regions}:{markets}"
        cached = cache.get(cache_key)
        if cached is not None:
            return Response({"source": "cache", "data": cached})

        try:
            data = get_event_odds(sport_key, event_id, regions, markets)
        except OddsApiError as e:
            return Response({"error": str(e)}, status=status.HTTP_502_BAD_GATEWAY)

        cache.set(cache_key, data, timeout=45)
        return Response({"source": "live", "data": data})
    
class SnapshotCreateView(APIView):
    def post(self, request):
        sport = request.data.get("sport", "")
        markets = request.data.get("markets", "")
        payload = request.data.get("payload")

        if not sport or not markets or payload is None:
            return Response({"error": "sport, markets, and payload are required"}, status=400)

        db = get_db()
        doc = {
            "sport": sport,
            "markets": markets,
            "payload": payload,
            "created_at": datetime.now(timezone.utc).isoformat(),
        }
        ref = db.collection("snapshots").document()
        ref.set(doc)

        return Response({"ok": True, "id": ref.id})


class SnapshotListView(APIView):
    def get(self, request):
        sport = request.query_params.get("sport", "nfl")
        db = get_db()

        snaps = (
            db.collection("snapshots")
              .where("sport", "==", sport)
              .order_by("created_at", direction="DESCENDING")
              .limit(20)
              .stream()
        )

        out = []
        for s in snaps:
            d = s.to_dict()
            out.append({
                "id": s.id,
                "sport": d.get("sport"),
                "markets": d.get("markets"),
                "created_at": d.get("created_at"),
            })

        return Response({"data": out})
    
class BestPriceView(APIView):
    def post(self, request):
        event = request.data.get("event")
        market_key = request.data.get("marketKey")
        stake = float(request.data.get("stake", 100))

        if not event or not market_key:
            return Response({"error": "event and marketKey required"}, status=400)

        best = None
        comparisons = []

        # event["bookmakers"] -> each has markets -> outcomes
        for book in event.get("bookmakers", []):
            book_title = book.get("title", "Unknown")
            for m in book.get("markets", []):
                if m.get("key") != market_key:
                    continue

                for outcome in m.get("outcomes", []):
                    # for h2h: outcome has name + price
                    price = outcome.get("price")
                    name = outcome.get("name")

                    if price is None:
                        continue

                    dec = american_to_decimal(int(price))
                    profit = stake * (dec - 1)
                    implied = implied_probability_from_decimal(dec)

                    row = {
                        "book": book_title,
                        "selection": name,
                        "american": int(price),
                        "decimal": round(dec, 4),
                        "implied_prob": round(implied, 4),
                        "profit_on_stake": round(profit, 2),
                    }
                    comparisons.append(row)

                    if best is None or row["profit_on_stake"] > best["profit_on_stake"]:
                        best = row

        if best is None:
            return Response({"error": "No matching market found in event"}, status=400)

        # Compute deltas from best
        for row in comparisons:
            row["delta_from_best"] = round(best["profit_on_stake"] - row["profit_on_stake"], 2)

        return Response({"best": best, "comparisons": comparisons})