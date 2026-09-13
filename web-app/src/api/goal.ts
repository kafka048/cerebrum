import { GoalCreate, GoalUpdate } from "@/types/goal";
import { fetchRequest } from "./client";

export async function createGoal(information: GoalCreate) {
  const url = "/goals/";
  const options = {
    method: "POST",
    body: JSON.stringify(information),
  };

  return fetchRequest(url, options);
}

export async function getGoal(goal_id: number) {
  const url = `/goals/${goal_id}`;
  const options = {
    method: "GET",
  };

  return fetchRequest(url, options);
}

export async function getGoals() {
  const url = `/goals/`;
  const options = {
    method: "GET",
  };

  return fetchRequest(url, options);
}

export async function editGoal(goal_id: number, goal_info: GoalUpdate) {
  const url = `/goals/${goal_id}`;
  const options = {
    method: "PATCH",
    body: JSON.stringify(goal_info),
  };

  return fetchRequest(url, options);
}

export async function deleteGoal(goal_id: number) {
  const url = `/goals/${goal_id}`;
  const options = {
    method: "DELETE",
  };

  return fetchRequest(url, options);
}
