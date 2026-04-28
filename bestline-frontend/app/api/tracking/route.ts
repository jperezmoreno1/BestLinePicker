import { NextRequest, NextResponse } from "next/server";

const DJANGO_API_BASE =
  process.env.DJANGO_API_BASE_URL || "http://127.0.0.1:8000/api";

export async function GET() {
  try {
    const res = await fetch(`${DJANGO_API_BASE}/tracking`, {
      method: "GET",
      cache: "no-store",
      headers: {
        "Content-Type": "application/json",
      },
    });

    const data = await res.json();

    return NextResponse.json(data, { status: res.status });
  } catch (error) {
    return NextResponse.json(
      {
        error:
          error instanceof Error
            ? error.message
            : "Failed to load tracked lines",
      },
      { status: 500 }
    );
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();

    const res = await fetch(`${DJANGO_API_BASE}/tracking`, {
      method: "POST",
      cache: "no-store",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(body),
    });

    const data = await res.json();

    return NextResponse.json(data, { status: res.status });
  } catch (error) {
    return NextResponse.json(
      {
        error:
          error instanceof Error
            ? error.message
            : "Failed to save tracked line",
      },
      { status: 500 }
    );
  }
}