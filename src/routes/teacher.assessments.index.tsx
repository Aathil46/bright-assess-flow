import { useState } from "react";
import { createFileRoute, Link } from "@tanstack/react-router";
import { ClipboardList, Plus } from "lucide-react";
import { EmptyState, PageHeader, SectionCard } from "@/components/common/page";
import { AssessmentStatusPill } from "@/components/common/status-pill";
import { assessments, classById, classes } from "@/lib/mock-data";
import type { AssessmentStatus } from "@/lib/types";

export const Route = createFileRoute("/teacher/assessments/")({
  head: () => ({
    meta: [
      { title: "Assessments · AI Smart Assessment" },
      {
        name: "description",
        content: "Draft, review, publish and track every assessment across your classes.",
      },
      { property: "og:title", content: "Assessments · AI Smart Assessment" },
      {
        property: "og:description",
        content: "Draft, review, publish and track every assessment across your classes.",
      },
    ],
  }),
  component: AssessmentsPage,
});

const statusFilters: { id: "all" | AssessmentStatus; label: string }[] = [
  { id: "all", label: "All" },
  { id: "draft", label: "Draft" },
  { id: "review", label: "In review" },
  { id: "published", label: "Published" },
  { id: "results_available", label: "Results" },
];

function AssessmentsPage() {
  const [status, setStatus] = useState<"all" | AssessmentStatus>("all");
  const [classId, setClassId] = useState("all");

  const visible = assessments.filter(
    (a) => (status === "all" || a.status === status) && (classId === "all" || a.classId === classId),
  );

  return (
    <div className="space-y-6">
      <PageHeader
        title="Assessments"
        description="Every assessment moves through draft, review, published and results."
        actions={
          <Link
            to="/teacher/assessments/new"
            className="inline-flex h-10 items-center gap-2 rounded-md bg-primary px-4 text-sm font-semibold text-primary-foreground hover:opacity-90"
          >
            <Plus className="size-4" aria-hidden />
            New assessment
          </Link>
        }
      />

      <div className="flex flex-wrap items-center justify-between gap-3">
        <div role="tablist" aria-label="Filter by status" className="flex flex-wrap gap-2">
          {statusFilters.map((f) => {
            const active = status === f.id;
            return (
              <button
                key={f.id}
                type="button"
                role="tab"
                aria-selected={active}
                onClick={() => setStatus(f.id)}
                className={`h-9 rounded-full border px-3.5 text-sm font-medium ${
                  active
                    ? "border-primary bg-primary-soft text-primary"
                    : "border-border bg-card text-muted-foreground hover:bg-secondary"
                }`}
              >
                {f.label}
              </button>
            );
          })}
        </div>
        <div>
          <label htmlFor="filter-class" className="sr-only">
            Filter by class
          </label>
          <select
            id="filter-class"
            value={classId}
            onChange={(e) => setClassId(e.target.value)}
            className="h-9 rounded-md border border-input bg-card px-3 text-sm"
          >
            <option value="all">All classes</option>
            {classes.map((c) => (
              <option key={c.id} value={c.id}>
                {c.name}
              </option>
            ))}
          </select>
        </div>
      </div>

      {visible.length === 0 ? (
        <EmptyState
          icon={ClipboardList}
          title="No assessments match these filters"
          description="Try a different status or class, or create a new assessment from a ready material."
          action={
            <Link
              to="/teacher/assessments/new"
              className="inline-flex h-10 items-center rounded-md bg-primary px-4 text-sm font-semibold text-primary-foreground hover:opacity-90"
            >
              Create assessment
            </Link>
          }
        />
      ) : (
        <SectionCard bodyClassName="p-0">
          <div className="overflow-x-auto">
            <table className="w-full min-w-[720px] text-sm">
              <caption className="sr-only">Assessments</caption>
              <thead className="bg-secondary/60 text-left text-xs tracking-wide text-muted-foreground uppercase">
                <tr>
                  <th scope="col" className="px-5 py-3 font-medium">Title</th>
                  <th scope="col" className="px-5 py-3 font-medium">Class</th>
                  <th scope="col" className="px-5 py-3 font-medium">Questions</th>
                  <th scope="col" className="px-5 py-3 font-medium">Due</th>
                  <th scope="col" className="px-5 py-3 font-medium">Submitted</th>
                  <th scope="col" className="px-5 py-3 font-medium">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {visible.map((a) => (
                  <tr key={a.id} className="hover:bg-secondary/40">
                    <td className="px-5 py-3">
                      <Link
                        to="/teacher/assessments/$assessmentId"
                        params={{ assessmentId: a.id }}
                        className="font-medium hover:text-primary"
                      >
                        {a.title}
                      </Link>
                      <p className="text-xs text-muted-foreground">Created {a.createdAt}</p>
                    </td>
                    <td className="px-5 py-3 text-muted-foreground">
                      {classById(a.classId)?.name}
                    </td>
                    <td className="px-5 py-3 tnum">{a.questions.length}</td>
                    <td className="px-5 py-3 text-muted-foreground">{a.dueDate ?? "—"}</td>
                    <td className="px-5 py-3 tnum">
                      {a.participation.submitted}/{a.participation.total}
                    </td>
                    <td className="px-5 py-3">
                      <AssessmentStatusPill status={a.status} />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </SectionCard>
      )}
    </div>
  );
}
