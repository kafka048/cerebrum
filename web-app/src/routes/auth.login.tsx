import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import { ArrowRight } from "lucide-react";
import { useAuth } from "@/lib/auth-state";

export const Route = createFileRoute("/auth/login")({
  head: () => ({
    meta: [
      { title: "Log in — Cerebrum" },
      { name: "description", content: "Sign in to Cerebrum." },
    ],
  }),
  component: LoginPage,
});

function LoginPage() {
  const { signin } = useAuth();
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    try {
      if (!email.trim() || !password) {
        setError("Email and password are required.");
        return;
      }
      await signin({ email: email.trim(), password });
      console.log("You have signed in")
      console.log("Navigating to app now")
      navigate({ to: "/app" });
    } catch (error) {
      if (error instanceof Error) {
        setError(error.message);
      } else {
        setError("Something went wrong.");
      }
    }
  };

  return (
    <section>
      <p className="text-[10px] uppercase tracking-[0.22em] text-understanding">Welcome Back</p>
      <h1 className="mt-4 font-display text-[40px] leading-[1.05] tracking-tight text-foreground">
        Log in.
      </h1>
      <p className="mt-3 text-[14px] leading-relaxed text-muted-foreground">
        Return to your behavioral profile.
      </p>

      <form onSubmit={submit} className="mt-10 space-y-4">
        <label className="block space-y-1.5">
          <span className="text-[11px] uppercase tracking-[0.18em] text-tertiary">Email</span>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="you@domain.com"
            className="w-full rounded-md border border-border bg-surface px-3 py-2.5 text-[14px] text-foreground placeholder:text-tertiary focus:border-understanding/60 focus:outline-none"
          />
        </label>
        <label className="block space-y-1.5">
          <span className="text-[11px] uppercase tracking-[0.18em] text-tertiary">Password</span>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="••••••••"
            className="w-full rounded-md border border-border bg-surface px-3 py-2.5 text-[14px] text-foreground placeholder:text-tertiary focus:border-understanding/60 focus:outline-none"
          />
        </label>

        {error && <p className="text-[12px] text-failed">{error}</p>}

        <button
          type="submit"
          className="group mt-2 inline-flex w-full items-center justify-center gap-2 rounded-md bg-foreground px-5 py-3 text-[13.5px] font-medium text-background transition-transform hover:-translate-y-px"
        >
          Continue
          <ArrowRight
            className="h-4 w-4 transition-transform group-hover:translate-x-0.5"
            strokeWidth={1.75}
          />
        </button>
      </form>

      <p className="mt-8 text-center text-[13px] text-muted-foreground">
        New to Cerebrum?{" "}
        <Link to="/auth/register" className="text-foreground underline-offset-4 hover:underline">
          Build your profile
        </Link>
      </p>
    </section>
  );
}
