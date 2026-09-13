import { createFileRoute } from "@tanstack/react-router";
import { useState, useMemo } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { getGoals, createGoal, updateGoal, deleteGoal } from "@/api/goals";
import { getTasks, createTask, updateTask, deleteTask } from "@/api/tasks";
import { GoalModal } from "@/components/app/goal-modal";
import { TaskModal } from "@/components/app/task-modal";
import { GoalCreate, GoalRead, GoalUpdate } from "@/types/goal";
import { TaskCreate, TaskRead, TaskUpdate } from "@/types/task";
import { cn } from "@/lib/utils";
import { Plus, Target, Edit2, Trash2, Calendar, Layers, ArrowRight, Sparkles } from "lucide-react";
import { Link } from "@tanstack/react-router";

export const Route = createFileRoute("/app/goals")({
  head: () => ({
    meta: [
      { title: "Goals & Habits — Cerebrum" },
      { name: "description", content: "Organize your habits under meaningful personal goals." },
    ],
  }),
  component: GoalsManagementPage,
});

export function GoalsManagementPage() {
  const queryClient = useQueryClient();
  const [goalModalOpen, setGoalModalOpen] = useState(false);
  const [editingGoal, setEditingGoal] = useState<GoalRead | null>(null);
  const [taskModalOpen, setTaskModalOpen] = useState(false);
  const [editingTask, setEditingTask] = useState<TaskRead | null>(null);
  const [targetGoalId, setTargetGoalId] = useState<number | undefined>(undefined);

  const { data: goals = [], isLoading: goalsLoading } = useQuery({
    queryKey: ["goals"],
    queryFn: getGoals,
  });

  const { data: tasks = [], isLoading: tasksLoading } = useQuery({
    queryKey: ["tasks"],
    queryFn: getTasks,
  });

  // Goal mutations
  const createGoalMutation = useMutation({
    mutationFn: (data: GoalCreate) => createGoal(data),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["goals"] }),
  });

  const updateGoalMutation = useMutation({
    mutationFn: ({ id, data }: { id: number; data: GoalUpdate }) => updateGoal(id, data),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["goals"] }),
  });

  const deleteGoalMutation = useMutation({
    mutationFn: (id: number) => deleteGoal(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["goals"] });
      queryClient.invalidateQueries({ queryKey: ["tasks"] });
    },
  });

  // Task mutations
  const createTaskMutation = useMutation({
    mutationFn: (data: TaskCreate) => createTask(data),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["tasks"] }),
  });

  const updateTaskMutation = useMutation({
    mutationFn: ({ id, data }: { id: number; data: TaskUpdate }) => updateTask(id, data),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["tasks"] }),
  });

  const deleteTaskMutation = useMutation({
    mutationFn: (id: number) => deleteTask(id),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["tasks"] }),
  });

  // Group tasks by goal
  const tasksByGoal = useMemo(() => {
    const map = new Map<number, TaskRead[]>();
    for (const t of tasks) {
      const list = map.get(t.goal_id) || [];
      list.push(t);
      map.set(t.goal_id, list);
    }
    return map;
  }, [tasks]);

  const handleDeleteGoal = async (goalId: number) => {
    if (window.confirm("Remove this goal and its associated habits?")) {
      await deleteGoalMutation.mutateAsync(goalId);
    }
  };

  const handleDeleteTask = async (taskId: number) => {
    if (window.confirm("Remove this habit?")) {
      await deleteTaskMutation.mutateAsync(taskId);
    }
  };

  const isLoading = goalsLoading || tasksLoading;

  return (
    <div className="mx-auto max-w-4xl space-y-8">
      {/* Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between pb-6 hairline-b">
        <div className="space-y-1">
          <div className="flex items-center gap-2 text-[12px] font-medium text-accent-warm">
            <Target className="h-4 w-4" />
            <span>Structure & Areas of Focus</span>
          </div>
          <h1 className="text-3xl font-semibold tracking-tight text-text-primary">
            Goals & Habits
          </h1>
          <p className="text-[13.5px] text-text-secondary">
            Connect your daily actions to the bigger areas of your life that matter.
          </p>
        </div>

        <button
          onClick={() => {
            setEditingGoal(null);
            setGoalModalOpen(true);
          }}
          className="inline-flex items-center gap-1.5 rounded-md bg-text-primary px-3.5 py-2 text-[13px] font-medium text-canvas transition-colors hover:bg-text-secondary self-start sm:self-auto"
        >
          <Plus className="h-4 w-4" />
          <span>New Goal</span>
        </button>
      </div>

      {isLoading ? (
        <div className="py-20 text-center text-[13px] text-text-muted">Loading goals...</div>
      ) : goals.length === 0 ? (
        <div className="rounded-lg border border-dashed border-border-default bg-surface-base p-12 text-center space-y-4">
          <div className="mx-auto grid h-11 w-11 place-items-center rounded-full bg-surface-raised">
            <Target className="h-5 w-5 text-accent-warm" />
          </div>
          <div className="space-y-1">
            <h3 className="text-[16px] font-medium text-text-primary">No goals set up yet</h3>
            <p className="text-[13px] text-text-secondary max-w-md mx-auto">
              Create an area of focus (e.g. Health, Writing, Deep Work) to group your daily habits.
            </p>
          </div>
          <button
            onClick={() => {
              setEditingGoal(null);
              setGoalModalOpen(true);
            }}
            className="inline-flex items-center gap-2 rounded-md bg-text-primary px-4 py-2 text-[13px] font-medium text-canvas hover:bg-text-secondary"
          >
            <Plus className="h-4 w-4" />
            <span>Create First Goal</span>
          </button>
        </div>
      ) : (
        <div className="space-y-6">
          {goals.map((goal) => {
            const goalTasks = tasksByGoal.get(goal.goal_id) || [];
            const priorityBadge =
              goal.priority === 1
                ? "text-accent-warm border-accent-warm/30 bg-accent-warm/10"
                : goal.priority === 2
                  ? "text-status-done border-status-done/30 bg-status-done/10"
                  : "text-text-muted border-border-subtle bg-surface-raised";

            return (
              <div
                key={goal.goal_id}
                className="overflow-hidden rounded-md border border-border-subtle bg-surface-base transition-colors hover:border-border-default"
              >
                {/* Goal Card Header */}
                <div className="flex flex-col gap-3 p-5 sm:flex-row sm:items-start sm:justify-between hairline-b bg-surface-raised/40">
                  <div className="space-y-1.5">
                    <div className="flex items-center gap-2">
                      <span
                        className={cn(
                          "rounded-full border px-2.5 py-0.5 text-[11px] font-medium",
                          priorityBadge,
                        )}
                      >
                        {goal.priority === 1
                          ? "Top Focus"
                          : goal.priority === 2
                            ? "Important"
                            : "Standard"}
                      </span>
                      <h2 className="text-[17px] font-medium tracking-tight text-text-primary">
                        {goal.goal_name}
                      </h2>
                    </div>

                    {goal.description && (
                      <p className="text-[13px] text-text-secondary leading-relaxed">
                        {goal.description}
                      </p>
                    )}

                    <div className="flex items-center gap-4 pt-1 text-[12px] text-text-muted">
                      <span className="flex items-center gap-1">
                        <Calendar className="h-3.5 w-3.5" />
                        Started {goal.start_date.split("T")[0]}
                      </span>
                      <span>
                        · {goalTasks.length} habit{goalTasks.length === 1 ? "" : "s"}
                      </span>
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="flex items-center gap-1.5">
                    <button
                      onClick={() => {
                        setTargetGoalId(goal.goal_id);
                        setEditingTask(null);
                        setTaskModalOpen(true);
                      }}
                      className="inline-flex items-center gap-1 rounded-md border border-border-subtle bg-surface-base px-3 py-1 text-[12px] font-medium text-text-secondary hover:border-border-default hover:text-text-primary transition-colors"
                    >
                      <Plus className="h-3.5 w-3.5" />
                      <span>Add Habit</span>
                    </button>

                    <button
                      onClick={() => {
                        setEditingGoal(goal);
                        setGoalModalOpen(true);
                      }}
                      title="Edit Goal"
                      className="grid h-7 w-7 place-items-center rounded-md border border-border-subtle bg-surface-base text-text-muted hover:border-border-default hover:text-text-primary transition-colors"
                    >
                      <Edit2 className="h-3.5 w-3.5" />
                    </button>

                    <button
                      onClick={() => handleDeleteGoal(goal.goal_id)}
                      title="Delete Goal"
                      className="grid h-7 w-7 place-items-center rounded-md border border-border-subtle bg-surface-base text-text-muted hover:border-status-miss/40 hover:text-status-miss transition-colors"
                    >
                      <Trash2 className="h-3.5 w-3.5" />
                    </button>
                  </div>
                </div>

                {/* Attached Tasks List */}
                <div className="p-4 space-y-2">
                  <div className="px-1 text-[11.5px] font-medium text-text-muted">
                    Daily Habits in this Goal
                  </div>

                  {goalTasks.length === 0 ? (
                    <div className="rounded-md border border-dashed border-border-subtle p-4 text-center text-[12.5px] text-text-muted">
                      No habits added yet. Click "+ Add Habit" to link one.
                    </div>
                  ) : (
                    <div className="grid grid-cols-1 gap-2 sm:grid-cols-2">
                      {goalTasks.map((t) => (
                        <div
                          key={t.task_id}
                          className="flex items-center justify-between rounded-md border border-border-subtle bg-surface-raised p-3 transition-colors hover:border-border-default"
                        >
                          <div className="min-w-0 pr-2">
                            <h4 className="truncate text-[13.5px] font-medium text-text-primary">
                              {t.task_name}
                            </h4>
                          </div>

                          <div className="flex items-center gap-2 shrink-0">
                            <Link
                              to="/app/analytics/$taskId"
                              params={{ taskId: t.task_id.toString() }}
                              className="text-[12px] text-accent-warm hover:underline flex items-center gap-0.5"
                            >
                              Insights <ArrowRight className="h-3 w-3" />
                            </Link>

                            <button
                              onClick={() => {
                                setEditingTask(t);
                                setTaskModalOpen(true);
                              }}
                              title="Rename Habit"
                              className="grid h-6 w-6 place-items-center text-text-muted hover:text-text-primary"
                            >
                              <Edit2 className="h-3 w-3" />
                            </button>

                            <button
                              onClick={() => handleDeleteTask(t.task_id)}
                              title="Delete Habit"
                              className="grid h-6 w-6 place-items-center text-text-muted hover:text-status-miss"
                            >
                              <Trash2 className="h-3 w-3" />
                            </button>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Goal Dialog */}
      <GoalModal
        open={goalModalOpen}
        onOpenChange={setGoalModalOpen}
        initialGoal={editingGoal}
        onSubmit={async (data) => {
          if (editingGoal) {
            await updateGoalMutation.mutateAsync({
              id: editingGoal.goal_id,
              data: data as GoalUpdate,
            });
          } else {
            await createGoalMutation.mutateAsync(data as GoalCreate);
          }
        }}
      />

      {/* Task Dialog */}
      <TaskModal
        open={taskModalOpen}
        onOpenChange={setTaskModalOpen}
        goals={goals}
        defaultGoalId={targetGoalId}
        initialTask={editingTask}
        onSubmit={async (data) => {
          if (editingTask) {
            await updateTaskMutation.mutateAsync({
              id: editingTask.task_id,
              data: data as TaskUpdate,
            });
          } else {
            await createTaskMutation.mutateAsync(data as TaskCreate);
          }
        }}
      />
    </div>
  );
}
