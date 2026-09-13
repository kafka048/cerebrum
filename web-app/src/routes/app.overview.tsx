import { createFileRoute, redirect } from "@tanstack/react-router";

export const Route = createFileRoute("/app/overview")({
  beforeLoad: () => {
    throw redirect({ to: "/app/goals" });
  },
  component: () => null,
});
