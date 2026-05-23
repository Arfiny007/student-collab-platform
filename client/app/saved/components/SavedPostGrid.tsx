"use client";

import PostCard from "../../dashboard/components/PostCard";
import { Skeleton } from "@/components/ui/skeleton";
import { cn } from "@/lib/utils";

function SavedGridSkeleton() {
  return (
    <div className="grid gap-6 lg:grid-cols-2">
      {Array.from({ length: 3 }).map((_, i) => (
        <div
          key={i}
          className="glass-panel rounded-3xl border border-border/80 p-6"
        >
          <div className="mb-4 flex gap-3">
            <Skeleton className="size-12 rounded-full" />
            <div className="flex flex-1 flex-col gap-2">
              <Skeleton className="h-4 w-32" />
              <Skeleton className="h-3 w-48" />
            </div>
          </div>
          <Skeleton className="mb-2 h-5 w-3/4" />
          <Skeleton className="h-24 w-full rounded-xl" />
        </div>
      ))}
    </div>
  );
}

export default function SavedPostGrid({
  posts,
  loading,
}: {
  posts: any[];
  loading: boolean;
}) {
  if (loading) {
    return <SavedGridSkeleton />;
  }

  return (
    <div
      className={cn(
        "grid gap-6 lg:grid-cols-2",
        "animate-fade-in motion-reduce:animate-none",
      )}
    >
      {posts.map((post) => (
        <div key={post.id} className="min-w-0">
          <PostCard post={post} />
        </div>
      ))}
    </div>
  );
}
