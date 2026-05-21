import { Avatar, StatusBadge } from "@/components/Primitives";
import { Link } from "@tanstack/react-router";
import { Bell, Wifi, WifiOff } from "lucide-react";
import { useCurrentUser } from "@/lib/auth-store";
import { useEffect, useState } from "react";

export function SupportHeader({ subtitle }: { subtitle?: string }) {
  const user = useCurrentUser();
  const name = user?.name ?? "Friend";
  const first = name.split(" ")[0];
  const hour = new Date().getHours();
  const greet = hour < 12 ? "Good morning" : hour < 17 ? "Good afternoon" : "Good evening";
  const today = new Date().toLocaleDateString(undefined, { weekday: "long", month: "long", day: "numeric" });

  return (
    <header className="px-5 pt-6 pb-4">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-xl font-bold leading-tight">{greet}, {first} <span aria-hidden>👋</span></p>
          <p className="text-sm text-muted-foreground mt-0.5">{subtitle ?? "Prayer Support — Group Alpha"}</p>
          <p className="text-xs text-muted-foreground mt-0.5">{today}</p>
        </div>
        <div className="flex items-center gap-2">
          <button className="relative w-10 h-10 rounded-full bg-card border border-border grid place-items-center">
            <Bell className="w-5 h-5" />
            <span className="absolute top-2 right-2 w-2 h-2 rounded-full bg-primary" />
          </button>
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
