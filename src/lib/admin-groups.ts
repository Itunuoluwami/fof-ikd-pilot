// Admin-managed groups store. Seeds from mock-data.groups and persists overrides to localStorage.
import { useSyncExternalStore } from "react";
import { groups as seedGroups, type Group } from "./mock-data";

const KEY = "fof.admin.groups";

function load(): Group[] {
  if (typeof window === "undefined") return seedGroups;
  try {
    const raw = localStorage.getItem(KEY);
    if (!raw) return seedGroups;
    const parsed = JSON.parse(raw) as Group[];
    return Array.isArray(parsed) ? parsed : seedGroups;
  } catch {
    return seedGroups;
  }
}

let state: Group[] = load();
const listeners = new Set<() => void>();

function persist() {
  try { localStorage.setItem(KEY, JSON.stringify(state)); } catch { /* ignore */ }
  listeners.forEach(l => l());
}

export function useAdminGroups() {
  return useSyncExternalStore(
    (cb) => { listeners.add(cb); return () => listeners.delete(cb); },
    () => state,
    () => state,
  );
}

export function createGroup(input: { name: string; cohortId: string; supportIds: string[]; participantIds: string[] }) {
  const g: Group = {
    id: `g-${Date.now()}`,
    name: input.name.trim(),
    cohortId: input.cohortId,
    supportIds: [...input.supportIds],
    participantIds: [...input.participantIds],
  };
  state = [...state, g];
  persist();
  return g;
}

export function deleteGroup(id: string) {
  state = state.filter(g => g.id !== id);
  persist();
}

export function updateGroupAssignments(id: string, patch: { supportIds?: string[]; participantIds?: string[]; name?: string }) {
  state = state.map(g => g.id === id ? { ...g, ...patch } : g);
  persist();
}

export function resetAdminGroups() {
  state = seedGroups;
  persist();
}
