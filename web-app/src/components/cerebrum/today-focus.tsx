import { useCerebrumState } from "@/lib/cerebrum-state";
import { TaskExecutionRow } from "./task-row";
import { Panel, PanelHeader } from "./primitives";
import { getTodayDate } from "@/lib/today's-date";

export function TodayFocus() {
  const { goals, tasks, taskLogs } = useCerebrumState();

  return (
    <div className="space-y-8">
      {goals.map((goal) => {
        const goalTasks = tasks.filter((task) => task.goal_id === goal.goal_id);

        return (
          <Panel key={goal.goal_id}>
            <PanelHeader
              density="compact"
              eyebrow={goal.description || "Goal"}
              title={goal.goal_name}
            />

            <div className="divide-hairline px-3 pb-2">
              {goalTasks.length > 0 ? (
                goalTasks.map((task) => {
                  const today = getTodayDate();
                  const taskLog =
                    taskLogs.find(
                      (log) => log.task_id === task.task_id && log.log_date === today,
                    ) ?? null;

                  return (
                    <TaskExecutionRow
                      key={task.task_id}
                      task={{
                        task,
                        tasklog: taskLog,
                      }}
                    />
                  );
                })
              ) : (
                <div className="px-3 py-4 text-[12px] text-tertiary">No tasks assigned.</div>
              )}
            </div>
          </Panel>
        );
      })}
    </div>
  );
}
