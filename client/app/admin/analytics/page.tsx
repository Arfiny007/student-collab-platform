"use client";

import { useCallback, useEffect, useState } from "react";
import {
  BarChart3,
  EyeOff,
  Flag,
  UserX,
  Users,
} from "lucide-react";
import AdminHeader from "../components/AdminHeader";
import AdminStatCard from "../components/AdminStatCard";
import AdminTrendChart from "../components/AdminTrendChart";
import AdminRoleChart from "../components/AdminRoleChart";
import AdminErrorState from "../components/AdminErrorState";
import {
  AdminStatSkeleton,
} from "../components/AdminSkeleton";
import MetricsBarChart from "@/app/analytics/components/MetricsBarChart";
import {
  fetchAdminStats,
  type AdminStats,
} from "@/lib/adminApi";
import { cn } from "@/lib/utils";

function formatDayLabel(day: string) {
  try {
    return new Date(day).toLocaleDateString(
      undefined,
      { month: "short", day: "numeric" },
    );
  } catch {
    return day;
  }
}

export default function AdminAnalyticsPage() {
  const [stats, setStats] =
    useState<AdminStats | null>(null);
  const [loading, setLoading] =
    useState(true);
  const [error, setError] = useState(false);

  const load = useCallback(async () => {
    setLoading(true);
    setError(false);
    try {
      setStats(await fetchAdminStats());
    } catch {
      setError(true);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  return (
    <>
      <AdminHeader
        title="Analytics"
        subtitle="Platform-wide metrics and trends"
      />

      <div className="flex-1 space-y-6 px-4 py-6 sm:px-6 lg:px-8">
        {error && (
          <AdminErrorState onRetry={load} />
        )}

        {loading && !error && (
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {Array.from({ length: 6 }).map(
              (_, i) => (
                <AdminStatSkeleton
                  key={i}
                />
              ),
            )}
          </div>
        )}

        {stats && !error && (
          <>
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              <AdminStatCard
                label="Registered users"
                value={stats.users}
                icon={Users}
                accent="bg-chart-2/20"
              />
              <AdminStatCard
                label="Flagged posts"
                value={stats.reportedPosts}
                icon={Flag}
                accent="bg-chart-1/20"
              />
              <AdminStatCard
                label="Hidden posts"
                value={stats.hiddenPosts}
                icon={EyeOff}
                accent="bg-chart-4/20"
              />
              <AdminStatCard
                label="Blocked users"
                value={stats.blockedUsers}
                icon={UserX}
                accent="bg-destructive/15"
              />
              <AdminStatCard
                label="Muted users"
                value={stats.mutedUsers}
                icon={BarChart3}
                accent="bg-chart-3/20"
              />
              <AdminStatCard
                label="Total posts"
                value={stats.posts}
                icon={BarChart3}
                accent="bg-chart-5/20"
              />
            </div>

            <div className="grid gap-6 lg:grid-cols-2">
              <section
                className={cn(
                  "glass-panel rounded-2xl border border-border/60 p-5 sm:p-8",
                  "animate-slide-up motion-reduce:animate-none",
                )}
              >
                <AdminTrendChart
                  title="Publishing activity"
                  points={stats.postsByDay.map(
                    (p) => ({
                      label: formatDayLabel(
                        p.day,
                      ),
                      value:
                        Number(
                          p.count,
                        ) || 0,
                    }),
                  )}
                />
              </section>

              <section
                className={cn(
                  "glass-panel rounded-2xl border border-border/60 p-5 sm:p-8",
                  "animate-slide-up motion-reduce:animate-none",
                )}
              >
                <h2 className="mb-6 text-title text-foreground">
                  Safety snapshot
                </h2>
                <MetricsBarChart
                  metrics={[
                    {
                      label: "Reports",
                      value:
                        stats.reportedPosts,
                      color:
                        "bg-chart-1/80",
                    },
                    {
                      label: "Hidden",
                      value:
                        stats.hiddenPosts,
                      color:
                        "bg-chart-4/80",
                    },
                    {
                      label: "Blocked",
                      value:
                        stats.blockedUsers,
                      color:
                        "bg-destructive/70",
                    },
                    {
                      label: "Muted",
                      value:
                        stats.mutedUsers,
                      color:
                        "bg-chart-3/80",
                    },
                  ]}
                />
              </section>
            </div>

            <section className="glass-panel rounded-2xl border border-border/60 p-5 sm:p-8">
              <h2 className="mb-6 text-title text-foreground">
                Role distribution
              </h2>
              <AdminRoleChart
                breakdown={
                  stats.roleBreakdown
                }
              />
            </section>
          </>
        )}
      </div>
    </>
  );
}
