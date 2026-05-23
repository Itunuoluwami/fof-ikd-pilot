import { createFileRoute } from "@tanstack/react-router";
import { SupportHeader } from "@/components/support/SupportUI";
import { supportTasks, priorityTone, type SupportTask } from "@/lib/support-data";
import { useCurrentUser } from "@/lib/auth-store";
import { Clock, MapPin, ChevronLeft, ChevronRight, Download, CalendarDays, Grid3x3 } from "lucide-react";
import { useMemo, useState } from "react";
import { Button } from "@/components/ui/button";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";

export const Route = createFileRoute("/support/schedule")({ component: SupportSchedule });

type View = "week" | "month";

function startOfWeek(d: Date) {
  const x = new Date(d);
  const day = (x.getDay() + 6) % 7; // Monday=0
  x.setDate(x.getDate() - day);
  x.setHours(0, 0, 0, 0);
  return x;
}
function addDays(d: Date, n: number) { const x = new Date(d); x.setDate(x.getDate() + n); return x; }
function fmtDate(d: Date) { return d.toISOString().slice(0, 10); }
function sameMonth(a: Date, b: Date) { return a.getFullYear() === b.getFullYear() && a.getMonth() === b.getMonth(); }
const statusTone: Record<SupportTask["status"], string> = {
  NOT_STARTED: "bg-muted text-muted-foreground",
  IN_PROGRESS: "bg-primary-light text-primary",
  DONE: "bg-emerald-100 text-emerald-700",
};
const priClass: Record<string, string> = {
  danger: "bg-red-100 text-red-700",
  warning: "bg-amber-100 text-amber-700",
  neutral: "bg-muted text-muted-foreground",
};

function SupportSchedule() {
  const user = useCurrentUser();
  const [view, setView] = useState<View>("week");
  const [cursor, setCursor] = useState(() => new Date("2025-05-12"));

  const myTasks = useMemo(
    () => supportTasks.filter((t) => !user || t.supportId === user.id),
    [user],
  );

  const weekStart = startOfWeek(cursor);
  const weekDays = Array.from({ length: 7 }, (_, i) => addDays(weekStart, i));
  const weekEnd = addDays(weekStart, 6);

  const tasksByDate = useMemo(() => {
    const map = new Map<string, SupportTask[]>();
    myTasks.forEach((t) => {
      if (!map.has(t.date)) map.set(t.date, []);
      map.get(t.date)!.push(t);
    });
    map.forEach((arr) => arr.sort((a, b) => a.time.localeCompare(b.time)));
    return map;
  }, [myTasks]);

  function shift(dir: number) {
    const next = new Date(cursor);
    if (view === "week") next.setDate(next.getDate() + 7 * dir);
    else next.setMonth(next.getMonth() + dir);
    setCursor(next);
  }

  function exportPdf() {
    const doc = new jsPDF();
    const title = view === "week"
      ? `Schedule — Week of ${weekStart.toLocaleDateString(undefined, { month: "long", day: "numeric", year: "numeric" })}`
      : `Schedule — ${cursor.toLocaleDateString(undefined, { month: "long", year: "numeric" })}`;
    doc.setFontSize(16);
    doc.text("FOF IKD Ops — My Schedule", 14, 18);
    doc.setFontSize(11);
    doc.setTextColor(120);
    doc.text(`${user?.name ?? "Support"} • ${title}`, 14, 25);

    let range: Date[];
    if (view === "week") range = weekDays;
    else {
      const first = new Date(cursor.getFullYear(), cursor.getMonth(), 1);
      const last = new Date(cursor.getFullYear(), cursor.getMonth() + 1, 0);
      range = Array.from({ length: last.getDate() }, (_, i) => addDays(first, i));
    }

    const rows: string[][] = [];
    range.forEach((d) => {
      const items = tasksByDate.get(fmtDate(d)) ?? [];
      if (items.length === 0) return;
      items.forEach((t, idx) => {
        rows.push([
          idx === 0 ? d.toLocaleDateString(undefined, { weekday: "short", month: "short", day: "numeric" }) : "",
          t.time,
          t.title,
          t.location,
          t.priority,
          t.status.replace("_", " "),
        ]);
      });
    });

    if (rows.length === 0) rows.push(["—", "—", "No tasks in this range", "—", "—", "—"]);

    autoTable(doc, {
      startY: 32,
      head: [["Date", "Time", "Task", "Location", "Priority", "Status"]],
      body: rows,
      styles: { fontSize: 9, cellPadding: 3 },
      headStyles: { fillColor: [255, 145, 77], textColor: 255 },
      alternateRowStyles: { fillColor: [250, 250, 250] },
    });

    const fname = `schedule_${view}_${fmtDate(view === "week" ? weekStart : cursor).slice(0, 10)}.pdf`;
    doc.save(fname);
  }

  const headerTitle =
    view === "week"
      ? `${weekStart.toLocaleDateString(undefined, { month: "short", day: "numeric" })} – ${weekEnd.toLocaleDateString(undefined, { month: "short", day: "numeric", year: "numeric" })}`
      : cursor.toLocaleDateString(undefined, { month: "long", year: "numeric" });

  return (
    <>
      <SupportHeader subtitle="My Schedule" />

      <div className="px-5 mt-2 space-y-4">
        {/* View toggle + export */}
        <div className="flex items-center justify-between gap-3 flex-wrap">
          <div className="inline-flex rounded-xl border border-border bg-card p-1">
            <button
              onClick={() => setView("week")}
              className={`inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold rounded-lg transition ${view === "week" ? "bg-primary text-white" : "text-muted-foreground"}`}
            >
              <CalendarDays className="w-3.5 h-3.5" /> Week
            </button>
            <button
              onClick={() => setView("month")}
              className={`inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold rounded-lg transition ${view === "month" ? "bg-primary text-white" : "text-muted-foreground"}`}
            >
              <Grid3x3 className="w-3.5 h-3.5" /> Month
            </button>
          </div>
          <Button onClick={exportPdf} size="sm" className="bg-primary hover:bg-primary/90 text-white">
            <Download className="w-4 h-4" /> Export PDF
          </Button>
        </div>

        {/* Range nav */}
        <div className="flex items-center justify-between">
          <button onClick={() => shift(-1)} className="w-9 h-9 grid place-items-center rounded-lg border border-border hover:bg-muted">
            <ChevronLeft className="w-4 h-4" />
          </button>
          <p className="font-semibold text-sm">{headerTitle}</p>
          <button onClick={() => shift(1)} className="w-9 h-9 grid place-items-center rounded-lg border border-border hover:bg-muted">
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>

        {view === "week" ? (
          <WeekView days={weekDays} tasksByDate={tasksByDate} />
        ) : (
          <MonthView cursor={cursor} tasksByDate={tasksByDate} onSelectDate={(d) => { setCursor(d); setView("week"); }} />
        )}
      </div>
      <div className="h-6" />
    </>
  );
}

