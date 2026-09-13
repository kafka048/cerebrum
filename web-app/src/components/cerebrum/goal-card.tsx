import { useEffect, useState } from "react";
import { Link } from "@tanstack/react-router";
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
import { cn } from "@/lib/utils";
import { CreateTaskDialog } from "./onboarding/dialogs";
import { Panel, PanelHeader } from "./primitives";
import { GoalRead, GoalUpdate } from "@/types/goal";
import { TaskCreate, TaskRead, TaskUpdate } from "@/types/task";

interface GoalCardView {
  goal: GoalRead;
  tasks: TaskRead[];
}

export function GoalCard({ goal, tasks }: GoalCardView) {
  const { updateGoal, removeGoal, createTask, updateTask, removeTask } = useCerebrumState();

  const goalId = goal.goal_id;
  const goalName = goal.goal_name;
  const description = goal.description;
  const priority = goal.priority;
  const startDate = goal.start_date;
  const endDate = goal.end_date;
  const status = goal.status;

  const priorityLabel = (() => {
    switch (priority) {
      case 1:
        return "Low";
      case 2:
        return "Medium";
      case 3:
        return "High";
      default:
        return "Unknown";
    }
  })();

  const [isEditGoalOpen, setIsEditGoalOpen] = useState(false);
  const [isDeleteGoalOpen, setIsDeleteGoalOpen] = useState(false);
  const [isCreateTaskOpen, setIsCreateTaskOpen] = useState(false);

  const [editingTask, setEditingTask] = useState<TaskRead | null>(null);
  const [deletingTask, setDeletingTask] = useState<TaskRead | null>(null);

  const [error, setError] = useState("");

  function formatDate(date: string | undefined) {
    if (!date) return "";

    return new Date(date).toLocaleDateString("en-IN", {
      day: "numeric",
      month: "short",
      year: "numeric",
    });
  }

  async function handleGoalDelete() {
    setError("");

    try {
      await removeGoal(goalId);
      setIsDeleteGoalOpen(false);
    } catch (error) {
      if (error instanceof Error) {
        setError(error.message);
      } else {
        setError("Something went wrong while deleting the goal.");
      }
    }
  }

  async function handleGoalUpdate(goal: GoalUpdate) {
    setError("");

    try {
      await updateGoal(goalId, goal);
      setIsEditGoalOpen(false);
    } catch (error) {
      if (error instanceof Error) {
        setError(error.message);
      } else {
        setError("Something went wrong while updating the goal.");
      }
    }
  }

  async function handleTaskCreate(task: TaskCreate) {
    setError("");

    try {
      await createTask(task);
      setIsCreateTaskOpen(false);
    } catch (error) {
      if (error instanceof Error) {
        setError(error.message);
      } else {
        setError("Something went wrong while creating the task.");
      }
    }
  }

  async function handleTaskUpdate(taskId: number, task: TaskUpdate) {
    setError("");

    try {
      await updateTask(taskId, task);
      setEditingTask(null);
    } catch (error) {
      if (error instanceof Error) {
        setError(error.message);
      } else {
        setError("Something went wrong while updating the task.");
      }
    }
  }

  async function handleTaskDelete(taskId: number) {
    setError("");

    try {
      await removeTask(taskId);
      setDeletingTask(null);
    } catch (error) {
      if (error instanceof Error) {
        setError(error.message);
      } else {
        setError("Something went wrong while deleting the task.");
      }
    }
  }

  return (
    <Panel>
      <PanelHeader
        density="compact"
        title={
          <div>
            <GoalTitleRow goalName={goalName} status={status} />
            <GoalMeta
              description={description}
              priorityLabel={priorityLabel}
              startDate={formatDate(startDate)}
              endDate={endDate ? formatDate(endDate) : undefined}
            />
          </div>
        }
        right={
          <div className="flex items-center gap-2">
            <button
              onClick={() => setIsCreateTaskOpen(true)}
              className="inline-flex items-center gap-1.5 rounded-md border border-ember/50 bg-ember/[0.06] px-3 py-1.5 text-[11px] font-medium uppercase tracking-[0.22em] text-ember transition-colors hover:bg-ember/15 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ember/40 focus-visible:ring-offset-2 focus-visible:ring-offset-background"
            >
              + Task
            </button>
            <DropdownMenu>
              <DropdownMenuTrigger
                aria-label="Goal options"
                className="inline-flex items-center gap-1.5 rounded-md border border-ember/50 bg-ember/[0.06] px-3 py-1.5 text-[11px] font-medium uppercase tracking-[0.22em] text-ember transition-colors hover:bg-ember/15 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ember/40 focus-visible:ring-offset-2 focus-visible:ring-offset-background"
              >
                More
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="min-w-[160px] border-border bg-surface">
                <DropdownMenuItem onSelect={() => setIsEditGoalOpen(true)}>
                  Edit Goal
                </DropdownMenuItem>
                <DropdownMenuItem
                  onSelect={() => setIsDeleteGoalOpen(true)}
                  className="text-status-failed focus:text-status-failed"
                >
                  Delete Goal
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        }
      />

      {error && <p className="px-6 pb-2 text-[12px] text-status-failed">{error}</p>}

      {tasks.length === 0 ? (
        <p className="px-6 pb-5 text-[13px] italic text-tertiary">
          No tasks yet — add the behaviors that support this goal.
        </p>
      ) : (
        <div className="divide-hairline px-3 pb-2">
          {tasks.map((task) => (
            <TaskRowItem
              key={task.task_id}
              task={task}
              onEdit={() => setEditingTask(task)}
              onDelete={() => setDeletingTask(task)}
            />
          ))}
        </div>
      )}

      <CreateTaskDialog
        open={isCreateTaskOpen}
        onOpenChange={setIsCreateTaskOpen}
        goalId={goalId}
        goalName={goalName}
        onSave={handleTaskCreate}
      />

      <EditGoalDialog
        open={isEditGoalOpen}
        onOpenChange={setIsEditGoalOpen}
        initialName={goalName}
        initialDescription={description}
        onSave={handleGoalUpdate}
      />

      <ConfirmDialog
        open={isDeleteGoalOpen}
        onOpenChange={setIsDeleteGoalOpen}
        title="Delete this goal?"
        description={`"${goalName}" and all of its tasks will be permanently removed.`}
        confirmLabel="Delete Goal"
        onConfirm={handleGoalDelete}
      />

      <EditTaskDialog
        open={editingTask !== null}
        onOpenChange={(open) => {
          if (!open) setEditingTask(null);
        }}
        initialName={editingTask?.task_name ?? ""}
        onSave={(taskUpdate) => {
          if (editingTask) {
            handleTaskUpdate(editingTask.task_id, taskUpdate);
          }
        }}
      />

      <ConfirmDialog
        open={deletingTask !== null}
        onOpenChange={(open) => {
          if (!open) setDeletingTask(null);
        }}
        title="Delete this task?"
        description={`"${deletingTask?.task_name}" will be permanently removed.`}
        confirmLabel="Delete Task"
        onConfirm={() => {
          if (deletingTask) {
            handleTaskDelete(deletingTask.task_id);
          }
        }}
      />
    </Panel>
  );
}

