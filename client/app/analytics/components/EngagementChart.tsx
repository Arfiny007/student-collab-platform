"use client";

import { cn } from "@/lib/utils";

export default function EngagementChart({
  percent,
}: {
  percent: number;
}) {
  const clamped = Math.min(Math.max(percent, 0), 100);
  const radius = 52;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference - (clamped / 100) * circumference;

  return (
    <div className="flex flex-col items-center gap-4 sm:flex-row sm:gap-8">
      <div className="relative size-36 shrink-0 sm:size-40">
        <svg
          viewBox="0 0 120 120"
          className="size-full -rotate-90"
          role="img"
          aria-label={`Engagement score ${clamped} percent`}
        >
          <circle
            cx="60"
            cy="60"
            r={radius}
            fill="none"
            stroke="currentColor"
            strokeWidth="10"
            className="text-muted/40"
          />
          <circle
            cx="60"
            cy="60"
            r={radius}
            fill="none"
            stroke="url(#engagement-gradient)"
            strokeWidth="10"
            strokeLinecap="round"
            strokeDasharray={circumference}
            strokeDashoffset={offset}
            className="transition-[stroke-dashoffset] duration-[var(--duration-slow)] ease-[var(--ease-out-expo)] motion-reduce:transition-none"
          />
          <defs>
            <linearGradient
              id="engagement-gradient"
              x1="0%"
              y1="0%"
              x2="100%"
              y2="100%"
            >
              <stop offset="0%" stopColor="var(--chart-1)" />
              <stop offset="50%" stopColor="var(--chart-3)" />
              <stop offset="100%" stopColor="var(--chart-2)" />
            </linearGradient>
          </defs>
        </svg>
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <span className="text-3xl font-bold tabular-nums text-foreground sm:text-4xl">
            {clamped}
          </span>
          <span className="text-caption text-muted-foreground">%</span>
        </div>
      </div>

      <div className="space-y-3 text-center sm:text-left">
        <h3 className="text-title text-foreground">Engagement rate</h3>
        <p className="max-w-xs text-body text-muted-foreground">
          Followers per post, expressed as a percentage. Higher means your
          audience scales with each publication.
        </p>
        <div
          className={cn(
            "inline-flex items-center gap-2 rounded-full px-3 py-1",
            "bg-primary/10 text-caption font-medium text-primary",
          )}
        >
          <span
            className="size-2 rounded-full bg-gradient-brand"
            aria-hidden
          />
          Live from your profile
        </div>
      </div>
    </div>
  );
}
