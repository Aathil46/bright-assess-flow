import { useState } from "react";
import { createFileRoute, Link, notFound } from "@tanstack/react-router";
import { ArrowLeft, FileText, Plus, Sparkles, Trash2 } from "lucide-react";
import { PageHeader, SectionCard } from "@/components/common/page";
import { AIPanel } from "@/components/common/analytics";
import { MaterialStatusPill, Pill } from "@/components/common/status-pill";
import { classById, conceptById, materialById } from "@/lib/mock-data";

export const Route = createFileRoute("/teacher/materials/$materialId")({
  loader: ({ params }) => {
    const material = materialById(params.materialId);
    if (!material) throw notFound();
    return { filename: material.filename };
  },
  head: ({ loaderData }) => ({
    meta: [
      {
        title: loaderData ? `${loaderData.filename} · AI Smart Assessment` : "Material",
      },
      {
        name: "description",
        content: "Review extracted concepts and generate an assessment from this material.",
      },
      { property: "og:title", content: loaderData?.filename ?? "Material" },
      {
        property: "og:description",
        content: "Review extracted concepts and generate an assessment from this material.",
      },
    ],
  }),
  component: MaterialDetail,
});

function MaterialDetail() {
  const { materialId } = Route.useParams();
  const material = materialById(materialId);
  const [conceptIds, setConceptIds] = useState<string[]>(material?.conceptIds ?? []);
  const [custom, setCustom] = useState("");
  const [customConcepts, setCustomConcepts] = useState<string[]>([]);

  if (!material) return null;

  return (
    <div className="space-y-6">
      <Link
        to="/teacher/materials"
        className="inline-flex items-center gap-1.5 text-sm font-medium text-muted-foreground hover:text-foreground"
      >
        <ArrowLeft className="size-4" aria-hidden />
        All materials
      </Link>

      <PageHeader
        title={material.filename}
        description={`${classById(material.classId)?.name} · ${material.fileType} · ${material.sizeKb} KB · Uploaded ${material.uploadedAt}`}
        actions={<MaterialStatusPill status={material.status} />}
      />

      <div className="grid gap-6 lg:grid-cols-3">
        <div className="space-y-6 lg:col-span-2">
          <SectionCard
            title="Extracted concepts"
            description="Review and edit before generating questions. You stay in control of what is assessed."
          >
            {conceptIds.length === 0 && customConcepts.length === 0 ? (
              <p className="text-sm text-muted-foreground">
                No concepts yet. Extraction runs after the file finishes processing.
              </p>
            ) : (
              <ul className="space-y-2">
                {conceptIds.map((cid) => {
                  const concept = conceptById(cid);
                  return (
                    <li
                      key={cid}
                      className="flex flex-wrap items-center justify-between gap-3 rounded-lg border border-border px-4 py-3"
                    >
                      <div>
                        <p className="text-sm font-medium">{concept.name}</p>
                        <p className="text-xs text-muted-foreground">{concept.subject}</p>
                      </div>
                      <div className="flex items-center gap-2">
                        <Pill tone="violet" icon={Sparkles}>
                          AI-extracted
                        </Pill>
                        <button
                          type="button"
                          onClick={() => setConceptIds((prev) => prev.filter((c) => c !== cid))}
                          className="grid size-9 place-items-center rounded-md border border-border text-muted-foreground hover:bg-secondary"
                          aria-label={`Remove concept ${concept.name}`}
                        >
                          <Trash2 className="size-4" aria-hidden />
                        </button>
                      </div>
                    </li>
                  );
                })}
                {customConcepts.map((name) => (
                  <li
                    key={name}
                    className="flex flex-wrap items-center justify-between gap-3 rounded-lg border border-border px-4 py-3"
                  >
                    <p className="text-sm font-medium">{name}</p>
                    <div className="flex items-center gap-2">
                      <Pill tone="slate">Added by you</Pill>
                      <button
                        type="button"
                        onClick={() => setCustomConcepts((prev) => prev.filter((c) => c !== name))}
                        className="grid size-9 place-items-center rounded-md border border-border text-muted-foreground hover:bg-secondary"
                        aria-label={`Remove concept ${name}`}
                      >
                        <Trash2 className="size-4" aria-hidden />
                      </button>
                    </div>
                  </li>
                ))}
              </ul>
            )}

            <form
              className="mt-4 flex flex-wrap gap-2"
              onSubmit={(e) => {
                e.preventDefault();
                const value = custom.trim();
                if (!value) return;
                setCustomConcepts((prev) => [...prev, value]);
                setCustom("");
              }}
            >
              <label htmlFor="add-concept" className="sr-only">
                Add a concept
              </label>
              <input
                id="add-concept"
                value={custom}
                onChange={(e) => setCustom(e.target.value)}
                placeholder="Add a concept manually"
                className="h-10 min-w-52 flex-1 rounded-md border border-input bg-card px-3 text-sm outline-none focus-visible:border-primary"
              />
              <button
                type="submit"
                className="inline-flex h-10 items-center gap-1.5 rounded-md border border-border px-3 text-sm font-medium hover:bg-secondary"
              >
                <Plus className="size-4" aria-hidden />
                Add
              </button>
            </form>
          </SectionCard>

          <SectionCard title="Extracted text preview">
            <div className="max-h-72 overflow-y-auto rounded-lg border border-border bg-secondary/40 p-4 text-sm leading-relaxed text-muted-foreground">
              <p>
                A linear equation in one variable can be written in the form ax + b = 0, where a is
                not zero. To solve it, isolate the variable using inverse operations, keeping both
                sides balanced.
              </p>
              <p className="mt-3">
                Worked example: 3x + 5 = 20. Subtract 5 from both sides to get 3x = 15, then divide
                both sides by 3 to get x = 5. Always substitute the answer back into the original
                equation to check.
              </p>
              <p className="mt-3">
                Fractions with unlike denominators must be rewritten using a common denominator
                before adding or subtracting. For 2/3 + 1/6, rewrite 2/3 as 4/6, giving 5/6.
              </p>
            </div>
          </SectionCard>
        </div>

        <div className="space-y-6">
          <SectionCard title="Next step">
            <p className="text-sm text-muted-foreground">
              Generate an assessment from the concepts you have confirmed. Nothing is sent to
              students until you publish.
            </p>
            <Link
              to="/teacher/assessments/new"
              search={{ materialId: material.id }}
              className="mt-4 inline-flex h-11 w-full items-center justify-center gap-2 rounded-md bg-primary px-4 text-sm font-semibold text-primary-foreground hover:opacity-90 aria-disabled:pointer-events-none aria-disabled:opacity-50"
              aria-disabled={material.status !== "ready"}
            >
              <Sparkles className="size-4" aria-hidden />
              Generate assessment
            </Link>
            <p className="mt-3 flex items-start gap-2 text-xs text-muted-foreground">
              <FileText className="mt-0.5 size-3.5 shrink-0" aria-hidden />
              This prototype uses sample content — no real file is processed.
            </p>
          </SectionCard>

          <AIPanel title="Concept extraction summary">
            <p className="text-sm">
              {conceptIds.length + customConcepts.length} concepts are linked to this material.
              Fractions appears in more than one material for this class, which usually means it is
              worth assessing early.
            </p>
          </AIPanel>
        </div>
      </div>
    </div>
  );
}
