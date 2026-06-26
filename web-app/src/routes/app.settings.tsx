import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { LogOut } from "lucide-react";
import { PageShell, PageHeader } from "@/components/cerebrum/page-shell";
import { PeekIntoWhatsNext } from "@/components/cerebrum/settings/peek";
import { formatMemberSince, useAuth } from "@/lib/auth-state";

export const Route = createFileRoute("/app/settings")({
  head: () => ({
    meta: [
      { title: "Settings — Cerebrum" },
      { name: "description", content: "Your account and what's coming next." },
    ],
  }),
  component: SettingsPage,
});

function SettingsPage() {
  const { session, signOut } = useAuth();
  const navigate = useNavigate();

  return (
    <PageShell>
      <PageHeader eyebrow="Settings" title="Settings" />

      <section className="mb-12">
        <p className="mb-4 text-[10px] uppercase tracking-[0.22em] text-tertiary">Account</p>
        <div className="space-y-px overflow-hidden rounded-lg border border-border bg-border">
          <Row label="Name" value={session?.name ?? "—"} />
          <Row label="Email" value={session?.email ?? "—"} />
          <Row
            label="Member Since"
            value={session ? formatMemberSince(session.memberSince) : "—"}
          />
          <div className="grid grid-cols-[minmax(0,1fr)_auto] items-center gap-6 bg-surface px-6 py-5">
            <span className="text-[13px] text-foreground">Session</span>
            <button
              onClick={() => {
                signOut();
                navigate({ to: "/" });
              }}
              className="inline-flex items-center gap-2 rounded-md border border-border bg-transparent px-3 py-1.5 text-[12.5px] text-muted-foreground transition-colors hover:border-failed/60 hover:text-foreground"
            >
              <LogOut className="h-3.5 w-3.5" strokeWidth={1.75} />
              Logout
            </button>
          </div>
        </div>
      </section>

      <PeekIntoWhatsNext />

      <footer className="mt-16 border-t border-border/70 pt-8">
        <p className="font-display text-[14px] tracking-tight text-foreground">Cerebrum v1.0</p>
        <p className="mt-1 text-[12px] text-tertiary">Built by Amrit Raj</p>
      </footer>
    </PageShell>
  );
}

function Row({ label, value }: { label: string; value: string }) {
  return (
    <div className="grid grid-cols-[minmax(0,1fr)_auto] items-center gap-6 bg-surface px-6 py-5">
      <span className="text-[13px] text-foreground">{label}</span>
      <span className="text-[13px] text-muted-foreground">{value}</span>
    </div>
  );
}
