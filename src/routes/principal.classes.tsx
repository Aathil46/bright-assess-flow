import { useState } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { Search } from "lucide-react";
import { EmptyState, PageHeader, SectionCard } from "@/components/common/page";
import { AccuracyBar } from "@/components/common/analytics";
import { LevelPill } from "@/components/common/status-pill";
import { classes, levelOf, teacherById } from "@/lib/mock-data";

export const Route = createFileRoute("/principal/classes")({
  head: () => ({
    meta: [
      { title: "All Classes — AI Smart Assessment" },
      { name: "description", content: "Compare every class in the school by performance and completion." },
      { property: "og:title", content: "All Classes — AI Smart Assessment" },
      { property: "og:description", content: "Compare every class in the school by performance and completion." },
    ],
  }),
  component: PrincipalClasses,
});

function PrincipalClasses() {
  const [query, setQuery] = useState("");
  const [open, setOpen] = useState<string | null>(null);
  const filtered = classes.filter((c) =>
    `${c.name} ${c.subject} ${c.grade}`.toLowerCase().includes(query.toLowerCase()),
  );

  return (
    <div className="space-y-6">
      <PageHeader title="Classes" description="Every class in the school, ranked by average score." />

      <label className="relative block max-w-sm">
        <span className="sr-only">Search classes</span>
        <Search className="pointer-events-none absolute top-1/2 left-3 size-4 -translate-y-1/2 text-muted-foreground" aria-hidden />
        <input
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search classes"
          className="h-10 w-full rounded-lg border border-border bg-card pr-3 pl-9 text-sm"
        />
      </label>

      {filtered.length === 0 ? (
        <EmptyState
          icon={Search}
          title="No classes match that search"
          description="Try a different class name, subject or grade."
        />
      ) : (
        <SectionCard bodyClassName="p-0">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <caption className="sr-only">School classes and performance</caption>
              <thead className="bg-secondary text-left text-xs text-muted-foreground uppercase">
                <tr>
                  <th scope="col" className="px-5 py-3 font-medium">Class</th>
                  <th scope="col" className="px-5 py-3 font-medium">Teacher</th>
                  <th scope="col" className="px-5 py-3 font-medium">Students</th>
                  <th scope="col" className="px-5 py-3 font-medium">Avg score</th>
                  <th scope="col" className="px-5 py-3 font-medium">Completion</th>
                  <th scope="col" className="px-5 py-3 font-medium">Level</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {[...filtered]
                  .sort((a, b) => b.avgScore - a.avgScore)
                  .map((c) => (
                    <tr
                      key={c.id}
                      className="cursor-pointer hover:bg-secondary/60"
                      onClick={() => setOpen(open === c.id ? null : c.id)}
                    >
                      <td className="px-5 py-3 font-medium">{c.name}</td>
                      <td className="px-5 py-3 text-muted-foreground">{teacherById(c.teacherId)?.name}</td>
                      <td className="px-5 py-3 tnum">{c.studentIds.length}</td>
                      <td className="px-5 py-3">
                        <div className="flex items-center gap-2">
                          <AccuracyBar value={c.avgScore} className="w-24" />
                          <span className="tnum">{c.avgScore}%</span>
                        </div>
                      </td>
                      <td className="px-5 py-3 tnum">{c.completionRate}%</td>
                      <td className="px-5 py-3">
                        <LevelPill level={levelOf(c.avgScore)} />
                      </td>
                    </tr>
                  ))}
              </tbody>
            </table>
          </div>
        </SectionCard>
      )}

      {open ? (
        <SectionCard title={classes.find((c) => c.id === open)!.name} description="Class snapshot">
          <dl className="grid gap-4 sm:grid-cols-4">
            {[
              ["Grade", classes.find((c) => c.id === open)!.grade],
              ["Subject", classes.find((c) => c.id === open)!.subject],
              ["Assessments", String(classes.find((c) => c.id === open)!.assessmentIds.length)],
              ["Last activity", classes.find((c) => c.id === open)!.lastActivity],
            ].map(([label, value]) => (
              <div key={label} className="rounded-lg bg-secondary px-4 py-3">
                <dt className="text-xs text-muted-foreground">{label}</dt>
                <dd className="mt-0.5 text-sm font-semibold">{value}</dd>
              </div>
            ))}
          </dl>
        </SectionCard>
      ) : null}
    </div>
  );
}
