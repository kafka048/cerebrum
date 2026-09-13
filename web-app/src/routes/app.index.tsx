import { createFileRoute, Link } from "@tanstack/react-router";
import { useState, useMemo } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { getGoals, createGoal } from "@/api/goals";
import { getTasks, createTask } from "@/api/tasks";
import { getTasklogs, createTasklog } from "@/api/tasklogs";
import { TaskLogRow } from "@/components/app/task-log-row";
import { GoalModal } from "@/components/app/goal-modal";
import { TaskModal } from "@/components/app/task-modal";
import { TaskStatus } from "@/types/tasklog";
import { GoalCreate } from "@/types/goal";
import { TaskCreate } from "@/types/task";
import { Plus, Sparkles, ArrowRight, CheckCircle2, Calendar, Layers } from "lucide-react";

export const Route = createFileRoute("/app/")({
  head: () => ({
    meta: [
      { title: "Today — Cerebrum" },
      { name: "description", content: "Daily habits and quick check-in." },
    ],
  }),
  component: TodayConsolePage,
});

const WEEKDAYS = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
const MONTHS = [
  "January",
  "February",
  "March",
  "April",
  "May",
  "June",
  "July",
  "August",
  "September",
  "October",
  "November",
  "December",
];

export function TodayConsolePage() {
  const queryClient = useQueryClient();
  const [filter, setFilter] = useState<"all" | "pending" | "logged">("all");
  const [goalModalOpen, setGoalModalOpen] = useState(false);
  const [taskModalOpen, setTaskModalOpen] = useState(false);
  const [targetGoalId, setTargetGoalId] = useState<number | undefined>(undefined);

  // Queries
  const { data: goals = [], isLoading: goalsLoading } = useQuery({
    queryKey: ["goals"],
    queryFn: getGoals,
  });

  const { data: tasks = [], isLoading: tasksLoading } = useQuery({
    queryKey: ["tasks"],
    queryFn: getTasks,
  });

  const { data: tasklogs = [], isLoading: logsLoading } = useQuery({
    queryKey: ["tasklogs"],
    queryFn: getTasklogs,
  });

  // Mutations
  const logMutation = useMutation({
    mutationFn: createTasklog,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["tasklogs"] });
    },
  });

  const createGoalMutation = useMutation({
    mutationFn: (data: GoalCreate) => createGoal(data),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["goals"] }),
  });

  const createTaskMutation = useMutation({
    mutationFn: (data: TaskCreate) => createTask(data),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["tasks"] }),
  });

  // Today's date
  const today = new Date();
  const todayStr = today.toISOString().split("T")[0];
  const dateDisplay = `${WEEKDAYS[today.getDay()]}, ${today.getDate()} ${MONTHS[today.getMonth()]}`;

  // Map today's logs by taskId
  const todayLogsMap = useMemo(() => {
    const map = new Map<number, (typeof tasklogs)[0]>();
    for (const log of tasklogs) {
      if (log.log_date === todayStr) {
        map.set(log.task_id, log);
      }
    }
    return map;
  }, [tasklogs, todayStr]);

  const totalTasks = tasks.length;
  const loggedTodayCount = tasks.filter((t) => todayLogsMap.has(t.task_id)).length;
  const allCompleted = totalTasks > 0 && loggedTodayCount === totalTasks;
  const progressPct = totalTasks > 0 ? Math.round((loggedTodayCount / totalTasks) * 100) : 0;

  // Filter tasks
  const filteredTasks = useMemo(() => {
    return tasks.filter((t) => {
      const isLogged = todayLogsMap.has(t.task_id);
      if (filter === "pending") return !isLogged;
      if (filter === "logged") return isLogged;
      return true;
    });
  }, [tasks, todayLogsMap, filter]);

  // Goal lookup
  const goalsMap = useMemo(() => {
    const map = new Map<number, string>();
    for (const g of goals) map.set(g.goal_id, g.goal_name);
    return map;
  }, [goals]);

  const handleLogTask = async (taskId: number, status: TaskStatus, reason?: string) => {
    await logMutation.mutateAsync({
      task_id: taskId,
      log_date: todayStr,
      status,
      reason,
    });
  };

  const isLoading = goalsLoading || tasksLoading || logsLoading;

  if (isLoading) {
    return (
      <div className="flex h-96 items-center justify-center text-[13px] text-text-muted">
        Loading today's habits...
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-3xl space-y-8">
      {/* Friendly, Unhurried Greeting Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between pb-6 hairline-b">
        <div className="space-y-1">
          <p className="text-[12px] font-medium text-text-muted">{dateDisplay}</p>
          <h1 className="text-3xl font-semibold tracking-tight text-text-primary">Today</h1>
          <p className="text-[13.5px] text-text-secondary">
            {totalTasks === 0
              ? "Welcome! Add your first daily habit to begin."
              : allCompleted
                ? "All done for today! Take a breather."
                : loggedTodayCount > 0
                  ? `${loggedTodayCount} of ${totalTasks} logged — keep the momentum going.`
                  : `You have ${totalTasks} habits queued for today.`}
          </p>
        </div>

        <div className="flex items-center gap-2 self-start sm:self-auto">
          {goals.length === 0 ? (
            <button
              onClick={() => setGoalModalOpen(true)}
              className="inline-flex items-center gap-1.5 rounded-md bg-text-primary px-3.5 py-2 text-[13px] font-medium text-canvas transition-colors hover:bg-text-secondary"
            >
              <Plus className="h-4 w-4" />
              <span>Create Goal</span>
            </button>
          ) : (
            <button
              onClick={() => {
                setTargetGoalId(goals[0]?.goal_id);
                setTaskModalOpen(true);
              }}
              className="inline-flex items-center gap-1.5 rounded-md bg-text-primary px-3.5 py-2 text-[13px] font-medium text-canvas transition-colors hover:bg-text-secondary"
            >
              <Plus className="h-4 w-4" />
              <span>Add Task</span>
            </button>
          )}
        </div>
      </div>

      {/* Progress & Simple Filters */}
      {totalTasks > 0 && (
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between rounded-md border border-border-subtle bg-surface-base p-4">
          <div className="space-y-1.5 flex-1 max-w-md">
            <div className="flex items-center justify-between text-[12px]">
              <span className="text-text-secondary font-medium">Daily Progress</span>
              <span className="text-text-primary font-mono text-[12px]">
                {loggedTodayCount} of {totalTasks} ({progressPct}%)
              </span>
            </div>
            <div className="h-2 w-full overflow-hidden rounded-full bg-surface-raised">
              <div
                className="h-full bg-status-done transition-all duration-300"
                style={{ width: `${progressPct}%` }}
              />
            </div>
          </div>

          <div className="flex rounded-md border border-border-subtle bg-surface-raised p-0.5 text-[12px]">
            {(["all", "pending", "logged"] as const).map((f) => (
              <button
                key={f}
                onClick={() => setFilter(f)}
                className={`rounded px-3 py-1 capitalize transition-colors ${
                  filter === f
                    ? "bg-surface-active text-text-primary font-medium"
                    : "text-text-muted hover:text-text-secondary"
                }`}
              >
                {f === "pending" ? "To Do" : f === "logged" ? "Checked In" : "All"}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Primary Task List — The Hero of the App */}
      <div className="space-y-3">
        {totalTasks === 0 ? (
          <div className="rounded-lg border border-dashed border-border-default bg-surface-base p-12 text-center space-y-4">
            <div className="mx-auto grid h-11 w-11 place-items-center rounded-full bg-surface-raised">
              <Sparkles className="h-5 w-5 text-accent-warm" />
            </div>
            <div className="space-y-1">
              <h3 className="text-[16px] font-medium text-text-primary">Your space is clear</h3>
              <p className="text-[13px] text-text-secondary max-w-md mx-auto">
                Set up a habit or task you want to check in on daily. Cerebrum will quietly study
                your rhythms over time.
              </p>
            </div>
            <button
              onClick={() => setGoalModalOpen(true)}
              className="inline-flex items-center gap-2 rounded-md bg-text-primary px-4 py-2 text-[13px] font-medium text-canvas hover:bg-text-secondary"
            >
              <Plus className="h-4 w-4" />
              <span>Get Started</span>
            </button>
          </div>
        ) : filteredTasks.length === 0 ? (
          <div className="rounded border border-border-subtle bg-surface-base p-8 text-center text-[13px] text-text-muted">
            {filter === "pending"
              ? "You've checked in on everything for today! Nice work."
              : "No check-ins recorded yet today."}
          </div>
        ) : (
          filteredTasks.map((task) => (
            <TaskLogRow
              key={task.task_id}
              task={task}
              todayLog={todayLogsMap.get(task.task_id)}
              goalName={goalsMap.get(task.goal_id)}
              onLog={handleLogTask}
              isSubmitting={logMutation.isPending}
            />
          ))
        )}
      </div>

      {/* Quiet, Encouraging Insights Discovery Card (Bottom) */}
      {totalTasks > 0 && (
        <div className="rounded-md border border-border-subtle bg-surface-base p-5 transition-colors hover:border-border-default">
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <div className="space-y-1">
              <div className="flex items-center gap-2">
                <Sparkles className="h-4 w-4 text-accent-warm" />
                <h3 className="text-[14px] font-medium text-text-primary">
                  Curious about your rhythms and habits?
                </h3>
              </div>
              <p className="text-[12.5px] text-text-secondary">
                See your momentum, consistency patterns, and personalized habit profiles.
              </p>
            </div>

            <Link
              to="/app/analytics"
              className="inline-flex items-center gap-1.5 rounded-md border border-border-default bg-surface-raised px-3.5 py-2 text-[12px] font-medium text-text-primary transition-colors hover:bg-surface-active shrink-0"
            >
              <span>Explore Insights</span>
              <ArrowRight className="h-3.5 w-3.5 text-accent-warm" />
            </Link>
          </div>
        </div>
      )}

      {/* Goal Modal */}
      <GoalModal
        open={goalModalOpen}
        onOpenChange={setGoalModalOpen}
        onSubmit={async (goal) => {
          await createGoalMutation.mutateAsync(goal as GoalCreate);
        }}
      />

      {/* Task Modal */}
      <TaskModal
        open={taskModalOpen}
        onOpenChange={setTaskModalOpen}
        goals={goals}
        defaultGoalId={targetGoalId}
        onSubmit={async (data) => {
          await createTaskMutation.mutateAsync(data as TaskCreate);
        }}
      />
    </div>
  );
}