/* -------------------------------------------------------------------------- */
/*  GoalTitleRow — goal name with status badge inline, no dot indicator       */
/* -------------------------------------------------------------------------- */

function GoalTitleRow({ goalName, status }: { goalName: string; status?: string }) {
  const statusTone =
    status === "Active"
      ? "text-[oklch(0.68_0.09_150)] border-[oklch(0.68_0.09_150)]/30 bg-[oklch(0.68_0.09_150)]/[0.06]"
      : status === "Completed"
        ? "text-status-completed border-status-completed/30 bg-status-completed/[0.06]"
        : status === "Abandoned"
          ? "text-status-failed border-status-failed/30 bg-status-failed/[0.06]"
          : "text-tertiary border-border bg-surface-elevated/50";

  return (
    <div className="flex flex-wrap items-baseline gap-3">
      <h2 className="font-display text-[22px] leading-[1.1] tracking-tight text-foreground">
        {goalName}
      </h2>
      {status && (
        <span
          className={cn(
            "inline-flex items-center rounded-full border px-2 py-0.5 text-[9.5px] font-medium uppercase tracking-[0.1em]",
            statusTone,
          )}
        >
          {status}
        </span>
      )}
    </div>
  );
}

/* -------------------------------------------------------------------------- */
/*  GoalMeta — description, priority badge, date range                       */
/* -------------------------------------------------------------------------- */

