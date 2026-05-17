import { Link, useRouterState } from "@tanstack/react-router";
import { LayoutDashboard, CalendarDays, CheckSquare, Users, Network, UserCircle2, HeartHandshake, ClipboardCheck, Megaphone, BookOpen, Settings, Bell, Menu, X } from "lucide-react";
import { useState } from "react";
import { CohortSelector } from "./CohortSelector";

const nav = [
  { to: "/", label: "Dashboard", icon: LayoutDashboard, exact: true },
  { to: "/schedule", label: "Schedule", icon: CalendarDays },
  { to: "/approvals", label: "Approvals", icon: CheckSquare },
  { to: "/users", label: "Users", icon: Users },
  { to: "/cohorts", label: "Cohorts & Groups", icon: Network },
  { to: "/participants", label: "Participants", icon: UserCircle2 },
  { to: "/faith-projects", label: "Faith Projects", icon: HeartHandshake },
  { to: "/attendance", label: "Attendance", icon: ClipboardCheck },
  { to: "/announcements", label: "Announcements", icon: Megaphone },
  { to: "/resources", label: "Resources", icon: BookOpen },
  { to: "/settings", label: "Settings", icon: Settings },
];

export function AppShell({ children }: { children?: React.ReactNode }) {
  const path = useRouterState({ select: s => s.location.pathname });
  const [open, setOpen] = useState(false);
  const isActive = (to: string, exact?: boolean) => exact ? path === to : path === to || path.startsWith(to + "/");

  return (
    <div className="min-h-screen bg-background text-foreground">
      {/* Sidebar - desktop */}
      <aside className="hidden lg:flex fixed inset-y-0 left-0 w-64 flex-col bg-sidebar border-r border-border">
        <Brand />
        <NavList isActive={isActive} />
      </aside>

      {/* Mobile drawer */}
      {open && (
        <div className="lg:hidden fixed inset-0 z-50 flex">
          <div className="absolute inset-0 bg-black/40" onClick={() => setOpen(false)} />
          <aside className="relative w-72 bg-sidebar flex flex-col">
            <div className="flex items-center justify-between px-5 py-4">
              <Brand inline />
              <button onClick={() => setOpen(false)} className="p-2 rounded-lg hover:bg-muted"><X className="w-5 h-5" /></button>
            </div>
            <NavList isActive={isActive} onNavigate={() => setOpen(false)} />
          </aside>
        </div>
      )}

      <div className="lg:pl-64">
        {/* Top bar */}
        <header className="sticky top-0 z-30 bg-background/90 backdrop-blur border-b border-border">
          <div className="flex items-center gap-3 px-4 sm:px-6 py-3">
            <button onClick={() => setOpen(true)} className="lg:hidden p-2 rounded-lg hover:bg-muted"><Menu className="w-5 h-5" /></button>
            <div className="flex-1 min-w-0">
              <CohortSelector />
            </div>
            <button className="relative p-2 rounded-lg hover:bg-muted">
              <Bell className="w-5 h-5" />
              <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-primary" />
            </button>
            <div className="flex items-center gap-2 pl-2 border-l border-border">
              <div className="hidden sm:block text-right">
                <p className="text-sm font-semibold leading-tight">Hi, Stas</p>
                <p className="text-xs text-muted-foreground">Admin</p>
              </div>
              <div className="w-9 h-9 rounded-full bg-primary text-primary-foreground grid place-items-center font-semibold">S</div>
            </div>
          </div>
        </header>

        <main className="p-4 sm:p-6 pb-24 lg:pb-6">
          {children}
        </main>
      </div>

      {/* Mobile bottom nav */}
      <nav className="lg:hidden fixed bottom-0 inset-x-0 z-40 bg-card border-t border-border">
        <div className="grid grid-cols-5">
          {nav.slice(0, 5).map(n => {
            const Icon = n.icon;
            const active = isActive(n.to, n.exact);
            return (
              <Link key={n.to} to={n.to} className={`flex flex-col items-center gap-1 py-2.5 text-xs ${active ? "text-primary" : "text-muted-foreground"}`}>
                <Icon className="w-5 h-5" />
                <span className="truncate max-w-full px-1">{n.label}</span>
              </Link>
            );
          })}
        </div>
      </nav>
    </div>
  );
}

function Brand({ inline = false }: { inline?: boolean }) {
  return (
    <div className={inline ? "flex items-center gap-3" : "flex items-center gap-3 px-6 py-6"}>
      <div className="w-10 h-10 rounded-xl bg-primary text-primary-foreground grid place-items-center font-bold shadow-md shadow-primary/30">F</div>
      <div>
        <p className="font-bold leading-tight">FOF IKD</p>
        <p className="text-xs text-muted-foreground">Ops Console</p>
      </div>
    </div>
  );
}

function NavList({ isActive, onNavigate }: { isActive: (to: string, exact?: boolean) => boolean; onNavigate?: () => void }) {
  return (
    <nav className="flex-1 overflow-y-auto scrollbar-thin px-3 pb-6 space-y-1">
      {nav.map(n => {
        const Icon = n.icon;
        const active = isActive(n.to, n.exact);
        return (
          <Link
            key={n.to}
            to={n.to}
            onClick={onNavigate}
            className={`flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition ${
              active ? "bg-primary text-primary-foreground shadow-sm shadow-primary/30" : "text-sidebar-foreground hover:bg-muted"
            }`}
          >
            <Icon className="w-[18px] h-[18px]" />
            {n.label}
          </Link>
        );
      })}
    </nav>
  );
}
