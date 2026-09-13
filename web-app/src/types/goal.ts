export type GoalStatus = "active" | "completed" | "abandoned";
export type GoalPriority = 1 | 2 | 3;

export interface GoalCreate {
  goal_name: string;
  description?: string | null;
  priority: GoalPriority;
  start_date: string;
  end_date?: string | null;
  status: GoalStatus;
}

export interface GoalUpdate {
  goal_name?: string | null;
  description?: string | null;
  priority?: GoalPriority | null;
  start_date?: string | null;
  end_date?: string | null;
  status?: GoalStatus | null;
}

export interface GoalRead {
  goal_id: number;
  goal_name: string;
  description: string | null;
  priority: GoalPriority;
  start_date: string;
  end_date: string | null;
  created_at: string;
  status: GoalStatus;
  user_id: number;
}
