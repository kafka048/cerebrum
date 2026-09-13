import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import { useAuth } from "@/lib/auth-context";
import { ArrowRight, Loader2 } from "lucide-react";

export const Route = createFileRoute("/auth/login")({
  head: () => ({
    meta: [
      { title: "Sign In — Cerebrum" },
      { name: "description", content: "Access your behavioral intelligence console." },
    ],
  }),
  component: LoginPage,
});

function LoginPage() {
  const { login } = useAuth();
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim() || !password) {
      setError("Please enter your email and password.");
      return;
    }

    setLoading(true);
    setError(null);
    try {
      await login({ email: email.trim(), password });
      navigate({ to: "/app" });
    } catch (err) {
      setError(err instanceof Error ? err.message : "Authentication failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="space-y-1">
        <h1 className="text-2xl font-semibold tracking-tight text-text-primary">Sign In</h1>
        <p className="text-[13px] text-text-secondary">
          Enter your credentials to access your daily execution console.
        </p>
      </div>

      {error && (
        <div className="rounded border border-signal-coral/40 bg-signal-coral/10 p-3 font-mono text-[12px] text-signal-coral">
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="space-y-1.5">
          <label className="font-mono text-[10px] uppercase tracking-wider text-text-muted">
            Email Address
          </label>
          <input
            type="email"
            required
            autoComplete="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="operative@domain.com"
            className="w-full rounded border border-border-default bg-surface-base px-3 py-2 text-[13px] text-text-primary placeholder:text-text-dim focus:border-border-focus focus:outline-none"
          />
        </div>

        <div className="space-y-1.5">
          <div className="flex items-center justify-between">
            <label className="font-mono text-[10px] uppercase tracking-wider text-text-muted">
              Password
            </label>
          </div>
          <input
            type="password"
            required
            autoComplete="current-password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="••••••••••••"
            className="w-full rounded border border-border-default bg-surface-base px-3 py-2 text-[13px] text-text-primary placeholder:text-text-dim focus:border-border-focus focus:outline-none"
          />
        </div>

        <button
          type="submit"
          disabled={loading}
          className="flex w-full items-center justify-center gap-2 rounded bg-text-primary py-2.5 font-mono text-[13px] font-semibold text-canvas transition-colors hover:bg-text-secondary disabled:opacity-50"
        >
          {loading ? (
            <>
              <Loader2 className="h-4 w-4 animate-spin" />
              <span>Authenticating...</span>
            </>
          ) : (
            <>
              <span>Authenticate</span>
              <ArrowRight className="h-4 w-4" />
            </>
          )}
        </button>
      </form>

      <div className="pt-2 text-center text-[12px] text-text-muted">
        <span>No profile yet? </span>
        <Link
          to="/auth/register"
          className="font-medium text-text-secondary underline hover:text-text-primary"
        >
          Create an account
        </Link>
      </div>
    </div>
  );
}
