"use client";

import { useEffect, useState, type ComponentType } from "react";
import {
  Ban,
  Eye,
  FileText,
  MessageCircle,
  UserPlus,
  Users,
  VolumeX,
  X,
} from "lucide-react";
import Link from "next/link";
import API from "../../../lib/api";
import { useParams } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { cn } from "@/lib/utils";
import {
  DEFAULT_AVATAR,
  getAvatarUrl,
  getMediaUrl,
} from "@/lib/media";

type TabId = "posts" | "about";

function ProfileSkeleton() {
  return (
    <div className="min-h-screen bg-background">
      <Skeleton className="h-44 w-full rounded-none sm:h-52" />
      <div className="mx-auto max-w-6xl px-4 pb-12 sm:px-6">
        <div className="glass-panel -mt-20 rounded-3xl border border-border/80 p-6 shadow-elevated-lg sm:p-8">
          <div className="flex flex-col gap-6 sm:flex-row">
            <Skeleton className="mx-auto size-32 rounded-full sm:mx-0" />
            <div className="flex flex-1 flex-col gap-3">
              <Skeleton className="h-8 w-48" />
              <Skeleton className="h-4 w-56" />
              <Skeleton className="h-10 w-28" />
            </div>
          </div>
          <div className="mt-8 grid grid-cols-2 gap-3 sm:grid-cols-4">
            {[1, 2, 3, 4].map((i) => (
              <Skeleton key={i} className="h-24 rounded-2xl" />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

function StatCard({
  label,
  value,
  icon: Icon,
  accent,
  onClick,
  interactive,
}: {
  label: string;
  value: number | string | undefined;
  icon: ComponentType<{ className?: string }>;
  accent: string;
  onClick?: () => void;
  interactive?: boolean;
}) {
  const Wrapper = onClick ? "button" : "div";

  return (
    <Wrapper
      type={onClick ? "button" : undefined}
      onClick={onClick}
      className={cn(
        "glass-panel w-full rounded-2xl border border-border/60 p-4 text-center sm:p-5",
        interactive && "interactive-lift cursor-pointer",
        onClick &&
          "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring/50",
      )}
    >
      <div
        className={cn(
          "mx-auto mb-2 flex size-9 items-center justify-center rounded-xl",
          accent,
        )}
      >
        <Icon className="size-4 text-foreground/80" aria-hidden />
      </div>
      <p className="text-2xl font-bold tracking-tight text-foreground sm:text-3xl">
        {value ?? 0}
      </p>
      <p className="mt-0.5 text-xs font-medium text-muted-foreground sm:text-sm">
        {label}
      </p>
    </Wrapper>
  );
}

function ConnectionModal({
  title,
  items,
  emptyLabel,
  onClose,
  getUser,
}: {
  title: string;
  items: any[];
  emptyLabel: string;
  onClose: () => void;
  getUser: (item: any) => { id?: number; username?: string; avatar?: string };
}) {
  return (
    <div
      className="fixed inset-0 z-50 flex items-end justify-center bg-black/50 p-4 backdrop-blur-sm animate-fade-in sm:items-center motion-reduce:animate-none"
      onClick={onClose}
      role="dialog"
      aria-modal="true"
      aria-labelledby="connection-modal-title"
    >
      <div
        className={cn(
          "glass-panel w-full max-w-md animate-scale-in rounded-t-3xl border border-border/80",
          "shadow-elevated-lg sm:rounded-3xl motion-reduce:animate-none",
        )}
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between border-b border-border/60 px-5 py-4">
          <h2
            id="connection-modal-title"
            className="text-lg font-semibold text-foreground"
          >
            {title}
          </h2>
          <button
            type="button"
            onClick={onClose}
            className={cn(
              "flex size-9 items-center justify-center rounded-xl text-muted-foreground",
              "hover:bg-muted hover:text-foreground",
              "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring/50",
            )}
            aria-label={`Close ${title.toLowerCase()}`}
          >
            <X className="size-5" aria-hidden />
          </button>
        </div>

        <ul className="max-h-[min(60vh,400px)] overflow-y-auto px-3 py-2">
          {items.length === 0 ? (
            <li className="px-3 py-10 text-center text-sm text-muted-foreground">
              {emptyLabel}
            </li>
          ) : (
            items.map((item) => {
              const u = getUser(item);
              const profileHref = u.id ? `/profile/${u.id}` : undefined;
              const avatarSrc = u.avatar
                ? getAvatarUrl(u.avatar, u.id) || DEFAULT_AVATAR
                : DEFAULT_AVATAR;

              const row = (
                <>
                  <img
                    src={avatarSrc}
                    alt=""
                    className="size-11 shrink-0 rounded-full border-2 border-border object-cover"
                  />
                  <span className="truncate font-medium text-foreground">
                    {u.username || "Unknown"}
                  </span>
                </>
              );

              return (
                <li key={item.id}>
                  {profileHref ? (
                    <Link
                      href={profileHref}
                      onClick={onClose}
                      className={cn(
                        "flex items-center gap-3 rounded-xl px-3 py-3",
                        "transition-colors hover:bg-muted/80",
                        "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring/50",
                      )}
                    >
                      {row}
                    </Link>
                  ) : (
                    <div className="flex items-center gap-3 rounded-xl px-3 py-3">
                      {row}
                    </div>
                  )}
                </li>
              );
            })
          )}
        </ul>
      </div>
    </div>
  );
}

export default function PublicProfile() {
  const params = useParams();

  const [user, setUser] = useState<any>(null);
  const [posts, setPosts] = useState<any[]>([]);
  const [followers, setFollowers] = useState<any[]>([]);
  const [following, setFollowing] = useState<any[]>([]);
  const [showFollowers, setShowFollowers] = useState(false);
  const [showFollowing, setShowFollowing] = useState(false);
  const [activeTab, setActiveTab] = useState<TabId>("posts");

  useEffect(() => {
    const load = async () => {
      const id = params.id;

      const profile = await API.get(`/users/${id}`);
      const postsRes = await API.get(`/users/${id}/posts`);
      const followersRes = await API.get(`/follow/${id}/followers`);
      const followingRes = await API.get(`/follow/${id}/following`);

      setUser(profile.data);
      setPosts(postsRes.data);
      setFollowers(followersRes.data);
      setFollowing(followingRes.data);
    };

    load();
  }, []);

  const blockUser = async () => {
    await API.post(`/users/block/${user.id}`);
    alert("User blocked");
  };

  const muteUser = async () => {
    await API.post(`/users/mute/${user.id}`);
    alert("User muted");
  };

  const openChat = () => {
    localStorage.setItem("chatUser", JSON.stringify(user));
    window.dispatchEvent(new Event("open-chat"));
  };

  if (!user) {
    return <ProfileSkeleton />;
  }

  const avatarSrc = user.avatar
    ? getAvatarUrl(user.avatar, user.id) || DEFAULT_AVATAR
    : DEFAULT_AVATAR;

  return (
    <div className="min-h-screen bg-background">
      {/* Cover */}
      <div
        className="relative h-44 overflow-hidden sm:h-52"
        style={{ background: "var(--gradient-mesh)" }}
        aria-hidden
      >
        <div className="absolute inset-0 bg-gradient-brand opacity-90" />
        <div className="absolute inset-0 bg-gradient-to-t from-background/80 via-transparent to-transparent" />
      </div>

      <div className="mx-auto max-w-6xl px-4 pb-12 sm:px-6">
        <div
          className={cn(
            "glass-panel -mt-20 animate-slide-up rounded-3xl border border-border/80",
            "p-5 shadow-elevated-lg sm:p-8 motion-reduce:animate-none",
          )}
        >
          {/* Header */}
          <div className="flex flex-col gap-6 lg:flex-row lg:items-start lg:gap-8">
            <div className="relative mx-auto shrink-0 sm:mx-0">
              <div className="rounded-full bg-gradient-brand p-1 shadow-glow-brand">
                <img
                  src={avatarSrc}
                  alt=""
                  className="size-28 rounded-full border-4 border-background object-cover sm:size-32"
                />
              </div>
            </div>

            <div className="min-w-0 flex-1 text-center sm:text-left">
              <h1 className="text-2xl font-bold tracking-tight text-foreground sm:text-4xl">
                {user.username}
              </h1>
              <p className="mt-1 text-sm text-muted-foreground sm:text-base">
                {user.email}
              </p>
              <p className="mt-3 text-sm leading-relaxed text-foreground/90 sm:text-base">
                {user.bio || "No bio yet"}
              </p>

              <div className="mt-4 flex flex-wrap items-center justify-center gap-2 sm:justify-start">
                <Button
                  variant="brand"
                  size="lg"
                  className="gap-2"
                  onClick={openChat}
                >
                  <MessageCircle className="size-4" aria-hidden />
                  Message
                </Button>
                <Button
                  variant="outline"
                  size="lg"
                  className="gap-2"
                  onClick={muteUser}
                >
                  <VolumeX className="size-4" aria-hidden />
                  Mute
                </Button>
                <Button
                  variant="destructive"
                  size="lg"
                  className="gap-2"
                  onClick={blockUser}
                >
                  <Ban className="size-4" aria-hidden />
                  Block
                </Button>
              </div>
            </div>
          </div>

          {/* Stats */}
          <div className="stagger-fade mt-8 grid grid-cols-2 gap-3 sm:grid-cols-4 sm:gap-4">
            <StatCard
              label="Posts"
              value={posts.length}
              icon={FileText}
              accent="bg-primary/15"
            />
            <StatCard
              label="Views"
              value={user.profileViews}
              icon={Eye}
              accent="bg-chart-4/25"
            />
            <StatCard
              label="Followers"
              value={followers.length}
              icon={Users}
              accent="bg-chart-2/20"
              interactive
              onClick={() => setShowFollowers(true)}
            />
            <StatCard
              label="Following"
              value={following.length}
              icon={UserPlus}
              accent="bg-chart-3/20"
              interactive
              onClick={() => setShowFollowing(true)}
            />
          </div>

          {/* Tabs */}
          <div
            className="mt-8 flex gap-1 overflow-x-auto rounded-2xl border border-border/60 bg-muted/40 p-1"
            role="tablist"
            aria-label="Profile sections"
          >
            {(
              [
                { id: "posts" as const, label: "Posts" },
                { id: "about" as const, label: "About" },
              ] as const
            ).map((tab) => (
              <button
                key={tab.id}
                type="button"
                role="tab"
                aria-selected={activeTab === tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={cn(
                  "min-h-10 shrink-0 rounded-xl px-4 py-2 text-sm font-medium transition-colors",
                  "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring/50",
                  activeTab === tab.id
                    ? "glass-panel text-foreground shadow-sm"
                    : "text-muted-foreground hover:text-foreground",
                )}
              >
                {tab.label}
              </button>
            ))}
          </div>

          {/* Tab panels */}
          <div className="mt-6 animate-fade-in motion-reduce:animate-none">
            {activeTab === "posts" && (
              <section role="tabpanel">
                {posts.length === 0 ? (
                  <p className="rounded-2xl border border-dashed border-border/80 bg-muted/30 px-4 py-12 text-center text-sm text-muted-foreground">
                    No posts yet.
                  </p>
                ) : (
                  <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
                    {posts.map((post) => (
                      <article
                        key={post.id}
                        className={cn(
                          "glass-panel interactive-lift overflow-hidden rounded-2xl",
                          "border border-border/60 p-4 shadow-elevated",
                        )}
                      >
                        {post.image && (
                          <img
                            src={getMediaUrl(post.image) || ""}
                            loading="lazy"
                            alt=""
                            className="mb-3 aspect-video w-full rounded-xl object-cover"
                          />
                        )}
                        <h3 className="font-semibold text-foreground line-clamp-2">
                          {post.title}
                        </h3>
                      </article>
                    ))}
                  </div>
                )}
              </section>
            )}

            {activeTab === "about" && (
              <section
                role="tabpanel"
                className="glass-panel rounded-2xl border border-border/60 p-5 sm:p-6"
              >
                <h2 className="text-lg font-semibold text-foreground">Bio</h2>
                <p className="mt-3 text-sm leading-relaxed text-muted-foreground sm:text-base">
                  {user.bio || "This user has not added a bio yet."}
                </p>
                <dl className="mt-6 grid gap-4 sm:grid-cols-2">
                  <div>
                    <dt className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
                      Username
                    </dt>
                    <dd className="mt-1 text-sm font-medium text-foreground">
                      {user.username}
                    </dd>
                  </div>
                  <div>
                    <dt className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
                      Email
                    </dt>
                    <dd className="mt-1 text-sm font-medium text-foreground">
                      {user.email}
                    </dd>
                  </div>
                </dl>
              </section>
            )}
          </div>
        </div>
      </div>

      {showFollowers && (
        <ConnectionModal
          title="Followers"
          items={followers}
          emptyLabel="No followers yet."
          onClose={() => setShowFollowers(false)}
          getUser={(f) => ({
            id: f.follower?.id,
            username: f.follower?.username,
            avatar: f.follower?.avatar,
          })}
        />
      )}

      {showFollowing && (
        <ConnectionModal
          title="Following"
          items={following}
          emptyLabel="Not following anyone yet."
          onClose={() => setShowFollowing(false)}
          getUser={(f) => ({
            id: f.following?.id,
            username: f.following?.username,
            avatar: f.following?.avatar,
          })}
        />
      )}
    </div>
  );
}
