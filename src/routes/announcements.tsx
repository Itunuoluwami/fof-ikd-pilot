import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { PageHeader } from "@/components/Primitives";
import { AlertTriangle, Pin, Plus, Trash2, X } from "lucide-react";
import { useAdminAnnouncements, createAnnouncement, deleteAnnouncement } from "@/lib/admin-announcements";

export const Route = createFileRoute("/announcements")({ component: AnnouncementsPage });

function AnnouncementsPage() {
  const announcements = useAdminAnnouncements();
  const [open, setOpen] = useState(false);
  const urgent = announcements.filter(a => a.urgent);

  return (
    <div>
      <PageHeader title="Announcements" subtitle="Communicate updates and urgent messages." action={
        <button onClick={() => setOpen(true)} aria-label="New Announcement" className="inline-flex items-center justify-center gap-2 bg-primary text-primary-foreground rounded-xl font-semibold hover:bg-primary-dark p-2.5 sm:px-4 sm:py-2.5">
          <Plus className="w-4 h-4" />
          <span className="hidden sm:inline">New Announcement</span>
        </button>
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
              <button onClick={() => { if (confirm("Delete this announcement?")) deleteAnnouncement(a.id); }} aria-label="Delete announcement" className="p-1 rounded-md text-muted-foreground hover:text-destructive hover:bg-destructive/10">
                <Trash2 className="w-4 h-4" />
              </button>
            </div>
            <h3 className="font-semibold mb-1">{a.title}</h3>
            <p className="text-sm text-muted-foreground leading-relaxed">{a.body}</p>
            {a.expiresAt && <p className="text-xs text-muted-foreground mt-3">Expires {new Date(a.expiresAt).toLocaleDateString("en-GB")}</p>}
          </article>
        ))}
      </div>

      {open && <NewAnnouncementModal onClose={() => setOpen(false)} />}
    </div>
  );
}

function NewAnnouncementModal({ onClose }: { onClose: () => void }) {
  const [title, setTitle] = useState("");
  const [body, setBody] = useState("");
  const [pinned, setPinned] = useState(false);
  const [urgent, setUrgent] = useState(false);
  const [expiresAt, setExpiresAt] = useState("");
  const [error, setError] = useState<string | null>(null);

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    const t = title.trim();
    const b = body.trim();
    if (!t || t.length > 120) return setError("Title is required (max 120 chars).");
    if (!b || b.length > 1000) return setError("Body is required (max 1000 chars).");
    createAnnouncement({ title: t, body: b, pinned, urgent, expiresAt: expiresAt || undefined });
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4">
      <div className="absolute inset-0 bg-black/50" onClick={onClose} />
      <form onSubmit={submit} className="relative w-full sm:max-w-lg bg-card rounded-t-2xl sm:rounded-2xl shadow-xl max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between px-5 py-4 border-b border-border">
          <h2 className="font-bold text-lg">New Announcement</h2>
          <button type="button" onClick={onClose} className="p-1.5 rounded-lg hover:bg-muted"><X className="w-5 h-5" /></button>
        </div>
        <div className="p-5 space-y-4">
          {error && <p className="text-sm text-destructive">{error}</p>}
          <div>
            <label className="text-sm font-medium block mb-1">Title</label>
            <input value={title} onChange={e => setTitle(e.target.value)} maxLength={120} required className="w-full px-3 py-2 rounded-lg border border-input bg-background text-sm focus:outline-none focus:ring-1 focus:ring-ring" />
          </div>
          <div>
            <label className="text-sm font-medium block mb-1">Message</label>
            <textarea value={body} onChange={e => setBody(e.target.value)} maxLength={1000} required rows={4} className="w-full px-3 py-2 rounded-lg border border-input bg-background text-sm focus:outline-none focus:ring-1 focus:ring-ring" />
            <p className="text-xs text-muted-foreground mt-1">{body.length}/1000</p>
          </div>
          <div>
            <label className="text-sm font-medium block mb-1">Expires (optional)</label>
            <input type="date" value={expiresAt} onChange={e => setExpiresAt(e.target.value)} className="w-full px-3 py-2 rounded-lg border border-input bg-background text-sm focus:outline-none focus:ring-1 focus:ring-ring" />
          </div>
          <div className="flex flex-wrap gap-4">
            <label className="inline-flex items-center gap-2 text-sm">
              <input type="checkbox" checked={pinned} onChange={e => setPinned(e.target.checked)} /> Pinned
            </label>
            <label className="inline-flex items-center gap-2 text-sm">
              <input type="checkbox" checked={urgent} onChange={e => setUrgent(e.target.checked)} /> Urgent
            </label>
          </div>
        </div>
        <div className="flex items-center justify-end gap-2 px-5 py-4 border-t border-border">
          <button type="button" onClick={onClose} className="px-4 py-2 rounded-lg text-sm font-medium hover:bg-muted">Cancel</button>
          <button type="submit" className="px-4 py-2 rounded-lg text-sm font-semibold bg-primary text-primary-foreground hover:bg-primary-dark">Publish</button>
        </div>
      </form>
    </div>
  );
}
