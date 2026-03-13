import { NextResponse } from "next/server";

export async function GET(req: Request) {
  const baseUrl = process.env.DJANGO_BASE_URL;
  if (!baseUrl) {
    return NextResponse.json({ error: "DJANGO_BASE_URL not set" }, { status: 500 });
  }

  const url = new URL(req.url);
  const sport = url.searchParams.get("sport") ?? "nfl";
  const markets = url.searchParams.get("markets") ?? "h2h,spreads,totals";
  const regions = url.searchParams.get("regions") ?? "us";

  const djangoUrl = `${baseUrl}/api/odds?sport=${encodeURIComponent(sport)}&markets=${encodeURIComponent(
    markets
  )}&regions=${encodeURIComponent(regions)}`;

  const r = await fetch(djangoUrl, { cache: "no-store" });
  const data = await r.json();

  return NextResponse.json(data, { status: r.status });
}