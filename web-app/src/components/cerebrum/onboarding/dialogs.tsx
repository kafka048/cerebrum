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

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;
    createGoal({ name: name.trim(), purpose: purpose.trim() || undefined });
    setName("");
    setPurpose("");
    onOpenChange(false);
  };

  return (
    <>
      {trigger}
      <Dialog open={open} onOpenChange={onOpenChange}>
        <DialogContent className="border-border bg-surface text-foreground sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="font-display text-2xl tracking-tight">
              Create Goal
            </DialogTitle>
            <DialogDescription className="text-muted-foreground">
              A direction worth committing to. Keep it short.
            </DialogDescription>
          </DialogHeader>
          <form onSubmit={submit} className="space-y-4">
            <div className="space-y-1.5">
              <label className="text-[11px] uppercase tracking-[0.18em] text-tertiary">
                Name
              </label>
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
                disabled={!name.trim()}
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
  goalId: string | null;
  goalName?: string;
}) {
  const { createTask } = useCerebrumState();
  const [name, setName] = useState("");

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!goalId || !name.trim()) return;
    createTask({ goalId, name: name.trim() });
    setName("");
    onOpenChange(false);
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
              value={name}
              onChange={(e) => setName(e.target.value)}
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
              disabled={!name.trim()}
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
