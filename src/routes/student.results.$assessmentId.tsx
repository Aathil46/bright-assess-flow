import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowLeft, TrendingUp } from "lucide-react";
import { EmptyState, SectionCard, StatCard } from "@/components/common/page";
import { AIPanel, ConceptAccuracyRow } from "@/components/common/analytics";
import { PassFailPill } from "@/components/common/status-pill";
import {
  CURRENT_STUDENT_ID,
  assessmentById,
  classById,
  conceptById,
  levelOf,
  resultsForAssessment,
} from "@/lib/mock-data";

export const Route = createFileRoute("/student/results/$assessmentId")({
  head: () => ({
    meta: [
      { title: "Assessment Result — AI Smart Assessment" },
      { name: "description", content: "Your score, concept breakdown and what to practise next." },
      { property: "og:title", content: "Assessment Result — AI Smart Assessment" },
      { property: "og:description", content: "Your score, concept breakdown and what to practise next." },
    ],
  }),
  component: ResultDetail,
});

function ResultDetail() {
  const { assessmentId } = Route.useParams();
  const assessment = assessmentById(assessmentId);
  const result = assessment
    ? resultsForAssessment(assessment.id).find((r) => r.studentId === CURRENT_STUDENT_ID)
    : undefined;

  if (!assessment || !result) {
    return (
      <EmptyState
        icon={TrendingUp}
        title="Result not available"
        description="Your teacher hasn't released results for this assessment yet."
        action={
          <Link to="/student/results" className="text-sm font-medium text-primary hover:underline">
            Back to results
          </Link>
        }
      />
    );
  }

  const weak = result.conceptBreakdown.filter((b) => levelOf(b.accuracy) === "weak");

  return (
    <div className="space-y-6">
      <Link
        to="/student/results"
        className="inline-flex items-center gap-1.5 text-sm font-medium text-muted-foreground hover:text-foreground"
      >
        <ArrowLeft className="size-4" aria-hidden /> All results
      </Link>

      <div className="card-surface flex flex-wrap items-center justify-between gap-4 p-6">
        <div>
          <h1 className="text-2xl font-bold">{assessment.title}</h1>
          <p className="mt-1 text-sm text-muted-foreground">
            {classById(assessment.classId)?.name} · submitted {result.submittedAt}
          </p>
        </div>
        <div className="text-right">
          <p className="text-4xl font-bold tnum">{result.percentage}%</p>
          <p className="text-sm text-muted-foreground tnum">
            {result.score} of {result.total} correct
          </p>
          <div className="mt-2 flex justify-end">
            <PassFailPill percentage={result.percentage} />
          </div>
        </div>
      </div>

      <div className="grid gap-4 sm:grid-cols-3">
        <StatCard label="Class average" value={`${assessment.avgScore}%`} />
        <StatCard label="Class pass rate" value={`${assessment.passRate}%`} tone="strong" />
        <StatCard label="Concepts to improve" value={weak.length} tone="weak" />
      </div>

      <SectionCard title="Concept breakdown" description="How you did on each concept in this assessment.">
        <div className="divide-y divide-border">
          {result.conceptBreakdown.map((b) => (
            <ConceptAccuracyRow
              key={b.conceptId}
              conceptId={b.conceptId}
              accuracy={b.accuracy}
              meta={`${b.correct} of ${b.total} correct`}
              action={
                <Link
                  to="/student/practice/$conceptId"
                  params={{ conceptId: b.conceptId }}
                  className="text-xs font-medium text-primary hover:underline"
                >
                  Practise
                </Link>
              }
            />
          ))}
        </div>
      </SectionCard>

      <AIPanel title="What to do next">
        <p className="text-sm leading-relaxed">
          {weak.length > 0
            ? `Focus on ${weak.map((w) => conceptById(w.conceptId).name).join(" and ")}. Work through a short practice set, then re-check the worked examples in your class notes.`
            : "Strong result across every concept in this assessment. Stretch yourself with the harder practice questions to stay sharp."}
        </p>
      </AIPanel>
    </div>
  );
}
