import { createFileRoute, Link } from "@tanstack/react-router";
import { useAuth } from "@/lib/auth-context";
import { Brain, ArrowRight, Sparkles, CheckCircle2, Clock, Heart, Shield } from "lucide-react";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Cerebrum — Understand How You Work, Without the Guilt" },
      {
        name: "description",
        content:
          "Track what you actually did in seconds, and gently uncover the patterns behind your best days.",
      },
    ],
  }),
  component: LandingPage,
});

function LandingPage() {
  const { isAuthenticated } = useAuth();

  return (
    <div className="min-h-screen bg-canvas text-text-primary">
      {/* Navigation Header */}
      <header className="sticky top-0 z-30 border-b border-border-subtle bg-canvas/90 backdrop-blur-md">
        <div className="mx-auto flex h-16 w-full max-w-5xl items-center justify-between px-6">
          <Link to="/" className="flex items-center gap-2.5 group">
            <div className="grid h-8 w-8 place-items-center rounded-md border border-border-default bg-surface-raised transition-colors group-hover:border-accent-warm/50">
              <Brain className="h-4 w-4 text-accent-warm" />
            </div>
            <span className="text-[16px] font-semibold tracking-tight text-text-primary">
              Cerebrum
            </span>
          </Link>

          <div className="flex items-center gap-4 text-[13px]">
            {isAuthenticated ? (
              <Link
                to="/app"
                className="inline-flex items-center gap-1.5 rounded-md bg-text-primary px-4 py-2 font-medium text-canvas transition-colors hover:bg-text-secondary"
              >
                Go to Today <ArrowRight className="h-4 w-4" />
              </Link>
            ) : (
              <>
                <Link
                  to="/auth/login"
                  className="text-text-secondary transition-colors hover:text-text-primary"
                >
                  Sign In
                </Link>
                <Link
                  to="/auth/register"
                  className="inline-flex items-center gap-1.5 rounded-md bg-text-primary px-4 py-2 font-medium text-canvas transition-colors hover:bg-text-secondary"
                >
                  Get Started
                </Link>
              </>
            )}
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <main className="mx-auto w-full max-w-5xl px-6 py-20 space-y-20">
        <div className="max-w-2xl space-y-6">
          <div className="inline-flex items-center gap-2 rounded-full border border-border-default bg-surface-base px-3.5 py-1 text-[12px] text-text-secondary">
            <Sparkles className="h-3.5 w-3.5 text-accent-warm" />
            <span>A calmer way to build daily habits</span>
          </div>

          <h1 className="text-4xl font-semibold tracking-tight text-text-primary sm:text-5xl lg:text-6xl leading-[1.1]">
            Track what you actually did.
            <br />
            <span className="text-text-secondary">Discover your real patterns.</span>
          </h1>

          <p className="text-[17px] leading-relaxed text-text-secondary">
            Most habit apps treat you like a robot—punishing missed streaks and demanding
            perfection. Cerebrum lets you check in on your habits in five seconds, then quietly
            uncovers how you actually operate over time.
          </p>

          <div className="flex flex-wrap items-center gap-3 pt-2">
            <Link
              to={isAuthenticated ? "/app" : "/auth/register"}
              className="inline-flex items-center gap-2 rounded-md bg-text-primary px-5 py-2.5 text-[14px] font-medium text-canvas transition-colors hover:bg-text-secondary"
            >
              {isAuthenticated ? "Open Your Console" : "Start Your First Week"}
              <ArrowRight className="h-4 w-4" />
            </Link>
            <a
              href="#how-it-works"
              className="inline-flex items-center gap-1.5 rounded-md border border-border-subtle bg-surface-base px-4 py-2.5 text-[14px] text-text-secondary transition-colors hover:bg-surface-raised hover:text-text-primary"
            >
              How it works
            </a>
          </div>
        </div>

        {/* Live Product Preview */}
        <div className="overflow-hidden rounded-lg border border-border-default bg-surface-base shadow-xl">
          <div className="flex items-center justify-between border-b border-border-subtle bg-surface-raised px-5 py-3 text-[12px] text-text-muted">
            <span className="text-text-secondary font-medium">cerebrum / daily check-in</span>
            <span className="flex items-center gap-1.5 text-status-done font-medium">
              <CheckCircle2 className="h-3.5 w-3.5" /> 3 of 4 logged today
            </span>
          </div>

          <div className="grid grid-cols-1 divide-y divide-border-subtle lg:grid-cols-2 lg:divide-x lg:divide-y-0">
            {/* Left: Sample Today's Check-in */}
            <div className="p-6 space-y-3">
              <span className="text-[11px] uppercase tracking-wider text-text-muted font-medium">
                Today's Habits (Instant 1-Tap)
              </span>

              <div className="space-y-2.5 pt-1">
                <div className="flex items-center justify-between rounded-md border border-border-subtle bg-surface-raised p-3 border-l-4 border-l-status-done">
                  <div>
                    <p className="text-[14px] font-medium text-text-primary">
                      Morning deep work block
                    </p>
                    <span className="text-[11px] text-text-muted">Focus & Craft</span>
                  </div>
                  <span className="rounded-full bg-status-done/10 border border-status-done/30 px-3 py-0.5 text-[12px] font-medium text-status-done">
                    Done
                  </span>
                </div>

                <div className="flex items-center justify-between rounded-md border border-border-subtle bg-surface-raised p-3 border-l-4 border-l-status-skip">
                  <div>
                    <p className="text-[14px] font-medium text-text-primary">Afternoon run</p>
                    <span className="text-[11px] text-text-muted">Rest day taken</span>
                  </div>
                  <span className="rounded-full bg-status-skip/10 border border-status-skip/30 px-3 py-0.5 text-[12px] font-medium text-status-skip">
                    Skipped
                  </span>
                </div>

                <div className="flex items-center justify-between rounded-md border border-border-subtle bg-surface-raised p-3">
                  <div>
                    <p className="text-[14px] font-medium text-text-primary">
                      Evening reading (20m)
                    </p>
                    <span className="text-[11px] text-text-muted">Personal Growth</span>
                  </div>
                  <div className="flex gap-1.5">
                    <span className="rounded-md border border-border-subtle bg-surface-base px-2.5 py-1 text-[12px] font-medium text-status-done">
                      Done
                    </span>
                    <span className="rounded-md border border-border-subtle bg-surface-base px-2.5 py-1 text-[12px] font-medium text-text-muted">
                      Skip
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* Right: Sample Insight */}
            <div className="p-6 space-y-4 bg-surface-base/50">
              <span className="text-[11px] uppercase tracking-wider text-accent-warm font-medium">
                Personalized Pattern Preview
              </span>

              <div className="rounded-md border border-border-subtle bg-surface-raised p-4 space-y-2.5">
                <div className="flex items-center justify-between">
                  <span className="text-[15px] font-medium text-text-primary">
                    Steady & Sustainable
                  </span>
                  <span className="text-[11px] text-status-done font-medium">87% match</span>
                </div>
                <p className="text-[13px] text-text-secondary leading-relaxed">
                  "You’ve found a pace you can maintain in real life. When life gets busy and you
                  miss a day, you get right back to it without spiraling."
                </p>
              </div>

              <div className="space-y-2 pt-1 text-[12.5px] text-text-secondary">
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="h-4 w-4 text-status-done shrink-0" />
                  <span>You bounce back from missed days in under 48 hours</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="h-4 w-4 text-status-done shrink-0" />
                  <span>Your momentum has picked up over the past 7 days</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* 3 Core Principles */}
        <section id="how-it-works" className="space-y-10 pt-10 hairline-t">
          <div className="max-w-xl space-y-2">
            <h2 className="text-2xl font-semibold tracking-tight text-text-primary">
              Built for real human lives, not spreadsheets.
            </h2>
            <p className="text-[14px] text-text-secondary">
              Three reasons Cerebrum feels fundamentally different from other trackers.
            </p>
          </div>

          <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
            <div className="rounded-md border border-border-subtle bg-surface-base p-6 space-y-3">
              <div className="grid h-9 w-9 place-items-center rounded-md bg-surface-raised text-accent-warm">
                <Clock className="h-5 w-5" />
              </div>
              <h3 className="text-[16px] font-medium text-text-primary">Five-second check-ins</h3>
              <p className="text-[13.5px] text-text-secondary leading-relaxed">
                Open the app, tap Done or Skipped, and close it. No charts blocking your morning, no
                friction, no complex questionnaires.
              </p>
            </div>

            <div className="rounded-md border border-border-subtle bg-surface-base p-6 space-y-3">
              <div className="grid h-9 w-9 place-items-center rounded-md bg-surface-raised text-status-done">
                <Heart className="h-5 w-5" />
              </div>
              <h3 className="text-[16px] font-medium text-text-primary">Zero streak anxiety</h3>
              <p className="text-[13.5px] text-text-secondary leading-relaxed">
                Life happens. An unexpected trip or a sick day shouldn't erase months of work. We
                study your bounce-back speed and overall pace instead.
              </p>
            </div>

            <div className="rounded-md border border-border-subtle bg-surface-base p-6 space-y-3">
              <div className="grid h-9 w-9 place-items-center rounded-md bg-surface-raised text-accent-warm">
                <Sparkles className="h-5 w-5" />
              </div>
              <h3 className="text-[16px] font-medium text-text-primary">Plain English insights</h3>
              <p className="text-[13.5px] text-text-secondary leading-relaxed">
                Find out whether you thrive on weekends, if your energy dips mid-week, or if you're
                burning out—translated into clear, friendly language.
              </p>
            </div>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="mt-20 border-t border-border-subtle bg-surface-base py-8">
        <div className="mx-auto flex max-w-5xl items-center justify-between px-6 text-[12px] text-text-muted">
          <span>Cerebrum · Built for human performance</span>
          <span>FastAPI + TanStack Start + React 19</span>
        </div>
      </footer>
    </div>
  );
}
