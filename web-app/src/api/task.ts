import { TaskCreate, TaskUpdate } from "@/types/task";
import { fetchRequest } from "./client";

export async function createTask(taskinfo: TaskCreate) {
  const url = `/tasks/`;
  const options = {
    method: "POST",
    body: JSON.stringify(taskinfo),
  };

  return await fetchRequest(url, options);
}

export async function getTask(task_id: number) {
  const url = `/tasks/${task_id}`;
  const options = {
    method: "GET",
  };

  return await fetchRequest(url, options);
}

export async function getTasks() {
  const url = `/tasks/`;
  const options = {
    method: "GET",
  };

  return await fetchRequest(url, options);
}

export async function getTasksByGoals(goal_id: number) {
  const url = `/tasks/goal/${goal_id}`;
  const options = {
    method: "GET",
  };

  return await fetchRequest(url, options);
}

export async function editTask(task_id: number, task: TaskUpdate) {
  const url = `/tasks/${task_id}`;
  const options = {
    method: "PATCH",
    body: JSON.stringify(task),
  };

  return await fetchRequest(url, options);
}

export async function deleteTask(task_id: number) {
  const url = `/tasks/${task_id}`;
  const options = {
    method: "DELETE",
  };

  return await fetchRequest(url, options);
}
