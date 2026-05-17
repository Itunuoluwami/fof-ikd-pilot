import { createFileRoute, Link } from "@tanstack/react-router";
import { Avatar, PageHeader, StatusBadge } from "@/components/Primitives";
import { attendance, getCohort, getGroup, getUser, participants, prayerRequests } from "@/lib/mock-data";
import { ArrowLeft, Phone } from "lucide-react";

export const Route = createFileRoute("/participants/$id")({ component: ParticipantProfile });

function ParticipantProfile() {
  const { id } = Route.useParams();
  const p = participants.find(x => x.id === id);
  if (!p) return <div className="card-soft p-10 text-center">Participant not found. <Link to="/participants" className="text-primary font-semibold">Back</Link></div>;

  const group = getGroup(p.groupId);
  const cohort = getCohort(p.cohortId);
  const support = p.supportId ? getUser(p.supportId) : null;
  const att = attendance.filter(a => a.participantId === p.id);
  const prayers = prayerRequests.filter(pr => pr.participantId === p.id);

  return (
    <div>
      <Link to="/participants" className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground mb-4"><ArrowLeft className="w-4 h-4" /> Back to participants</Link>
      <PageHeader title={p.name} subtitle={`${cohort?.name} · ${group?.name}`} />

      <div className="grid grid-cols-1 lg:grid-cols-[320px_1fr] gap-6">
        <aside className="card-soft p-6 text-center h-fit">
          <div className="grid place-items-center mb-4"><Avatar name={p.name} color={p.avatarColor} size={88} /></div>
          <p className="font-bold text-lg">{p.name}</p>
          <p className="text-xs text-muted-foreground inline-flex items-center gap-1.5 mt-1"><Phone className="w-3 h-3" /> {p.phone}</p>
          <div className="mt-5 pt-5 border-t border-border text-left space-y-3 text-sm">
            <Row label="Cohort" value={cohort?.name} />
            <Row label="Group" value={group?.name} />
            <Row label="Support" value={support?.name ?? "—"} />
            <Row label="Joined" value={new Date(p.joinedAt).toLocaleDateString("en-GB")} />
          </div>
        </aside>

        <div className="space-y-4 min-w-0">
          <section className="card-soft p-5">
            <h3 className="font-semibold mb-4">Attendance history</h3>
            {att.length === 0 ? <p className="text-sm text-muted-foreground">No attendance recorded.</p> : (
              <ul className="divide-y divide-border">
                {att.map(a => (
                  <li key={a.id} className="flex items-center justify-between py-3">
                    <span className="text-sm">{new Date(a.date).toLocaleDateString("en-GB", { weekday: "short", day: "numeric", month: "short" })}</span>
                    <StatusBadge status={a.status} tone={a.status === "PRESENT" ? "success" : a.status === "ABSENT" ? "danger" : a.status === "LATE" ? "warning" : "info"} />
                  </li>
                ))}
              </ul>
            )}
          </section>

          <section className="card-soft p-5">
            <h3 className="font-semibold mb-4">Faith Projects</h3>
            {prayers.length === 0 ? <p className="text-sm text-muted-foreground">No prayer requests yet.</p> : (
              <ul className="space-y-3">
                {prayers.map(pr => (
                  <li key={pr.id} className="p-4 rounded-xl bg-muted/40">
                    <div className="flex items-center justify-between mb-2">
                      <p className="text-xs text-muted-foreground">{new Date(pr.date).toLocaleDateString("en-GB")}</p>
                      <StatusBadge status={pr.status} tone={pr.status === "ANSWERED" ? "success" : pr.status === "IN_PROGRESS" ? "warning" : "neutral"} />
                    </div>
                    <p className="text-sm">{pr.text}</p>
                  </li>
                ))}
              </ul>
            )}
          </section>

          {p.notes && (
            <section className="card-soft p-5">
              <h3 className="font-semibold mb-2">Notes</h3>
              <p className="text-sm text-muted-foreground">{p.notes}</p>
            </section>
          )}
        </div>
      </div>
    </div>
  );
}

function Row({ label, value }: { label: string; value?: string }) {
  return (
    <div className="flex items-baseline justify-between gap-3">
      <dt className="text-xs text-muted-foreground">{label}</dt>
      <dd className="font-medium text-right">{value}</dd>
    </div>
  );
}
