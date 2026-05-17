import { createFileRoute } from "@tanstack/react-router";
import { PageHeader } from "@/components/Primitives";

export const Route = createFileRoute("/settings")({ component: SettingsPage });

function SettingsPage() {
  return (
    <div>
      <PageHeader title="Settings" subtitle="Organization, integrations, and account preferences." />
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {[
          { title: "Organization", desc: "Name, contact, programme details." },
          { title: "Roles & Permissions", desc: "Configure access for Admin, SOP Preparer, Support." },
          { title: "Notifications", desc: "Email, SMS, in-app preferences." },
          { title: "Integrations", desc: "Supabase, calendar exports, broadcast tools." },
          { title: "Data & Backup", desc: "Export participant and attendance data." },
          { title: "About", desc: "FOF IKD Ops · v0.1 admin module." },
        ].map(s => (
          <div key={s.title} className="card-soft p-6">
            <p className="font-semibold">{s.title}</p>
            <p className="text-sm text-muted-foreground mt-1">{s.desc}</p>
            <button className="mt-4 text-sm font-semibold text-primary">Open →</button>
          </div>
        ))}
      </div>
    </div>
  );
}
