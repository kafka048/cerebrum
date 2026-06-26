import { createFileRoute, Link } from "@tanstack/react-router";
import {
  ArrowRight,
  BrainCircuit,
  Check,
  Minus,
  Quote,
  Sparkles,
} from "lucide-react";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Cerebrum — Understand Your Behavior, Not Just Your Habits" },
      {
        name: "description",
        content:
          "Cerebrum is a behavioral intelligence platform. Log behavior, uncover patterns, and receive evidence-backed assessments of how you actually operate.",
      },
      {
        property: "og:title",
        content: "Cerebrum — Behavioral Intelligence Platform",
      },
      {
        property: "og:description",
        content:
          "Most productivity tools record what you did. Cerebrum studies how you operate.",
      },
    ],
  }),
  component: LandingPage,
});

function LandingPage() {
  return (
    <div className="min-h-screen bg-background text-foreground">
      <MinimalHeader />
      <main>
        <Hero />
        <ProblemSection />
        <HowItWorks />
        <FeaturesSection />
        <ComparisonSection />
      </main>
    </div>
  );
}

function MinimalHeader() {
  return (
    <header className="border-b border-border/60 bg-background">
      <div className="mx-auto flex h-16 w-full max-w-6xl items-center px-6 sm:px-8">
        <Link
          to="/"
          className="text-[19px] font-bold tracking-tight text-foreground"
        >
          Cerebrum
        </Link>
      </div>
    </header>
  );
}

/* ---------- Shared ---------- */

function SectionEyebrow({
  children,
  tone = "understanding",
}: {
  children: React.ReactNode;
  tone?: "understanding" | "significance";
}) {
  const toneClass =
    tone === "significance" ? "text-significance" : "text-understanding";
  return (
    <p className={`text-[10px] uppercase tracking-[0.22em] ${toneClass}`}>
      {children}
    </p>
  );
}

/* ---------- Hero ---------- */

function Hero() {
  return (
    <section className="relative overflow-hidden border-b border-border/60">
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute -left-40 top-0 h-[520px] w-[520px] rounded-full bg-understanding/12 blur-[140px]" />
        <div className="absolute right-[-200px] top-40 h-[480px] w-[480px] rounded-full bg-action/15 blur-[150px]" />
        <div className="absolute inset-x-0 bottom-0 h-px bg-gradient-to-r from-transparent via-border to-transparent" />
      </div>

      <div className="relative mx-auto w-full max-w-6xl px-6 pb-28 pt-32 sm:pt-40">
        <div className="mx-auto max-w-3xl text-center">
          <h1 className="font-display text-5xl leading-[1.02] tracking-tight text-foreground sm:text-[68px]">
            Understand your behavior.
            <br />
            <span className="text-muted-foreground">Not just your habits.</span>
          </h1>
          <p className="mx-auto mt-7 max-w-2xl text-[15.5px] leading-relaxed text-muted-foreground">
            Most productivity tools record what you did. Cerebrum studies how you operate.
            Track behavior, uncover patterns, and receive evidence-backed assessments
            generated from your behavioral history.
          </p>
          <div className="mt-9 flex flex-wrap items-center justify-center gap-3">
            <Link
              to="/auth/register"
              className="group inline-flex items-center gap-2 rounded-md bg-foreground px-5 py-3 text-[13.5px] font-medium text-background transition-transform hover:-translate-y-px"
            >
              Start Building Your Profile
              <ArrowRight
                className="h-4 w-4 transition-transform group-hover:translate-x-0.5"
                strokeWidth={1.75}
              />
            </Link>
            <Link
              to="/auth/login"
              className="inline-flex items-center gap-2 rounded-md border border-border bg-transparent px-5 py-3 text-[13.5px] text-foreground transition-colors hover:bg-surface"
            >
              Log in
            </Link>
          </div>
        </div>

        <ProductMockup />
      </div>
    </section>
  );
}

/* ---------- Product Mockup ---------- */

