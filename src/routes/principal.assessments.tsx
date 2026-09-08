import { useState } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { ClipboardList } from "lucide-react";
import { EmptyState, PageHeader, SectionCard, StatCard } from "@/components/common/page";
import { TabNav, TabPanel } from "@/components/common/tab-nav";
import { AssessmentStatusPill } from "@/components/common/status-pill";
import { assessments, classById, teacherById } from "@/lib/mock-data";

export const Route = createFileRoute("/principal/assessments")({
  head: () => ({
    meta: [
      { title: "School Assessments — AI Smart Assessment" },
      { name: "description", content: "Every assessment across the school with participation and outcomes." },
      { property: "og:title", content: "School Assessments — AI Smart Assessment" },
      { property: "og:description", content: "Every assessment across the school with participation and outcomes." },
    ],
  }),
  component: PrincipalAssessments,
});

type Tab = "all" | "active" | "completed";

function PrincipalAssessments() {
  const [tab, setTab] = useState<Tab>("all");
  const active = assessments.filter((a) => a.status === "published" || a.status === "review");
  const completed = assessments.filter((a) => a.status === "results_available");
  const list = tab === "all" ? assessments : tab === "active" ? active : completed;

  const avg = Math.round(
    completed.reduce((s, a) => s + a.avgScore, 0) / Math.max(1, completed.length),
  );

  return (
    <div className="space-y-6">
      <PageHeader title="Assessments" description="Assessment activity across all classes." />

      <div className="grid gap-4 sm:grid-cols-3">
        <StatCard label="Total assessments" value={assessments.length} icon={ClipboardList} />
        <StatCard label="Currently active" value={active.length} tone="medium" />
        <StatCard label="Average score (graded)" value={`${avg}%`} tone="strong" />
      </div>

      <TabNav
        label="Assessment filters"
        value={tab}
        onChange={setTab}
        tabs={[
          { id: "all", label: "All", count: assessments.length },
          { id: "active", label: "Active", count: active.length },
          { id: "completed", label: "Completed", count: completed.length },
        ]}
      />

      <TabPanel id={tab}>
        {list.length === 0 ? (
          <EmptyState
            icon={ClipboardList}
            title="Nothing here"
            description="No assessments match this filter yet."
          />
        ) : (
          <SectionCard bodyClassName="p-0">
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <caption className="sr-only">School assessments</caption>
                <thead className="bg-secondary text-left text-xs text-muted-foreground uppercase">
                  <tr>
                    <th scope="col" className="px-5 py-3 font-medium">Assessment</th>
                    <th scope="col" className="px-5 py-3 font-medium">Class</th>
                    <th scope="col" className="px-5 py-3 font-medium">Teacher</th>
                    <th scope="col" className="px-5 py-3 font-medium">Participation</th>
                    <th scope="col" className="px-5 py-3 font-medium">Avg</th>
                    <th scope="col" className="px-5 py-3 font-medium">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border">
                  {list.map((a) => {
                    const cls = classById(a.classId);
                    return (
                      <tr key={a.id}>
                        <td className="px-5 py-3 font-medium">{a.title}</td>
                        <td className="px-5 py-3 text-muted-foreground">{cls?.name}</td>
                        <td className="px-5 py-3 text-muted-foreground">
                          {cls ? teacherById(cls.teacherId)?.name : "—"}
                        </td>
                        <td className="px-5 py-3 tnum">
                          {a.participation.submitted}/{a.participation.total}
                        </td>
                        <td className="px-5 py-3 tnum">{a.avgScore}%</td>
                        <td className="px-5 py-3">
                          <AssessmentStatusPill status={a.status} />
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </SectionCard>
        )}
      </TabPanel>
    </div>
  );
}
