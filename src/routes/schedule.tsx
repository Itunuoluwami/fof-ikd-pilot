import { createFileRoute } from "@tanstack/react-router";
import { PageHeader } from "@/components/Primitives";
import { users, initials } from "@/lib/mock-data";
import {
  useAdminSchedules,
  createAdminSchedule,
  deleteAdminSchedule,
  suggestEndDate,
  type ScheduleFrequency,
} from "@/lib/admin-schedules";
import type { TaskPriority } from "@/lib/support-data";
import { Plus, Trash2, Users, MapPin, Clock, CalendarDays, Repeat, X } from "lucide-react";
import { useMemo, useState } from "react";
import { toast } from "sonner";

export const Route = createFileRoute("/schedule")({ component: SchedulePage });

const freqLabel: Record<ScheduleFrequency, string> = {
  DAILY: "Daily",
  WEEKLY: "Weekly",
  MONTHLY: "Monthly",
};
const freqTone: Record<ScheduleFrequency, string> = {
  DAILY: "bg-blue-100 text-blue-700",
  WEEKLY: "bg-primary-light text-primary",
  MONTHLY: "bg-purple-100 text-purple-700",
};
const priTone: Record<TaskPriority, string> = {
  HIGH: "bg-red-100 text-red-700",
  MEDIUM: "bg-amber-100 text-amber-700",
  LOW: "bg-muted text-muted-foreground",
};

