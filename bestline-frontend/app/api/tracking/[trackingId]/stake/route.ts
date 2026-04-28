import { NextRequest, NextResponse } from "next/server";

const DJANGO_API_BASE =
  process.env.DJANGO_API_BASE_URL || "http://127.0.0.1:8000/api";

export async function PATCH(
  req: NextRequest,
  context: { params: Promise<{ trackingId: string }> }
) {
  try {
    const { trackingId } = await context.params;
    const body = await req.json();

    const res = await fetch(`${DJANGO_API_BASE}/tracking/${trackingId}/stake`, {
      method: "PATCH",
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
            : "Failed to update tracked line stake",
      },
      { status: 500 }
    );
  }
}