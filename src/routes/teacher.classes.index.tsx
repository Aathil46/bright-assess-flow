import { useState } from "react";
import { createFileRoute, Link } from "@tanstack/react-router";
import { Check, Copy, Plus, Search, Users } from "lucide-react";
import { EmptyState, PageHeader } from "@/components/common/page";
import { CURRENT_TEACHER_ID, classes } from "@/lib/mock-data";
import type { ClassRoom } from "@/lib/types";

export const Route = createFileRoute("/teacher/classes/")({
  head: () => ({
    meta: [
      { title: "Classes · AI Smart Assessment" },
      {
        name: "description",
        content: "Manage your classes, share join codes and review class performance.",
      },
      { property: "og:title", content: "Classes · AI Smart Assessment" },
      {
        property: "og:description",
        content: "Manage your classes, share join codes and review class performance.",
      },
    ],
  }),
  component: ClassesPage,
});

export function JoinCode({ code }: { code: string }) {
  const [copied, setCopied] = useState(false);
  return (
    <button
      type="button"
      onClick={(e) => {
        e.preventDefault();
        e.stopPropagation();
        void navigator.clipboard?.writeText(code);
        setCopied(true);
        window.setTimeout(() => setCopied(false), 1600);
      }}
      aria-label={`Copy join code ${code}`}
      className="inline-flex items-center gap-2 rounded-md border border-border bg-secondary/70 px-2.5 py-1 font-mono text-sm tracking-[0.18em] hover:bg-secondary"
    >
      {code}
      {copied ? (
        <Check className="size-4 text-strong" aria-hidden />
      ) : (
        <Copy className="size-4 text-muted-foreground" aria-hidden />
      )}
      <span className="sr-only" role="status">
        {copied ? "Join code copied" : ""}
      </span>
    </button>
  );
}

