import { useState } from "react";
import { Plus } from "lucide-react";
import { useCerebrumState } from "@/lib/cerebrum-state";
import { CreateTaskDialog } from "./dialogs";

export function OnboardingNoTasks() {
  const { goals } = useCerebrumState();
  const [goalId, setGoalId] = useState<string | null>(null);

  const activeGoal = goals.find((g) => g.id === goalId);

  return (
    <div className="mx-auto w-full max-w-2xl px-6 pt-20 pb-24 sm:pt-28">
      <div className="text-center">
        <p className="text-[10px] uppercase tracking-[0.22em] text-understanding">Goal Created</p>
        <h1 className="mt-5 font-display text-4xl leading-[1.05] tracking-tight text-foreground sm:text-[44px]">
          Now define the behaviors
          <br />
          <span className="text-muted-foreground">that support it.</span>
        </h1>
        <p className="mx-auto mt-6 max-w-lg text-[14.5px] leading-relaxed text-muted-foreground">
          Tasks are the actions Cerebrum observes. Each task you log becomes another data point in
          your behavioral profile.
        </p>
      </div>

      <div className="mt-14 space-y-px overflow-hidden rounded-lg border border-border bg-border">
        {goals.map((g) => (
          <div
            key={g.id}
            className="grid grid-cols-[minmax(0,1fr)_auto] items-center gap-6 bg-surface p-6"
          >
            <div className="min-w-0">
              <div className="flex items-center gap-3">
                <span className="h-1 w-1 rounded-full bg-understanding" />
                <p className="text-[10px] uppercase tracking-[0.18em] text-tertiary">Active</p>
              </div>
              <h2 className="mt-2 font-display text-[22px] tracking-tight text-foreground">
                {g.name}
              </h2>
              {g.purpose && (
                <p className="mt-1 text-[13px] text-muted-foreground">{g.purpose}</p>
              )}
              <p className="mt-3 text-[11px] uppercase tracking-[0.15em] text-tertiary">
                0 tasks
              </p>
            </div>
            <button
              onClick={() => setGoalId(g.id)}
              className="inline-flex shrink-0 items-center gap-2 rounded-md border border-border bg-surface-elevated px-3.5 py-2 text-[12.5px] text-foreground transition-colors hover:border-understanding/60"
            >
              <Plus className="h-3.5 w-3.5" strokeWidth={1.75} />
              Add First Task
            </button>
          </div>
        ))}
      </div>

      <CreateTaskDialog
        open={!!goalId}
        onOpenChange={(v) => !v && setGoalId(null)}
        goalId={goalId}
        goalName={activeGoal?.name}
      />
    </div>
  );
}
