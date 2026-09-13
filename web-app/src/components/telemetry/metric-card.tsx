import React from "react";
import { cn } from "@/lib/utils";

interface MetricCardProps {
  label: string;
  value: string | number;
  unit?: string;
  subtext?: string;
  indicator?: "done" | "skip" | "miss" | "warm" | "neutral";
  progress?: number;
  className?: string;
}

export function MetricCard({
  label,
  value,
  unit,
  subtext,
  indicator,
  progress,
  className,
}: MetricCardProps) {
  const dotColor = {
    done: "bg-status-done",
    skip: "bg-status-skip",
    miss: "bg-status-miss",
    warm: "bg-accent-warm",
    neutral: "bg-text-dim",
  }[indicator || "neutral"];

  return (
    <div
      className={cn(
        "group relative flex flex-col justify-between overflow-hidden rounded-md border border-border-subtle bg-surface-base p-4 transition-colors hover:border-border-default hover:bg-surface-raised",
        className,
      )}
    >
      <div className="flex items-center justify-between gap-2">
        <span className="text-[11px] font-medium uppercase tracking-wider text-text-muted">
          {label}
        </span>
        {indicator && <span className={cn("h-1.5 w-1.5 rounded-full", dotColor)} />}
      </div>

      <div className="my-2 flex items-baseline gap-1.5">
        <span className="font-mono text-[24px] font-medium tracking-tight text-text-primary tabular-nums">
          {value}
        </span>
        {unit && <span className="text-[13px] text-text-secondary">{unit}</span>}
      </div>

      {subtext && <p className="text-[12px] text-text-secondary leading-normal">{subtext}</p>}

      {progress !== undefined && (
        <div className="mt-3 h-1.5 w-full overflow-hidden rounded-full bg-surface-raised">
          <div
            className="h-full bg-status-done transition-all duration-300"
            style={{ width: `${Math.min(100, Math.max(0, progress))}%` }}
          />
        </div>
      )}
    </div>
  );
}
