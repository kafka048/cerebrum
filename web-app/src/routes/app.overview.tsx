import { useState } from "react";
import { Plus } from "lucide-react";
import { createFileRoute } from "@tanstack/react-router";
import { PageShell, PageHeader } from "@/components/cerebrum/page-shell";
import { useCerebrumState } from "@/lib/cerebrum-state";
import { GoalCard } from "@/components/cerebrum/goal-card";
import { CreateGoalDialog } from "@/components/cerebrum/onboarding/dialogs";

export const Route = createFileRoute("/app/overview")({
  head: () => ({
    meta: [
      { title: "Overview — Cerebrum" },
      { name: "description", content: "Build and maintain your behavioral system." },
    ],
  }),
  component: OverviewPage,
});

function OverviewPage() {
  const { goals, hasGoals } = useCerebrumState();
  const [goalDialogOpen, setGoalDialogOpen] = useState(false);

  return (
    <PageShell>
      <PageHeader
        eyebrow="Overview"
        title="Your behavioral system"
        description="Every goal you're working on, and every task that supports it."
        right={
          <button
            onClick={() => setGoalDialogOpen(true)}
            className="inline-flex items-center gap-2 rounded-md border border-border bg-surface px-3 py-2 text-[12px] text-muted-foreground transition-colors hover:border-understanding/60 hover:text-foreground"
          >
            <Plus className="h-3.5 w-3.5" strokeWidth={1.75} />
            Add Goal
          </button>
        }
      />

      {!hasGoals ? (
        <div className="rounded-lg border border-border bg-surface p-10 text-center">
          <p className="font-display text-[20px] tracking-tight text-foreground">
            No goals yet.
          </p>
          <p className="mt-2 text-[13.5px] text-muted-foreground">
            Create your first goal to begin building your behavioral system.
          </p>
          <button
            onClick={() => setGoalDialogOpen(true)}
            className="mt-6 inline-flex items-center gap-2 rounded-md bg-foreground px-4 py-2.5 text-[13px] font-medium text-background"
          >
            <Plus className="h-3.5 w-3.5" strokeWidth={1.75} />
            Create Goal
          </button>
        </div>
      ) : (
        <div className="grid items-start gap-6 md:grid-cols-2">
          {goals.map((g) => (
            <GoalCard key={g.id} goalId={g.id} />
          ))}
        </div>
      )}

      <CreateGoalDialog open={goalDialogOpen} onOpenChange={setGoalDialogOpen} />
    </PageShell>
  );
}
