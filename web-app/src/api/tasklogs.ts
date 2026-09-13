import { apiClient } from "./client";
import { TaskLogCreate, TaskLogRead } from "@/types/tasklog";

export async function getTasklogs(): Promise<TaskLogRead[]> {
  return apiClient<TaskLogRead[]>("/tasklogs/", {
    method: "GET",
  });
}

export async function getTasklogsByTask(taskId: number): Promise<TaskLogRead[]> {
  return apiClient<TaskLogRead[]>(`/tasklogs/task/${taskId}`, {
    method: "GET",
  });
}

export async function getTasklog(tasklogId: number): Promise<TaskLogRead> {
  return apiClient<TaskLogRead>(`/tasklogs/${tasklogId}`, {
    method: "GET",
  });
}

export async function createTasklog(data: TaskLogCreate): Promise<TaskLogRead> {
  return apiClient<TaskLogRead>("/tasklogs/", {
    method: "POST",
    body: JSON.stringify(data),
  });
}
