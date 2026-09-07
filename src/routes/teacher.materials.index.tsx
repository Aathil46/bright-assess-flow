import { useEffect, useRef, useState } from "react";
import { createFileRoute, Link } from "@tanstack/react-router";
import { FileText, Library, RotateCcw, Sparkles, UploadCloud } from "lucide-react";
import { EmptyState, PageHeader, SectionCard } from "@/components/common/page";
import { MaterialStatusPill, Pill } from "@/components/common/status-pill";
import { classById, classes, conceptById, materials as seedMaterials } from "@/lib/mock-data";
import type { Material, MaterialStatus } from "@/lib/types";

export const Route = createFileRoute("/teacher/materials/")({
  head: () => ({
    meta: [
      { title: "Learning Materials · AI Smart Assessment" },
      {
        name: "description",
        content:
          "Upload chapter notes and worksheets, then review the concepts extracted from each file.",
      },
      { property: "og:title", content: "Learning Materials · AI Smart Assessment" },
      {
        property: "og:description",
        content: "Upload material and review AI-extracted concepts before generating assessments.",
      },
    ],
  }),
  component: MaterialsPage,
});

const filters: { id: "all" | MaterialStatus; label: string }[] = [
  { id: "all", label: "All" },
  { id: "ready", label: "Ready" },
  { id: "processing", label: "Processing" },
  { id: "failed", label: "Failed" },
];

function UploadZone({ onUpload }: { onUpload: (name: string, classId: string) => void }) {
  const [dragging, setDragging] = useState(false);
  const [classId, setClassId] = useState(classes[0]!.id);
  const inputRef = useRef<HTMLInputElement>(null);

  const handleFiles = (files: FileList | null) => {
    if (!files || files.length === 0) return;
    Array.from(files).forEach((f) => onUpload(f.name, classId));
  };

  return (
    <SectionCard title="Upload material" description="PDF, DOCX or TXT up to 20 MB">
      <div className="grid gap-4 sm:grid-cols-[1fr_220px]">
        <div
          onDragOver={(e) => {
            e.preventDefault();
            setDragging(true);
          }}
          onDragLeave={() => setDragging(false)}
          onDrop={(e) => {
            e.preventDefault();
            setDragging(false);
            handleFiles(e.dataTransfer.files);
          }}
          className={`flex flex-col items-center justify-center rounded-xl border-2 border-dashed px-6 py-10 text-center transition-colors ${
            dragging ? "border-primary bg-primary-soft" : "border-border bg-secondary/40"
          }`}
        >
          <UploadCloud className="size-8 text-muted-foreground" aria-hidden />
          <p className="mt-3 text-sm font-medium">Drag and drop a file here</p>
          <p className="mt-1 text-xs text-muted-foreground">or choose a file from your device</p>
          <button
            type="button"
            onClick={() => inputRef.current?.click()}
            className="mt-4 h-10 rounded-md bg-primary px-4 text-sm font-semibold text-primary-foreground hover:opacity-90"
          >
            Choose file
          </button>
          <input
            ref={inputRef}
            type="file"
            className="sr-only"
            aria-label="Choose learning material file"
            multiple
            onChange={(e) => handleFiles(e.target.files)}
          />
        </div>
        <div>
          <label htmlFor="upload-class" className="mb-1.5 block text-sm font-medium">
            Associate with class
          </label>
          <select
            id="upload-class"
            value={classId}
            onChange={(e) => setClassId(e.target.value)}
            className="h-11 w-full rounded-md border border-input bg-card px-3 text-sm"
          >
            {classes.map((c) => (
              <option key={c.id} value={c.id}>
                {c.name}
              </option>
            ))}
          </select>
          <p className="mt-3 rounded-lg border border-ai/25 bg-ai-soft px-3 py-2.5 text-xs text-ai">
            <Sparkles className="mr-1 inline size-3.5" aria-hidden />
            After upload, AI extracts concepts. You review them before generating questions.
          </p>
        </div>
      </div>
    </SectionCard>
  );
}

