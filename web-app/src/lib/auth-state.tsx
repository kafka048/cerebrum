import { getCurrentUser, login, signup } from "@/api/auth";
import { UserCreate, UserLogin, TokenResponse } from "@/types/user";
import { createContext, useContext, useEffect, useState, type ReactNode } from "react";

const TOKEN_STORAGE_KEY: string = "cerebrum.token";

export type Session = {
  name: string;
  email: string;
  memberSince: string; // ISO 8601 : FastAPI serialises the datetime object to JSON.
};

type Ctx = {
  session: Session | null;
  isAuthenticated: boolean;
  isInitialising: boolean;
  signin: (input: { email: string; password: string }) => Promise<void>;
  signup: (input: { name: string; email: string; password: string }) => Promise<void>;
  signOut: () => void;
};

const AuthContext = createContext<Ctx | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [session, setSession] = useState<null | Session>(null);
  const [isInitialising, setIsInitialising] = useState(true);

  useEffect(() => {
    initSession();
  }, []);

  async function performSignIn(credentials: UserLogin) {    
    const token: TokenResponse = await login(credentials);
    localStorage.setItem(TOKEN_STORAGE_KEY, token.access_token);

    await initSession();
  }

  async function initSession() {
    try {
      const token = localStorage.getItem(TOKEN_STORAGE_KEY);
      if (token == null) {
        return;
      }

      const user = await getCurrentUser();
      const session: Session = {
        name: user.name,
        email: user.email,
        memberSince: formatMemberSince(user.created_at),
      };
      setSession(session);
    } catch (error) {
      localStorage.removeItem(TOKEN_STORAGE_KEY);
      setSession(null);
      return;
    } finally {
      setIsInitialising(false)
    }
  }

  const value: Ctx = {
    session,
    isAuthenticated: !!session,
    isInitialising,
    signin: performSignIn,
    signup: async (credentials: UserCreate) => {
      await signup(credentials);
      await performSignIn({
        email: credentials.email,
        password: credentials.password,
      });
    },
    signOut: () => {
      localStorage.removeItem(TOKEN_STORAGE_KEY);
      setSession(null);
    },
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used inside AuthProvider");
  return ctx;
}

export function formatMemberSince(iso: string): string {
  try {
    const d = new Date(iso);
    const MONTHS = [
      "January",
      "February",
      "March",
      "April",
      "May",
      "June",
      "July",
      "August",
      "September",
      "October",
      "November",
      "December",
    ];
    return `${MONTHS[d.getUTCMonth()]} ${d.getUTCFullYear()}`;
  } catch {
    return "—";
  }
}
