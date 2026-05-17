import { createFileRoute } from "@tanstack/react-router";
import { PageHeader, StatusBadge } from "@/components/Primitives";
import { weeks } from "@/lib/mock-data";
import { ChevronDown, ChevronRight, MapPin, Plus, Send, Archive } from "lucide-react";
import { useState } from "react";

export const Route = createFileRoute("/schedule")({ component: SchedulePage });

function SchedulePage() {
  const [openWeek, setOpenWeek] = useState<string>(weeks[0]?.id ?? "");
  const [openDay, setOpenDay] = useState<string>(weeks[0]?.days[0]?.id ?? "");

  return (
    <div>
      <PageHeader
        title="Weekly Programme"
        subtitle="Manage weeks, days, and activities."
        action={<button className="inline-flex items-center gap-2 bg-primary text-primary-foreground px-4 py-2.5 rounded-xl font-semibold hover:bg-primary-dark transition"><Plus className="w-4 h-4" /> Create Week</button>}
      />

      <div className="space-y-4">
        {weeks.map(w => {
          const isOpen = openWeek === w.id;
          return (
            <div key={w.id} className="card-soft overflow-hidden">
              <button onClick={() => setOpenWeek(isOpen ? "" : w.id)} className="w-full flex items-center justify-between p-5 hover:bg-muted/40 transition">
                <div className="flex items-center gap-4 min-w-0">
                  <div className="w-12 h-12 rounded-xl bg-primary-light text-primary grid place-items-center font-bold">W{w.number}</div>
                  <div className="text-left min-w-0">
                    <p className="font-semibold truncate">{w.title}</p>
                    <p className="text-xs text-muted-foreground">{w.days.length} days · {w.days.reduce((n, d) => n + d.activities.length, 0)} activities</p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <StatusBadge status={w.status} tone={w.status === "PUBLISHED" ? "success" : w.status === "DRAFT" ? "warning" : "neutral"} />
                  {w.status === "DRAFT" && (
                    <button onClick={(e) => e.stopPropagation()} className="hidden sm:inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-primary text-primary-foreground text-xs font-semibold hover:bg-primary-dark"><Send className="w-3.5 h-3.5" /> Publish</button>
                  )}
                  {w.status === "PUBLISHED" && (
                    <button onClick={(e) => e.stopPropagation()} className="hidden sm:inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-muted text-foreground text-xs font-semibold hover:bg-border"><Archive className="w-3.5 h-3.5" /> Archive</button>
                  )}
                  {isOpen ? <ChevronDown className="w-5 h-5" /> : <ChevronRight className="w-5 h-5" />}
                </div>
              </button>

              {isOpen && (
                <div className="border-t border-border p-5 space-y-3 bg-muted/20">
                  {w.days.length === 0 && <p className="text-sm text-muted-foreground py-4 text-center">No days yet. <button className="text-primary font-semibold">Add Day</button></p>}
                  {w.days.map(d => {
                    const dayOpen = openDay === d.id;
                    return (
                      <div key={d.id} className="bg-card rounded-xl overflow-hidden border border-border">
                        <button onClick={() => setOpenDay(dayOpen ? "" : d.id)} className="w-full flex items-center justify-between p-4 hover:bg-muted/40">
                          <div className="text-left">
                            <p className="font-semibold text-sm">{d.name}</p>
                            <p className="text-xs text-muted-foreground">{new Date(d.date).toLocaleDateString("en-GB", { weekday: "long", day: "numeric", month: "short" })} · {d.activities.length} activities</p>
                          </div>
                          {dayOpen ? <ChevronDown className="w-4 h-4" /> : <ChevronRight className="w-4 h-4" />}
                        </button>
                        {dayOpen && (
                          <ul className="p-4 pt-0 space-y-2">
                            {d.activities.map(a => (
                              <li key={a.id} className="flex gap-4 p-3 rounded-lg hover:bg-muted/40 transition group">
                                <div className="text-xs font-mono text-muted-foreground w-20 shrink-0 pt-0.5">{a.startTime}<br/><span className="opacity-60">{a.endTime}</span></div>
                                <div className="flex-1 min-w-0">
                                  <div className="flex items-center gap-2 flex-wrap">
                                    <p className="font-medium">{a.title}</p>
                                    <StatusBadge status={a.status} tone={a.status === "DONE" ? "success" : a.status === "IN_PROGRESS" ? "warning" : a.status === "CANCELLED" ? "danger" : "neutral"} />
                                  </div>
                                  <p className="text-xs text-muted-foreground mt-1">{a.description}</p>
                                  <div className="flex items-center gap-3 text-xs text-muted-foreground mt-2">
                                    <span className="inline-flex items-center gap-1"><MapPin className="w-3 h-3" /> {a.location}</span>
                                    <span>· {a.teams.join(", ")}</span>
                                  </div>
                                </div>
                                <button className="opacity-0 group-hover:opacity-100 transition text-xs font-semibold text-primary">Edit</button>
                              </li>
                            ))}
                            <li><button className="w-full text-sm font-semibold text-primary py-2 hover:bg-primary-light rounded-lg">+ Add activity</button></li>
                          </ul>
                        )}
                      </div>
                    );
                  })}
                  <button className="w-full text-sm font-semibold text-primary py-2 hover:bg-primary-light rounded-lg">+ Add day</button>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
