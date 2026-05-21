import { createFileRoute, Link } from "@tanstack/react-router";
import { SupportHeader } from "@/components/support/SupportUI";
import { Avatar } from "@/components/Primitives";
import { participants, prayerRequests } from "@/lib/mock-data";
import { useCurrentUser } from "@/lib/auth-store";
import { ChevronRight, Search } from "lucide-react";
import { useState } from "react";

export const Route = createFileRoute("/support/participants/")({ component: ParticipantsList });

function ParticipantsList() {
  const user = useCurrentUser();
  const supportId = user?.id ?? "u-3";
  const [q, setQ] = useState("");
  const mine = participants.filter(p => p.supportId === supportId && p.name.toLowerCase().includes(q.toLowerCase()));

  return (
    <>
      <SupportHeader subtitle={`${mine.length} people in your care`} />
      <div className="px-5 mt-2">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <input value={q} onChange={e => setQ(e.target.value)} placeholder="Search participants…"
            className="w-full pl-9 pr-3 py-2.5 rounded-xl bg-card border border-border focus:outline-none focus:ring-2 focus:ring-primary text-sm" />
        </div>
      </div>
      <div className="px-5 mt-4 space-y-2.5">
        {mine.map(p => {
          const last = prayerRequests.filter(pr => pr.participantId === p.id).sort((a,b) => b.date.localeCompare(a.date))[0];
          return (
            <Link key={p.id} to="/support/participants/$id" params={{ id: p.id }} className="card-soft p-3 flex items-center gap-3 active:bg-muted transition">
              <Avatar name={p.name} color={p.avatarColor} size={48} />
              <div className="flex-1 min-w-0">
                <p className="font-semibold truncate">{p.name}</p>
                <p className="text-xs text-muted-foreground truncate">{p.phone}</p>
                <p className="text-[11px] text-muted-foreground mt-0.5">Last prayer: {last?.date ?? "—"}</p>
              </div>
              <ChevronRight className="w-4 h-4 text-muted-foreground" />
            </Link>
          );
        })}
        {mine.length === 0 && <p className="text-sm text-center text-muted-foreground py-12">No participants assigned yet.</p>}
      </div>
      <div className="h-6" />
    </>
  );
}
