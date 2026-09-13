import { apiClient } from "./client";
import { InterpretationResponse } from "@/types/analytics";

export async function getAnalytics(taskId: number): Promise<InterpretationResponse> {
  return apiClient<InterpretationResponse>(`/analytics/${taskId}`, {
    method: "GET",
  });
}
