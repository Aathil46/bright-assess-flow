import { useState } from "react";
import { createFileRoute, Link, notFound } from "@tanstack/react-router";
import { ArrowLeft, Check, Pencil, Send, Sparkles, Trash2, X } from "lucide-react";
import { EmptyState, PageHeader, SectionCard, StatCard } from "@/components/common/page";
import { TabNav, TabPanel } from "@/components/common/tab-nav";
import { AIPanel, ConceptAccuracyRow, SystemFactList } from "@/components/common/analytics";
import {
  AssessmentStatusPill,
  LevelPill,
  PassFailPill,
  Pill,
} from "@/components/common/status-pill";
import {
  assessmentById,
  classById,
  conceptAccuracyForAssessment,
  conceptById,
  levelOf,
  resultsForAssessment,
  studentById,
} from "@/lib/mock-data";
import type { AssessmentStatus, Question } from "@/lib/types";

export const Route = createFileRoute("/teacher/assessments/$assessmentId")({
  loader: ({ params }) => {
    const assessment = assessmentById(params.assessmentId);
    if (!assessment) throw notFound();
    return { title: assessment.title };
  },
  head: ({ loaderData }) => ({
    meta: [
      { title: loaderData ? `${loaderData.title} · AI Smart Assessment` : "Assessment" },
      {
        name: "description",
        content: "Review generated questions, publish to a class and read concept-level results.",
      },
      { property: "og:title", content: loaderData?.title ?? "Assessment" },
      {
        property: "og:description",
        content: "Review questions, publish to a class and read concept-level results.",
      },
    ],
  }),
  component: AssessmentDetail,
});

type Tab = "questions" | "results" | "insights";

function QuestionCard({
  question,
  index,
  onSave,
  onDelete,
}: {
  question: Question;
  index: number;
  onSave: (q: Question) => void;
  onDelete: () => void;
}) {
  const [editing, setEditing] = useState(false);
  const [draft, setDraft] = useState(question);

  if (editing) {
    return (
      <li className="card-surface p-5">
        <div className="space-y-4">
          <div>
            <label htmlFor={`q-text-${question.id}`} className="mb-1.5 block text-sm font-medium">
              Question {index + 1}
            </label>
            <textarea
              id={`q-text-${question.id}`}
              value={draft.text}
              onChange={(e) => setDraft({ ...draft, text: e.target.value })}
              rows={2}
              className="w-full rounded-md border border-input bg-card px-3 py-2 text-sm outline-none focus-visible:border-primary"
            />
          </div>
          <fieldset>
            <legend className="mb-1.5 text-sm font-medium">
              Options — select the correct answer
            </legend>
            <div className="space-y-2">
              {draft.options.map((opt, i) => (
                <div key={i} className="flex items-center gap-2">
                  <input
                    type="radio"
                    name={`correct-${question.id}`}
                    checked={draft.correctIndex === i}
                    onChange={() => setDraft({ ...draft, correctIndex: i })}
                    aria-label={`Mark option ${i + 1} correct`}
                    className="size-4 accent-[var(--color-strong)]"
                  />
                  <input
                    value={opt}
                    onChange={(e) => {
                      const options = [...draft.options];
                      options[i] = e.target.value;
                      setDraft({ ...draft, options });
                    }}
                    aria-label={`Option ${i + 1}`}
                    className="h-10 flex-1 rounded-md border border-input bg-card px-3 text-sm outline-none focus-visible:border-primary"
                  />
                </div>
              ))}
            </div>
          </fieldset>
          <div className="flex gap-2">
            <button
              type="button"
              onClick={() => {
                onSave(draft);
                setEditing(false);
              }}
              className="inline-flex h-10 items-center gap-1.5 rounded-md bg-primary px-4 text-sm font-semibold text-primary-foreground hover:opacity-90"
            >
              <Check className="size-4" aria-hidden />
              Save changes
            </button>
            <button
              type="button"
              onClick={() => {
                setDraft(question);
                setEditing(false);
              }}
              className="inline-flex h-10 items-center gap-1.5 rounded-md border border-border px-4 text-sm font-medium hover:bg-secondary"
            >
              <X className="size-4" aria-hidden />
              Cancel
            </button>
          </div>
        </div>
      </li>
    );
  }

  return (
    <li className="card-surface p-5">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <p className="text-sm font-semibold">
          <span className="mr-2 text-muted-foreground tnum">{index + 1}.</span>
          {question.text}
        </p>
        <div className="flex items-center gap-2">
          {question.aiGenerated ? (
            <Pill tone="violet" icon={Sparkles}>
              AI
            </Pill>
          ) : (
            <Pill tone="slate">Edited</Pill>
          )}
          <button
            type="button"
            onClick={() => setEditing(true)}
            aria-label={`Edit question ${index + 1}`}
            className="grid size-9 place-items-center rounded-md border border-border text-muted-foreground hover:bg-secondary"
          >
            <Pencil className="size-4" aria-hidden />
          </button>
          <button
            type="button"
            onClick={onDelete}
            aria-label={`Delete question ${index + 1}`}
            className="grid size-9 place-items-center rounded-md border border-border text-muted-foreground hover:bg-secondary"
          >
            <Trash2 className="size-4" aria-hidden />
          </button>
        </div>
      </div>
      <ul className="mt-3 grid gap-2 sm:grid-cols-2">
        {question.options.map((opt, i) => (
          <li
            key={i}
            className={`rounded-md border px-3 py-2 text-sm ${
              i === question.correctIndex
                ? "border-strong/40 bg-strong-soft font-medium text-strong"
                : "border-border text-muted-foreground"
            }`}
          >
            {opt}
            {i === question.correctIndex ? <span className="sr-only"> (correct answer)</span> : null}
          </li>
        ))}
      </ul>
      <p className="mt-3 text-xs text-muted-foreground">
        Concept: {conceptById(question.conceptId).name}
      </p>
    </li>
  );
}

