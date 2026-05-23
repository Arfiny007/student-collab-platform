"use client";

import Link from "next/link";
import { cn } from "@/lib/utils";
import { Bookmark, Compass, Search } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function SavedEmptyState({
  hasSearch,
}: {
  hasSearch: boolean;
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
        {hasSearch ? (
          <Search className="size-8" />
        ) : (
          <Bookmark className="size-8" />
        )}
      </span>
      <h2 className="text-title text-foreground">
        {hasSearch ? "No matching saved posts" : "Your reading list is empty"}
      </h2>
      <p className="mt-2 max-w-sm text-body text-muted-foreground">
        {hasSearch
          ? "Adjust your search to find a saved post."
          : "Bookmark posts from the feed to collect notes, discussions, and resources in one place."}
      </p>
      {!hasSearch && (
        <Button variant="brand" className="mt-6 gap-2 rounded-xl" asChild>
          <Link href="/explore">
            <Compass className="size-4" aria-hidden />
            Explore posts
          </Link>
        </Button>
      )}
    </div>
  );
}
