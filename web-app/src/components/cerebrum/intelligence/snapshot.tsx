import { ArrowUpRight, MoveRight, ArrowDownRight, RotateCcw } from "lucide-react";
import { cn } from "@/lib/utils";
import type { Direction, TaskSnapshot } from "@/lib/cerebrum-data";
import { RadialProgress } from "../charts";

export function IntelligenceSnapshot({ snapshot }: { snapshot: TaskSnapshot }) {
  return (
    <section>
      <SectionHeading eyebrow="Intelligence Snapshot" title="The structure behind the pattern" />
      <div className="grid grid-cols-1 gap-px overflow-hidden rounded-lg border border-border bg-border sm:grid-cols-2 lg:grid-cols-3">
        <RadialTile label="Reliability" value={snapshot.reliability} context="Historical execution quality" />
        <RadialTile label="Follow Through" value={snapshot.followThrough} context="Recent execution quality" />
        <RadialTile label="Stability" value={snapshot.stability} context="Overall sustainability" />
        <DirectionTile direction={snapshot.direction} />
        <NumericTile label="Current Streak" primary={`${snapshot.currentStreak} days`} context="Active consecutive completions" />
        <NumericTile label="Strongest Run" primary={`${snapshot.strongestRun} days`} context="Longest continuous streak on record" />
      </div>
    </section>
  );
}

function TileShell({
  label,
  context,
  children,
  className,
}: {
  label: string;
  context: string;
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <div className={cn("flex flex-col justify-between bg-surface p-5 min-h-[170px]", className)}>
      <p className="text-[10px] uppercase tracking-[0.18em] text-tertiary">{label}</p>
      <div className="my-3 flex-1">{children}</div>
      <p className="text-[11px] text-tertiary leading-snug">{context}</p>
    </div>
  );
}

function RadialTile({ label, value, context }: { label: string; value: number; context: string }) {
  return (
    <TileShell label={label} context={context}>
      <div className="flex items-center gap-4">
        <div className="relative">
          <RadialProgress value={value} size={72} stroke={4} />
          <span className="absolute inset-0 grid place-items-center font-display text-[15px] text-foreground">
            {Math.round(value * 100)}
          </span>
        </div>
      </div>
    </TileShell>
  );
}

function DirectionTile({ direction }: { direction: Direction }) {
  const map = {
    Building: { icon: ArrowUpRight, color: "text-completed" },
    Stable: { icon: MoveRight, color: "text-muted-foreground" },
    Slowing: { icon: ArrowDownRight, color: "text-skipped" },
    Recovering: { icon: RotateCcw, color: "text-understanding" },
  } as const;
  const { icon: Icon, color } = map[direction];
  return (
    <TileShell label="Direction" context="Trajectory over the recent window">
      <div className="flex items-center gap-3">
        <Icon className={cn("h-7 w-7", color)} strokeWidth={1.5} />
        <span className="font-display text-[24px] tracking-tight text-foreground">{direction}</span>
      </div>
    </TileShell>
  );
}

function NumericTile({ label, primary, context }: { label: string; primary: string; context: string }) {
  return (
    <TileShell label={label} context={context}>
      <div className="flex items-end gap-2">
        <span className="font-display text-[28px] leading-none tracking-tight text-foreground">
          {primary}
        </span>
      </div>
    </TileShell>
  );
}

function SectionHeading({ eyebrow, title }: { eyebrow: string; title: string }) {
  return (
    <div className="mb-6">
      <p className="mb-2 text-[10px] uppercase tracking-[0.22em] text-tertiary">{eyebrow}</p>
      <h2 className="font-display text-2xl tracking-tight text-foreground">{title}</h2>
    </div>
  );
}
