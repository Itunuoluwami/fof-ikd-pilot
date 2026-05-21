import { createFileRoute, Link } from "@tanstack/react-router";
import { SupportHeader, SectionTitle } from "@/components/support/SupportUI";
import { programmeGuide } from "@/lib/support-data";
import { ArrowLeft, BookOpen, Bell, ClipboardCheck, HeartHandshake, ChevronRight } from "lucide-react";

export const Route = createFileRoute("/support/guide")({ component: GuidePage });

function GuidePage() {
  const guide = programmeGuide[0];
  return (
    <>
      <header className="px-5 pt-6 pb-2">
        <Link to="/support" className="inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-primary"><ArrowLeft className="w-4 h-4" /> Back</Link>
      </header>
      <SupportHeader subtitle="Programme & user guide" />

      {guide && (
        <div className="px-5">
          <div className="card-soft p-5" style={{ background: "linear-gradient(135deg, var(--primary-light) 0%, var(--card) 100%)" }}>
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-2xl bg-primary text-white grid place-items-center"><BookOpen className="w-6 h-6" /></div>
              <div>
                <p className="text-xs text-muted-foreground">Continue reading</p>
                <p className="font-bold">{guide.title}</p>
              </div>
            </div>
            <p className="text-sm text-muted-foreground mt-3">{guide.lastSection}</p>
            <div className="mt-3 flex items-center gap-3">
              <div className="flex-1 h-2 rounded-full bg-white/60 overflow-hidden">
                <div className="h-full rounded-full" style={{ width: `${guide.progress}%`, background: "linear-gradient(90deg, var(--primary), var(--primary-dark))" }} />
              </div>
              <span className="text-xs font-bold text-primary">{guide.progress}%</span>
            </div>
            <button className="mt-4 w-full py-2.5 rounded-xl text-white font-semibold" style={{ background: "linear-gradient(135deg, var(--primary) 0%, var(--primary-dark) 100%)" }}>Mark section as read</button>
          </div>
        </div>
      )}

      <SectionTitle title="How the app works" />
      <div className="px-5 space-y-2">
        {[
          { icon: Bell, title: "How notifications work", body: "We notify you about new tasks, schedule changes, and urgent announcements." },
          { icon: ClipboardCheck, title: "Marking tasks done", body: "Tap the circle on any task card to mark it complete. It auto-logs the time." },
          { icon: HeartHandshake, title: "Logging prayer requests", body: "Open a participant profile and use the composer to capture requests or notes." },
          { icon: ClipboardCheck, title: "Attendance", body: "Use quick chips to mark Present, Late, Absent, or Excused — one tap." },
        ].map(s => {
          const Icon = s.icon;
          return (
            <div key={s.title} className="card-soft p-4 flex gap-3">
              <div className="w-10 h-10 rounded-xl bg-primary-light text-primary grid place-items-center shrink-0"><Icon className="w-5 h-5" /></div>
              <div>
                <p className="font-semibold text-sm">{s.title}</p>
                <p className="text-xs text-muted-foreground mt-1">{s.body}</p>
              </div>
            </div>
          );
        })}
      </div>
      <div className="h-6" />
    </>
  );
}
