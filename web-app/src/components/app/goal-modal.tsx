import React, { useState, useEffect } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import { GoalCreate, GoalPriority, GoalRead, GoalStatus, GoalUpdate } from "@/types/goal";
import { cn } from "@/lib/utils";

interface GoalModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSubmit: (goal: GoalCreate | GoalUpdate) => Promise<void>;
  initialGoal?: GoalRead | null;
}

export function GoalModal({ open, onOpenChange, onSubmit, initialGoal }: GoalModalProps) {
  const isEditing = !!initialGoal;
  const [goalName, setGoalName] = useState("");
  const [description, setDescription] = useState("");
  const [priority, setPriority] = useState<GoalPriority>(1);
  const [startDate, setStartDate] = useState(new Date().toISOString().split("T")[0]);
  const [endDate, setEndDate] = useState("");
  const [status, setStatus] = useState<GoalStatus>("active");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (initialGoal) {
      setGoalName(initialGoal.goal_name);
      setDescription(initialGoal.description || "");
      setPriority(initialGoal.priority);
      setStartDate(initialGoal.start_date.split("T")[0]);
      setEndDate(initialGoal.end_date ? initialGoal.end_date.split("T")[0] : "");
      setStatus(initialGoal.status);
    } else {
      setGoalName("");
      setDescription("");
      setPriority(1);
      setStartDate(new Date().toISOString().split("T")[0]);
      setEndDate("");
      setStatus("active");
    }
    setError(null);
  }, [initialGoal, open]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!goalName.trim()) {
      setError("Goal name is required");
      return;
    }

    setLoading(true);
    setError(null);
    try {
      const payload = {
        goal_name: goalName.trim(),
        description: description.trim() || null,
        priority,
        start_date: new Date(startDate).toISOString(),
        end_date: endDate ? new Date(endDate).toISOString() : null,
        status,
      };

      await onSubmit(payload);
      onOpenChange(false);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to save goal");
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
              {isEditing ? "Edit Goal" : "New Behavioral Goal"}
            </DialogTitle>
            <DialogDescription className="text-[12px] text-text-secondary">
              Strategic objective to anchor your daily execution routines.
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
                Goal Name *
              </label>
              <input
                type="text"
                required
                value={goalName}
                onChange={(e) => setGoalName(e.target.value)}
                placeholder="e.g. Deep Work Mastery, Marathon Conditioning"
                className="w-full rounded border border-border-default bg-surface-raised px-3 py-2 text-[13px] text-text-primary placeholder:text-text-dim focus:border-border-focus focus:outline-none"
              />
            </div>

            <div className="space-y-1">
              <label className="font-mono text-[10px] uppercase tracking-wider text-text-muted">
                Description
              </label>
              <textarea
                rows={2}
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Intent, rules of engagement, or underlying rationale..."
                className="w-full rounded border border-border-default bg-surface-raised px-3 py-2 text-[13px] text-text-primary placeholder:text-text-dim focus:border-border-focus focus:outline-none"
              />
            </div>

            {/* Priority Selector */}
            <div className="space-y-1">
              <label className="font-mono text-[10px] uppercase tracking-wider text-text-muted">
                Priority Tier
              </label>
              <div className="grid grid-cols-3 gap-2">
                {([1, 2, 3] as GoalPriority[]).map((p) => (
                  <button
                    key={p}
                    type="button"
                    onClick={() => setPriority(p)}
                    className={cn(
                      "rounded border py-1.5 font-mono text-[11px] font-medium transition-colors",
                      priority === p
                        ? p === 1
                          ? "border-signal-coral/50 bg-signal-coral/10 text-signal-coral"
                          : p === 2
                            ? "border-signal-amber/50 bg-signal-amber/10 text-signal-amber"
                            : "border-signal-cyan/50 bg-signal-cyan/10 text-signal-cyan"
                        : "border-border-subtle bg-surface-raised text-text-muted hover:text-text-secondary",
                    )}
                  >
                    P{p} · {p === 1 ? "Critical" : p === 2 ? "High" : "Standard"}
                  </button>
                ))}
              </div>
            </div>

            {/* Dates */}
            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1">
                <label className="font-mono text-[10px] uppercase tracking-wider text-text-muted">
                  Start Date *
                </label>
                <input
                  type="date"
                  required
                  value={startDate}
                  onChange={(e) => setStartDate(e.target.value)}
                  className="w-full rounded border border-border-default bg-surface-raised px-3 py-1.5 font-mono text-[12px] text-text-primary focus:border-border-focus focus:outline-none"
                />
              </div>

              <div className="space-y-1">
                <label className="font-mono text-[10px] uppercase tracking-wider text-text-muted">
                  End Date (Optional)
                </label>
                <input
                  type="date"
                  value={endDate}
                  onChange={(e) => setEndDate(e.target.value)}
                  className="w-full rounded border border-border-default bg-surface-raised px-3 py-1.5 font-mono text-[12px] text-text-primary focus:border-border-focus focus:outline-none"
                />
              </div>
            </div>

            {/* Status (if editing) */}
            {isEditing && (
              <div className="space-y-1">
                <label className="font-mono text-[10px] uppercase tracking-wider text-text-muted">
                  Status
                </label>
                <div className="grid grid-cols-3 gap-2">
                  {(["active", "completed", "abandoned"] as GoalStatus[]).map((st) => (
                    <button
                      key={st}
                      type="button"
                      onClick={() => setStatus(st)}
                      className={cn(
                        "rounded border py-1 font-mono text-[10px] uppercase tracking-wider capitalize transition-colors",
                        status === st
                          ? "border-text-secondary bg-surface-active text-text-primary"
                          : "border-border-subtle bg-surface-raised text-text-muted",
                      )}
                    >
                      {st}
                    </button>
                  ))}
                </div>
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
              {loading ? "Saving..." : isEditing ? "Update Goal" : "Create Goal"}
            </button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
