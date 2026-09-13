import React from "react";
import { Link, useRouterState } from "@tanstack/react-router";
import { useAuth } from "@/lib/auth-context";
import { cn } from "@/lib/utils";
import {
  CalendarCheck,
  Target,
  Sparkles,
  Settings,
  LogOut,
  Brain,
  ChevronRight,
  ExternalLink,
} from "lucide-react";

interface AppShellProps {
  children: React.ReactNode;
}

export function AppShell({ children }: AppShellProps) {
  const { user, logout } = useAuth();
  const routerState = useRouterState();
  const currentPath = routerState.location.pathname;

  const navItems = [
    {
      to: "/app",
      label: "Today",
      icon: CalendarCheck,
      match: (path: string) => path === "/app" || path === "/app/",
    },
    {
      to: "/app/goals",
      label: "Goals & Habits",
      icon: Target,
      match: (path: string) => path.startsWith("/app/goals"),
    },
    {
      to: "/app/analytics",
      label: "Patterns & Insights",
      icon: Sparkles,
      match: (path: string) => path.startsWith("/app/analytics"),
    },
    {
      to: "/app/settings",
      label: "Settings",
      icon: Settings,
      match: (path: string) => path.startsWith("/app/settings"),
    },
  ];

  return (
    <div className="flex min-h-screen bg-canvas text-text-primary">
      {/* Sidebar navigation */}
      <aside className="sticky top-0 flex h-screen w-64 flex-col justify-between border-r border-border-subtle bg-surface-base p-5">
        <div className="space-y-6">
          {/* Logo / Header */}
          <div className="flex items-center justify-between px-2 pt-1">
            <Link to="/app" className="flex items-center gap-2.5 group">
              <div className="grid h-7 w-7 place-items-center rounded-md border border-border-default bg-surface-raised transition-colors group-hover:border-accent-warm/50">
                <Brain className="h-4 w-4 text-accent-warm" />
              </div>
              <span className="text-[15px] font-semibold tracking-tight text-text-primary">
                Cerebrum
              </span>
            </Link>
            <span
              className="h-1.5 w-1.5 rounded-full bg-status-done animate-pulse"
              title="Connected"
            />
          </div>

          {/* Nav items */}
          <nav className="space-y-1">
            {navItems.map((item) => {
              const active = item.match(currentPath);
              const Icon = item.icon;
              return (
                <Link
                  key={item.to}
                  to={item.to}
                  className={cn(
                    "flex items-center gap-3 rounded-md px-3 py-2.5 text-[13.5px] font-medium transition-all",
                    active
                      ? "bg-surface-active text-text-primary border-l-2 border-accent-warm"
                      : "text-text-secondary hover:bg-surface-raised hover:text-text-primary",
                  )}
                >
                  <Icon
                    className={cn("h-4 w-4", active ? "text-accent-warm" : "text-text-muted")}
                  />
                  <span>{item.label}</span>
                </Link>
              );
            })}
          </nav>
        </div>

        {/* User Identity & Logout */}
        <div className="space-y-3 pt-4 hairline-t">
          <div className="flex items-center justify-between px-2 py-1">
            <div className="min-w-0 pr-2">
              <p className="truncate text-[13px] font-medium text-text-primary">
                {user?.name || "Friend"}
              </p>
              <p className="truncate text-[11px] text-text-muted">{user?.email || "signed in"}</p>
            </div>
            <button
              onClick={logout}
              title="Sign Out"
              className="grid h-7 w-7 place-items-center rounded border border-border-subtle bg-surface-base text-text-muted transition-colors hover:border-status-miss/40 hover:bg-surface-raised hover:text-status-miss"
            >
              <LogOut className="h-3.5 w-3.5" />
            </button>
          </div>
        </div>
      </aside>

      {/* Main Content Workspace */}
      <div className="flex min-w-0 flex-1 flex-col">
        {/* Top utility bar */}
        <header className="sticky top-0 z-20 flex h-12 items-center justify-between border-b border-border-subtle bg-canvas/80 px-8 backdrop-blur-md">
          <div className="flex items-center gap-2 text-[12px] text-text-muted">
            <span>Cerebrum</span>
            <ChevronRight className="h-3 w-3 text-text-dim" />
            <span className="text-text-secondary font-medium">
              {navItems.find((n) => n.match(currentPath))?.label || "Workspace"}
            </span>
          </div>

          <div className="flex items-center gap-4 text-[12px] text-text-muted">
            <Link
              to="/"
              className="inline-flex items-center gap-1 text-text-muted transition-colors hover:text-text-secondary"
            >
              About Cerebrum <ExternalLink className="h-3 w-3" />
            </Link>
          </div>
        </header>

        <main className="min-w-0 flex-1 px-8 py-8">{children}</main>
      </div>
    </div>
  );
}
