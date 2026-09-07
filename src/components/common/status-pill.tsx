import {
  AlertTriangle,
  CheckCircle2,
  CircleDashed,
  CircleDot,
  FileText,
  Loader2,
  MinusCircle,
  Sparkles,
  XCircle,
  type LucideIcon,
} from "lucide-react";
import { cn } from "@/lib/utils";
import type { AssessmentStatus, Level, MaterialStatus } from "@/lib/types";

type Tone = "slate" | "blue" | "amber" | "green" | "rose" | "violet";

const toneClass: Record<Tone, string> = {
  slate: "bg-secondary text-muted-foreground border-border",
  blue: "bg-info-soft text-info border-info/25",
  amber: "bg-medium-soft text-medium border-medium/30",
  green: "bg-strong-soft text-strong border-strong/30",
  rose: "bg-weak-soft text-weak border-weak/30",
  violet: "bg-ai-soft text-ai border-ai/25",
};

export function Pill({
  tone = "slate",
  icon: Icon,
  children,
  className,
  spin,
}: {
  tone?: Tone;
  icon?: LucideIcon;
  children: React.ReactNode;
  className?: string;
  spin?: boolean;
}) {
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1.5 rounded-full border px-2.5 py-0.5 text-xs font-medium whitespace-nowrap",
        toneClass[tone],
        className,
      )}
    >
      {Icon ? <Icon className={cn("size-3.5 shrink-0", spin && "animate-spin")} aria-hidden /> : null}
      {children}
    </span>
  );
}

const assessmentMeta: Record<AssessmentStatus, { label: string; tone: Tone; icon: LucideIcon }> = {
  draft: { label: "Draft", tone: "slate", icon: FileText },
  review: { label: "Review", tone: "amber", icon: CircleDashed },
  published: { label: "Published", tone: "blue", icon: CheckCircle2 },
  available: { label: "Available", tone: "blue", icon: CircleDot },
  in_progress: { label: "In Progress", tone: "amber", icon: Loader2 },
  submitted: { label: "Submitted", tone: "violet", icon: CheckCircle2 },
  evaluated: { label: "Evaluated", tone: "green", icon: CheckCircle2 },
  results_available: { label: "Results Available", tone: "green", icon: CheckCircle2 },
  closed: { label: "Closed", tone: "slate", icon: MinusCircle },
};

export function AssessmentStatusPill({ status }: { status: AssessmentStatus }) {
  const m = assessmentMeta[status];
  return (
    <Pill tone={m.tone} icon={m.icon}>
      {m.label}
    </Pill>
  );
}

const levelMeta: Record<Level, { label: string; tone: Tone; icon: LucideIcon }> = {
  strong: { label: "Strong", tone: "green", icon: CheckCircle2 },
  medium: { label: "Medium", tone: "amber", icon: CircleDot },
  weak: { label: "Weak", tone: "rose", icon: AlertTriangle },
};

export function LevelPill({ level }: { level: Level }) {
  const m = levelMeta[level];
  return (
    <Pill tone={m.tone} icon={m.icon}>
      {m.label}
    </Pill>
  );
}

export function PassFailPill({ percentage }: { percentage: number }) {
  const pass = percentage > 50;
  return (
    <Pill tone={pass ? "green" : "rose"} icon={pass ? CheckCircle2 : XCircle}>
      {pass ? "Pass" : "Fail"}
    </Pill>
  );
}

const materialMeta: Record<
  MaterialStatus,
  { label: string; tone: Tone; icon: LucideIcon; spin?: boolean }
> = {
  uploading: { label: "Uploading", tone: "blue", icon: Loader2, spin: true },
  processing: { label: "Processing", tone: "violet", icon: Loader2, spin: true },
  ready: { label: "Ready", tone: "green", icon: CheckCircle2 },
  failed: { label: "Failed", tone: "rose", icon: AlertTriangle },
};

export function MaterialStatusPill({ status }: { status: MaterialStatus }) {
  const m = materialMeta[status];
  return (
    <Pill tone={m.tone} icon={m.icon} spin={m.spin}>
      {m.label}
    </Pill>
  );
}

export function AIBadge({ label = "AI-assisted" }: { label?: string }) {
  return (
    <Pill tone="violet" icon={Sparkles}>
      {label}
    </Pill>
  );
}
