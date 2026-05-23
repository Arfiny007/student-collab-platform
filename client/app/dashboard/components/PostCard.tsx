"use client";

import CommentSection from "./CommentSection";
import API from "../../../lib/api";
import { Skeleton } from "@/components/ui/skeleton";
import { cn } from "@/lib/utils";
import {
  Bookmark,
  Eye,
  FileText,
  Flag,
  Heart,
  Share2,
  Siren,
} from "lucide-react";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

const API_BASE =
  process.env.NEXT_PUBLIC_API_URL ||
  "http://localhost:5000";

const actionBtnClass = cn(
  "inline-flex min-h-11 min-w-11 items-center justify-center gap-1.5 rounded-xl px-3",
  "text-caption text-muted-foreground",
  "transition-[color,background,transform] duration-[var(--duration-fast)] ease-[var(--ease-out-expo)]",
  "hover:bg-muted/80 hover:text-foreground",
  "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring/50",
  "active:scale-[0.98]",
);

function PostCardSkeleton() {
  return (
    <article
      className={cn(
        "glass-panel interactive-lift mb-6 overflow-hidden rounded-2xl border border-border/80 p-4 shadow-elevated sm:rounded-3xl sm:p-6",
      )}
      aria-busy="true"
      aria-label="Loading post"
    >
      <div className="mb-4 flex items-center gap-3">
        <Skeleton className="size-12 shrink-0 rounded-full" />
        <div className="flex flex-1 flex-col gap-2">
          <Skeleton className="h-4 w-32" />
          <Skeleton className="h-3 w-48" />
        </div>
        <Skeleton className="h-9 w-20 rounded-full" />
      </div>
      <Skeleton className="mb-3 h-6 w-3/4" />
      <Skeleton className="mb-2 h-4 w-full" />
      <Skeleton className="mb-4 h-4 w-5/6" />
      <Skeleton className="mb-4 aspect-video w-full rounded-2xl" />
      <div className="flex gap-2 border-t border-border/60 pt-4">
        <Skeleton className="h-10 w-16 rounded-xl" />
        <Skeleton className="h-10 w-10 rounded-xl" />
        <Skeleton className="h-10 w-10 rounded-xl" />
        <Skeleton className="h-10 w-10 rounded-xl" />
      </div>
    </article>
  );
}