function CreateClassDialog({
  open,
  onClose,
  onCreate,
}: {
  open: boolean;
  onClose: () => void;
  onCreate: (cls: ClassRoom) => void;
}) {
  const [name, setName] = useState("");
  const [subject, setSubject] = useState("Mathematics");
  const [grade, setGrade] = useState("Grade 8");
  const [error, setError] = useState<string | null>(null);
  const [created, setCreated] = useState<ClassRoom | null>(null);

  if (!open) return null;

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) {
      setError("Class name is required.");
      return;
    }
    const code = Array.from({ length: 6 }, () =>
      "ABCDEFGHJKLMNPQRSTUVWXYZ23456789".charAt(Math.floor(Math.random() * 32)),
    ).join("");
    const cls: ClassRoom = {
      id: `cl-${Date.now()}`,
      name: `${name} — ${subject}`,
      subject,
      grade,
      teacherId: CURRENT_TEACHER_ID,
      joinCode: code,
      studentIds: [],
      assessmentIds: [],
      lastActivity: "Just now",
      avgScore: 0,
      completionRate: 0,
    };
    setCreated(cls);
    onCreate(cls);
  };

  const close = () => {
    setCreated(null);
    setName("");
    setError(null);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 grid place-items-center bg-navy/50 px-4">
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby="create-class-title"
        className="w-full max-w-md rounded-xl bg-card p-6 shadow-[var(--shadow-overlay)]"
      >
        {created ? (
          <div className="text-center">
            <h2 id="create-class-title" className="text-xl font-bold">
              Class created
            </h2>
            <p className="mt-1 text-sm text-muted-foreground">
              Share this join code with your students.
            </p>
            <p className="mt-6 font-mono text-4xl font-bold tracking-[0.3em]">{created.joinCode}</p>
            <div className="mt-4 flex justify-center">
              <JoinCode code={created.joinCode} />
            </div>
            <button
              type="button"
              onClick={close}
              className="mt-6 h-11 w-full rounded-md bg-primary text-sm font-semibold text-primary-foreground hover:opacity-90"
            >
              Done
            </button>
          </div>
        ) : (
          <form onSubmit={submit} noValidate className="space-y-5">
            <div>
              <h2 id="create-class-title" className="text-xl font-bold">
                Create class
              </h2>
              <p className="mt-1 text-sm text-muted-foreground">
                A 6-character join code is generated automatically.
              </p>
            </div>
            <div>
              <label htmlFor="class-name" className="mb-1.5 block text-sm font-medium">
                Class name <span className="text-destructive">*</span>
              </label>
              <input
                id="class-name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Class 8C"
                aria-invalid={!!error}
                className="h-11 w-full rounded-md border border-input bg-card px-3 text-sm outline-none focus-visible:border-primary"
              />
              {error ? <p className="mt-1 text-xs text-destructive">{error}</p> : null}
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label htmlFor="class-subject" className="mb-1.5 block text-sm font-medium">
                  Subject
                </label>
                <select
                  id="class-subject"
                  value={subject}
                  onChange={(e) => setSubject(e.target.value)}
                  className="h-11 w-full rounded-md border border-input bg-card px-3 text-sm"
                >
                  <option>Mathematics</option>
                  <option>Science</option>
                </select>
              </div>
              <div>
                <label htmlFor="class-grade" className="mb-1.5 block text-sm font-medium">
                  Grade
                </label>
                <select
                  id="class-grade"
                  value={grade}
                  onChange={(e) => setGrade(e.target.value)}
                  className="h-11 w-full rounded-md border border-input bg-card px-3 text-sm"
                >
                  <option>Grade 7</option>
                  <option>Grade 8</option>
                  <option>Grade 9</option>
                </select>
              </div>
            </div>
            <div className="flex gap-3">
              <button
                type="button"
                onClick={close}
                className="h-11 flex-1 rounded-md border border-border text-sm font-medium hover:bg-secondary"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="h-11 flex-1 rounded-md bg-primary text-sm font-semibold text-primary-foreground hover:opacity-90"
              >
                Create class
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
}

function ClassesPage() {
  const [extra, setExtra] = useState<ClassRoom[]>([]);
  const [query, setQuery] = useState("");
  const [dialogOpen, setDialogOpen] = useState(false);

  const all = [...classes.filter((c) => c.teacherId === CURRENT_TEACHER_ID), ...extra];
  const filtered = all.filter((c) => c.name.toLowerCase().includes(query.toLowerCase()));

  return (
    <div className="space-y-6">
      <PageHeader
        title="Classes"
        description="Every class you teach, with its join code and current performance."
        actions={
          <button
            type="button"
            onClick={() => setDialogOpen(true)}
            className="inline-flex h-10 items-center gap-2 rounded-md bg-primary px-4 text-sm font-semibold text-primary-foreground hover:opacity-90"
          >
            <Plus className="size-4" aria-hidden />
            Create class
          </button>
        }
      />

      <div className="relative max-w-sm">
        <Search
          className="pointer-events-none absolute top-1/2 left-3 size-4 -translate-y-1/2 text-muted-foreground"
          aria-hidden
        />
        <label htmlFor="class-search" className="sr-only">
          Search classes
        </label>
        <input
          id="class-search"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search classes"
          className="h-10 w-full rounded-md border border-input bg-card pr-3 pl-9 text-sm outline-none focus-visible:border-primary"
        />
      </div>

      {filtered.length === 0 ? (
        <EmptyState
          icon={Users}
          title={query ? "No classes match your search" : "Create your first class"}
          description={
            query
              ? "Try a different class name or clear the search."
              : "Classes hold your students, materials and assessments. Students join with a 6-character code."
          }
          action={
            query ? (
              <button
                type="button"
                onClick={() => setQuery("")}
                className="h-10 rounded-md border border-border px-4 text-sm font-medium hover:bg-secondary"
              >
                Clear search
              </button>
            ) : (
              <button
                type="button"
                onClick={() => setDialogOpen(true)}
                className="h-10 rounded-md bg-primary px-4 text-sm font-semibold text-primary-foreground hover:opacity-90"
              >
                Create class
              </button>
            )
          }
        />
      ) : (
        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
          {filtered.map((c) => (
            <div key={c.id} className="card-surface flex flex-col p-5 transition-shadow hover:shadow-[var(--shadow-raised)]">
              <div className="flex items-start justify-between gap-3">
                <div>
                  <Link
                    to="/teacher/classes/$classId"
                    params={{ classId: c.id }}
                    className="font-display text-lg font-bold hover:text-primary"
                  >
                    {c.name}
                  </Link>
                  <p className="text-xs text-muted-foreground">
                    {c.grade} · Last activity {c.lastActivity}
                  </p>
                </div>
              </div>

              <dl className="mt-4 grid grid-cols-3 gap-2 text-center">
                <div className="rounded-lg bg-secondary/60 py-2">
                  <dt className="text-[11px] text-muted-foreground">Students</dt>
                  <dd className="text-lg font-semibold tnum">{c.studentIds.length}</dd>
                </div>
                <div className="rounded-lg bg-secondary/60 py-2">
                  <dt className="text-[11px] text-muted-foreground">Assessments</dt>
                  <dd className="text-lg font-semibold tnum">{c.assessmentIds.length}</dd>
                </div>
                <div className="rounded-lg bg-secondary/60 py-2">
                  <dt className="text-[11px] text-muted-foreground">Avg score</dt>
                  <dd className="text-lg font-semibold tnum">{c.avgScore}%</dd>
                </div>
              </dl>

              <div className="mt-4 flex items-center justify-between gap-3 border-t border-border pt-4">
                <div>
                  <p className="text-[11px] font-medium tracking-wide text-muted-foreground uppercase">
                    Join code
                  </p>
                  <div className="mt-1">
                    <JoinCode code={c.joinCode} />
                  </div>
                </div>
                <Link
                  to="/teacher/classes/$classId"
                  params={{ classId: c.id }}
                  className="h-9 rounded-md border border-border px-3 text-sm leading-9 font-medium hover:bg-secondary"
                >
                  Open
                </Link>
              </div>
            </div>
          ))}
        </div>
      )}

      <CreateClassDialog
        open={dialogOpen}
        onClose={() => setDialogOpen(false)}
        onCreate={(cls) => setExtra((prev) => [...prev, cls])}
      />
    </div>
  );
}
