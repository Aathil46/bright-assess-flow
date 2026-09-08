import { createFileRoute, Link } from "@tanstack/react-router";
import { BookOpen, ClipboardList, GraduationCap, TrendingUp } from "lucide-react";
import { PageHeader, SectionCard, StatCard, EmptyState } from "@/components/common/page";
import { AIPanel, ConceptAccuracyRow } from "@/components/common/analytics";
import { AssessmentStatusPill } from "@/components/common/status-pill";
import {
  CURRENT_STUDENT_ID,
  assessments,
  classById,
  conceptById,
  studentById,
} from "@/lib/mock-data";

export const Route = createFileRoute("/student/dashboard")({
  head: () => ({
    meta: [
      { title: "Student Dashboard — AI Smart Assessment" },
      { name: "description", content: "See your assigned assessments, recent scores and concepts to practise." },
      { property: "og:title", content: "Student Dashboard — AI Smart Assessment" },
      { property: "og:description", content: "See your assigned assessments, recent scores and concepts to practise." },
    ],
  }),
  component: StudentDashboard,
});

function StudentDashboard() {
  const student = studentById(CURRENT_STUDENT_ID)!;
  const myAssessments = assessments.filter(
    (a) => student.classIds.includes(a.classId) && a.status !== "draft" && a.status !== "review",
  );
  const pending = myAssessments.filter((a) => a.status === "published");
  const perf = [...student.conceptPerformance].sort((a, b) => a.accuracy - b.accuracy);
  const weakest = perf.filter((p) => p.accuracy < 50);

  return (
    <div className="space-y-6">
      <PageHeader
        title={`Hello, ${student.name.split(" ")[0]}`}
        description="Here's what's waiting for you today."
        actions={
          <Link
            to="/student/practice"
            className="rounded-lg bg-primary px-4 py-2 text-sm font-semibold text-primary-foreground hover:opacity-90"
          >
            Start practice
          </Link>
        }
      />

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <StatCard label="My classes" value={student.classIds.length} icon={GraduationCap} />
        <StatCard label="Pending assessments" value={pending.length} icon={ClipboardList} tone="medium" />
        <StatCard label="Average score" value={`${student.avgScore}%`} icon={TrendingUp} />
        <StatCard label="Concepts to improve" value={weakest.length} icon={BookOpen} tone="weak" />
      </div>

      <div className="grid gap-6 xl:grid-cols-3">
        <SectionCard
          className="xl:col-span-2"
          title="Your assessments"
          description="Assessments assigned to your classes."
          action={
            <Link to="/student/assessments" className="text-sm font-medium text-primary hover:underline">
              View all
            </Link>
          }
        >
          {myAssessments.length === 0 ? (
            <EmptyState
              icon={ClipboardList}
              title="Nothing assigned yet"
              description="When your teacher publishes an assessment, it will show up here."
            />
          ) : (
            <ul className="divide-y divide-border">
              {myAssessments.slice(0, 4).map((a) => (
                <li key={a.id} className="flex flex-wrap items-center justify-between gap-3 py-3">
                  <div className="min-w-0">
                    <p className="truncate text-sm font-medium">{a.title}</p>
                    <p className="text-xs text-muted-foreground">
                      {classById(a.classId)?.name} · {a.questions.length} questions
                      {a.dueDate ? ` · due ${a.dueDate}` : ""}
                    </p>
                  </div>
                  <div className="flex items-center gap-3">
                    <AssessmentStatusPill status={a.status} />
                    {a.status === "results_available" ? (
                      <Link
                        to="/student/results/$assessmentId"
                        params={{ assessmentId: a.id }}
                        className="text-sm font-medium text-primary hover:underline"
                      >
                        Results
                      </Link>
                    ) : (
                      <Link
                        to="/student/assessments/$assessmentId"
                        params={{ assessmentId: a.id }}
                        className="text-sm font-medium text-primary hover:underline"
                      >
                        Start
                      </Link>
                    )}
                  </div>
                </li>
              ))}
            </ul>
          )}
        </SectionCard>

        <SectionCard title="Concept performance" description="Lowest scoring concepts first.">
          <div className="divide-y divide-border">
            {perf.slice(0, 5).map((p) => (
              <ConceptAccuracyRow key={p.conceptId} conceptId={p.conceptId} accuracy={p.accuracy} />
            ))}
          </div>
        </SectionCard>
      </div>

      <AIPanel title="Your personalised study tip">
        <p className="text-sm leading-relaxed">
          {weakest.length > 0
            ? `You lose most marks on ${conceptById(weakest[0]!.conceptId).name}. Try a short practice set of four questions today, then revisit ${conceptById(perf[1]!.conceptId).name} tomorrow.`
            : "Your scores are steady across all concepts. Keep practising the ones just under 80% to move them into Strong."}
        </p>
        <Link
          to="/student/practice"
          className="mt-4 inline-block rounded-lg border border-ai/30 bg-ai-soft px-3 py-1.5 text-sm font-medium text-ai"
        >
          Practise now
        </Link>
      </AIPanel>
    </div>
  );
}
