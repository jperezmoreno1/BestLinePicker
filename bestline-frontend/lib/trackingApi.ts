import type { TrackLinePayload, TrackedLine } from "@/types/tracking";

type ApiEnvelope<T> = {
  ok?: boolean;
  data?: T;
  error?: string;
  message?: string;
};

function getErrorMessage(json: ApiEnvelope<unknown>, fallback: string) {
  return json.error || json.message || fallback;
}

export async function getTrackedLines(): Promise<TrackedLine[]> {
  const res = await fetch("/api/tracking", {
    method: "GET",
    cache: "no-store",
  });

  const json: ApiEnvelope<TrackedLine[]> = await res.json();

  if (!res.ok) {
    throw new Error(getErrorMessage(json, "Failed to load tracked lines."));
  }

  return json.data || [];
}

export async function saveTrackedLine(
  payload: TrackLinePayload
): Promise<TrackedLine> {
  const res = await fetch("/api/tracking", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(payload),
  });

  const json: ApiEnvelope<TrackedLine> = await res.json();

  if (!res.ok || !json.data) {
    throw new Error(getErrorMessage(json, "Failed to save tracked line."));
  }

  return json.data;
}

export async function deleteTrackedLine(id: string): Promise<void> {
  const res = await fetch(`/api/tracking/${id}`, {
    method: "DELETE",
  });

  const json: ApiEnvelope<unknown> = await res.json();

  if (!res.ok) {
    throw new Error(getErrorMessage(json, "Failed to delete tracked line."));
  }
}

export async function updateTrackedLineStake(
  id: string,
  stake: number
): Promise<TrackedLine> {
  const res = await fetch(`/api/tracking/${id}/stake`, {
    method: "PATCH",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ stake }),
  });

  const json: ApiEnvelope<TrackedLine> = await res.json();

  if (!res.ok || !json.data) {
    throw new Error(getErrorMessage(json, "Failed to update stake."));
  }

  return json.data;
}