function GoalMeta({
  description,
  priorityLabel,
  startDate,
  endDate,
}: {
  description?: string;
  priorityLabel: string;
  startDate?: string;
  endDate?: string;
}) {
  const priorityTone =
    priorityLabel === "High"
      ? "text-[oklch(0.52_0.16_25)] border-[oklch(0.52_0.16_25)]/40 bg-[oklch(0.52_0.16_25)]/[0.08]"
      : priorityLabel === "Medium"
        ? "text-ember border-ember/35 bg-ember/[0.06]"
        : "text-tertiary border-border bg-surface-elevated/50";

  return (
    <div className="mt-2.5 space-y-2">
      {description?.trim() && (
        <p className="text-[12.5px] leading-relaxed text-muted-foreground/90">{description}</p>
      )}

      <div className="flex flex-wrap items-center gap-2.5">
        <span
          className={cn(
            "inline-flex items-center rounded-full border px-2.5 py-0.5 text-[10px] font-medium uppercase tracking-[0.1em]",
            priorityTone,
          )}
        >
          {priorityLabel} Priority
        </span>

        {startDate && (
          <span className="inline-flex items-center gap-1 text-[11px] text-tertiary">
            <CalendarGlyph />
            {startDate}
            {endDate && <span className="text-tertiary/60">→ {endDate}</span>}
          </span>
        )}
      </div>
    </div>
  );
}

function CalendarGlyph() {
  return (
    <svg
      width="11"
      height="11"
      viewBox="0 0 16 16"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden
      className="shrink-0 opacity-60"
    >
      <rect x="2" y="3.5" width="12" height="10.5" rx="1.5" />
      <path d="M2 6.5h12M5.5 2v3M10.5 2v3" />
    </svg>
  );
}

function TaskRowItem({
  task,
  onEdit,
  onDelete,
}: {
  task: TaskRead;
  onEdit: () => void;
  onDelete: () => void;
}) {
  return (
    <div className="group grid grid-cols-[minmax(0,1fr)_auto] items-center gap-8 py-3 pl-4 pr-2">
      <p className="min-w-0 truncate text-[15px] text-foreground">{task.task_name}</p>
      <div className="flex items-center gap-1 text-[11px] uppercase tracking-[0.22em] text-tertiary">
        <Link
          to="/app/analytics/$taskId"
          params={{ taskId: String(task.task_id) }}
          className="rounded-md px-3 py-1.5 text-ember/80 transition-colors hover:bg-ember/10 hover:text-ember focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ember/40 focus-visible:ring-offset-2 focus-visible:ring-offset-background"
        >
          Intelligence →
        </Link>
        <div className="flex items-center gap-1 opacity-0 transition-opacity group-hover:opacity-100 focus-within:opacity-100">
          <button
            onClick={onEdit}
            className="rounded-md px-3 py-1.5 transition-colors hover:bg-surface-elevated hover:text-foreground focus-visible:opacity-100 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ember/40 focus-visible:ring-offset-2 focus-visible:ring-offset-background"
          >
            Edit
          </button>
          <button
            onClick={onDelete}
            className="rounded-md px-3 py-1.5 transition-colors hover:bg-status-failed/10 hover:text-status-failed focus-visible:opacity-100 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-status-failed/40 focus-visible:ring-offset-2 focus-visible:ring-offset-background"
          >
            Delete
          </button>
        </div>
      </div>
    </div>
  );
}

