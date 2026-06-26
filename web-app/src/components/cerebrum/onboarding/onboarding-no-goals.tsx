import { useState } from "react";
import { ArrowRight, Target, ListChecks, Activity, Waves, Sparkles } from "lucide-react";
import { CreateGoalDialog } from "./dialogs";


const STEPS = [
  {
    n: "01",
    title: "Create Goals",
    body: "Choose the areas of life you want to improve.",
    icon: Target,
  },
  {
    n: "02",
    title: "Add Tasks",
    body: "Define the actions that move those goals forward.",
    icon: ListChecks,
  },
  {
    n: "03",
    title: "Log Behavior",
    body: "Record completed, skipped, and failed actions.",
    icon: Activity,
  },
  {
    n: "04",
    title: "Pattern Detection",
    body: "Cerebrum analyzes behavioral signals such as consistency, momentum, recovery, and reliability.",
    icon: Waves,
  },
  {
    n: "05",
    title: "Behavioral Intelligence",
    body: "Receive assessments, observations, and recommendations based on accumulated behavior.",
    icon: Sparkles,
  },
];

export function OnboardingNoGoals() {
  const [open, setOpen] = useState(false);

  return (
    <div className="mx-auto w-full max-w-3xl px-6 pt-20 pb-24 sm:pt-28">
      <div className="text-center">
        <p className="text-[10px] uppercase tracking-[0.22em] text-understanding">Welcome</p>
        <h1 className="mt-5 font-display text-4xl leading-[1.05] tracking-tight text-foreground sm:text-[52px]">
          Behavioral Intelligence
          <br />
          <span className="text-muted-foreground">Begins With Behavior</span>
        </h1>
        <p className="mx-auto mt-6 max-w-xl text-[15px] leading-relaxed text-muted-foreground">
          Create your first goal to begin building your behavioral profile.
        </p>
        <div className="mt-8 flex items-center justify-center gap-3">
          <button
            onClick={() => setOpen(true)}
            className="group inline-flex items-center gap-2 rounded-md bg-foreground px-5 py-3 text-[13.5px] font-medium text-background transition-transform hover:-translate-y-px"
          >
            Create Goal
            <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" strokeWidth={1.75} />
          </button>
        </div>
      </div>


      <div className="mt-24">
        <p className="mb-8 text-center text-[10px] uppercase tracking-[0.22em] text-tertiary">
          How Cerebrum Works
        </p>
        <ol className="relative mx-auto max-w-xl space-y-px overflow-hidden rounded-lg border border-border bg-border">
          {STEPS.map((s) => (
            <li key={s.n} className="grid grid-cols-[auto_minmax(0,1fr)] items-start gap-5 bg-surface p-6">
              <div className="grid h-10 w-10 place-items-center rounded-full border border-border bg-surface-elevated">
                <s.icon className="h-4 w-4 text-understanding" strokeWidth={1.6} />
              </div>
              <div className="min-w-0">
                <div className="flex items-baseline gap-3">
                  <span className="font-display text-[11px] tracking-[0.18em] text-tertiary">
                    {s.n}
                  </span>
                  <h3 className="font-display text-[17px] tracking-tight text-foreground">
                    {s.title}
                  </h3>
                </div>
                <p className="mt-1.5 text-[13.5px] leading-relaxed text-muted-foreground">
                  {s.body}
                </p>
              </div>
            </li>
          ))}
        </ol>
      </div>

      <CreateGoalDialog open={open} onOpenChange={setOpen} />
    </div>
  );
}
