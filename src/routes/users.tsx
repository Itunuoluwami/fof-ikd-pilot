import { createFileRoute } from "@tanstack/react-router";
import { Avatar, PageHeader, StatusBadge } from "@/components/Primitives";
import { cohorts, groups, type UserRole, type UserStatus } from "@/lib/mock-data";
import { useAdminUsers, createUser, deleteUser } from "@/lib/admin-users";
import { Search, UserPlus, MoreVertical, X, Trash2 } from "lucide-react";
import { useMemo, useState } from "react";

export const Route = createFileRoute("/users")({ component: UsersPage });

function UsersPage() {
  const users = useAdminUsers();
  const [q, setQ] = useState("");
  const [role, setRole] = useState<string>("ALL");
  const [openCreate, setOpenCreate] = useState(false);
  const [menuId, setMenuId] = useState<string | null>(null);

  const filtered = users.filter(u => (role === "ALL" || u.role === role) && u.name.toLowerCase().includes(q.toLowerCase()));

  return (
    <div>
      <PageHeader title="User Management" subtitle="Admins, SOP Preparers, and Supports." action={
        <button
          onClick={() => setOpenCreate(true)}
          aria-label="Create User"
          className="inline-flex items-center justify-center gap-2 bg-primary text-primary-foreground p-2.5 sm:px-4 sm:py-2.5 rounded-xl font-semibold hover:bg-primary/90"
        >
          <UserPlus className="w-4 h-4" />
          <span className="hidden sm:inline">Create User</span>
        </button>
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
                <td className="px-5 py-4 text-right relative">
                  <button onClick={() => setMenuId(menuId === u.id ? null : u.id)} className="p-2 rounded-lg hover:bg-muted"><MoreVertical className="w-4 h-4" /></button>
                  {menuId === u.id && (
                    <>
                      <div className="fixed inset-0 z-10" onClick={() => setMenuId(null)} />
                      <div className="absolute right-4 top-12 z-20 bg-card border border-border rounded-xl shadow-lg py-1 min-w-[140px]">
                        <button
                          onClick={() => {
                            if (confirm(`Delete ${u.name}?`)) { deleteUser(u.id); }
                            setMenuId(null);
                          }}
                          className="w-full px-3 py-2 text-left text-sm text-destructive hover:bg-muted flex items-center gap-2"
                        >
                          <Trash2 className="w-4 h-4" /> Delete
                        </button>
                      </div>
                    </>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {filtered.length === 0 && <p className="p-8 text-center text-muted-foreground text-sm">No users match.</p>}
      </div>

      {openCreate && <CreateUserModal onClose={() => setOpenCreate(false)} />}
    </div>
  );
}

function CreateUserModal({ onClose }: { onClose: () => void }) {
  const [name, setName] = useState("");
  const [role, setRole] = useState<UserRole>("SUPPORT");
  const [status, setStatus] = useState<UserStatus>("ACTIVE");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [cohortId, setCohortId] = useState<string>("");
  const [groupId, setGroupId] = useState<string>("");
  const [error, setError] = useState("");

  const availableGroups = useMemo(() => groups.filter(g => !cohortId || g.cohortId === cohortId), [cohortId]);

  function submit(e: React.FormEvent) {
    e.preventDefault();
    if (!name.trim()) return setError("Name is required");
    if (name.trim().length > 80) return setError("Name is too long");
    createUser({
      name,
      role,
      status,
      email: email || undefined,
      phone: phone || undefined,
      cohortId: role === "SUPPORT" ? cohortId || undefined : undefined,
      groupId: role === "SUPPORT" ? groupId || undefined : undefined,
    });
    onClose();
  }

  return (
    <div className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center p-4" onClick={onClose}>
      <div className="bg-card rounded-2xl w-full max-w-lg max-h-[90vh] overflow-y-auto" onClick={e => e.stopPropagation()}>
        <div className="flex items-center justify-between p-5 border-b border-border">
          <h2 className="text-lg font-semibold">Create User</h2>
          <button onClick={onClose} className="p-1.5 rounded-lg hover:bg-muted"><X className="w-4 h-4" /></button>
        </div>
        <form onSubmit={submit} className="p-5 space-y-4">
          <div>
            <label className="text-sm font-medium mb-1.5 block">Name *</label>
            <input value={name} onChange={e => setName(e.target.value)} maxLength={80} className="w-full px-3 py-2.5 rounded-xl bg-muted/50 border border-transparent focus:border-primary focus:bg-card focus:outline-none text-sm" placeholder="Full name" autoFocus />
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-sm font-medium mb-1.5 block">Role *</label>
              <select value={role} onChange={e => setRole(e.target.value as UserRole)} className="w-full px-3 py-2.5 rounded-xl bg-muted/50 text-sm focus:outline-none">
                <option value="ADMIN">Admin</option>
                <option value="SOP_PREPARER">SOP Preparer</option>
                <option value="SUPPORT">Support</option>
              </select>
            </div>
            <div>
              <label className="text-sm font-medium mb-1.5 block">Status</label>
              <select value={status} onChange={e => setStatus(e.target.value as UserStatus)} className="w-full px-3 py-2.5 rounded-xl bg-muted/50 text-sm focus:outline-none">
                <option value="ACTIVE">Active</option>
                <option value="INACTIVE">Inactive</option>
              </select>
            </div>
          </div>
          <div>
            <label className="text-sm font-medium mb-1.5 block">Email</label>
            <input type="email" value={email} onChange={e => setEmail(e.target.value)} className="w-full px-3 py-2.5 rounded-xl bg-muted/50 border border-transparent focus:border-primary focus:bg-card focus:outline-none text-sm" placeholder="name@tcnikd.org" />
          </div>
          <div>
            <label className="text-sm font-medium mb-1.5 block">Phone</label>
            <input value={phone} onChange={e => setPhone(e.target.value)} className="w-full px-3 py-2.5 rounded-xl bg-muted/50 border border-transparent focus:border-primary focus:bg-card focus:outline-none text-sm" placeholder="+234…" />
          </div>
          {role === "SUPPORT" && (
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="text-sm font-medium mb-1.5 block">Cohort</label>
                <select value={cohortId} onChange={e => { setCohortId(e.target.value); setGroupId(""); }} className="w-full px-3 py-2.5 rounded-xl bg-muted/50 text-sm focus:outline-none">
                  <option value="">—</option>
                  {cohorts.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
                </select>
              </div>
              <div>
                <label className="text-sm font-medium mb-1.5 block">Group</label>
                <select value={groupId} onChange={e => setGroupId(e.target.value)} className="w-full px-3 py-2.5 rounded-xl bg-muted/50 text-sm focus:outline-none">
                  <option value="">—</option>
                  {availableGroups.map(g => <option key={g.id} value={g.id}>{g.name}</option>)}
                </select>
              </div>
            </div>
          )}
          {error && <p className="text-sm text-destructive">{error}</p>}
          <div className="flex justify-end gap-2 pt-2">
            <button type="button" onClick={onClose} className="px-4 py-2.5 rounded-xl text-sm font-medium hover:bg-muted">Cancel</button>
            <button type="submit" className="px-4 py-2.5 rounded-xl bg-primary text-primary-foreground text-sm font-semibold hover:bg-primary/90">Create User</button>
          </div>
        </form>
      </div>
    </div>
  );
}
