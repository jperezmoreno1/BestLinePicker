import { NextResponse } from "next/server";

const DJANGO_API_BASE =
  process.env.DJANGO_API_BASE_URL || "http://127.0.0.1:8000/api";

export async function GET(req: Request) {
  try {
    const url = new URL(req.url);
    const searchParams = url.searchParams;

    const eventId = searchParams.get("eventId") ?? searchParams.get("event_id");

    if (!eventId) {
      return NextResponse.json(
        { error: "eventId is required" },
        { status: 400 }
      );
    }

    const djangoUrl = new URL(`${DJANGO_API_BASE}/event-odds`);

    const allowedParams = [
      "sport",
      "eventId",
      "event_id",
      "market",
      "markets",
      "regions",
      "bookmakers",
      "oddsFormat",
      "odds_format",
      "dateFormat",
      "date_format",
      "booksMode",
      "books_mode",
      "eventStatus",
      "event_status",
      "sortBy",
      "sort_by",
      "sortOrder",
      "sort_order",
    ];

    for (const key of allowedParams) {
      const value = searchParams.get(key);

      if (value !== null && value !== "") {
        djangoUrl.searchParams.set(key, value);
      }
    }

    if (!djangoUrl.searchParams.has("sport")) {
      djangoUrl.searchParams.set("sport", "nfl");
    }

    const response = await fetch(djangoUrl.toString(), {
      cache: "no-store",
    });

    const data = await response.json();

    return NextResponse.json(data, { status: response.status });
  } catch (error) {
    return NextResponse.json(
      {
        error:
          error instanceof Error ? error.message : "Failed to load event odds",
      },
      { status: 500 }
    );
  }
}