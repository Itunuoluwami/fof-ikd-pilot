import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { SupportHeader, SectionTitle } from "@/components/support/SupportUI";
import { Avatar } from "@/components/Primitives";
import { useCurrentUser, logout } from "@/lib/auth-store";
import { LogOut, Bell, HelpCircle, Shield, Megaphone, ChevronRight } from "lucide-react";
import { Link } from "@tanstack/react-router";

export const Route = createFileRoute("/support/profile")({ component: ProfilePage });

function ProfilePage() {
  const user = useCurrentUser();
  const navigate = useNavigate();
  if (!user) return null;

  return (
    <>
      <SupportHeader subtitle="Your profile" />
      <div className="px-5 mt-2">
        <div className="card-soft p-5 flex items-center gap-4">
          <Avatar name={user.name} color={user.avatarColor} size={64} />
          <div>
            <p className="font-bold text-lg leading-tight">{user.name}</p>
            <p className="text-xs text-muted-foreground">{user.role.replace("_", " ")} · {user.status}</p>
            {user.email && <p className="text-xs text-muted-foreground mt-0.5">{user.email}</p>}
          </div>
        </div>
      </div>

      <SectionTitle title="Settings" />
      <div className="px-5 space-y-2">
        {[
          { icon: Bell, label: "Notifications", to: "/support" },
          { icon: Megaphone, label: "Announcements", to: "/support" },
          { icon: HelpCircle, label: "User guide", to: "/support/guide" },
          { icon: Shield, label: "Privacy", to: "/support" },
        ].map(item => {
          const Icon = item.icon;
          return (
            <Link key={item.label} to={item.to} className="card-soft p-3.5 flex items-center gap-3">
              <div className="w-9 h-9 rounded-xl bg-primary-light text-primary grid place-items-center"><Icon className="w-4 h-4" /></div>
              <span className="flex-1 font-medium text-sm">{item.label}</span>
              <ChevronRight className="w-4 h-4 text-muted-foreground" />
            </Link>
          );
        })}
      </div>

      <div className="px-5 mt-6">
        <button onClick={() => { logout(); navigate({ to: "/login" }); }}
          className="w-full py-3 rounded-xl border border-border bg-card font-semibold text-destructive inline-flex items-center justify-center gap-2">
          <LogOut className="w-4 h-4" /> Sign out
        </button>
      </div>
      <div className="h-6" />
    </>
  );
}
