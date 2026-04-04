from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from datetime import datetime, timezone

from .services.odds_api import OddsApiError
from .services.firestore import get_db
from .services.calc import american_to_decimal, implied_probability_from_decimal
from .services.odds_service import (
    build_best_lines_from_event_payload,
    fetch_event_odds_with_cache,
    fetch_odds_list_with_cache,
)

class OddsView(APIView):
    def get(self, request):
        try:
            result = fetch_odds_list_with_cache(request.query_params)
            return Response(result, status=status.HTTP_200_OK)

        except ValueError as exc:
            return Response(
                {"error": str(exc)},
                status=status.HTTP_400_BAD_REQUEST,
            )

        except OddsApiError as exc:
            return Response(
                {"error": str(exc)},
                status=status.HTTP_502_BAD_GATEWAY,
            )

class EventOddsView(APIView):
    def get(self, request):
        try:
            result = fetch_event_odds_with_cache(request.query_params)
            return Response(result, status=status.HTTP_200_OK)

        except ValueError as exc:
            return Response(
                {"error": str(exc)},
                status=status.HTTP_400_BAD_REQUEST,
            )

        except OddsApiError as exc:
            return Response(
                {"error": str(exc)},
                status=status.HTTP_502_BAD_GATEWAY,
            )

class SnapshotCreateView(APIView):
    def post(self, request):
        sport = request.data.get("sport", "")
        markets = request.data.get("markets", "")
        payload = request.data.get("payload")

        if not sport or not markets or payload is None:
            return Response(
                {"error": "sport, markets, and payload are required"},
                status=status.HTTP_400_BAD_REQUEST,
            )

        db = get_db()
        doc = {
            "sport": sport,
            "markets": markets,
            "payload": payload,
            "created_at": datetime.now(timezone.utc).isoformat(),
        }
        ref = db.collection("snapshots").document()
        ref.set(doc)

        return Response(
            {"ok": True, "id": ref.id},
            status=status.HTTP_201_CREATED,
        )


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

        return Response({"data": out}, status=status.HTTP_200_OK)
    
class BestPriceView(APIView):
    def post(self, request):
        event = request.data.get("event")
        market_key = request.data.get("marketKey")
        stake = float(request.data.get("stake", 100))

        if not event or not market_key:
            return Response(
                {"error": "event and marketKey required"},
                status=status.HTTP_400_BAD_REQUEST,
            )

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
                    if "point" in outcome:
                        row["point"] = outcome.get("point")
                    comparisons.append(row)

                    if best is None or row["profit_on_stake"] > best["profit_on_stake"]:
                        best = row

        if best is None:
            return Response(
                {"error": "No matching market found in event"},
                status=status.HTTP_400_BAD_REQUEST,
            )

        # Compute deltas from best
        for row in comparisons:
            row["delta_from_best"] = round(best["profit_on_stake"] - row["profit_on_stake"], 2)

        structured_best_lines = build_best_lines_from_event_payload(event, market_key)

        return Response(
            {
                "best": best,
                "comparisons": comparisons,
                "structured_best_lines": structured_best_lines,
            },
            status=status.HTTP_200_OK,
        )