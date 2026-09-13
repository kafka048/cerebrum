export type TaskStatus = "completed" | "failed" | "skipped";

export interface TaskLogCreate {
  task_id: number;
  log_date: string; // YYYY-MM-DD
  status: TaskStatus;
  reason?: string | null;
}

export interface TaskLogRead {
  tasklog_id: number;
  task_id: number;
  user_id: number;
  log_date: string;
  status: TaskStatus;
  reason: string | null;
  created_at: string;
}
