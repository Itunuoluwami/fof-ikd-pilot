// Admin-managed schedules store (mock, localStorage-backed).
// Admin creates a schedule (daily / weekly / monthly), assigns to one or more supports,
// and the store expands them into SupportTask-shaped entries for the support views.
import { useSyncExternalStore } from "react";
import type { SupportTask, TaskPriority } from "./support-data";

export type ScheduleFrequency = "DAILY" | "WEEKLY" | "MONTHLY";

export interface AdminSchedule {
  id: string;
  title: string;
  time: string;            // "HH:MM"
  location: string;
  priority: TaskPriority;
  frequency: ScheduleFrequency;
  startDate: string;       // ISO date (YYYY-MM-DD)
  endDate: string;         // ISO date (YYYY-MM-DD)
  supportIds: string[];    // assigned supports
  createdAt: string;
  createdBy?: string;
}

const KEY = "fof.admin.schedules.v1";

function read(): AdminSchedule[] {
  if (typeof window === "undefined") return [];
  try { const v = localStorage.getItem(KEY); return v ? JSON.parse(v) : []; } catch { return []; }
}
function write(list: AdminSchedule[]) {
  try { localStorage.setItem(KEY, JSON.stringify(list)); } catch { /* ignore */ }
}

let schedules: AdminSchedule[] = read();
const listeners = new Set<() => void>();
const emit = () => listeners.forEach(l => l());

if (typeof window !== "undefined") {
  window.addEventListener("storage", (e) => {
    if (e.key === KEY) { schedules = read(); emit(); }
  });
}

export function createAdminSchedule(
  input: Omit<AdminSchedule, "id" | "createdAt">,
): AdminSchedule {
  const item: AdminSchedule = {
    ...input,
    id: `sch-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`,
    createdAt: new Date().toISOString(),
  };
  schedules = [item, ...schedules];
  write(schedules);
  emit();
  return item;
}

export function deleteAdminSchedule(id: string) {
  schedules = schedules.filter(s => s.id !== id);
  write(schedules);
  emit();
}

export function getAdminSchedules(): AdminSchedule[] {
  return schedules;
}

export function useAdminSchedules(): AdminSchedule[] {
  return useSyncExternalStore(
    (cb) => { listeners.add(cb); return () => listeners.delete(cb); },
    () => schedules,
    () => [],
  );
}

// Default end-date suggestions per frequency
export function suggestEndDate(start: string, freq: ScheduleFrequency): string {
  const d = new Date(start + "T00:00:00");
  if (freq === "DAILY") d.setDate(d.getDate() + 13);          // 2 weeks
  else if (freq === "WEEKLY") d.setDate(d.getDate() + 7 * 7);  // 8 occurrences
  else d.setMonth(d.getMonth() + 5);                            // 6 occurrences
  return d.toISOString().slice(0, 10);
}

// Expand schedules into SupportTask-shaped tasks for a given support id.
export function expandSchedulesForSupport(supportId: string): SupportTask[] {
  const out: SupportTask[] = [];
  for (const s of schedules) {
    if (!s.supportIds.includes(supportId)) continue;
    const start = new Date(s.startDate + "T00:00:00");
    const end = new Date(s.endDate + "T00:00:00");
    if (isNaN(start.getTime()) || isNaN(end.getTime()) || end < start) continue;

    const cursor = new Date(start);
    let safety = 0;
    while (cursor <= end && safety++ < 400) {
      const dateStr = cursor.toISOString().slice(0, 10);
      out.push({
        id: `${s.id}::${supportId}::${dateStr}`,
        supportId,
        title: s.title,
        time: s.time,
        location: s.location,
        priority: s.priority,
        status: "NOT_STARTED",
        date: dateStr,
      });
      if (s.frequency === "DAILY") cursor.setDate(cursor.getDate() + 1);
      else if (s.frequency === "WEEKLY") cursor.setDate(cursor.getDate() + 7);
      else cursor.setMonth(cursor.getMonth() + 1);
    }
  }
  return out;
}
