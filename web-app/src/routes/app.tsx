import { createFileRoute, Link, Outlet, useNavigate } from "@tanstack/react-router";
import { useEffect } from "react";
import { CerebrumStateProvider } from "@/lib/cerebrum-state";
import { AuthProvider, useAuth } from "@/lib/auth-state";

export const Route = createFileRoute("/app")({
  component: AppLayout,
});

function AppLayout() {
  return (
    <AuthProvider>
      <CerebrumStateProvider>
        <AuthGate>
          <div className="min-h-screen bg-background text-foreground">
            <AppHeader />
            <main>
              <Outlet />
            </main>
          </div>
        </AuthGate>
      </CerebrumStateProvider>
    </AuthProvider>
  );
}

function AppHeader() {
  return (
    <div className="mx-auto w-full max-w-5xl px-6 sm:px-10 pt-8 sm:pt-10">
      <nav className="flex flex-wrap items-baseline gap-x-8 gap-y-2 text-[13.5px]">
        <Link to="/app" className="font-display text-[17px] tracking-tight text-foreground">
          Cerebrum
        </Link>
        <NavLink to="/app">Today</NavLink>
        <NavLink to="/app/overview">Overview</NavLink>
        <NavLink to="/app/settings">Settings</NavLink>
      </nav>
    </div>
  );
}

function NavLink({ to, children }: { to: string; children: React.ReactNode }) {
  return (
    <Link
      to={to}
      activeOptions={{ exact: true }}
      activeProps={{ className: "text-foreground" }}
      inactiveProps={{ className: "text-tertiary hover:text-foreground" }}
      className="transition-colors"
    >
      {children}
    </Link>
  );
}

function AuthGate({ children }: { children: React.ReactNode }) {
  const { isAuthenticated, isInitialising } = useAuth();  
  const navigate = useNavigate();

  useEffect(() => {
    if(isInitialising){
      return;
    }
    if (!isAuthenticated) {
      navigate({ to: "/auth/login" });
    }
  }, [isAuthenticated, isInitialising, navigate]);

  return <>{children}</>;
}
