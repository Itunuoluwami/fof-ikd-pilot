import { createFileRoute, Link } from "@tanstack/react-router";
import { Avatar, StatusBadge } from "@/components/Primitives";
import { announcements, attendance, cohorts, participants, pendingChanges, prayerRequests, users, weeks, groups, resources } from "@/lib/mock-data";
import { useSelectedCohortId } from "@/lib/store";
import { useAdminNotifications, markAllRead, clearAdminNotifications } from "@/lib/admin-notifications";
import { Users, UserCircle2, Network, Layers, CalendarPlus, Megaphone, FolderPlus, UserPlus, BarChart3, AlertCircle, Clock, CheckCircle2, ArrowUpRight, BookOpen, HardDrive, Bell, RotateCcw } from "lucide-react";

export const Route = createFileRoute("/")({ component: Dashboard });

function Dashboard() {
  const cohortId = useSelectedCohortId();
  const cohort = cohorts.find(c => c.id === cohortId)!;
  const notifications = useAdminNotifications();
  const unreadCount = notifications.filter(n => !n.read).length;
  const cohortParticipants = participants.filter(p => p.cohortId === cohortId);
  const cohortGroups = groups.filter(g => g.cohortId === cohortId);
  const supports = users.filter(u => u.role === "SUPPORT");
  const pending = pendingChanges.filter(p => p.status === "PENDING");
  const openPrayers = prayerRequests.filter(p => p.status !== "ANSWERED");
  const today = weeks[0]?.days[1]?.activities ?? [];
  const presentCount = attendance.filter(a => a.status === "PRESENT").length;
  const attendancePct = Math.round((presentCount / Math.max(attendance.length, 1)) * 100);

  const stats = [
    { label: "Participants Onboarded", value: cohortParticipants.length, total: participants.length, icon: UserCircle2, to: "/participants", tone: "primary" as const },
    { label: "Total Supports", value: supports.filter(s => s.status === "ACTIVE").length, total: supports.length, icon: Users, to: "/users", tone: "info" as const },
    { label: "Groups Created", value: cohortGroups.length, total: groups.length, icon: Network, to: "/cohorts", tone: "success" as const },
    { label: "Active Cohorts", value: cohorts.length, total: cohorts.length, icon: Layers, to: "/cohorts", tone: "warning" as const },
  ];

  const quickActions = [
    { label: "Create Week", icon: CalendarPlus, to: "/schedule" },
    { label: "Add Announcement", icon: Megaphone, to: "/announcements" },
    { label: "Create Cohort", icon: Layers, to: "/cohorts" },
    { label: "Create Group", icon: FolderPlus, to: "/cohorts" },
    { label: "Add Participant", icon: UserPlus, to: "/participants" },
    { label: "View Reports", icon: BarChart3, to: "/attendance" },
  ];

  return (
    <div className="grid grid-cols-1 xl:grid-cols-[1fr_340px] gap-6">
      <div className="space-y-6 min-w-0">
        {/* Hero / cohort */}
        <section className="card-soft p-6 text-white" style={{ background: "linear-gradient(135deg, var(--primary) 0%, var(--primary-dark) 100%)" }}>
          <div className="flex flex-wrap items-end justify-between gap-4">
            <div>
              <p className="text-sm/relaxed opacity-90">Operational snapshot</p>
              <h2 className="text-2xl sm:text-3xl font-bold mt-1">{cohort.name}</h2>
              <p className="text-sm opacity-90 mt-1">Started {new Date(cohort.startDate).toLocaleDateString("en-GB", { day: "numeric", month: "long", year: "numeric" })}</p>
            </div>
            <div className="flex gap-6">
              <Metric label="Attendance" value={`${attendancePct}%`} />
              <Metric label="Open Prayers" value={openPrayers.length} />
              <Metric label="Pending" value={pending.length} />
            </div>
          </div>
        </section>

        {/* Top summary cards */}
        <section className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          {stats.map(s => <StatCard key={s.label} {...s} />)}
        </section>

        {/* Operational snapshot panels */}
        <section className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Panel title="Pending Schedule Changes" count={pending.length} to="/approvals" icon={AlertCircle} tone="warning">
            <ul className="space-y-3">
              {pending.slice(0, 3).map(p => (
                <li key={p.id} className="flex items-start gap-3">
                  <div className="w-2 h-2 rounded-full bg-primary mt-2" />
                  <div className="min-w-0 flex-1">
                    <p className="text-sm font-medium truncate">{p.activityTitle}</p>
                    <p className="text-xs text-muted-foreground truncate">by {p.submittedBy}</p>
                  </div>
                </li>
              ))}
              {pending.length === 0 && <p className="text-sm text-muted-foreground">No pending changes.</p>}
            </ul>
          </Panel>

          <Panel title="Today's Activities" count={today.length} to="/schedule" icon={Clock} tone="info">
            <ul className="space-y-3">
              {today.slice(0, 3).map(a => (
                <li key={a.id} className="flex items-center gap-3">
                  <div className="text-xs font-mono text-muted-foreground w-12">{a.startTime}</div>
                  <p className="text-sm font-medium truncate flex-1">{a.title}</p>
                  <StatusBadge status={a.status} tone={a.status === "DONE" ? "success" : a.status === "IN_PROGRESS" ? "warning" : "neutral"} />
                </li>
              ))}
              {today.length === 0 && <p className="text-sm text-muted-foreground">No activities today.</p>}
            </ul>
          </Panel>

          <Panel title="Unresolved Prayer Requests" count={openPrayers.length} to="/faith-projects" icon={CheckCircle2} tone="success">
            <ul className="space-y-3">
              {openPrayers.slice(0, 3).map(p => {
                const part = participants.find(x => x.id === p.participantId);
                return (
                  <li key={p.id} className="flex items-start gap-3">
                    {part && <Avatar name={part.name} color={part.avatarColor} size={32} />}
                    <div className="min-w-0 flex-1">
                      <p className="text-sm font-medium truncate">{part?.name}</p>
                      <p className="text-xs text-muted-foreground line-clamp-1">{p.text}</p>
                    </div>
                  </li>
                );
              })}
            </ul>
          </Panel>

          <Panel title="Attendance Overview" count={`${attendancePct}%`} to="/attendance" icon={BarChart3} tone="primary">
            <div className="space-y-3">
              <div className="h-2 rounded-full bg-muted overflow-hidden">
                <div className="h-full bg-primary rounded-full transition-all" style={{ width: `${attendancePct}%` }} />
              </div>
              <div className="grid grid-cols-3 gap-3 text-center">
                <Mini label="Present" value={attendance.filter(a => a.status === "PRESENT").length} />
                <Mini label="Late" value={attendance.filter(a => a.status === "LATE").length} />
                <Mini label="Absent" value={attendance.filter(a => a.status === "ABSENT").length} />
              </div>
            </div>
          </Panel>
        </section>

        {/* Quick actions */}
        <section className="card-soft p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-semibold">Quick actions</h3>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
            {quickActions.map(a => {
              const Icon = a.icon;
              return (
                <Link key={a.label} to={a.to} className="group flex flex-col items-center gap-2 p-4 rounded-2xl bg-muted/50 hover:bg-primary-light transition border border-transparent hover:border-primary/20">
                  <div className="w-10 h-10 rounded-xl bg-primary-light text-primary grid place-items-center group-hover:bg-primary group-hover:text-primary-foreground transition">
                    <Icon className="w-5 h-5" />
                  </div>
                  <span className="text-xs font-medium text-center leading-tight">{a.label}</span>
                </Link>
              );
            })}
          </div>
        </section>
      </div>

      {/* Right rail */}
      <aside className="space-y-4">
        <div className="card-soft p-6">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-10 h-10 rounded-xl bg-primary-light text-primary grid place-items-center"><HardDrive className="w-5 h-5" /></div>
            <div>
              <p className="text-xs text-muted-foreground">Resource Library</p>
              <p className="font-semibold">{resources.length} items</p>
            </div>
          </div>
          <ul className="space-y-2">
            {Object.entries(resources.reduce((acc, r) => { acc[r.category] = (acc[r.category] || 0) + 1; return acc; }, {} as Record<string, number>)).slice(0, 4).map(([cat, n]) => (
              <li key={cat} className="flex items-center justify-between py-2 border-b border-border last:border-0">
                <span className="text-sm">{cat}</span>
                <span className="text-xs text-muted-foreground">{n} files</span>
              </li>
            ))}
          </ul>
          <Link to="/resources" className="mt-4 inline-flex items-center gap-1 text-sm font-semibold text-primary hover:gap-2 transition-all">
            Browse resources <ArrowUpRight className="w-4 h-4" />
          </Link>
        </div>

        <div className="card-soft p-6">
          <div className="flex items-center gap-2 mb-4">
            <Megaphone className="w-5 h-5 text-primary" />
            <p className="font-semibold">Latest announcements</p>
          </div>
          <ul className="space-y-3">
            {announcements.slice(0, 3).map(a => (
              <li key={a.id} className="pb-3 border-b border-border last:border-0 last:pb-0">
                <div className="flex items-center gap-2 mb-1">
                  {a.urgent && <span className="text-xs px-2 py-0.5 rounded-full bg-destructive text-destructive-foreground font-medium">Urgent</span>}
                  {a.pinned && <span className="text-xs px-2 py-0.5 rounded-full bg-primary-light text-primary font-medium">Pinned</span>}
                </div>
                <p className="text-sm font-medium leading-snug">{a.title}</p>
                <p className="text-xs text-muted-foreground line-clamp-2 mt-0.5">{a.body}</p>
              </li>
            ))}
          </ul>
        </div>
      </aside>
    </div>
  );
}

