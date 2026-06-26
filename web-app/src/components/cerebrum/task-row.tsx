import { useState } from "react";
import { Check, X, MinusCircle } from "lucide-react";
import { cn } from "@/lib/utils";
import { reasonOptions, type Task, type TaskStatus } from "@/lib/cerebrum-data";
import { useCerebrumState } from "@/lib/cerebrum-state";

type LoggedState = { status: TaskStatus; reason?: string };
type ReasonStatus = "skipped" | "failed";

export function TaskRow({ task }: { task: Task }) {
  const { logTask } = useCerebrumState();
  const [state, setState] = useState<LoggedState>({ status: task.status });
  const [pendingReason, setPendingReason] = useState<ReasonStatus | null>(null);
  const [picked, setPicked] = useState<string | null>(null);
  const [other, setOther] = useState("");

  const completed = state.status === "completed";

  const log = (status: TaskStatus) => {
    if (status === "skipped" || status === "failed") {
      setPendingReason(status);
      setPicked(null);
      setOther("");
      // Don't write the log until reason is saved. Reflect the pending status visually.
      setState({ status });
      return;
    }
    setPendingReason(null);
    setState({ status });
    logTask({ taskId: task.id, status });
  };

  const save = () => {
    if (!pendingReason) return;
    const reason =
      picked === "Other"
        ? (other.trim() || "Other")
        : picked ?? undefined;
    logTask({ taskId: task.id, status: pendingReason, reason });
    setState({ status: pendingReason, reason });
    setPendingReason(null);
  };

  return (
    <div
      className={cn(
        "group rounded-md border border-border/70 bg-surface transition-colors",
        state.status !== "pending" && !pendingReason && "bg-surface/60",
      )}
    >
      <div className="grid grid-cols-[minmax(0,1fr)_auto] items-center gap-4 px-4 py-3.5">
        <div className="flex min-w-0 items-center gap-3">
          <StatusDot status={state.status} />
          <div className="min-w-0">
            <p
              className={cn(
                "truncate text-[14px] text-foreground",
                completed && "text-muted-foreground line-through decoration-tertiary/60",
              )}
            >
              {task.name}
            </p>
            {state.reason && !pendingReason && (
              <p className="mt-0.5 text-[11px] text-tertiary">Reason: {state.reason}</p>
            )}
          </div>
        </div>

        <div className="flex shrink-0 items-center gap-1">
          <LogButton
            label="Completed"
            active={state.status === "completed"}
            tone="completed"
            icon={<Check className="h-3 w-3" strokeWidth={2.5} />}
            onClick={() => log("completed")}
          />
          <LogButton
            label="Skipped"
            active={state.status === "skipped"}
            tone="skipped"
            icon={<MinusCircle className="h-3 w-3" strokeWidth={2} />}
            onClick={() => log("skipped")}
          />
          <LogButton
            label="Failed"
            active={state.status === "failed"}
            tone="failed"
            icon={<X className="h-3 w-3" strokeWidth={2.5} />}
            onClick={() => log("failed")}
          />
        </div>
      </div>

      {pendingReason && (
        <div className="space-y-3 border-t border-border/70 px-4 py-3">
          <div className="flex flex-wrap items-center gap-1.5">
            <span className="mr-1 text-[11px] uppercase tracking-[0.15em] text-tertiary">
              Why?
            </span>
            {reasonOptions.map((r) => {
              const active = picked === r;
              return (
                <button
                  key={r}
                  onClick={() => setPicked(r)}
                  className={cn(
                    "rounded-full border px-2.5 py-1 text-[11px] transition-colors",
                    active
                      ? "border-understanding/60 bg-understanding/15 text-foreground"
                      : "border-border bg-surface-elevated text-muted-foreground hover:border-understanding/40 hover:text-foreground",
                  )}
                >
                  {r}
                </button>
              );
            })}
          </div>
          {picked === "Other" && (
            <textarea
              value={other}
              onChange={(e) => setOther(e.target.value)}
              placeholder="Anything you'd like to note?"
              rows={2}
              className="w-full resize-none rounded-md border border-border bg-background px-3 py-2 text-[13px] text-foreground placeholder:text-tertiary focus:border-understanding/60 focus:outline-none"
            />
          )}
          <div className="flex items-center justify-end gap-2">
            <button
              onClick={() => {
                setPendingReason(null);
                setState({ status: "pending" });
              }}
              className="rounded-md px-3 py-1.5 text-[11.5px] text-tertiary hover:text-foreground"
            >
              Cancel
            </button>
            <button
              onClick={save}
              disabled={!picked}
              className="rounded-md bg-foreground px-3 py-1.5 text-[11.5px] font-medium text-background transition-opacity disabled:opacity-40"
            >
              Save
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

function StatusDot({ status }: { status: TaskStatus }) {
  const map: Record<TaskStatus, string> = {
    pending: "bg-border",
    completed: "bg-completed",
    skipped: "bg-skipped",
    failed: "bg-failed",
  };
  return <span className={cn("h-1.5 w-1.5 shrink-0 rounded-full", map[status])} />;
}

function LogButton({
  label,
  active,
  tone,
  icon,
  onClick,
}: {
  label: string;
  active: boolean;
  tone: "completed" | "skipped" | "failed";
  icon: React.ReactNode;
  onClick: () => void;
}) {
  const activeMap = {
    completed: "border-completed/60 bg-completed/15 text-foreground",
    skipped: "border-skipped/60 bg-skipped/15 text-foreground",
    failed: "border-failed/60 bg-failed/15 text-foreground",
  } as const;
  return (
    <button
      onClick={onClick}
      className={cn(
        "inline-flex items-center gap-1.5 rounded-md border px-2.5 py-1.5 text-[11px] transition-colors",
        active
          ? activeMap[tone]
          : "border-transparent text-tertiary hover:border-border hover:bg-surface-elevated hover:text-muted-foreground",
      )}
    >
      {icon}
      <span>{label}</span>
    </button>
  );
}
