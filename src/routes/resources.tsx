import { createFileRoute } from "@tanstack/react-router";
import { PageHeader } from "@/components/Primitives";
import { resources } from "@/lib/mock-data";
import { ArrowLeft, ArrowRight, Plus, Search, Trash2 } from "lucide-react";
import { useState } from "react";

export const Route = createFileRoute("/resources")({ component: ResourcesPage });

const ICONS: Record<string, string> = { PDF: "P", VIDEO: "V", DOC: "D", LINK: "L" };

function ResourcesPage() {
  const [q, setQ] = useState("");
  const [selected, setSelected] = useState<string | null>("r-3");
  const filtered = resources.filter(r => r.title.toLowerCase().includes(q.toLowerCase()));
  const selectedCount = selected ? 1 : 0;

  return (
    <div>
      <PageHeader title="Resource Hub" subtitle="Curriculum, prayer guides, worship media and reference material." />

      <div className="card-soft p-4 mb-6 flex flex-col sm:flex-row gap-3">
        <div className="flex-1 relative">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <input value={q} onChange={e => setQ(e.target.value)} placeholder="Search resources" className="w-full pl-11 pr-4 py-3 rounded-xl bg-muted/50 border border-transparent focus:border-primary focus:bg-card focus:outline-none text-sm" />
        </div>
        <button className="inline-flex items-center justify-center gap-2 bg-primary text-primary-foreground px-6 py-3 rounded-xl font-semibold hover:bg-primary-dark"><Plus className="w-4 h-4" /> Add Resource</button>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {filtered.map(r => {
          const isSelected = selected === r.id;
          return (
            <button
              key={r.id}
              onClick={() => setSelected(isSelected ? null : r.id)}
              className={`relative card-soft p-6 text-center transition group ${isSelected ? "bg-primary text-primary-foreground" : "hover:-translate-y-0.5"}`}
            >
              {isSelected && (
                <div className="absolute -top-3 -right-3 bg-card p-2 rounded-xl shadow-md">
                  <Trash2 className="w-4 h-4 text-destructive" />
                </div>
              )}
              <div
                className="w-14 h-14 rounded-full grid place-items-center mx-auto mb-4 text-white font-bold text-xl"
                style={{ background: r.avatarColor }}
              >
                {ICONS[r.type]}
              </div>
              <p className={`font-bold ${isSelected ? "" : ""}`}>{r.title}</p>
              <p className={`text-sm mt-1 ${isSelected ? "text-primary-foreground/80" : "text-muted-foreground"}`}>{r.category}</p>
              <p className={`text-xs mt-4 ${isSelected ? "text-primary-foreground/70" : "text-muted-foreground"}`}>
                {new Date(r.addedAt).toLocaleDateString("en-GB", { day: "numeric", month: "long", year: "numeric" })}
              </p>
              {r.isNew && !isSelected && (
                <span className="absolute top-3 right-3 text-[10px] px-2 py-0.5 rounded-full bg-primary text-primary-foreground font-bold tracking-wider">NEW</span>
              )}
            </button>
          );
        })}
      </div>

      <div className="flex items-center justify-between mt-8">
        <nav className="flex items-center gap-2">
          <button className="p-2 rounded-lg hover:bg-muted"><ArrowLeft className="w-4 h-4" /></button>
          {[1, 2, 3].map(n => (
            <button key={n} className={`w-9 h-9 rounded-lg text-sm font-semibold ${n === 1 ? "bg-primary text-primary-foreground" : "hover:bg-muted text-muted-foreground"}`}>{n}</button>
          ))}
          <span className="text-muted-foreground px-1">…</span>
          <button className="w-9 h-9 rounded-lg text-sm font-semibold hover:bg-muted text-muted-foreground">5</button>
          <button className="p-2 rounded-lg hover:bg-muted"><ArrowRight className="w-4 h-4" /></button>
        </nav>
        <div className="flex items-center gap-4">
          {selectedCount > 0 && (
            <div className="hidden sm:flex items-center gap-2">
              <div className="w-7 h-7 rounded-full bg-primary text-primary-foreground grid place-items-center text-xs font-bold">{selectedCount}</div>
              <span className="text-sm">of {filtered.length} <span className="text-muted-foreground">Resources Selected</span></span>
            </div>
          )}
          <button className="px-5 py-2.5 rounded-xl border border-border font-semibold text-sm hover:bg-muted">Select All</button>
        </div>
      </div>
    </div>
  );
}
