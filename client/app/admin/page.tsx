"use client";

import { useCallback, useEffect, useState } from "react";
import {
  EyeOff,
  Flag,
  MessageSquare,
  Users,
} from "lucide-react";
import AdminHeader from "./components/AdminHeader";
import AdminStatCard from "./components/AdminStatCard";
import AdminTrendChart from "./components/AdminTrendChart";
import AdminRoleChart from "./components/AdminRoleChart";
import AdminErrorState from "./components/AdminErrorState";
import {
  AdminStatSkeleton,
} from "./components/AdminSkeleton";
import {
  fetchAdminStats,
  type AdminStats,
} from "@/lib/adminApi";
import { cn } from "@/lib/utils";

function formatDayLabel(day: string) {
  try {
    const d = new Date(day);
    return d.toLocaleDateString(undefined, {
      weekday: "short",
    });
  } catch {
    return day;
  }
}

export default function AdminOverviewPage() {
  const [stats, setStats] =
    useState<AdminStats | null>(null);
  const [loading, setLoading] =
    useState(true);
  const [error, setError] = useState(false);

  const load = useCallback(async () => {
    setLoading(true);
    setError(false);
    try {
      const data =
        await fetchAdminStats();
      setStats(data);
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
        title="Overview"
        subtitle="Platform health at a glance"
      />

      <div
        className={cn(
          "flex-1 px-4 py-6 sm:px-6 lg:px-8",
          "animate-fade-in motion-reduce:animate-none",
        )}
      >
        {error && (
          <AdminErrorState onRetry={load} />
        )}

        {!error && loading && (
          <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
            {Array.from({ length: 4 }).map(
              (_, i) => (
                <AdminStatSkeleton
                  key={i}
                />
              ),
            )}
          </div>
        )}

        {!error && stats && (
          <>
            <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
              <AdminStatCard
                label="Total users"
                value={stats.users}
                icon={Users}
                accent="bg-chart-2/20"
              />
              <AdminStatCard
                label="Total posts"
                value={stats.posts}
                icon={MessageSquare}
                accent="bg-chart-3/20"
              />
              <AdminStatCard
                label="Open reports"
                value={stats.reportedPosts}
                icon={Flag}
                accent="bg-chart-1/20"
                delta="Needs review"
              />
              <AdminStatCard
                label="Hidden posts"
                value={stats.hiddenPosts}
                icon={EyeOff}
                accent="bg-chart-4/20"
              />
            </div>

            <div className="mt-6 grid gap-6 lg:grid-cols-2">
              <section
                className="glass-panel rounded-2xl border border-border/60 p-5 sm:p-8"
                aria-labelledby="posts-trend"
              >
                <AdminTrendChart
                  title="Posts (7 days)"
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
                className="glass-panel rounded-2xl border border-border/60 p-5 sm:p-8"
                aria-labelledby="roles-breakdown"
              >
                <h2
                  id="roles-breakdown"
                  className="mb-6 text-title text-foreground"
                >
                  Users by role
                </h2>
                <AdminRoleChart
                  breakdown={
                    stats.roleBreakdown
                  }
                />
              </section>
            </div>
          </>
        )}
      </div>
    </>
  );
}
