"use client";

import { cn } from "@/lib/utils";

type Point = { label: string; value: number };

export default function AdminTrendChart({
  title,
  points,
  emptyLabel = "No activity yet",
}: {
  title: string;
  points: Point[];
  emptyLabel?: string;
}) {
  const max = Math.max(
    ...points.map((p) => p.value),
    1,
  );

  if (points.length === 0) {
    return (
      <div className="flex h-48 items-center justify-center text-body text-muted-foreground">
        {emptyLabel}
      </div>
    );
  }

  return (
    <div>
      <h3 className="mb-6 text-title text-foreground">
        {title}
      </h3>
      <div
        className="flex h-44 items-end justify-between gap-2 sm:gap-3"
        role="img"
        aria-label={`${title} bar chart`}
      >
        {points.map((p) => {
          const height = Math.max(
            (p.value / max) * 100,
            8,
          );
          return (
            <div
              key={p.label}
              className="flex min-w-0 flex-1 flex-col items-center gap-2"
            >
              <span className="text-caption font-medium tabular-nums text-muted-foreground">
                {p.value}
              </span>
              <div
                className="flex w-full max-w-[3rem] flex-1 items-end justify-center sm:max-w-none"
              >
                <div
                  className={cn(
                    "w-full max-w-12 rounded-t-lg bg-gradient-brand",
                    "transition-[height] duration-[var(--duration-slow)] ease-[var(--ease-out-expo)] motion-reduce:transition-none",
                  )}
                  style={{ height: `${height}%` }}
                  title={`${p.label}: ${p.value}`}
                />
              </div>
              <span className="w-full truncate text-center text-caption text-muted-foreground">
                {p.label}
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
}
