import { cn } from "@/lib/utils";

export function RadialProgress({
  value,
  size = 84,
  stroke = 5,
  className,
}: {
  value: number; // 0..1
  size?: number;
  stroke?: number;
  className?: string;
}) {
  const r = (size - stroke) / 2;
  const c = 2 * Math.PI * r;
  const offset = c * (1 - Math.max(0, Math.min(1, value)));
  return (
    <svg width={size} height={size} className={cn("block", className)}>
      <circle
        cx={size / 2}
        cy={size / 2}
        r={r}
        fill="none"
        stroke="var(--border)"
        strokeWidth={stroke}
      />
      <circle
        cx={size / 2}
        cy={size / 2}
        r={r}
        fill="none"
        stroke="var(--understanding)"
        strokeWidth={stroke}
        strokeLinecap="round"
        strokeDasharray={c}
        strokeDashoffset={offset}
        transform={`rotate(-90 ${size / 2} ${size / 2})`}
      />
    </svg>
  );
}

export function RhythmBars({ bars }: { bars: number[] }) {
  const max = Math.max(...bars, 1);
  return (
    <div className="flex h-10 items-end gap-[3px]">
      {bars.map((b, i) => (
        <span
          key={i}
          className="w-1.5 rounded-sm bg-understanding/70"
          style={{ height: `${(b / max) * 100}%`, opacity: 0.4 + (b / max) * 0.6 }}
        />
      ))}
    </div>
  );
}
