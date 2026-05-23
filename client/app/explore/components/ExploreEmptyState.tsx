"use client";

import { cn } from "@/lib/utils";
import { Compass, Hash, Search } from "lucide-react";

export default function ExploreEmptyState({
  hasFilter,
}: {
  hasFilter: boolean;
}) {
  return (
    <div
      className={cn(
        "glass-panel flex flex-col items-center justify-center rounded-3xl border border-border/80",
        "px-6 py-16 text-center shadow-elevated animate-scale-in motion-reduce:animate-none",
      )}
    >
      <span
        className={cn(
          "mb-5 flex size-16 items-center justify-center rounded-2xl",
          "bg-primary/10 text-primary",
        )}
        aria-hidden
      >
        {hasFilter ? (
          <Search className="size-8" />
        ) : (
          <Compass className="size-8" />
        )}
      </span>
      <h2 className="text-title text-foreground">
        {hasFilter ? "No posts match your filters" : "Nothing to explore yet"}
      </h2>
      <p className="mt-2 max-w-sm text-body text-muted-foreground">
        {hasFilter
          ? "Try a different search term or clear the topic filter to see more posts."
          : "Popular posts will appear here as the community grows."}
      </p>
      {!hasFilter && (
        <p className="mt-4 inline-flex items-center gap-2 text-caption text-muted-foreground">
          <Hash className="size-3.5" aria-hidden />
          Use hashtags in posts to boost discoverability
        </p>
      )}
    </div>
  );
}
