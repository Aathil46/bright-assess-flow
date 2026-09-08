import { useState } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { Search, Users } from "lucide-react";
import { EmptyState, PageHeader, SectionCard, StatCard } from "@/components/common/page";
import { AccuracyBar } from "@/components/common/analytics";
import { LevelPill } from "@/components/common/status-pill";
import { classById, conceptById, levelOf, weakStudents } from "@/lib/mock-data";

export const Route = createFileRoute("/principal/weak-students")({
  head: () => ({
    meta: [
      { title: "Students Needing Support — AI Smart Assessment" },
      { name: "description", content: "Students with at least one weak concept, with class and concept detail." },
      { property: "og:title", content: "Students Needing Support — AI Smart Assessment" },
      { property: "og:description", content: "Students with at least one weak concept, with class and concept detail." },
    ],
  }),
  component: WeakStudents,
});

function WeakStudents() {
  const rows = weakStudents();
  const [query, setQuery] = useState("");
  const [open, setOpen] = useState<string | null>(null);
  const filtered = rows.filter((r) => r.student.name.toLowerCase().includes(query.toLowerCase()));

  return (
    <div className="space-y-6">
      <PageHeader
        title="Students needing support"
        description="A student is listed here when at least one concept is below 50%."
      />

      <div className="grid gap-4 sm:grid-cols-3">
        <StatCard label="Students flagged" value={rows.length} icon={Users} tone="weak" />
        <StatCard
          label="With 3+ weak concepts"
          value={rows.filter((r) => r.weakConcepts.length >= 3).length}
          tone="weak"
        />
        <StatCard
          label="Average score of flagged"
          value={`${Math.round(rows.reduce((s, r) => s + r.student.avgScore, 0) / Math.max(1, rows.length))}%`}
          tone="medium"
        />
      </div>

      <label className="relative block max-w-sm">
        <span className="sr-only">Search students</span>
        <Search className="pointer-events-none absolute top-1/2 left-3 size-4 -translate-y-1/2 text-muted-foreground" aria-hidden />
        <input
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search students"
          className="h-10 w-full rounded-lg border border-border bg-card pr-3 pl-9 text-sm"
        />
      </label>

      {filtered.length === 0 ? (
        <EmptyState
          icon={Users}
          title="No students match"
          description="Try a different name, or clear the search."
        />
      ) : (
        <SectionCard bodyClassName="p-0">
          <ul className="divide-y divide-border">
            {filtered.map(({ student, weakConcepts }) => {
              const expanded = open === student.id;
              return (
                <li key={student.id}>
                  <button
                    type="button"
                    aria-expanded={expanded}
                    onClick={() => setOpen(expanded ? null : student.id)}
                    className="flex w-full flex-wrap items-center gap-4 px-5 py-4 text-left hover:bg-secondary/60"
                  >
                    <div className="min-w-0 sm:w-56">
                      <p className="truncate text-sm font-semibold">{student.name}</p>
                      <p className="truncate text-xs text-muted-foreground">
                        {student.classIds.map((id) => classById(id)?.name).filter(Boolean).join(", ") || "No class"}
                      </p>
                    </div>
                    <div className="flex flex-1 items-center gap-3">
                      <AccuracyBar value={student.avgScore} />
                      <span className="w-11 text-right text-sm font-semibold tnum">{student.avgScore}%</span>
                    </div>
                    <span className="rounded-full bg-weak-soft px-2.5 py-0.5 text-xs font-medium text-weak">
                      {weakConcepts.length} weak
                    </span>
                    <LevelPill level={levelOf(student.avgScore)} />
                  </button>
                  {expanded ? (
                    <div className="border-t border-border bg-secondary/40 px-5 py-4">
                      <h3 className="text-xs font-medium text-muted-foreground uppercase">Weak concepts</h3>
                      <ul className="mt-3 space-y-2">
                        {weakConcepts.map((c) => (
                          <li key={c.conceptId} className="flex items-center gap-3">
                            <span className="w-44 truncate text-sm">{conceptById(c.conceptId).name}</span>
                            <AccuracyBar value={c.accuracy} className="max-w-xs" />
                            <span className="text-sm font-semibold tnum">{c.accuracy}%</span>
                          </li>
                        ))}
                      </ul>
                      <p className="mt-3 text-xs text-muted-foreground">
                        Last attempt: {student.lastAttempt ?? "no attempts recorded"}
                      </p>
                    </div>
                  ) : null}
                </li>
              );
            })}
          </ul>
        </SectionCard>
      )}
    </div>
  );
}
