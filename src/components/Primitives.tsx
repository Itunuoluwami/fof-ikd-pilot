import { initials } from "@/lib/mock-data";

export function Avatar({ name, color, size = 40 }: { name: string; color: string; size?: number }) {
  return (
    <div
      className="rounded-full grid place-items-center text-white font-semibold shrink-0"
      style={{ width: size, height: size, background: color, fontSize: size * 0.36 }}
    >
      {initials(name)}
    </div>
  );
}

export function StatusBadge({ status, tone = "neutral" }: { status: string; tone?: "success" | "warning" | "danger" | "info" | "neutral" }) {
  const tones: Record<string, string> = {
    success: "bg-[oklch(0.95_0.05_155)] text-[oklch(0.4_0.15_155)]",
    warning: "bg-[oklch(0.96_0.06_75)] text-[oklch(0.45_0.15_50)]",
    danger: "bg-[oklch(0.95_0.05_25)] text-[oklch(0.45_0.2_25)]",
    info: "bg-[oklch(0.95_0.04_240)] text-[oklch(0.4_0.16_240)]",
    neutral: "bg-muted text-muted-foreground",
  };
  return <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium ${tones[tone]}`}>{status}</span>;
}

export function PageHeader({ title, subtitle, action }: { title: string; subtitle?: string; action?: React.ReactNode }) {
  return (
    <div className="flex flex-wrap items-end justify-between gap-4 mb-6">
      <div>
        <h1 className="text-2xl sm:text-3xl font-bold">{title}</h1>
        {subtitle && <p className="text-sm text-muted-foreground mt-1">{subtitle}</p>}
      </div>
      {action}
    </div>
  );
}

export function EmptyState({ title, description }: { title: string; description?: string }) {
  return (
    <div className="card-soft p-10 text-center">
      <p className="font-semibold">{title}</p>
      {description && <p className="text-sm text-muted-foreground mt-1">{description}</p>}
    </div>
  );
}
