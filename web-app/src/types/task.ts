export interface TaskCreate {
  task_name: string;
  goal_id: number;
}

export interface TaskUpdate {
  task_name?: string | null;
}

export interface TaskRead {
  task_id: number;
  task_name: string;
  created_at: string;
  goal_id: number;
}
