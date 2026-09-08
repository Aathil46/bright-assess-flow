import { useState } from "react";
import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowLeft, BookOpen, CheckCircle2, RotateCcw, XCircle } from "lucide-react";
import { EmptyState, SectionCard } from "@/components/common/page";
import { conceptById, practiceSets } from "@/lib/mock-data";

export const Route = createFileRoute("/student/practice/$conceptId")({
  head: () => ({
    meta: [
      { title: "Practice Set — AI Smart Assessment" },
      { name: "description", content: "Answer practice questions and get an explanation after each one." },
      { property: "og:title", content: "Practice Set — AI Smart Assessment" },
      { property: "og:description", content: "Answer practice questions and get an explanation after each one." },
    ],
  }),
  component: PracticeRunner,
});

function PracticeRunner() {
  const { conceptId } = Route.useParams();
  const set = practiceSets[conceptId];
  const concept = conceptById(conceptId);
  const [index, setIndex] = useState(0);
  const [picked, setPicked] = useState<number | null>(null);
  const [correctCount, setCorrectCount] = useState(0);
  const [finished, setFinished] = useState(false);

  if (!set || set.length === 0) {
    return (
      <EmptyState
        icon={BookOpen}
        title="No practice for this concept yet"
        description="Try another concept from the practice list."
        action={
          <Link to="/student/practice" className="text-sm font-medium text-primary hover:underline">
            Back to practice
          </Link>
        }
      />
    );
  }

  function reset() {
    setIndex(0);
    setPicked(null);
    setCorrectCount(0);
    setFinished(false);
  }

  if (finished) {
    const pct = Math.round((correctCount / set.length) * 100);
    return (
      <div className="mx-auto max-w-lg space-y-6 text-center">
        <div className="card-surface px-6 py-10">
          <span className="mx-auto grid size-14 place-items-center rounded-full bg-strong-soft text-strong">
            <CheckCircle2 className="size-7" aria-hidden />
          </span>
          <h1 className="mt-4 text-2xl font-bold">Practice complete</h1>
          <p className="mt-1 text-sm text-muted-foreground">{concept.name}</p>
          <p className="mt-6 text-5xl font-bold tnum">{pct}%</p>
          <p className="mt-1 text-sm text-muted-foreground tnum">
            {correctCount} of {set.length} correct
          </p>
          <div className="mt-8 flex flex-wrap justify-center gap-3">
            <button
              type="button"
              onClick={reset}
              className="inline-flex items-center gap-2 rounded-lg bg-primary px-4 py-2 text-sm font-semibold text-primary-foreground hover:opacity-90"
            >
              <RotateCcw className="size-4" aria-hidden /> Try again
            </button>
            <Link
              to="/student/practice"
              className="rounded-lg border border-border px-4 py-2 text-sm font-semibold hover:bg-secondary"
            >
              More practice
            </Link>
          </div>
        </div>
      </div>
    );
  }

  const question = set[index]!;
  const answered = picked !== null;
  const isCorrect = picked === question.correctIndex;

  return (
    <div className="mx-auto max-w-3xl space-y-6">
      <Link
        to="/student/practice"
        className="inline-flex items-center gap-1.5 text-sm font-medium text-muted-foreground hover:text-foreground"
      >
        <ArrowLeft className="size-4" aria-hidden /> Practice
      </Link>

      <div>
        <h1 className="text-xl font-bold">{concept.name}</h1>
        <p className="text-sm text-muted-foreground">
          Question {index + 1} of {set.length}
        </p>
      </div>

      <SectionCard>
        <p className="text-lg font-semibold">{question.text}</p>
        <div className="mt-5 grid gap-3">
          {question.options.map((option, i) => {
            const state =
              !answered
                ? "idle"
                : i === question.correctIndex
                  ? "correct"
                  : i === picked
                    ? "wrong"
                    : "idle";
            return (
              <button
                key={option}
                type="button"
                disabled={answered}
                onClick={() => {
                  setPicked(i);
                  if (i === question.correctIndex) setCorrectCount((c) => c + 1);
                }}
                className={`flex items-center justify-between gap-3 rounded-xl border px-4 py-3 text-left text-sm transition-colors ${
                  state === "correct"
                    ? "border-strong/40 bg-strong-soft"
                    : state === "wrong"
                      ? "border-weak/40 bg-weak-soft"
                      : "border-border bg-card hover:bg-secondary disabled:opacity-70"
                }`}
              >
                <span>{option}</span>
                {state === "correct" ? (
                  <CheckCircle2 className="size-4 text-strong" aria-hidden />
                ) : state === "wrong" ? (
                  <XCircle className="size-4 text-weak" aria-hidden />
                ) : null}
              </button>
            );
          })}
        </div>

        {answered ? (
          <div
            role="status"
            className="mt-5 rounded-xl border border-ai/25 bg-ai-soft p-4 text-sm"
          >
            <p className="font-semibold text-ai">{isCorrect ? "Correct" : "Not quite"}</p>
            <p className="mt-1 text-foreground/80">{question.explanation}</p>
          </div>
        ) : null}
      </SectionCard>

      <div className="flex justify-end">
        <button
          type="button"
          disabled={!answered}
          onClick={() => {
            if (index === set.length - 1) {
              setFinished(true);
              return;
            }
            setIndex((i) => i + 1);
            setPicked(null);
          }}
          className="rounded-lg bg-primary px-5 py-2.5 text-sm font-semibold text-primary-foreground hover:opacity-90 disabled:opacity-40"
        >
          {index === set.length - 1 ? "Finish" : "Next question"}
        </button>
      </div>
    </div>
  );
}
