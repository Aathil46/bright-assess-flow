import { useState } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { ChevronDown, Target } from "lucide-react";
import { EmptyState, PageHeader, SectionCard } from "@/components/common/page";
import { AccuracyBar, AIPanel } from "@/components/common/analytics";
import { LevelPill } from "@/components/common/status-pill";
import { classById, levelOf, schoolWeakConcepts } from "@/lib/mock-data";

export const Route = createFileRoute("/principal/weak-concepts")({
  head: () => ({
    meta: [
      { title: "Weak Concepts — AI Smart Assessment" },
      { name: "description", content: "Concepts with the lowest school-wide accuracy and the classes affected." },
      { property: "og:title", content: "Weak Concepts — AI Smart Assessment" },
      { property: "og:description", content: "Concepts with the lowest school-wide accuracy and the classes affected." },
    ],
  }),
  component: WeakConcepts,
});

function WeakConcepts() {
  const rows = schoolWeakConcepts();
  const [open, setOpen] = useState<string | null>(rows[0]?.concept.id ?? null);

  return (
    <div className="space-y-6">
      <PageHeader
        title="Weak concepts"
        description="Ranked by school-wide accuracy. A concept below 50% is classified as Weak."
      />

      {rows.length === 0 ? (
        <EmptyState icon={Target} title="No concept data yet" description="Concept accuracy appears once assessments are graded." />
      ) : (
        <div className="space-y-3">
          {rows.map((row) => {
            const expanded = open === row.concept.id;
            return (
              <div key={row.concept.id} className="card-surface overflow-hidden">
                <button
                  type="button"
                  aria-expanded={expanded}
                  onClick={() => setOpen(expanded ? null : row.concept.id)}
                  className="flex w-full flex-wrap items-center gap-4 px-5 py-4 text-left hover:bg-secondary/60"
                >
                  <div className="min-w-0 sm:w-56">
                    <p className="truncate text-sm font-semibold">{row.concept.name}</p>
                    <p className="text-xs text-muted-foreground">{row.concept.subject}</p>
                  </div>
                  <div className="flex flex-1 items-center gap-3">
                    <AccuracyBar value={row.accuracy} />
                    <span className="w-11 text-right text-sm font-semibold tnum">{row.accuracy}%</span>
                  </div>
                  <LevelPill level={levelOf(row.accuracy)} />
                  <ChevronDown
                    className={`size-4 text-muted-foreground transition-transform ${expanded ? "rotate-180" : ""}`}
                    aria-hidden
                  />
                </button>
                {expanded ? (
                  <div className="border-t border-border px-5 py-4">
                    <p className="text-sm text-muted-foreground">{row.concept.description}</p>
                    <div className="mt-4 grid gap-4 sm:grid-cols-2">
                      <div>
                        <h3 className="text-xs font-medium text-muted-foreground uppercase">
                          Classes affected
                        </h3>
                        <ul className="mt-2 flex flex-wrap gap-2">
                          {row.relatedClasses.map((id) => (
                            <li
                              key={id}
                              className="rounded-full border border-border px-3 py-1 text-xs text-muted-foreground"
                            >
                              {classById(id)?.name ?? id}
                            </li>
                          ))}
                        </ul>
                      </div>
                      <div>
                        <h3 className="text-xs font-medium text-muted-foreground uppercase">
                          Students below 50% ({row.affected.length})
                        </h3>
                        <ul className="mt-2 flex flex-wrap gap-2">
                          {row.affected.slice(0, 8).map((s) => (
                            <li key={s.id} className="rounded-full bg-secondary px-3 py-1 text-xs">
                              {s.name}
                            </li>
                          ))}
                          {row.affected.length > 8 ? (
                            <li className="px-2 py-1 text-xs text-muted-foreground">
                              +{row.affected.length - 8} more
                            </li>
                          ) : null}
                        </ul>
                      </div>
                    </div>
                  </div>
                ) : null}
              </div>
            );
          })}
        </div>
      )}

      <AIPanel title="Where to intervene first">
        <p className="text-sm leading-relaxed">
          {rows[0]
            ? `${rows[0].concept.name} is the lowest-performing concept school-wide at ${rows[0].accuracy}%, affecting ${rows[0].affected.length} students across ${rows[0].relatedClasses.length} classes. A shared re-teaching session across those classes is likely to lift results faster than class-by-class remediation.`
            : "No concept data available yet."}
        </p>
      </AIPanel>
    </div>
  );
}
