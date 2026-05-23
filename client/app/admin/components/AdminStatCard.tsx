"use client";

import { cn } from "@/lib/utils";
import type { ComponentType } from "react";

export default function AdminStatCard({
  label,
  value,
  icon: Icon,
  accent,
  delta,
}: {
  label: string;
  value: number | string;
  icon: ComponentType<{ className?: string }>;
  accent: string;
  delta?: string;
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
          <Icon
            className="size-5 text-foreground/80"
            aria-hidden
          />
        </div>
        {delta && (
          <span className="text-caption font-medium text-muted-foreground">
            {delta}
          </span>
        )}
      </div>
      <p className="mt-4 text-3xl font-bold tracking-tight text-foreground tabular-nums sm:text-4xl">
        {value}
      </p>
      <p className="mt-1 text-sm font-medium text-muted-foreground">
        {label}
      </p>
    </div>
  );
}