function StatCard({ label, value, total, icon: Icon, to }: { label: string; value: number; total: number; icon: any; to: string; tone: string }) {
  return (
    <Link to={to} className="card-soft p-5 hover:-translate-y-0.5 transition group">
      <div className="flex items-start justify-between mb-3">
        <div className="w-10 h-10 rounded-xl bg-primary-light text-primary grid place-items-center group-hover:bg-primary group-hover:text-primary-foreground transition">
          <Icon className="w-5 h-5" />
        </div>
        <ArrowUpRight className="w-4 h-4 text-muted-foreground group-hover:text-primary transition" />
      </div>
      <p className="text-3xl font-bold">{value}</p>
      <p className="text-xs text-muted-foreground mt-1">{label}</p>
      {total !== value && <p className="text-[11px] text-muted-foreground mt-0.5">of {total} total</p>}
    </Link>
  );
}

function Panel({ title, count, to, icon: Icon, tone, children }: { title: string; count: number | string; to: string; icon: any; tone: string; children: React.ReactNode }) {
  return (
    <div className="card-soft p-5">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-3 min-w-0">
          <div className="w-9 h-9 rounded-lg bg-primary-light text-primary grid place-items-center shrink-0"><Icon className="w-4 h-4" /></div>
          <div className="min-w-0">
            <p className="text-sm font-semibold truncate">{title}</p>
            <p className="text-xs text-muted-foreground">{count} items</p>
          </div>
        </div>
        <Link to={to} className="text-xs font-semibold text-primary">View all</Link>
      </div>
      {children}
    </div>
  );
}

function Metric({ label, value }: { label: string; value: string | number }) {
  return (
    <div>
      <p className="text-xs opacity-80">{label}</p>
      <p className="text-2xl font-bold">{value}</p>
    </div>
  );
}

function Mini({ label, value }: { label: string; value: number }) {
  return (
    <div className="bg-muted/50 rounded-lg py-2">
      <p className="text-lg font-bold">{value}</p>
      <p className="text-[11px] text-muted-foreground">{label}</p>
    </div>
  );
}
