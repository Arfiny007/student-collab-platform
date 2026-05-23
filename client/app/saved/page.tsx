"use client";

import { useEffect, useMemo, useState } from "react";
import { Bookmark } from "lucide-react";
import API from "../../lib/api";
import { cn } from "@/lib/utils";
import SavedEmptyState from "./components/SavedEmptyState";
import SavedPostGrid from "./components/SavedPostGrid";
import SavedSearch from "./components/SavedSearch";

function filterSavedPosts(posts: any[], query: string) {
  const q = query.trim().toLowerCase();
  if (!q) return posts;

  return posts.filter((post) => {
    const content = (post.content || "").toLowerCase();
    const authorName = (post.author?.name || "").toLowerCase();
    const authorEmail = (post.author?.email || "").toLowerCase();

    return (
      content.includes(q) ||
      authorName.includes(q) ||
      authorEmail.includes(q)
    );
  });
}

export default function SavedPage() {
  const [posts, setPosts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState(false);
  const [search, setSearch] = useState("");

  useEffect(() => {
    setLoading(true);
    setLoadError(false);
    API.get("/users/saved")
      .then((res) => setPosts(res.data))
      .catch(() => {
        setPosts([]);
        setLoadError(true);
      })
      .finally(() => setLoading(false));
  }, []);

  const filteredPosts = useMemo(
    () => filterSavedPosts(posts, search),
    [posts, search],
  );

  const hasSearch = Boolean(search.trim());

  return (
    <div className="min-h-screen bg-background">
      <header
        className="relative overflow-hidden border-b border-border/60"
        style={{ background: "var(--gradient-mesh)" }}
      >
        <div className="absolute inset-0 bg-gradient-brand opacity-85" aria-hidden />
        <div className="absolute inset-0 bg-gradient-to-t from-background via-background/20 to-transparent" />
        <div className="relative mx-auto max-w-6xl px-4 py-10 sm:px-6 sm:py-12">
          <div className="flex items-center gap-3">
            <span
              className={cn(
                "flex size-11 items-center justify-center rounded-2xl",
                "bg-brand-foreground/15 text-brand-foreground",
              )}
              aria-hidden
            >
              <Bookmark className="size-5" />
            </span>
            <div>
              <h1 className="text-display text-brand-foreground">Saved posts</h1>
              <p className="mt-1 text-body text-brand-foreground/80">
                Your bookmarked discussions and resources, in one place.
              </p>
            </div>
          </div>
        </div>
      </header>

      <div className="mx-auto max-w-6xl space-y-6 px-4 py-8 sm:px-6 sm:py-10">
        {(posts.length > 0 || hasSearch) && (
          <SavedSearch
            value={search}
            onChange={setSearch}
            resultCount={filteredPosts.length}
            totalCount={posts.length}
          />
        )}

        {loadError && (
          <p className="rounded-xl border border-destructive/30 bg-destructive/5 px-4 py-3 text-sm text-destructive">
            Could not load saved posts. Check your connection and try again.
          </p>
        )}

        {!loading && posts.length === 0 ? (
          <SavedEmptyState hasSearch={false} />
        ) : !loading && filteredPosts.length === 0 ? (
          <SavedEmptyState hasSearch={hasSearch} />
        ) : (
          <SavedPostGrid posts={filteredPosts} loading={loading} />
        )}
      </div>
    </div>
  );
}
