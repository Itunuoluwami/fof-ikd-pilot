import { createFileRoute } from "@tanstack/react-router";
import { Avatar, PageHeader } from "@/components/Primitives";
import { cohorts, participants, users } from "@/lib/mock-data";
import { createGroup, deleteGroup, updateGroupAssignments, useAdminGroups } from "@/lib/admin-groups";
import { ChevronDown, ChevronRight, Layers, Plus, Users as UsersIcon, Trash2, X, UserPlus } from "lucide-react";
import { useMemo, useState } from "react";

export const Route = createFileRoute("/cohorts")({ component: CohortsPage });

function CohortsPage() {
  const groups = useAdminGroups();
  const ongoingCohorts = useMemo(() => cohorts.filter(c => c.status === "ONGOING"), []);
  const [openCohort, setOpenCohort] = useState<string>(ongoingCohorts[0]?.id ?? "");
  const [openGroup, setOpenGroup] = useState<string>("");
  const [createForCohort, setCreateForCohort] = useState<string | null>(null);
  const [assignFor, setAssignFor] = useState<string | null>(null);

  return (
    <div>
      <PageHeader title="Groups" subtitle="Organize participants and supports." action={
        <button
          onClick={() => setCreateForCohort(openCohort || ongoingCohorts[0]?.id || null)}
          disabled={ongoingCohorts.length === 0}
          className="inline-flex items-center gap-2 bg-primary text-primary-foreground px-4 py-2.5 rounded-xl font-semibold hover:bg-primary-dark disabled:opacity-50"
        >
          <Plus className="w-4 h-4" /> New Group
        </button>
      } />

      <div className="space-y-4">
        {ongoingCohorts.length === 0 && (
          <div className="card-soft p-10 text-center text-sm text-muted-foreground">No ongoing cohorts.</div>
        )}
        {ongoingCohorts.map(c => {
          const cohortGroups = groups.filter(g => g.cohortId === c.id);
          const isOpen = openCohort === c.id;
          return (
            <div key={c.id} className="card-soft overflow-hidden">
              <div className="w-full flex items-center justify-between p-5 hover:bg-muted/40">
                <button onClick={() => setOpenCohort(isOpen ? "" : c.id)} className="flex items-center gap-4 flex-1 text-left">
                  <div className="w-12 h-12 rounded-xl bg-primary-light text-primary grid place-items-center"><Layers className="w-5 h-5" /></div>
                  <div>
                    <p className="font-semibold">{c.name} <span className="ml-2 text-[10px] uppercase tracking-wider bg-success/15 text-success px-2 py-0.5 rounded-full align-middle">Ongoing</span></p>
                    <p className="text-xs text-muted-foreground">{c.participantCount} participants · {cohortGroups.length} groups</p>
                  </div>
                </button>
                <div className="flex items-center gap-2">
                  <button onClick={() => setCreateForCohort(c.id)} className="inline-flex items-center gap-1.5 text-xs font-semibold bg-muted hover:bg-border text-foreground px-3 py-1.5 rounded-lg">
                    <Plus className="w-3.5 h-3.5" /> Group
                  </button>
                  <button onClick={() => setOpenCohort(isOpen ? "" : c.id)}>
                    {isOpen ? <ChevronDown className="w-5 h-5" /> : <ChevronRight className="w-5 h-5" />}
                  </button>
                </div>
              </div>
              {isOpen && (
                <div className="border-t border-border p-5 space-y-3 bg-muted/20">
                  {cohortGroups.length === 0 && <p className="text-sm text-muted-foreground">No groups in this cohort yet.</p>}
                  {cohortGroups.map(g => {
                    const gOpen = openGroup === g.id;
                    const groupParticipants = participants.filter(p => g.participantIds.includes(p.id));
                    const supports = users.filter(u => g.supportIds.includes(u.id));
                    return (
                      <div key={g.id} className="bg-card rounded-xl border border-border">
                        <div className="w-full flex items-center justify-between p-4">
                          <button onClick={() => setOpenGroup(gOpen ? "" : g.id)} className="flex items-center gap-3 flex-1 text-left">
                            <div className="w-9 h-9 rounded-lg bg-muted grid place-items-center"><UsersIcon className="w-4 h-4 text-muted-foreground" /></div>
                            <div>
                              <p className="font-semibold text-sm">{g.name}</p>
                              <p className="text-xs text-muted-foreground">{groupParticipants.length} participants · {supports.length} supports</p>
                            </div>
                          </button>
                          <div className="flex items-center gap-2">
                            <button onClick={() => setAssignFor(g.id)} className="inline-flex items-center gap-1.5 text-xs font-semibold bg-primary-light text-primary px-3 py-1.5 rounded-lg hover:opacity-90">
                              <UserPlus className="w-3.5 h-3.5" /> Assign
                            </button>
                            <button
                              onClick={() => { if (confirm(`Delete ${g.name}?`)) deleteGroup(g.id); }}
                              className="inline-flex items-center justify-center w-8 h-8 rounded-lg text-destructive hover:bg-destructive/10"
                              aria-label="Delete group"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                            <button onClick={() => setOpenGroup(gOpen ? "" : g.id)}>
                              {gOpen ? <ChevronDown className="w-4 h-4" /> : <ChevronRight className="w-4 h-4" />}
                            </button>
                          </div>
                        </div>
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
                                {groupParticipants.length === 0 && <p className="text-sm text-muted-foreground">No participants assigned</p>}
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

      {createForCohort && (
        <CreateGroupModal
          cohortId={createForCohort}
          onClose={() => setCreateForCohort(null)}
          onCreated={(g) => { setOpenCohort(g.cohortId); setOpenGroup(g.id); setCreateForCohort(null); }}
        />
      )}
      {assignFor && (
        <AssignModal
          groupId={assignFor}
          group={groups.find(g => g.id === assignFor)!}
          onClose={() => setAssignFor(null)}
        />
      )}
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

function CreateGroupModal({ cohortId, onClose, onCreated }: { cohortId: string; onClose: () => void; onCreated: (g: { id: string; cohortId: string }) => void }) {
  const ongoing = cohorts.filter(c => c.status === "ONGOING");
  const [name, setName] = useState("");
  const [selectedCohort, setSelectedCohort] = useState(cohortId);
  const [supportIds, setSupportIds] = useState<string[]>([]);
  const [participantIds, setParticipantIds] = useState<string[]>([]);

  const availableSupports = users.filter(u => u.role === "SUPPORT" && u.status === "ACTIVE");
  const availableParticipants = participants.filter(p => p.cohortId === selectedCohort);

  function toggle(arr: string[], id: string, set: (v: string[]) => void) {
    set(arr.includes(id) ? arr.filter(x => x !== id) : [...arr, id]);
  }

  function submit() {
    if (!name.trim()) return;
    const g = createGroup({ name, cohortId: selectedCohort, supportIds, participantIds });
    onCreated(g);
  }

  return (
    <Modal title="Create new group" onClose={onClose}>
      <div className="space-y-4">
        <Field label="Group name">
          <input value={name} onChange={e => setName(e.target.value)} placeholder="e.g. Group Delta"
            className="w-full px-3 py-2.5 rounded-xl border border-border bg-background text-sm focus:outline-none focus:ring-2 focus:ring-primary" />
        </Field>
        <Field label="Cohort">
          <select value={selectedCohort} onChange={e => { setSelectedCohort(e.target.value); setParticipantIds([]); }}
            className="w-full px-3 py-2.5 rounded-xl border border-border bg-background text-sm focus:outline-none focus:ring-2 focus:ring-primary">
            {ongoing.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
          </select>
        </Field>
        <Field label={`Assign supports (${supportIds.length})`}>
          <CheckList items={availableSupports.map(u => ({ id: u.id, name: u.name, color: u.avatarColor }))} selected={supportIds} onToggle={(id) => toggle(supportIds, id, setSupportIds)} />
        </Field>
        <Field label={`Assign participants (${participantIds.length})`}>
          <CheckList items={availableParticipants.map(p => ({ id: p.id, name: p.name, color: p.avatarColor }))} selected={participantIds} onToggle={(id) => toggle(participantIds, id, setParticipantIds)} empty="No participants in this cohort." />
        </Field>
        <div className="flex justify-end gap-2 pt-2">
          <button onClick={onClose} className="px-4 py-2 rounded-xl bg-muted text-sm font-semibold hover:bg-border">Cancel</button>
          <button onClick={submit} disabled={!name.trim()} className="px-4 py-2 rounded-xl bg-primary text-primary-foreground text-sm font-semibold hover:bg-primary-dark disabled:opacity-50">Create group</button>
        </div>
      </div>
    </Modal>
  );
}

function AssignModal({ groupId, group, onClose }: { groupId: string; group: { name: string; cohortId: string; supportIds: string[]; participantIds: string[] }; onClose: () => void }) {
  const [supportIds, setSupportIds] = useState<string[]>(group.supportIds);
  const [participantIds, setParticipantIds] = useState<string[]>(group.participantIds);
  const availableSupports = users.filter(u => u.role === "SUPPORT" && u.status === "ACTIVE");
  const availableParticipants = participants.filter(p => p.cohortId === group.cohortId);

  function toggle(arr: string[], id: string, set: (v: string[]) => void) {
    set(arr.includes(id) ? arr.filter(x => x !== id) : [...arr, id]);
  }
  function save() {
    updateGroupAssignments(groupId, { supportIds, participantIds });
    onClose();
  }

  return (
    <Modal title={`Assign — ${group.name}`} onClose={onClose}>
      <div className="space-y-4">
        <Field label={`Supports (${supportIds.length})`}>
          <CheckList items={availableSupports.map(u => ({ id: u.id, name: u.name, color: u.avatarColor }))} selected={supportIds} onToggle={(id) => toggle(supportIds, id, setSupportIds)} />
        </Field>
        <Field label={`Participants (${participantIds.length})`}>
          <CheckList items={availableParticipants.map(p => ({ id: p.id, name: p.name, color: p.avatarColor }))} selected={participantIds} onToggle={(id) => toggle(participantIds, id, setParticipantIds)} empty="No participants in this cohort." />
        </Field>
        <div className="flex justify-end gap-2 pt-2">
          <button onClick={onClose} className="px-4 py-2 rounded-xl bg-muted text-sm font-semibold hover:bg-border">Cancel</button>
          <button onClick={save} className="px-4 py-2 rounded-xl bg-primary text-primary-foreground text-sm font-semibold hover:bg-primary-dark">Save</button>
        </div>
      </div>
    </Modal>
  );
}

function Modal({ title, onClose, children }: { title: string; onClose: () => void; children: React.ReactNode }) {
  return (
    <div className="fixed inset-0 z-50 grid place-items-center bg-black/40 p-4" onClick={onClose}>
      <div className="bg-card rounded-2xl w-full max-w-lg max-h-[90vh] overflow-hidden flex flex-col" onClick={e => e.stopPropagation()}>
        <div className="flex items-center justify-between p-5 border-b border-border">
          <h2 className="font-bold text-lg">{title}</h2>
          <button onClick={onClose} className="w-8 h-8 grid place-items-center rounded-lg hover:bg-muted"><X className="w-4 h-4" /></button>
        </div>
        <div className="p-5 overflow-y-auto">{children}</div>
      </div>
    </div>
  );
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div>
      <label className="block text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-1.5">{label}</label>
      {children}
    </div>
  );
}

function CheckList({ items, selected, onToggle, empty }: { items: { id: string; name: string; color: string }[]; selected: string[]; onToggle: (id: string) => void; empty?: string }) {
  if (items.length === 0) return <p className="text-sm text-muted-foreground">{empty ?? "Nothing available."}</p>;
  return (
    <div className="max-h-48 overflow-y-auto border border-border rounded-xl divide-y divide-border">
      {items.map(it => {
        const checked = selected.includes(it.id);
        return (
          <label key={it.id} className="flex items-center gap-3 p-2.5 cursor-pointer hover:bg-muted/40">
            <input type="checkbox" checked={checked} onChange={() => onToggle(it.id)} className="w-4 h-4 accent-primary" />
            <Avatar name={it.name} color={it.color} size={28} />
            <span className="text-sm">{it.name}</span>
          </label>
        );
      })}
    </div>
  );
}