function WeekView({ days, tasksByDate }: { days: Date[]; tasksByDate: Map<string, SupportTask[]> }) {
  return (
    <div className="space-y-4">
      {days.map((d) => {
        const items = tasksByDate.get(fmtDate(d)) ?? [];
        const isToday = fmtDate(d) === fmtDate(new Date());
        return (
          <section key={fmtDate(d)} className="card-soft p-4">
            <div className="flex items-baseline justify-between mb-3">
              <div>
                <p className={`text-xs font-bold uppercase tracking-wide ${isToday ? "text-primary" : "text-muted-foreground"}`}>
                  {d.toLocaleDateString(undefined, { weekday: "long" })} {isToday && "• Today"}
                </p>
                <p className="text-sm font-semibold">{d.toLocaleDateString(undefined, { month: "long", day: "numeric" })}</p>
              </div>
              <span className="text-xs text-muted-foreground">{items.length} task{items.length === 1 ? "" : "s"}</span>
            </div>
            {items.length === 0 ? (
              <p className="text-sm text-muted-foreground">No tasks assigned.</p>
            ) : (
              <ul className="space-y-2">
                {items.map((t) => (
                  <li key={t.id} className="flex items-start gap-3 p-3 rounded-xl bg-background border border-border">
                    <div className="text-xs font-bold text-primary w-12 shrink-0 mt-0.5">{t.time}</div>
                    <div className="flex-1 min-w-0">
                      <p className="font-semibold text-sm">{t.title}</p>
                      <div className="flex flex-wrap items-center gap-2 mt-1 text-xs text-muted-foreground">
                        <span className="inline-flex items-center gap-1"><MapPin className="w-3 h-3" /> {t.location}</span>
                        <span className="inline-flex items-center gap-1"><Clock className="w-3 h-3" /> {t.time}</span>
                      </div>
                    </div>
                    <div className="flex flex-col items-end gap-1 shrink-0">
                      <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${priClass[priorityTone[t.priority]]}`}>{t.priority}</span>
                      <span className={`text-[10px] font-semibold px-2 py-0.5 rounded-full ${statusTone[t.status]}`}>{t.status.replace("_", " ")}</span>
                    </div>
                  </li>
                ))}
              </ul>
            )}
          </section>
        );
      })}
    </div>
  );
}

function MonthView({ cursor, tasksByDate, onSelectDate }: { cursor: Date; tasksByDate: Map<string, SupportTask[]>; onSelectDate: (d: Date) => void }) {
  const first = new Date(cursor.getFullYear(), cursor.getMonth(), 1);
  const gridStart = startOfWeek(first);
  const cells = Array.from({ length: 42 }, (_, i) => addDays(gridStart, i));
  const todayStr = fmtDate(new Date());
  const weekdays = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];

  return (
    <div className="card-soft p-3">
      <div className="grid grid-cols-7 gap-1 mb-2">
        {weekdays.map((w) => (
          <div key={w} className="text-[10px] font-bold text-muted-foreground uppercase text-center py-1">{w}</div>
        ))}
      </div>
      <div className="grid grid-cols-7 gap-1">
        {cells.map((d) => {
          const items = tasksByDate.get(fmtDate(d)) ?? [];
          const inMonth = sameMonth(d, cursor);
          const isToday = fmtDate(d) === todayStr;
          return (
            <button
              key={fmtDate(d)}
              onClick={() => onSelectDate(d)}
              className={`min-h-[72px] md:min-h-[96px] p-1.5 rounded-lg text-left border transition ${
                inMonth ? "bg-background border-border hover:border-primary" : "bg-muted/30 border-transparent text-muted-foreground"
              } ${isToday ? "ring-2 ring-primary" : ""}`}
            >
              <div className="flex items-center justify-between">
                <span className={`text-xs font-bold ${isToday ? "text-primary" : ""}`}>{d.getDate()}</span>
                {items.length > 0 && (
                  <span className="text-[9px] font-bold px-1.5 py-0.5 rounded-full bg-primary text-white">{items.length}</span>
                )}
              </div>
              <div className="mt-1 space-y-0.5">
                {items.slice(0, 2).map((t) => (
                  <div key={t.id} className="text-[10px] truncate px-1 py-0.5 rounded bg-primary-light text-primary">
                    {t.time} {t.title}
                  </div>
                ))}
                {items.length > 2 && (
                  <div className="text-[10px] text-muted-foreground px-1">+{items.length - 2} more</div>
                )}
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
}
