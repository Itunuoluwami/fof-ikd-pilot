import { createFileRoute, Link } from "@tanstack/react-router";
import { SupportHeader, SectionTitle } from "@/components/support/SupportUI";
import { Avatar } from "@/components/Primitives";
import { participants } from "@/lib/mock-data";
import { useCurrentUser } from "@/lib/auth-store";
import { ArrowLeft } from "lucide-react";
import { useState } from "react";

export const Route = createFileRoute("/support/attendance")({ component: AttendancePage });

const states = [
  { key: "PRESENT", label: "Present", color: "bg-[oklch(0.95_0.05_155)] text-[oklch(0.4_0.15_155)]" },
  { key: "LATE", label: "Late", color: "bg-[oklch(0.96_0.06_75)] text-[oklch(0.45_0.15_50)]" },
  { key: "ABSENT", label: "Absent", color: "bg-[oklch(0.95_0.05_25)] text-[oklch(0.45_0.2_25)]" },
  { key: "EXCUSED", label: "Excused", color: "bg-muted text-muted-foreground" },
] as const;

function AttendancePage() {
  const user = useCurrentUser();
  const supportId = user?.id ?? "u-3";
  const mine = participants.filter(p => p.supportId === supportId);
  const [marks, setMarks] = useState<Record<string, string>>({});

  return (
    <>
      <header className="px-5 pt-6 pb-2">
        <Link to="/support" className="inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-primary"><ArrowLeft className="w-4 h-4" /> Back</Link>
      </header>
      <SupportHeader subtitle="Mark today's attendance" />
      <SectionTitle title="Bible Study — Today" />
      <div className="px-5 space-y-3">
        {mine.map(p => (
          <div key={p.id} className="card-soft p-3">
            <div className="flex items-center gap-3">
              <Avatar name={p.name} color={p.avatarColor} size={40} />
              <p className="flex-1 font-semibold text-sm truncate">{p.name}</p>
            </div>
            <div className="grid grid-cols-4 gap-1.5 mt-3">
              {states.map(s => {
                const active = marks[p.id] === s.key;
                return (
                  <button key={s.key} onClick={() => setMarks(m => ({ ...m, [p.id]: s.key }))}
                    className={`py-2 rounded-lg text-[11px] font-bold transition ${active ? s.color + " ring-2 ring-primary" : "bg-muted text-muted-foreground"}`}>
                    {s.label}
                  </button>
                );
              })}
            </div>
          </div>
        ))}
      </div>
      <div className="px-5 mt-5">
        <button className="w-full py-3 rounded-xl text-white font-semibold" style={{ background: "linear-gradient(135deg, var(--primary) 0%, var(--primary-dark) 100%)" }}>
          Submit attendance ({Object.keys(marks).length}/{mine.length})
        </button>
      </div>
      <div className="h-6" />
    </>
  );
}
