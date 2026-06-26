import { useState } from "react";
import { ChevronDown } from "lucide-react";
import { cn } from "@/lib/utils";

type Item = {
  title: string;
  status: "Currently Building" | "Researching" | "Exploring";
  body: string;
};

const ITEMS: Item[] = [
  {
    title: "Goal-Level Intelligence",
    status: "Currently Building",
    body: "Right now Cerebrum reads behavior one task at a time. I'm working on the next layer: understanding how tasks connect to the goals behind them, and what that connection reveals.",
  },
  {
    title: "AI Narrative Layer",
    status: "Currently Building",
    body: "This is the layer I always meant to build: something that turns raw signal into a story, not just what happened, but what it means.",
  },
  {
    title: "Commitment-Based Tasks",
    status: "Researching",
    body: "Not everything worth doing happens daily. I'm exploring how Cerebrum could track commitment reliability separately from execution reliability: whether you show up for something, not just whether you finish it on schedule.",
  },
  {
    title: "User-Level Intelligence",
    status: "Exploring",
    body: "The harder question: can patterns be found across a whole person, not just a single goal or task? Still early. Honestly not sure yet how far this one goes, but it's the most interesting problem on the list.",
  },
];

export function PeekIntoWhatsNext() {
  const [open, setOpen] = useState(false);

  return (
    <section>
      <div className="mb-6">
        <h2 className="font-display text-[26px] leading-[1.2] tracking-tight text-foreground">
          Cerebrum Is Evolving.
          <br />
          <span className="text-muted-foreground">Just Like You.</span>
        </h2>
      </div>

      <button
        onClick={() => setOpen((v) => !v)}
        aria-expanded={open}
        className="grid w-full grid-cols-[minmax(0,1fr)_auto] items-center gap-4 rounded-lg border border-border bg-surface px-6 py-5 text-left transition-colors hover:bg-surface-elevated"
      >
        <span className="font-display text-[16px] tracking-tight text-foreground">
          Peek Into What's Next
        </span>
        <ChevronDown
          className={cn(
            "h-4 w-4 shrink-0 text-tertiary transition-transform",
            open && "rotate-180 text-foreground",
          )}
          strokeWidth={1.75}
        />
      </button>

      {open && (
        <div className="mt-6 space-y-10 px-1 pb-2">
          <p className="text-[14.5px] leading-relaxed text-muted-foreground">
            A few things I'm currently thinking about for Cerebrum. Not a roadmap, just where my
            head's at, and where it might go next.
          </p>

          <div className="space-y-9">
            {ITEMS.map((item) => (
              <div key={item.title}>
                <h3 className="font-display text-[19px] tracking-tight text-foreground">
                  {item.title}
                </h3>
                <p className="mt-1.5 text-[11.5px] uppercase tracking-[0.18em] text-significance">
                  Status: {item.status}
                </p>
                <p className="mt-3 text-[14px] leading-relaxed text-muted-foreground">
                  {item.body}
                </p>
              </div>
            ))}
          </div>
        </div>
      )}
    </section>
  );
}
