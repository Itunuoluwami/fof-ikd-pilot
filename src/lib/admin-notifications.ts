// Admin notifications store (mock). Persists to localStorage so admin sees
// notifications when supports mark tasks done. Replace with realtime when backend is wired.
import { useSyncExternalStore } from "react";

export interface AdminNotification {
  id: string;
  type: "TASK_DONE" | "TASK_REOPENED";
  taskId: string;
  taskTitle: string;
  supportId: string;
  supportName: string;
  createdAt: string;
  read: boolean;
}

const KEY = "fof.admin.notifications.v1";

function read(): AdminNotification[] {
  if (typeof window === "undefined") return [];
  try { const v = localStorage.getItem(KEY); return v ? JSON.parse(v) : []; } catch { return []; }
}
function write(list: AdminNotification[]) {
  try { localStorage.setItem(KEY, JSON.stringify(list)); } catch { /* ignore */ }
}

let notifications: AdminNotification[] = read();
const listeners = new Set<() => void>();
const emit = () => listeners.forEach(l => l());

// Cross-tab sync
if (typeof window !== "undefined") {
  window.addEventListener("storage", (e) => {
    if (e.key === KEY) { notifications = read(); emit(); }
  });
}

export function pushAdminNotification(n: Omit<AdminNotification, "id" | "createdAt" | "read">) {
  const item: AdminNotification = {
    ...n,
    id: `notif-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`,
    createdAt: new Date().toISOString(),
    read: false,
  };
  notifications = [item, ...notifications].slice(0, 100);
  write(notifications);
  emit();
}

export function markAllRead() {
  notifications = notifications.map(n => ({ ...n, read: true }));
  write(notifications);
  emit();
}

export function clearAdminNotifications() {
  notifications = [];
  write(notifications);
  emit();
}

export function useAdminNotifications(): AdminNotification[] {
  return useSyncExternalStore(
    (cb) => { listeners.add(cb); return () => listeners.delete(cb); },
    () => notifications,
    () => [],
  );
}