function AssessmentDetail() {
  const { assessmentId } = Route.useParams();
  const assessment = assessmentById(assessmentId);
  const [tab, setTab] = useState<Tab>("questions");
  const [questions, setQuestions] = useState<Question[]>(assessment?.questions ?? []);
  const [status, setStatus] = useState<AssessmentStatus>(assessment?.status ?? "draft");
  const [publishOpen, setPublishOpen] = useState(false);
  const [dueDate, setDueDate] = useState("");
  const [published, setPublished] = useState(false);

  if (!assessment) return null;

  const results = resultsForAssessment(assessment.id);
  const conceptRows = conceptAccuracyForAssessment(assessment.id);
  const hasResults = status === "results_available" && results.length > 0;

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
        title={assessment.title}
        description={`${classById(assessment.classId)?.name} · ${questions.length} questions · Created ${assessment.createdAt}`}
        actions={
          <div className="flex flex-wrap items-center gap-3">
            <AssessmentStatusPill status={status} />
            {status === "draft" || status === "review" ? (
              <button
                type="button"
                onClick={() => setPublishOpen(true)}
                className="inline-flex h-10 items-center gap-2 rounded-md bg-primary px-4 text-sm font-semibold text-primary-foreground hover:opacity-90"
              >
                <Send className="size-4" aria-hidden />
                Publish to class
              </button>
            ) : null}
          </div>
        }
      />

      {published ? (
        <p
          role="status"
          className="rounded-lg border border-strong/30 bg-strong-soft px-4 py-3 text-sm font-medium text-strong"
        >
          Published to {classById(assessment.classId)?.name}. Students can now attempt it
          {dueDate ? ` until ${dueDate}` : ""}.
        </p>
      ) : null}

      <TabNav<Tab>
        label="Assessment sections"
        value={tab}
        onChange={setTab}
        tabs={[
          { id: "questions", label: "Questions", count: questions.length },
          { id: "results", label: "Results", count: results.length },
          { id: "insights", label: "AI insights" },
        ]}
      />

      {tab === "questions" ? (
        <TabPanel id="questions">
          <div className="space-y-4">
            <p className="text-sm text-muted-foreground">
              Every question was drafted by AI and stays editable until you publish.
            </p>
            <ul className="space-y-3">
              {questions.map((q, i) => (
                <QuestionCard
                  key={q.id}
                  question={q}
                  index={i}
                  onSave={(updated) =>
                    setQuestions((prev) =>
                      prev.map((x) =>
                        x.id === updated.id ? { ...updated, aiGenerated: false } : x,
                      ),
                    )
                  }
                  onDelete={() => setQuestions((prev) => prev.filter((x) => x.id !== q.id))}
                />
              ))}
            </ul>
          </div>
        </TabPanel>
      ) : null}

      {tab === "results" ? (
        <TabPanel id="results">
          {!hasResults ? (
            <EmptyState
              icon={Send}
              title="No results yet"
              description={
                status === "published"
                  ? "Results appear here as students submit their attempts."
                  : "Publish this assessment to start collecting attempts."
              }
            />
          ) : (
            <div className="space-y-6">
              <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
                <StatCard
                  label="Average score"
                  value={`${assessment.avgScore}%`}
                  tone={levelOf(assessment.avgScore)}
                />
                <StatCard label="Pass rate" value={`${assessment.passRate}%`} />
                <StatCard
                  label="Submitted"
                  value={`${assessment.participation.submitted}/${assessment.participation.total}`}
                />
                <StatCard label="Questions" value={questions.length} />
              </div>

              <SectionCard title="Student results" bodyClassName="p-0">
                <div className="overflow-x-auto">
                  <table className="w-full min-w-[640px] text-sm">
                    <caption className="sr-only">Student results for {assessment.title}</caption>
                    <thead className="bg-secondary/60 text-left text-xs tracking-wide text-muted-foreground uppercase">
                      <tr>
                        <th scope="col" className="px-5 py-3 font-medium">Student</th>
                        <th scope="col" className="px-5 py-3 font-medium">Score</th>
                        <th scope="col" className="px-5 py-3 font-medium">Percentage</th>
                        <th scope="col" className="px-5 py-3 font-medium">Outcome</th>
                        <th scope="col" className="px-5 py-3 font-medium">Weakest concept</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-border">
                      {results.map((r) => {
                        const weakest = [...r.conceptBreakdown].sort(
                          (a, b) => a.accuracy - b.accuracy,
                        )[0];
                        return (
                          <tr key={r.id} className="hover:bg-secondary/40">
                            <td className="px-5 py-3 font-medium">
                              {studentById(r.studentId)?.name}
                            </td>
                            <td className="px-5 py-3 tnum">
                              {r.score}/{r.total}
                            </td>
                            <td className="px-5 py-3 font-semibold tnum">{r.percentage}%</td>
                            <td className="px-5 py-3">
                              <PassFailPill percentage={r.percentage} />
                            </td>
                            <td className="px-5 py-3 text-muted-foreground">
                              {weakest ? (
                                <span className="flex items-center gap-2">
                                  {conceptById(weakest.conceptId).name}
                                  <LevelPill level={levelOf(weakest.accuracy)} />
                                </span>
                              ) : (
                                "—"
                              )}
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
              </SectionCard>

              <SectionCard
                title="Concept accuracy"
                description="Calculated from submitted answers"
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
            </div>
          )}
        </TabPanel>
      ) : null}

      {tab === "insights" ? (
        <TabPanel id="insights">
          <div className="space-y-6">
            <SystemFactList
              items={[
                { label: "Average", value: `${assessment.avgScore}%` },
                { label: "Pass rate", value: `${assessment.passRate}%` },
                {
                  label: "Completion",
                  value: `${Math.round(
                    (assessment.participation.submitted / assessment.participation.total) * 100,
                  )}%`,
                },
                { label: "Concepts", value: `${conceptRows.length || 1}` },
              ]}
            />
            <AIPanel title="What this assessment suggests">
              {hasResults ? (
                <ul className="space-y-2 text-sm">
                  <li>
                    Accuracy is lowest on{" "}
                    {conceptById(
                      [...conceptRows].sort((a, b) => a.accuracy - b.accuracy)[0]?.conceptId ??
                        "c-fractions",
                    ).name}
                    , which is worth revisiting before the next unit.
                  </li>
                  <li>
                    Students who passed still answered inconsistently on multi-step items — a short
                    guided practice may consolidate the method.
                  </li>
                  <li>
                    Consider assigning targeted practice to the students below 50% rather than
                    re-teaching the whole class.
                  </li>
                </ul>
              ) : (
                <p className="text-sm">
                  Insights become available once students submit. The draft covers{" "}
                  {new Set(questions.map((q) => q.conceptId)).size} concepts with a balanced spread
                  of questions.
                </p>
              )}
            </AIPanel>
          </div>
        </TabPanel>
      ) : null}

      {publishOpen ? (
        <div className="fixed inset-0 z-50 grid place-items-center bg-foreground/40 p-4">
          <div
            role="dialog"
            aria-modal="true"
            aria-labelledby="publish-title"
            className="w-full max-w-md rounded-xl bg-card p-6 shadow-lg"
          >
            <h2 id="publish-title" className="text-lg font-semibold">
              Publish assessment
            </h2>
            <p className="mt-1.5 text-sm text-muted-foreground">
              {questions.length} questions will be sent to {classById(assessment.classId)?.name}.
              Students see it immediately.
            </p>
            <div className="mt-4">
              <label htmlFor="due" className="mb-1.5 block text-sm font-medium">
                Due date (optional)
              </label>
              <input
                id="due"
                type="date"
                value={dueDate}
                onChange={(e) => setDueDate(e.target.value)}
                className="h-11 w-full rounded-md border border-input bg-card px-3 text-sm"
              />
            </div>
            <div className="mt-6 flex justify-end gap-2">
              <button
                type="button"
                onClick={() => setPublishOpen(false)}
                className="h-10 rounded-md border border-border px-4 text-sm font-medium hover:bg-secondary"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={() => {
                  setStatus("published");
                  setPublished(true);
                  setPublishOpen(false);
                }}
                className="h-10 rounded-md bg-primary px-4 text-sm font-semibold text-primary-foreground hover:opacity-90"
              >
                Publish now
              </button>
            </div>
          </div>
        </div>
      ) : null}
    </div>
  );
}