function EditGoalDialog({
  open,
  onOpenChange,
  initialName,
  initialDescription,
  onSave,
}: {
  open: boolean;
  onOpenChange: (v: boolean) => void;
  initialName: string;
  initialDescription: string | undefined;
  onSave: (goal: GoalUpdate) => void;
}) {
  const [name, setName] = useState(initialName);
  const [description, setDescription] = useState(initialDescription ?? "");

  useEffect(() => {
    if (open) {
      setName(initialName);
      setDescription(initialDescription ?? "");
    }
  }, [open, initialName, initialDescription]);

  const submit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!name.trim()) return;

    const goalUpdate: GoalUpdate = {};

    if (name.trim() !== initialName) {
      goalUpdate.goal_name = name.trim();
    }

    if (description.trim() !== (initialDescription ?? "")) {
      goalUpdate.description = description.trim();
    }

    onSave(goalUpdate);
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
        <form onSubmit={submit} className="space-y-5">
          <Field label="Name">
            <input
              autoFocus
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full rounded-md border border-border bg-surface-elevated/50 px-3 py-2 text-[14.5px] text-foreground focus:border-ember focus:outline-none focus:ring-2 focus:ring-ember/25"
            />
          </Field>
          <Field label="Purpose (optional)">
            <input
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="w-full rounded-md border border-border bg-surface-elevated/50 px-3 py-2 text-[14.5px] text-foreground focus:border-ember focus:outline-none focus:ring-2 focus:ring-ember/25"
            />
          </Field>
          <DialogFooter className="gap-3 sm:gap-3">
            <button
              type="button"
              onClick={() => onOpenChange(false)}
              className="rounded-md px-3 py-1.5 text-[11px] uppercase tracking-[0.22em] text-tertiary hover:text-foreground"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={!name.trim()}
              className="rounded-md bg-ember px-3.5 py-1.5 text-[11px] font-medium uppercase tracking-[0.22em] text-[var(--color-primary-foreground)] disabled:opacity-30"
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
  onSave: (task: TaskUpdate) => void;
}) {
  const [name, setName] = useState(initialName);

  useEffect(() => {
    if (open) {
      setName(initialName);
    }
  }, [open, initialName]);

  const submit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!name.trim()) return;

    const taskUpdate: TaskUpdate = {};

    if (name.trim() !== initialName) {
      taskUpdate.task_name = name.trim();
    }

    onSave(taskUpdate);
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
        <form onSubmit={submit} className="space-y-5">
          <Field label="Task">
            <input
              autoFocus
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full rounded-md border border-border bg-surface-elevated/50 px-3 py-2 text-[14.5px] text-foreground focus:border-ember focus:outline-none focus:ring-2 focus:ring-ember/25"
            />
          </Field>
          <DialogFooter className="gap-3 sm:gap-3">
            <button
              type="button"
              onClick={() => onOpenChange(false)}
              className="rounded-md px-3 py-1.5 text-[11px] uppercase tracking-[0.22em] text-tertiary hover:text-foreground"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={!name.trim()}
              className="rounded-md bg-ember px-3.5 py-1.5 text-[11px] font-medium uppercase tracking-[0.22em] text-[var(--color-primary-foreground)] disabled:opacity-30"
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
  onConfirm,
}: {
  open: boolean;
  onOpenChange: (v: boolean) => void;
  title: string;
  description: string;
  confirmLabel: string;
  onConfirm: () => void;
}) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="border-border bg-surface text-foreground sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="font-display text-xl tracking-tight">{title}</DialogTitle>
          <DialogDescription className="text-muted-foreground">{description}</DialogDescription>
        </DialogHeader>
        <DialogFooter className="gap-3 sm:gap-3">
          <button
            type="button"
            onClick={() => onOpenChange(false)}
            className="rounded-md px-3 py-1.5 text-[11px] uppercase tracking-[0.22em] text-tertiary hover:text-foreground"
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={() => {
              onConfirm();
              onOpenChange(false);
            }}
            className="rounded-md border border-status-failed/60 bg-status-failed/10 px-3.5 py-1.5 text-[11px] font-medium uppercase tracking-[0.22em] text-status-failed hover:bg-status-failed/20"
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
    <div className="space-y-2">
      <label className="text-[10.5px] uppercase tracking-[0.22em] text-tertiary">{label}</label>
      {children}
    </div>
  );
}
