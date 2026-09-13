import React, { useState, useEffect } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import { TaskCreate, TaskRead, TaskUpdate } from "@/types/task";
import { GoalRead } from "@/types/goal";

interface TaskModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSubmit: (data: TaskCreate | TaskUpdate) => Promise<void>;
  initialTask?: TaskRead | null;
  goals: GoalRead[];
  defaultGoalId?: number;
}

export function TaskModal({
  open,
  onOpenChange,
  onSubmit,
  initialTask,
  goals,
  defaultGoalId,
}: TaskModalProps) {
  const isEditing = !!initialTask;
  const [taskName, setTaskName] = useState("");
  const [goalId, setGoalId] = useState<number>(defaultGoalId || goals[0]?.goal_id || 0);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (initialTask) {
      setTaskName(initialTask.task_name);
      setGoalId(initialTask.goal_id);
    } else {
      setTaskName("");
      setGoalId(defaultGoalId || goals[0]?.goal_id || 0);
    }
    setError(null);
  }, [initialTask, defaultGoalId, goals, open]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!taskName.trim()) {
      setError("Task name is required");
      return;
    }
    if (!isEditing && !goalId) {
      setError("Please select a target goal");
      return;
    }

    setLoading(true);
    setError(null);
    try {
      if (isEditing) {
        await onSubmit({ task_name: taskName.trim() });
      } else {
        await onSubmit({ task_name: taskName.trim(), goal_id: Number(goalId) });
      }
      onOpenChange(false);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to save task");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md border-border-default bg-surface-base text-text-primary">
        <form onSubmit={handleSubmit}>
          <DialogHeader>
            <DialogTitle className="font-mono text-[16px] font-semibold text-text-primary">
              {isEditing ? "Rename Task" : "New Behavioral Task"}
            </DialogTitle>
            <DialogDescription className="text-[12px] text-text-secondary">
              A recurring behavioral action tracked daily to surface patterns.
            </DialogDescription>
          </DialogHeader>

          <div className="mt-4 space-y-4">
            {error && (
              <div className="rounded border border-signal-coral/30 bg-signal-coral/10 p-2.5 font-mono text-[11px] text-signal-coral">
                {error}
              </div>
            )}

            <div className="space-y-1">
              <label className="font-mono text-[10px] uppercase tracking-wider text-text-muted">
                Task Name *
              </label>
              <input
                type="text"
                required
                value={taskName}
                onChange={(e) => setTaskName(e.target.value)}
                placeholder="e.g. 90-min uninterrupted deep work block"
                className="w-full rounded border border-border-default bg-surface-raised px-3 py-2 text-[13px] text-text-primary placeholder:text-text-dim focus:border-border-focus focus:outline-none"
              />
            </div>

            {!isEditing && (
              <div className="space-y-1">
                <label className="font-mono text-[10px] uppercase tracking-wider text-text-muted">
                  Associated Goal *
                </label>
                <select
                  value={goalId}
                  onChange={(e) => setGoalId(Number(e.target.value))}
                  className="w-full rounded border border-border-default bg-surface-raised px-3 py-2 text-[13px] text-text-primary focus:border-border-focus focus:outline-none"
                >
                  {goals.map((g) => (
                    <option key={g.goal_id} value={g.goal_id} className="bg-surface-base">
                      {g.goal_name} (P{g.priority})
                    </option>
                  ))}
                </select>
              </div>
            )}
          </div>

          <DialogFooter className="mt-6 flex gap-2">
            <button
              type="button"
              onClick={() => onOpenChange(false)}
              className="rounded border border-border-subtle bg-surface-base px-3 py-1.5 font-mono text-[12px] text-text-secondary hover:text-text-primary"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className="rounded bg-text-primary px-4 py-1.5 font-mono text-[12px] font-semibold text-canvas transition-colors hover:bg-text-secondary disabled:opacity-50"
            >
              {loading ? "Saving..." : isEditing ? "Save Name" : "Create Task"}
            </button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