function MaterialsPage() {
  const [items, setItems] = useState<Material[]>(seedMaterials);
  const [filter, setFilter] = useState<"all" | MaterialStatus>("all");
  const [query, setQuery] = useState("");
  const timers = useRef<number[]>([]);

  useEffect(() => {
    const t = timers.current;
    return () => t.forEach((id) => window.clearTimeout(id));
  }, []);

  const simulate = (id: string) => {
    let progress = 0;
    const tick = window.setInterval(() => {
      progress += 20;
      setItems((prev) =>
        prev.map((m) => (m.id === id ? { ...m, progress: Math.min(progress, 100) } : m)),
      );
      if (progress >= 100) {
        window.clearInterval(tick);
        setItems((prev) =>
          prev.map((m) => (m.id === id ? { ...m, status: "processing", progress: 100 } : m)),
        );
        const t = window.setTimeout(() => {
          setItems((prev) =>
            prev.map((m) =>
              m.id === id
                ? {
                    ...m,
                    status: "ready",
                    conceptIds: ["c-linear", "c-algebraic"],
                  }
                : m,
            ),
          );
        }, 2600);
        timers.current.push(t);
      }
    }, 450);
  };

  const upload = (name: string, classId: string) => {
    const id = `m-${Date.now()}-${Math.round(Math.random() * 1000)}`;
    const ext = name.split(".").pop()?.toUpperCase();
    setItems((prev) => [
      {
        id,
        filename: name,
        fileType: ext === "DOCX" || ext === "TXT" ? (ext as "DOCX" | "TXT") : "PDF",
        sizeKb: 512,
        classId,
        status: "uploading",
        uploadedAt: "Just now",
        conceptIds: [],
        progress: 0,
      },
      ...prev,
    ]);
    simulate(id);
  };

  const retry = (id: string) => {
    setItems((prev) =>
      prev.map((m) => (m.id === id ? { ...m, status: "processing", errorMessage: "" } : m)),
    );
    const t = window.setTimeout(() => {
      setItems((prev) =>
        prev.map((m) =>
          m.id === id ? { ...m, status: "ready", conceptIds: ["c-force", "c-cell"] } : m,
        ),
      );
    }, 2400);
    timers.current.push(t);
  };

  const visible = items.filter(
    (m) =>
      (filter === "all" || m.status === filter) &&
      m.filename.toLowerCase().includes(query.toLowerCase()),
  );

  return (
    <div className="space-y-6">
      <PageHeader
        title="Learning materials"
        description="Upload the material you teach from. Concepts extracted here power question generation and analytics."
      />

      <UploadZone onUpload={upload} />

      <div className="flex flex-wrap items-center justify-between gap-3">
        <div role="tablist" aria-label="Filter materials" className="flex flex-wrap gap-2">
          {filters.map((f) => {
            const active = filter === f.id;
            const count =
              f.id === "all" ? items.length : items.filter((m) => m.status === f.id).length;
            return (
              <button
                key={f.id}
                role="tab"
                aria-selected={active}
                type="button"
                onClick={() => setFilter(f.id)}
                className={`h-9 rounded-full border px-3.5 text-sm font-medium ${
                  active
                    ? "border-primary bg-primary-soft text-primary"
                    : "border-border bg-card text-muted-foreground hover:bg-secondary"
                }`}
              >
                {f.label}
                <span className="ml-1.5 tnum">{count}</span>
              </button>
            );
          })}
        </div>
        <div>
          <label htmlFor="material-search" className="sr-only">
            Search materials
          </label>
          <input
            id="material-search"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search files"
            className="h-9 w-56 rounded-md border border-input bg-card px-3 text-sm outline-none focus-visible:border-primary"
          />
        </div>
      </div>

      {visible.length === 0 ? (
        <EmptyState
          icon={Library}
          title="No materials here yet"
          description="Upload a chapter PDF or notes file to get started. Concepts are extracted automatically."
        />
      ) : (
        <ul className="space-y-3">
          {visible.map((m) => (
            <li key={m.id} className="card-surface p-5">
              <div className="flex flex-wrap items-start justify-between gap-4">
                <div className="flex min-w-0 gap-3">
                  <span className="grid size-10 shrink-0 place-items-center rounded-lg bg-secondary text-muted-foreground">
                    <FileText className="size-5" aria-hidden />
                  </span>
                  <div className="min-w-0">
                    <Link
                      to="/teacher/materials/$materialId"
                      params={{ materialId: m.id }}
                      className="truncate font-semibold hover:text-primary"
                    >
                      {m.filename}
                    </Link>
                    <p className="mt-0.5 text-xs text-muted-foreground">
                      {classById(m.classId)?.name} · {m.fileType} · {m.sizeKb} KB · Uploaded{" "}
                      {m.uploadedAt}
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  {m.status === "ready" ? (
                    <span className="text-xs text-muted-foreground tnum">
                      {m.conceptIds.length} concepts
                    </span>
                  ) : null}
                  <MaterialStatusPill status={m.status} />
                </div>
              </div>

              {m.status === "uploading" ? (
                <div className="mt-4">
                  <div className="flex justify-between text-xs text-muted-foreground">
                    <span>Uploading…</span>
                    <span className="tnum">{m.progress ?? 0}%</span>
                  </div>
                  <div
                    role="progressbar"
                    aria-valuenow={m.progress ?? 0}
                    aria-valuemin={0}
                    aria-valuemax={100}
                    aria-label="Upload progress"
                    className="mt-1.5 h-2 overflow-hidden rounded-full bg-secondary"
                  >
                    <div
                      className="h-full rounded-full bg-primary transition-[width]"
                      style={{ width: `${m.progress ?? 0}%` }}
                    />
                  </div>
                </div>
              ) : null}

              {m.status === "processing" ? (
                <p className="mt-4 flex items-center gap-2 rounded-lg border border-ai/25 bg-ai-soft px-3 py-2 text-sm text-ai">
                  <Sparkles className="size-4 animate-pulse" aria-hidden />
                  Extracting concepts…
                </p>
              ) : null}

              {m.status === "failed" ? (
                <div className="mt-4 flex flex-wrap items-center justify-between gap-3 rounded-lg border border-weak/30 bg-weak-soft px-3 py-2.5">
                  <p className="text-sm text-weak">
                    {m.errorMessage ?? "Concept extraction failed."}
                  </p>
                  <button
                    type="button"
                    onClick={() => retry(m.id)}
                    className="inline-flex h-9 items-center gap-1.5 rounded-md border border-weak/40 bg-card px-3 text-sm font-medium text-weak hover:bg-weak-soft"
                  >
                    <RotateCcw className="size-4" aria-hidden />
                    Retry extraction
                  </button>
                </div>
              ) : null}

              {m.status === "ready" && m.conceptIds.length > 0 ? (
                <div className="mt-4 flex flex-wrap items-center gap-2">
                  {m.conceptIds.map((cid) => (
                    <Pill key={cid} tone="violet" icon={Sparkles}>
                      {conceptById(cid).name}
                    </Pill>
                  ))}
                  <Link
                    to="/teacher/materials/$materialId"
                    params={{ materialId: m.id }}
                    className="ml-auto text-sm font-medium text-primary hover:underline"
                  >
                    View material
                  </Link>
                </div>
              ) : null}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
