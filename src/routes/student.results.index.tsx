import { createFileRoute, Link } from "@tanstack/react-router";
import { TrendingUp } from "lucide-react";
import { EmptyState, PageHeader, SectionCard, StatCard } from "@/components/common/page";
import { ConceptAccuracyRow } from "@/components/common/analytics";
import { PassFailPill } from "@/components/common/status-pill";
import {
  CURRENT_STUDENT_ID,
  assessments,
  resultsForAssessment,
  studentById,
} from "@/lib/mock-data";

export const Route = createFileRoute("/student/results/")({
  head: () => ({
    meta: [
      { title: "My Results — AI Smart Assessment" },
      { name: "description", content: "Your scores across assessments and concept-level strengths." },
      { property: "og:title", content: "My Results — AI Smart Assessment" },
      { property: "og:description", content: "Your scores across assessments and concept-level strengths." },
    ],
  }),
  component: ResultsList,
});

function ResultsList() {
  const student = studentById(CURRENT_STUDENT_ID)!;
  const rows = assessments
    .filter((a) => a.status === "results_available" && student.classIds.includes(a.classId))
    .map((a) => ({
      assessment: a,
      result: resultsForAssessment(a.id).find((r) => r.studentId === student.id),
    }))
    .filter((r) => r.result);

  const perf = [...student.conceptPerformance].sort((a, b) => b.accuracy - a.accuracy);

  return (
    <div className="space-y-6">
      <PageHeader title="My results" description="How you performed in each assessment." />

      <div className="grid gap-4 sm:grid-cols-3">
        <StatCard label="Assessments graded" value={rows.length} icon={TrendingUp} />
        <StatCard label="Average score" value={`${student.avgScore}%`} />
        <StatCard
          label="Strong concepts"
          value={perf.filter((p) => p.accuracy >= 80).length}
          tone="strong"
        />
      </div>

      {rows.length === 0 ? (
        <EmptyState
          icon={TrendingUp}
          title="No results yet"
          description="Your scores appear here once your teacher releases results."
        />
      ) : (
        <SectionCard title="Assessment results">
          <ul className="divide-y divide-border">
            {rows.map(({ assessment, result }) => (
              <li key={assessment.id} className="flex flex-wrap items-center justify-between gap-3 py-3">
                <div className="min-w-0">
                  <p className="truncate text-sm font-medium">{assessment.title}</p>
                  <p className="text-xs text-muted-foreground tnum">
                    {result!.score}/{result!.total} · submitted {result!.submittedAt}
                  </p>
                </div>
                <div className="flex items-center gap-3">
                  <span className="text-sm font-semibold tnum">{result!.percentage}%</span>
                  <PassFailPill percentage={result!.percentage} />
                  <Link
                    to="/student/results/$assessmentId"
                    params={{ assessmentId: assessment.id }}
                    className="text-sm font-medium text-primary hover:underline"
                  >
                    Details
                  </Link>
                </div>
              </li>
            ))}
          </ul>
        </SectionCard>
      )}

      <SectionCard title="Concept strengths" description="Across everything you've attempted.">
        <div className="divide-y divide-border">
          {perf.map((p) => (
            <ConceptAccuracyRow key={p.conceptId} conceptId={p.conceptId} accuracy={p.accuracy} />
          ))}
        </div>
      </SectionCard>
    </div>
  );
}