function SchedulePage() {
  const schedules = useAdminSchedules();
  const [open, setOpen] = useState(false);

  const supportUsers = useMemo(
    () => users.filter(u => u.role === "SUPPORT" && u.status === "ACTIVE"),
    [],
  );

  function handleDelete(id: string, title: string) {
    if (!confirm(`Delete schedule "${title}"? This cannot be undone.`)) return;
    deleteAdminSchedule(id);
    toast.success("Schedule deleted", { description: title });
  }

  return (
    <div>
      <PageHeader
        title="Schedules"
        subtitle="Create daily, weekly, or monthly schedules and assign them to supports."
        action={
          <button
            onClick={() => setOpen(true)}
            aria-label="Create Schedule"
            className="ml-auto inline-flex items-center justify-center gap-2 bg-primary text-primary-foreground p-2.5 sm:px-4 sm:py-2.5 rounded-xl font-semibold hover:bg-primary/90 transition"
          >
            <Plus className="w-4 h-4" />
            <span className="hidden sm:inline">Create Schedule</span>
          </button>
        }
      />

      {schedules.length === 0 ? (
        <div className="card-soft p-10 text-center">
          <CalendarDays className="w-10 h-10 text-muted-foreground mx-auto mb-3" />
          <p className="font-semibold">No schedules yet</p>
          <p className="text-sm text-muted-foreground mt-1">
            Create a recurring schedule and assign it to one or more supports.
          </p>
          <button
            onClick={() => setOpen(true)}
            className="mt-4 inline-flex items-center gap-2 bg-primary text-primary-foreground px-4 py-2 rounded-xl font-semibold hover:bg-primary-dark"
          >
            <Plus className="w-4 h-4" /> Create your first schedule
          </button>
        </div>
      ) : (
        <div className="space-y-3">
          {schedules.map(s => {
            const assigned = supportUsers.filter(u => s.supportIds.includes(u.id));
            return (
              <div key={s.id} className="card-soft p-5">
                <div className="flex items-start justify-between gap-4 flex-wrap">
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center gap-2 flex-wrap">
                      <h3 className="font-semibold truncate">{s.title}</h3>
                      <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${freqTone[s.frequency]}`}>
                        <Repeat className="w-3 h-3 inline mr-1" />{freqLabel[s.frequency]}
                      </span>
                      <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${priTone[s.priority]}`}>
                        {s.priority}
                      </span>
                    </div>
                    <div className="flex flex-wrap items-center gap-x-4 gap-y-1 mt-2 text-xs text-muted-foreground">
                      <span className="inline-flex items-center gap-1"><Clock className="w-3 h-3" /> {s.time}</span>
                      <span className="inline-flex items-center gap-1"><MapPin className="w-3 h-3" /> {s.location}</span>
                      <span className="inline-flex items-center gap-1">
                        <CalendarDays className="w-3 h-3" /> {s.startDate} → {s.endDate}
                      </span>
                    </div>
                    <div className="mt-3 flex items-center gap-2 flex-wrap">
                      <Users className="w-3.5 h-3.5 text-muted-foreground" />
                      {assigned.length === 0 ? (
                        <span className="text-xs text-muted-foreground">No supports assigned</span>
                      ) : (
                        assigned.map(u => (
                          <span key={u.id} className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full bg-muted text-xs font-medium">
                            <span
                              className="w-4 h-4 rounded-full grid place-items-center text-[9px] font-bold text-white"
                              style={{ backgroundColor: u.avatarColor }}
                            >
                              {initials(u.name)}
                            </span>
                            {u.name}
                          </span>
                        ))
                      )}
                    </div>
                  </div>
                  <button
                    onClick={() => handleDelete(s.id, s.title)}
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-border text-destructive hover:bg-destructive/10 text-xs font-semibold"
                  >
                    <Trash2 className="w-3.5 h-3.5" /> Delete
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {open && (
        <CreateScheduleModal
          supportUsers={supportUsers}
          onClose={() => setOpen(false)}
        />
      )}
    </div>
  );
}

function CreateScheduleModal({
  supportUsers,
  onClose,
}: {
  supportUsers: typeof users;
  onClose: () => void;
}) {
  const today = new Date().toISOString().slice(0, 10);
  const [title, setTitle] = useState("");
  const [time, setTime] = useState("09:00");
  const [location, setLocation] = useState("");
  const [priority, setPriority] = useState<TaskPriority>("MEDIUM");
  const [frequency, setFrequency] = useState<ScheduleFrequency>("WEEKLY");
  const [startDate, setStartDate] = useState(today);
  const [endDate, setEndDate] = useState(() => suggestEndDate(today, "WEEKLY"));
  const [supportIds, setSupportIds] = useState<string[]>([]);

  function toggleSupport(id: string) {
    setSupportIds(prev => prev.includes(id) ? prev.filter(x => x !== id) : [...prev, id]);
  }

  function changeFrequency(f: ScheduleFrequency) {
    setFrequency(f);
    setEndDate(suggestEndDate(startDate, f));
  }

  function changeStart(d: string) {
    setStartDate(d);
    setEndDate(suggestEndDate(d, frequency));
  }

  function submit(e: React.FormEvent) {
    e.preventDefault();
    if (!title.trim()) return toast.error("Title is required");
    if (!location.trim()) return toast.error("Location is required");
    if (supportIds.length === 0) return toast.error("Assign at least one support");
    if (endDate < startDate) return toast.error("End date must be after start date");

    createAdminSchedule({
      title: title.trim(),
      time,
      location: location.trim(),
      priority,
      frequency,
      startDate,
      endDate,
      supportIds,
    });
    toast.success("Schedule created", {
      description: `${freqLabel[frequency]} · assigned to ${supportIds.length} support${supportIds.length === 1 ? "" : "s"}`,
    });
    onClose();
  }

  return (
    <div className="fixed inset-0 z-50 bg-black/50 grid place-items-center p-4" onClick={onClose}>
      <form
        onSubmit={submit}
        onClick={e => e.stopPropagation()}
        className="bg-card rounded-2xl shadow-2xl w-full max-w-lg max-h-[90vh] overflow-y-auto"
      >
        <div className="flex items-center justify-between p-5 border-b border-border sticky top-0 bg-card">
          <h2 className="text-lg font-bold">Create schedule</h2>
          <button type="button" onClick={onClose} className="w-8 h-8 grid place-items-center rounded-lg hover:bg-muted">
            <X className="w-4 h-4" />
          </button>
        </div>

        <div className="p-5 space-y-4">
          <Field label="Title">
            <input
              autoFocus
              value={title}
              onChange={e => setTitle(e.target.value)}
              placeholder="e.g. Morning Devotion"
              className="w-full px-3 py-2 rounded-lg border border-border bg-background text-sm focus:outline-none focus:ring-2 focus:ring-primary"
            />
          </Field>

          <div className="grid grid-cols-2 gap-3">
            <Field label="Time">
              <input
                type="time"
                value={time}
                onChange={e => setTime(e.target.value)}
                className="w-full px-3 py-2 rounded-lg border border-border bg-background text-sm focus:outline-none focus:ring-2 focus:ring-primary"
              />
            </Field>
            <Field label="Priority">
              <select
                value={priority}
                onChange={e => setPriority(e.target.value as TaskPriority)}
                className="w-full px-3 py-2 rounded-lg border border-border bg-background text-sm focus:outline-none focus:ring-2 focus:ring-primary"
              >
                <option value="HIGH">High</option>
                <option value="MEDIUM">Medium</option>
                <option value="LOW">Low</option>
              </select>
            </Field>
          </div>

          <Field label="Location">
            <input
              value={location}
              onChange={e => setLocation(e.target.value)}
              placeholder="e.g. Main Auditorium"
              className="w-full px-3 py-2 rounded-lg border border-border bg-background text-sm focus:outline-none focus:ring-2 focus:ring-primary"
            />
          </Field>

          <Field label="Frequency">
            <div className="grid grid-cols-3 gap-2">
              {(["DAILY", "WEEKLY", "MONTHLY"] as ScheduleFrequency[]).map(f => (
                <button
                  key={f}
                  type="button"
                  onClick={() => changeFrequency(f)}
                  className={`px-3 py-2 rounded-lg text-sm font-semibold border transition ${
                    frequency === f
                      ? "bg-primary text-primary-foreground border-primary"
                      : "bg-background border-border hover:border-primary"
                  }`}
                >
                  {freqLabel[f]}
                </button>
              ))}
            </div>
          </Field>

          <div className="grid grid-cols-2 gap-3">
            <Field label="Starts">
              <input
                type="date"
                value={startDate}
                onChange={e => changeStart(e.target.value)}
                className="w-full px-3 py-2 rounded-lg border border-border bg-background text-sm focus:outline-none focus:ring-2 focus:ring-primary"
              />
            </Field>
            <Field label="Ends">
              <input
                type="date"
                value={endDate}
                min={startDate}
                onChange={e => setEndDate(e.target.value)}
                className="w-full px-3 py-2 rounded-lg border border-border bg-background text-sm focus:outline-none focus:ring-2 focus:ring-primary"
              />
            </Field>
          </div>

          <Field label={`Assign to supports (${supportIds.length} selected)`}>
            <div className="border border-border rounded-lg max-h-48 overflow-y-auto divide-y divide-border">
              {supportUsers.length === 0 ? (
                <p className="p-3 text-sm text-muted-foreground">No active supports found.</p>
              ) : supportUsers.map(u => {
                const checked = supportIds.includes(u.id);
                return (
                  <label
                    key={u.id}
                    className="flex items-center gap-3 p-2.5 hover:bg-muted/40 cursor-pointer"
                  >
                    <input
                      type="checkbox"
                      checked={checked}
                      onChange={() => toggleSupport(u.id)}
                      className="w-4 h-4 accent-primary"
                    />
                    <span
                      className="w-7 h-7 rounded-full grid place-items-center text-[10px] font-bold text-white"
                      style={{ backgroundColor: u.avatarColor }}
                    >
                      {initials(u.name)}
                    </span>
                    <span className="text-sm font-medium">{u.name}</span>
                  </label>
                );
              })}
            </div>
          </Field>
        </div>

        <div className="flex justify-end gap-2 p-5 border-t border-border sticky bottom-0 bg-card">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 rounded-lg border border-border text-sm font-semibold hover:bg-muted"
          >
            Cancel
          </button>
          <button
            type="submit"
            className="px-4 py-2 rounded-lg bg-primary text-primary-foreground text-sm font-semibold hover:bg-primary-dark"
          >
            Create schedule
          </button>
        </div>
      </form>
    </div>
  );
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div>
      <label className="block text-xs font-semibold text-muted-foreground mb-1.5">{label}</label>
      {children}
    </div>
  );
}
