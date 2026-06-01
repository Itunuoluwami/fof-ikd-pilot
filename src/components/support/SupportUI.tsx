import { Avatar, StatusBadge } from "@/components/Primitives";
import { Link } from "@tanstack/react-router";
import { Bell, WifiOff, Megaphone, X } from "lucide-react";
import { useCurrentUser } from "@/lib/auth-store";
import { useEffect, useRef, useState } from "react";
import { announcements } from "@/lib/mock-data";

export function SupportHeader({ subtitle }: { subtitle?: string }) {
  const user = useCurrentUser();
  const name = user?.name ?? "Friend";
  const first = name.split(" ")[0];
  const hour = new Date().getHours();
  const greet = hour < 12 ? "Good morning" : hour < 17 ? "Good afternoon" : "Good evening";
  const today = new Date().toLocaleDateString(undefined, { weekday: "long", month: "long", day: "numeric" });

  const [open, setOpen] = useState(false);
  const [readIds, setReadIds] = useState<string[]>(() => {
    if (typeof window === "undefined") return [];
    try { return JSON.parse(localStorage.getItem("fof.support.notifs.read") ?? "[]"); } catch { return []; }
  });
  const panelRef = useRef<HTMLDivElement>(null);

  const items = announcements.slice(0, 8);
  const unread = items.filter(a => !readIds.includes(a.id)).length;

  useEffect(() => {
    if (!open) return;
    const onDown = (e: MouseEvent) => {
      if (panelRef.current && !panelRef.current.contains(e.target as Node)) setOpen(false);
    };
    const onKey = (e: KeyboardEvent) => { if (e.key === "Escape") setOpen(false); };
    document.addEventListener("mousedown", onDown);
    document.addEventListener("keydown", onKey);
    return () => { document.removeEventListener("mousedown", onDown); document.removeEventListener("keydown", onKey); };
  }, [open]);

  function markAllRead() {
    const ids = items.map(a => a.id);
    setReadIds(ids);
    try { localStorage.setItem("fof.support.notifs.read", JSON.stringify(ids)); } catch { /* ignore */ }
  }

  function handleToggle() {
    setOpen(v => {
      const next = !v;
      if (next && unread > 0) setTimeout(markAllRead, 1200);
      return next;
    });
  }

  return (
    <header className="px-5 pt-6 pb-4">
      <div className="flex items-center justify-between gap-3">
        <div className="min-w-0">
          <p className="text-lg sm:text-xl font-bold leading-tight truncate">{greet}, {first} <span aria-hidden>👋</span></p>
          <p className="text-sm text-muted-foreground mt-0.5 truncate">{subtitle ?? "Prayer Support — Group Alpha"}</p>
          <p className="text-xs text-muted-foreground mt-0.5">{today}</p>
        </div>
        <div className="flex items-center gap-2 shrink-0">
          <div className="relative" ref={panelRef}>
            <button
              onClick={handleToggle}
              aria-label={`Notifications${unread > 0 ? `, ${unread} unread` : ""}`}
              aria-expanded={open}
              className="relative w-10 h-10 rounded-full bg-card border border-border grid place-items-center active:scale-95 hover:bg-muted transition"
            >
              <Bell className="w-5 h-5" />
              {unread > 0 && (
                <span className="absolute -top-0.5 -right-0.5 min-w-[18px] h-[18px] px-1 rounded-full bg-destructive text-destructive-foreground text-[10px] font-bold grid place-items-center">
                  {unread > 9 ? "9+" : unread}
                </span>
              )}
            </button>

            {open && (
              <div
                role="dialog"
                aria-label="Notifications"
                className="absolute right-0 mt-2 w-[min(88vw,360px)] max-h-[70vh] bg-card border border-border shadow-lg rounded-2xl z-50 flex flex-col overflow-hidden"
              >
                <div className="flex items-center justify-between px-4 py-3 border-b border-border">
                  <p className="font-semibold text-sm">Notifications</p>
                  <button onClick={() => setOpen(false)} aria-label="Close" className="w-7 h-7 grid place-items-center rounded-lg hover:bg-muted">
                    <X className="w-4 h-4" />
                  </button>
                </div>
                <ul className="overflow-y-auto divide-y divide-border">
                  {items.length === 0 && (
                    <li className="p-6 text-center text-sm text-muted-foreground">You're all caught up.</li>
                  )}
                  {items.map(a => {
                    const isRead = readIds.includes(a.id);
                    return (
                      <li key={a.id} className={`p-3 flex gap-3 ${!isRead ? "bg-primary-light/40" : ""}`}>
                        <div className={`w-8 h-8 rounded-lg grid place-items-center shrink-0 ${a.urgent ? "bg-destructive/15 text-destructive" : "bg-primary-light text-primary"}`}>
                          <Megaphone className="w-4 h-4" />
                        </div>
                        <div className="min-w-0 flex-1">
                          <div className="flex items-center gap-2 flex-wrap">
                            {a.urgent && <span className="text-[10px] font-bold px-1.5 py-0.5 rounded-full bg-destructive text-destructive-foreground">URGENT</span>}
                            <p className="text-sm font-semibold leading-snug">{a.title}</p>
                          </div>
                          <p className="text-xs text-muted-foreground line-clamp-2 mt-0.5">{a.body}</p>
                          <p className="text-[11px] text-muted-foreground mt-1">{new Date(a.createdAt).toLocaleDateString(undefined, { month: "short", day: "numeric" })}</p>
                        </div>
                        {!isRead && <span className="w-2 h-2 rounded-full bg-primary mt-2 shrink-0" />}
                      </li>
                    );
                  })}
                </ul>
                {items.length > 0 && unread > 0 && (
                  <button onClick={markAllRead} className="px-4 py-2.5 border-t border-border text-xs font-semibold text-primary hover:bg-muted text-center">
                    Mark all as read
                  </button>
                )}
              </div>
            )}
          </div>
          {user && <Avatar name={user.name} color={user.avatarColor} size={40} />}
        </div>
      </div>
    </header>
  );
}

export function SectionTitle({ title, action }: { title: string; action?: React.ReactNode }) {
  return (
    <div className="px-5 mt-6 mb-3 flex items-center justify-between">
      <h2 className="text-base font-bold">{title}</h2>
      {action}
    </div>
  );
}

export function OfflineBanner() {
  const [online, setOnline] = useState(true);
  useEffect(() => {
    const upd = () => setOnline(navigator.onLine);
    upd();
    window.addEventListener("online", upd);
    window.addEventListener("offline", upd);
    return () => { window.removeEventListener("online", upd); window.removeEventListener("offline", upd); };
  }, []);
  if (online) return null;
  return (
    <div className="mx-5 mt-3 flex items-center gap-2 px-3 py-2 rounded-xl bg-[oklch(0.96_0.06_75)] text-[oklch(0.4_0.15_50)] text-xs">
      <WifiOff className="w-4 h-4" /> You're offline. Showing last synced data.
    </div>
  );
}

export { Avatar, StatusBadge };
