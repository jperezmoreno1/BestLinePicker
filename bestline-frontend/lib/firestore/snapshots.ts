import {
  addDoc,
  collection,
  deleteDoc,
  doc,
  getDoc,
  getDocs,
  limit as limitTo,
  orderBy,
  query,
  serverTimestamp,
  Timestamp,
} from "firebase/firestore";
import { db } from "@/lib/firebase";
import type { Snapshot } from "@/types/odds";

export type NewSnapshotInput = Omit<Snapshot, "id" | "created_at">;

const DEFAULT_LIMIT = 50;

function snapshotsCollection(uid: string) {
  return collection(db, "users", uid, "snapshots");
}

function toIsoString(value: unknown): string {
  if (value instanceof Timestamp) return value.toDate().toISOString();
  return new Date().toISOString();
}

function toSnapshot(id: string, data: Record<string, unknown>): Snapshot {
  return {
    id,
    sport: data.sport as string,
    event_id: data.event_id as string,
    matchup_label: data.matchup_label as string,
    market_key: data.market_key as Snapshot["market_key"],
    market_label: data.market_label as string,
    selection_key: data.selection_key as string,
    selection_label: data.selection_label as string,
    best_bookmaker_title: (data.best_bookmaker_title as string | null) ?? null,
    best_price: (data.best_price as number | null) ?? null,
    created_at: toIsoString(data.created_at),
  };
}

export async function saveSnapshot(
  uid: string,
  input: NewSnapshotInput
): Promise<Snapshot> {
  const docRef = await addDoc(snapshotsCollection(uid), {
    ...input,
    // serverTimestamp() is resolved by Firestore's backend clock, not the
    // browser's — a user with a wrong or manipulated local clock can't
    // corrupt "newest first" ordering across their own snapshots.
    created_at: serverTimestamp(),
  });

  const created = await getDoc(docRef);
  return toSnapshot(docRef.id, created.data() ?? {});
}

export async function getSnapshots(
  uid: string,
  options: { limitCount?: number } = {}
): Promise<Snapshot[]> {
  const q = query(
    snapshotsCollection(uid),
    orderBy("created_at", "desc"),
    limitTo(options.limitCount ?? DEFAULT_LIMIT)
  );

  const results = await getDocs(q);
  return results.docs.map((docSnap) => toSnapshot(docSnap.id, docSnap.data()));
}

export async function deleteSnapshot(uid: string, snapshotId: string): Promise<void> {
  await deleteDoc(doc(db, "users", uid, "snapshots", snapshotId));
}
