import { useState } from "react";
import { Link } from "@tanstack/react-router";
import { ArrowUpRight, MoreHorizontal, Plus } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { useCerebrumState } from "@/lib/cerebrum-state";
import type { Task } from "@/lib/cerebrum-data";
import { CreateTaskDialog } from "./onboarding/dialogs";

export function GoalCard({ goalId }: { goalId: string }) {
  const { goals, updateGoal, deleteGoal } = useCerebrumState();
  const goal = goals.find((g) => g.id === goalId);
  const [addTaskOpen, setAddTaskOpen] = useState(false);
  const [editOpen, setEditOpen] = useState(false);
  const [deleteOpen, setDeleteOpen] = useState(false);

  if (!goal) return null;

  return (
    <article className="flex h-full flex-col rounded-xl border border-border bg-surface">
      {/* Header */}
      <header className="grid grid-cols-[minmax(0,1fr)_auto] items-start gap-3 px-6 pt-6 pb-5">
        <div className="min-w-0">
          <h2 className="font-display text-[20px] leading-snug tracking-tight text-foreground">
            {goal.name}
          </h2>
          {goal.purpose && (
            <p className="mt-1.5 text-[13px] leading-relaxed text-muted-foreground">
              {goal.purpose}
            </p>
          )}
        </div>
        <DropdownMenu>
          <DropdownMenuTrigger
            aria-label="Goal options"
            className="-mr-1 -mt-1 grid h-7 w-7 place-items-center rounded-md text-tertiary transition-colors hover:bg-surface-elevated hover:text-foreground"
          >
            <MoreHorizontal className="h-4 w-4" strokeWidth={1.75} />
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="min-w-[140px] border-border bg-surface">
            <DropdownMenuItem onSelect={() => setEditOpen(true)}>Edit Goal</DropdownMenuItem>
            <DropdownMenuItem
              onSelect={() => setDeleteOpen(true)}
              className="text-failed focus:text-failed"
            >
              Delete Goal
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </header>

      <div className="border-t border-border/70" />

      {/* Tasks */}
      <div className="flex-1 px-3 py-3">
        {goal.tasks.length === 0 ? (
          <p className="px-3 py-6 text-center text-[12.5px] text-tertiary">
            No tasks yet.
          </p>
        ) : (
          <ul className="space-y-0.5">
            {goal.tasks.map((t) => (
              <li key={t.id}>
                <TaskRowItem task={t} />
              </li>
            ))}
          </ul>
        )}
      </div>

      <div className="border-t border-border/70" />

      {/* Add Task */}
      <div className="px-3 py-3">
        <button
          onClick={() => setAddTaskOpen(true)}
          className="grid w-full grid-cols-[auto_minmax(0,1fr)] items-center gap-2 rounded-md px-3 py-2.5 text-left text-[13px] text-tertiary transition-colors hover:bg-surface-elevated hover:text-foreground"
        >
          <Plus className="h-3.5 w-3.5" strokeWidth={1.75} />
          <span>Add Task</span>
        </button>
      </div>

      <CreateTaskDialog
        open={addTaskOpen}
        onOpenChange={setAddTaskOpen}
        goalId={goal.id}
        goalName={goal.name}
      />
      <EditGoalDialog
        open={editOpen}
        onOpenChange={setEditOpen}
        initialName={goal.name}
        initialPurpose={goal.purpose}
        onSave={(name, purpose) => updateGoal(goal.id, { name, purpose })}
      />
      <ConfirmDialog
        open={deleteOpen}
        onOpenChange={setDeleteOpen}
        title="Delete this goal?"
        description={`"${goal.name}" and all of its tasks will be permanently removed.`}
        confirmLabel="Delete Goal"
        destructive
        onConfirm={() => deleteGoal(goal.id)}
      />
    </article>
  );
}

