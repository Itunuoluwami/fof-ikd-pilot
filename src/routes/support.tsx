import { createFileRoute, Outlet, Link, useRouterState, redirect } from "@tanstack/react-router";
import { Home, CalendarDays, Users, BookOpen, UserCircle2 } from "lucide-react";
import { useCurrentUser } from "@/lib/auth-store";

export const Route = createFileRoute("/support")({
  component: SupportLayout,
  beforeLoad: () => {
    // Soft guard: client-only mock auth. On SSR we skip (window undefined).
    if (typeof window === "undefined") return;
    try {
      const raw = localStorage.getItem("fof.session.v1");
      if (!raw) throw redirect({ to: "/login" });
    } catch (e) {
      // re-throw redirect
      if (e && typeof e === "object" && "to" in e) throw e;
    }
  },
});

const tabs = [
  { to: "/support", label: "Home", icon: Home, exact: true },
  { to: "/support/schedule", label: "Schedule", icon: CalendarDays },
  { to: "/support/participants", label: "Participants", icon: Users },
  { to: "/support/resources", label: "Resources", icon: BookOpen },
  { to: "/support/profile", label: "Profile", icon: UserCircle2 },
];

function SupportLayout() {
  const user = useCurrentUser();
  const path = useRouterState({ select: (s) => s.location.pathname });
  const isActive = (to: string, exact?: boolean) => exact ? path === to : path === to || path.startsWith(to + "/");

  // If guard couldn't run (SSR) but client has no user, redirect via component.
  if (typeof window !== "undefined" && !user) {
    window.location.replace("/login");
    return null;
  }

  return (
    <div className="min-h-screen bg-background text-foreground">
      <main className="max-w-md mx-auto pb-24">
        <Outlet />
      </main>

      <nav className="fixed bottom-0 inset-x-0 z-40 bg-card border-t border-border">
        <div className="max-w-md mx-auto grid grid-cols-5">
          {tabs.map((t) => {
            const Icon = t.icon;
            const active = isActive(t.to, t.exact);
            return (
              <Link
                key={t.to}
                to={t.to}
                className={`flex flex-col items-center gap-1 py-2.5 text-[11px] font-medium transition ${active ? "text-primary" : "text-muted-foreground"}`}
              >
                <div className={`grid place-items-center w-10 h-7 rounded-full ${active ? "bg-primary-light" : ""}`}>
                  <Icon className="w-5 h-5" />
                </div>
                {t.label}
              </Link>
            );
          })}
        </div>
      </nav>
    </div>
  );
}
