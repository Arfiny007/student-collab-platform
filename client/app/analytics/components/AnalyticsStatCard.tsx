"use client";

import { cn } from "@/lib/utils";
import type { ComponentType } from "react";

export default function AnalyticsStatCard({
  label,
  value,
  icon: Icon,
  accent,
  hint,
}: {
  label: string;
  value: number | string | undefined;
  icon: ComponentType<{ className?: string }>;
  accent: string;
  hint?: string;
}) {
  return (
    <div
      className={cn(
        "glass-panel interactive-lift rounded-2xl border border-border/60 p-5 sm:p-6",
        "motion-reduce:transition-none",
      )}
    >
      <div className="flex items-start justify-between gap-3">
        <div
          className={cn(
            "flex size-10 shrink-0 items-center justify-center rounded-xl",
            accent,
          )}
        >
          <Icon className="size-5 text-foreground/80" aria-hidden />
        </div>
        {hint && (
          <span className="text-caption text-muted-foreground">{hint}</span>
        )}
      </div>
      <p className="mt-4 text-3xl font-bold tracking-tight text-foreground tabular-nums sm:text-4xl">
        {value ?? 0}
      </p>
      <p className="mt-1 text-sm font-medium text-muted-foreground">{label}</p>
    </div>
  );
}
