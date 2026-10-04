import {
  addDoc,
  collection,
  deleteDoc,
  doc,
  getDoc,
  getDocs,
  orderBy,
  query,
  serverTimestamp,
  Timestamp,
  updateDoc,
} from "firebase/firestore";
import { db } from "@/lib/firebase";
import type { TrackLinePayload, TrackedLine } from "@/types/tracking";
import { impliedProb, payoutForStake, profitForStake } from "@/utils/odds";

function trackedLinesCollection(uid: string) {
  return collection(db, "users", uid, "trackedLines");
}

function toIsoString(value: unknown): string {
  if (value instanceof Timestamp) return value.toDate().toISOString();
  return new Date().toISOString();
}

function toUnixMs(value: unknown): number {
  if (value instanceof Timestamp) return value.toMillis();
  return Date.now();
}

function computeDerivedFields(americanOdds: number, stake: number) {
  return {
    implied_probability: Number((impliedProb(americanOdds) * 100).toFixed(2)),
    payout: Number(payoutForStake(americanOdds, stake).toFixed(2)),
    profit: Number(profitForStake(americanOdds, stake).toFixed(2)),
  };
}

function toTrackedLine(id: string, data: Record<string, unknown>): TrackedLine {
  return {
    id,
    game_id: (data.game_id as string | null) ?? null,
    event_id: (data.event_id as string | null) ?? null,
    matchup: data.matchup as string,
    league: data.league as string,
    market: data.market as string,
    market_key: (data.market_key as TrackedLine["market_key"]) ?? null,
    selection: data.selection as string,
    selection_name: (data.selection_name as string | null) ?? null,
    sportsbook: data.sportsbook as string,
    sportsbook_key: (data.sportsbook_key as string | null) ?? null,
    sportsbook_title: (data.sportsbook_title as string | null) ?? null,
    odds: data.odds as number,
    tracked_price: (data.tracked_price as number | null) ?? null,
    point: (data.point as number | null) ?? null,
    tracked_point: (data.tracked_point as number | null) ?? null,
    stake: data.stake as number,
    implied_probability: data.implied_probability as number,
    payout: data.payout as number,
    profit: data.profit as number,
    status: (data.status as TrackedLine["status"]) ?? "watching",
    created_at: toIsoString(data.created_at),
    created_at_unix_ms: toUnixMs(data.created_at),
    updated_at: toIsoString(data.updated_at ?? data.created_at),
    updated_at_unix_ms: toUnixMs(data.updated_at ?? data.created_at),
  };
}

export async function getTrackedLines(uid: string): Promise<TrackedLine[]> {
  const q = query(trackedLinesCollection(uid), orderBy("created_at", "desc"));
  const results = await getDocs(q);
  return results.docs.map((docSnap) => toTrackedLine(docSnap.id, docSnap.data()));
}

export async function trackLine(
  uid: string,
  payload: TrackLinePayload
): Promise<TrackedLine> {
  const price = payload.tracked_price ?? payload.odds;
  const derived = computeDerivedFields(price, payload.stake);

  const docRef = await addDoc(trackedLinesCollection(uid), {
    game_id: payload.game_id ?? null,
    event_id: payload.event_id ?? payload.game_id ?? null,
    matchup: payload.matchup,
    league: payload.league,
    market: payload.market,
    market_key: payload.market_key ?? null,
    selection: payload.selection,
    selection_name: payload.selection_name ?? payload.selection,
    sportsbook: payload.sportsbook,
    sportsbook_key: payload.sportsbook_key ?? null,
    sportsbook_title: payload.sportsbook_title ?? payload.sportsbook,
    odds: payload.odds,
    tracked_price: price,
    point: payload.point ?? null,
    tracked_point: payload.tracked_point ?? payload.point ?? null,
    stake: payload.stake,
    ...derived,
    status: payload.status ?? "watching",
    created_at: serverTimestamp(),
    updated_at: serverTimestamp(),
  });

  const created = await getDoc(docRef);
  return toTrackedLine(docRef.id, created.data() ?? {});
}

export async function removeTrackedLine(
  uid: string,
  trackedLineId: string
): Promise<void> {
  await deleteDoc(doc(db, "users", uid, "trackedLines", trackedLineId));
}

export async function updateTrackedLineStake(
  uid: string,
  trackedLineId: string,
  stake: number
): Promise<TrackedLine> {
  const ref = doc(db, "users", uid, "trackedLines", trackedLineId);
  const existing = await getDoc(ref);

  if (!existing.exists()) {
    throw new Error("Tracked line not found.");
  }

  const data = existing.data() as Record<string, unknown>;
  const price = (data.tracked_price as number | null) ?? (data.odds as number);
  const derived = computeDerivedFields(price, stake);

  await updateDoc(ref, {
    stake,
    ...derived,
    updated_at: serverTimestamp(),
  });

  const updated = await getDoc(ref);
  return toTrackedLine(ref.id, updated.data() ?? {});
}
