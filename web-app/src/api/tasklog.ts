import { TaskLogCreate } from "@/types/tasklog";
import { fetchRequest } from "./client";

export async function createTasklog(tasklogInfo: TaskLogCreate) {
  const url = `/tasklogs/`;
  const options = {
    method: "POST",
    body: JSON.stringify(tasklogInfo),
  };

  return await fetchRequest(url, options);
}

export async function getTasklog(tasklog_id: number) {
  const url = `/tasklogs/${tasklog_id}`;
  const options = {
    method: "GET",
  };

  return await fetchRequest(url, options);
}

export async function getTasklogs() {
  const url = `/tasklogs/`;
  const options = {
    method: "GET",
  };

  return await fetchRequest(url, options);
}
