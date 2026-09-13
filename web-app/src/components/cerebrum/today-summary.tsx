import { useMemo } from "react";

import { useCerebrumState } from "@/lib/cerebrum-state";
import { Panel, StatusLabel } from "./primitives";
import { getTodayDate } from "@/lib/today's-date";

export function TodaySummary() {
  const { tasks, taskLogs } = useCerebrumState();

  const summary = useMemo(() => {
    const today = getTodayDate();

    const taskIds = new Set(tasks.map((task) => task.task_id));

    let completed = 0;
    let failed = 0;
    let skipped = 0;

    const loggedToday = new Set<number>();

    for (const log of taskLogs) {
      if (log.log_date !== today) continue;
      if (!taskIds.has(log.task_id)) continue;

      // Ignore duplicate logs for the same task on the same day.
      if (loggedToday.has(log.task_id)) continue;

      loggedToday.add(log.task_id);

      switch (log.status) {
        case "completed":
          completed++;
          break;

        case "failed":
          failed++;
          break;

        case "skipped":
          skipped++;
          break;
      }
    }

    const total = tasks.length;
    const recorded = completed + failed + skipped;
    const pending = Math.max(0, total - recorded);

    return {
      total,
      recorded,
      pending,
      completed,
      failed,
      skipped,
    };
  }, [tasks, taskLogs]);

  const percentage = (count: number) => (summary.total === 0 ? 0 : (count / summary.total) * 100);

  return (
    <Panel className="lg:sticky lg:top-8">
      <div className="px-6 pt-6 pb-5">
        <p className="text-[10.5px] uppercase tracking-[0.22em] font-medium text-tertiary">
          Today's Progress
        </p>

        <div className="mt-5 flex items-baseline gap-2">
          <span className="font-display text-[44px] leading-none tabular-nums tracking-tight text-foreground">
            {summary.recorded}
          </span>

          <span className="font-display text-[22px] tabular-nums text-tertiary">
            / {summary.total}
          </span>
        </div>

        <p className="mt-1.5 text-[11px] uppercase tracking-[0.22em] text-tertiary">Recorded</p>

        <div
          className="mt-6 flex h-[4px] w-full overflow-hidden rounded-full bg-border/50"
          role="progressbar"
          aria-label="Today's task progress"
          aria-valuemin={0}
          aria-valuemax={summary.total}
          aria-valuenow={summary.recorded}
        >
          {summary.completed > 0 && (
            <span
              className="bg-status-completed h-full"
              style={{ width: `${percentage(summary.completed)}%` }}
            />
          )}

          {summary.skipped > 0 && (
            <span
              className="bg-status-skipped h-full"
              style={{ width: `${percentage(summary.skipped)}%` }}
            />
          )}

          {summary.failed > 0 && (
            <span
              className="bg-status-failed h-full"
              style={{ width: `${percentage(summary.failed)}%` }}
            />
          )}
        </div>
      </div>

      <div className="divide-hairline px-6 pb-5">
        <SummaryRow label={<StatusLabel tone="completed" />} value={summary.completed} />

        <SummaryRow label={<StatusLabel tone="skipped" />} value={summary.skipped} />

        <SummaryRow label={<StatusLabel tone="failed" />} value={summary.failed} />

        <SummaryRow
          label={
            <span className="inline-flex items-center gap-2.5 text-[11px] uppercase tracking-[0.22em] text-tertiary">
              <span
                aria-hidden
                className="h-[7px] w-[7px] rounded-full border border-tertiary/60"
              />
              Pending
            </span>
          }
          value={summary.pending}
        />
      </div>
    </Panel>
  );
}

function SummaryRow({ label, value }: { label: React.ReactNode; value: number }) {
  return (
    <div className="flex items-center justify-between py-3">
      <span>{label}</span>

      <span className="font-display text-[15px] tabular-nums text-foreground">{value}</span>
    </div>
  );
}
