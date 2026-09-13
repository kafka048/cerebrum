import { Link } from "@tanstack/react-router";
import { Panel } from "./primitives";

export function TodayNav() {
  return (
    <Panel>
      <nav aria-label="Sections" className="grid grid-cols-2">
        <NavCell to="/app/overview" label="Your Overview" />
        <NavCell to="/app/settings" label="Settings" className="border-l border-border/60" />
      </nav>
    </Panel>
  );
}

function NavCell({ to, label, className = "" }: { to: string; label: string; className?: string }) {
  return (
    <Link
      to={to}
      className={`flex items-center justify-center px-6 py-5 text-[13.5px] text-tertiary transition-colors duration-150 hover:bg-surface-elevated/40 hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ember/40 focus-visible:ring-offset-2 focus-visible:ring-offset-background ${className}`}
    >
      {label}
    </Link>
  );
}
