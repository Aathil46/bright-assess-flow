import { createFileRoute, Link } from "@tanstack/react-router";
import {
  ArrowRight,
  ClipboardList,
  Plus,
  Target,
  TrendingUp,
  Users,
} from "lucide-react";
import { PageHeader, SectionCard, StatCard } from "@/components/common/page";
import { AIPanel, ConceptAccuracyRow } from "@/components/common/analytics";
import { AssessmentStatusPill } from "@/components/common/status-pill";
import {
  CURRENT_TEACHER_ID,
  assessments,
  classById,
  classes,
  conceptById,
  learningGaps,
  recentActivity,
} from "@/lib/mock-data";

export const Route = createFileRoute("/teacher/dashboard")({
  head: () => ({
    meta: [
      { title: "Teacher Dashboard · AI Smart Assessment" },
      {
        name: "description",
        content:
          "Track classes, active assessments, participation and learning gaps at a glance.",
      },
      { property: "og:title", content: "Teacher Dashboard · AI Smart Assessment" },
      {
        property: "og:description",
        content: "Track classes, assessments, participation and learning gaps at a glance.",
      },
    ],
  }),
  component: TeacherDashboard,
});

function TeacherDashboard() {
  const myClasses = classes.filter((c) => c.teacherId === CURRENT_TEACHER_ID);
  const myClassIds = myClasses.map((c) => c.id);
  const myAssessments = assessments.filter((a) => myClassIds.includes(a.classId));
  const activeAssessments = myAssessments.filter(
    (a) => a.status === "published" || a.status === "available",
  );
  const studentCount = myClasses.reduce((s, c) => s + c.studentIds.length, 0);
  const avgPerformance = Math.round(
    myClasses.reduce((s, c) => s + c.avgScore, 0) / (myClasses.length || 1),
  );
  const myGaps = learningGaps.filter((g) => myClassIds.includes(g.classId));
  const needAttention = new Set(myGaps.flatMap((g) => g.affectedStudentIds)).size;

  return (
    <div className="space-y-6">
      <PageHeader
        title="Good morning, Priya"
        description="Here's what's happening across your classes today."
        actions={
          <>
            <Link
              to="/teacher/materials"
              className="inline-flex h-10 items-center gap-2 rounded-md border border-border bg-card px-4 text-sm font-medium hover:bg-secondary"
            >
              Upload material
            </Link>
            <Link
              to="/teacher/assessments/new"
              className="inline-flex h-10 items-center gap-2 rounded-md bg-primary px-4 text-sm font-semibold text-primary-foreground hover:opacity-90"
            >
              <Plus className="size-4" aria-hidden />
              New assessment
            </Link>
          </>
        }
      />

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <StatCard label="Classes" value={myClasses.length} hint={`${studentCount} students`} icon={Users} />
        <StatCard
          label="Active assessments"
          value={activeAssessments.length}
          hint={`${myAssessments.length} total created`}
          icon={ClipboardList}
        />
        <StatCard
          label="Avg. performance"
          value={`${avgPerformance}%`}
          hint="Across submitted attempts"
          icon={TrendingUp}
          tone={avgPerformance >= 80 ? "strong" : avgPerformance >= 50 ? "medium" : "weak"}
        />
        <StatCard
          label="Students needing attention"
          value={needAttention}
          hint="At least one Weak concept"
          icon={Target}
          tone="weak"
        />
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        <SectionCard
          className="lg:col-span-2"
          title="Recent assessments"
          description="Latest activity across your classes"
          action={
            <Link
              to="/teacher/assessments"
              className="inline-flex items-center gap-1 text-sm font-medium text-primary hover:underline"
            >
              View all <ArrowRight className="size-4" aria-hidden />
            </Link>
          }
          bodyClassName="p-0"
        >
          <ul className="divide-y divide-border">
            {myAssessments.map((a) => (
              <li key={a.id}>
                <Link
                  to="/teacher/assessments/$assessmentId"
                  params={{ assessmentId: a.id }}
                  className="flex flex-wrap items-center justify-between gap-3 px-5 py-4 hover:bg-secondary/60"
                >
                  <div className="min-w-0">
                    <p className="truncate text-sm font-semibold">{a.title}</p>
                    <p className="mt-0.5 text-xs text-muted-foreground">
                      {classById(a.classId)?.name} · {a.questions.length} questions ·{" "}
                      {a.participation.submitted}/{a.participation.total} submitted
                    </p>
                  </div>
                  <div className="flex items-center gap-3">
                    {a.status === "results_available" ? (
                      <span className="text-sm font-semibold tnum">{a.avgScore}% avg</span>
                    ) : null}
                    <AssessmentStatusPill status={a.status} />
                  </div>
                </Link>
              </li>
            ))}
          </ul>
        </SectionCard>

        <SectionCard title="Recent activity" bodyClassName="p-0">
          <ul className="divide-y divide-border">
            {recentActivity.map((item) => (
              <li key={item.id} className="px-5 py-3.5">
                <p className="text-sm">{item.text}</p>
                <p className="mt-0.5 text-xs text-muted-foreground">{item.time}</p>
              </li>
            ))}
          </ul>
        </SectionCard>
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        <SectionCard
          className="lg:col-span-2"
          title="Learning gaps snapshot"
          description="Weak concepts (below 50% accuracy) surfaced for action"
          action={
            <Link
              to="/teacher/analytics/gaps"
              className="inline-flex items-center gap-1 text-sm font-medium text-primary hover:underline"
            >
              Open learning gaps <ArrowRight className="size-4" aria-hidden />
            </Link>
          }
          bodyClassName="px-5 py-2"
        >
          <div className="divide-y divide-border">
            {myGaps.map((g) => (
              <ConceptAccuracyRow
                key={`${g.classId}-${g.conceptId}`}
                conceptId={g.conceptId}
                accuracy={g.accuracy}
                meta={`${classById(g.classId)?.name} · ${g.affectedStudentIds.length} students affected`}
              />
            ))}
          </div>
        </SectionCard>

        <AIPanel title="AI teaching suggestion">
          <p className="text-xs font-medium tracking-wide text-muted-foreground uppercase">
            System data
          </p>
          <p className="mt-1 text-sm">
            {conceptById(myGaps[0]?.conceptId ?? "c-fractions").name} accuracy:{" "}
            <span className="font-semibold tnum">{myGaps[0]?.accuracy ?? 42}%</span> in{" "}
            {classById(myGaps[0]?.classId ?? "cl-8a")?.name}.
          </p>
          <p className="mt-4 text-xs font-medium tracking-wide text-ai uppercase">AI suggestion</p>
          <p className="mt-1 text-sm text-foreground/80">{myGaps[0]?.aiSuggestion}</p>
        </AIPanel>
      </div>
    </div>
  );
}
