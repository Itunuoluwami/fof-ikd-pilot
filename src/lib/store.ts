// Tiny global store for the cohort selector. Swap for Zustand or context when needed.
import { useSyncExternalStore } from "react";
import { cohorts } from "./mock-data";

let selectedCohortId: string = cohorts[0].id;
const listeners = new Set<() => void>();

export function setSelectedCohortId(id: string) {
  selectedCohortId = id;
  listeners.forEach(l => l());
}

export function useSelectedCohortId() {
  return useSyncExternalStore(
    (cb) => { listeners.add(cb); return () => listeners.delete(cb); },
    () => selectedCohortId,
    () => selectedCohortId,
  );
}
