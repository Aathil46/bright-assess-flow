import { Sparkles } from "lucide-react";
import { cn } from "@/lib/utils";
import { conceptById, levelOf } from "@/lib/mock-data";
import { LevelPill } from "./status-pill";

const barTone = {
  strong: "bg-strong",
  medium: "bg-medium",
  weak: "bg-weak",
} as const;

export function AccuracyBar({ value, className }: { value: number; className?: string }) {
  const level = levelOf(value);
  return (
    <div
      className={cn("h-2 w-full overflow-hidden rounded-full bg-secondary", className)}
      role="progressbar"
      aria-valuenow={value}
      aria-valuemin={0}
      aria-valuemax={100}
      aria-label={`Accuracy ${value} percent, ${level}`}
    >
      <div className={cn("h-full rounded-full", barTone[level])} style={{ width: `${value}%` }} />
    </div>
  );
}

export function ConceptAccuracyRow({
  conceptId,
  accuracy,
  meta,
  action,
}: {
  conceptId: string;
  accuracy: number;
  meta?: string;
  action?: React.ReactNode;
}) {
  const concept = conceptById(conceptId);
  return (
    <div className="flex flex-col gap-2 py-3 sm:flex-row sm:items-center sm:gap-4">
      <div className="min-w-0 sm:w-56">
        <p className="truncate text-sm font-medium">{concept.name}</p>
        {meta ? <p className="text-xs text-muted-foreground">{meta}</p> : null}
      </div>
      <div className="flex flex-1 items-center gap-3">
        <AccuracyBar value={accuracy} />
        <span className="w-11 shrink-0 text-right text-sm font-semibold tnum">{accuracy}%</span>
      </div>
      <div className="flex items-center gap-2 sm:justify-end">
        <LevelPill level={levelOf(accuracy)} />
        {action}
      </div>
    </div>
  );
}

/** Wrapper that visually separates AI-generated content from system data. */
export function AIPanel({
  title,
  children,
  footnote = "AI interpretation of system analytics. Scores and classifications are calculated by the system.",
  action,
}: {
  title: string;
  children: React.ReactNode;
  footnote?: string;
  action?: React.ReactNode;
}) {
  return (
    <section className="overflow-hidden rounded-xl border border-ai/25 bg-card shadow-[var(--shadow-card)]">
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-ai/20 bg-ai-soft px-5 py-3">
        <h2 className="flex items-center gap-2 text-base font-semibold text-ai">
          <Sparkles className="size-4" aria-hidden />
          {title}
        </h2>
        <div className="flex items-center gap-2">
          <span className="rounded-full border border-ai/25 bg-card px-2 py-0.5 text-[11px] font-medium text-ai">
            AI-generated
          </span>
          {action}
        </div>
      </div>
      <div className="border-l-4 border-ai/60 p-5">
        {children}
        <p className="mt-4 border-t border-border pt-3 text-xs text-muted-foreground">{footnote}</p>
      </div>
    </section>
  );
}

export function SystemFactList({
  items,
}: {
  items: { label: string; value: string }[];
}) {
  return (
    <dl className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
      {items.map((item) => (
        <div key={item.label} className="rounded-lg border border-border bg-secondary/50 px-4 py-3">
          <dt className="text-xs font-medium tracking-wide text-muted-foreground uppercase">
            {item.label}
          </dt>
          <dd className="mt-1 text-xl font-semibold tnum">{item.value}</dd>
        </div>
      ))}
    </dl>
  );
}
