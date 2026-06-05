// Admin-managed users store. Seeds from mock-data.users and persists overrides to localStorage.
import { useSyncExternalStore } from "react";
import { users as seedUsers, type User, type UserRole, type UserStatus } from "./mock-data";

const KEY = "fof.admin.users";

const colors = ["#FF914D", "#E5822D", "#3B82F6", "#10B981", "#EF4444", "#8B5CF6", "#F59E0B", "#06B6D4", "#1a1a2e"];

function load(): User[] {
  if (typeof window === "undefined") return seedUsers;
  try {
    const raw = localStorage.getItem(KEY);
    if (!raw) return seedUsers;
    const parsed = JSON.parse(raw) as User[];
    return Array.isArray(parsed) ? parsed : seedUsers;
  } catch {
    return seedUsers;
  }
}

let state: User[] = load();
const listeners = new Set<() => void>();

function persist() {
  try { localStorage.setItem(KEY, JSON.stringify(state)); } catch { /* ignore */ }
  listeners.forEach(l => l());
}

export function useAdminUsers() {
  return useSyncExternalStore(
    (cb) => { listeners.add(cb); return () => listeners.delete(cb); },
    () => state,
    () => state,
  );
}

export function createUser(input: {
  name: string;
  role: UserRole;
  status: UserStatus;
  email?: string;
  phone?: string;
  cohortId?: string;
  groupId?: string;
}): User {
  const u: User = {
    id: `u-${Date.now()}`,
    name: input.name.trim(),
    role: input.role,
    status: input.status,
    email: input.email?.trim() || undefined,
    phone: input.phone?.trim() || undefined,
    cohortId: input.cohortId || undefined,
    groupId: input.groupId || undefined,
    avatarColor: colors[Math.floor(Math.random() * colors.length)],
  };
  state = [u, ...state];
  persist();
  return u;
}

export function deleteUser(id: string) {
  state = state.filter(u => u.id !== id);
  persist();
}
