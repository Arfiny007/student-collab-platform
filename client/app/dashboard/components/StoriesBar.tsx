"use client";

import API from "../../../lib/api";
import { Skeleton } from "@/components/ui/skeleton";
import { cn } from "@/lib/utils";
import { useEffect, useState } from "react";
import { DEFAULT_AVATAR, getAvatarUrl } from "@/lib/media";

const STORY_COUNT = 12;
const SKELETON_COUNT = 10;

function StoryAvatarSkeleton() {
  return (
    <div className="flex w-[4.75rem] shrink-0 flex-col items-center gap-2 sm:w-[5.25rem]">
      <Skeleton className="size-14 rounded-full sm:size-16" />
      <Skeleton className="h-3 w-14 rounded-md" />
    </div>
  );
}

export default function StoriesBar() {
  const [users, setUsers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);

    API.get("/users/search?q=")
      .then((res) =>
        setUsers(res.data.slice(0, STORY_COUNT)),
      )
      .finally(() => setLoading(false));
  }, []);

  return (
    <section
      className={cn(
        "glass-panel interactive-lift mb-6 overflow-hidden rounded-2xl border border-border/80 p-4 shadow-elevated sm:rounded-3xl sm:p-5",
      )}
      aria-busy={loading}
      aria-label="Stories"
    >
      <h2 className="text-title mb-4 px-0.5 text-foreground">Stories</h2>

      <div
        className={cn(
          "flex gap-4 overflow-x-auto pb-1",
          "[scrollbar-width:thin] [-webkit-overflow-scrolling:touch]",
        )}
      >
        {loading &&
          Array.from({ length: SKELETON_COUNT }).map((_, i) => (
            <StoryAvatarSkeleton key={i} />
          ))}

        {!loading &&
          users.map((u) => {
            const avatarSrc =
              getAvatarUrl(u.avatar, u.id) || DEFAULT_AVATAR;

            return (
              <div
                key={u.id}
                className="group flex w-[4.75rem] shrink-0 flex-col items-center sm:w-[5.25rem]"
              >
                <div
                  className={cn(
                    "relative rounded-full p-[3px]",
                    "bg-gradient-brand",
                    "transition-transform duration-[var(--duration-fast)] ease-[var(--ease-out-expo)]",
                    "group-hover:scale-105",
                  )}
                >
                  <div className="rounded-full bg-background p-[2px]">
                    <img
                      src={avatarSrc}
                      alt={`${u.username}'s story`}
                      className="size-14 rounded-full object-cover sm:size-16"
                    />
                  </div>
                </div>

                <p className="text-caption mt-2 max-w-[4.5rem] truncate text-center text-foreground sm:max-w-[5rem]">
                  {u.username}
                </p>
              </div>
            );
          })}

        {!loading && users.length === 0 && (
          <p className="text-caption py-6 text-muted-foreground">
            No stories to show right now.
          </p>
        )}
      </div>
    </section>
  );
}
