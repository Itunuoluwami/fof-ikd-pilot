// Mock auth store. Replace with Supabase auth when backend is wired.
import { useSyncExternalStore } from "react";
import { users, type User } from "./mock-data";

const KEY = "fof.session.v1";

// Mock credentials issued by admin. In production these come from Supabase.
export const mockCredentials: Record<string, { password: string; userId: string }> = {
  "daniel.okeke": { password: "support123", userId: "u-3" },
  "esther.bello": { password: "support123", userId: "u-4" },
  "samuel.ajayi": { password: "support123", userId: "u-5" },
  "stas": { password: "admin123", userId: "u-1" },
};

export interface Session { userId: string; loggedInAt: string }

function read(): Session | null {
  if (typeof window === "undefined") return null;
  try { const v = localStorage.getItem(KEY); return v ? JSON.parse(v) : null; } catch { return null; }
}
let session: Session | null = read();
const listeners = new Set<() => void>();
const emit = () => listeners.forEach(l => l());

export function login(username: string, password: string): { ok: true; user: User } | { ok: false; error: string } {
  const c = mockCredentials[username.trim().toLowerCase()];
  if (!c || c.password !== password) return { ok: false, error: "Invalid username or password" };
  const user = users.find(u => u.id === c.userId);
  if (!user) return { ok: false, error: "Account not found" };
  session = { userId: user.id, loggedInAt: new Date().toISOString() };
  localStorage.setItem(KEY, JSON.stringify(session));
  emit();
  return { ok: true, user };
}

export function logout() {
  session = null;
  localStorage.removeItem(KEY);
  emit();
}

export function useSession(): Session | null {
  return useSyncExternalStore(
    (cb) => { listeners.add(cb); return () => listeners.delete(cb); },
    () => session,
    () => null,
  );
}

export function useCurrentUser(): User | null {
  const s = useSession();
  if (!s) return null;
  return users.find(u => u.id === s.userId) ?? null;
}
