import { createFileRoute } from "@tanstack/react-router";
import { PageHeader, SectionCard } from "@/components/common/page";
import { AccuracyBar } from "@/components/common/analytics";
import { LevelPill } from "@/components/common/status-pill";
import { classById, levelOf, teachers } from "@/lib/mock-data";

export const Route = createFileRoute("/principal/teachers")({
  head: () => ({
    meta: [
      { title: "Teachers — AI Smart Assessment" },
      { name: "description", content: "Teaching staff, their classes and average class performance." },
      { property: "og:title", content: "Teachers — AI Smart Assessment" },
      { property: "og:description", content: "Teaching staff, their classes and average class performance." },
    ],
  }),
  component: PrincipalTeachers,
});

function PrincipalTeachers() {
  return (
    <div className="space-y-6">
      <PageHeader title="Teachers" description="Staff activity and class outcomes." />

      <div className="grid gap-4 md:grid-cols-2">
        {teachers.map((t) => (
          <SectionCard key={t.id}>
            <div className="flex items-start justify-between gap-3">
              <div>
                <h2 className="text-base font-semibold">{t.name}</h2>
                <p className="text-sm text-muted-foreground">
                  {t.subject} · {t.email}
                </p>
              </div>
              <LevelPill level={levelOf(t.avgClassScore)} />
            </div>

            <div className="mt-4 flex items-center gap-3">
              <AccuracyBar value={t.avgClassScore} />
              <span className="w-11 text-right text-sm font-semibold tnum">{t.avgClassScore}%</span>
            </div>

            <dl className="mt-4 grid grid-cols-2 gap-3">
              <div className="rounded-lg bg-secondary px-4 py-3">
                <dt className="text-xs text-muted-foreground">Classes</dt>
                <dd className="mt-0.5 text-sm font-semibold tnum">{t.classIds.length}</dd>
              </div>
              <div className="rounded-lg bg-secondary px-4 py-3">
                <dt className="text-xs text-muted-foreground">Assessments created</dt>
                <dd className="mt-0.5 text-sm font-semibold tnum">{t.assessmentsCreated}</dd>
              </div>
            </dl>

            <ul className="mt-4 flex flex-wrap gap-2">
              {t.classIds.map((id) => (
                <li
                  key={id}
                  className="rounded-full border border-border bg-card px-3 py-1 text-xs text-muted-foreground"
                >
                  {classById(id)?.name}
                </li>
              ))}
            </ul>
          </SectionCard>
        ))}
      </div>
    </div>
  );
}
