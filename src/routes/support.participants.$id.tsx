import { createFileRoute, Link, notFound } from "@tanstack/react-router";
import { Avatar } from "@/components/Primitives";
import { participants, prayerRequests, attendance, getCohort, getGroup } from "@/lib/mock-data";
import { supportNotes } from "@/lib/support-data";
import { ArrowLeft, Phone, HeartHandshake, MessageSquarePlus, CheckCircle2 } from "lucide-react";
import { useState } from "react";

export const Route = createFileRoute("/support/participants/$id")({ component: ParticipantProfile });

function ParticipantProfile() {
  const { id } = Route.useParams();
  const p = participants.find(x => x.id === id);
  if (!p) throw notFound();

  const [prayers, setPrayers] = useState(prayerRequests.filter(pr => pr.participantId === p.id));
  const [notes, setNotes] = useState(supportNotes.filter(n => n.participantId === p.id));
  const att = attendance.filter(a => a.participantId === p.id);
  const cohort = getCohort(p.cohortId);
  const group = getGroup(p.groupId);

  const [draft, setDraft] = useState("");
  const [mode, setMode] = useState<"prayer" | "note">("prayer");

  function submit() {
    if (!draft.trim()) return;
    const date = new Date().toISOString().slice(0,10);
    if (mode === "prayer") {
      setPrayers([{ id: `pr-${Date.now()}`, participantId: p.id, submittedById: "u-3", text: draft, date, status: "OPEN" }, ...prayers]);
    } else {
      setNotes([{ id: `n-${Date.now()}`, participantId: p.id, supportId: "u-3", date, text: draft }, ...notes]);
    }
    setDraft("");
  }

  // Build a unified timeline
  const timeline = [
    ...prayers.map(pr => ({ id: pr.id, date: pr.date, type: "prayer" as const, text: pr.text })),
    ...notes.map(n => ({ id: n.id, date: n.date, type: "note" as const, text: n.text })),
    ...att.map(a => ({ id: a.id, date: a.date, type: "attend" as const, text: `Attendance: ${a.status}` })),
  ].sort((a,b) => b.date.localeCompare(a.date));

  return (
    <>
      <header className="px-5 pt-6 pb-4">
        <Link to="/support/participants" className="inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-primary"><ArrowLeft className="w-4 h-4" /> Back</Link>
      </header>
      <div className="px-5 flex items-center gap-4">
        <Avatar name={p.name} color={p.avatarColor} size={68} />
        <div className="flex-1 min-w-0">
          <h1 className="text-xl font-bold leading-tight">{p.name}</h1>
          <p className="text-xs text-muted-foreground">{cohort?.name} · {group?.name}</p>
          <a href={`tel:${p.phone}`} className="inline-flex items-center gap-1.5 text-xs text-primary font-semibold mt-1"><Phone className="w-3.5 h-3.5" /> {p.phone}</a>
        </div>
      </div>

      {/* Composer */}
      <div className="px-5 mt-5">
        <div className="card-soft p-4">
          <div className="flex gap-2 mb-3">
            <button onClick={() => setMode("prayer")} className={`flex-1 py-2 rounded-lg text-sm font-semibold ${mode === "prayer" ? "bg-primary-light text-primary" : "bg-muted text-muted-foreground"}`}>
              <HeartHandshake className="w-4 h-4 inline mr-1" /> Prayer
            </button>
            <button onClick={() => setMode("note")} className={`flex-1 py-2 rounded-lg text-sm font-semibold ${mode === "note" ? "bg-primary-light text-primary" : "bg-muted text-muted-foreground"}`}>
              <MessageSquarePlus className="w-4 h-4 inline mr-1" /> Note
            </button>
          </div>
          <textarea value={draft} onChange={e => setDraft(e.target.value)} rows={3}
            placeholder={mode === "prayer" ? "Log a prayer request…" : "Add a follow-up note…"}
            className="w-full p-3 rounded-xl border border-border bg-background text-sm focus:outline-none focus:ring-2 focus:ring-primary resize-none" />
          <button onClick={submit} disabled={!draft.trim()}
            className="mt-2 w-full py-2.5 rounded-xl text-white text-sm font-semibold disabled:opacity-50"
            style={{ background: "linear-gradient(135deg, var(--primary) 0%, var(--primary-dark) 100%)" }}>
            Save
          </button>
        </div>
      </div>

      {/* Timeline */}
      <div className="px-5 mt-6">
        <h2 className="text-base font-bold mb-3">Faith journey</h2>
        <div className="space-y-2.5">
          {timeline.map(item => (
            <div key={item.id} className="card-soft p-3 flex gap-3">
              <div className="w-9 h-9 rounded-full bg-primary-light text-primary grid place-items-center shrink-0">
                {item.type === "prayer" ? <HeartHandshake className="w-4 h-4" /> :
                  item.type === "note" ? <MessageSquarePlus className="w-4 h-4" /> :
                  <CheckCircle2 className="w-4 h-4" />}
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-[11px] uppercase tracking-wide text-muted-foreground font-bold">{item.type === "attend" ? "Attendance" : item.type} · {item.date}</p>
                <p className="text-sm mt-0.5">{item.text}</p>
              </div>
            </div>
          ))}
          {timeline.length === 0 && <p className="text-sm text-muted-foreground text-center py-6">No history yet.</p>}
        </div>
      </div>
      <div className="h-6" />
    </>
  );
}
