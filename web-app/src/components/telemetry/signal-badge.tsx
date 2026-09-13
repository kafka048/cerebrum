import React from "react";
import { cn } from "@/lib/utils";

interface SignalBadgeProps {
  profile: string;
  confidence?: number; // 0 to 1, or 0 to 100
  size?: "sm" | "md" | "lg";
  className?: string;
}

const PROFILE_CONFIG: Record<
  string,
  { label: string; tone: string; dotColor: string; borderColor: string; bgColor: string }
> = {
  sustainable: {
    label: "Steady & Sustainable",
    tone: "text-status-done",
    dotColor: "bg-status-done",
    borderColor: "border-status-done/30",
    bgColor: "bg-status-done/10",
  },
  recovery: {
    label: "Rebounding Rhythm",
    tone: "text-accent-warm",
    dotColor: "bg-accent-warm",
    borderColor: "border-accent-warm/30",
    bgColor: "bg-accent-warm/10",
  },
  burnout: {
    label: "Signs of Fatigue",
    tone: "text-status-miss",
    dotColor: "bg-status-miss",
    borderColor: "border-status-miss/30",
    bgColor: "bg-status-miss/10",
  },
  declining: {
    label: "Softening Momentum",
    tone: "text-status-skip",
    dotColor: "bg-status-skip",
    borderColor: "border-status-skip/30",
    bgColor: "bg-status-skip/10",
  },
  chaotic: {
    label: "Variable Rhythm",
    tone: "text-status-skip",
    dotColor: "bg-status-skip",
    borderColor: "border-status-skip/30",
    bgColor: "bg-status-skip/10",
  },
  weekend_warrior: {
    label: "Weekend Focused",
    tone: "text-accent-warm",
    dotColor: "bg-accent-warm",
    borderColor: "border-accent-warm/30",
    bgColor: "bg-accent-warm/10",
  },
  learning: {
    label: "Observing Habits",
    tone: "text-text-muted",
    dotColor: "bg-text-dim",
    borderColor: "border-border-default",
    bgColor: "bg-surface-raised",
  },
};

export function SignalBadge({ profile, confidence, size = "md", className }: SignalBadgeProps) {
  const normalizedKey = profile.toLowerCase().replace(/\s+/g, "_");
  const config = PROFILE_CONFIG[normalizedKey] || {
    label: profile.replace(/_/g, " ").replace(/\b\w/g, (l) => l.toUpperCase()),
    tone: "text-accent-warm",
    dotColor: "bg-accent-warm",
    borderColor: "border-accent-warm/30",
    bgColor: "bg-accent-warm/10",
  };

  const formattedConfidence =
    confidence !== undefined ? Math.round(confidence <= 1 ? confidence * 100 : confidence) : null;

  return (
    <span
      className={cn(
        "inline-flex items-center gap-1.5 rounded-full border px-2.5 py-0.5 text-[12px] font-medium tracking-tight",
        config.borderColor,
        config.bgColor,
        config.tone,
        size === "sm" && "text-[11px] py-0 px-2",
        size === "md" && "text-[12px] py-0.5 px-2.5",
        size === "lg" && "text-[13px] py-1 px-3",
        className,
      )}
    >
      <span className={cn("h-1.5 w-1.5 rounded-full", config.dotColor)} />
      <span>{config.label}</span>
      {formattedConfidence !== null && (
        <span className="opacity-75 font-normal text-text-muted font-mono text-[11px]">
          · {formattedConfidence}% match
        </span>
      )}
    </span>
  );
}
