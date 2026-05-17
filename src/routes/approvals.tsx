import { createFileRoute } from "@tanstack/react-router";
import { PageHeader, StatusBadge } from "@/components/Primitives";
import { pendingChanges } from "@/lib/mock-data";
import { Check, X, ArrowRight } from "lucide-react";
import { useState } from "react";

export const Route = createFileRoute("/approvals")({ component: ApprovalsPage });

function ApprovalsPage() {
  const [items, setItems] = useState(pendingChanges);
  const act = (id: string, status: "APPROVED" | "REJECTED") => setItems(prev => prev.map(p => p.id === id ? { ...p, status } : p));

  return (
    <div>
      <PageHeader title="Pending Approvals" subtitle="Review schedule change requests from SOP Preparers." />

      <div className="space-y-4">
        {items.filter(i => i.status === "PENDING").length === 0 && (
          <div className="card-soft p-10 text-center text-muted-foreground">All caught up — no pending changes.</div>
        )}
        {items.map(p => p.status === "PENDING" && (
          <div key={p.id} className="card-soft p-5">
            <div className="flex flex-wrap items-start justify-between gap-3 mb-4">
              <div>
                <p className="font-semibold">{p.activityTitle}</p>
                <p className="text-xs text-muted-foreground mt-0.5">Submitted by <span className="font-medium text-foreground">{p.submittedBy}</span> · {new Date(p.submittedAt).toLocaleString("en-GB")}</p>
              </div>
              <StatusBadge status={p.status} tone="warning" />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-[1fr_auto_1fr] gap-3 items-stretch">
              <DiffBox label="BEFORE" data={p.before} tone="muted" />
              <div className="hidden md:grid place-items-center"><ArrowRight className="w-5 h-5 text-muted-foreground" /></div>
              <DiffBox label="AFTER" data={p.after} tone="primary" />
            </div>

            <div className="flex gap-2 mt-5">
              <button onClick={() => act(p.id, "APPROVED")} className="flex-1 sm:flex-none inline-flex items-center justify-center gap-2 bg-primary text-primary-foreground px-4 py-2.5 rounded-xl font-semibold hover:bg-primary-dark"><Check className="w-4 h-4" /> Approve</button>
              <button onClick={() => act(p.id, "REJECTED")} className="flex-1 sm:flex-none inline-flex items-center justify-center gap-2 bg-muted text-foreground px-4 py-2.5 rounded-xl font-semibold hover:bg-border"><X className="w-4 h-4" /> Reject</button>
            </div>
          </div>
        ))}

        {items.filter(i => i.status !== "PENDING").length > 0 && (
          <div className="card-soft p-5">
            <p className="font-semibold mb-3">Recently processed</p>
            <ul className="space-y-2">
              {items.filter(i => i.status !== "PENDING").map(p => (
                <li key={p.id} className="flex items-center justify-between py-2 border-b border-border last:border-0">
                  <span className="text-sm">{p.activityTitle}</span>
                  <StatusBadge status={p.status} tone={p.status === "APPROVED" ? "success" : "danger"} />
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>
    </div>
  );
}

function DiffBox({ label, data, tone }: { label: string; data: Record<string, any>; tone: "muted" | "primary" }) {
  return (
    <div className={`rounded-xl p-4 border ${tone === "primary" ? "border-primary/30 bg-primary-light" : "border-border bg-muted/30"}`}>
      <p className={`text-[10px] font-bold tracking-wider mb-2 ${tone === "primary" ? "text-primary" : "text-muted-foreground"}`}>{label}</p>
      <dl className="space-y-1.5">
        {Object.entries(data).map(([k, v]) => (
          <div key={k} className="flex items-baseline justify-between gap-3 text-sm">
            <dt className="text-xs text-muted-foreground capitalize">{k.replace(/([A-Z])/g, " $1")}</dt>
            <dd className="font-medium text-right">{String(v)}</dd>
          </div>
        ))}
      </dl>
    </div>
  );
}
