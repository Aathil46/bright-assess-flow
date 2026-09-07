import { Sparkles, CheckCircle2 } from "lucide-react";
import type { Role } from "@/lib/types";

const bullets = [
  "Upload material, let AI draft concept-tagged questions, and stay the author.",
  "See concept-level Strong / Medium / Weak performance, not just a score.",
  "Turn learning gaps into targeted practice and teaching action.",
];

export function AuthLayout({
  role,
  title,
  subtitle,
  children,
}: {
  role: Role;
  title: string;
  subtitle: string;
  children: React.ReactNode;
}) {
  return (
    <div data-role={role} className="min-h-screen bg-background lg:grid lg:grid-cols-2">
      <div className="hidden flex-col justify-between bg-navy p-12 lg:flex">
        <div className="flex items-center gap-3">
          <span className="grid size-10 place-items-center rounded-lg bg-primary text-primary-foreground">
            <Sparkles className="size-5" aria-hidden />
          </span>
          <span className="font-display text-lg font-bold text-navy-foreground">
            AI Smart Assessment
          </span>
        </div>
        <div className="max-w-md">
          <h2 className="font-display text-3xl font-bold text-navy-foreground">
            Assessment → Understanding → Intervention
          </h2>
          <ul className="mt-8 space-y-4">
            {bullets.map((b) => (
              <li key={b} className="flex gap-3 text-sm text-navy-muted">
                <CheckCircle2 className="mt-0.5 size-5 shrink-0 text-primary" aria-hidden />
                {b}
              </li>
            ))}
          </ul>
        </div>
        <p className="text-xs text-navy-muted">
          Prototype interface · Brightfield Public School demo data
        </p>
      </div>

      <div className="flex min-h-screen items-center justify-center px-4 py-12 lg:min-h-0">
        <div className="w-full max-w-md">
          <div className="mb-6 flex items-center gap-3 lg:hidden">
            <span className="grid size-10 place-items-center rounded-lg bg-primary text-primary-foreground">
              <Sparkles className="size-5" aria-hidden />
            </span>
            <span className="font-display text-lg font-bold">AI Smart Assessment</span>
          </div>
          <div className="card-surface p-6 sm:p-8">
            <h1 className="text-2xl font-bold">{title}</h1>
            <p className="mt-1 text-sm text-muted-foreground">{subtitle}</p>
            <div className="mt-6">{children}</div>
          </div>
        </div>
      </div>
    </div>
  );
}

export function RoleSelector({
  value,
  onChange,
  id = "role",
}: {
  value: Role;
  onChange: (role: Role) => void;
  id?: string;
}) {
  const roles: { role: Role; label: string; hint: string }[] = [
    { role: "teacher", label: "Teacher", hint: "Create & analyse" },
    { role: "student", label: "Student", hint: "Learn & practise" },
    { role: "principal", label: "Principal", hint: "School insight" },
  ];

  return (
    <fieldset>
      <legend className="mb-2 text-sm font-medium">I am a</legend>
      <div role="radiogroup" aria-label="Select your role" className="grid grid-cols-3 gap-2">
        {roles.map((r) => {
          const selected = value === r.role;
          return (
            <button
              key={r.role}
              id={`${id}-${r.role}`}
              type="button"
              role="radio"
              aria-checked={selected}
              onClick={() => onChange(r.role)}
              data-role={r.role}
              className={`rounded-lg border px-3 py-3 text-left transition-colors ${
                selected
                  ? "border-primary bg-primary-soft"
                  : "border-border bg-card hover:bg-secondary"
              }`}
            >
              <span
                className={`block text-sm font-semibold ${selected ? "text-primary" : "text-foreground"}`}
              >
                {r.label}
              </span>
              <span className="mt-0.5 block text-[11px] text-muted-foreground">{r.hint}</span>
            </button>
          );
        })}
      </div>
    </fieldset>
  );
}
