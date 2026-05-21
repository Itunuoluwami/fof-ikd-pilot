import { createFileRoute } from "@tanstack/react-router";
import { SupportHeader, SectionTitle } from "@/components/support/SupportUI";
import { weeks } from "@/lib/mock-data";
import { Clock, MapPin } from "lucide-react";

export const Route = createFileRoute("/support/schedule")({ component: SupportSchedule });

function SupportSchedule() {
  const week = weeks[0];
  return (
    <>
      <SupportHeader subtitle={week ? week.title : "Schedule"} />
      <div className="px-5 mt-2 space-y-5">
        {week?.days.map(day => (
          <section key={day.id}>
            <p className="text-xs font-bold text-primary uppercase tracking-wide">{day.name}</p>
            <p className="text-xs text-muted-foreground mb-2">{new Date(day.date).toLocaleDateString(undefined, { weekday: "long", month: "long", day: "numeric" })}</p>
            <div className="space-y-2">
              {day.activities.length === 0 && <p className="text-sm text-muted-foreground">No assigned activities.</p>}
              {day.activities.map(a => (
                <div key={a.id} className="card-soft p-4">
                  <div className="flex items-start justify-between gap-2">
                    <p className="font-semibold">{a.title}</p>
                    <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-primary-light text-primary">{a.status}</span>
                  </div>
                  <p className="text-xs text-muted-foreground mt-1">{a.description}</p>
                  <div className="flex items-center gap-3 mt-2 text-xs text-muted-foreground">
                    <span className="inline-flex items-center gap-1"><Clock className="w-3.5 h-3.5" /> {a.startTime} – {a.endTime}</span>
                    <span className="inline-flex items-center gap-1"><MapPin className="w-3.5 h-3.5" /> {a.location}</span>
                  </div>
                </div>
              ))}
            </div>
          </section>
        ))}
      </div>
      <div className="h-6" />
    </>
  );
}
