"use client";

import { Skeleton } from "@/components/ui/skeleton";
import { cn } from "@/lib/utils";
import { Hash, TrendingUp, X } from "lucide-react";

export default function TrendingTagStrip({
  tags,
  loading,
  selectedTag,
  onSelectTag,
}: {
  tags: any[];
  loading: boolean;
  selectedTag: string | null;
  onSelectTag: (tag: string | null) => void;
}) {
  return (
    <section
      className={cn(
        "glass-panel overflow-hidden rounded-2xl border border-border/80 p-4 shadow-elevated sm:rounded-3xl sm:p-6",
      )}
      aria-busy={loading}
      aria-label="Trending topics"
    >
      <header className="mb-4 flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-2">
          <span
            className={cn(
              "flex size-9 items-center justify-center rounded-xl",
              "bg-primary/10 text-primary",
            )}
            aria-hidden
          >
            <TrendingUp className="size-4" />
          </span>
          <h2 className="text-title text-foreground">Trending topics</h2>
        </div>
        {selectedTag && (
          <button
            type="button"
            onClick={() => onSelectTag(null)}
            className={cn(
              "inline-flex items-center gap-1.5 rounded-full px-3 py-1.5 text-caption font-medium",
              "bg-muted/80 text-muted-foreground transition-colors",
              "hover:bg-muted hover:text-foreground",
              "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring/50",
            )}
          >
            <X className="size-3.5" aria-hidden />
            Clear filter
          </button>
        )}
      </header>

      {loading && (
        <div className="flex flex-wrap gap-2">
          {Array.from({ length: 8 }).map((_, i) => (
            <Skeleton key={i} className="h-9 w-24 rounded-full" />
          ))}
        </div>
      )}

      {!loading && tags.length === 0 && (
        <p className="text-caption py-2 text-center text-muted-foreground">
          No trending topics yet. Start a conversation with hashtags.
        </p>
      )}

      {!loading && tags.length > 0 && (
        <div className="flex flex-wrap gap-2">
          {tags.map((tag, i) => {
            const label = tag[0];
            const count = tag[1];
            const active = selectedTag === label;
            const isTop = i < 3;

            return (
              <button
                key={label}
                type="button"
                onClick={() => onSelectTag(active ? null : label)}
                aria-pressed={active}
                className={cn(
                  "inline-flex items-center gap-2 rounded-full px-4 py-2 text-sm font-medium",
                  "transition-[background,transform,box-shadow] duration-[var(--duration-fast)] ease-[var(--ease-out-expo)]",
                  "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring/50",
                  "motion-reduce:transition-none",
                  active
                    ? "bg-gradient-brand text-brand-foreground shadow-glow-brand"
                    : cn(
                        "glass-panel border border-border/60 text-foreground",
                        "hover:translate-y-[-1px] hover:shadow-md",
                        isTop && "ring-1 ring-primary/20",
                      ),
                )}
              >
                <Hash className="size-3.5 shrink-0 opacity-70" aria-hidden />
                <span className="truncate">{label}</span>
                <span
                  className={cn(
                    "rounded-full px-2 py-0.5 text-caption tabular-nums",
                    active
                      ? "bg-brand-foreground/20 text-brand-foreground"
                      : "bg-muted/80 text-muted-foreground",
                  )}
                >
                  {count}
                </span>
              </button>
            );
          })}
        </div>
      )}
    </section>
  );
}
