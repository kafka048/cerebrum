import React from "react";
import { cn } from "@/lib/utils";

interface TemporalAdherenceProps {
  overall: number;
  recent: number;
  temporal?: {
    initial_adherence?: number;
    middle_adherence?: number;
    recent_adherence?: number;
    [key: string]: number | undefined;
  };
  className?: string;
}

export function TemporalAdherenceChart({
  overall,
  recent,
  temporal,
  className,
}: TemporalAdherenceProps) {
  const overallPct = Math.round(overall * 100);
  const recentPct = Math.round(recent * 100);

  const initialPct =
    temporal?.initial_adherence !== undefined
      ? Math.round(temporal.initial_adherence * 100)
      : overallPct;
  const middlePct =
    temporal?.middle_adherence !== undefined
      ? Math.round(temporal.middle_adherence * 100)
      : overallPct;
  const recentWindowPct =
    temporal?.recent_adherence !== undefined
      ? Math.round(temporal.recent_adherence * 100)
      : recentPct;

  const windows = [
    { label: "When you started", value: initialPct },
    { label: "Settling into it", value: middlePct },
    { label: "Past 7 days", value: recentWindowPct },
  ];

  return (
    <div
      className={cn(
        "rounded-md border border-border-subtle bg-surface-base p-5 transition-colors hover:border-border-default",
        className,
      )}
    >
      <div className="flex items-center justify-between pb-3 hairline-b">
        <span className="text-[14px] font-medium tracking-tight text-text-primary">
          Habit Stability Across Time
        </span>
        <span className="text-[11px] text-text-muted">3-Phase Horizon</span>
      </div>

      <div className="mt-4 space-y-3">
        {windows.map((w, idx) => (
          <div key={idx} className="space-y-1.5">
            <div className="flex items-center justify-between text-[12px]">
              <span className="text-text-secondary">{w.label}</span>
              <span className="font-mono font-medium text-text-primary tabular-nums">
                {w.value}%
              </span>
            </div>
            <div className="h-2 w-full overflow-hidden rounded-full bg-surface-raised">
              <div
                className={cn(
                  "h-full rounded-full transition-all duration-300",
                  w.value >= 75
                    ? "bg-status-done"
                    : w.value >= 50
                      ? "bg-accent-warm"
                      : "bg-status-skip",
                )}
                style={{ width: `${w.value}%` }}
              />
            </div>
          </div>
        ))}
      </div>

      <div className="mt-4 flex items-center justify-between pt-3 hairline-t text-[12px]">
        <div className="flex items-center gap-1.5">
          <span className="text-text-muted">All-time completion:</span>
          <span className="font-mono font-medium text-text-secondary">{overallPct}%</span>
        </div>
        <div className="flex items-center gap-1.5">
          <span className="text-text-muted">Past week:</span>
          <span
            className={cn(
              "font-mono font-medium",
              recentPct >= overallPct ? "text-status-done" : "text-status-skip",
            )}
          >
            {recentPct}%
          </span>
        </div>
      </div>
    </div>
  );
}
