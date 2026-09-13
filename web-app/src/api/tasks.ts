import { apiClient } from "./client";
import { TaskCreate, TaskRead, TaskUpdate } from "@/types/task";

export async function getTasks(): Promise<TaskRead[]> {
  return apiClient<TaskRead[]>("/tasks/", {
    method: "GET",
  });
}

export async function getTasksByGoal(goalId: number): Promise<TaskRead[]> {
  return apiClient<TaskRead[]>(`/tasks/goal/${goalId}`, {
    method: "GET",
  });
}

export async function getTask(taskId: number): Promise<TaskRead> {
  return apiClient<TaskRead>(`/tasks/${taskId}`, {
    method: "GET",
  });
}

export async function createTask(data: TaskCreate): Promise<TaskRead> {
  return apiClient<TaskRead>("/tasks/", {
    method: "POST",
    body: JSON.stringify(data),
  });
}

export async function updateTask(taskId: number, data: TaskUpdate): Promise<TaskRead> {
  return apiClient<TaskRead>(`/tasks/${taskId}`, {
    method: "PATCH",
    body: JSON.stringify(data),
  });
}

export async function deleteTask(taskId: number): Promise<null> {
  return apiClient<null>(`/tasks/${taskId}`, {
    method: "DELETE",
  });
}
