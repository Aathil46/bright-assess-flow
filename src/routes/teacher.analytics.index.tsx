import { useState } from "react";
import { createFileRoute, Link } from "@tanstack/react-router";
import {
  Bar,
  BarChart,
  CartesianGrid,
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { TrendingUp } from "lucide-react";
import { PageHeader, SectionCard, StatCard } from "@/components/common/page";
import { AIPanel, ConceptAccuracyRow } from "@/components/common/analytics";
import {
  assessments,
  classById,
  classes,
  completionTrend,
  gapsForClass,
  levelOf,
  students,
} from "@/lib/mock-data";

export const Route = createFileRoute("/teacher/analytics/")({
  head: () => ({
    meta: [
      { title: "Class Analytics · AI Smart Assessment" },
      {
        name: "description",
        content:
          "Track average scores, pass rates and concept accuracy across every class you teach.",
      },
      { property: "og:title", content: "Class Analytics · AI Smart Assessment" },
      {
        property: "og:description",
        content: "Average scores, pass rates and concept accuracy across your classes.",
      },
    ],
  }),
  component: AnalyticsPage,
});

function AnalyticsPage() {
  const [classId, setClassId] = useState(classes[0]!.id);
  const cls = classById(classId)!;
  const gaps = gapsForClass(classId);
  const classStudents = cls.studentIds.map((id) => students.find((s) => s.id === id)!);
  const passCount = classStudents.filter((s) => s.avgScore > 50).length;

  const scoreBands = [
    { band: "0–25%", count: classStudents.filter((s) => s.avgScore <= 25).length },
    { band: "26–50%", count: classStudents.filter((s) => s.avgScore > 25 && s.avgScore <= 50).length },
    { band: "51–79%", count: classStudents.filter((s) => s.avgScore > 50 && s.avgScore < 80).length },
    { band: "80–100%", count: classStudents.filter((s) => s.avgScore >= 80).length },
  ];

  const classAssessments = assessments.filter((a) => a.classId === classId);

  return (
    <div className="space-y-6">
      <PageHeader
        title="Analytics"
        description="Every number here is calculated from submitted attempts."
        actions={
          <div>
            <label htmlFor="analytics-class" className="sr-only">
              Choose class
            </label>
            <select
              id="analytics-class"
              value={classId}
              onChange={(e) => setClassId(e.target.value)}
              className="h-10 rounded-md border border-input bg-card px-3 text-sm"
            >
              {classes.map((c) => (
                <option key={c.id} value={c.id}>
                  {c.name}
                </option>
              ))}
            </select>
          </div>
        }
      />

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <StatCard label="Average score" value={`${cls.avgScore}%`} tone={levelOf(cls.avgScore)} />
        <StatCard
          label="Pass rate"
          value={`${Math.round((passCount / (classStudents.length || 1)) * 100)}%`}
          hint="Pass is above 50%"
        />
        <StatCard label="Completion" value={`${cls.completionRate}%`} icon={TrendingUp} />
        <StatCard label="Assessments" value={classAssessments.length} />
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <SectionCard title="Score distribution" description="Students grouped by average score">
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={scoreBands} margin={{ left: -20, right: 8, top: 8 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="var(--color-border)" vertical={false} />
                <XAxis dataKey="band" tickLine={false} axisLine={false} fontSize={12} />
                <YAxis allowDecimals={false} tickLine={false} axisLine={false} fontSize={12} />
                <Tooltip
                  contentStyle={{
                    borderRadius: 10,
                    border: "1px solid var(--color-border)",
                    fontSize: 12,
                  }}
                />
                <Bar dataKey="count" name="Students" fill="var(--color-primary)" radius={[6, 6, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </SectionCard>

        <SectionCard title="Completion and pass rate trend">
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={completionTrend} margin={{ left: -20, right: 8, top: 8 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="var(--color-border)" vertical={false} />
                <XAxis dataKey="month" tickLine={false} axisLine={false} fontSize={12} />
                <YAxis domain={[0, 100]} tickLine={false} axisLine={false} fontSize={12} />
                <Tooltip
                  contentStyle={{
                    borderRadius: 10,
                    border: "1px solid var(--color-border)",
                    fontSize: 12,
                  }}
                />
                <Line
                  type="monotone"
                  dataKey="completion"
                  name="Completion %"
                  stroke="var(--color-primary)"
                  strokeWidth={2.5}
                  dot={false}
                />
                <Line
                  type="monotone"
                  dataKey="passRate"
                  name="Pass rate %"
                  stroke="var(--color-strong)"
                  strokeWidth={2.5}
                  dot={false}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </SectionCard>
      </div>

      <SectionCard
        title="Concept accuracy"
        description="Concepts below 50% are classified Weak"
        action={
          <Link to="/teacher/analytics/gaps" className="text-sm font-medium text-primary hover:underline">
            View learning gaps
          </Link>
        }
        bodyClassName="px-5 py-2"
      >
        <div className="divide-y divide-border">
          {gaps.length > 0 ? (
            gaps.map((g) => (
              <ConceptAccuracyRow
                key={g.conceptId}
                conceptId={g.conceptId}
                accuracy={g.accuracy}
                meta={`${g.affectedStudentIds.length} students affected`}
              />
            ))
          ) : (
            <p className="py-6 text-sm text-muted-foreground">
              No weak concepts recorded for this class yet.
            </p>
          )}
        </div>
      </SectionCard>

      <AIPanel title="Analytics summary">
        <p className="text-sm">
          {cls.name} averages {cls.avgScore}% with {passCount} of {classStudents.length} students
          passing. The largest single lever is{" "}
          {gaps[0] ? `${gaps[0].suggestedAction.toLowerCase()}` : "maintaining current pacing"}
        </p>
      </AIPanel>
    </div>
  );
}
