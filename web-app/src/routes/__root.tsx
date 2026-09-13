import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import {
  Outlet,
  Link,
  createRootRouteWithContext,
  useRouter,
  HeadContent,
  Scripts,
} from "@tanstack/react-router";
import { useEffect, type ReactNode } from "react";
import { AuthProvider } from "@/lib/auth-context";
import appCss from "../styles.css?url";

function NotFoundComponent() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-canvas px-4 text-text-primary">
      <div className="max-w-md text-center">
        <h1 className="font-mono text-6xl font-semibold tracking-tight text-text-primary">404</h1>
        <h2 className="mt-4 text-lg font-medium text-text-primary">Resource Not Located</h2>
        <p className="mt-2 text-sm text-text-secondary">
          The requested path does not exist or has been shifted.
        </p>
        <div className="mt-6">
          <Link
            to="/app"
            className="inline-flex items-center justify-center rounded border border-border-default bg-surface-raised px-4 py-2 font-mono text-[12px] font-medium text-text-primary transition-colors hover:bg-surface-active"
          >
            Return to Console
          </Link>
        </div>
      </div>
    </div>
  );
}

function ErrorComponent({ error, reset }: { error: Error; reset: () => void }) {
  console.error(error);
  const router = useRouter();

  return (
    <div className="flex min-h-screen items-center justify-center bg-canvas px-4 text-text-primary">
      <div className="max-w-md text-center">
        <h1 className="font-mono text-xl font-semibold tracking-tight text-signal-coral">
          System Interruption
        </h1>
        <p className="mt-2 text-sm text-text-secondary">
          An unexpected error occurred during execution.
        </p>
        <div className="mt-6 flex flex-wrap justify-center gap-2">
          <button
            onClick={() => {
              router.invalidate();
              reset();
            }}
            className="inline-flex items-center justify-center rounded border border-border-default bg-surface-raised px-4 py-2 font-mono text-[12px] text-text-primary transition-colors hover:bg-surface-active"
          >
            Retry Execution
          </button>
          <a
            href="/app"
            className="inline-flex items-center justify-center rounded border border-border-subtle bg-surface-base px-4 py-2 font-mono text-[12px] text-text-secondary transition-colors hover:bg-surface-raised hover:text-text-primary"
          >
            App Console
          </a>
        </div>
      </div>
    </div>
  );
}

export const Route = createRootRouteWithContext<{ queryClient: QueryClient }>()({
  head: () => ({
    meta: [
      { charSet: "utf-8" },
      { name: "viewport", content: "width=device-width, initial-scale=1" },
      { title: "Cerebrum — Personal Behavioral Intelligence Platform" },
      {
        name: "description",
        content:
          "High-precision personal performance analytics. Grounded in deterministic signal modeling, momentum vectors, and evidence-backed behavioral assessments.",
      },
    ],
    links: [
      { rel: "stylesheet", href: appCss },
      { rel: "preconnect", href: "https://fonts.googleapis.com" },
      { rel: "preconnect", href: "https://fonts.gstatic.com", crossOrigin: "anonymous" },
      {
        rel: "stylesheet",
        href: "https://fonts.googleapis.com/css2?family=Inter+Tight:ital,wght@0,300..700;1,300..700&family=JetBrains+Mono:ital,wght@0,400..700;1,400..700&display=swap",
      },
    ],
  }),
  shellComponent: RootShell,
  component: RootComponent,
  notFoundComponent: NotFoundComponent,
  errorComponent: ErrorComponent,
});

function RootShell({ children }: { children: ReactNode }) {
  return (
    <html lang="en" className="dark">
      <head>
        <HeadContent />
      </head>
      <body className="min-h-screen bg-canvas text-text-primary antialiased">
        {children}
        <Scripts />
      </body>
    </html>
  );
}

function RootComponent() {
  const { queryClient } = Route.useRouteContext();

  return (
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <Outlet />
      </AuthProvider>
    </QueryClientProvider>
  );
}
