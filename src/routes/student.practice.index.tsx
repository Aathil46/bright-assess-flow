import { createFileRoute, Link } from "@tanstack/react-router";
import { BookOpen } from "lucide-react";
import { EmptyState, PageHeader, SectionCard } from "@/components/common/page";
import { AccuracyBar } from "@/components/common/analytics";
import { LevelPill } from "@/components/common/status-pill";
import {
  CURRENT_STUDENT_ID,
  conceptById,
  levelOf,
  practiceSets,
  studentById,
} from "@/lib/mock-data";

export const Route = createFileRoute("/student/practice/")({
  head: () => ({
    meta: [
      { title: "Practice — AI Smart Assessment" },
      { name: "description", content: "Practise the concepts you find hardest with instant explanations." },
      { property: "og:title", content: "Practice — AI Smart Assessment" },
      { property: "og:description", content: "Practise the concepts you find hardest with instant explanations." },
    ],
  }),
  component: PracticeList,
});

function PracticeList() {
  const student = studentById(CURRENT_STUDENT_ID)!;
  const available = Object.keys(practiceSets)
    .map((conceptId) => ({
      conceptId,
      accuracy: student.conceptPerformance.find((p) => p.conceptId === conceptId)?.accuracy ?? 0,
      count: practiceSets[conceptId]!.length,
    }))
    .sort((a, b) => a.accuracy - b.accuracy);

  return (
    <div className="space-y-6">
      <PageHeader
        title="Practice"
        description="Short question sets built around the concepts you're working on."
      />

      {available.length === 0 ? (
        <EmptyState
          icon={BookOpen}
          title="No practice sets yet"
          description="Practice unlocks once you've attempted an assessment."
        />
      ) : (
        <SectionCard title="Recommended for you" description="Weakest concepts first.">
          <ul className="grid gap-4 md:grid-cols-2">
            {available.map((item) => (
              <li key={item.conceptId} className="rounded-xl border border-border p-4">
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <h2 className="text-sm font-semibold">{conceptById(item.conceptId).name}</h2>
                    <p className="mt-0.5 text-xs text-muted-foreground">
                      {item.count} questions · {conceptById(item.conceptId).subject}
                    </p>
                  </div>
                  <LevelPill level={levelOf(item.accuracy)} />
                </div>
                <div className="mt-4 flex items-center gap-3">
                  <AccuracyBar value={item.accuracy} />
                  <span className="w-11 text-right text-sm font-semibold tnum">{item.accuracy}%</span>
                </div>
                <Link
                  to="/student/practice/$conceptId"
                  params={{ conceptId: item.conceptId }}
                  className="mt-4 inline-flex rounded-lg bg-primary px-4 py-2 text-sm font-semibold text-primary-foreground hover:opacity-90"
                >
                  Start practice
                </Link>
              </li>
            ))}
          </ul>
        </SectionCard>
      )}
    </div>
  );
}
