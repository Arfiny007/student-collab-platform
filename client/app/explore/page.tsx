"use client";

import { useEffect, useMemo, useState } from "react";
import { Compass } from "lucide-react";
import API from "../../lib/api";
import { cn } from "@/lib/utils";
import ExploreEmptyState from "./components/ExploreEmptyState";
import ExplorePostGrid from "./components/ExplorePostGrid";
import ExploreSearch from "./components/ExploreSearch";
import TrendingTagStrip from "./components/TrendingTagStrip";

function filterExplorePosts(
  posts: any[],
  query: string,
  tag: string | null,
) {
  const q = query.trim().toLowerCase();

  return posts.filter((post) => {
    if (tag) {
      const content = post.content || "";
      if (!content.includes(tag)) return false;
    }
    if (!q) return true;

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

export default function ExplorePage() {
  const [posts, setPosts] = useState<any[]>([]);
  const [tags, setTags] = useState<any[]>([]);
  const [postsLoading, setPostsLoading] = useState(true);
  const [tagsLoading, setTagsLoading] = useState(true);
  const [loadError, setLoadError] = useState(false);
  const [search, setSearch] = useState("");
  const [selectedTag, setSelectedTag] = useState<string | null>(null);

  useEffect(() => {
    setPostsLoading(true);
    setLoadError(false);
    API.get("/posts/explore")
      .then((res) => setPosts(res.data))
      .catch(() => setLoadError(true))
      .finally(() => setPostsLoading(false));

    setTagsLoading(true);
    API.get("/posts/trending")
      .then((res) => setTags(res.data))
      .catch(() => setTags([]))
      .finally(() => setTagsLoading(false));
  }, []);

  const filteredPosts = useMemo(
    () => filterExplorePosts(posts, search, selectedTag),
    [posts, search, selectedTag],
  );

  const hasFilter = Boolean(search.trim() || selectedTag);

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
              <Compass className="size-5" />
            </span>
            <div>
              <h1 className="text-display text-brand-foreground">Explore</h1>
              <p className="mt-1 text-body text-brand-foreground/80">
                Discover trending topics and top community posts.
              </p>
            </div>
          </div>
        </div>
      </header>

      <div className="mx-auto max-w-6xl space-y-6 px-4 py-8 sm:px-6 sm:py-10">
        <TrendingTagStrip
          tags={tags}
          loading={tagsLoading}
          selectedTag={selectedTag}
          onSelectTag={setSelectedTag}
        />

        <ExploreSearch
          value={search}
          onChange={setSearch}
          resultCount={filteredPosts.length}
          totalCount={posts.length}
        />

        {loadError && (
          <p className="rounded-xl border border-destructive/30 bg-destructive/5 px-4 py-3 text-sm text-destructive">
            Could not load explore posts. Check your connection and try again.
          </p>
        )}

        {!postsLoading && filteredPosts.length === 0 ? (
          <ExploreEmptyState hasFilter={hasFilter} />
        ) : (
          <ExplorePostGrid posts={filteredPosts} loading={postsLoading} />
        )}
      </div>
    </div>
  );
}
