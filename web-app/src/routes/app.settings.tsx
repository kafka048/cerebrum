import { createFileRoute } from "@tanstack/react-router";
import { useAuth } from "@/lib/auth-context";
import { Settings, User, LogOut, Info } from "lucide-react";

export const Route = createFileRoute("/app/settings")({
  head: () => ({
    meta: [
      { title: "Settings — Cerebrum" },
      { name: "description", content: "Account settings and preferences." },
    ],
  }),
  component: SettingsPage,
});

export function SettingsPage() {
  const { user, logout } = useAuth();

  return (
    <div className="mx-auto max-w-3xl space-y-8">
      {/* Header */}
      <div className="space-y-1 pb-6 hairline-b">
        <div className="flex items-center gap-2 text-[12px] font-medium text-accent-warm">
          <Settings className="h-4 w-4" />
          <span>Account & Preferences</span>
        </div>
        <h1 className="text-3xl font-semibold tracking-tight text-text-primary">Settings</h1>
        <p className="text-[13.5px] text-text-secondary">
          Manage your account details and review how your habit data is handled.
        </p>
      </div>

      {/* Profile Section */}
      <div className="rounded-md border border-border-subtle bg-surface-base p-6 space-y-5">
        <div className="flex items-center gap-2.5 pb-3 hairline-b">
          <User className="h-4 w-4 text-accent-warm" />
          <h2 className="text-[15px] font-medium text-text-primary">Your Profile</h2>
        </div>

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 text-[13px]">
          <div>
            <span className="text-[11px] text-text-muted block">Name</span>
            <span className="text-text-primary font-medium">{user?.name || "Friend"}</span>
          </div>

          <div>
            <span className="text-[11px] text-text-muted block">Email Address</span>
            <span className="text-text-primary font-medium">{user?.email || "—"}</span>
          </div>

          <div>
            <span className="text-[11px] text-text-muted block">Member Since</span>
            <span className="text-text-primary font-medium">
              {user?.created_at ? user.created_at.split("T")[0] : "Active"}
            </span>
          </div>

          <div>
            <span className="text-[11px] text-text-muted block">Account Status</span>
            <span className="text-status-done font-medium">Active & Synchronized</span>
          </div>
        </div>

        <div className="pt-4 hairline-t flex justify-end">
          <button
            onClick={logout}
            className="inline-flex items-center gap-2 rounded-md border border-border-default bg-surface-raised px-4 py-2 text-[12.5px] font-medium text-text-secondary hover:border-status-miss/40 hover:text-status-miss transition-colors"
          >
            <LogOut className="h-4 w-4" />
            <span>Sign Out</span>
          </button>
        </div>
      </div>

      {/* How Cerebrum Works Section */}
      <div className="rounded-md border border-border-subtle bg-surface-base p-6 space-y-4">
        <div className="flex items-center gap-2.5 pb-3 hairline-b">
          <Info className="h-4 w-4 text-accent-warm" />
          <h2 className="text-[15px] font-medium text-text-primary">
            How Cerebrum Analyzes Your Habits
          </h2>
        </div>

        <div className="space-y-3 text-[13px] text-text-secondary leading-relaxed">
          <p>
            <strong className="text-text-primary">7-day baseline:</strong> Cerebrum requires about a
            week of daily check-ins before generating habit summaries. This prevents temporary
            weekend disruptions from skewing your real habits.
          </p>
          <p>
            <strong className="text-text-primary">Focus on momentum, not perfection:</strong> Unlike
            habit trackers that punish broken streaks, Cerebrum tracks your momentum slope and how
            quickly you rebound after an off-day.
          </p>
          <p>
            <strong className="text-text-primary">Privacy & Data:</strong> Your entries are stored
            securely on your local Cerebrum server (`127.0.0.1:8000`) and never sold or shared.
          </p>
        </div>
      </div>
    </div>
  );
}
