import { NextResponse } from "next/server";

export async function GET(req: Request) {
  const baseUrl = process.env.DJANGO_BASE_URL;
  if (!baseUrl) {
    return NextResponse.json({ error: "DJANGO_BASE_URL not set" }, { status: 500 });
  }

  const url = new URL(req.url);
  const searchParams = url.searchParams;

  const djangoUrl = new URL(`${baseUrl}/api/odds`);

  const allowedParams = [
    "sport",
    "market",
    "markets",
    "regions",
    "bookmakers",
    "eventId",
    "event_id",
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

  if (!djangoUrl.searchParams.has("market") && !djangoUrl.searchParams.has("markets")) {
    djangoUrl.searchParams.set("market", "h2h");
  }

  if (!djangoUrl.searchParams.has("regions")) {
    djangoUrl.searchParams.set("regions", "us");
  }

  const response = await fetch(djangoUrl.toString(), { cache: "no-store" });
  const data = await response.json();

  return NextResponse.json(data, { status: response.status });
}