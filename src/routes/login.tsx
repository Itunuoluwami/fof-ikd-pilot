import { createFileRoute, useNavigate, Link } from "@tanstack/react-router";
import { useState } from "react";
import { login } from "@/lib/auth-store";
import { LogIn } from "lucide-react";

export const Route = createFileRoute("/login")({ component: LoginPage });

function LoginPage() {
  const navigate = useNavigate();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(""); setLoading(true);
    const res = login(username, password);
    setLoading(false);
    if (!res.ok) { setError(res.error); return; }
    if (res.user.role === "ADMIN") navigate({ to: "/" });
    else navigate({ to: "/support" });
  }

  return (
    <div className="min-h-screen grid place-items-center p-4" style={{ background: "linear-gradient(160deg, var(--primary-light) 0%, var(--background) 60%)" }}>
      <div className="w-full max-w-sm card-soft p-7">
        <div className="flex items-center gap-3 mb-6">
          <div className="w-12 h-12 rounded-2xl text-white grid place-items-center font-bold text-lg" style={{ background: "linear-gradient(135deg, var(--primary) 0%, var(--primary-dark) 100%)" }}>F</div>
          <div>
            <p className="font-bold leading-tight">FOF IKD Ops</p>
            <p className="text-xs text-muted-foreground">Sign in to continue</p>
          </div>
        </div>

        <form onSubmit={onSubmit} className="space-y-4">
          <div>
            <label className="text-xs font-medium text-muted-foreground">Username</label>
            <input value={username} onChange={(e) => setUsername(e.target.value)} autoFocus autoComplete="username"
              className="mt-1 w-full px-3 py-2.5 rounded-xl border border-border bg-background focus:outline-none focus:ring-2 focus:ring-primary" />
          </div>
          <div>
            <label className="text-xs font-medium text-muted-foreground">Password</label>
            <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} autoComplete="current-password"
              className="mt-1 w-full px-3 py-2.5 rounded-xl border border-border bg-background focus:outline-none focus:ring-2 focus:ring-primary" />
          </div>
          {error && <p className="text-sm text-destructive">{error}</p>}
          <button disabled={loading} className="w-full inline-flex items-center justify-center gap-2 py-2.5 rounded-xl text-white font-semibold disabled:opacity-60"
            style={{ background: "linear-gradient(135deg, var(--primary) 0%, var(--primary-dark) 100%)" }}>
            <LogIn className="w-4 h-4" /> {loading ? "Signing in…" : "Sign in"}
          </button>
        </form>

        <div className="mt-6 text-xs text-muted-foreground border-t border-border pt-4 space-y-1">
          <p className="font-semibold text-foreground">Demo accounts</p>
          <p>Support: <code>daniel.okeke</code> / <code>support123</code></p>
          <p>Admin: <code>stas</code> / <code>admin123</code></p>
        </div>

        <Link to="/" className="block text-center text-xs text-muted-foreground mt-4 hover:text-primary">← Back to admin (dev)</Link>
      </div>
    </div>
  );
}
