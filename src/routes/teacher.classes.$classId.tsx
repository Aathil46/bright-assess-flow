import { useState } from "react";
import { createFileRoute, Link, notFound } from "@tanstack/react-router";
import { ArrowLeft, ClipboardList, Users } from "lucide-react";
import { EmptyState, PageHeader, SectionCard, StatCard } from "@/components/common/page";
import { TabNav, TabPanel } from "@/components/common/tab-nav";
import { AccuracyBar, ConceptAccuracyRow } from "@/components/common/analytics";
import { AssessmentStatusPill, LevelPill, Pill } from "@/components/common/status-pill";
import { JoinCode } from "./teacher.classes.index";
import {
  assessments as allAssessments,
  classById,
  gapsForClass,
  levelOf,
  recentActivity,
  studentById,
} from "@/lib/mock-data";

export const Route = createFileRoute("/teacher/classes/$classId")({
  loader: ({ params }) => {
    const cls = classById(params.classId);
    if (!cls) throw notFound();
    return { className: cls.name };
  },
  head: ({ loaderData }) => ({
    meta: [
      { title: loaderData ? `${loaderData.className} · AI Smart Assessment` : "Class · AI Smart Assessment" },
      {
        name: "description",
        content: "Class overview with students, assessments and concept-level performance.",
      },
      {
        property: "og:title",
        content: loaderData ? `${loaderData.className} · AI Smart Assessment` : "Class",
      },
      {
        property: "og:description",
        content: "Class overview with students, assessments and concept-level performance.",
      },
    ],
  }),
  component: ClassDetail,
});

type Tab = "overview" | "students" | "assessments" | "performance";

