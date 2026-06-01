// Admin-managed announcements store. Seeds from mock-data and persists to localStorage.
import { useSyncExternalStore } from "react";
import { announcements as seed, type Announcement } from "./mock-data";

const KEY = "fof.admin.announcements";

function load(): Announcement[] {
  if (typeof window === "undefined") return seed;
  try {
    const raw = localStorage.getItem(KEY);
    if (!raw) return seed;
    const parsed = JSON.parse(raw) as Announcement[];
    return Array.isArray(parsed) ? parsed : seed;
  } catch {
    return seed;
  }
}

let state: Announcement[] = load();
const listeners = new Set<() => void>();

function persist() {
  try { localStorage.setItem(KEY, JSON.stringify(state)); } catch { /* ignore */ }
  listeners.forEach(l => l());
}

export function useAdminAnnouncements() {
  return useSyncExternalStore(
    (cb) => { listeners.add(cb); return () => listeners.delete(cb); },
    () => state,
    () => state,
  );
}

export function createAnnouncement(input: {
  title: string;
  body: string;
  pinned: boolean;
  urgent: boolean;
  expiresAt?: string;
}): Announcement {
  const a: Announcement = {
    id: `an-${Date.now()}`,
    title: input.title.trim(),
    body: input.body.trim(),
    pinned: input.pinned,
    urgent: input.urgent,
    createdAt: new Date().toISOString(),
    expiresAt: input.expiresAt || undefined,
  };
  state = [a, ...state];
  persist();
  return a;
}

export function deleteAnnouncement(id: string) {
  state = state.filter(a => a.id !== id);
  persist();
}
