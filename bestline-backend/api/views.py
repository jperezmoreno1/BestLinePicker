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

from .services.snapshot_service import (
    create_snapshot,
    get_snapshot_detail,
    list_snapshots
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

class EventOddsView(APIView): # Do I still need this?
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
        try:
            db = get_db()
            saved_snapshot = create_snapshot(db, request.data)

            return Response(
                {
                    "ok": True,
                    "data": saved_snapshot,
                },
                status=status.HTTP_201_CREATED,
            )
        
        except ValueError as exc:
            return Response(
                {"error": str(exc)},
                status=status.HTTP_400_BAD_REQUEST
            )
        
        except RuntimeError as exc:
            return Response(
                {"error": str(exc)},
                status=status.HTTP_500_INTERNAL_SERVER_ERROR,
            )
        
        except Exception as exc:
            return Response(
                {"error": f"Failed to save snapshot: {str(exc)}"},
                status=status.HTTP_500_INTERNAL_SERVER_ERROR,
            )


class SnapshotListView(APIView):
    def get(self, request):
        try:
            sport = request.query_params.get("sport")
            event_id = request.query_params.get("event_id")
            market_key = request.query_params.get("market_key")
            limit = request.query_params.get("limit", 20)

            db = get_db()
            data = list_snapshots(
                db=db,
                sport=sport,
                event_id=event_id,
                market_key=market_key,
                limit=limit
            )

            return Response({"data": data}, status=status.HTTP_200_OK)
        
        except RuntimeError as exc:
            return Response(
                {"error": str(exc)},
                status=status.HTTP_500_INTERNAL_SERVER_ERROR
            )
        
        except Exception as exc:
            return Response(
                {"error": f"Failed to load snapshots: {str(exc)}"},
                status=status.HTTP_500_INTERNAL_SERVER_ERROR
            )
        
class SnapshotDetailView(APIView):
    def get(self, request, snapshot_id):
        try:
            db = get_db()
            data = get_snapshot_detail(db, snapshot_id)

            if data is None:
                return Response(
                    {"error": "Snapshot not found"},
                    status=status.HTTP_404_NOT_FOUND,
                )
            return Response({"data": data}, status=status.HTTP_200_OK)
        
        except RuntimeError as exc:
            return Response(
                {"error": str(exc)},
                status=status.HTTP_500_INTERNAL_SERVER_ERROR,
            )
        
        except Exception as exc:
            return Response(
                {"error": f"Failed to load snapshot detail: {str(exc)}"},
                status=status.HTTP_500_INTERNAL_SERVER_ERROR,
            )
    
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