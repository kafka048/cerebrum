import { InterpretationResponse } from "@/types/interpretation";
import { fetchRequest } from "./client";

export async function getInterpretation(task_id: number): Promise<InterpretationResponse> {
  const url = `/analytics/${task_id}`;
  const options = {
    method: "GET",
  };

  return await fetchRequest(url, options);
}
