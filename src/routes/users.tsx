import { createFileRoute } from "@tanstack/react-router";
import { Avatar, PageHeader, StatusBadge } from "@/components/Primitives";
import { cohorts, users } from "@/lib/mock-data";
import { Search, UserPlus, MoreVertical } from "lucide-react";
import { useState } from "react";

export const Route = createFileRoute("/users")({ component: UsersPage });

function UsersPage() {
  const [q, setQ] = useState("");
  const [role, setRole] = useState<string>("ALL");
  const filtered = users.filter(u => (role === "ALL" || u.role === role) && u.name.toLowerCase().includes(q.toLowerCase()));

  return (
    <div>
      <PageHeader title="User Management" subtitle="Admins, SOP Preparers, and Supports." action={
        <button className="inline-flex items-center gap-2 bg-primary text-primary-foreground px-4 py-2.5 rounded-xl font-semibold hover:bg-primary-dark"><UserPlus className="w-4 h-4" /> Create User</button>
      } />

      <div className="card-soft p-4 mb-4 flex flex-col sm:flex-row gap-3">
        <div className="flex-1 relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <input value={q} onChange={e => setQ(e.target.value)} placeholder="Search users…" className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-muted/50 border border-transparent focus:border-primary focus:bg-card focus:outline-none text-sm" />
        </div>
        <select value={role} onChange={e => setRole(e.target.value)} className="px-4 py-2.5 rounded-xl bg-muted/50 text-sm font-medium focus:outline-none">
          <option value="ALL">All roles</option>
          <option value="ADMIN">Admin</option>
          <option value="SOP_PREPARER">SOP Preparer</option>
          <option value="SUPPORT">Support</option>
        </select>
      </div>

      <div className="card-soft overflow-hidden">
        <table className="w-full">
          <thead className="bg-muted/40 border-b border-border">
            <tr className="text-left text-xs font-semibold text-muted-foreground uppercase tracking-wider">
              <th className="px-5 py-3">Name</th>
              <th className="px-5 py-3 hidden md:table-cell">Role</th>
              <th className="px-5 py-3 hidden lg:table-cell">Cohort</th>
              <th className="px-5 py-3">Status</th>
              <th className="px-5 py-3"></th>
            </tr>
          </thead>
          <tbody>
            {filtered.map(u => (
              <tr key={u.id} className="border-b border-border last:border-0 hover:bg-muted/30">
                <td className="px-5 py-4">
                  <div className="flex items-center gap-3">
                    <Avatar name={u.name} color={u.avatarColor} size={36} />
                    <div className="min-w-0">
                      <p className="font-medium truncate">{u.name}</p>
                      <p className="text-xs text-muted-foreground truncate md:hidden">{u.role.replace("_", " ")}</p>
                      {u.email && <p className="text-xs text-muted-foreground truncate hidden md:block">{u.email}</p>}
                    </div>
                  </div>
                </td>
                <td className="px-5 py-4 hidden md:table-cell"><span className="text-sm font-medium">{u.role.replace("_", " ")}</span></td>
                <td className="px-5 py-4 hidden lg:table-cell text-sm text-muted-foreground">{cohorts.find(c => c.id === u.cohortId)?.name ?? "—"}</td>
                <td className="px-5 py-4"><StatusBadge status={u.status} tone={u.status === "ACTIVE" ? "success" : "neutral"} /></td>
                <td className="px-5 py-4 text-right"><button className="p-2 rounded-lg hover:bg-muted"><MoreVertical className="w-4 h-4" /></button></td>
              </tr>
            ))}
          </tbody>
        </table>
        {filtered.length === 0 && <p className="p-8 text-center text-muted-foreground text-sm">No users match.</p>}
      </div>
    </div>
  );
}
