import { createFileRoute } from "@tanstack/react-router";
import { PageShell, PageHeader } from "@/components/cerebrum/page-shell";
import { TodayFocus } from "@/components/cerebrum/today-focus";
import { OnboardingNoGoals } from "@/components/cerebrum/onboarding/onboarding-no-goals";
import { OnboardingNoTasks } from "@/components/cerebrum/onboarding/onboarding-no-tasks";
import { useCerebrumState } from "@/lib/cerebrum-state";

export const Route = createFileRoute("/app/")({
  head: () => ({
    meta: [
      { title: "Today — Cerebrum" },
      { name: "description", content: "Log your behavior, one task at a time." },
    ],
  }),
  component: TodayPage,
});

const WEEKDAYS = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
const MONTHS = [
  "January", "February", "March", "April", "May", "June",
  "July", "August", "September", "October", "November", "December",
];

function TodayPage() {
  const { hasGoals, hasTasks } = useCerebrumState();

  if (!hasGoals) return <OnboardingNoGoals />;
  if (!hasTasks) return <OnboardingNoTasks />;

  const d = new Date();
  const today = `${WEEKDAYS[d.getUTCDay()]} ${d.getUTCDate()} ${MONTHS[d.getUTCMonth()]}`;

  return (
    <PageShell>
      <PageHeader
        eyebrow={today}
        title="Today"
        description="Log your behavior as you go. Each entry becomes another observation Cerebrum can learn from."
      />
      <TodayFocus />
    </PageShell>
  );
}
