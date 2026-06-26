import type { TaskIntelligence } from "@/lib/cerebrum-data";

export function TechnicalDetails({ tech }: { tech: TaskIntelligence["technical"] }) {
  return (
    <details className="group rounded-lg border border-border bg-surface/60 open:bg-surface">
      <summary className="flex cursor-pointer items-center justify-between px-5 py-4 text-[12px] uppercase tracking-[0.18em] text-tertiary hover:text-muted-foreground">
        <span>Technical Details</span>
        <span className="text-[10px] normal-case tracking-normal text-tertiary group-open:hidden">
          for the curious
        </span>
      </summary>
      <div className="grid gap-6 border-t border-border/70 px-5 py-5 text-[12px] text-tertiary sm:grid-cols-2">
        <div>
          <p className="mb-2 text-[10px] uppercase tracking-[0.18em] text-tertiary/80">Classification</p>
          <p className="font-mono text-muted-foreground">{tech.rawClassification}</p>
          <p className="mt-3 mb-2 text-[10px] uppercase tracking-[0.18em] text-tertiary/80">Confidence</p>
          <p className="font-mono text-muted-foreground">{tech.confidence.toFixed(4)}</p>
        </div>
        <div>
          <p className="mb-2 text-[10px] uppercase tracking-[0.18em] text-tertiary/80">Metrics</p>
          <dl className="space-y-1.5">
            {Object.entries(tech.metrics).map(([k, v]) => (
              <div key={k} className="flex justify-between gap-4 font-mono">
                <dt className="truncate">{k}</dt>
                <dd className="text-muted-foreground">{v.toFixed(3)}</dd>
              </div>
            ))}
          </dl>
        </div>
        <div className="sm:col-span-2">
          <p className="mb-2 text-[10px] uppercase tracking-[0.18em] text-tertiary/80">Signal Breakdown</p>
          <dl className="grid grid-cols-2 gap-x-6 gap-y-1.5 sm:grid-cols-4">
            {Object.entries(tech.signalBreakdown).map(([k, v]) => (
              <div key={k} className="flex justify-between gap-3 font-mono">
                <dt className="truncate">{k}</dt>
                <dd className="text-muted-foreground">{v.toFixed(2)}</dd>
              </div>
            ))}
          </dl>
        </div>
      </div>
    </details>
  );
}
