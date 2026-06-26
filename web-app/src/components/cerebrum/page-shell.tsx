import { type ReactNode } from "react";

export function PageHeader({
  eyebrow,
  title,
  description,
  right,
}: {
  eyebrow?: string;
  title: string;
  description?: string;
  right?: ReactNode;
}) {
  return (
    <header className="grid grid-cols-[minmax(0,1fr)_auto] items-end gap-6 border-b border-border pb-8 mb-10">
      <div className="min-w-0">
        {eyebrow && (
          <p className="mb-3 text-[10px] uppercase tracking-[0.22em] text-tertiary">{eyebrow}</p>
        )}
        <h1 className="font-display text-4xl sm:text-5xl tracking-tight text-foreground leading-[1.05]">
          {title}
        </h1>
        {description && (
          <p className="mt-3 max-w-2xl text-sm text-muted-foreground leading-relaxed">{description}</p>
        )}
      </div>
      {right && <div className="shrink-0">{right}</div>}
    </header>
  );
}

export function PageShell({ children }: { children: ReactNode }) {
  return <div className="mx-auto w-full max-w-5xl px-6 sm:px-10 py-10 sm:py-14">{children}</div>;
}
