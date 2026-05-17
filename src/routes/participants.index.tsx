import { createFileRoute, Link } from "@tanstack/react-router";
import { Avatar, PageHeader } from "@/components/Primitives";
import { cohorts, getGroup, getUser, participants } from "@/lib/mock-data";
import { useSelectedCohortId } from "@/lib/store";
import { Phone, Search, UserPlus } from "lucide-react";
import { useState } from "react";

export const Route = createFileRoute("/participants/")({ component: ParticipantsPage });

function ParticipantsPage() {
  const cohortId = useSelectedCohortId();
  const [q, setQ] = useState("");
  const filtered = participants.filter(p => p.cohortId === cohortId && p.name.toLowerCase().includes(q.toLowerCase()));

  return (
    <div>
      <PageHeader title="Participants" subtitle={`${cohorts.find(c => c.id === cohortId)?.name} · ${filtered.length} participants`} action={
        <button className="inline-flex items-center gap-2 bg-primary text-primary-foreground px-4 py-2.5 rounded-xl font-semibold hover:bg-primary-dark"><UserPlus className="w-4 h-4" /> Add Participant</button>
      } />

      <div className="card-soft p-4 mb-4 relative">
        <Search className="absolute left-7 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
        <input value={q} onChange={e => setQ(e.target.value)} placeholder="Search participants…" className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-muted/50 border border-transparent focus:border-primary focus:bg-card focus:outline-none text-sm" />
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
        {filtered.map(p => {
          const group = getGroup(p.groupId);
          const support = p.supportId ? getUser(p.supportId) : null;
          return (
            <Link to="/participants/$id" params={{ id: p.id }} key={p.id} className="card-soft p-5 text-center hover:-translate-y-0.5 transition group">
              <div className="grid place-items-center mb-3"><Avatar name={p.name} color={p.avatarColor} size={56} /></div>
              <p className="font-semibold truncate">{p.name}</p>
              <p className="text-xs text-muted-foreground mt-0.5 truncate">{group?.name ?? "Unassigned"}</p>
              <div className="mt-4 pt-4 border-t border-border space-y-1.5 text-xs">
                <p className="text-muted-foreground flex items-center justify-center gap-1.5"><Phone className="w-3 h-3" /> {p.phone}</p>
                {support && <p className="text-muted-foreground truncate">Support: <span className="text-foreground font-medium">{support.name}</span></p>}
              </div>
            </Link>
          );
        })}
        {filtered.length === 0 && <div className="col-span-full card-soft p-10 text-center text-muted-foreground text-sm">No participants in this cohort.</div>}
      </div>
    </div>
  );
}
