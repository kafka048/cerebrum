import { createContext, useContext, useEffect, useMemo, useState, type ReactNode } from "react";

import { createGoal as createGoalApi, getGoals, editGoal, deleteGoal } from "../api/goal";
import { createTask as createTaskApi, getTasks, editTask, deleteTask } from "../api/task";
import { createTasklog as createTasklogApi, getTasklogs } from "@/api/tasklog";

import { GoalCreate, GoalRead, GoalUpdate } from "@/types/goal";
import { TaskCreate, TaskRead, TaskUpdate } from "@/types/task";
import { TaskLogCreate, TaskLogRead } from "@/types/tasklog";

type State = {
  goals: GoalRead[];
  tasks: TaskRead[];
  taskLogs: TaskLogRead[];
};

type ContextValue = State & {
  hasGoals: boolean;
  hasTasks: boolean;
  daysLogged: number;

  createGoal: (input: GoalCreate) => Promise<void>;
  updateGoal: (goal_id: number, input: GoalUpdate) => Promise<void>;
  removeGoal: (goal_id: number) => Promise<void>;

  createTask: (input: TaskCreate) => Promise<void>;
  updateTask: (task_id: number, input: TaskUpdate) => Promise<void>;
  removeTask: (task_id: number) => Promise<void>;

  logTask: (input: TaskLogCreate) => Promise<void>;

  reset: () => void;
};

const CerebrumStateContext = createContext<ContextValue | null>(null);

function uniqueDays(logs: TaskLogRead[]): number {
  const set = new Set<string>();
  for (const l of logs) set.add(l.log_date);
  return set.size;
}

export function CerebrumStateProvider({ children }: { children: ReactNode }) {
  const [state, setState] = useState<State>({ goals: [], tasks: [], taskLogs: [] });

  async function loadGoals() {
    const goals = await getGoals();

    setState((state) => ({
      ...state,
      goals,
    }));
  }

  async function loadTasks() {
    const tasks = await getTasks();

    setState((state) => ({
      ...state,
      tasks,
    }));
  }

  async function loadTaskLogs() {
    const taskLogs = await getTasklogs();

    setState((state) => ({
      ...state,
      taskLogs,
    }));
  }

  useEffect(() => {
    async function initialise() {
      await Promise.all([loadGoals(), loadTasks(), loadTaskLogs()]); // HAPPENS PARALLELY
    }

    initialise();
  }, []);

  const value = useMemo<ContextValue>(() => {
    const hasGoals = state.goals.length > 0;
    const hasTasks = state.tasks.length > 0;
    const daysLogged = uniqueDays(state.taskLogs);

    return {
      ...state,
      hasGoals,
      hasTasks,
      daysLogged,

      createGoal: async (goal: GoalCreate) => {
        await createGoalApi(goal);
        await loadGoals();
      },

      updateGoal: async (goal_id: number, goal: GoalUpdate) => {
        await editGoal(goal_id, goal);
        await loadGoals();
      },

      removeGoal: async (goal_id: number) => {
        await deleteGoal(goal_id);
        await loadGoals();
      },

      createTask: async (task: TaskCreate) => {
        await createTaskApi(task);
        await loadTasks();
      },

      updateTask: async (task_id: number, task: TaskUpdate) => {
        await editTask(task_id, task);
        await loadTasks();
      },

      removeTask: async (task_id: number) => {
        await deleteTask(task_id);
        await loadTasks();
      },

      logTask: async (taskLog: TaskLogCreate) => {
        await createTasklogApi(taskLog);
        await loadTaskLogs();
      },

      reset: () =>
        setState({
          goals: [],
          tasks: [],
          taskLogs: [],
        }),
    };
  }, [state]);

  return <CerebrumStateContext.Provider value={value}>{children}</CerebrumStateContext.Provider>;
}

export function useCerebrumState() {
  const ctx = useContext(CerebrumStateContext);
  if (!ctx) throw new Error("useCerebrumState must be used inside CerebrumStateProvider");
  return ctx;
}
