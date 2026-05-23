"use client";

import { useEffect, useState, type ComponentType } from "react";
import {
  Briefcase,
  Code2,
  ExternalLink,
  FileText,
  Globe,
  GraduationCap,
  MapPin,
  Pencil,
  UserPlus,
  Users,
} from "lucide-react";
import API from "../../lib/api";
import EditProfileModal from "../dashboard/components/EditProfileModal";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { cn } from "@/lib/utils";

import {
  DEFAULT_AVATAR,
  getAvatarUrl,
} from "@/lib/media";

type TabId = "overview" | "details" | "skills" | "links";

const TABS: { id: TabId; label: string }[] = [
  { id: "overview", label: "Overview" },
  { id: "details", label: "Details" },
  { id: "skills", label: "Skills" },
  { id: "links", label: "Links" },
];

function ProfileSkeleton() {
  return (
    <div className="min-h-screen bg-background">
      <Skeleton className="h-44 w-full rounded-none sm:h-52" />
      <div className="mx-auto max-w-5xl px-4 pb-12 sm:px-6">
        <div className="glass-panel -mt-20 rounded-3xl border border-border/80 p-6 shadow-elevated-lg sm:p-8">
          <div className="flex flex-col gap-6 sm:flex-row sm:items-start">
            <Skeleton className="mx-auto size-28 shrink-0 rounded-full sm:mx-0 sm:size-36" />
            <div className="flex flex-1 flex-col gap-3">
              <Skeleton className="h-8 w-48" />
              <Skeleton className="h-4 w-56" />
              <Skeleton className="h-16 w-full" />
              <Skeleton className="h-10 w-32 rounded-xl" />
            </div>
            <Skeleton className="mx-auto size-24 rounded-full sm:mx-0" />
          </div>
          <div className="mt-8 grid grid-cols-3 gap-3">
            <Skeleton className="h-24 rounded-2xl" />
            <Skeleton className="h-24 rounded-2xl" />
            <Skeleton className="h-24 rounded-2xl" />
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
}: {
  label: string;
  value: number | string | undefined;
  icon: ComponentType<{ className?: string }>;
  accent: string;
}) {
  return (
    <div
      className={cn(
        "glass-panel interactive-lift rounded-2xl border border-border/60 p-4 text-center sm:p-5",
        "motion-reduce:transition-none",
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
    </div>
  );
}

export default function ProfilePage() {
  const [user, setUser] = useState<any>(null);
  const [editing, setEditing] = useState(false);
  const [activeTab, setActiveTab] = useState<TabId>("overview");

  const loadProfile = async () => {
    const res = await API.get("/users/me");
    setUser(res.data);
  };

  useEffect(() => {
    loadProfile();
  }, []);

  if (!user) {
    return <ProfileSkeleton />;
  }

  const fields = [
    user.avatar,
    user.bio,
    user.university,
    user.department,
    user.location,
    user.github,
    user.linkedin,
    user.portfolio,
    user.skills,
  ];

  const completed = fields.filter(Boolean).length;
  const completion = Math.round((completed / fields.length) * 100);

  const avatarSrc =
    getAvatarUrl(user.avatar, user.id) || DEFAULT_AVATAR;

  const skillList = user.skills
    ? String(user.skills)
        .split(",")
        .map((s: string) => s.trim())
        .filter(Boolean)
    : [];

  const socialLinks = [
    { key: "github", href: user.github, label: "GitHub", icon: Code2 },
    { key: "linkedin", href: user.linkedin, label: "LinkedIn", icon: ExternalLink },
    { key: "portfolio", href: user.portfolio, label: "Portfolio", icon: Globe },
  ].filter((l) => Boolean(l.href));

  const detailItems = [
    { icon: GraduationCap, label: "University", value: user.university },
    { icon: Briefcase, label: "Department", value: user.department },
    { icon: MapPin, label: "Location", value: user.location },
  ];

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

      <div className="mx-auto max-w-5xl px-4 pb-12 sm:px-6">
        <div
          className={cn(
            "glass-panel -mt-20 animate-slide-up rounded-3xl border border-border/80",
            "p-5 shadow-elevated-lg sm:p-8 motion-reduce:animate-none",
          )}
        >
          {/* Header */}
          <div className="flex flex-col gap-6 lg:flex-row lg:items-start lg:gap-8">
            <div className="relative mx-auto shrink-0 sm:mx-0">
              <div
                className={cn(
                  "rounded-full p-1",
                  "bg-gradient-brand shadow-glow-brand",
                )}
              >
                <img
                  src={avatarSrc}
                  alt=""
                  className="size-28 rounded-full border-4 border-background object-cover sm:size-36"
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
                {user.bio || "Tell the world about yourself"}
              </p>
              <Button
                variant="brand"
                size="lg"
                className="mt-4 gap-2"
                onClick={() => setEditing(true)}
              >
                <Pencil className="size-4" aria-hidden />
                Edit Profile
              </Button>
            </div>

            {/* Completion ring */}
            <div
              className="flex shrink-0 flex-col items-center justify-center"
              aria-label={`Profile ${completion}% complete`}
            >
              <div className="relative size-24 sm:size-28">
                <svg
                  className="size-full -rotate-90"
                  viewBox="0 0 100 100"
                  aria-hidden
                >
                  <circle
                    cx="50"
                    cy="50"
                    r="42"
                    fill="none"
                    className="stroke-muted"
                    strokeWidth="8"
                  />
                  <circle
                    cx="50"
                    cy="50"
                    r="42"
                    fill="none"
                    className="stroke-primary transition-[stroke-dashoffset] duration-500 ease-out"
                    strokeWidth="8"
                    strokeLinecap="round"
                    strokeDasharray={`${completion * 2.64} 264`}
                  />
                </svg>
                <span className="absolute inset-0 flex items-center justify-center text-xl font-bold text-foreground sm:text-2xl">
                  {completion}%
                </span>
              </div>
              <p className="mt-2 text-xs font-medium text-muted-foreground">
                Profile complete
              </p>
            </div>
          </div>

          {/* Stats */}
          <div className="stagger-fade mt-8 grid grid-cols-3 gap-3 sm:gap-4">
            <StatCard
              label="Posts"
              value={user.posts}
              icon={FileText}
              accent="bg-primary/15"
            />
            <StatCard
              label="Followers"
              value={user.followers}
              icon={Users}
              accent="bg-chart-2/20"
            />
            <StatCard
              label="Following"
              value={user.following}
              icon={UserPlus}
              accent="bg-chart-3/20"
            />
          </div>

          {/* Tabs */}
          <div
            className="mt-8 flex gap-1 overflow-x-auto rounded-2xl border border-border/60 bg-muted/40 p-1"
            role="tablist"
            aria-label="Profile sections"
          >
            {TABS.map((tab) => (
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
            {activeTab === "overview" && (
              <section
                role="tabpanel"
                className="glass-panel rounded-2xl border border-border/60 p-5 sm:p-6"
              >
                <h2 className="text-lg font-semibold text-foreground">About</h2>
                <p className="mt-3 text-sm leading-relaxed text-muted-foreground sm:text-base">
                  {user.bio ||
                    "Add a bio in Edit Profile to introduce yourself to the community."}
                </p>
                {(user.university || user.location) && (
                  <div className="mt-4 flex flex-wrap gap-2">
                    {user.university && (
                      <span className="inline-flex items-center gap-1.5 rounded-full bg-muted px-3 py-1 text-xs font-medium text-foreground">
                        <GraduationCap className="size-3.5" aria-hidden />
                        {user.university}
                      </span>
                    )}
                    {user.location && (
                      <span className="inline-flex items-center gap-1.5 rounded-full bg-muted px-3 py-1 text-xs font-medium text-foreground">
                        <MapPin className="size-3.5" aria-hidden />
                        {user.location}
                      </span>
                    )}
                  </div>
                )}
              </section>
            )}

            {activeTab === "details" && (
              <section role="tabpanel" className="space-y-3">
                {detailItems.map((item) => (
                  <div
                    key={item.label}
                    className="glass-panel flex items-start gap-4 rounded-2xl border border-border/60 p-4 sm:p-5"
                  >
                    <div className="flex size-10 shrink-0 items-center justify-center rounded-xl bg-primary/10">
                      <item.icon
                        className="size-5 text-primary"
                        aria-hidden
                      />
                    </div>
                    <div className="min-w-0">
                      <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
                        {item.label}
                      </p>
                      <p className="mt-0.5 text-sm font-medium text-foreground sm:text-base">
                        {item.value || "Not set"}
                      </p>
                    </div>
                  </div>
                ))}
              </section>
            )}

            {activeTab === "skills" && (
              <section role="tabpanel">
                {skillList.length > 0 ? (
                  <div className="flex flex-wrap gap-2">
                    {skillList.map((skill: string) => (
                      <span
                        key={skill}
                        className="inline-flex rounded-full bg-gradient-brand px-4 py-2 text-sm font-medium text-brand-foreground shadow-sm"
                      >
                        {skill}
                      </span>
                    ))}
                  </div>
                ) : (
                  <p className="rounded-2xl border border-dashed border-border/80 bg-muted/30 px-4 py-8 text-center text-sm text-muted-foreground">
                    No skills added yet. Use Edit Profile to add comma-separated
                    skills.
                  </p>
                )}
              </section>
            )}

            {activeTab === "links" && (
              <section role="tabpanel">
                {socialLinks.length > 0 ? (
                  <div className="grid gap-3 sm:grid-cols-3">
                    {socialLinks.map((link) => (
                      <a
                        key={link.key}
                        href={String(link.href)}
                        target="_blank"
                        rel="noopener noreferrer"
                        className={cn(
                          "glass-panel interactive-lift flex items-center gap-3 rounded-2xl",
                          "border border-border/60 p-4 transition-colors",
                          "hover:border-primary/30 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring/50",
                        )}
                      >
                        <div className="flex size-10 items-center justify-center rounded-xl bg-muted">
                          <link.icon
                            className="size-5 text-foreground"
                            aria-hidden
                          />
                        </div>
                        <span className="font-medium text-foreground">
                          {link.label}
                        </span>
                      </a>
                    ))}
                  </div>
                ) : (
                  <p className="rounded-2xl border border-dashed border-border/80 bg-muted/30 px-4 py-8 text-center text-sm text-muted-foreground">
                    No social links yet. Add GitHub, LinkedIn, or portfolio in
                    Edit Profile.
                  </p>
                )}
              </section>
            )}
          </div>
        </div>
      </div>

      {editing && (
        <EditProfileModal
          user={user}
          onClose={() => setEditing(false)}
          refresh={loadProfile}
        />
      )}
    </div>
  );
}
