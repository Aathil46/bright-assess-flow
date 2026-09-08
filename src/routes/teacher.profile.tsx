import { useState } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { CheckCircle2, Mail, School, User } from "lucide-react";
import { PageHeader, SectionCard, StatCard } from "@/components/common/page";
import { CURRENT_TEACHER_ID, classes, teacherById } from "@/lib/mock-data";

export const Route = createFileRoute("/teacher/profile")({
  head: () => ({
    meta: [
      { title: "Teacher Profile — AI Smart Assessment" },
      { name: "description", content: "View and update your teaching profile, subject and classes." },
      { property: "og:title", content: "Teacher Profile — AI Smart Assessment" },
      { property: "og:description", content: "View and update your teaching profile, subject and classes." },
    ],
  }),
  component: ProfilePage,
});

function ProfilePage() {
  const teacher = teacherById(CURRENT_TEACHER_ID)!;
  const [name, setName] = useState(teacher.name);
  const [subject, setSubject] = useState(teacher.subject);
  const [saved, setSaved] = useState(false);
  const myClasses = classes.filter((c) => c.teacherId === teacher.id);

  return (
    <div className="space-y-6">
      <PageHeader title="Profile" description="Your account details in this prototype." />

      <div className="grid gap-4 sm:grid-cols-3">
        <StatCard label="Classes" value={myClasses.length} icon={School} />
        <StatCard label="Assessments created" value={teacher.assessmentsCreated} icon={User} />
        <StatCard label="Average class score" value={`${teacher.avgClassScore}%`} icon={CheckCircle2} tone="medium" />
      </div>

      <SectionCard title="Account details" description="Changes are kept in this browser only.">
        <form
          className="grid max-w-xl gap-4"
          onSubmit={(e) => {
            e.preventDefault();
            setSaved(true);
            window.setTimeout(() => setSaved(false), 2500);
          }}
        >
          <label className="grid gap-1.5 text-sm">
            <span className="font-medium">Full name</span>
            <input
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="h-10 rounded-lg border border-border bg-card px-3 text-sm"
            />
          </label>
          <label className="grid gap-1.5 text-sm">
            <span className="font-medium">Email</span>
            <span className="flex h-10 items-center gap-2 rounded-lg border border-border bg-secondary px-3 text-sm text-muted-foreground">
              <Mail className="size-4" aria-hidden />
              {teacher.email}
            </span>
          </label>
          <label className="grid gap-1.5 text-sm">
            <span className="font-medium">Subject</span>
            <select
              value={subject}
              onChange={(e) => setSubject(e.target.value)}
              className="h-10 rounded-lg border border-border bg-card px-3 text-sm"
            >
              <option>Mathematics</option>
              <option>Science</option>
              <option>English</option>
            </select>
          </label>
          <div className="flex items-center gap-3">
            <button
              type="submit"
              className="rounded-lg bg-primary px-4 py-2 text-sm font-semibold text-primary-foreground hover:opacity-90"
            >
              Save changes
            </button>
            {saved ? (
              <span className="flex items-center gap-1.5 text-sm font-medium text-strong" role="status">
                <CheckCircle2 className="size-4" aria-hidden /> Saved
              </span>
            ) : null}
          </div>
        </form>
      </SectionCard>

      <SectionCard title="My classes">
        <ul className="divide-y divide-border">
          {myClasses.map((c) => (
            <li key={c.id} className="flex flex-wrap items-center justify-between gap-2 py-3">
              <span className="text-sm font-medium">{c.name}</span>
              <span className="text-xs text-muted-foreground tnum">
                {c.studentIds.length} students · avg {c.avgScore}%
              </span>
            </li>
          ))}
        </ul>
      </SectionCard>
    </div>
  );
}
