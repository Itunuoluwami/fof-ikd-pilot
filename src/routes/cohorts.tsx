import { createFileRoute } from "@tanstack/react-router";
import { Avatar, PageHeader } from "@/components/Primitives";
import { cohorts, groups, participants, users } from "@/lib/mock-data";
import { ChevronDown, ChevronRight, Layers, Plus, Users as UsersIcon } from "lucide-react";
import { useState } from "react";

export const Route = createFileRoute("/cohorts")({ component: CohortsPage });

function CohortsPage() {
  const [openCohort, setOpenCohort] = useState<string>(cohorts[0].id);
  const [openGroup, setOpenGroup] = useState<string>("");

  return (
    <div>
      <PageHeader title="Cohorts & Groups" subtitle="Organize participants and supports." action={
        <div className="flex gap-2">
          <button className="inline-flex items-center gap-2 bg-muted text-foreground px-4 py-2.5 rounded-xl font-semibold hover:bg-border"><Plus className="w-4 h-4" /> Group</button>
          <button className="inline-flex items-center gap-2 bg-primary text-primary-foreground px-4 py-2.5 rounded-xl font-semibold hover:bg-primary-dark"><Plus className="w-4 h-4" /> Cohort</button>
        </div>
      } />

      <div className="space-y-4">
        {cohorts.map(c => {
          const cohortGroups = groups.filter(g => g.cohortId === c.id);
          const isOpen = openCohort === c.id;
          return (
            <div key={c.id} className="card-soft overflow-hidden">
              <button onClick={() => setOpenCohort(isOpen ? "" : c.id)} className="w-full flex items-center justify-between p-5 hover:bg-muted/40">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-xl bg-primary-light text-primary grid place-items-center"><Layers className="w-5 h-5" /></div>
                  <div className="text-left">
                    <p className="font-semibold">{c.name}</p>
                    <p className="text-xs text-muted-foreground">{c.participantCount} participants · {cohortGroups.length} groups</p>
                  </div>
                </div>
                {isOpen ? <ChevronDown className="w-5 h-5" /> : <ChevronRight className="w-5 h-5" />}
              </button>
              {isOpen && (
                <div className="border-t border-border p-5 space-y-3 bg-muted/20">
                  {cohortGroups.length === 0 && <p className="text-sm text-muted-foreground">No groups in this cohort yet.</p>}
                  {cohortGroups.map(g => {
                    const gOpen = openGroup === g.id;
                    const groupParticipants = participants.filter(p => p.groupId === g.id);
                    const supports = users.filter(u => g.supportIds.includes(u.id));
                    return (
                      <div key={g.id} className="bg-card rounded-xl border border-border">
                        <button onClick={() => setOpenGroup(gOpen ? "" : g.id)} className="w-full flex items-center justify-between p-4">
                          <div className="flex items-center gap-3">
                            <div className="w-9 h-9 rounded-lg bg-muted grid place-items-center"><UsersIcon className="w-4 h-4 text-muted-foreground" /></div>
                            <div className="text-left">
                              <p className="font-semibold text-sm">{g.name}</p>
                              <p className="text-xs text-muted-foreground">{groupParticipants.length} participants · {supports.length} supports</p>
                            </div>
                          </div>
                          {gOpen ? <ChevronDown className="w-4 h-4" /> : <ChevronRight className="w-4 h-4" />}
                        </button>
                        {gOpen && (
                          <div className="border-t border-border p-4 space-y-4">
                            <div>
                              <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-2">Supports</p>
                              <div className="flex flex-wrap gap-2">
                                {supports.map(s => <Pill key={s.id} name={s.name} color={s.avatarColor} />)}
                                {supports.length === 0 && <p className="text-sm text-muted-foreground">No support assigned</p>}
                              </div>
                            </div>
                            <div>
                              <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-2">Participants</p>
                              <div className="flex flex-wrap gap-2">
                                {groupParticipants.map(p => <Pill key={p.id} name={p.name} color={p.avatarColor} />)}
                              </div>
                            </div>
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}

function Pill({ name, color }: { name: string; color: string }) {
  return (
    <div className="inline-flex items-center gap-2 pl-1 pr-3 py-1 rounded-full bg-muted/50">
      <Avatar name={name} color={color} size={24} />
      <span className="text-sm">{name}</span>
    </div>
  );
}
