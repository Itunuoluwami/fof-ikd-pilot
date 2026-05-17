import { createFileRoute } from "@tanstack/react-router";
import { PageHeader } from "@/components/Primitives";
import { announcements } from "@/lib/mock-data";
import { AlertTriangle, Pin, Plus } from "lucide-react";

export const Route = createFileRoute("/announcements")({ component: AnnouncementsPage });

function AnnouncementsPage() {
  const urgent = announcements.filter(a => a.urgent);
  return (
    <div>
      <PageHeader title="Announcements" subtitle="Communicate updates and urgent messages." action={
        <button className="inline-flex items-center gap-2 bg-primary text-primary-foreground px-4 py-2.5 rounded-xl font-semibold hover:bg-primary-dark"><Plus className="w-4 h-4" /> New Announcement</button>
      } />

      {urgent.length > 0 && (
        <div className="mb-4 p-4 rounded-2xl bg-destructive/10 border border-destructive/30 flex items-start gap-3">
          <AlertTriangle className="w-5 h-5 text-destructive shrink-0 mt-0.5" />
          <div>
            <p className="font-semibold text-destructive">Urgent · {urgent[0].title}</p>
            <p className="text-sm mt-0.5">{urgent[0].body}</p>
          </div>
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {announcements.map(a => (
          <article key={a.id} className="card-soft p-5">
            <div className="flex items-center gap-2 mb-2">
              {a.pinned && <span className="inline-flex items-center gap-1 text-xs px-2 py-0.5 rounded-full bg-primary-light text-primary font-medium"><Pin className="w-3 h-3" /> Pinned</span>}
              {a.urgent && <span className="text-xs px-2 py-0.5 rounded-full bg-destructive text-destructive-foreground font-medium">Urgent</span>}
              <span className="text-xs text-muted-foreground ml-auto">{new Date(a.createdAt).toLocaleDateString("en-GB")}</span>
            </div>
            <h3 className="font-semibold mb-1">{a.title}</h3>
            <p className="text-sm text-muted-foreground leading-relaxed">{a.body}</p>
            {a.expiresAt && <p className="text-xs text-muted-foreground mt-3">Expires {new Date(a.expiresAt).toLocaleDateString("en-GB")}</p>}
          </article>
        ))}
      </div>
    </div>
  );
}
