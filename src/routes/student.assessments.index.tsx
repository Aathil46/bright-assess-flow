import { useState } from "react";
import { createFileRoute, Link } from "@tanstack/react-router";
import { ClipboardList } from "lucide-react";
import { EmptyState, PageHeader } from "@/components/common/page";
import { TabNav, TabPanel } from "@/components/common/tab-nav";
import { AssessmentStatusPill } from "@/components/common/status-pill";
import { CURRENT_STUDENT_ID, assessments, classById, studentById } from "@/lib/mock-data";

export const Route = createFileRoute("/student/assessments/")({
  head: () => ({
    meta: [
      { title: "My Assessments — AI Smart Assessment" },
      { name: "description", content: "Assessments assigned to you, in progress and completed." },
      { property: "og:title", content: "My Assessments — AI Smart Assessment" },
      { property: "og:description", content: "Assessments assigned to you, in progress and completed." },
    ],
  }),
  component: StudentAssessments,
});

type Tab = "available" | "completed";

function StudentAssessments() {
  const student = studentById(CURRENT_STUDENT_ID)!;
  const mine = assessments.filter(
    (a) => student.classIds.includes(a.classId) && a.status !== "draft" && a.status !== "review",
  );
  const available = mine.filter((a) => a.status === "published");
  const completed = mine.filter((a) => a.status === "results_available");
  const [tab, setTab] = useState<Tab>("available");
  const list = tab === "available" ? available : completed;

  return (
    <div className="space-y-6">
      <PageHeader title="Assessments" description="Everything assigned to your classes." />

      <TabNav
        label="Assessment filters"
        value={tab}
        onChange={setTab}
        tabs={[
          { id: "available", label: "To do", count: available.length },
          { id: "completed", label: "Completed", count: completed.length },
        ]}
      />

      <TabPanel id={tab}>
        {list.length === 0 ? (
          <EmptyState
            icon={ClipboardList}
            title={tab === "available" ? "Nothing to do right now" : "No completed assessments yet"}
            description={
              tab === "available"
                ? "New assessments from your teacher will appear here."
                : "Once you submit an assessment and results are released, it shows up here."
            }
          />
        ) : (
          <ul className="grid gap-4 md:grid-cols-2">
            {list.map((a) => (
              <li key={a.id} className="card-surface flex flex-col gap-3 p-5">
                <div className="flex items-start justify-between gap-3">
                  <h2 className="text-base font-semibold">{a.title}</h2>
                  <AssessmentStatusPill status={a.status} />
                </div>
                <p className="text-sm text-muted-foreground">
                  {classById(a.classId)?.name} · {a.questions.length} questions
                  {a.dueDate ? ` · due ${a.dueDate}` : ""}
                </p>
                {tab === "available" ? (
                  <Link
                    to="/student/assessments/$assessmentId"
                    params={{ assessmentId: a.id }}
                    className="mt-auto inline-flex w-fit rounded-lg bg-primary px-4 py-2 text-sm font-semibold text-primary-foreground hover:opacity-90"
                  >
                    Start assessment
                  </Link>
                ) : (
                  <Link
                    to="/student/results/$assessmentId"
                    params={{ assessmentId: a.id }}
                    className="mt-auto inline-flex w-fit rounded-lg border border-border px-4 py-2 text-sm font-semibold hover:bg-secondary"
                  >
                    View results
                  </Link>
                )}
              </li>
            ))}
          </ul>
        )}
      </TabPanel>
    </div>
  );
}