export default function PostCard({
  post,
  loading = false,
}: {
  post?: any;
  loading?: boolean;
}) {
  const router = useRouter();

  const [count, setCount] = useState(post?.likeCount || 0);
  const [liked, setLiked] = useState(post?.liked || false);
  const [polls, setPolls] = useState(post?.polls || []);
  const [selected, setSelected] = useState(post?.userVote || null);
  const [voting, setVoting] = useState(false);
  const [currentUserId, setCurrentUserId] = useState<number | null>(null);
  const [isFollowing, setIsFollowing] = useState(post?.isFollowing || false);
  const [saved, setSaved] = useState(post?.saved || false);

  useEffect(() => {
    const id = localStorage.getItem("userId");
    if (id) {
      setCurrentUserId(Number(id));
    }
  }, []);

  useEffect(() => {
    if (!post) return;
    setCount(post.likeCount || 0);
    setLiked(post.liked || false);
    setPolls(post.polls || []);
    setSelected(post.userVote || null);
    setIsFollowing(post.isFollowing || false);
    setSaved(post.saved || false);
  }, [post]);

  if (loading) {
    return <PostCardSkeleton />;
  }

  if (!post) return null;

  const totalVotes = polls.reduce(
    (sum: number, p: any) => sum + p.votes,
    0,
  );

  const votePoll = async (pollId: number) => {
    if (voting) return;

    try {
      setVoting(true);

      const res = await API.post(`/posts/vote/${pollId}`);

      setPolls(res.data);

      setSelected(pollId);
    } catch {
      alert("Vote failed");
    } finally {
      setVoting(false);
    }
  };

  const handleFollow = async () => {
    try {
      const res = await API.post(`/follow/${post.author.id}`);

      setIsFollowing(res.data.following);
    } catch {}
  };

  const toggleLike = async () => {
    try {
      const res = await API.patch(`/posts/${post.id}/toggle-like`);

      setLiked(res.data.liked);

      setCount(res.data.count);
    } catch {}
  };

  const toggleSave = async () => {
    try {
      const res = await API.patch(`/posts/${post.id}/save`);

      setSaved(res.data.saved);
    } catch {}
  };

  const sharePost = async () => {
    try {
      await navigator.clipboard.writeText(post.shareUrl);

      alert("Link copied");
    } catch {}
  };

  const reportPost = async () => {
    try {
      await API.patch(`/posts/${post.id}/report`);

      alert("Post reported");
    } catch {
      alert("Report failed");
    }
  };

  const avatarSrc = post.author?.avatar
    ? `${API_BASE}/${post.author.avatar}`
    : "https://placehold.co/100";

  return (
    <article
      className={cn(
        "glass-panel interactive-lift mb-6 overflow-hidden rounded-2xl border border-border/80 p-4 shadow-elevated sm:rounded-3xl sm:p-6",
        "animate-fade-in",
      )}
    >
      {/* HEADER */}
      <header className="mb-4 flex flex-wrap items-start justify-between gap-3">
        <div className="flex min-w-0 items-center gap-3">
          <button
            type="button"
            onClick={() => router.push(`/profile/${post.author.id}`)}
            className="relative shrink-0 rounded-full p-0.5 transition-transform duration-[var(--duration-fast)] ease-[var(--ease-out-expo)] hover:scale-105 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring/50"
            aria-label={`View ${post.author?.username}'s profile`}
          >
            <span
              className="absolute inset-0 rounded-full bg-gradient-brand opacity-90"
              aria-hidden
            />
            <img
              src={avatarSrc}
              alt=""
              className="relative m-[2px] size-11 rounded-full border-2 border-background object-cover sm:size-12"
            />
          </button>

          <div className="min-w-0">
            <button
              type="button"
              onClick={() => router.push(`/profile/${post.author.id}`)}
              className="text-title block truncate text-left text-foreground transition-colors duration-[var(--duration-fast)] hover:text-primary"
            >
              {post.author?.username}
            </button>
            <p className="text-caption truncate text-muted-foreground">
              {post.author?.email}
            </p>
          </div>
        </div>

        {post.author?.id !== currentUserId && (
          <button
            type="button"
            onClick={handleFollow}
            className={cn(
              "shrink-0 rounded-full px-4 py-2 text-sm font-medium",
              "transition-[background,color,transform] duration-[var(--duration-fast)] ease-[var(--ease-out-expo)]",
              "hover:scale-[1.02] active:scale-[0.98]",
              "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring/50",
              isFollowing
                ? "bg-muted text-muted-foreground"
                : "bg-primary text-primary-foreground shadow-sm hover:brightness-110",
            )}
          >
            {isFollowing ? "Following" : "Follow"}
          </button>
        )}
      </header>

      <h2 className="text-title mb-2 text-foreground">{post.title}</h2>

      <p className="mb-4 text-sm leading-relaxed text-muted-foreground sm:text-[0.9375rem]">
        {post.content}
      </p>

      {post.image && (
        <div className="mb-4 overflow-hidden rounded-2xl border border-border/50">
          <img
            src={`${API_BASE}/${post.image}`}
            alt=""
            className="w-full object-cover transition-transform duration-[var(--duration-slow)] ease-[var(--ease-out-expo)] hover:scale-[1.01]"
          />
        </div>
      )}

      {post.file && (
        <a
          href={`${API_BASE}/${post.file}`}
          target="_blank"
          rel="noopener noreferrer"
          className={cn(
            "mb-4 inline-flex items-center gap-2 rounded-xl border border-border/80 bg-muted/40 px-4 py-2.5",
            "text-sm font-medium text-primary",
            "transition-[background,box-shadow] duration-[var(--duration-fast)] ease-[var(--ease-out-expo)]",
            "hover:bg-muted/70 hover:shadow-sm",
          )}
        >
          <FileText className="size-4 shrink-0" aria-hidden />
          Download File
        </a>
      )}

      {/* POLL */}
      {polls.length > 0 && (
        <div className="mt-4 space-y-3">
          {polls.map((p: any) => {
            const percent = totalVotes
              ? Math.round((p.votes / totalVotes) * 100)
              : 0;
            const isSelected = selected === p.id;

            return (
              <div key={p.id}>
                <button
                  type="button"
                  onClick={() => votePoll(p.id)}
                  disabled={voting}
                  className={cn(
                    "w-full rounded-xl border p-3 text-left text-sm transition-[background,border-color,box-shadow] duration-[var(--duration-normal)] ease-[var(--ease-out-expo)]",
                    "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring/50",
                    "disabled:cursor-not-allowed disabled:opacity-60",
                    isSelected
                      ? "border-primary/40 bg-primary/10 text-foreground"
                      : "border-border/60 bg-muted/30 text-foreground hover:border-border hover:bg-muted/50",
                  )}
                >
                  {p.option}
                </button>

                <div className="mt-1.5 h-1.5 overflow-hidden rounded-full bg-muted">
                  <div
                    className="h-full rounded-full bg-gradient-brand transition-all duration-700 ease-[var(--ease-out-expo)]"
                    style={{ width: `${percent}%` }}
                  />
                </div>

                <p className="text-caption mt-1 text-muted-foreground">
                  {percent}% ({p.votes} votes)
                </p>
              </div>
            );
          })}
        </div>
      )}

      {/* ACTION — all original handlers preserved */}
      <div
        className={cn(
          "mt-5 flex flex-wrap items-center justify-between gap-1 border-t border-border/60 pt-4",
          "sm:gap-2",
        )}
        role="toolbar"
        aria-label="Post actions"
      >
        <button type="button" onClick={toggleLike} className={actionBtnClass}>
          <Heart
            className={cn(
              "size-4 shrink-0 transition-colors duration-[var(--duration-fast)]",
              liked && "fill-destructive text-destructive",
            )}
            aria-hidden
          />
          <span>{count}</span>
        </button>

        <button
          type="button"
          onClick={() =>
            API.patch(`/posts/${post.id}/report`)
          }
          className={actionBtnClass}
          aria-label="Report post"
        >
          <Flag className="size-4 shrink-0" aria-hidden />
        </button>

        <button
          type="button"
          onClick={() =>
            API.patch(`/posts/${post.id}/hide`)
          }
          className={actionBtnClass}
          aria-label="Hide post"
        >
          <Eye className="size-4 shrink-0" aria-hidden />
        </button>

        <button type="button" onClick={toggleSave} className={actionBtnClass}>
          <Bookmark
            className={cn(
              "size-4 shrink-0",
              saved && "fill-primary text-primary",
            )}
            aria-hidden
          />
        </button>

        <button type="button" onClick={sharePost} className={actionBtnClass}>
          <Share2 className="size-4 shrink-0" aria-hidden />
        </button>

        <button type="button" onClick={reportPost} className={actionBtnClass}>
          <Siren className="size-4 shrink-0" aria-hidden />
        </button>

        <button
          type="button"
          onClick={async () => {
            const res = await API.patch(`/posts/${post.id}/save`);

            alert(res.data.saved ? "Saved" : "Unsaved");
          }}
          className={actionBtnClass}
          aria-label="Save post with confirmation"
        >
          <Bookmark className="size-4 shrink-0" aria-hidden />
        </button>

        <button
          type="button"
          onClick={() => {
            navigator.clipboard.writeText(post.shareUrl);

            alert("Link copied");
          }}
          className={actionBtnClass}
          aria-label="Copy share link"
        >
          <Share2 className="size-4 shrink-0" aria-hidden />
        </button>
      </div>

      <CommentSection postId={post.id} />
    </article>
  );
}
