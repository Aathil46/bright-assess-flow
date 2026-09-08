import { useState } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { CheckCircle2, GraduationCap, Loader2, Plus, XCircle } from "lucide-react";
import { EmptyState, PageHeader, SectionCard } from "@/components/common/page";
import {
  CURRENT_STUDENT_ID,
  classes,
  studentById,
  teacherById,
} from "@/lib/mock-data";

export const Route = createFileRoute("/student/classes")({
  head: () => ({
    meta: [
      { title: "My Classes — AI Smart Assessment" },
      { name: "description", content: "Join a class with a code and see the classes you belong to." },
      { property: "og:title", content: "My Classes — AI Smart Assessment" },
      { property: "og:description", content: "Join a class with a code and see the classes you belong to." },
    ],
  }),
  component: StudentClasses,
});

type JoinState = "idle" | "loading" | "success" | "invalid" | "already";

function StudentClasses() {
  const student = studentById(CURRENT_STUDENT_ID)!;
  const [joined, setJoined] = useState<string[]>(student.classIds);
  const [code, setCode] = useState("");
  const [state, setState] = useState<JoinState>("idle");
  const [joinedName, setJoinedName] = useState("");

  const myClasses = classes.filter((c) => joined.includes(c.id));

  function submit(e: React.FormEvent) {
    e.preventDefault();
    const value = code.trim().toUpperCase();
    if (value.length < 4) {
      setState("invalid");
      return;
    }
    setState("loading");
    window.setTimeout(() => {
      const match = classes.find((c) => c.joinCode === value);
      if (!match) {
        setState("invalid");
        return;
      }
      if (joined.includes(match.id)) {
        setState("already");
        return;
      }
      setJoined((prev) => [...prev, match.id]);
      setJoinedName(match.name);
      setState("success");
      setCode("");
    }, 800);
  }

  return (
    <div className="space-y-6">
      <PageHeader title="My classes" description="Join a new class using the code your teacher shared." />

      <SectionCard title="Join a class" description="Try M9AX35 or S8BQ71 in this prototype.">
        <form onSubmit={submit} className="flex flex-col gap-3 sm:flex-row sm:items-start">
          <div className="flex-1">
            <label htmlFor="joincode" className="sr-only">
              Class code
            </label>
            <input
              id="joincode"
              value={code}
              onChange={(e) => {
                setCode(e.target.value);
                setState("idle");
              }}
              placeholder="Enter class code"
              className="h-11 w-full rounded-lg border border-border bg-card px-3 font-mono text-sm tracking-[0.2em] uppercase"
              aria-describedby="joincode-msg"
            />
          </div>
          <button
            type="submit"
            disabled={state === "loading"}
            className="inline-flex h-11 items-center justify-center gap-2 rounded-lg bg-primary px-4 text-sm font-semibold text-primary-foreground hover:opacity-90 disabled:opacity-60"
          >
            {state === "loading" ? <Loader2 className="size-4 animate-spin" aria-hidden /> : <Plus className="size-4" aria-hidden />}
            Join class
          </button>
        </form>
        <p id="joincode-msg" className="mt-3 text-sm" role="status">
          {state === "invalid" ? (
            <span className="flex items-center gap-1.5 text-weak">
              <XCircle className="size-4" aria-hidden /> That code doesn't match any class. Check with your teacher.
            </span>
          ) : state === "already" ? (
            <span className="flex items-center gap-1.5 text-medium">
              <CheckCircle2 className="size-4" aria-hidden /> You're already in this class.
            </span>
          ) : state === "success" ? (
            <span className="flex items-center gap-1.5 text-strong">
              <CheckCircle2 className="size-4" aria-hidden /> You joined {joinedName}.
            </span>
          ) : (
            <span className="text-muted-foreground">Codes are six characters, like M8A24K.</span>
          )}
        </p>
      </SectionCard>

      {myClasses.length === 0 ? (
        <EmptyState
          icon={GraduationCap}
          title="You haven't joined a class yet"
          description="Enter the code your teacher gave you to get started."
        />
      ) : (
        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
          {myClasses.map((c) => (
            <article key={c.id} className="card-surface p-5">
              <h2 className="text-base font-semibold">{c.name}</h2>
              <p className="mt-1 text-sm text-muted-foreground">
                {c.grade} · {teacherById(c.teacherId)?.name}
              </p>
              <dl className="mt-4 grid grid-cols-3 gap-2 text-center">
                <div className="rounded-lg bg-secondary px-2 py-2">
                  <dt className="text-[11px] text-muted-foreground">Students</dt>
                  <dd className="text-sm font-semibold tnum">{c.studentIds.length}</dd>
                </div>
                <div className="rounded-lg bg-secondary px-2 py-2">
                  <dt className="text-[11px] text-muted-foreground">Assessments</dt>
                  <dd className="text-sm font-semibold tnum">{c.assessmentIds.length}</dd>
                </div>
                <div className="rounded-lg bg-secondary px-2 py-2">
                  <dt className="text-[11px] text-muted-foreground">Class avg</dt>
                  <dd className="text-sm font-semibold tnum">{c.avgScore}%</dd>
                </div>
              </dl>
            </article>
          ))}
        </div>
      )}
    </div>
  );
}
