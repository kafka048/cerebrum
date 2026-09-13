import { apiClient } from "./client";
import { GoalCreate, GoalRead, GoalUpdate } from "@/types/goal";

export async function getGoals(): Promise<GoalRead[]> {
  return apiClient<GoalRead[]>("/goals/", {
    method: "GET",
  });
}

export async function getGoal(goalId: number): Promise<GoalRead> {
  return apiClient<GoalRead>(`/goals/${goalId}`, {
    method: "GET",
  });
}

export async function createGoal(data: GoalCreate): Promise<GoalRead> {
  return apiClient<GoalRead>("/goals/", {
    method: "POST",
    body: JSON.stringify(data),
  });
}

export async function updateGoal(goalId: number, data: GoalUpdate): Promise<GoalRead> {
  return apiClient<GoalRead>(`/goals/${goalId}`, {
    method: "PATCH",
    body: JSON.stringify(data),
  });
}

export async function deleteGoal(goalId: number): Promise<null> {
  return apiClient<null>(`/goals/${goalId}`, {
    method: "DELETE",
  });
}
