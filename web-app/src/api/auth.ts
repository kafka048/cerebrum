import { apiClient } from "./client";
import { UserCreate, UserLogin, UserRead, TokenResponse } from "@/types/auth";

export async function loginUser(credentials: UserLogin): Promise<TokenResponse> {
  return apiClient<TokenResponse>("/users/login", {
    method: "POST",
    body: JSON.stringify(credentials),
  });
}

export async function signupUser(data: UserCreate): Promise<UserRead> {
  return apiClient<UserRead>("/users/signup", {
    method: "POST",
    body: JSON.stringify(data),
  });
}

export async function getCurrentUser(): Promise<UserRead> {
  return apiClient<UserRead>("/users/me", {
    method: "GET",
  });
}
