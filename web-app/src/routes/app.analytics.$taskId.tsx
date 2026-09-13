import { createFileRoute, Link, useParams } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { getTask } from "@/api/tasks";
import { getAnalytics } from "@/api/analytics";
import { getTasklogsByTask } from "@/api/tasklogs";
import { SignalBadge } from "@/components/telemetry/signal-badge";
import { MetricCard } from "@/components/telemetry/metric-card";
import { MomentumIndicator } from "@/components/telemetry/momentum-indicator";
import { StreakStrip } from "@/components/telemetry/streak-strip";
import { TemporalAdherenceChart } from "@/components/telemetry/temporal-adherence-chart";
import { ArrowLeft, Sparkles, CheckCircle2, Clock, ChevronDown, Info } from "lucide-react";
import { useState } from "react";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/app/analytics/$taskId")({
  head: () => ({
    meta: [
      { title: "Habit Insights — Cerebrum" },
      { name: "description", content: "Understand your personal habits and momentum patterns." },
    ],
  }),
  component: TaskAnalyticsInspectorPage,
});

export function TaskAnalyticsInspectorPage() {
  const { taskId } = useParams({ from: "/app/analytics/$taskId" });
  const parsedTaskId = Number(taskId);
  const [showTechnical, setShowTechnical] = useState(false);

  // Fetch task info
  const {
    data: task,
    isLoading: taskLoading,
    error: taskError,
  } = useQuery({
    queryKey: ["task", parsedTaskId],
    queryFn: () => getTask(parsedTaskId),
    enabled: !isNaN(parsedTaskId),
  });

  // Fetch task analytics
  const { data: analytics, isLoading: analyticsLoading } = useQuery({
    queryKey: ["analytics", parsedTaskId],
    queryFn: () => getAnalytics(parsedTaskId),
    enabled: !isNaN(parsedTaskId),
  });

  // Fetch historical logs for task
  const { data: logs = [], isLoading: logsLoading } = useQuery({
    queryKey: ["tasklogs", "task", parsedTaskId],
    queryFn: () => getTasklogsByTask(parsedTaskId),
    enabled: !isNaN(parsedTaskId),
  });

  const isLoading = taskLoading || analyticsLoading || logsLoading;

  if (isLoading) {
    return (
      <div className="flex h-96 items-center justify-center text-[13px] text-text-muted">
        Gathering your habit insights...
      </div>
    );
  }

  if (taskError || !task) {
    return (
      <div className="space-y-4 max-w-3xl mx-auto">
        <Link
          to="/app/analytics"
          className="inline-flex items-center gap-1.5 text-[12px] text-text-muted hover:text-text-primary"
        >
          <ArrowLeft className="h-3.5 w-3.5" />
          <span>Back to Patterns & Insights</span>
        </Link>
        <div className="rounded-md border border-status-miss/30 bg-status-miss/10 p-6 text-center text-[13px] text-status-miss">
          This task could not be found.
        </div>
      </div>
    );
  }

  const isLearning = analytics?.status === "learning" || !analytics?.interpretation;
  const logsCount = logs.length;
  const targetLogs = 7;
  const remaining = Math.max(0, targetLogs - logsCount);
  const learningProgress = Math.min(100, Math.round((logsCount / targetLogs) * 100));

  // Translate profile names to human headlines
  const profileDescriptions: Record<string, { title: string; story: string }> = {
    sustainable: {
      title: "Steady & Sustainable",
      story:
        "You’ve found a pace you can actually maintain. When life gets busy and you miss a day, you get right back on track without losing your rhythm.",
    },
    recovery: {
      title: "Rebounding Rhythm",
      story:
        "After a brief disruption or break, your follow-through has bounced back strongly. You're building fresh momentum.",
    },
    burnout: {
      title: "Signs of Fatigue",
      story:
        "You had a great initial sprint, but misses have begun clustering lately. Consider giving yourself permission to scale back slightly so you don't burn out.",
    },
    declining: {
      title: "Softening Momentum",
      story:
        "Your consistency has dipped over recent days compared to when you started. A single easy check-in today will reignite the habit.",
    },
    chaotic: {
      title: "Variable Rhythm",
      story:
        "You tend to alternate between on-and-off days. Focus on stacking two consecutive completions together to anchor the habit.",
    },
    weekend_warrior: {
      title: "Weekend Focused",
      story:
        "You follow through much more reliably on weekends than weekdays. Aligning your weekday expectations will help ease the pressure.",
    },
  };

  const currentProfileKey =
    analytics?.interpretation?.primary_profile?.profile?.toLowerCase().replace(/\s+/g, "_") || "";
  const profileInfo = profileDescriptions[currentProfileKey] || {
    title: analytics?.interpretation?.primary_profile?.profile || "Active Rhythm",
    story: "Based on your check-in patterns, this represents your current behavioral rhythm.",
  };

  return (
    <div className="mx-auto max-w-3xl space-y-8">
      {/* Navigation & Header */}
      <div className="space-y-4 pb-6 hairline-b">
        <Link
          to="/app/analytics"
          className="inline-flex items-center gap-1.5 text-[12px] text-text-muted hover:text-text-primary transition-colors"
        >
          <ArrowLeft className="h-3.5 w-3.5" />
          <span>Back to Patterns & Insights</span>
        </Link>

        <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
          <div className="space-y-1">
            <h1 className="text-3xl font-semibold tracking-tight text-text-primary">
              {task.task_name}
            </h1>
            <p className="text-[13px] text-text-secondary">
              Personalized patterns, pace, and consistency history.
            </p>
          </div>

          <div>
            {isLearning ? (
              <span className="inline-flex items-center gap-1.5 rounded-full border border-border-default bg-surface-raised px-3 py-1 text-[12px] text-text-secondary">
                <Clock className="h-3.5 w-3.5 text-accent-warm" />
                <span>
                  Day {logsCount} of {targetLogs}
                </span>
              </span>
            ) : (
              <SignalBadge
                profile={analytics.interpretation.primary_profile.profile}
                confidence={analytics.interpretation.primary_profile.confidence}
                size="lg"
              />
            )}
          </div>
        </div>
      </div>

      {/* Conditional: Learning State vs Unlocked Telemetry */}
      {isLearning ? (
        /* ================= LEARNING STATE ================= */
        <div className="space-y-6">
          <div className="rounded-md border border-border-default bg-surface-base p-8 space-y-5">
            <div className="inline-flex items-center gap-2 text-[13px] font-medium text-accent-warm">
              <Sparkles className="h-4 w-4" />
              <span>Getting to know your rhythm</span>
            </div>

            <h2 className="text-2xl font-semibold tracking-tight text-text-primary">
              {remaining > 0
                ? `${remaining} more daily check-in${remaining > 1 ? "s" : ""} to unlock your pattern.`
                : "Your pattern is processing!"}
            </h2>

            <p className="text-[14px] leading-relaxed text-text-secondary">
              We look at your habits across a full 7-day cycle before drawing conclusions. That way,
              temporary weekend schedules or one-off busy days don't distort your real rhythm.
            </p>

            {/* Progress bar */}
            <div className="space-y-2 pt-2">
              <div className="flex items-center justify-between text-[12px]">
                <span className="text-text-muted">Observation Progress</span>
                <span className="text-text-primary font-medium">
                  {logsCount} of {targetLogs} check-ins recorded
                </span>
              </div>
              <div className="h-2 w-full overflow-hidden rounded-full bg-surface-raised">
                <div
                  className="h-full bg-accent-warm transition-all duration-300"
                  style={{ width: `${learningProgress}%` }}
                />
              </div>
            </div>

            <div className="pt-2 text-[12.5px] text-text-secondary">
              Keep checking in on{" "}
              <Link to="/app" className="text-accent-warm underline hover:text-text-primary">
                Today
              </Link>{" "}
              to complete your first week.
            </div>
          </div>
        </div>
      ) : (
        /* ================= UNLOCKED PATTERN ================= */
        <div className="space-y-8">
          {/* Main Pattern Summary Hero Card */}
          <div className="rounded-md border border-border-default bg-surface-base p-6 space-y-5">
            <div className="space-y-2">
              <span className="text-[11px] uppercase tracking-wider text-accent-warm font-medium">
                Your Habit Pattern
              </span>
              <div className="flex items-center gap-3">
                <h2 className="text-2xl font-semibold tracking-tight text-text-primary">
                  {profileInfo.title}
                </h2>
                <span className="text-[12px] text-status-done rounded-full border border-status-done/30 bg-status-done/10 px-2.5 py-0.5 font-medium">
                  {Math.round(analytics.interpretation.primary_profile.confidence * 100)}% match
                </span>
              </div>
              <p className="text-[14px] leading-relaxed text-text-secondary">{profileInfo.story}</p>
            </div>

            {/* Plain-Language Supporting Observations */}
            <div className="space-y-2 pt-4 hairline-t">
              <span className="text-[12px] font-medium text-text-muted block">
                What we noticed in your check-ins
              </span>
              <div className="space-y-2">
                {analytics.interpretation.primary_profile.evidence.map((ev, i) => (
                  <div
                    key={i}
                    className="flex items-start gap-2.5 rounded-md border border-border-subtle bg-surface-raised p-3 text-[13px] text-text-secondary"
                  >
                    <CheckCircle2 className="h-4 w-4 text-status-done shrink-0 mt-0.5" />
                    <span>{ev}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Core Snapshot Summary */}
          <div className="space-y-3">
            <h3 className="text-[14px] font-medium text-text-primary">Quick Overview</h3>

            <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
              <MetricCard
                label="Overall Completion"
                value={`${Math.round(analytics.snapshot.reliability * 100)}%`}
                subtext="All-time check-in rate"
                indicator={analytics.snapshot.reliability >= 0.75 ? "done" : "skip"}
              />
              <MetricCard
                label="Past Week"
                value={`${Math.round(analytics.snapshot.follow_through * 100)}%`}
                subtext="Recent 7-day pace"
                indicator={analytics.snapshot.follow_through >= 0.75 ? "done" : "miss"}
              />
              <MetricCard
                label="Current Run"
                value={analytics.snapshot.current_streak}
                unit="days"
                subtext="In a row"
                indicator="done"
              />
              <MetricCard
                label="Best Run"
                value={analytics.snapshot.strongest_run}
                unit="days"
                subtext="Personal record"
                indicator="warm"
              />
            </div>
          </div>

          {/* Pace & Rhythm Explanations */}
          <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
            <MomentumIndicator
              weightedScore={analytics.technical.weighted_score}
              direction={analytics.technical.momentum_direction}
              acceleration={analytics.technical.momentum_acceleration}
            />

            <StreakStrip
              currentStreak={analytics.technical.current_streak}
              longestStreak={analytics.technical.longest_streak}
              breaksCount={logs.filter((l) => l.status !== "completed").length}
              distribution="even_spread"
            />
          </div>

          {/* Temporal Habit Stability */}
          <TemporalAdherenceChart
            overall={analytics.technical.overall_adherence}
            recent={analytics.technical.recent_adherence}
          />

          {/* Optional: For the Curious Technical Breakdown */}
          <div className="rounded-md border border-border-subtle bg-surface-base p-4">
            <button
              onClick={() => setShowTechnical(!showTechnical)}
              className="flex w-full items-center justify-between text-left text-[13px] font-medium text-text-secondary hover:text-text-primary"
            >
              <span className="flex items-center gap-2">
                <Info className="h-4 w-4 text-text-muted" />
                <span>For the curious: technical math & parameters</span>
              </span>
              <ChevronDown
                className={cn("h-4 w-4 transition-transform", showTechnical && "rotate-180")}
              />
            </button>

            {showTechnical && (
              <div className="mt-4 pt-4 hairline-t grid grid-cols-2 gap-4 font-mono text-[12px] sm:grid-cols-4">
                <div>
                  <span className="text-[10px] uppercase text-text-muted block">
                    Transition Volatility
                  </span>
                  <span className="text-text-primary font-medium">
                    {analytics.technical.transition_rate.toFixed(3)}
                  </span>
                  <span className="text-[10px] text-text-muted block">
                    Frequency of status flips
                  </span>
                </div>
                <div>
                  <span className="text-[10px] uppercase text-text-muted block">
                    Average Run Length
                  </span>
                  <span className="text-text-primary font-medium">
                    {analytics.technical.average_run.toFixed(1)} days
                  </span>
                  <span className="text-[10px] text-text-muted block">
                    Average duration of runs
                  </span>
                </div>
                <div>
                  <span className="text-[10px] uppercase text-text-muted block">
                    Weighted Score
                  </span>
                  <span className="text-text-primary font-medium">
                    {analytics.technical.weighted_score.toFixed(3)}
                  </span>
                  <span className="text-[10px] text-text-muted block">Time-decay weighted</span>
                </div>
                <div>
                  <span className="text-[10px] uppercase text-text-muted block">
                    Velocity 2nd Derivative
                  </span>
                  <span className="text-text-primary font-medium">
                    {analytics.technical.momentum_acceleration.toFixed(3)}
                  </span>
                  <span className="text-[10px] text-text-muted block">Acceleration curvature</span>
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Check-in History Table */}
      <div className="rounded-md border border-border-subtle bg-surface-base p-5 space-y-4">
        <div className="flex items-center justify-between pb-3 hairline-b">
          <div className="space-y-0.5">
            <h3 className="text-[14px] font-medium text-text-primary">Check-in History</h3>
            <p className="text-[12px] text-text-secondary">
              Chronological record of every check-in for this habit.
            </p>
          </div>
          <span className="text-[12px] text-text-muted">
            {logs.length} check-in{logs.length === 1 ? "" : "s"}
          </span>
        </div>

        {logs.length === 0 ? (
          <div className="py-6 text-center text-[13px] text-text-muted">
            No check-ins recorded yet. Head to{" "}
            <Link to="/app" className="text-accent-warm underline">
              Today
            </Link>{" "}
            to log your first entry.
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-[13px]">
              <thead>
                <tr className="border-b border-border-subtle text-text-muted text-[11px] uppercase tracking-wider">
                  <th className="pb-2.5 font-medium">Date</th>
                  <th className="pb-2.5 font-medium">Result</th>
                  <th className="pb-2.5 font-medium">Note</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border-subtle">
                {logs
                  .slice()
                  .reverse()
                  .map((log) => (
                    <tr key={log.tasklog_id} className="hover:bg-surface-raised transition-colors">
                      <td className="py-3 text-text-primary font-medium">{log.log_date}</td>
                      <td className="py-3">
                        <span
                          className={cn(
                            "inline-flex items-center rounded-full px-2.5 py-0.5 text-[11px] font-medium",
                            log.status === "completed" &&
                              "bg-status-done/10 text-status-done border border-status-done/30",
                            log.status === "skipped" &&
                              "bg-status-skip/10 text-status-skip border border-status-skip/30",
                            log.status === "failed" &&
                              "bg-status-miss/10 text-status-miss border border-status-miss/30",
                          )}
                        >
                          {log.status === "completed"
                            ? "Done"
                            : log.status === "failed"
                              ? "Missed"
                              : "Skipped"}
                        </span>
                      </td>
                      <td className="py-3 text-text-secondary italic text-[12.5px]">
                        {log.reason ? `"${log.reason}"` : "—"}
                      </td>
                    </tr>
                  ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
