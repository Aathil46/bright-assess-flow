import { useMemo, useState } from "react";
import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { ArrowLeft, ArrowRight, CheckCircle2, Clock, Loader2, Send } from "lucide-react";
import { EmptyState, SectionCard } from "@/components/common/page";
import { assessmentById, classById, conceptById } from "@/lib/mock-data";

export const Route = createFileRoute("/student/assessments/$assessmentId")({
  head: () => ({
    meta: [
      { title: "Take Assessment — AI Smart Assessment" },
      { name: "description", content: "Answer questions one at a time, review your answers and submit." },
      { property: "og:title", content: "Take Assessment — AI Smart Assessment" },
      { property: "og:description", content: "Answer questions one at a time, review your answers and submit." },
    ],
  }),
  component: Runner,
});

type Phase = "taking" | "review" | "submitting" | "done";

function Runner() {
  const { assessmentId } = Route.useParams();
  const navigate = useNavigate();
  const assessment = assessmentById(assessmentId);
  const [index, setIndex] = useState(0);
  const [answers, setAnswers] = useState<Record<string, number>>({});
  const [phase, setPhase] = useState<Phase>("taking");
  const [secondsLeft, setSecondsLeft] = useState(20 * 60);

  const questions = assessment?.questions ?? [];
  const answeredCount = Object.keys(answers).length;

  useMemo(() => {
    // simple countdown ticker started once
    if (typeof window === "undefined") return;
    const id = window.setInterval(() => setSecondsLeft((s) => (s > 0 ? s - 1 : 0)), 1000);
    return () => window.clearInterval(id);
  }, []);

  if (!assessment) {
    return (
      <EmptyState
        icon={Clock}
        title="Assessment not found"
        description="This assessment may have been closed by your teacher."
        action={
          <Link to="/student/assessments" className="text-sm font-medium text-primary hover:underline">
            Back to assessments
          </Link>
        }
      />
    );
  }

  const question = questions[index]!;
  const mm = String(Math.floor(secondsLeft / 60)).padStart(2, "0");
  const ss = String(secondsLeft % 60).padStart(2, "0");

  if (phase === "done") {
    const correct = questions.filter((q) => answers[q.id] === q.correctIndex).length;
    const pct = Math.round((correct / questions.length) * 100);
    return (
      <div className="mx-auto max-w-xl space-y-6 text-center">
        <div className="card-surface px-6 py-10">
          <span className="mx-auto grid size-14 place-items-center rounded-full bg-strong-soft text-strong">
            <CheckCircle2 className="size-7" aria-hidden />
          </span>
          <h1 className="mt-4 text-2xl font-bold">Assessment submitted</h1>
          <p className="mt-1 text-sm text-muted-foreground">
            You answered {answeredCount} of {questions.length} questions in {assessment.title}.
          </p>
          <p className="mt-6 text-5xl font-bold tnum">{pct}%</p>
          <p className="mt-1 text-sm text-muted-foreground">
            {correct} of {questions.length} correct
          </p>
          <div className="mt-8 flex flex-wrap justify-center gap-3">
            <Link
              to="/student/results/$assessmentId"
              params={{ assessmentId: assessment.id }}
              className="rounded-lg bg-primary px-4 py-2 text-sm font-semibold text-primary-foreground hover:opacity-90"
            >
              See detailed results
            </Link>
            <button
              type="button"
              onClick={() => void navigate({ to: "/student/dashboard" })}
              className="rounded-lg border border-border px-4 py-2 text-sm font-semibold hover:bg-secondary"
            >
              Back to dashboard
            </button>
          </div>
        </div>
      </div>
    );
  }

  if (phase === "review" || phase === "submitting") {
    return (
      <div className="mx-auto max-w-3xl space-y-6">
        <h1 className="text-2xl font-bold">Review your answers</h1>
        <p className="text-sm text-muted-foreground">
          {answeredCount} of {questions.length} answered. You can go back and change anything before submitting.
        </p>
        <SectionCard title={assessment.title}>
          <ul className="divide-y divide-border">
            {questions.map((q, i) => {
              const picked = answers[q.id];
              return (
                <li key={q.id} className="flex flex-wrap items-center justify-between gap-3 py-3">
                  <div className="min-w-0">
                    <p className="truncate text-sm font-medium">
                      {i + 1}. {q.text}
                    </p>
                    <p className="text-xs text-muted-foreground">
                      {picked === undefined ? "Not answered" : `Your answer: ${q.options[picked]}`}
                    </p>
                  </div>
                  <button
                    type="button"
                    onClick={() => {
                      setIndex(i);
                      setPhase("taking");
                    }}
                    className="rounded-md border border-border px-3 py-1.5 text-xs font-medium hover:bg-secondary"
                  >
                    {picked === undefined ? "Answer" : "Change"}
                  </button>
                </li>
              );
            })}
          </ul>
        </SectionCard>
        <div className="flex flex-wrap gap-3">
          <button
            type="button"
            disabled={phase === "submitting"}
            onClick={() => {
              setPhase("submitting");
              window.setTimeout(() => setPhase("done"), 1200);
            }}
            className="inline-flex items-center gap-2 rounded-lg bg-primary px-5 py-2.5 text-sm font-semibold text-primary-foreground hover:opacity-90 disabled:opacity-60"
          >
            {phase === "submitting" ? (
              <Loader2 className="size-4 animate-spin" aria-hidden />
            ) : (
              <Send className="size-4" aria-hidden />
            )}
            Submit assessment
          </button>
          <button
            type="button"
            onClick={() => setPhase("taking")}
            className="rounded-lg border border-border px-5 py-2.5 text-sm font-semibold hover:bg-secondary"
          >
            Keep working
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-3xl space-y-6 pb-24">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="text-xl font-bold">{assessment.title}</h1>
          <p className="text-sm text-muted-foreground">{classById(assessment.classId)?.name}</p>
        </div>
        <span className="inline-flex items-center gap-1.5 rounded-full border border-border bg-card px-3 py-1 text-sm font-medium tnum">
          <Clock className="size-4 text-muted-foreground" aria-hidden />
          {mm}:{ss}
        </span>
      </div>

      <div>
        <div className="flex justify-between text-xs text-muted-foreground">
          <span>
            Question {index + 1} of {questions.length}
          </span>
          <span className="tnum">{answeredCount} answered</span>
        </div>
        <div
          className="mt-2 h-2 w-full overflow-hidden rounded-full bg-secondary"
          role="progressbar"
          aria-valuenow={index + 1}
          aria-valuemin={1}
          aria-valuemax={questions.length}
          aria-label="Assessment progress"
        >
          <div
            className="h-full rounded-full bg-primary transition-all"
            style={{ width: `${((index + 1) / questions.length) * 100}%` }}
          />
        </div>
      </div>

      <fieldset className="card-surface p-6">
        <legend className="sr-only">Question {index + 1}</legend>
        <p className="text-xs font-medium text-muted-foreground uppercase">
          {conceptById(question.conceptId).name}
        </p>
        <p className="mt-2 text-lg font-semibold">{question.text}</p>
        <div className="mt-5 grid gap-3">
          {question.options.map((option, i) => {
            const selected = answers[question.id] === i;
            return (
              <label
                key={option}
                className={`flex cursor-pointer items-center gap-3 rounded-xl border px-4 py-3 text-sm transition-colors ${
                  selected ? "border-primary bg-primary-soft" : "border-border bg-card hover:bg-secondary"
                }`}
              >
                <input
                  type="radio"
                  name={question.id}
                  className="size-4 accent-[var(--color-primary)]"
                  checked={selected}
                  onChange={() => setAnswers((a) => ({ ...a, [question.id]: i }))}
                />
                <span>{option}</span>
              </label>
            );
          })}
        </div>
      </fieldset>

      <div className="flex items-center justify-between gap-3">
        <button
          type="button"
          disabled={index === 0}
          onClick={() => setIndex((i) => Math.max(0, i - 1))}
          className="inline-flex items-center gap-2 rounded-lg border border-border px-4 py-2 text-sm font-semibold hover:bg-secondary disabled:opacity-40"
        >
          <ArrowLeft className="size-4" aria-hidden /> Previous
        </button>
        {index === questions.length - 1 ? (
          <button
            type="button"
            onClick={() => setPhase("review")}
            className="inline-flex items-center gap-2 rounded-lg bg-primary px-4 py-2 text-sm font-semibold text-primary-foreground hover:opacity-90"
          >
            Review answers <ArrowRight className="size-4" aria-hidden />
          </button>
        ) : (
          <button
            type="button"
            onClick={() => setIndex((i) => Math.min(questions.length - 1, i + 1))}
            className="inline-flex items-center gap-2 rounded-lg bg-primary px-4 py-2 text-sm font-semibold text-primary-foreground hover:opacity-90"
          >
            Next <ArrowRight className="size-4" aria-hidden />
          </button>
        )}
      </div>
    </div>
  );
}
