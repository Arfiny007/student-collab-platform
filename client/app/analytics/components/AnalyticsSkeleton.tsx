"use client";

import { Skeleton } from "@/components/ui/skeleton";

export default function AnalyticsSkeleton() {
  return (
    <div className="min-h-screen bg-background">
      <div
        className="h-32 sm:h-40"
        style={{ background: "var(--gradient-mesh)" }}
        aria-hidden
      />
      <div className="mx-auto max-w-6xl px-4 pb-12 sm:px-6">
        <Skeleton className="-mt-16 mb-8 h-10 w-48 rounded-xl" />
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {Array.from({ length: 4 }).map((_, i) => (
            <Skeleton key={i} className="h-36 rounded-2xl" />
          ))}
        </div>
        <div className="mt-6 grid gap-6 lg:grid-cols-2">
          <Skeleton className="h-72 rounded-3xl" />
          <Skeleton className="h-72 rounded-3xl" />
        </div>
      </div>
    </div>
  );
}
