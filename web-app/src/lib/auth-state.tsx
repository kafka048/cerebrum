import { createContext, useContext, useEffect, useState, type ReactNode } from "react";

export type Session = {
  name: string;
  email: string;
  memberSince: string; // ISO
};

type Ctx = {
  session: Session | null;
  isAuthenticated: boolean;
  signIn: (input: { email: string; password: string }) => Session;
  signUp: (input: { name?: string; email: string; password: string }) => Session;
  signOut: () => void;
};

const STORAGE_KEY = "cerebrum.session.v1";
const AuthContext = createContext<Ctx | null>(null);

function readStored(): Session | null {
  if (typeof window === "undefined") return null;
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    return raw ? (JSON.parse(raw) as Session) : null;
  } catch {
    return null;
  }
}

function writeStored(s: Session | null) {
  if (typeof window === "undefined") return;
  if (s) window.localStorage.setItem(STORAGE_KEY, JSON.stringify(s));
  else window.localStorage.removeItem(STORAGE_KEY);
}

function deriveNameFromEmail(email: string): string {
  const local = email.split("@")[0] ?? "You";
  return local
    .replace(/[._-]+/g, " ")
    .split(" ")
    .filter(Boolean)
    .map((s) => s[0]!.toUpperCase() + s.slice(1))
    .join(" ");
}

export function AuthProvider({ children }: { children: ReactNode }) {
  const [session, setSession] = useState<Session | null>(null);

  // Hydrate after mount to avoid SSR hydration mismatch.
  useEffect(() => {
    setSession(readStored());
  }, []);

  const value: Ctx = {
    session,
    isAuthenticated: !!session,
    signIn: ({ email }) => {
      const existing = readStored();
      const s: Session =
        existing && existing.email === email
          ? existing
          : { name: deriveNameFromEmail(email), email, memberSince: new Date().toISOString() };
      writeStored(s);
      setSession(s);
      return s;
    },
    signUp: ({ name, email }) => {
      const s: Session = {
        name: name?.trim() || deriveNameFromEmail(email),
        email,
        memberSince: new Date().toISOString(),
      };
      writeStored(s);
      setSession(s);
      return s;
    },
    signOut: () => {
      writeStored(null);
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
      "January", "February", "March", "April", "May", "June",
      "July", "August", "September", "October", "November", "December",
    ];
    return `${MONTHS[d.getUTCMonth()]} ${d.getUTCFullYear()}`;
  } catch {
    return "—";
  }
}
