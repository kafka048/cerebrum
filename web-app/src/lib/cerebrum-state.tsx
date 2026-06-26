import { createContext, useContext, useEffect, useMemo, useState, type ReactNode } from "react";
import type { Goal, Task, TaskIntelligence, TaskStatus } from "./cerebrum-data";
import { sampleTaskIntelligence, todaysFocus } from "./cerebrum-data";

const INTELLIGENCE_THRESHOLD_DAYS = 7;

export type LogEntry = {
  id: string;
  taskId: string;
  status: TaskStatus;
  reason?: string;
  at: string; // ISO
};

type State = {
  goals: Goal[];
  logs: LogEntry[];
};

type ContextValue = State & {
  hasGoals: boolean;
  hasTasks: boolean;
  daysLogged: number;
  intelligenceTarget: number;
  intelligenceUnlocked: boolean;
  createGoal: (input: { name: string; purpose?: string }) => string;
  updateGoal: (goalId: string, patch: { name?: string; purpose?: string }) => void;
  deleteGoal: (goalId: string) => void;
  createTask: (input: { goalId: string; name: string }) => string;
  updateTask: (taskId: string, patch: { name?: string }) => void;
  deleteTask: (taskId: string) => void;
  logTask: (input: { taskId: string; status: TaskStatus; reason?: string }) => void;
  seedSample: () => void;
  reset: () => void;
  // per-task helpers
  daysLoggedForTask: (taskId: string) => number;
  streakForTask: (taskId: string) => number;
  lastLoggedLabel: (taskId: string) => string;
  recentAdherenceForTask: (taskId: string) => number; // 0..1 across last 14 days
  getTaskIntelligence: (taskId: string) => TaskIntelligence | null;
};

const CerebrumStateContext = createContext<ContextValue | null>(null);

function makeId(prefix: string) {
  return `${prefix}-${Math.random().toString(36).slice(2, 9)}`;
}

function dayKey(iso: string): string {
  return iso.slice(0, 10);
}

function uniqueDays(logs: LogEntry[]): number {
  const set = new Set<string>();
  for (const l of logs) set.add(dayKey(l.at));
  return set.size;
}

function todayKey(): string {
  return new Date().toISOString().slice(0, 10);
}

function addDaysKey(base: Date, offset: number): string {
  const d = new Date(base);
  d.setUTCDate(d.getUTCDate() + offset);
  return d.toISOString().slice(0, 10);
}

