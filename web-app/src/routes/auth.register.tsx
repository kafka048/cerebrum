import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import { useAuth } from "@/lib/auth-context";
import { ArrowRight, Loader2 } from "lucide-react";

export const Route = createFileRoute("/auth/register")({
  head: () => ({
    meta: [
      { title: "Create Profile — Cerebrum" },
      { name: "description", content: "Initialize your behavioral intelligence account." },
    ],
  }),
  component: RegisterPage,
});

function RegisterPage() {
  const { signup } = useAuth();
  const navigate = useNavigate();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !email.trim() || !password) {
      setError("Please fill out all fields.");
      return;
    }
    if (password.length > 72) {
      setError("Password cannot exceed 72 characters.");
      return;
    }
    if (password !== confirmPassword) {
      setError("Passwords do not match.");
      return;
    }

    setLoading(true);
    setError(null);
    try {
      await signup({ name: name.trim(), email: email.trim(), password });
      navigate({ to: "/app" });
    } catch (err) {
      setError(err instanceof Error ? err.message : "Registration failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="space-y-1">
        <h1 className="text-2xl font-semibold tracking-tight text-text-primary">Create Profile</h1>
        <p className="text-[13px] text-text-secondary">
          Initialize your personal performance analytics system.
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
            Full Name
          </label>
          <input
            type="text"
            required
            autoComplete="name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Marcus Aurelius"
            className="w-full rounded border border-border-default bg-surface-base px-3 py-2 text-[13px] text-text-primary placeholder:text-text-dim focus:border-border-focus focus:outline-none"
          />
        </div>

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
          <label className="font-mono text-[10px] uppercase tracking-wider text-text-muted">
            Password (max 72 chars)
          </label>
          <input
            type="password"
            required
            autoComplete="new-password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="••••••••••••"
            className="w-full rounded border border-border-default bg-surface-base px-3 py-2 text-[13px] text-text-primary placeholder:text-text-dim focus:border-border-focus focus:outline-none"
          />
        </div>

        <div className="space-y-1.5">
          <label className="font-mono text-[10px] uppercase tracking-wider text-text-muted">
            Confirm Password
          </label>
          <input
            type="password"
            required
            autoComplete="new-password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
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
              <span>Registering Profile...</span>
            </>
          ) : (
            <>
              <span>Initialize System</span>
              <ArrowRight className="h-4 w-4" />
            </>
          )}
        </button>
      </form>

      <div className="pt-2 text-center text-[12px] text-text-muted">
        <span>Already have an account? </span>
        <Link
          to="/auth/login"
          className="font-medium text-text-secondary underline hover:text-text-primary"
        >
          Sign In
        </Link>
      </div>
    </div>
  );
}
