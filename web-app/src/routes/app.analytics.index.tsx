import { createFileRoute, Link } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { getTasks } from "@/api/tasks";
import { getTasklogs } from "@/api/tasklogs";
import { getGoals } from "@/api/goals";
import { useMemo } from "react";
import { Sparkles, ArrowRight, Layers, Clock } from "lucide-react";

export const Route = createFileRoute("/app/analytics/")({
  head: () => ({
    meta: [
      { title: "Patterns & Insights — Cerebrum" },
      { name: "description", content: "Personal habit patterns and momentum overview." },
    ],
  }),
  component: AnalyticsDirectoryPage,
});

export function AnalyticsDirectoryPage() {
  const { data: tasks = [], isLoading: tasksLoading } = useQuery({
    queryKey: ["tasks"],
    queryFn: getTasks,
  });

  const { data: tasklogs = [], isLoading: logsLoading } = useQuery({
    queryKey: ["tasklogs"],
    queryFn: getTasklogs,
  });

  const { data: goals = [] } = useQuery({
    queryKey: ["goals"],
    queryFn: getGoals,
  });

  const goalsMap = useMemo(() => {
    const map = new Map<number, string>();
    for (const g of goals) map.set(g.goal_id, g.goal_name);
    return map;
  }, [goals]);

  // Count logs per task
  const taskLogCounts = useMemo(() => {
    const map = new Map<number, number>();
    for (const l of tasklogs) {
      map.set(l.task_id, (map.get(l.task_id) || 0) + 1);
    }
    return map;
  }, [tasklogs]);

  const isLoading = tasksLoading || logsLoading;

  return (
    <div className="mx-auto max-w-4xl space-y-8">
      {/* Header */}
      <div className="space-y-1 pb-6 hairline-b">
        <div className="flex items-center gap-2 text-[12px] font-medium text-accent-warm">
          <Sparkles className="h-4 w-4" />
          <span>Patterns & Behavioral Insights</span>
        </div>
        <h1 className="text-3xl font-semibold tracking-tight text-text-primary">Your Habits</h1>
        <p className="text-[13.5px] text-text-secondary max-w-2xl leading-relaxed">
          Select any habit to see your real rhythms, streaks, momentum changes, and personalized
          habit summaries.
        </p>
      </div>

      {isLoading ? (
        <div className="py-20 text-center text-[13px] text-text-muted">
          Loading your patterns...
        </div>
      ) : tasks.length === 0 ? (
        <div className="rounded-lg border border-dashed border-border-default bg-surface-base p-12 text-center space-y-4">
          <div className="mx-auto grid h-11 w-11 place-items-center rounded-full bg-surface-raised">
            <Layers className="h-5 w-5 text-accent-warm" />
          </div>
          <div className="space-y-1">
            <h3 className="text-[16px] font-medium text-text-primary">No habits created yet</h3>
            <p className="text-[13px] text-text-secondary max-w-md mx-auto">
              Set up your first daily habits on the Today page. After a few check-ins, your pattern
              summaries will start appearing here.
            </p>
          </div>
          <Link
            to="/app"
            className="inline-flex items-center gap-2 rounded-md bg-text-primary px-4 py-2 text-[13px] font-medium text-canvas hover:bg-text-secondary"
          >
            <span>Go to Today</span>
            <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {tasks.map((task) => {
            const count = taskLogCounts.get(task.task_id) || 0;
            const isReady = count >= 7;
            const progress = Math.min(100, Math.round((count / 7) * 100));

            return (
              <Link
                key={task.task_id}
                to="/app/analytics/$taskId"
                params={{ taskId: task.task_id.toString() }}
                className="group flex flex-col justify-between rounded-md border border-border-subtle bg-surface-base p-5 transition-all hover:border-border-default hover:bg-surface-raised"
              >
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-[11px] text-text-muted">
                      {goalsMap.get(task.goal_id) || "Habit"}
                    </span>
                    <span
                      className={`rounded-full px-2.5 py-0.5 text-[11px] font-medium ${
                        isReady
                          ? "bg-status-done/10 text-status-done border border-status-done/30"
                          : "bg-surface-raised text-text-muted border border-border-subtle flex items-center gap-1"
                      }`}
                    >
                      {isReady ? (
                        "Pattern Unlocked"
                      ) : (
                        <>
                          <Clock className="h-3 w-3" />
                          <span>Day {count} of 7</span>
                        </>
                      )}
                    </span>
                  </div>

                  <h3 className="text-[15px] font-medium tracking-tight text-text-primary group-hover:text-accent-warm transition-colors">
                    {task.task_name}
                  </h3>
                </div>

                <div className="pt-4 mt-4 hairline-t space-y-2">
                  <div className="flex items-center justify-between text-[12px]">
                    <span className="text-text-muted">
                      {isReady ? "Mature pattern" : "Learning rhythm"}
                    </span>
                    <span className="text-text-secondary font-mono text-[11px]">
                      {count} check-in{count === 1 ? "" : "s"}
                    </span>
                  </div>
                  <div className="h-1.5 w-full overflow-hidden rounded-full bg-surface-raised">
                    <div
                      className={`h-full transition-all duration-300 ${
                        isReady ? "bg-status-done" : "bg-accent-warm"
                      }`}
                      style={{ width: `${progress}%` }}
                    />
                  </div>
                </div>
              </Link>
            );
          })}
        </div>
      )}
    </div>
  );
}
