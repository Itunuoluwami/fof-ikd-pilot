import { createFileRoute, Outlet, Link, useRouterState, useNavigate, redirect } from "@tanstack/react-router";
import { Home, CalendarDays, Users, BookOpen, UserCircle2, LogOut } from "lucide-react";
import { useEffect } from "react";
import { useSession, useCurrentUser, logout } from "@/lib/auth-store";
import { Avatar } from "@/components/Primitives";

export const Route = createFileRoute("/support")({
  component: SupportLayout,
  beforeLoad: () => {
    if (typeof window === "undefined") return;
    try {
      const raw = localStorage.getItem("fof.session.v1");
      if (!raw) throw redirect({ to: "/login" });
    } catch (e) {
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
  const session = useSession();
  const user = useCurrentUser();
  const navigate = useNavigate();
  const path = useRouterState({ select: (s) => s.location.pathname });
  const isActive = (to: string, exact?: boolean) => exact ? path === to : path === to || path.startsWith(to + "/");

  useEffect(() => {
    if (typeof window === "undefined") return;
    const raw = localStorage.getItem("fof.session.v1");
    if (!raw && !session) navigate({ to: "/login" });
  }, [session, navigate]);

  function handleLogout() {
    logout();
    navigate({ to: "/login" });
  }

  return (
    <div className="min-h-screen bg-background text-foreground md:flex">
      {/* Desktop sidebar */}
      <aside className="hidden md:flex md:flex-col md:w-64 md:fixed md:inset-y-0 md:left-0 md:bg-card md:border-r md:border-border md:z-30">
        <div className="px-5 py-5 flex items-center gap-3 border-b border-border">
          <div className="w-10 h-10 rounded-2xl text-white grid place-items-center font-bold" style={{ background: "linear-gradient(135deg, var(--primary) 0%, var(--primary-dark) 100%)" }}>F</div>
          <div className="min-w-0">
            <p className="font-bold leading-tight truncate">FOF IKD Ops</p>
            <p className="text-[11px] text-muted-foreground">Support workspace</p>
          </div>
        </div>

        <nav className="flex-1 p-3 space-y-1">
          {tabs.map((t) => {
            const Icon = t.icon;
            const active = isActive(t.to, t.exact);
            return (
              <Link
                key={t.to}
                to={t.to}
                className={`flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition ${active ? "bg-primary-light text-primary" : "text-muted-foreground hover:bg-muted hover:text-foreground"}`}
              >
                <Icon className="w-5 h-5" />
                {t.label}
              </Link>
            );
          })}
        </nav>

        {user && (
          <div className="p-3 border-t border-border">
            <div className="flex items-center gap-3 px-2 py-2">
              <Avatar name={user.name} color={user.avatarColor} size={36} />
              <div className="flex-1 min-w-0">
                <p className="text-sm font-semibold truncate">{user.name}</p>
                <p className="text-[11px] text-muted-foreground truncate">Support</p>
              </div>
              <button onClick={handleLogout} title="Log out" className="w-8 h-8 grid place-items-center rounded-lg text-muted-foreground hover:text-foreground hover:bg-muted">
                <LogOut className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}
      </aside>

      {/* Main content */}
      <main className="flex-1 md:ml-64 pb-24 md:pb-10">
        <div className="max-w-md md:max-w-5xl mx-auto md:px-4">
          <Outlet />
        </div>
      </main>

      {/* Mobile bottom nav */}
      <nav className="md:hidden fixed bottom-0 inset-x-0 z-40 bg-card border-t border-border">
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

