"use client";

import { cn } from "@/lib/utils";

type Metric = { label: string; value: number; color: string };

export default function MetricsBarChart({
  metrics,
}: {
  metrics: Metric[];
}) {
  const max = Math.max(...metrics.map((m) => m.value), 1);

  return (
    <div
      className="flex h-44 items-end justify-between gap-3 sm:h-52 sm:gap-4"
      role="img"
      aria-label="Metrics comparison bar chart"
    >
      {metrics.map((m) => {
        const pct = Math.round((m.value / max) * 100);
        return (
          <div
            key={m.label}
            className="flex min-w-0 flex-1 flex-col items-center gap-2"
          >
            <span className="text-caption font-medium tabular-nums text-foreground">
              {m.value}
            </span>
            <div
              className="relative flex w-full max-w-16 flex-1 items-end sm:max-w-20"
              aria-hidden
            >
              <div
                className={cn(
                  "w-full rounded-t-xl transition-[height] duration-[var(--duration-slow)] ease-[var(--ease-out-expo)] motion-reduce:transition-none",
                  m.color,
                )}
                style={{ height: `${Math.max(pct, 8)}%` }}
              />
            </div>
            <span className="truncate text-center text-caption text-muted-foreground">
              {m.label}
            </span>
          </div>
        );
      })}
    </div>
  );
}
