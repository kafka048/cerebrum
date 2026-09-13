import { createFileRoute, Link, Outlet, useNavigate } from "@tanstack/react-router";
import { useAuth } from "@/lib/auth-context";
import { useEffect } from "react";
import { Brain } from "lucide-react";

export const Route = createFileRoute("/auth")({
  component: AuthLayout,
});

function AuthLayout() {
  const { isAuthenticated, isLoading } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (!isLoading && isAuthenticated) {
      navigate({ to: "/app" });
    }
  }, [isAuthenticated, isLoading, navigate]);

  return (
    <div className="flex min-h-screen flex-col justify-between bg-canvas px-4 py-8 text-text-primary sm:px-6">
      <div className="mx-auto w-full max-w-sm">
        <Link to="/" className="inline-flex items-center gap-2 group">
          <div className="grid h-7 w-7 place-items-center rounded border border-border-default bg-surface-raised transition-colors group-hover:border-signal-cyan/50">
            <Brain className="h-4 w-4 text-signal-cyan" />
          </div>
          <span className="font-mono text-[14px] font-semibold tracking-tight text-text-primary">
            Cerebrum
          </span>
        </Link>
      </div>

      <div className="mx-auto w-full max-w-sm">
        <Outlet />
      </div>

      <div className="mx-auto w-full max-w-sm text-center font-mono text-[11px] text-text-muted">
        <span>Cerebrum Behavioral Intelligence</span>
      </div>
    </div>
  );
}