function ClassDetail() {
  const { classId } = Route.useParams();
  const cls = classById(classId);
  const [tab, setTab] = useState<Tab>("overview");
  const [sortDesc, setSortDesc] = useState(true);

  if (!cls) return null;

  const students = cls.studentIds.map((id) => studentById(id)).filter(Boolean);
  const classAssessments = allAssessments.filter((a) => a.classId === cls.id);
  const gaps = gapsForClass(cls.id);

  const conceptRows = [
    ...new Set(classAssessments.flatMap((a) => a.questions.map((q) => q.conceptId))),
  ].map((conceptId) => {
    const gap = gaps.find((g) => g.conceptId === conceptId);
    const accuracy =
      gap?.accuracy ??
      Math.round(
        students.reduce(
          (s, st) => s + (st!.conceptPerformance.find((c) => c.conceptId === conceptId)?.accuracy ?? 0),
          0,
        ) / (students.length || 1),
      );
    return { conceptId, accuracy };
  });

  const sortedStudents = [...students].sort((a, b) =>
    sortDesc ? b!.avgScore - a!.avgScore : a!.avgScore - b!.avgScore,
  );
  const passCount = students.filter((s) => s!.avgScore > 50).length;

  return (
    <div className="space-y-6">
      <Link
        to="/teacher/classes"
        className="inline-flex items-center gap-1.5 text-sm font-medium text-muted-foreground hover:text-foreground"
      >
        <ArrowLeft className="size-4" aria-hidden />
        All classes
      </Link>

      <PageHeader
        title={cls.name}
        description={`${cls.grade} · ${cls.studentIds.length} students · Last activity ${cls.lastActivity}`}
        actions={<JoinCode code={cls.joinCode} />}
      />

      <TabNav<Tab>
        label="Class sections"
        value={tab}
        onChange={setTab}
        tabs={[
          { id: "overview", label: "Overview" },
          { id: "students", label: "Students", count: students.length },
          { id: "assessments", label: "Assessments", count: classAssessments.length },
          { id: "performance", label: "Performance" },
        ]}
      />

      {tab === "overview" ? (
        <TabPanel id="overview">
          <div className="space-y-6">
            <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
              <StatCard label="Students" value={students.length} icon={Users} />
              <StatCard label="Assessments" value={classAssessments.length} icon={ClipboardList} />
              <StatCard
                label="Avg score"
                value={`${cls.avgScore}%`}
                tone={levelOf(cls.avgScore)}
              />
              <StatCard label="Completion" value={`${cls.completionRate}%`} />
            </div>
            <div className="grid gap-6 lg:grid-cols-3">
              <SectionCard title="Join code" className="lg:col-span-1">
                <p className="font-mono text-3xl font-bold tracking-[0.28em]">{cls.joinCode}</p>
                <p className="mt-2 text-sm text-muted-foreground">
                  Students enter this 6-character code to enrol in {cls.name}.
                </p>
                <div className="mt-4">
                  <JoinCode code={cls.joinCode} />
                </div>
              </SectionCard>
              <SectionCard title="Recent activity" className="lg:col-span-2" bodyClassName="p-0">
                <ul className="divide-y divide-border">
                  {recentActivity.slice(0, 4).map((a) => (
                    <li key={a.id} className="px-5 py-3.5">
                      <p className="text-sm">{a.text}</p>
                      <p className="mt-0.5 text-xs text-muted-foreground">{a.time}</p>
                    </li>
                  ))}
                </ul>
              </SectionCard>
            </div>
          </div>
        </TabPanel>
      ) : null}

      {tab === "students" ? (
        <TabPanel id="students">
          {students.length === 0 ? (
            <EmptyState
              icon={Users}
              title="No students yet"
              description={`Share the join code ${cls.joinCode} so students can enrol in this class.`}
            />
          ) : (
            <SectionCard bodyClassName="p-0">
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <caption className="sr-only">Students in {cls.name}</caption>
                  <thead className="bg-secondary/60 text-left text-xs tracking-wide text-muted-foreground uppercase">
                    <tr>
                      <th scope="col" className="px-5 py-3 font-medium">Name</th>
                      <th scope="col" className="px-5 py-3 font-medium">
                        <button
                          type="button"
                          onClick={() => setSortDesc((s) => !s)}
                          className="uppercase hover:text-foreground"
                          aria-label={`Sort by average score ${sortDesc ? "ascending" : "descending"}`}
                        >
                          Avg score {sortDesc ? "↓" : "↑"}
                        </button>
                      </th>
                      <th scope="col" className="px-5 py-3 font-medium">Status</th>
                      <th scope="col" className="px-5 py-3 font-medium">Last attempt</th>
                      <th scope="col" className="px-5 py-3 font-medium">Weak concepts</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-border">
                    {sortedStudents.map((s) => {
                      const weak = s!.conceptPerformance.filter((c) => c.accuracy < 50).length;
                      return (
                        <tr key={s!.id} className="hover:bg-secondary/40">
                          <td className="px-5 py-3">
                            <p className="font-medium">{s!.name}</p>
                            <p className="text-xs text-muted-foreground">{s!.email}</p>
                          </td>
                          <td className="px-5 py-3 font-semibold tnum">{s!.avgScore}%</td>
                          <td className="px-5 py-3">
                            <LevelPill level={levelOf(s!.avgScore)} />
                          </td>
                          <td className="px-5 py-3 text-muted-foreground">
                            {s!.lastAttempt ?? "No attempts yet"}
                          </td>
                          <td className="px-5 py-3">
                            {weak > 0 ? (
                              <Pill tone="rose">{weak} weak</Pill>
                            ) : (
                              <Pill tone="green">None</Pill>
                            )}
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
      ) : null}

      {tab === "assessments" ? (
        <TabPanel id="assessments">
          {classAssessments.length === 0 ? (
            <EmptyState
              icon={ClipboardList}
              title="No assessments yet"
              description="Generate an assessment from a ready learning material, or build one manually."
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
              <ul className="divide-y divide-border">
                {classAssessments.map((a) => (
                  <li key={a.id}>
                    <Link
                      to="/teacher/assessments/$assessmentId"
                      params={{ assessmentId: a.id }}
                      className="flex flex-wrap items-center justify-between gap-3 px-5 py-4 hover:bg-secondary/60"
                    >
                      <div>
                        <p className="text-sm font-semibold">{a.title}</p>
                        <p className="mt-0.5 text-xs text-muted-foreground">
                          {a.questions.length} questions · Created {a.createdAt}
                        </p>
                      </div>
                      <AssessmentStatusPill status={a.status} />
                    </Link>
                  </li>
                ))}
              </ul>
            </SectionCard>
          )}
        </TabPanel>
      ) : null}

      {tab === "performance" ? (
        <TabPanel id="performance">
          <div className="grid gap-6 lg:grid-cols-3">
            <SectionCard
              title="Concept accuracy"
              description="System-calculated from submitted attempts"
              className="lg:col-span-2"
              bodyClassName="px-5 py-2"
            >
              <div className="divide-y divide-border">
                {conceptRows.map((row) => (
                  <ConceptAccuracyRow
                    key={row.conceptId}
                    conceptId={row.conceptId}
                    accuracy={row.accuracy}
                  />
                ))}
              </div>
            </SectionCard>
            <SectionCard title="Pass / fail distribution">
              <p className="text-sm text-muted-foreground">
                Pass is above 50%. {passCount} of {students.length} students currently pass.
              </p>
              <div className="mt-5 space-y-4">
                <div>
                  <div className="flex justify-between text-sm font-medium">
                    <span>Pass</span>
                    <span className="tnum">{passCount}</span>
                  </div>
                  <AccuracyBar
                    value={Math.round((passCount / (students.length || 1)) * 100)}
                    className="mt-1.5"
                  />
                </div>
                <div>
                  <div className="flex justify-between text-sm font-medium">
                    <span>Fail</span>
                    <span className="tnum">{students.length - passCount}</span>
                  </div>
                  <div className="mt-1.5 h-2 w-full overflow-hidden rounded-full bg-secondary">
                    <div
                      className="h-full rounded-full bg-weak"
                      style={{
                        width: `${Math.round(((students.length - passCount) / (students.length || 1)) * 100)}%`,
                      }}
                    />
                  </div>
                </div>
              </div>
            </SectionCard>
          </div>
        </TabPanel>
      ) : null}
    </div>
  );
}
