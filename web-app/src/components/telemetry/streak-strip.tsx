import React from "react";
import { cn } from "@/lib/utils";
import { Flame, Award, HeartHandshake } from "lucide-react";

interface StreakStripProps {
  currentStreak: number;
  longestStreak: number;
  breaksCount: number;
  distribution?: string;
  className?: string;
}

export function StreakStrip({
  currentStreak,
  longestStreak,
  breaksCount,
  distribution,
  className,
}: StreakStripProps) {
  const isAtPeak = currentStreak > 0 && currentStreak >= longestStreak;

  const distributionCopy: Record<string, string> = {
    early_clustered: "Early misses are behind you — your rhythm has settled in.",
    middle_clustered: "Mid-cycle fatigue noticed. Keep an eye on mid-week energy.",
    recent_clustered: "A recent pause in rhythm. Today is a great day to restart.",
    even_spread: "Misses are spread out occasionally, not clustering.",
    no_breaks: "Flawless, unbroken run so far.",
    insufficient_data: "Still observing your run patterns.",
  };

  const distNote = distribution ? distributionCopy[distribution] || distribution : null;

  return (
    <div
      className={cn(
        "rounded-md border border-border-subtle bg-surface-base p-5 transition-colors hover:border-border-default",
        className,
      )}
    >
      <div className="flex items-center justify-between pb-3 hairline-b">
        <div className="flex items-center gap-2">
          <Flame
            className={cn("h-4 w-4", currentStreak > 3 ? "text-accent-warm" : "text-text-muted")}
          />
          <span className="text-[14px] font-medium tracking-tight text-text-primary">
            Consistency & Streaks
          </span>
        </div>
        {isAtPeak && (
          <span className="inline-flex items-center gap-1 text-[11px] font-medium text-status-done">
            <Award className="h-3.5 w-3.5" />
            Personal Best!
          </span>
        )}
      </div>

      <div className="mt-4 grid grid-cols-3 gap-3">
        <div>
          <span className="text-[11px] text-text-muted block">Current Run</span>
          <div className="mt-1 flex items-baseline gap-1">
            <span className="font-mono text-[22px] font-medium text-text-primary tabular-nums">
              {currentStreak}
            </span>
            <span className="text-[12px] text-text-secondary">days</span>
          </div>
        </div>

        <div>
          <span className="text-[11px] text-text-muted block">Best Run</span>
          <div className="mt-1 flex items-baseline gap-1">
            <span className="font-mono text-[22px] font-medium text-text-secondary tabular-nums">
              {longestStreak}
            </span>
            <span className="text-[12px] text-text-muted">days</span>
          </div>
        </div>

        <div>
          <span className="text-[11px] text-text-muted block">Total Misses</span>
          <div className="mt-1 flex items-baseline gap-1">
            <span className="font-mono text-[22px] font-medium text-text-secondary tabular-nums">
              {breaksCount}
            </span>
            <span className="text-[12px] text-text-muted">days</span>
          </div>
        </div>
      </div>

      {distNote && (
        <div className="mt-4 flex items-center gap-2 pt-3 hairline-t text-[12px] text-text-secondary">
          <HeartHandshake className="h-3.5 w-3.5 text-text-muted shrink-0" />
          <span>{distNote}</span>
        </div>
      )}
    </div>
  );
}
