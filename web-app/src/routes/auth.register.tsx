import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import { ArrowRight } from "lucide-react";
import { useAuth } from "@/lib/auth-state";

export const Route = createFileRoute("/auth/register")({
  head: () => ({
    meta: [
      { title: "Build Your Profile — Cerebrum" },
      { name: "description", content: "Create your Cerebrum account." },
    ],
  }),
  component: RegisterPage,
});

function RegisterPage() {
  const { signUp } = useAuth();
  const navigate = useNavigate();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [error, setError] = useState<string | null>(null);

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    if (!email.trim() || !password) {
      setError("Email and password are required.");
      return;
    }
    if (password !== confirm) {
      setError("Passwords do not match.");
      return;
    }
    signUp({ name, email: email.trim(), password });
    navigate({ to: "/app" });
  };

  return (
    <section>
      <p className="text-[10px] uppercase tracking-[0.22em] text-understanding">Build Your Profile</p>
      <h1 className="mt-4 font-display text-[40px] leading-[1.05] tracking-tight text-foreground">
        Create your account.
      </h1>
      <p className="mt-3 text-[14px] leading-relaxed text-muted-foreground">
        Cerebrum studies how you operate. Your behavioral profile begins here.
      </p>

      <form onSubmit={submit} className="mt-10 space-y-4">
        <Field label="Name" value={name} onChange={setName} placeholder="Your name" />
        <Field label="Email" type="email" value={email} onChange={setEmail} placeholder="you@domain.com" />
        <Field label="Password" type="password" value={password} onChange={setPassword} placeholder="••••••••" />
        <Field label="Confirm Password" type="password" value={confirm} onChange={setConfirm} placeholder="••••••••" />

        {error && (
          <p className="text-[12px] text-failed">{error}</p>
        )}

        <button
          type="submit"
          className="group mt-2 inline-flex w-full items-center justify-center gap-2 rounded-md bg-foreground px-5 py-3 text-[13.5px] font-medium text-background transition-transform hover:-translate-y-px"
        >
          Build Your Profile
          <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" strokeWidth={1.75} />
        </button>
      </form>

      <p className="mt-8 text-center text-[13px] text-muted-foreground">
        Already have an account?{" "}
        <Link to="/auth/login" className="text-foreground underline-offset-4 hover:underline">
          Log in
        </Link>
      </p>
    </section>
  );
}

function Field({
  label,
  value,
  onChange,
  type = "text",
  placeholder,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  type?: string;
  placeholder?: string;
}) {
  return (
    <label className="block space-y-1.5">
      <span className="text-[11px] uppercase tracking-[0.18em] text-tertiary">{label}</span>
      <input
        type={type}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className="w-full rounded-md border border-border bg-surface px-3 py-2.5 text-[14px] text-foreground placeholder:text-tertiary focus:border-understanding/60 focus:outline-none"
      />
    </label>
  );
}