function TaskRowItem({ task }: { task: Task }) {
  const { updateTask, deleteTask } = useCerebrumState();
  const [editOpen, setEditOpen] = useState(false);
  const [deleteOpen, setDeleteOpen] = useState(false);

  return (
    <div className="group grid grid-cols-[minmax(0,1fr)_auto_auto] items-center gap-2 rounded-md px-3 py-2.5 transition-colors hover:bg-surface-elevated">
      <p className="truncate text-[14px] text-foreground">{task.name}</p>
      <Link
        to="/app/intelligence/$taskId"
        params={{ taskId: task.id }}
        className="inline-flex items-center gap-1 text-[12px] text-tertiary transition-colors hover:text-understanding"
      >
        View Intelligence
        <ArrowUpRight className="h-3 w-3" strokeWidth={1.75} />
      </Link>
      <DropdownMenu>
        <DropdownMenuTrigger
          aria-label="Task options"
          className="grid h-6 w-6 place-items-center rounded text-tertiary transition-colors hover:bg-background hover:text-foreground"
        >
          <MoreHorizontal className="h-3.5 w-3.5" strokeWidth={1.75} />
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" className="min-w-[140px] border-border bg-surface">
          <DropdownMenuItem onSelect={() => setEditOpen(true)}>Edit Task</DropdownMenuItem>
          <DropdownMenuItem
            onSelect={() => setDeleteOpen(true)}
            className="text-failed focus:text-failed"
          >
            Delete Task
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>

      <EditTaskDialog
        open={editOpen}
        onOpenChange={setEditOpen}
        initialName={task.name}
        onSave={(name) => updateTask(task.id, { name })}
      />
      <ConfirmDialog
        open={deleteOpen}
        onOpenChange={setDeleteOpen}
        title="Delete this task?"
        description={`"${task.name}" will be permanently removed.`}
        confirmLabel="Delete Task"
        destructive
        onConfirm={() => deleteTask(task.id)}
      />
    </div>
  );
}

function EditGoalDialog({
  open,
  onOpenChange,
  initialName,
  initialPurpose,
  onSave,
}: {
  open: boolean;
  onOpenChange: (v: boolean) => void;
  initialName: string;
  initialPurpose: string;
  onSave: (name: string, purpose: string) => void;
}) {
  const [name, setName] = useState(initialName);
  const [purpose, setPurpose] = useState(initialPurpose);

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;
    onSave(name.trim(), purpose.trim());
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="border-border bg-surface text-foreground sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="font-display text-2xl tracking-tight">Edit Goal</DialogTitle>
          <DialogDescription className="text-muted-foreground">
            Refine the direction or its purpose.
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={submit} className="space-y-4">
          <Field label="Name">
            <input
              autoFocus
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full rounded-md border border-border bg-background px-3 py-2.5 text-[14px] text-foreground focus:border-understanding/60 focus:outline-none"
            />
          </Field>
          <Field label="Purpose (optional)">
            <input
              value={purpose}
              onChange={(e) => setPurpose(e.target.value)}
              className="w-full rounded-md border border-border bg-background px-3 py-2.5 text-[14px] text-foreground focus:border-understanding/60 focus:outline-none"
            />
          </Field>
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
              className="rounded-md bg-foreground px-4 py-2 text-[13px] font-medium text-background disabled:opacity-40"
            >
              Save
            </button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}

function EditTaskDialog({
  open,
  onOpenChange,
  initialName,
  onSave,
}: {
  open: boolean;
  onOpenChange: (v: boolean) => void;
  initialName: string;
  onSave: (name: string) => void;
}) {
  const [name, setName] = useState(initialName);

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;
    onSave(name.trim());
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="border-border bg-surface text-foreground sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="font-display text-2xl tracking-tight">Edit Task</DialogTitle>
          <DialogDescription className="text-muted-foreground">
            Rename this behavior.
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={submit} className="space-y-4">
          <Field label="Task">
            <input
              autoFocus
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full rounded-md border border-border bg-background px-3 py-2.5 text-[14px] text-foreground focus:border-understanding/60 focus:outline-none"
            />
          </Field>
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
              className="rounded-md bg-foreground px-4 py-2 text-[13px] font-medium text-background disabled:opacity-40"
            >
              Save
            </button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}

function ConfirmDialog({
  open,
  onOpenChange,
  title,
  description,
  confirmLabel,
  destructive,
  onConfirm,
}: {
  open: boolean;
  onOpenChange: (v: boolean) => void;
  title: string;
  description: string;
  confirmLabel: string;
  destructive?: boolean;
  onConfirm: () => void;
}) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="border-border bg-surface text-foreground sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="font-display text-xl tracking-tight">{title}</DialogTitle>
          <DialogDescription className="text-muted-foreground">{description}</DialogDescription>
        </DialogHeader>
        <DialogFooter className="gap-2 sm:gap-2">
          <button
            type="button"
            onClick={() => onOpenChange(false)}
            className="rounded-md border border-border bg-transparent px-4 py-2 text-[13px] text-muted-foreground hover:bg-surface-elevated"
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={() => {
              onConfirm();
              onOpenChange(false);
            }}
            className={
              destructive
                ? "rounded-md bg-failed px-4 py-2 text-[13px] font-medium text-background"
                : "rounded-md bg-foreground px-4 py-2 text-[13px] font-medium text-background"
            }
          >
            {confirmLabel}
          </button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className="space-y-1.5">
      <label className="text-[11px] uppercase tracking-[0.18em] text-tertiary">{label}</label>
      {children}
    </div>
  );
}
