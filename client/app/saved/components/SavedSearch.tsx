"use client";

import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";
import { Bookmark, Search } from "lucide-react";

export default function SavedSearch({
  value,
  onChange,
  resultCount,
  totalCount,
}: {
  value: string;
  onChange: (value: string) => void;
  resultCount: number;
  totalCount: number;
}) {
  return (
    <div
      className={cn(
        "glass-panel rounded-2xl border border-border/80 p-4 shadow-elevated sm:rounded-3xl sm:p-5",
      )}
    >
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center">
        <div className="relative min-w-0 flex-1">
          <Search
            className="pointer-events-none absolute top-1/2 left-3 size-4 -translate-y-1/2 text-muted-foreground"
            aria-hidden
          />
          <Input
            type="search"
            placeholder="Search saved posts..."
            value={value}
            onChange={(e) => onChange(e.target.value)}
            className="h-11 rounded-xl border-border/80 bg-background/80 pl-10"
            aria-label="Search saved posts"
          />
        </div>
        <div
          className={cn(
            "inline-flex shrink-0 items-center gap-2 rounded-xl px-3 py-2",
            "bg-primary/10 text-caption font-medium text-primary",
          )}
        >
          <Bookmark className="size-4" aria-hidden />
          <span className="tabular-nums">
            {resultCount} of {totalCount}
          </span>
        </div>
      </div>
    </div>
  );
}
