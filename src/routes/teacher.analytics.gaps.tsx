import { useState } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { AlertTriangle, Sparkles } from "lucide-react";
import { EmptyState, PageHeader, SectionCard } from "@/components/common/page";
import { AIPanel, AccuracyBar } from "@/components/common/analytics";
import { LevelPill, Pill } from "@/components/common/status-pill";
import { classById, classes, conceptById, learningGaps, levelOf, studentById } from "@/lib/mock-data";

export const Route = createFileRoute("/teacher/analytics/gaps")({
  head: () => ({
    meta: [
      { title: "Learning Gaps · AI Smart Assessment" },
      {
        name: "description",
        content:
          "See which concepts fall below 50% accuracy, who is affected and what to teach next.",
      },
      { property: "og:title", content: "Learning Gaps · AI Smart Assessment" },
      {
        property: "og:description",
        content: "Concepts below 50% accuracy, the students affected and suggested next steps.",
      },
    ],
  }),
  component: GapsPage,
});

function GapsPage() {
  const [classId, setClassId] = useState("all");
  const [open, setOpen] = useState<string | null>(learningGaps[0]?.conceptId ?? null);

  const visible = learningGaps.filter((g) => classId === "all" || g.classId === classId);

  return (
    <div className="space-y-6">
      <PageHeader
        title="Learning gaps"
        description="A concept is a gap when class accuracy falls below 50%. Suggestions are AI-written; the accuracy is calculated."
        actions={
          <div>
            <label htmlFor="gap-class" className="sr-only">
              Filter by class
            </label>
            <select
              id="gap-class"
              value={classId}
              onChange={(e) => setClassId(e.target.value)}
              className="h-10 rounded-md border border-input bg-card px-3 text-sm"
            >
              <option value="all">All classes</option>
              {classes.map((c) => (
                <option key={c.id} value={c.id}>
                  {c.name}
                </option>
              ))}
            </select>
          </div>
        }
      />

      {visible.length === 0 ? (
        <EmptyState
          icon={AlertTriangle}
          title="No learning gaps for this class"
          description="Every assessed concept is at or above 50% accuracy. Keep monitoring after the next assessment."
        />
      ) : (
        <ul className="space-y-4">
          {visible.map((gap) => {
            const concept = conceptById(gap.conceptId);
            const expanded = open === gap.conceptId;
            return (
              <li key={`${gap.conceptId}-${gap.classId}`} className="card-surface overflow-hidden">
                <button
                  type="button"
                  aria-expanded={expanded}
                  onClick={() => setOpen(expanded ? null : gap.conceptId)}
                  className="w-full px-5 py-4 text-left hover:bg-secondary/50"
                >
                  <div className="flex flex-wrap items-center justify-between gap-3">
                    <div>
                      <p className="font-semibold">{concept.name}</p>
                      <p className="mt-0.5 text-xs text-muted-foreground">
                        {classById(gap.classId)?.name} · {gap.affectedStudentIds.length} students
                        affected
                      </p>
                    </div>
                    <div className="flex items-center gap-3">
                      <Pill tone={gap.severity === "high" ? "rose" : "amber"}>
                        {gap.severity === "high" ? "High severity" : "Moderate"}
                      </Pill>
                      <LevelPill level={levelOf(gap.accuracy)} />
                      <span className="text-sm font-semibold tnum">{gap.accuracy}%</span>
                    </div>
                  </div>
                  <AccuracyBar value={gap.accuracy} className="mt-3" />
                </button>

                {expanded ? (
                  <div className="space-y-4 border-t border-border px-5 py-5">
                    <SectionCard title="Students affected" bodyClassName="p-0">
                      <ul className="divide-y divide-border">
                        {gap.affectedStudentIds.map((sid) => {
                          const student = studentById(sid);
                          const perf =
                            student?.conceptPerformance.find((c) => c.conceptId === gap.conceptId)
                              ?.accuracy ?? gap.accuracy;
                          return (
                            <li
                              key={sid}
                              className="flex items-center justify-between gap-3 px-4 py-2.5 text-sm"
                            >
                              <span className="font-medium">{student?.name}</span>
                              <span className="flex items-center gap-3">
                                <span className="tnum">{perf}%</span>
                                <LevelPill level={levelOf(perf)} />
                              </span>
                            </li>
                          );
                        })}
                      </ul>
                    </SectionCard>

                    <div className="rounded-lg border border-border bg-secondary/40 px-4 py-3">
                      <p className="text-xs font-medium tracking-wide text-muted-foreground uppercase">
                        Suggested action
                      </p>
                      <p className="mt-1 text-sm">{gap.suggestedAction}</p>
                    </div>

                    <AIPanel
                      title="AI teaching suggestion"
                      action={
                        <button
                          type="button"
                          className="inline-flex h-8 items-center gap-1.5 rounded-md border border-ai/30 bg-card px-2.5 text-xs font-medium text-ai hover:bg-ai-soft"
                        >
                          <Sparkles className="size-3.5" aria-hidden />
                          Regenerate
                        </button>
                      }
                    >
                      <p className="text-sm">{gap.aiSuggestion}</p>
                    </AIPanel>
                  </div>
                ) : null}
              </li>
            );
          })}
        </ul>
      )}
    </div>
  );
}
