import { NextRequest, NextResponse } from "next/server";

const DJANGO_API_BASE =
  process.env.DJANGO_API_BASE_URL || "http://127.0.0.1:8000/api";

export async function DELETE(
  _req: NextRequest,
  context: { params: Promise<{ trackingId: string }> }
) {
  try {
    const { trackingId } = await context.params;

    const res = await fetch(`${DJANGO_API_BASE}/tracking/${trackingId}`, {
      method: "DELETE",
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
            : "Failed to delete tracked line",
      },
      { status: 500 }
    );
  }
}