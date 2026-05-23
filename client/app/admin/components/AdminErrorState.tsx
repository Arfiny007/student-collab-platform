"use client";

import { AlertTriangle, RefreshCw } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

export default function AdminErrorState({
  message = "Something went wrong loading admin data.",
  onRetry,
}: {
  message?: string;
  onRetry?: () => void;
}) {
  return (
    <div
      className={cn(
        "glass-panel rounded-2xl border border-destructive/25 bg-destructive/5",
        "flex flex-col items-center px-6 py-12 text-center",
        "animate-fade-in motion-reduce:animate-none",
      )}
      role="alert"
    >
      <AlertTriangle
        className="mb-3 size-8 text-destructive"
        aria-hidden
      />
      <h3 className="text-title text-foreground">
        Unable to load
      </h3>
      <p className="mt-2 max-w-md text-body text-muted-foreground">
        {message}
      </p>
      {onRetry && (
        <Button
          type="button"
          variant="outline"
          className="mt-5 gap-2"
          onClick={onRetry}
        >
          <RefreshCw className="size-4" aria-hidden />
          Try again
        </Button>
      )}
    </div>
  );
}
