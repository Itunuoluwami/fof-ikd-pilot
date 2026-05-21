import { createFileRoute } from "@tanstack/react-router";
import { SupportHeader, SectionTitle } from "@/components/support/SupportUI";
import { resources } from "@/lib/mock-data";
import { Sparkles, FileText, Video, Link as LinkIcon, FileType2 } from "lucide-react";

export const Route = createFileRoute("/support/resources")({ component: SupportResources });

const iconFor = (t: string) => t === "VIDEO" ? Video : t === "LINK" ? LinkIcon : t === "DOC" ? FileType2 : FileText;

function SupportResources() {
  const categories = Array.from(new Set(resources.map(r => r.category)));
  return (
    <>
      <SupportHeader subtitle="Resources & references" />
      {categories.map(cat => (
        <div key={cat}>
          <SectionTitle title={cat} />
          <div className="px-5 space-y-2">
            {resources.filter(r => r.category === cat).map(r => {
              const Icon = iconFor(r.type);
              return (
                <button key={r.id} className="w-full card-soft p-3 flex items-center gap-3 text-left active:bg-muted transition">
                  <div className="w-10 h-10 rounded-xl grid place-items-center text-white" style={{ background: r.avatarColor }}>
                    <Icon className="w-5 h-5" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="font-semibold text-sm truncate">{r.title}</p>
                    <p className="text-xs text-muted-foreground truncate">{r.description}</p>
                  </div>
                  {r.isNew && <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-primary-light text-primary inline-flex items-center gap-1"><Sparkles className="w-3 h-3" /> NEW</span>}
                </button>
              );
            })}
          </div>
        </div>
      ))}
      <div className="h-6" />
    </>
  );
}
