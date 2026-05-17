import { createFileRoute } from "@tanstack/react-router";
import { Avatar, PageHeader, StatusBadge } from "@/components/Primitives";
import { attendance, getParticipant, weeks } from "@/lib/mock-data";

export const Route = createFileRoute("/attendance")({ component: AttendancePage });

function AttendancePage() {
  const total = attendance.length;
  const stats = {
    PRESENT: attendance.filter(a => a.status === "PRESENT").length,
    LATE: attendance.filter(a => a.status === "LATE").length,
    ABSENT: attendance.filter(a => a.status === "ABSENT").length,
    EXCUSED: attendance.filter(a => a.status === "EXCUSED").length,
  };
  const pct = (n: number) => Math.round((n / Math.max(total, 1)) * 100);
  const week = weeks[0];

  return (
    <div>
      <PageHeader title="Attendance" subtitle="Weekly attendance overview and participant records." />

      <section className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        <StatTile label="Present" value={stats.PRESENT} pct={pct(stats.PRESENT)} tone="success" />
        <StatTile label="Late" value={stats.LATE} pct={pct(stats.LATE)} tone="warning" />
        <StatTile label="Absent" value={stats.ABSENT} pct={pct(stats.ABSENT)} tone="danger" />
        <StatTile label="Excused" value={stats.EXCUSED} pct={pct(stats.EXCUSED)} tone="info" />
      </section>

      <section className="card-soft overflow-hidden">
        <div className="p-5 border-b border-border flex items-center justify-between">
          <div>
            <p className="font-semibold">{week.title}</p>
            <p className="text-xs text-muted-foreground">Recent activity attendance</p>
          </div>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-muted/40 text-xs uppercase tracking-wider text-muted-foreground">
              <tr>
                <th className="px-5 py-3 text-left">Participant</th>
                <th className="px-5 py-3 text-left hidden md:table-cell">Activity</th>
                <th className="px-5 py-3 text-left hidden sm:table-cell">Date</th>
                <th className="px-5 py-3 text-left">Status</th>
              </tr>
            </thead>
            <tbody>
              {attendance.map(a => {
                const p = getParticipant(a.participantId);
                const act = week.days.flatMap(d => d.activities).find(x => x.id === a.activityId);
                return (
                  <tr key={a.id} className="border-b border-border last:border-0 hover:bg-muted/30">
                    <td className="px-5 py-3">
                      <div className="flex items-center gap-3">
                        {p && <Avatar name={p.name} color={p.avatarColor} size={32} />}
                        <span className="font-medium text-sm">{p?.name}</span>
                      </div>
                    </td>
                    <td className="px-5 py-3 hidden md:table-cell text-sm text-muted-foreground">{act?.title ?? "—"}</td>
                    <td className="px-5 py-3 hidden sm:table-cell text-sm text-muted-foreground">{new Date(a.date).toLocaleDateString("en-GB")}</td>
                    <td className="px-5 py-3"><StatusBadge status={a.status} tone={a.status === "PRESENT" ? "success" : a.status === "ABSENT" ? "danger" : a.status === "LATE" ? "warning" : "info"} /></td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </section>
    </div>
  );
}

function StatTile({ label, value, pct, tone }: { label: string; value: number; pct: number; tone: "success" | "warning" | "danger" | "info" }) {
  const ring: Record<string, string> = {
    success: "bg-[oklch(0.95_0.05_155)] text-[oklch(0.4_0.15_155)]",
    warning: "bg-[oklch(0.96_0.06_75)] text-[oklch(0.45_0.15_50)]",
    danger: "bg-[oklch(0.95_0.05_25)] text-[oklch(0.45_0.2_25)]",
    info: "bg-[oklch(0.95_0.04_240)] text-[oklch(0.4_0.16_240)]",
  };
  return (
    <div className="card-soft p-5">
      <div className={`w-10 h-10 rounded-xl ${ring[tone]} grid place-items-center text-xs font-bold mb-3`}>{pct}%</div>
      <p className="text-3xl font-bold">{value}</p>
      <p className="text-xs text-muted-foreground mt-1">{label}</p>
    </div>
  );
}
