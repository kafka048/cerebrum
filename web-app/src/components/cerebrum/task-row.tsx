import { useState } from "react";
import { cn } from "@/lib/utils";

import { useCerebrumState } from "@/lib/cerebrum-state";

import { TaskLogCreate, TaskLogRead, TaskStatus } from "@/types/tasklog";
import { TaskRead } from "@/types/task";

import { StatusChip, StatusIconButton, type StatusTone } from "./primitives";

interface TaskExecution {
  task: TaskRead;
  tasklog: TaskLogRead | null;
}

type FailureStatus = "skipped" | "failed";
type DisplayStatus = TaskStatus | "pending";

const reasonOptions = [
  "Too Busy",
  "Forgot",
  "Low Energy",
  "Unexpected Commitment",
  "Other",
] as const;

function getTodayDate(): string {
  const now = new Date();

  const year = now.getFullYear();
  const month = String(now.getMonth() + 1).padStart(2, "0");
  const day = String(now.getDate()).padStart(2, "0");

  return `${year}-${month}-${day}`;
}

export function TaskExecutionRow({ task }: { task: TaskExecution }) {
  const { logTask } = useCerebrumState();

  const taskId = task.task.task_id;
  const taskName = task.task.task_name;

  const status: DisplayStatus = task.tasklog?.status ?? "pending";

  const reason = task.tasklog?.reason ?? null;

  const [selectedStatus, setSelectedStatus] = useState<FailureStatus | null>(null);

  const [pickedReason, setPickedReason] = useState<string | null>(null);

  const [customReason, setCustomReason] = useState("");

  const [confirmEmptyReason, setConfirmEmptyReason] = useState(false);

  const [error, setError] = useState("");

  async function createTasklog(status: TaskStatus, reason: string | null) {
    setError("");

    const payload: TaskLogCreate = {
      task_id: taskId,
      log_date: getTodayDate(),
      status,
      reason,
    };

    try {
      await logTask(payload);

      setSelectedStatus(null);
      setPickedReason(null);
      setCustomReason("");
      setConfirmEmptyReason(false);
    } catch (err) {
      if (err instanceof Error) {
        setError(err.message);
      } else {
        setError("Something went wrong while recording the task.");
      }
    }
  }

  async function handleCompleted() {
    await createTasklog("completed", null);
  }

  function handleFailure(status: FailureStatus) {
    setSelectedStatus(status);
    setPickedReason(null);
    setCustomReason("");
    setConfirmEmptyReason(false);
    setError("");
  }

  async function handleSave() {
    if (!selectedStatus) return;

    if (pickedReason === "Other" && customReason.trim() === "") {
      setConfirmEmptyReason(true);
      return;
    }

    const reason = pickedReason === "Other" ? customReason.trim() : (pickedReason ?? null);

    await createTasklog(selectedStatus, reason);
  }

  async function handleSaveWithoutReason() {
    if (!selectedStatus) return;

    await createTasklog(selectedStatus, null);
  }

  // ----------------------------
  // Already recorded
  // ----------------------------

  if (status !== "pending") {
    const tone = status as StatusTone;

    return (
      <div
        role="group"
        aria-label={`${taskName} — ${status}`}
        className="group relative grid grid-cols-[minmax(0,1fr)_auto] items-center gap-8 py-5 pl-5 pr-2 transition-colors"
      >
        <span
          aria-hidden
          className={cn(
            "absolute left-0 top-4 bottom-4 w-[2px] rounded-full",
            tone === "completed" && "bg-status-completed/70",
            tone === "skipped" && "bg-status-skipped/60",
            tone === "failed" && "bg-status-failed/70",
          )}
        />

        <div className="min-w-0">
          <p
            className={cn(
              "truncate text-[15px]",
              tone === "completed"
                ? "text-foreground"
                : tone === "skipped"
                  ? "text-muted-foreground"
                  : "text-foreground/85",
            )}
          >
            {taskName}
          </p>

          {reason && (
            <p className="mt-1.5 text-[12.5px] text-tertiary">
              <span className="uppercase tracking-[0.2em]">Reason</span>

              <span className="mx-2 text-tertiary/40">·</span>

              <span className="italic text-muted-foreground">{reason}</span>
            </p>
          )}

          {error && <p className="mt-2 text-[12px] text-failed">{error}</p>}
        </div>

        <div className="flex items-center gap-4">
          <StatusChip tone={tone} />

          {/* TODO: undo support later */}
        </div>

        <span className="sr-only" aria-live="polite">
          {taskName} marked {status}
        </span>
      </div>
    );
  }

  // ----------------------------
  // Pending
  // ----------------------------

  return (
    <div className="py-4 pl-5 pr-2">
      <div className="grid grid-cols-[minmax(0,1fr)_auto] items-center gap-8">
        <p className="truncate text-[15px] text-foreground">{taskName}</p>

        <div className="flex shrink-0 items-center gap-2">
          <StatusIconButton tone="completed" onClick={handleCompleted} ariaLabel="Mark completed" />

          <StatusIconButton
            tone="skipped"
            onClick={() => handleFailure("skipped")}
            ariaLabel="Mark skipped"
          />

          <StatusIconButton
            tone="failed"
            onClick={() => handleFailure("failed")}
            ariaLabel="Mark failed"
          />
        </div>
      </div>

      {selectedStatus && (
        <div
          className={cn(
            "mt-5 ml-1 space-y-4 border-l pl-5",
            selectedStatus === "skipped" ? "border-status-skipped/50" : "border-status-failed/60",
          )}
        >
          <p className="text-[10.5px] uppercase tracking-[0.22em] text-tertiary">Why?</p>

          <div className="flex flex-wrap gap-2" role="radiogroup">
            {reasonOptions.map((option) => {
              const active = pickedReason === option;

              return (
                <button
                  key={option}
                  role="radio"
                  aria-checked={active}
                  onClick={() => setPickedReason(option)}
                  className={cn(
                    "rounded-full border px-3 py-1.5 text-[12px] transition-colors",
                    active
                      ? "border-ember/60 bg-ember/10 text-foreground"
                      : "border-border/60 text-muted-foreground hover:border-border hover:text-foreground",
                  )}
                >
                  {option}
                </button>
              );
            })}
          </div>

          {pickedReason === "Other" && (
            <textarea
              rows={2}
              value={customReason}
              onChange={(e) => setCustomReason(e.target.value)}
              placeholder="Anything you'd like to note?"
              className="w-full max-w-lg resize-none rounded-md border border-border/60 bg-surface-elevated/50 px-3 py-2 text-[13px] text-foreground placeholder:text-tertiary focus:border-ember focus:outline-none"
            />
          )}
          {confirmEmptyReason ? (
            <div className="rounded-md border border-border/60 bg-surface-elevated/50 p-4">
              <p className="text-[13px] text-foreground">
                You selected <strong>Other</strong> but didn't enter a reason.
              </p>

              <p className="mt-1 text-[12px] text-tertiary">Save the task log without a reason?</p>

              <div className="mt-4 flex justify-end gap-3">
                <button
                  onClick={() => setConfirmEmptyReason(false)}
                  className="rounded text-[11px] uppercase tracking-[0.2em] text-tertiary transition-colors hover:text-foreground"
                >
                  Go Back
                </button>

                <button
                  onClick={handleSaveWithoutReason}
                  className="rounded-md bg-ember px-3.5 py-1.5 text-[11px] font-medium uppercase tracking-[0.2em] text-primary-foreground transition-opacity hover:opacity-90"
                >
                  Save
                </button>
              </div>
            </div>
          ) : (
            <div className="flex items-center gap-5 pt-1">
              <button
                onClick={handleSave}
                disabled={!pickedReason}
                className="rounded-md bg-ember px-3.5 py-1.5 text-[11px] font-medium uppercase tracking-[0.22em] text-primary-foreground transition-opacity disabled:cursor-not-allowed disabled:opacity-30"
              >
                Record
              </button>

              <button
                onClick={() => {
                  setSelectedStatus(null);
                  setPickedReason(null);
                  setCustomReason("");
                  setConfirmEmptyReason(false);
                  setError("");
                }}
                className="text-[10.5px] uppercase tracking-[0.22em] text-tertiary transition-colors hover:text-foreground"
              >
                Cancel
              </button>
            </div>
          )}

          {error && <p className="text-[12px] text-failed">{error}</p>}
        </div>
      )}
    </div>
  );
}
