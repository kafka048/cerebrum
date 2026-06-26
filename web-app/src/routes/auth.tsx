import { createFileRoute, Link, Outlet } from "@tanstack/react-router";
import { AuthProvider } from "@/lib/auth-state";

export const Route = createFileRoute("/auth")({
  component: AuthLayout,
});

function AuthLayout() {
  return (
    <AuthProvider>
      <div className="min-h-screen bg-background text-foreground">
        <div className="mx-auto w-full max-w-md px-6 pt-10 sm:pt-14">
          <Link to="/" className="font-display text-[17px] tracking-tight text-foreground">
            Cerebrum
          </Link>
        </div>
        <main className="mx-auto flex w-full max-w-md flex-col justify-center px-6 pb-24 pt-16 sm:pt-20">
          <Outlet />
        </main>
      </div>
    </AuthProvider>
  );
}
