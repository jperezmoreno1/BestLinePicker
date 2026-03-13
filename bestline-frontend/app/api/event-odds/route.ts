import { NextResponse } from "next/server";

export async function GET(req: Request) {
  const baseUrl = process.env.DJANGO_BASE_URL;
  if (!baseUrl) {
    return NextResponse.json({ error: "DJANGO_BASE_URL not set" }, { status: 500 });
  }

  const url = new URL(req.url);
  const sport = url.searchParams.get("sport") ?? "nfl";
  const eventId = url.searchParams.get("eventId");
  const markets = url.searchParams.get("markets");
  const regions = url.searchParams.get("regions") ?? "us";

  if (!eventId) {
    return NextResponse.json({ error: "eventId is required" }, { status: 400 });
  }
  if (!markets) {
    return NextResponse.json({ error: "markets is required" }, { status: 400 });
  }

  const djangoUrl = `${baseUrl}/api/event-odds?sport=${encodeURIComponent(sport)}&eventId=${encodeURIComponent(
    eventId
  )}&markets=${encodeURIComponent(markets)}&regions=${encodeURIComponent(regions)}`;

  const r = await fetch(djangoUrl, { cache: "no-store" });
  const data = await r.json();

  return NextResponse.json(data, { status: r.status });
}