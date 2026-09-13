import { useState, type ReactNode } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { useCerebrumState } from "@/lib/cerebrum-state";
import { GoalCreate, GoalPriority, GoalStatus } from "@/types/goal";
import { TaskCreate } from "@/types/task";

export function CreateGoalDialog({
  open,
  onOpenChange,
  trigger,
}: {
  open: boolean;
  onOpenChange: (v: boolean) => void;
  trigger?: ReactNode;
}) {
  const { createGoal } = useCerebrumState();
  const [name, setName] = useState("");
  const [purpose, setPurpose] = useState("");
  const [priority, setPriority] = useState<GoalPriority | null>(null);
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [status, setStatus] = useState<GoalStatus>("active");
  const [error, setError] = useState("");

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (!name.trim()) return;
    if (priority == null) {
      setError("Please select a priority.");
      return;
    }
    if (!startDate) {
      setError("Please select a start date.");
      return;
    }
    const goal: GoalCreate = {
      goal_name: name.trim(),
      description: purpose.trim() || undefined,
      priority,
      start_date: startDate,
      end_date: endDate || undefined,
      status,
    };

    try {
      await createGoal(goal);
      setName("");
      setPurpose("");
      setPriority(null);
      setStartDate("");
      setEndDate("");
      setStatus("active");
      setError("");
      onOpenChange(false);
    } catch (error) {
      if (error instanceof Error) {
        setError(error.message);
      } else {
        setError("Something went wrong.");
      }
    }
  };

  return (
    <>
      {trigger}
      <Dialog open={open} onOpenChange={onOpenChange}>
        <DialogContent className="border-border bg-surface text-foreground sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="font-display text-2xl tracking-tight">Create Goal</DialogTitle>
            <DialogDescription className="text-muted-foreground">
              A direction worth committing to. Keep it short.
            </DialogDescription>
          </DialogHeader>
          <form onSubmit={submit} className="space-y-4">
            <div className="space-y-1.5">
              <label className="text-[11px] uppercase tracking-[0.18em] text-tertiary">Name</label>
              <input
                autoFocus
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Fitness"
                className="w-full rounded-md border border-border bg-background px-3 py-2.5 text-[14px] text-foreground placeholder:text-tertiary focus:border-understanding/60 focus:outline-none"
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-[11px] uppercase tracking-[0.18em] text-tertiary">
                Purpose <span className="text-tertiary/70 normal-case">(optional)</span>
              </label>
              <input
                value={purpose}
                onChange={(e) => setPurpose(e.target.value)}
                placeholder="Build durable physical capacity."
                className="w-full rounded-md border border-border bg-background px-3 py-2.5 text-[14px] text-foreground placeholder:text-tertiary focus:border-understanding/60 focus:outline-none"
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-[11px] uppercase tracking-[0.18em] text-tertiary">
                Priority
              </label>

              <div className="grid grid-cols-3 gap-2">
                {[
                  { label: "High", value: 3 },
                  { label: "Medium", value: 2 },
                  { label: "Low", value: 1 },
                ].map((option) => (
                  <button
                    key={option.value}
                    type="button"
                    onClick={() => setPriority(option.value as GoalPriority)}
                    className={`rounded-md border px-3 py-2 text-[13px] transition-colors ${
                      priority === option.value
                        ? "border-understanding bg-surface-elevated text-foreground"
                        : "border-border bg-background text-muted-foreground hover:bg-surface-elevated"
                    }`}
                  >
                    {option.label}
                  </button>
                ))}
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1.5">
                <label className="text-[11px] uppercase tracking-[0.18em] text-tertiary">
                  Start Date
                </label>

                <input
                  type="date"
                  value={startDate}
                  onChange={(e) => setStartDate(e.target.value)}
                  className="w-full rounded-md border border-border bg-background px-3 py-2.5 text-[14px] text-foreground focus:border-understanding/60 focus:outline-none"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-[11px] uppercase tracking-[0.18em] text-tertiary">
                  End Date <span className="text-tertiary/70 normal-case">(optional)</span>
                </label>

                <input
                  type="date"
                  value={endDate}
                  onChange={(e) => setEndDate(e.target.value)}
                  className="w-full rounded-md border border-border bg-background px-3 py-2.5 text-[14px] text-foreground focus:border-understanding/60 focus:outline-none"
                />
              </div>
            </div>

            {error && <p className="text-[12px] text-red-400">{error}</p>}

            <DialogFooter className="gap-2 sm:gap-2">
              <button
                type="button"
                onClick={() => onOpenChange(false)}
                className="rounded-md border border-border bg-transparent px-4 py-2 text-[13px] text-muted-foreground hover:bg-surface-elevated"
              >
                Cancel
              </button>

              <button
                type="submit"
                disabled={!name.trim() || priority === null || !startDate}
                className="rounded-md bg-foreground px-4 py-2 text-[13px] font-medium text-background transition-opacity disabled:opacity-40"
              >
                Create Goal
              </button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </>
  );
}

export function CreateTaskDialog({
  open,
  onOpenChange,
  goalId,
  goalName,
}: {
  open: boolean;
  onOpenChange: (v: boolean) => void;
  goalId: number;
  goalName?: string;
  onSave: (task: TaskCreate) => void;
}) {
  const { createTask } = useCerebrumState();
  const [taskName, setTaskName] = useState("");
  const [error, setError] = useState("");

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (!goalId || !taskName.trim()) return;

    const task: TaskCreate = {
      task_name: taskName.trim(),
      goal_id: goalId,
    }; // DATA TRANSFER OBJECT

    try {
      await createTask(task);
      setTaskName("");
      setError("");
      onOpenChange(false);
    } catch (error) {
      if (error instanceof Error) {
        setError(error.message);
      } else {
        setError("Something went wrong.");
      }
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="border-border bg-surface text-foreground sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="font-display text-2xl tracking-tight">Add Task</DialogTitle>
          <DialogDescription className="text-muted-foreground">
            {goalName ? `A behavior supporting ${goalName}.` : "A behavior to log over time."}
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={submit} className="space-y-4">
          <div className="space-y-1.5">
            <label className="text-[11px] uppercase tracking-[0.18em] text-tertiary">Task</label>
            <input
              autoFocus
              value={taskName}
              onChange={(e) => setTaskName(e.target.value)}
              placeholder="Run 5km"
              className="w-full rounded-md border border-border bg-background px-3 py-2.5 text-[14px] text-foreground placeholder:text-tertiary focus:border-understanding/60 focus:outline-none"
            />
          </div>
          <DialogFooter className="gap-2 sm:gap-2">
            <button
              type="button"
              onClick={() => onOpenChange(false)}
              className="rounded-md border border-border bg-transparent px-4 py-2 text-[13px] text-muted-foreground hover:bg-surface-elevated"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={!taskName.trim()}
              className="rounded-md bg-foreground px-4 py-2 text-[13px] font-medium text-background transition-opacity disabled:opacity-40"
            >
              Add Task
            </button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
