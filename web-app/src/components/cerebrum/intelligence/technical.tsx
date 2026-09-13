import { TechnicalResult } from "@/types/interpretation";

export function TechnicalDetails({ tech }: { tech: TechnicalResult }) {
  const metrics = [
    ["overall_adherence: ", tech.overall_adherence],
    ["recent_adherence: ", tech.recent_adherence],
    ["transition_rate:", tech.transition_rate],
    ["average_run: ", tech.average_run],
    ["weighted_score:", tech.weighted_score],
    ["momentum_direction: ", tech.momentum_direction],
    ["momentum_acceleration: ", tech.momentum_acceleration],
    ["current_streak:", tech.current_streak],
    ["longest_streak: ", tech.longest_streak],
  ] as const;

  return (
    <details className="group rounded-lg border border-border bg-surface/60 open:bg-surface">
      {" "}
      <summary className="flex cursor-pointer items-center justify-between px-5 py-4 text-[12px] uppercase tracking-[0.18em] text-tertiary hover:text-muted-foreground">
        {" "}
        <span>Technical Details</span>{" "}
        <span className="text-[10px] normal-case tracking-normal text-tertiary group-open:hidden">
          {" "}
          for the curious{" "}
        </span>{" "}
      </summary>{" "}
      <div className="border-t border-border/70 px-5 py-5">
        {" "}
        <dl className="grid gap-2 text-[12px] sm:grid-cols-2">
          {" "}
          {metrics.map(([label, value]) => (
            <div key={label} className="flex items-center justify-between gap-4 font-mono">
              {" "}
              <dt className="text-tertiary">{label}</dt>{" "}
              <dd className="text-muted-foreground"> {value.toFixed(3)} </dd>{" "}
            </div>
          ))}{" "}
        </dl>{" "}
      </div>{" "}
    </details>
  );
}
