"use client";

import { useEffect } from "react";
import { Button } from "@/components/ui/button";

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <main className="flex min-h-screen flex-col items-center justify-center gap-4 bg-background px-6 text-center">
      <h1 className="text-title">Something went wrong</h1>
      <p className="max-w-md text-body text-muted-foreground">
        An unexpected error occurred. You can try again or return to the
        dashboard.
      </p>
      <div className="flex flex-wrap justify-center gap-3">
        <Button type="button" variant="brand" onClick={() => reset()}>
          Try again
        </Button>
        <Button type="button" variant="outline" asChild>
          <a href="/dashboard">Go to dashboard</a>
        </Button>
      </div>
    </main>
  );
}
