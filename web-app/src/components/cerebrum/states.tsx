import type { ReactNode } from "react";
import { cn } from "@/lib/utils";
import { Panel, PanelHeader, Eyebrow } from "./primitives";
import { PageShell } from "./page-shell";

/* Skeleton shimmer bar */
function Bar({ className }: { className?: string }) {
  return <div className={cn("animate-pulse rounded-full bg-surface-elevated/70", className)} />;
}

export function PanelSkeleton() {
  return (
    <Panel>
      <div className="px-8 pt-7 pb-6 space-y-4">
        <Bar className="h-[9px] w-24" />
        <Bar className="h-[22px] w-1/2" />
      </div>
      <div className="divide-hairline px-8 pb-6">
        {[0, 1, 2].map((i) => (
          <div key={i} className="flex items-center justify-between py-5">
            <Bar className="h-[14px] w-2/5" />
            <Bar className="h-[14px] w-16" />
          </div>
        ))}
      </div>
    </Panel>
  );
}

export function PageLoading({ title }: { title?: string }) {
  return (
    <PageShell>
      <div className="mb-14 space-y-4">
        <Bar className="h-[9px] w-32" />
        <Bar className="h-[52px] w-2/3 max-w-[520px]" />
        {title && <span className="sr-only">Loading {title}…</span>}
      </div>
      <div className="space-y-8">
        <PanelSkeleton />
        <PanelSkeleton />
      </div>
    </PageShell>
  );
}

export function EmptyState({
  eyebrow,
  title,
  description,
  action,
}: {
  eyebrow?: string;
  title: string;
  description?: string;
  action?: ReactNode;
}) {
  return (
    <Panel>
      <div className="px-10 py-20 text-center">
        {eyebrow && <Eyebrow>{eyebrow}</Eyebrow>}
        <p className="mt-5 font-display text-[36px] tracking-tight text-foreground">{title}</p>
        {description && (
          <p className="mt-3 text-[14.5px] text-muted-foreground max-w-md mx-auto">{description}</p>
        )}
        {action && <div className="mt-8">{action}</div>}
      </div>
    </Panel>
  );
}

export function ErrorState({
  title,
  description,
  onRetry,
}: {
  title: string;
  description?: string;
  onRetry?: () => void;
}) {
  return (
    <Panel tone="elevated" className="overflow-hidden">
      <span
        aria-hidden
        className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-status-failed/70 to-transparent"
      />
      <div className="px-10 py-16 text-center">
        <Eyebrow>Something's off</Eyebrow>
        <p className="mt-5 font-display text-[32px] tracking-tight text-foreground">{title}</p>
        {description && (
          <p className="mt-3 text-[14.5px] text-muted-foreground max-w-md mx-auto">{description}</p>
        )}
        {onRetry && (
          <button
            onClick={onRetry}
            className="mt-8 rounded-md border border-border/70 px-5 py-2.5 text-[11px] font-medium uppercase tracking-[0.22em] text-foreground transition-colors hover:bg-surface-elevated focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ember/40 focus-visible:ring-offset-2 focus-visible:ring-offset-background"
          >
            Try again
          </button>
        )}
      </div>
    </Panel>
  );
}
