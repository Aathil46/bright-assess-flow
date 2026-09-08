import { useState } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { AlertTriangle, Lightbulb, ListChecks, Loader2, RefreshCw } from "lucide-react";
import { PageHeader, SectionCard } from "@/components/common/page";
import { AIPanel, SystemFactList } from "@/components/common/analytics";
import { aiSchoolReview, school, schoolWeakConcepts } from "@/lib/mock-data";

export const Route = createFileRoute("/principal/ai-review")({
  head: () => ({
    meta: [
      { title: "AI School Review — AI Smart Assessment" },
      { name: "description", content: "An AI summary of school performance with findings and suggested actions." },
      { property: "og:title", content: "AI School Review — AI Smart Assessment" },
      { property: "og:description", content: "An AI summary of school performance with findings and suggested actions." },
    ],
  }),
  component: AIReview,
});

function AIReview() {
  const [regenerating, setRegenerating] = useState(false);
  const [generatedAt, setGeneratedAt] = useState(aiSchoolReview.generatedAt);
  const weakest = schoolWeakConcepts()[0];

  return (
    <div className="space-y-6">
      <PageHeader
        title="AI school review"
        description={`Generated ${generatedAt}. AI writes the narrative; all figures come from the system.`}
        actions={
          <button
            type="button"
            disabled={regenerating}
            onClick={() => {
              setRegenerating(true);
              window.setTimeout(() => {
                setRegenerating(false);
                setGeneratedAt("Just now");
              }, 1600);
            }}
            className="inline-flex items-center gap-2 rounded-lg border border-ai/30 bg-ai-soft px-4 py-2 text-sm font-semibold text-ai disabled:opacity-60"
          >
            {regenerating ? (
              <Loader2 className="size-4 animate-spin" aria-hidden />
            ) : (
              <RefreshCw className="size-4" aria-hidden />
            )}
            Regenerate review
          </button>
        }
      />

      <SectionCard title="System data used" description="Calculated by the system, not by AI.">
        <SystemFactList
          items={[
            { label: "Average performance", value: `${school.avgPerformance}%` },
            { label: "Pass rate", value: `${school.passRate}%` },
            { label: "Completion rate", value: `${school.completionRate}%` },
            { label: "Students", value: String(school.studentCount) },
            { label: "Classes", value: String(school.classCount) },
            {
              label: "Lowest concept",
              value: weakest ? `${weakest.concept.name} (${weakest.accuracy}%)` : "—",
            },
          ]}
        />
      </SectionCard>

      {regenerating ? (
        <div className="card-surface flex items-center gap-3 px-5 py-8 text-sm text-muted-foreground" aria-live="polite">
          <Loader2 className="size-4 animate-spin" aria-hidden />
          Analysing school performance…
        </div>
      ) : (
        <>
          <AIPanel title="Key findings">
            <ul className="space-y-2 text-sm">
              {aiSchoolReview.findings.map((f) => (
                <li key={f} className="flex gap-2">
                  <Lightbulb className="mt-0.5 size-4 shrink-0 text-ai" aria-hidden />
                  {f}
                </li>
              ))}
            </ul>
          </AIPanel>

          <AIPanel title="Needs attention">
            <ul className="space-y-2 text-sm">
              {aiSchoolReview.attention.map((f) => (
                <li key={f} className="flex gap-2">
                  <AlertTriangle className="mt-0.5 size-4 shrink-0 text-medium" aria-hidden />
                  {f}
                </li>
              ))}
            </ul>
          </AIPanel>

          <AIPanel title="Suggested actions">
            <ul className="space-y-2 text-sm">
              {aiSchoolReview.actions.map((f) => (
                <li key={f} className="flex gap-2">
                  <ListChecks className="mt-0.5 size-4 shrink-0 text-strong" aria-hidden />
                  {f}
                </li>
              ))}
            </ul>
          </AIPanel>
        </>
      )}
    </div>
  );
}
