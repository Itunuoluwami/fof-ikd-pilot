import { createFileRoute } from "@tanstack/react-router";
import { Avatar, PageHeader, StatusBadge } from "@/components/Primitives";
import { getParticipant, getUser, prayerRequests } from "@/lib/mock-data";
import { ChevronDown, ChevronRight } from "lucide-react";
import { useState } from "react";

export const Route = createFileRoute("/faith-projects")({ component: FaithProjectsPage });

function FaithProjectsPage() {
  const [open, setOpen] = useState<string>(prayerRequests[0]?.id ?? "");
  const [filter, setFilter] = useState<string>("ALL");
  const filtered = filter === "ALL" ? prayerRequests : prayerRequests.filter(p => p.status === filter);

  return (
    <div>
      <PageHeader title="Faith Projects" subtitle="Prayer requests submitted by Supports on behalf of participants." />

      <div className="flex gap-2 mb-4 overflow-x-auto scrollbar-thin">
        {["ALL", "OPEN", "IN_PROGRESS", "ANSWERED"].map(s => (
          <button key={s} onClick={() => setFilter(s)} className={`px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap transition ${filter === s ? "bg-primary text-primary-foreground" : "bg-muted hover:bg-border"}`}>
            {s.replace("_", " ")}
          </button>
        ))}
      </div>

      <div className="space-y-3">
        {filtered.map(pr => {
          const p = getParticipant(pr.participantId);
          const s = getUser(pr.submittedById);
          const isOpen = open === pr.id;
          return (
            <div key={pr.id} className="card-soft overflow-hidden">
              <button onClick={() => setOpen(isOpen ? "" : pr.id)} className="w-full flex items-center gap-4 p-5 hover:bg-muted/30">
                {p && <Avatar name={p.name} color={p.avatarColor} size={44} />}
                <div className="flex-1 text-left min-w-0">
                  <p className="font-semibold">{p?.name}</p>
                  <p className="text-xs text-muted-foreground truncate">Submitted by {s?.name} · {new Date(pr.date).toLocaleDateString("en-GB")}</p>
                </div>
                <StatusBadge status={pr.status.replace("_", " ")} tone={pr.status === "ANSWERED" ? "success" : pr.status === "IN_PROGRESS" ? "warning" : "neutral"} />
                {isOpen ? <ChevronDown className="w-5 h-5" /> : <ChevronRight className="w-5 h-5" />}
              </button>
              {isOpen && (
                <div className="border-t border-border p-5 bg-muted/20">
                  <p className="text-sm leading-relaxed">{pr.text}</p>
                  <div className="flex gap-2 mt-4">
                    <button className="px-3 py-1.5 text-xs font-semibold rounded-lg bg-primary text-primary-foreground hover:bg-primary-dark">Mark in progress</button>
                    <button className="px-3 py-1.5 text-xs font-semibold rounded-lg bg-muted hover:bg-border">Mark answered</button>
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
