import { createFileRoute, Link } from "@tanstack/react-router";
import {
  Area,
  AreaChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { ClipboardList, GraduationCap, School, Users } from "lucide-react";
import { PageHeader, SectionCard, StatCard } from "@/components/common/page";
import { AIPanel, ConceptAccuracyRow } from "@/components/common/analytics";
import {
  aiSchoolReview,
  completionTrend,
  school,
  schoolWeakConcepts,
} from "@/lib/mock-data";

export const Route = createFileRoute("/principal/overview")({
  head: () => ({
    meta: [
      { title: "School Overview — AI Smart Assessment" },
      { name: "description", content: "School-wide performance, participation trends and concepts needing attention." },
      { property: "og:title", content: "School Overview — AI Smart Assessment" },
      { property: "og:description", content: "School-wide performance, participation trends and concepts needing attention." },
    ],
  }),
  component: Overview,
});

function Overview() {
  const weakest = schoolWeakConcepts().slice(0, 5);

  return (
    <div className="space-y-6">
      <PageHeader title={school.name} description="School-wide performance across all classes and subjects." />

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <StatCard label="Students" value={school.studentCount} icon={Users} />
        <StatCard label="Classes" value={school.classCount} icon={School} />
        <StatCard label="Teachers" value={school.teacherCount} icon={GraduationCap} />
        <StatCard label="Assessments" value={school.assessmentCount} icon={ClipboardList} />
      </div>

      <div className="grid gap-4 sm:grid-cols-3">
        <StatCard label="Average performance" value={`${school.avgPerformance}%`} tone="medium" />
        <StatCard label="Pass rate" value={`${school.passRate}%`} tone="strong" />
        <StatCard label="Completion rate" value={`${school.completionRate}%`} tone="strong" />
      </div>

      <SectionCard title="Completion and pass rate" description="Last six months.">
        <div className="h-64 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={completionTrend} margin={{ left: -20, right: 8, top: 8 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="var(--color-border)" />
              <XAxis dataKey="month" tickLine={false} axisLine={false} fontSize={12} />
              <YAxis domain={[0, 100]} tickLine={false} axisLine={false} fontSize={12} />
              <Tooltip />
              <Area
                type="monotone"
                dataKey="completion"
                name="Completion %"
                stroke="var(--color-primary)"
                fill="var(--color-primary)"
                fillOpacity={0.15}
              />
              <Area
                type="monotone"
                dataKey="passRate"
                name="Pass rate %"
                stroke="var(--color-strong)"
                fill="var(--color-strong)"
                fillOpacity={0.12}
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </SectionCard>

      <SectionCard
        title="Weakest concepts school-wide"
        action={
          <Link to="/principal/weak-concepts" className="text-sm font-medium text-primary hover:underline">
            View all
          </Link>
        }
      >
        <div className="divide-y divide-border">
          {weakest.map((w) => (
            <ConceptAccuracyRow
              key={w.concept.id}
              conceptId={w.concept.id}
              accuracy={w.accuracy}
              meta={`${w.affected.length} students below 50%`}
            />
          ))}
        </div>
      </SectionCard>

      <AIPanel
        title="AI school review"
        action={
          <Link to="/principal/ai-review" className="text-xs font-medium text-ai hover:underline">
            Full review
          </Link>
        }
      >
        <ul className="space-y-2 text-sm">
          {aiSchoolReview.findings.map((f) => (
            <li key={f} className="flex gap-2">
              <span aria-hidden className="mt-1.5 size-1.5 shrink-0 rounded-full bg-ai" />
              {f}
            </li>
          ))}
        </ul>
      </AIPanel>
    </div>
  );
}
