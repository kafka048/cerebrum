import React, { useState } from "react";
import { TaskRead } from "@/types/task";
import { TaskLogRead, TaskStatus } from "@/types/tasklog";
import { cn } from "@/lib/utils";
import { Check, X, Minus, MessageSquare, Edit3 } from "lucide-react";

interface TaskLogRowProps {
  task: TaskRead;
  todayLog?: TaskLogRead;
  goalName?: string;
  onLog: (taskId: number, status: TaskStatus, reason?: string) => Promise<void>;
  isSubmitting?: boolean;
}

export function TaskLogRow({
  task,
  todayLog,
  goalName,
  onLog,
  isSubmitting = false,
}: TaskLogRowProps) {
  const [showNoteInput, setShowNoteInput] = useState(false);
  const [note, setNote] = useState(todayLog?.reason || "");
  const [loading, setLoading] = useState(false);

  const handleQuickLog = async (status: TaskStatus) => {
    setLoading(true);
    try {
      await onLog(task.task_id, status);
    } finally {
      setLoading(false);
    }
  };

  const handleSaveNote = async () => {
    if (!todayLog) return;
    setLoading(true);
    try {
      await onLog(task.task_id, todayLog.status, note.trim() || undefined);
      setShowNoteInput(false);
    } finally {
      setLoading(false);
    }
  };

  const statusBorder = todayLog
    ? todayLog.status === "completed"
      ? "border-l-status-done"
      : todayLog.status === "skipped"
        ? "border-l-status-skip"
        : "border-l-status-miss"
    : "border-l-transparent";

  return (
    <div
      className={cn(
        "group relative flex flex-col rounded-md border border-border-subtle bg-surface-base transition-all hover:border-border-default hover:bg-surface-raised border-l-4",
        statusBorder,
      )}
    >
      <div className="flex items-center justify-between p-4">
        {/* Task Details */}
        <div className="min-w-0 flex-1 pr-4">
          <div className="flex items-baseline gap-2">
            <h4
              className={cn(
                "text-[14.5px] font-medium tracking-tight transition-colors",
                todayLog?.status === "completed"
                  ? "text-text-primary"
                  : todayLog
                    ? "text-text-secondary"
                    : "text-text-primary",
              )}
            >
              {task.task_name}
            </h4>
            {goalName && <span className="text-[11px] text-text-muted">{goalName}</span>}
          </div>

          {todayLog?.reason && (
            <p className="mt-1 flex items-center gap-1.5 text-[12px] text-text-secondary italic">
              <MessageSquare className="h-3 w-3 text-text-muted shrink-0" />
              <span>"{todayLog.reason}"</span>
            </p>
          )}
        </div>

        {/* 1-Tap Frictionless Action Controls */}
        <div className="flex items-center gap-2">
          {todayLog ? (
            <div className="flex items-center gap-2">
              <span
                className={cn(
                  "inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-[12px] font-medium",
                  todayLog.status === "completed" &&
                    "bg-status-done/10 text-status-done border border-status-done/30",
                  todayLog.status === "skipped" &&
                    "bg-status-skip/10 text-status-skip border border-status-skip/30",
                  todayLog.status === "failed" &&
                    "bg-status-miss/10 text-status-miss border border-status-miss/30",
                )}
              >
                {todayLog.status === "completed" && <Check className="h-3.5 w-3.5" />}
                {todayLog.status === "skipped" && <Minus className="h-3.5 w-3.5" />}
                {todayLog.status === "failed" && <X className="h-3.5 w-3.5" />}
                <span className="capitalize">
                  {todayLog.status === "completed"
                    ? "Done"
                    : todayLog.status === "failed"
                      ? "Missed"
                      : "Skipped"}
                </span>
              </span>

              {/* Optional quiet note trigger */}
              <button
                type="button"
                onClick={() => {
                  setNote(todayLog.reason || "");
                  setShowNoteInput(!showNoteInput);
                }}
                title={todayLog.reason ? "Edit note" : "Add note"}
                className="grid h-7 w-7 place-items-center rounded border border-border-subtle bg-surface-base text-text-muted hover:border-border-default hover:text-text-secondary transition-colors"
              >
                <Edit3 className="h-3.5 w-3.5" />
              </button>
            </div>
          ) : (
            <div className="flex items-center gap-1.5">
              <button
                type="button"
                disabled={loading || isSubmitting}
                onClick={() => handleQuickLog("completed")}
                className="inline-flex items-center gap-1.5 rounded-md border border-border-subtle bg-surface-base px-3 py-1.5 text-[12.5px] font-medium text-text-secondary transition-all hover:border-status-done/40 hover:bg-status-done/10 hover:text-status-done active:scale-[0.98] disabled:opacity-50"
              >
                <Check className="h-3.5 w-3.5 text-status-done" />
                <span>Done</span>
              </button>

              <button
                type="button"
                disabled={loading || isSubmitting}
                onClick={() => handleQuickLog("skipped")}
                className="inline-flex items-center gap-1.5 rounded-md border border-border-subtle bg-surface-base px-3 py-1.5 text-[12.5px] font-medium text-text-secondary transition-all hover:border-status-skip/40 hover:bg-status-skip/10 hover:text-status-skip active:scale-[0.98] disabled:opacity-50"
              >
                <Minus className="h-3.5 w-3.5 text-status-skip" />
                <span>Skip</span>
              </button>

              <button
                type="button"
                disabled={loading || isSubmitting}
                onClick={() => handleQuickLog("failed")}
                className="inline-flex items-center gap-1.5 rounded-md border border-border-subtle bg-surface-base px-3 py-1.5 text-[12.5px] font-medium text-text-secondary transition-all hover:border-status-miss/40 hover:bg-status-miss/10 hover:text-status-miss active:scale-[0.98] disabled:opacity-50"
              >
                <X className="h-3.5 w-3.5 text-status-miss" />
                <span>Missed</span>
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Optional Note Expander */}
      {showNoteInput && (
        <div className="p-3.5 hairline-t bg-surface-raised space-y-2">
          <div className="flex items-center justify-between text-[12px]">
            <span className="text-text-muted">Add a quick note for context (optional):</span>
            <button
              onClick={() => setShowNoteInput(false)}
              className="text-text-muted hover:text-text-primary text-[11px]"
            >
              Cancel
            </button>
          </div>
          <div className="flex gap-2">
            <input
              type="text"
              value={note}
              onChange={(e) => setNote(e.target.value)}
              placeholder="e.g. Traveled today, took a rest day, low energy..."
              className="flex-1 rounded border border-border-default bg-surface-base px-3 py-1.5 text-[13px] text-text-primary placeholder:text-text-dim focus:border-border-focus focus:outline-none"
              onKeyDown={(e) => {
                if (e.key === "Enter") handleSaveNote();
              }}
            />
            <button
              onClick={handleSaveNote}
              disabled={loading}
              className="rounded bg-text-primary px-3.5 py-1.5 text-[12px] font-medium text-canvas transition-colors hover:bg-text-secondary"
            >
              Save Note
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
