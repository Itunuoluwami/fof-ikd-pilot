import { createFileRoute, Link } from "@tanstack/react-router";
import { useState } from "react";
import { SupportHeader, SectionTitle, OfflineBanner, Avatar } from "@/components/support/SupportUI";
import { useCurrentUser } from "@/lib/auth-store";
import { supportTasks, programmeGuide, priorityTone, type TaskStatus } from "@/lib/support-data";
import { participants, weeks, announcements, prayerRequests, resources } from "@/lib/mock-data";
import { CheckCircle2, Circle, Loader2, MapPin, Clock, ClipboardCheck, HeartHandshake, CalendarDays, BookOpen, Sparkles, Megaphone, ChevronRight } from "lucide-react";

export const Route = createFileRoute("/support/")({ component: SupportDashboard });

function SupportDashboard() {
  const user = useCurrentUser();
  const supportId = user?.id ?? "u-3";
  const [tasks, setTasks] = useState(supportTasks.filter(t => t.supportId === supportId));

  const myParticipants = participants.filter(p => p.supportId === supportId);
  const todayActivities = weeks[0]?.days[1]?.activities ?? [];
  const tomorrowActivities = weeks[0]?.days[2]?.activities ?? [];
  const urgent = announcements.find(a => a.urgent);
  const guide = programmeGuide[0];
  const newResources = resources.filter(r => r.isNew).slice(0, 3);

  function toggleTask(id: string) {
    setTasks(prev => prev.map(t => t.id === id ? { ...t, status: t.status === "DONE" ? "NOT_STARTED" : "DONE" as TaskStatus, completedAt: new Date().toISOString(), completedBy: supportId } : t));
  }

  return (
    <>
      <SupportHeader />
      <OfflineBanner />

      {urgent && (
        <div className="mx-5 mt-3 card-soft p-4 border-l-4 border-destructive">
          <div className="flex items-start gap-3">
            <Megaphone className="w-4 h-4 text-destructive mt-0.5 shrink-0" />
            <div>
              <p className="text-xs font-semibold text-destructive">URGENT</p>
              <p className="text-sm font-semibold mt-0.5">{urgent.title}</p>
              <p className="text-xs text-muted-foreground mt-1">{urgent.body}</p>
            </div>
          </div>
        </div>
      )}

      {/* Quick actions */}
      <div className="px-5 mt-5 grid grid-cols-4 gap-2">
        {[
          { label: "Attendance", icon: ClipboardCheck, to: "/support/attendance" },
          { label: "Prayer", icon: HeartHandshake, to: "/support/participants" },
          { label: "Schedule", icon: CalendarDays, to: "/support/schedule" },
          { label: "Guide", icon: BookOpen, to: "/support/guide" },
        ].map(a => {
          const Icon = a.icon;
          return (
            <Link key={a.label} to={a.to} className="card-soft p-3 flex flex-col items-center gap-2 active:scale-95 transition">
              <div className="w-10 h-10 rounded-xl bg-primary-light grid place-items-center text-primary">
                <Icon className="w-5 h-5" />
              </div>
              <span className="text-[11px] font-medium text-center leading-tight">{a.label}</span>
            </Link>
          );
        })}
      </div>

      {/* Today's tasks */}
      <SectionTitle title="Today's tasks" action={<span className="text-xs text-muted-foreground">{tasks.filter(t => t.status === "DONE").length}/{tasks.length} done</span>} />
      <div className="px-5 space-y-2.5">
        {tasks.length === 0 && (
          <div className="card-soft p-6 text-center">
            <p className="text-2xl">🎉</p>
            <p className="font-semibold mt-1">No tasks today</p>
            <p className="text-xs text-muted-foreground">You're all caught up.</p>
          </div>
        )}
        {tasks.slice(0, 3).map(t => {
          const done = t.status === "DONE";
          return (
            <div key={t.id} className={`card-soft p-4 transition ${done ? "opacity-60" : ""}`}>
              <div className="flex items-start gap-3">
                <button onClick={() => toggleTask(t.id)} className="mt-0.5 shrink-0">
                  {done ? <CheckCircle2 className="w-6 h-6 text-primary" /> :
                    t.status === "IN_PROGRESS" ? <Loader2 className="w-6 h-6 text-primary animate-spin" /> :
                    <Circle className="w-6 h-6 text-muted-foreground" />}
                </button>
                <div className="flex-1 min-w-0">
                  <div className="flex items-start justify-between gap-2">
                    <p className={`font-semibold leading-tight ${done ? "line-through" : ""}`}>{t.title}</p>
                    <span className={`shrink-0 text-[10px] font-bold px-2 py-0.5 rounded-full ${
                      t.priority === "HIGH" ? "bg-[oklch(0.95_0.05_25)] text-[oklch(0.45_0.2_25)]" :
                      t.priority === "MEDIUM" ? "bg-[oklch(0.96_0.06_75)] text-[oklch(0.45_0.15_50)]" :
                      "bg-muted text-muted-foreground"
                    }`}>{t.priority}</span>
                  </div>
                  <div className="flex items-center gap-3 mt-1.5 text-xs text-muted-foreground">
                    <span className="inline-flex items-center gap-1"><Clock className="w-3.5 h-3.5" /> {t.time}</span>
                    <span className="inline-flex items-center gap-1"><MapPin className="w-3.5 h-3.5" /> {t.location}</span>
                  </div>
                  {!done && (
                    <button onClick={() => toggleTask(t.id)}
                      className="mt-3 w-full py-2 rounded-xl text-white text-sm font-semibold active:scale-[0.98] transition"
                      style={{ background: "linear-gradient(135deg, var(--primary) 0%, var(--primary-dark) 100%)" }}>
                      Mark as Done
                    </button>
                  )}
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* My participants */}
      <SectionTitle title="My participants" action={<Link to="/support/participants" className="text-xs text-primary font-semibold">View all</Link>} />
      <div className="px-5 space-y-2.5">
        {myParticipants.slice(0, 3).map(p => {
          const lastPrayer = prayerRequests.filter(pr => pr.participantId === p.id).sort((a, b) => b.date.localeCompare(a.date))[0];
          return (
            <Link key={p.id} to="/support/participants/$id" params={{ id: p.id }} className="card-soft p-3 flex items-center gap-3 active:bg-muted transition">
              <Avatar name={p.name} color={p.avatarColor} size={44} />
              <div className="flex-1 min-w-0">
                <p className="font-semibold truncate">{p.name}</p>
                <p className="text-xs text-muted-foreground">Group Alpha · Last prayer: {lastPrayer ? lastPrayer.date : "—"}</p>
              </div>
              <ChevronRight className="w-4 h-4 text-muted-foreground" />
            </Link>
          );
        })}
      </div>

      {/* Today / Tomorrow */}
      <SectionTitle title="Schedule" action={<Link to="/support/schedule" className="text-xs text-primary font-semibold">Full schedule</Link>} />
      <div className="px-5 space-y-3">
        <ScheduleStrip label="Today" items={todayActivities} />
        <ScheduleStrip label="Tomorrow" items={tomorrowActivities} />
      </div>

      {/* Programme guide */}
      {guide && (
        <>
          <SectionTitle title="Programme guide" />
          <div className="px-5">
            <Link to="/support/guide" className="card-soft p-4 block">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-primary-light grid place-items-center text-primary"><BookOpen className="w-5 h-5" /></div>
                <div className="flex-1 min-w-0">
                  <p className="font-semibold truncate">{guide.title}</p>
                  <p className="text-xs text-muted-foreground truncate">{guide.lastSection}</p>
                </div>
              </div>
              <div className="mt-3 flex items-center gap-3">
                <div className="flex-1 h-2 rounded-full bg-muted overflow-hidden">
                  <div className="h-full rounded-full" style={{ width: `${guide.progress}%`, background: "linear-gradient(90deg, var(--primary), var(--primary-dark))" }} />
                </div>
                <span className="text-xs font-semibold text-primary">{guide.progress}%</span>
              </div>
              <p className="mt-3 text-xs text-primary font-semibold">Continue reading →</p>
            </Link>
          </div>
        </>
      )}

      {/* Resources */}
      {newResources.length > 0 && (
        <>
          <SectionTitle title="New resources" action={<Link to="/support/resources" className="text-xs text-primary font-semibold">Browse</Link>} />
          <div className="px-5 space-y-2">
            {newResources.map(r => (
              <Link key={r.id} to="/support/resources" className="card-soft p-3 flex items-center gap-3">
                <div className="w-9 h-9 rounded-lg grid place-items-center text-white text-xs font-bold" style={{ background: r.avatarColor }}>{r.type}</div>
                <div className="flex-1 min-w-0">
                  <p className="font-semibold text-sm truncate">{r.title}</p>
                  <p className="text-xs text-muted-foreground">{r.category}</p>
                </div>
                <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-primary-light text-primary inline-flex items-center gap-1"><Sparkles className="w-3 h-3" /> NEW</span>
              </Link>
            ))}
          </div>
        </>
      )}

      <div className="h-6" />
    </>
  );
}

function ScheduleStrip({ label, items }: { label: string; items: { id: string; title: string; startTime: string; location: string }[] }) {
  return (
    <div className="card-soft p-4">
      <p className="text-xs font-bold text-primary mb-2">{label.toUpperCase()}</p>
      {items.length === 0 && <p className="text-sm text-muted-foreground">Nothing scheduled.</p>}
      <div className="space-y-2">
        {items.map(a => (
          <div key={a.id} className="flex items-center gap-3">
            <div className="text-xs font-bold w-14 text-muted-foreground">{a.startTime}</div>
            <div className="flex-1 min-w-0">
              <p className="font-semibold text-sm truncate">{a.title}</p>
              <p className="text-xs text-muted-foreground truncate">{a.location}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
