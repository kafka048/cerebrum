import React from "react";
import { cn } from "@/lib/utils";
import { TrendingUp, TrendingDown, Minus } from "lucide-react";

interface MomentumIndicatorProps {
  weightedScore: number;
  direction: number;
  acceleration: number;
  className?: string;
}

export function MomentumIndicator({
  weightedScore,
  direction,
  acceleration,
  className,
}: MomentumIndicatorProps) {
  const isPositive = direction > 0.05;
  const isNegative = direction < -0.05;

  let headline = "Holding a steady pace";
  let description = "Your follow-through has been consistent and predictable.";
  let toneClass = "text-text-primary";
  let icon = <Minus className="h-4 w-4 text-text-muted" />;

  if (isPositive) {
    if (acceleration > 0.05) {
      headline = "Your pace is picking up";
      description = "You're following through more reliably this week than when you started.";
      toneClass = "text-status-done";
      icon = <TrendingUp className="h-4 w-4 text-status-done" />;
    } else {
      headline = "Consistent forward momentum";
      description = "You're steadily reinforcing this habit with regular completions.";
      toneClass = "text-status-done";
      icon = <TrendingUp className="h-4 w-4 text-status-done" />;
    }
  } else if (isNegative) {
    headline = "A bit of a lull lately";
    description =
      "Follow-through has softened over the last few days. A small win today turns it around.";
    toneClass = "text-status-skip";
    icon = <TrendingDown className="h-4 w-4 text-status-skip" />;
  }

  const recentConsistencyPct = Math.round(weightedScore * 100);

  return (
    <div
      className={cn(
        "rounded-md border border-border-subtle bg-surface-base p-5 transition-colors hover:border-border-default",
        className,
      )}
    >
      <div className="flex items-center justify-between pb-3 hairline-b">
        <div className="flex items-center gap-2">
          {icon}
          <span className={cn("text-[14px] font-medium tracking-tight", toneClass)}>
            {headline}
          </span>
        </div>
        <span className="text-[11px] font-medium text-text-muted">Pace & Momentum</span>
      </div>

      <p className="mt-3 text-[13px] text-text-secondary leading-relaxed">{description}</p>

      <div className="mt-4 grid grid-cols-2 gap-3 pt-3 hairline-t">
        <div className="rounded border border-border-subtle bg-surface-raised p-3">
          <span className="block text-[11px] text-text-muted">Recent Consistency</span>
          <span className="mt-1 block font-mono text-[20px] font-medium text-text-primary tabular-nums">
            {recentConsistencyPct}%
          </span>
          <span className="text-[11px] text-text-muted">Giving weight to recent days</span>
        </div>

        <div className="rounded border border-border-subtle bg-surface-raised p-3">
          <span className="block text-[11px] text-text-muted">Weekly Trend</span>
          <span
            className={cn(
              "mt-1 block font-mono text-[20px] font-medium tabular-nums",
              direction > 0
                ? "text-status-done"
                : direction < 0
                  ? "text-status-skip"
                  : "text-text-primary",
            )}
          >
            {direction > 0 ? "Improving" : direction < 0 ? "Softening" : "Steady"}
          </span>
          <span className="text-[11px] text-text-muted">Compared to early baseline</span>
        </div>
      </div>
    </div>
  );
}
