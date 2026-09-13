import type { ReactNode } from "react";
import { cn } from "@/lib/utils";

/* -------------------------------------------------------------------------- */
/*  Eyebrow — small uppercase label that anchors reading rhythm               */
/* -------------------------------------------------------------------------- */

export function Eyebrow({
  children,
  tone = "tertiary",
  className,
}: {
  children: ReactNode;
  tone?: "tertiary" | "muted" | "accent";
  className?: string;
}) {
  const toneCls =
    tone === "accent" ? "text-ember" : tone === "muted" ? "text-muted-foreground" : "text-tertiary";
  return (
    <p className={cn("text-[10.5px] uppercase tracking-[0.22em] font-medium", toneCls, className)}>
      {children}
    </p>
  );
}

/* -------------------------------------------------------------------------- */
/*  Panel — the dashboard container primitive                                 */
/* -------------------------------------------------------------------------- */

export function Panel({
  children,
  className,
  tone = "default",
  as: Tag = "section",
}: {
  children: ReactNode;
  className?: string;
  tone?: "default" | "elevated" | "ember";
  as?: "section" | "div" | "article" | "header";
}) {
  const toneCls =
    tone === "elevated"
      ? "bg-surface-elevated"
      : tone === "ember"
        ? "bg-surface-elevated relative overflow-hidden"
        : "bg-surface";
  return (
    <Tag
      className={cn(
        "relative rounded-[var(--radius)] border border-border/70 shadow-panel",
        toneCls,
        className,
      )}
    >
      {tone === "ember" && (
        <span
          aria-hidden
          className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-ember/70 to-transparent"
        />
      )}
      {children}
    </Tag>
  );
}

export function PanelHeader({
  eyebrow,
  meta,
  title,
  right,
  className,
  density = "default",
}: {
  eyebrow?: ReactNode;
  meta?: ReactNode;
  title?: ReactNode;
  right?: ReactNode;
  className?: string;
  density?: "default" | "compact";
}) {
  const pad = density === "compact" ? "px-6 pt-5 pb-3" : "px-8 pt-7 pb-5";
  const titleCls =
    density === "compact"
      ? "font-display text-[22px] leading-[1.1] tracking-tight text-foreground"
      : "font-display text-[26px] leading-[1.1] tracking-tight text-foreground";
  return (
    <div className={cn("flex items-start justify-between gap-8", pad, className)}>
      <div className="min-w-0">
        {eyebrow && <Eyebrow className="mb-2">{eyebrow}</Eyebrow>}
        {title && <h2 className={titleCls}>{title}</h2>}
        {meta && <MetaRow>{meta}</MetaRow>}
      </div>
      {right && <div className="shrink-0">{right}</div>}
    </div>
  );
}

/* -------------------------------------------------------------------------- */
/*  Status — three genuinely distinguishable tones                            */
/* -------------------------------------------------------------------------- */

export type StatusTone = "completed" | "skipped" | "failed";

const STATUS_META: Record<
  StatusTone,
  { label: string; textCls: string; bgCls: string; borderCls: string }
> = {
  completed: {
    label: "Completed",
    textCls: "text-status-completed",
    bgCls: "bg-status-completed",
    borderCls: "border-status-completed/50",
  },
  skipped: {
    label: "Skipped",
    textCls: "text-status-skipped",
    bgCls: "bg-status-skipped",
    borderCls: "border-status-skipped/50",
  },
  failed: {
    label: "Failed",
    textCls: "text-status-failed",
    bgCls: "bg-status-failed",
    borderCls: "border-status-failed/50",
  },
};

/**
 * Typographic status marker with a colored dot.
 * Completed gets a filled dot + medium weight; skipped gets a hollow ring;
 * failed gets a filled dot with a subtle warm halo.
 */
export function StatusLabel({ tone }: { tone: StatusTone }) {
  const meta = STATUS_META[tone];
  return (
    <span
      className={cn(
        "inline-flex items-center gap-2.5 text-[11px] uppercase tracking-[0.22em]",
        meta.textCls,
        tone === "completed" && "font-medium",
      )}
    >
      {tone === "skipped" ? (
        <span aria-hidden className={cn("h-[7px] w-[7px] rounded-full border", meta.borderCls)} />
      ) : (
        <span
          aria-hidden
          className={cn(
            "h-[7px] w-[7px] rounded-full",
            meta.bgCls,
            tone === "failed" &&
              "shadow-[0_0_0_3px_color-mix(in_oklab,var(--status-failed)_22%,transparent)]",
          )}
        />
      )}
      {meta.label}
    </span>
  );
}

/**
 * Recorded state chip — a slightly weightier surface version of StatusLabel,
 * for when the row settles into an observation.
 */
export function StatusChip({ tone }: { tone: StatusTone }) {
  const meta = STATUS_META[tone];
  return (
    <span
      className={cn(
        "inline-flex items-center gap-2.5 rounded-full border px-3 py-1 text-[10.5px] uppercase tracking-[0.22em]",
        meta.textCls,
        meta.borderCls,
        "bg-surface-elevated/60",
      )}
    >
      {tone === "skipped" ? (
        <span aria-hidden className={cn("h-[6px] w-[6px] rounded-full border", meta.borderCls)} />
      ) : (
        <span aria-hidden className={cn("h-[6px] w-[6px] rounded-full", meta.bgCls)} />
      )}
      {meta.label}
    </span>
  );
}