function ProductMockup() {
  return (
    <div className="relative mx-auto mt-20 max-w-6xl">
      <div className="pointer-events-none absolute -inset-x-12 -inset-y-10 rounded-[40px] bg-gradient-to-b from-understanding/15 via-transparent to-transparent blur-2xl" />

      <div className="relative overflow-hidden rounded-2xl border border-border bg-surface shadow-[0_40px_120px_-20px_rgba(0,0,0,0.55)]">
        <div className="flex items-center justify-between border-b border-border/70 bg-background/80 px-4 py-2.5">
          <div className="flex items-center gap-1.5">
            <span className="h-2.5 w-2.5 rounded-full bg-failed/70" />
            <span className="h-2.5 w-2.5 rounded-full bg-skipped/70" />
            <span className="h-2.5 w-2.5 rounded-full bg-completed/70" />
          </div>
          <div className="font-display text-[12px] tracking-tight text-tertiary">
            cerebrum / insights
          </div>
          <div className="h-2.5 w-12 rounded-full bg-border" />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-[180px_minmax(0,1fr)]">
          <aside className="hidden border-r border-border/70 bg-background p-4 lg:block">
            <div className="mb-6 flex items-center gap-2">
              <span className="grid h-6 w-6 place-items-center rounded border border-border bg-surface">
                <span className="h-1 w-1 rounded-full bg-understanding" />
              </span>
              <span className="font-display text-[14px] tracking-tight">Cerebrum</span>
            </div>
            {["Dashboard", "Goals", "Tasks", "Settings"].map((label, i) => (
              <div
                key={label}
                className={`relative mb-0.5 flex items-center gap-2 rounded px-2 py-1.5 text-[12px] ${
                  i === 0 ? "text-foreground" : "text-tertiary"
                }`}
              >
                {i === 0 && (
                  <span className="absolute left-0 top-1/2 h-3 w-px -translate-y-1/2 bg-understanding" />
                )}
                <span className="h-1 w-1 rounded-full bg-current opacity-60" />
                {label}
              </div>
            ))}
          </aside>

          <div className="space-y-6 bg-background p-6 sm:p-8">
            <div className="relative overflow-hidden rounded-xl border border-border bg-surface-elevated p-6 sm:p-8">
              <div className="pointer-events-none absolute -right-20 -top-24 h-56 w-56 rounded-full bg-understanding/15 blur-3xl" />
              <div className="relative">
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <p className="text-[9.5px] uppercase tracking-[0.22em] text-understanding">
                      Current Assessment
                    </p>
                    <h3 className="mt-3 font-display text-[34px] leading-[1.05] tracking-tight text-foreground">
                      Sustainable Performer
                    </h3>
                  </div>
                  <span className="shrink-0 rounded-full border border-understanding/40 bg-understanding/10 px-2.5 py-1 text-[10.5px] text-foreground">
                    <span className="font-display text-[13px] mr-1">87%</span>
                    <span className="text-muted-foreground">confidence</span>
                  </span>
                </div>
                <p className="mt-5 max-w-xl font-display text-[15px] leading-[1.55] text-muted-foreground">
                  <Quote
                    className="mr-1.5 -mt-1 inline h-3.5 w-3.5 text-understanding/60"
                    strokeWidth={1.5}
                  />
                  Execution is composed and resilient. Recovery after misses is fast,
                  and rhythm holds across weeks rather than sprinting and crashing.
                </p>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-px overflow-hidden rounded-lg border border-border bg-border sm:grid-cols-4">
              <SnapshotTile label="Reliability" value="84" />
              <SnapshotTile label="Follow Through" value="71" />
              <SnapshotTile label="Recovery" value="92" />
              <SnapshotTile label="Stability" value="78" />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function SnapshotTile({ label, value }: { label: string; value: string }) {
  const v = Number(value);
  const dash = `${v * 1.6} 200`;
  return (
    <div className="bg-surface p-4">
      <p className="text-[9.5px] uppercase tracking-[0.18em] text-tertiary">{label}</p>
      <div className="mt-3 flex items-center gap-3">
        <svg width="46" height="46" viewBox="0 0 46 46">
          <circle
            cx="23"
            cy="23"
            r="19"
            stroke="currentColor"
            strokeOpacity="0.18"
            strokeWidth="3"
            fill="none"
          />
          <circle
            cx="23"
            cy="23"
            r="19"
            stroke="var(--understanding)"
            strokeWidth="3"
            fill="none"
            strokeLinecap="round"
            strokeDasharray={dash}
            transform="rotate(-90 23 23)"
          />
        </svg>
        <span className="font-display text-[20px] tracking-tight text-foreground">{value}</span>
      </div>
    </div>
  );
}

/* ---------- Problem ---------- */

function ProblemSection() {
  const cards = [
    {
      title: "Tracking isn't intelligence.",
      body: "Most apps collect streaks, completions, and percentages without explaining what they actually mean.",
    },
    {
      title: "Humans are poor pattern detectors.",
      body: "We remember recent successes and failures while missing long-term behavioral trends.",
    },
    {
      title: "Behavior changes before results do.",
      body: "The earliest signals of progress, decline, recovery, or instability often go unnoticed.",
    },
  ];

  return (
    <section className="border-b border-border/60 py-28">
      <div className="mx-auto w-full max-w-6xl px-6">
        <SectionEyebrow>The Problem</SectionEyebrow>
        <h2 className="mt-4 max-w-3xl font-display text-4xl leading-[1.08] tracking-tight text-foreground sm:text-5xl">
          Data is everywhere.
          <br />
          <span className="text-muted-foreground">Understanding is rare.</span>
        </h2>

        <div className="mt-14 grid gap-px overflow-hidden rounded-xl border border-border bg-border md:grid-cols-3">
          {cards.map((c, i) => (
            <div key={c.title} className="flex h-full flex-col bg-surface p-8">
              <span className="font-display text-[13px] text-tertiary">0{i + 1}</span>
              <h3 className="mt-5 font-display text-[22px] leading-[1.2] tracking-tight text-foreground">
                {c.title}
              </h3>
              <p className="mt-3 text-[14px] leading-relaxed text-muted-foreground">{c.body}</p>
            </div>
          ))}
        </div>

        <div className="mt-14 border-l-2 border-significance/70 pl-6">
          <p className="font-display text-[22px] leading-[1.35] tracking-tight text-foreground sm:text-[26px]">
            You don't need more data.
            <br />
            <span className="text-muted-foreground">
              You need a system that can interpret it.
            </span>
          </p>
        </div>
      </div>
    </section>
  );
}

/* ---------- How It Works ---------- */

function HowItWorks() {
  const steps = [
    {
      n: "01",
      title: "Log Behavior",
      body: "Record completed, skipped, and failed actions as they happen.",
    },
    {
      n: "02",
      title: "Behavioral Signals",
      body: "Raw activity becomes measurable signals — consistency, momentum, recovery, adherence, stability.",
    },
    {
      n: "03",
      title: "Interpretation Layer",
      body: "Signals are combined into meaningful assessments that explain what is actually happening.",
    },
    {
      n: "04",
      title: "Behavioral Intelligence",
      body: "Evidence-backed insights, recommendations, and behavioral assessments.",
    },
  ];

  return (
    <section id="how" className="border-b border-border/60 py-28">
      <div className="mx-auto w-full max-w-6xl px-6">
        <SectionEyebrow>How Cerebrum Works</SectionEyebrow>
        <h2 className="mt-4 max-w-3xl font-display text-4xl leading-[1.08] tracking-tight text-foreground sm:text-5xl">
          From behavior to intelligence.
        </h2>

        <div className="relative mt-16">
          <div className="absolute left-0 right-0 top-[34px] hidden h-px bg-gradient-to-r from-transparent via-border to-transparent md:block" />
          <div className="relative grid gap-10 md:grid-cols-4">
            {steps.map((s) => (
              <div key={s.n}>
                <div className="relative grid h-[68px] w-[68px] place-items-center rounded-full border border-border bg-surface-elevated">
                  <span className="font-display text-[15px] tracking-tight text-understanding">
                    {s.n}
                  </span>
                </div>
                <h3 className="mt-5 font-display text-[19px] tracking-tight text-foreground">
                  {s.title}
                </h3>
                <p className="mt-2 text-[13.5px] leading-relaxed text-muted-foreground">
                  {s.body}
                </p>
              </div>
            ))}
          </div>
        </div>

        <div className="mt-24 grid gap-10 lg:grid-cols-[1fr_auto] lg:items-center">
          <div>
            <SectionEyebrow tone="significance">Architecture</SectionEyebrow>
            <h3 className="mt-3 font-display text-[28px] leading-[1.15] tracking-tight text-foreground sm:text-[34px]">
              A deterministic pipeline from raw action to interpretable insight.
            </h3>
            <p className="mt-4 max-w-xl text-[14.5px] leading-relaxed text-muted-foreground">
              Cerebrum is built as layered intelligence. Each layer has a single job,
              and every conclusion can be traced back to the behavior that produced it.
            </p>
          </div>
          <ArchitectureStack />
        </div>
      </div>
    </section>
  );
}

function ArchitectureStack() {
  const layers = [
    { label: "Task Logs", tone: "neutral" },
    { label: "Signals", tone: "action" },
    { label: "Interpretations", tone: "understanding" },
    { label: "Recommendations", tone: "significance" },
    { label: "Narrative Layer", tone: "foreground" },
  ] as const;

  const toneClass: Record<string, string> = {
    neutral: "text-tertiary",
    action: "text-action",
    understanding: "text-understanding",
    significance: "text-significance",
    foreground: "text-foreground",
  };

  return (
    <div className="w-full max-w-sm">
      <div className="rounded-xl border border-border bg-surface p-3">
        {layers.map((l, i) => (
          <div key={l.label}>
            <div className="flex items-center justify-between rounded-md border border-border/70 bg-surface-elevated px-4 py-3">
              <span
                className={`font-display text-[15px] tracking-tight ${toneClass[l.tone]}`}
              >
                {l.label}
              </span>
              <span className="font-display text-[11px] tracking-[0.18em] text-tertiary">
                L{i + 1}
              </span>
            </div>
            {i < layers.length - 1 && (
              <div className="my-1.5 flex justify-center">
                <div className="h-4 w-px bg-border" />
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}

/* ---------- Features ---------- */

function FeaturesSection() {
  return (
    <section id="features" className="border-b border-border/60 py-28">
      <div className="mx-auto w-full max-w-6xl px-6">
        <SectionEyebrow>Features</SectionEyebrow>
        <h2 className="mt-4 max-w-3xl font-display text-4xl leading-[1.08] tracking-tight text-foreground sm:text-5xl">
          A system built to understand behavior.
        </h2>

        <div className="mt-20 space-y-28">
          <FeatureRow
            n="01"
            title="Action-Focused Dashboard"
            body="Know exactly what deserves attention today. The dashboard prioritizes execution and logging, not analytics overload."
            visual={<DashboardVisual />}
          />
          <FeatureRow
            reverse
            n="02"
            title="Behavioral Assessments"
            body="Cerebrum identifies recurring behavioral patterns and explains them with confidence scores and supporting evidence."
            bullets={[
              "Sustainable Performer",
              "Recovery Pattern",
              "Burnout Risk",
              "Declining",
              "Chaotic Behavior",
              "Weekend Warrior",
            ]}
            visual={<AssessmentVisual />}
          />
          <FeatureRow
            n="03"
            title="Behavioral Snapshot"
            body="See the structure behind your behavior — reliability, recovery, stability, follow-through, direction, and execution rhythms."
            visual={<SnapshotVisual />}
          />
          <FeatureRow
            reverse
            n="04"
            title="Evidence-Based Insights"
            body="Every conclusion is backed by measurable behavioral signals. No vague motivational advice. No black-box AI opinions."
            visual={<EvidenceVisual />}
          />
          <FeatureRow
            n="05"
            title="Deterministic Intelligence"
            body="The backend thinks. The AI explains. Cerebrum separates analysis from narration so intelligence remains transparent, measurable, and explainable."
            visual={<DeterministicVisual />}
          />
        </div>
      </div>
    </section>
  );
}

function FeatureRow({
  n,
  title,
  body,
  bullets,
  visual,
  reverse,
}: {
  n: string;
  title: string;
  body: string;
  bullets?: string[];
  visual: React.ReactNode;
  reverse?: boolean;
}) {
  return (
    <div className="grid items-center gap-12 lg:grid-cols-2 lg:gap-20">
      <div className={reverse ? "lg:order-2" : ""}>
        <span className="font-display text-[13px] tracking-[0.18em] text-significance">
          {n} —
        </span>
        <h3 className="mt-4 font-display text-[30px] leading-[1.1] tracking-tight text-foreground sm:text-[36px]">
          {title}
        </h3>
        <p className="mt-4 max-w-xl text-[14.5px] leading-relaxed text-muted-foreground">
          {body}
        </p>
        {bullets && (
          <ul className="mt-6 flex flex-wrap gap-2">
            {bullets.map((b) => (
              <li
                key={b}
                className="rounded-full border border-border bg-surface px-3 py-1 text-[12px] text-muted-foreground"
              >
                {b}
              </li>
            ))}
          </ul>
        )}
      </div>
      <div className={reverse ? "lg:order-1" : ""}>{visual}</div>
    </div>
  );
}

/* Feature visuals */

function MockFrame({ children, label }: { children: React.ReactNode; label: string }) {
  return (
    <div className="relative overflow-hidden rounded-xl border border-border bg-surface shadow-[0_30px_80px_-30px_rgba(0,0,0,0.6)]">
      <div className="flex items-center justify-between border-b border-border/70 bg-background/80 px-3 py-2">
        <div className="flex items-center gap-1">
          <span className="h-2 w-2 rounded-full bg-failed/60" />
          <span className="h-2 w-2 rounded-full bg-skipped/60" />
          <span className="h-2 w-2 rounded-full bg-completed/60" />
        </div>
        <span className="font-display text-[10.5px] tracking-tight text-tertiary">{label}</span>
        <span className="h-2 w-8 rounded-full bg-border" />
      </div>
      <div className="bg-background p-5">{children}</div>
    </div>
  );
}

function DashboardVisual() {
  const tasks = [
    { name: "Morning training block", goal: "Strength", status: "completed" },
    { name: "Deep work — chapter 4", goal: "Manuscript", status: "completed" },
    { name: "Stretching routine", goal: "Mobility", status: "pending" },
    { name: "Reading — 25 min", goal: "Learning", status: "skipped" },
  ];
  const dot: Record<string, string> = {
    completed: "bg-completed",
    skipped: "bg-skipped",
    pending: "bg-neutral",
  };
  return (
    <MockFrame label="cerebrum / dashboard">
      <p className="text-[9.5px] uppercase tracking-[0.22em] text-tertiary">Today's Focus</p>
      <h4 className="mt-2 font-display text-[24px] tracking-tight text-foreground">Today</h4>
      <div className="mt-5 space-y-1.5">
        {tasks.map((t) => (
          <div
            key={t.name}
            className="flex items-center justify-between rounded-md border border-border/70 bg-surface px-3 py-2.5"
          >
            <div className="flex items-center gap-3">
              <span className={`h-1.5 w-1.5 rounded-full ${dot[t.status]}`} />
              <div>
                <p className="text-[12.5px] text-foreground">{t.name}</p>
                <p className="text-[10.5px] text-tertiary">{t.goal}</p>
              </div>
            </div>
            <span className="text-[10.5px] uppercase tracking-[0.18em] text-tertiary">
              {t.status}
            </span>
          </div>
        ))}
      </div>
    </MockFrame>
  );
}

function AssessmentVisual() {
  return (
    <MockFrame label="cerebrum / assessment">
      <div className="relative overflow-hidden rounded-lg border border-border bg-surface-elevated p-5">
        <div className="pointer-events-none absolute -right-16 -top-16 h-40 w-40 rounded-full bg-understanding/15 blur-3xl" />
        <div className="relative">
          <p className="text-[9.5px] uppercase tracking-[0.22em] text-understanding">
            Current Assessment
          </p>
          <h4 className="mt-2 font-display text-[26px] leading-[1.05] tracking-tight text-foreground">
            Recovery Pattern
          </h4>
          <span className="mt-3 inline-flex rounded-full border border-understanding/40 bg-understanding/10 px-2 py-0.5 text-[10px] text-foreground">
            <span className="font-display text-[11px] mr-1">82%</span>
            <span className="text-muted-foreground">confidence</span>
          </span>
          <p className="mt-4 font-display text-[13px] leading-[1.5] text-muted-foreground">
            Behavior rebounding after a four-day disruption. Rhythm is restored and
            follow-through is accelerating.
          </p>
          <div className="mt-4 space-y-1.5">
            {["Reliability climbed +18 in 6 days", "Two consecutive recovery cycles"].map((e) => (
              <div key={e} className="flex items-start gap-2 text-[11.5px] text-foreground/80">
                <span className="mt-1.5 h-px w-3 bg-understanding/70" />
                <span>{e}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </MockFrame>
  );
}

function SnapshotVisual() {
  return (
    <MockFrame label="cerebrum / snapshot">
      <p className="text-[9.5px] uppercase tracking-[0.22em] text-tertiary">Behavioral Snapshot</p>
      <div className="mt-3 grid grid-cols-2 gap-px overflow-hidden rounded-lg border border-border bg-border">
        <SnapshotTile label="Reliability" value="84" />
        <SnapshotTile label="Follow Through" value="71" />
        <SnapshotTile label="Recovery" value="92" />
        <SnapshotTile label="Stability" value="78" />
      </div>
    </MockFrame>
  );
}

function EvidenceVisual() {
  return (
    <MockFrame label="cerebrum / evidence">
      <div className="grid gap-3 sm:grid-cols-2">
        <div className="rounded-lg border border-border bg-surface p-4">
          <p className="text-[9.5px] uppercase tracking-[0.22em] text-tertiary">Strong Signals</p>
          <ul className="mt-3 space-y-2">
            {["Adherence stable for 21 days", "Recovery cycle under 48h"].map((s) => (
              <li key={s} className="flex items-start gap-2 text-[12px] text-foreground/85">
                <span className="mt-1.5 h-1.5 w-1.5 rounded-full bg-completed" />
                {s}
              </li>
            ))}
          </ul>
        </div>
        <div className="rounded-lg border border-border bg-surface p-4">
          <p className="text-[9.5px] uppercase tracking-[0.22em] text-tertiary">Emerging Signals</p>
          <ul className="mt-3 space-y-2">
            {["Late-week drift building", "Skip clustering on Thursdays"].map((s) => (
              <li key={s} className="flex items-start gap-2 text-[12px] text-foreground/85">
                <span className="mt-1.5 h-1.5 w-1.5 rounded-full bg-understanding" />
                {s}
              </li>
            ))}
          </ul>
        </div>
      </div>
      <div className="mt-3 rounded-lg border border-border bg-surface/60 px-4 py-3 text-[10.5px] uppercase tracking-[0.18em] text-tertiary">
        Technical Details · for the curious
      </div>
    </MockFrame>
  );
}

function DeterministicVisual() {
  return (
    <div className="rounded-xl border border-border bg-surface p-6 sm:p-8">
      <p className="text-[10px] uppercase tracking-[0.22em] text-tertiary">Architecture</p>
      <div className="mt-5 grid grid-cols-1 gap-3 sm:grid-cols-[1fr_auto_1fr] sm:items-stretch">
        <div className="rounded-lg border border-border bg-surface-elevated p-5">
          <div className="flex items-center gap-2">
            <BrainCircuit className="h-4 w-4 text-understanding" strokeWidth={1.6} />
            <p className="font-display text-[13px] tracking-tight text-foreground">Backend</p>
          </div>
          <p className="mt-3 font-display text-[20px] leading-tight tracking-tight text-foreground">
            Thinks.
          </p>
          <p className="mt-2 text-[12px] leading-relaxed text-muted-foreground">
            Deterministic signal engineering. Pattern detection. Classification.
          </p>
        </div>
        <div className="hidden items-center justify-center sm:flex">
          <div className="h-px w-10 bg-border" />
        </div>
        <div className="rounded-lg border border-border bg-surface-elevated p-5">
          <div className="flex items-center gap-2">
            <Sparkles className="h-4 w-4 text-significance" strokeWidth={1.6} />
            <p className="font-display text-[13px] tracking-tight text-foreground">AI Layer</p>
          </div>
          <p className="mt-3 font-display text-[20px] leading-tight tracking-tight text-foreground">
            Explains.
          </p>
          <p className="mt-2 text-[12px] leading-relaxed text-muted-foreground">
            Narrates findings in plain language. Never invents conclusions.
          </p>
        </div>
      </div>
      <p className="mt-6 text-[12px] leading-relaxed text-tertiary">
        Analysis and narration are intentionally separated. Intelligence stays
        transparent, measurable, and explainable.
      </p>
    </div>
  );
}

/* ---------- Comparison ---------- */

function ComparisonSection() {
  const rows = [
    { tracker: "Tracks completions", cerebrum: "Behavioral analysis" },
    { tracker: "Shows streaks", cerebrum: "Signal engineering" },
    { tracker: "Basic statistics", cerebrum: "Pattern detection" },
    { tracker: "Generic reminders", cerebrum: "Behavioral assessments" },
    { tracker: "—", cerebrum: "Explainable recommendations" },
    { tracker: "—", cerebrum: "Long-term intelligence" },
  ];

  return (
    <section id="why" className="py-28">
      <div className="mx-auto w-full max-w-6xl px-6">
        <SectionEyebrow>Why Cerebrum</SectionEyebrow>
        <h2 className="mt-4 max-w-3xl font-display text-4xl leading-[1.08] tracking-tight text-foreground sm:text-5xl">
          Most tools track behavior.
          <br />
          <span className="text-muted-foreground">Cerebrum studies it.</span>
        </h2>

        <div className="mt-14 overflow-hidden rounded-xl border border-border bg-surface">
          <div className="grid grid-cols-[1fr_1fr] border-b border-border bg-background/40">
            <div className="px-6 py-4">
              <p className="text-[10px] uppercase tracking-[0.22em] text-tertiary">
                Habit Tracker
              </p>
            </div>
            <div className="border-l border-border px-6 py-4">
              <p className="text-[10px] uppercase tracking-[0.22em] text-understanding">
                Cerebrum
              </p>
            </div>
          </div>
          {rows.map((r, i) => (
            <div
              key={i}
              className={`grid grid-cols-[1fr_1fr] ${
                i !== rows.length - 1 ? "border-b border-border/60" : ""
              }`}
            >
              <div className="flex items-center gap-3 px-6 py-5 text-[13.5px] text-muted-foreground">
                <Minus className="h-3.5 w-3.5 text-tertiary" strokeWidth={1.75} />
                {r.tracker}
              </div>
              <div className="flex items-center gap-3 border-l border-border/60 px-6 py-5 text-[13.5px] text-foreground">
                <Check className="h-3.5 w-3.5 text-understanding" strokeWidth={2} />
                {r.cerebrum}
              </div>
            </div>
          ))}
        </div>

        <div className="mt-16 flex justify-center">
          <Link
            to="/auth/register"
            className="group inline-flex items-center gap-2 rounded-md bg-foreground px-5 py-3 text-[13.5px] font-medium text-background transition-transform hover:-translate-y-px"
          >
            Start Building Your Profile
            <ArrowRight
              className="h-4 w-4 transition-transform group-hover:translate-x-0.5"
              strokeWidth={1.75}
            />
          </Link>
        </div>
      </div>
    </section>
  );
}