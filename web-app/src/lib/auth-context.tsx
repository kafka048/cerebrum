import React, { createContext, useContext, useEffect, useState, useCallback, useMemo } from "react";
import { getCurrentUser, loginUser, signupUser } from "@/api/auth";
import { TOKEN_STORAGE_KEY } from "@/api/client";
import { UserCreate, UserLogin, UserRead } from "@/types/auth";

interface AuthContextType {
  user: UserRead | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (credentials: UserLogin) => Promise<void>;
  signup: (data: UserCreate) => Promise<void>;
  logout: () => void;
  refreshUser: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<UserRead | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const fetchUser = useCallback(async () => {
    const token = typeof window !== "undefined" ? localStorage.getItem(TOKEN_STORAGE_KEY) : null;
    if (!token) {
      setUser(null);
      setIsLoading(false);
      return;
    }

    try {
      const userData = await getCurrentUser();
      setUser(userData);
    } catch {
      if (typeof window !== "undefined") {
        localStorage.removeItem(TOKEN_STORAGE_KEY);
      }
      setUser(null);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchUser();
  }, [fetchUser]);

  const login = useCallback(async (credentials: UserLogin) => {
    setIsLoading(true);
    try {
      const tokenRes = await loginUser(credentials);
      if (typeof window !== "undefined") {
        localStorage.setItem(TOKEN_STORAGE_KEY, tokenRes.access_token);
      }
      const userData = await getCurrentUser();
      setUser(userData);
    } finally {
      setIsLoading(false);
    }
  }, []);

  const signup = useCallback(async (data: UserCreate) => {
    setIsLoading(true);
    try {
      await signupUser(data);
      // Automatically log in with the new credentials
      const tokenRes = await loginUser({ email: data.email, password: data.password });
      if (typeof window !== "undefined") {
        localStorage.setItem(TOKEN_STORAGE_KEY, tokenRes.access_token);
      }
      const userData = await getCurrentUser();
      setUser(userData);
    } finally {
      setIsLoading(false);
    }
  }, []);

  const logout = useCallback(() => {
    if (typeof window !== "undefined") {
      localStorage.removeItem(TOKEN_STORAGE_KEY);
    }
    setUser(null);
  }, []);

  const value = useMemo<AuthContextType>(
    () => ({
      user,
      isAuthenticated: !!user,
      isLoading,
      login,
      signup,
      logout,
      refreshUser: fetchUser,
    }),
    [user, isLoading, login, signup, logout, fetchUser],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth(): AuthContextType {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}
