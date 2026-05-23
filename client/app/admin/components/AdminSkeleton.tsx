"use client";

import { Skeleton } from "@/components/ui/skeleton";
import { cn } from "@/lib/utils";

export function AdminStatSkeleton() {
  return (
    <div className="glass-panel rounded-2xl border border-border/60 p-5 sm:p-6">
      <Skeleton className="size-10 rounded-xl" />
      <Skeleton className="mt-4 h-9 w-24" />
      <Skeleton className="mt-2 h-4 w-32" />
    </div>
  );
}

export function AdminTableSkeleton({
  rows = 5,
}: {
  rows?: number;
}) {
  return (
    <div
      className={cn(
        "glass-panel overflow-hidden rounded-2xl border border-border/60",
      )}
    >
      <div className="border-b border-border/60 px-4 py-3 sm:px-6">
        <Skeleton className="h-5 w-40" />
      </div>
      <div className="divide-y divide-border/50">
        {Array.from({ length: rows }).map(
          (_, i) => (
            <div
              key={i}
              className="flex items-center gap-4 px-4 py-4 sm:px-6"
            >
              <Skeleton className="size-9 shrink-0 rounded-full" />
              <div className="flex-1 space-y-2">
                <Skeleton className="h-4 w-48" />
                <Skeleton className="h-3 w-32" />
              </div>
              <Skeleton className="h-8 w-20 rounded-lg" />
            </div>
          ),
        )}
      </div>
    </div>
  );
}
