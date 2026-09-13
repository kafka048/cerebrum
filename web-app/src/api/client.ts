const BASE_URL: string = "http://127.0.0.1:8000";
export const TOKEN_STORAGE_KEY: string = "cerebrum.token";

export class ApiError extends Error {
  status: number;
  data: unknown;

  constructor(message: string, status: number, data?: unknown) {
    super(message);
    this.name = "ApiError";
    this.status = status;
    this.data = data;
  }
}

export async function apiClient<T>(endpoint: string, options: RequestInit = {}): Promise<T> {
  const url = `${BASE_URL}${endpoint}`;
  const token = typeof window !== "undefined" ? localStorage.getItem(TOKEN_STORAGE_KEY) : null;

  const headers: Record<string, string> = {
    "Content-Type": "application/json",
    ...(options.headers as Record<string, string>),
  };

  if (token) {
    headers["Authorization"] = `Bearer ${token}`;
  }

  const response = await fetch(url, {
    ...options,
    headers,
  });

  if (!response.ok) {
    let errorDetail = `Request failed with status ${response.status}`;
    let errorBody: unknown = null;
    try {
      errorBody = await response.json();
      if (typeof errorBody === "object" && errorBody !== null) {
        if ("detail" in errorBody) {
          const detail = (errorBody as { detail: unknown }).detail;
          if (typeof detail === "string") {
            errorDetail = detail;
          } else if (Array.isArray(detail) && detail.length > 0 && detail[0]?.msg) {
            errorDetail = detail[0].msg;
          } else {
            errorDetail = JSON.stringify(detail);
          }
        }
      }
    } catch {
      // Non-JSON response error body
    }

    if (response.status === 401 && token) {
      // Unauthorized: remove expired or invalid token
      if (typeof window !== "undefined") {
        localStorage.removeItem(TOKEN_STORAGE_KEY);
      }
    }

    throw new ApiError(errorDetail, response.status, errorBody);
  }

  if (response.status === 204) {
    return null as T;
  }

  return (await response.json()) as T;
}
