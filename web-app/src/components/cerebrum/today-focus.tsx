import { useCerebrumState } from "@/lib/cerebrum-state";
import { TaskRow } from "./task-row";

export function TodayFocus() {
  const { goals } = useCerebrumState();
  const totalTasks = goals.reduce((n, g) => n + g.tasks.length, 0);

  return (
    <section>
      <div className="mb-6 flex items-baseline justify-between">
        <h2 className="font-display text-[22px] tracking-tight text-foreground">Today's Focus</h2>
        <p className="text-[11px] uppercase tracking-[0.18em] text-tertiary">
          {totalTasks} tasks · {goals.length} goals
        </p>
      </div>

      <div className="space-y-8">
        {goals.map((goal) => (
          <div key={goal.id}>
            <div className="mb-3 flex items-baseline gap-3">
              <h3 className="font-display text-base text-foreground">{goal.name}</h3>
              {goal.purpose && <span className="text-[11px] text-tertiary">{goal.purpose}</span>}
            </div>
            <div className="space-y-1.5">
              {goal.tasks.map((t) => (
                <TaskRow key={t.id} task={t} />
              ))}
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