/* -------------------------------------------------------------------------- */
/*  StatusIconButton — the three action buttons on TaskRow                    */
/* -------------------------------------------------------------------------- */

export function StatusIconButton({
  tone,
  onClick,
  ariaLabel,
}: {
  tone: StatusTone;
  onClick: () => void;
  ariaLabel: string;
}) {
  const meta = STATUS_META[tone];
  return (
    <button
      type="button"
      onClick={onClick}
      aria-label={ariaLabel}
      title={ariaLabel}
      className={cn(
        "group/btn inline-flex h-9 w-9 items-center justify-center rounded-full border border-border/60 text-tertiary transition-all",
        "hover:border-transparent hover:text-foreground hover:bg-surface-elevated",
        "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-offset-background",
        tone === "completed" &&
          "hover:border-status-completed/60 hover:text-status-completed focus-visible:ring-status-completed/40",
        tone === "skipped" &&
          "hover:border-status-skipped/60 hover:text-status-skipped focus-visible:ring-status-skipped/40",
        tone === "failed" &&
          "hover:border-status-failed/60 hover:text-status-failed focus-visible:ring-status-failed/40",
      )}
    >
      {tone === "completed" && <IconCheck />}
      {tone === "skipped" && <IconMinus />}
      {tone === "failed" && <IconCross />}
      <span className="sr-only">{meta.label}</span>
    </button>
  );
}

function IconCheck() {
  return (
    <svg
      width="16"
      height="16"
      viewBox="0 0 16 16"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.75"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden
    >
      <path d="M3.5 8.5l2.75 2.75L12.5 5" />
    </svg>
  );
}

function IconMinus() {
  return (
    <svg
      width="16"
      height="16"
      viewBox="0 0 16 16"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.75"
      strokeLinecap="round"
      aria-hidden
    >
      <path d="M4 8h8" />
    </svg>
  );
}

function IconCross() {
  return (
    <svg
      width="16"
      height="16"
      viewBox="0 0 16 16"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.75"
      strokeLinecap="round"
      aria-hidden
    >
      <path d="M4.5 4.5l7 7M11.5 4.5l-7 7" />
    </svg>
  );
}

/* -------------------------------------------------------------------------- */
/*  Confidence — pill (compact) and ring (verdict panel)                      */
/* -------------------------------------------------------------------------- */

export function ConfidencePill({ value }: { value: number }) {
  return (
    <span className="inline-flex items-baseline gap-2 rounded-full border border-ember/50 bg-ember/[0.08] px-3.5 py-1.5">
      <span className="font-display text-[16px] tabular-nums tracking-tight text-ember">
        {value}%
      </span>
      <span className="text-[10px] uppercase tracking-[0.22em] text-muted-foreground">
        confidence
      </span>
    </span>
  );
}

export function ConfidenceRing({ value, size = 128 }: { value: number; size?: number }) {
  const stroke = 3;
  const r = (size - stroke) / 2;
  const c = 2 * Math.PI * r;
  const clamped = Math.max(0, Math.min(100, value));
  const dash = (clamped / 100) * c;

  return (
    <div
      className="relative inline-flex items-center justify-center"
      style={{ width: size, height: size }}
    >
      <svg
        width={size}
        height={size}
        viewBox={`0 0 ${size} ${size}`}
        className="-rotate-90"
        aria-hidden
      >
        <circle
          cx={size / 2}
          cy={size / 2}
          r={r}
          fill="none"
          stroke="color-mix(in oklab, var(--border) 65%, transparent)"
          strokeWidth={stroke}
        />
        <circle
          cx={size / 2}
          cy={size / 2}
          r={r}
          fill="none"
          stroke="var(--ember)"
          strokeWidth={stroke}
          strokeLinecap="round"
          strokeDasharray={`${dash} ${c}`}
          className="transition-[stroke-dasharray] duration-700"
        />
      </svg>
      <div className="absolute inset-0 flex flex-col items-center justify-center">
        <span className="font-display text-[36px] leading-none tabular-nums text-foreground">
          {clamped}
          <span className="text-[18px] text-tertiary">%</span>
        </span>
        <span className="mt-2 text-[9.5px] uppercase tracking-[0.28em] text-tertiary">
          Confidence
        </span>
      </div>
    </div>
  );
}

/* -------------------------------------------------------------------------- */
/*  Hairline                                                                  */
/* -------------------------------------------------------------------------- */

export function Hairline({ className }: { className?: string }) {
  return <div className={cn("h-px hairline", className)} />;
}

export function MetaRow({ children }: { children: ReactNode }) {
  return (
    <div className="flex flex-wrap items-center gap-x-3 gap-y-1 text-[12px] text-muted-foreground/90 mb-1.5">
      {children}
    </div>
  );
}
