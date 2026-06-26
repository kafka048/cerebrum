import { createFileRoute, Link, useParams } from "@tanstack/react-router";
import { ArrowLeft } from "lucide-react";
import { PageShell } from "@/components/cerebrum/page-shell";
import { IntelligenceSnapshot } from "@/components/cerebrum/intelligence/snapshot";
import { TechnicalDetails } from "@/components/cerebrum/intelligence/technical";
import { useCerebrumState } from "@/lib/cerebrum-state";

export const Route = createFileRoute("/app/intelligence/$taskId")({
  head: () => ({
    meta: [
      { title: "Task Intelligence — Cerebrum" },
      { name: "description", content: "Behavioral intelligence for a single task." },
    ],
  }),
  component: TaskIntelligencePage,
});

function TaskIntelligencePage() {
  const { taskId } = useParams({ from: "/app/intelligence/$taskId" });
  const { goals, daysLoggedForTask, getTaskIntelligence, intelligenceTarget } = useCerebrumState();
  const task = goals.flatMap((g) => g.tasks).find((t) => t.id === taskId);

  if (!task) {
    return (
      <PageShell>
        <BackLink />
        <div className="rounded-lg border border-border bg-surface p-10 text-center">
          <p className="font-display text-[20px] tracking-tight text-foreground">Task not found.</p>
          <p className="mt-2 text-[13.5px] text-muted-foreground">
            It may have been removed or never created.
          </p>
        </div>
      </PageShell>
    );
  }

  const days = daysLoggedForTask(taskId);
  const intelligence = getTaskIntelligence(taskId);

  return (
    <PageShell>
      <BackLink />

      {!intelligence ? (
        <LearningState taskName={task.name} days={days} target={intelligenceTarget} />
      ) : (
        <UnlockedState taskName={task.name} intelligence={intelligence} />
      )}
    </PageShell>
  );
}

function BackLink() {
  return (
    <Link
      to="/app/overview"
      className="mb-8 inline-flex items-center gap-1.5 text-[12.5px] text-tertiary hover:text-foreground"
    >
      <ArrowLeft className="h-3.5 w-3.5" strokeWidth={1.75} />
      Back to overview
    </Link>
  );
}

function LearningState({ taskName, days, target }: { taskName: string; days: number; target: number }) {
  const pct = Math.min(100, Math.round((days / target) * 100));
  return (
    <section className="rounded-xl border border-border bg-surface-elevated p-10 sm:p-14">
      <p className="text-[10px] uppercase tracking-[0.22em] text-understanding">{taskName}</p>
      <h1 className="mt-5 font-display text-3xl leading-[1.1] tracking-tight text-foreground sm:text-[42px]">
        Cerebrum Is Still Learning
      </h1>
      <p className="mt-6 max-w-2xl text-[15px] leading-relaxed text-muted-foreground">
        Reliable behavioral patterns emerge through repeated observation.
      </p>

      <div className="mt-12 max-w-md">
        <div className="flex items-baseline justify-between">
          <span className="font-display text-[18px] tracking-tight text-foreground">
            {days} / {target} <span className="text-tertiary">Days Logged</span>
          </span>
          <span className="text-[11px] uppercase tracking-[0.18em] text-tertiary">{pct}%</span>
        </div>
        <div className="mt-3 h-px w-full bg-border">
          <div className="h-px bg-understanding transition-all" style={{ width: `${pct}%` }} />
        </div>
      </div>
    </section>
  );
}

function UnlockedState({
  taskName,
  intelligence,
}: {
  taskName: string;
  intelligence: ReturnType<typeof useCerebrumState>["getTaskIntelligence"] extends (
    ...args: never
  ) => infer R
    ? Exclude<R, null>
    : never;
}) {
  const { primary_profile, secondary_profiles, snapshot, technical } = intelligence;
  const evidence = primary_profile.evidence.slice(0, 5);
  const visibleSecondary = secondary_profiles.filter(
    (s) => s.confidence >= primary_profile.confidence - 10,
  );

  return (
    <div className="space-y-16">
      <header>
        <p className="text-[10px] uppercase tracking-[0.22em] text-tertiary">Task Intelligence</p>
        <h1 className="mt-4 font-display text-4xl leading-[1.05] tracking-tight text-foreground sm:text-5xl">
          {taskName}
        </h1>
        <div className="mt-6 flex items-baseline gap-3">
          <p className="font-display text-[24px] tracking-tight text-foreground">
            {primary_profile.name}
          </p>
          <span className="text-tertiary">|</span>
          <p className="font-display text-[20px] tracking-tight text-understanding">
            {primary_profile.confidence}%
          </p>
        </div>
      </header>

      <section>
        <p className="mb-4 text-[10px] uppercase tracking-[0.22em] text-tertiary">Evidence</p>
        <ul className="space-y-2.5">
          {evidence.map((e, i) => (
            <li key={i} className="grid grid-cols-[auto_minmax(0,1fr)] items-start gap-3">
              <span className="mt-2 h-px w-4 bg-understanding/70" />
              <span className="text-[14px] leading-relaxed text-foreground/90">{e}</span>
            </li>
          ))}
        </ul>
      </section>

      <IntelligenceSnapshot snapshot={snapshot} />

      {visibleSecondary.length > 0 && (
        <section>
          <p className="mb-4 text-[10px] uppercase tracking-[0.22em] text-tertiary">
            Cerebrum Also Observes
          </p>
          <div className="space-y-px overflow-hidden rounded-lg border border-border/70 bg-border/60">
            {visibleSecondary.map((s) => (
              <div
                key={s.name}
                className="grid grid-cols-[minmax(0,1fr)_auto] items-baseline gap-6 bg-surface/70 px-5 py-4"
              >
                <p className="text-[14px] text-muted-foreground">{s.name}</p>
                <p className="font-mono text-[12.5px] text-tertiary">{s.confidence}%</p>
              </div>
            ))}
          </div>
          <p className="mt-3 text-[11.5px] text-tertiary">
            Lower-confidence patterns Cerebrum is also watching. Shown for transparency, not as conclusions.
          </p>
        </section>
      )}

      <TechnicalDetails tech={technical} />
    </div>
  );
}
