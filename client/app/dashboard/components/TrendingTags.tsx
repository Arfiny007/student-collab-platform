"use client";

import API from "../../../lib/api";
import { Skeleton } from "@/components/ui/skeleton";
import { cn } from "@/lib/utils";
import { TrendingUp } from "lucide-react";
import { useEffect, useState } from "react";

const SKELETON_ROWS = 6;

function TrendingRowSkeleton() {
  return (
    <div className="flex items-center justify-between gap-3 py-1">
      <div className="flex items-center gap-3">
        <Skeleton className="size-7 shrink-0 rounded-lg" />
        <Skeleton className="h-4 w-24" />
      </div>
      <Skeleton className="h-6 w-10 rounded-full" />
    </div>
  );
}

export default function TrendingTags() {
  const [tags, setTags] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);

    API.get("/posts/trending")
      .then((res) => setTags(res.data))
      .finally(() => setLoading(false));
  }, []);

  return (
    <section
      className={cn(
        "glass-panel interactive-lift overflow-hidden rounded-2xl border border-border/80 p-4 shadow-elevated sm:rounded-3xl sm:p-6",
      )}
      aria-busy={loading}
      aria-label="Trending topics"
    >
      <header className="mb-5 flex items-center gap-2">
        <span
          className={cn(
            "flex size-9 items-center justify-center rounded-xl",
            "bg-primary/10 text-primary",
          )}
          aria-hidden
        >
          <TrendingUp className="size-4" />
        </span>
        <h2 className="text-title text-foreground">Trending</h2>
      </header>

      <div className="space-y-1">
        {loading &&
          Array.from({ length: SKELETON_ROWS }).map((_, i) => (
            <TrendingRowSkeleton key={i} />
          ))}

        {!loading &&
          tags.map((tag, i) => {
            const label = tag[0];
            const count = tag[1];
            const rank = i + 1;
            const isTop = rank <= 3;

            return (
              <div
                key={i}
                className={cn(
                  "flex items-center justify-between gap-3 rounded-xl px-2 py-2.5",
                  "transition-[background,transform] duration-[var(--duration-fast)] ease-[var(--ease-out-expo)]",
                  "hover:bg-muted/50 hover:translate-x-0.5",
                )}
              >
                <div className="flex min-w-0 items-center gap-3">
                  <span
                    className={cn(
                      "flex size-7 shrink-0 items-center justify-center rounded-lg text-xs font-semibold tabular-nums",
                      isTop
                        ? "bg-gradient-brand text-brand-foreground shadow-sm"
                        : "bg-muted text-muted-foreground",
                    )}
                  >
                    {rank}
                  </span>
                  <p className="truncate text-sm font-medium text-foreground">
                    {label}
                  </p>
                </div>

                <span
                  className={cn(
                    "shrink-0 rounded-full px-2.5 py-0.5 text-caption font-medium tabular-nums",
                    "bg-muted/80 text-muted-foreground",
                  )}
                >
                  {count}
                </span>
              </div>
            );
          })}

        {!loading && tags.length === 0 && (
          <p className="text-caption py-4 text-center text-muted-foreground">
            No trending topics yet.
          </p>
        )}
      </div>
    </section>
  );
}