export function CerebrumStateProvider({ children }: { children: ReactNode }) {
  const [state, setState] = useState<State>({ goals: [], logs: [] });

  // Dev-only seed shortcut so reviewers can unlock intelligence quickly.
  useEffect(() => {
    function onKey(e: KeyboardEvent) {
      if (e.shiftKey && (e.key === "S" || e.key === "s") && !e.metaKey && !e.ctrlKey && !e.altKey) {
        const t = e.target as HTMLElement | null;
        const tag = t?.tagName;
        if (tag === "INPUT" || tag === "TEXTAREA" || (t && t.isContentEditable)) return;
        e.preventDefault();
        seedSampleImpl();
      }
    }
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  function seedSampleImpl() {
    const sampleGoals: Goal[] = todaysFocus.map((g) => ({
      ...g,
      tasks: g.tasks.map((t) => ({ ...t, status: "pending" as TaskStatus })),
    }));
    const allTaskIds = sampleGoals.flatMap((g) => g.tasks.map((t) => t.id));
    const now = Date.now();
    const day = 24 * 60 * 60 * 1000;
    const sampleLogs: LogEntry[] = [];
    for (let i = 0; i < 8; i++) {
      const at = new Date(now - i * day).toISOString();
      for (const tid of allTaskIds) {
        sampleLogs.push({
          id: makeId("l"),
          taskId: tid,
          status: i % 4 === 3 ? "skipped" : "completed",
          at,
        });
      }
    }
    setState({ goals: sampleGoals, logs: sampleLogs });
  }

  const value = useMemo<ContextValue>(() => {
    const hasGoals = state.goals.length > 0;
    const hasTasks = state.goals.some((g) => g.tasks.length > 0);
    const daysLogged = uniqueDays(state.logs);

    const logsByTask = new Map<string, LogEntry[]>();
    for (const l of state.logs) {
      const arr = logsByTask.get(l.taskId) ?? [];
      arr.push(l);
      logsByTask.set(l.taskId, arr);
    }

    const daysLoggedForTask = (taskId: string) => uniqueDays(logsByTask.get(taskId) ?? []);

    const streakForTask = (taskId: string) => {
      const logs = logsByTask.get(taskId) ?? [];
      const completedDays = new Set(
        logs.filter((l) => l.status === "completed").map((l) => dayKey(l.at)),
      );
      let streak = 0;
      const today = new Date();
      for (let i = 0; i < 365; i++) {
        const key = addDaysKey(today, -i);
        if (completedDays.has(key)) streak++;
        else break;
      }
      return streak;
    };

    const lastLoggedLabel = (taskId: string) => {
      const logs = logsByTask.get(taskId) ?? [];
      if (logs.length === 0) return "—";
      const days = Array.from(new Set(logs.map((l) => dayKey(l.at)))).sort().reverse();
      const last = days[0]!;
      const today = todayKey();
      const yesterday = addDaysKey(new Date(), -1);
      if (last === today) return "Today";
      if (last === yesterday) return "Yesterday";
      const diff = Math.floor((Date.parse(today) - Date.parse(last)) / (24 * 60 * 60 * 1000));
      return `${diff} days ago`;
    };

    const recentAdherenceForTask = (taskId: string) => {
      const logs = logsByTask.get(taskId) ?? [];
      const window = 14;
      const today = new Date();
      const windowDays = new Set<string>();
      for (let i = 0; i < window; i++) windowDays.add(addDaysKey(today, -i));
      const completed = new Set(
        logs
          .filter((l) => l.status === "completed" && windowDays.has(dayKey(l.at)))
          .map((l) => dayKey(l.at)),
      );
      return completed.size / window;
    };

    const getTaskIntelligence = (taskId: string): TaskIntelligence | null => {
      if (daysLoggedForTask(taskId) < INTELLIGENCE_THRESHOLD_DAYS) return null;
      return sampleTaskIntelligence;
    };

    return {
      ...state,
      hasGoals,
      hasTasks,
      daysLogged,
      intelligenceTarget: INTELLIGENCE_THRESHOLD_DAYS,
      intelligenceUnlocked: daysLogged >= INTELLIGENCE_THRESHOLD_DAYS,
      createGoal: ({ name, purpose }) => {
        const id = makeId("g");
        setState((s) => ({
          ...s,
          goals: [
            ...s.goals,
            { id, name, purpose: purpose ?? "", rhythm: "—", tasks: [] },
          ],
        }));
        return id;
      },
      createTask: ({ goalId, name }) => {
        const id = makeId("t");
        const task: Task = { id, name, status: "pending" };
        setState((s) => ({
          ...s,
          goals: s.goals.map((g) =>
            g.id === goalId ? { ...g, tasks: [...g.tasks, task] } : g,
          ),
        }));
        return id;
      },
      updateGoal: (goalId, patch) => {
        setState((s) => ({
          ...s,
          goals: s.goals.map((g) => (g.id === goalId ? { ...g, ...patch } : g)),
        }));
      },
      deleteGoal: (goalId) => {
        setState((s) => {
          const goal = s.goals.find((g) => g.id === goalId);
          const removedTaskIds = new Set(goal?.tasks.map((t) => t.id) ?? []);
          return {
            goals: s.goals.filter((g) => g.id !== goalId),
            logs: s.logs.filter((l) => !removedTaskIds.has(l.taskId)),
          };
        });
      },
      updateTask: (taskId, patch) => {
        setState((s) => ({
          ...s,
          goals: s.goals.map((g) => ({
            ...g,
            tasks: g.tasks.map((t) => (t.id === taskId ? { ...t, ...patch } : t)),
          })),
        }));
      },
      deleteTask: (taskId) => {
        setState((s) => ({
          goals: s.goals.map((g) => ({
            ...g,
            tasks: g.tasks.filter((t) => t.id !== taskId),
          })),
          logs: s.logs.filter((l) => l.taskId !== taskId),
        }));
      },
      logTask: ({ taskId, status, reason }) => {
        setState((s) => ({
          ...s,
          logs: [
            ...s.logs,
            { id: makeId("l"), taskId, status, reason, at: new Date().toISOString() },
          ],
        }));
      },
      seedSample: seedSampleImpl,
      reset: () => setState({ goals: [], logs: [] }),
      daysLoggedForTask,
      streakForTask,
      lastLoggedLabel,
      recentAdherenceForTask,
      getTaskIntelligence,
    };
  }, [state]);

  return (
    <CerebrumStateContext.Provider value={value}>{children}</CerebrumStateContext.Provider>
  );
}

export function useCerebrumState() {
  const ctx = useContext(CerebrumStateContext);
  if (!ctx) throw new Error("useCerebrumState must be used inside CerebrumStateProvider");
  return ctx;
}
