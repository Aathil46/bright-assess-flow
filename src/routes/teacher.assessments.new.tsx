import { useState } from "react";
import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { ArrowLeft, Check, Loader2, Sparkles } from "lucide-react";
import { PageHeader, SectionCard } from "@/components/common/page";
import { Pill } from "@/components/common/status-pill";
import { classes, conceptById, materials } from "@/lib/mock-data";

type Search = { materialId?: string };

export const Route = createFileRoute("/teacher/assessments/new")({
  validateSearch: (search: Record<string, unknown>): Search =>
    typeof search["materialId"] === "string" ? { materialId: search["materialId"] } : {},
  head: () => ({
    meta: [
      { title: "Generate Assessment · AI Smart Assessment" },
      {
        name: "description",
        content:
          "Pick a material, choose concepts and difficulty, and generate a draft assessment you can edit.",
      },
      { property: "og:title", content: "Generate Assessment · AI Smart Assessment" },
      {
        property: "og:description",
        content: "Pick a material and concepts, then generate a draft assessment you can edit.",
      },
    ],
  }),
  component: NewAssessment,
});

const steps = ["Source", "Concepts", "Settings", "Generate"];

function NewAssessment() {
  const { materialId } = Route.useSearch();
  const navigate = useNavigate();
  const readyMaterials = materials.filter((m) => m.status === "ready");

  const [step, setStep] = useState(0);
  const [material, setMaterial] = useState(materialId ?? readyMaterials[0]?.id ?? "");
  const [classId, setClassId] = useState(classes[0]!.id);
  const [selected, setSelected] = useState<string[]>([]);
  const [count, setCount] = useState(10);
  const [difficulty, setDifficulty] = useState<"easy" | "mixed" | "hard">("mixed");
  const [title, setTitle] = useState("");
  const [generating, setGenerating] = useState(false);
  const [done, setDone] = useState(false);

  const current = materials.find((m) => m.id === material);
  const availableConcepts = current?.conceptIds ?? [];

  const toggle = (id: string) =>
    setSelected((prev) => (prev.includes(id) ? prev.filter((c) => c !== id) : [...prev, id]));

  const generate = () => {
    setGenerating(true);
    window.setTimeout(() => {
      setGenerating(false);
      setDone(true);
    }, 2400);
  };

  return (
    <div className="space-y-6">
      <Link
        to="/teacher/assessments"
        className="inline-flex items-center gap-1.5 text-sm font-medium text-muted-foreground hover:text-foreground"
      >
        <ArrowLeft className="size-4" aria-hidden />
        Assessments
      </Link>

      <PageHeader
        title="Generate assessment"
        description="AI drafts the questions. You review, edit and decide what students see."
      />

      <ol className="flex flex-wrap gap-2" aria-label="Progress">
        {steps.map((label, i) => {
          const state = i < step ? "done" : i === step ? "current" : "todo";
          return (
            <li
              key={label}
              aria-current={state === "current" ? "step" : undefined}
              className={`flex items-center gap-2 rounded-full border px-3.5 py-1.5 text-sm font-medium ${
                state === "current"
                  ? "border-primary bg-primary-soft text-primary"
                  : state === "done"
                    ? "border-strong/30 bg-strong-soft text-strong"
                    : "border-border bg-card text-muted-foreground"
              }`}
            >
              <span className="grid size-5 place-items-center rounded-full bg-card text-xs tnum">
                {state === "done" ? <Check className="size-3.5" aria-hidden /> : i + 1}
              </span>
              {label}
            </li>
          );
        })}
      </ol>

      {step === 0 ? (
        <SectionCard title="Choose a source material" description="Only processed materials can be used.">
          <fieldset>
            <legend className="sr-only">Source material</legend>
            <div className="space-y-2">
              {readyMaterials.map((m) => (
                <label
                  key={m.id}
                  className={`flex cursor-pointer items-center gap-3 rounded-lg border px-4 py-3 ${
                    material === m.id ? "border-primary bg-primary-soft" : "border-border"
                  }`}
                >
                  <input
                    type="radio"
                    name="material"
                    value={m.id}
                    checked={material === m.id}
                    onChange={() => {
                      setMaterial(m.id);
                      setSelected([]);
                      setClassId(m.classId);
                    }}
                    className="size-4 accent-[var(--color-primary)]"
                  />
                  <span>
                    <span className="block text-sm font-medium">{m.filename}</span>
                    <span className="block text-xs text-muted-foreground">
                      {m.conceptIds.length} concepts extracted
                    </span>
                  </span>
                </label>
              ))}
            </div>
          </fieldset>
          <div className="mt-5">
            <label htmlFor="target-class" className="mb-1.5 block text-sm font-medium">
              Assign to class
            </label>
            <select
              id="target-class"
              value={classId}
              onChange={(e) => setClassId(e.target.value)}
              className="h-11 w-full max-w-sm rounded-md border border-input bg-card px-3 text-sm"
            >
              {classes.map((c) => (
                <option key={c.id} value={c.id}>
                  {c.name}
                </option>
              ))}
            </select>
          </div>
        </SectionCard>
      ) : null}

      {step === 1 ? (
        <SectionCard
          title="Select concepts to assess"
          description="Questions are drawn only from the concepts you select."
        >
          <div className="flex flex-wrap gap-2">
            {availableConcepts.map((cid) => {
              const active = selected.includes(cid);
              return (
                <button
                  key={cid}
                  type="button"
                  aria-pressed={active}
                  onClick={() => toggle(cid)}
                  className={`h-10 rounded-full border px-4 text-sm font-medium ${
                    active
                      ? "border-ai/40 bg-ai-soft text-ai"
                      : "border-border bg-card text-muted-foreground hover:bg-secondary"
                  }`}
                >
                  {conceptById(cid).name}
                </button>
              );
            })}
          </div>
          {selected.length === 0 ? (
            <p className="mt-4 text-sm text-medium">Select at least one concept to continue.</p>
          ) : (
            <p className="mt-4 text-sm text-muted-foreground">
              {selected.length} concept{selected.length > 1 ? "s" : ""} selected.
            </p>
          )}
        </SectionCard>
      ) : null}

      {step === 2 ? (
        <SectionCard title="Assessment settings">
          <div className="grid gap-5 sm:grid-cols-2">
            <div className="sm:col-span-2">
              <label htmlFor="a-title" className="mb-1.5 block text-sm font-medium">
                Title
              </label>
              <input
                id="a-title"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="e.g. Fractions — Unit Check"
                className="h-11 w-full rounded-md border border-input bg-card px-3 text-sm outline-none focus-visible:border-primary"
              />
            </div>
            <div>
              <label htmlFor="a-count" className="mb-1.5 block text-sm font-medium">
                Number of questions: <span className="tnum">{count}</span>
              </label>
              <input
                id="a-count"
                type="range"
                min={5}
                max={20}
                step={1}
                value={count}
                onChange={(e) => setCount(Number(e.target.value))}
                className="w-full accent-[var(--color-primary)]"
              />
            </div>
            <div>
              <label htmlFor="a-diff" className="mb-1.5 block text-sm font-medium">
                Difficulty
              </label>
              <select
                id="a-diff"
                value={difficulty}
                onChange={(e) => setDifficulty(e.target.value as typeof difficulty)}
                className="h-11 w-full rounded-md border border-input bg-card px-3 text-sm"
              >
                <option value="easy">Easy</option>
                <option value="mixed">Mixed</option>
                <option value="hard">Challenging</option>
              </select>
            </div>
          </div>
        </SectionCard>
      ) : null}

      {step === 3 ? (
        <SectionCard title="Review and generate">
          <dl className="grid gap-3 sm:grid-cols-2">
            <div>
              <dt className="text-xs text-muted-foreground uppercase">Material</dt>
              <dd className="text-sm font-medium">{current?.filename}</dd>
            </div>
            <div>
              <dt className="text-xs text-muted-foreground uppercase">Class</dt>
              <dd className="text-sm font-medium">
                {classes.find((c) => c.id === classId)?.name}
              </dd>
            </div>
            <div>
              <dt className="text-xs text-muted-foreground uppercase">Questions</dt>
              <dd className="text-sm font-medium tnum">{count}</dd>
            </div>
            <div>
              <dt className="text-xs text-muted-foreground uppercase">Difficulty</dt>
              <dd className="text-sm font-medium capitalize">{difficulty}</dd>
            </div>
            <div className="sm:col-span-2">
              <dt className="text-xs text-muted-foreground uppercase">Concepts</dt>
              <dd className="mt-1.5 flex flex-wrap gap-2">
                {selected.map((cid) => (
                  <Pill key={cid} tone="violet">
                    {conceptById(cid).name}
                  </Pill>
                ))}
              </dd>
            </div>
          </dl>

          {generating ? (
            <div className="mt-6 rounded-lg border border-ai/25 bg-ai-soft p-5 text-center">
              <Loader2 className="mx-auto size-6 animate-spin text-ai" aria-hidden />
              <p className="mt-3 text-sm font-medium text-ai" role="status">
                Generating {count} questions from {selected.length} concepts…
              </p>
              <p className="mt-1 text-xs text-muted-foreground">This usually takes a few seconds.</p>
            </div>
          ) : done ? (
            <div className="mt-6 rounded-lg border border-strong/30 bg-strong-soft p-5 text-center">
              <Check className="mx-auto size-6 text-strong" aria-hidden />
              <p className="mt-3 text-sm font-medium text-strong">
                Draft ready with {count} questions.
              </p>
              <button
                type="button"
                onClick={() =>
                  navigate({
                    to: "/teacher/assessments/$assessmentId",
                    params: { assessmentId: "a-3" },
                  })
                }
                className="mt-4 h-10 rounded-md bg-primary px-4 text-sm font-semibold text-primary-foreground hover:opacity-90"
              >
                Review questions
              </button>
            </div>
          ) : (
            <button
              type="button"
              onClick={generate}
              className="mt-6 inline-flex h-11 items-center gap-2 rounded-md bg-ai px-5 text-sm font-semibold text-ai-foreground hover:opacity-90"
            >
              <Sparkles className="size-4" aria-hidden />
              Generate questions
            </button>
          )}
        </SectionCard>
      ) : null}

      <div className="flex justify-between gap-3">
        <button
          type="button"
          onClick={() => setStep((s) => Math.max(0, s - 1))}
          disabled={step === 0 || generating}
          className="h-11 rounded-md border border-border px-4 text-sm font-medium hover:bg-secondary disabled:opacity-40"
        >
          Back
        </button>
        <button
          type="button"
          onClick={() => setStep((s) => Math.min(steps.length - 1, s + 1))}
          disabled={step === steps.length - 1 || (step === 1 && selected.length === 0)}
          className="h-11 rounded-md bg-primary px-5 text-sm font-semibold text-primary-foreground hover:opacity-90 disabled:opacity-40"
        >
          Continue
        </button>
      </div>
    </div>
  );
}
