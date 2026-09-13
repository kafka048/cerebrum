import { type ReactNode } from "react";
import { Eyebrow } from "./primitives";

export function PageHeader({
  above,
  eyebrow,
  title,
  description,
  right,
  titleSize = "default",
}: {
  above?: ReactNode;
  eyebrow?: string;
  title: ReactNode;
  description?: string;
  right?: ReactNode;
  titleSize?: "default" | "lg";
}) {
  const titleClass =
    titleSize === "lg"
      ? "font-display text-[58px] sm:text-[72px] leading-[0.95] tracking-tight text-foreground"
      : "font-display text-[52px] sm:text-[64px] leading-[1.02] tracking-tight text-foreground";

  const headerSpacing = titleSize === "lg" ? "mb-12" : "mb-14";

  return (
    <>
      {above && <div className="mb-6">{above}</div>}
      <header className={`grid grid-cols-[minmax(0,1fr)_auto] items-end gap-8 ${headerSpacing}`}>
        <div className="min-w-0">
          {eyebrow && <Eyebrow className="mb-4">{eyebrow}</Eyebrow>}
          <h1 className={titleClass}>{title}</h1>
          {description && (
            <p className="mt-5 max-w-2xl text-[15px] text-muted-foreground leading-relaxed">
              {description}
            </p>
          )}
        </div>
        {right && <div className="shrink-0">{right}</div>}
      </header>
    </>
  );
}

type PageShellProps = {
  children: ReactNode;
  wide?: boolean;
};

export function PageShell({ children, wide = false }: PageShellProps) {
  const max = wide ? "max-w-[1280px]" : "max-w-[1200px]";
  return (
    <div className={`mx-auto w-full ${max} px-8 sm:px-12 lg:px-16 pt-14 pb-32 sm:pt-16 sm:pb-40`}>
      {children}
    </div>
  );
}
