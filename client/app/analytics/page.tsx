"use client";

import { useEffect, useState } from "react";
import {
  BarChart3,
  Eye,
  FileText,
  Sparkles,
  Users,
} from "lucide-react";
import API from "../../lib/api";
import { cn } from "@/lib/utils";
import AnalyticsStatCard from "./components/AnalyticsStatCard";
import AnalyticsSkeleton from "./components/AnalyticsSkeleton";
import EngagementChart from "./components/EngagementChart";
import MetricsBarChart from "./components/MetricsBarChart";

export default function AnalyticsPage() {
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);
    API.get("/users/analytics")
      .then((res) => setData(res.data))
      .finally(() => setLoading(false));
  }, []);

  if (loading || !data) {
    return <AnalyticsSkeleton />;
  }

  const metrics = [
    {
      label: "Views",
      value: data.views ?? 0,
      color: "bg-chart-1/80",
    },
    {
      label: "Followers",
      value: data.followers ?? 0,
      color: "bg-chart-2/80",
    },
    {
      label: "Posts",
      value: data.posts ?? 0,
      color: "bg-chart-3/80",
    },
    {
      label: "Engage",
      value: data.engagement ?? 0,
      color: "bg-chart-4/80",
    },
  ];

  return (
    <div className="min-h-screen bg-background">
      <header
        className="relative overflow-hidden border-b border-border/60"
        style={{ background: "var(--gradient-mesh)" }}
      >
        <div className="absolute inset-0 bg-gradient-brand opacity-85" aria-hidden />
        <div className="absolute inset-0 bg-gradient-to-t from-background via-background/20 to-transparent" />
        <div className="relative mx-auto max-w-6xl px-4 py-10 sm:px-6 sm:py-14">
          <div className="flex items-center gap-3">
            <span
              className={cn(
                "flex size-11 items-center justify-center rounded-2xl",
                "bg-brand-foreground/15 text-brand-foreground shadow-sm",
              )}
              aria-hidden
            >
              <BarChart3 className="size-5" />
            </span>
            <div>
              <h1 className="text-display text-brand-foreground">Analytics</h1>
              <p className="mt-1 text-body text-brand-foreground/80">
                Track reach, audience growth, and content performance.
              </p>
            </div>
          </div>
        </div>
      </header>

      <div
        className={cn(
          "mx-auto max-w-6xl px-4 pb-12 sm:px-6",
          "animate-fade-in motion-reduce:animate-none",
        )}
      >
        <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <AnalyticsStatCard
            label="Profile views"
            value={data.views}
            icon={Eye}
            accent="bg-chart-1/20"
            hint="All time"
          />
          <AnalyticsStatCard
            label="Followers"
            value={data.followers}
            icon={Users}
            accent="bg-chart-2/20"
            hint="Total"
          />
          <AnalyticsStatCard
            label="Posts published"
            value={data.posts}
            icon={FileText}
            accent="bg-chart-3/20"
          />
          <AnalyticsStatCard
            label="Engagement"
            value={`${data.engagement ?? 0}%`}
            icon={Sparkles}
            accent="bg-chart-4/25"
            hint="Per post"
          />
        </div>

        <div className="mt-6 grid gap-6 lg:grid-cols-2">
          <section
            className={cn(
              "glass-panel rounded-3xl border border-border/80 p-5 shadow-elevated sm:p-8",
              "animate-slide-up motion-reduce:animate-none",
            )}
            aria-labelledby="metrics-overview"
          >
            <h2
              id="metrics-overview"
              className="mb-6 text-title text-foreground"
            >
              Overview
            </h2>
            <MetricsBarChart metrics={metrics} />
          </section>

          <section
            className={cn(
              "glass-panel rounded-3xl border border-border/80 p-5 shadow-elevated sm:p-8",
              "animate-slide-up motion-reduce:animate-none",
            )}
            aria-labelledby="engagement-chart"
          >
            <h2 id="engagement-chart" className="sr-only">
              Engagement chart
            </h2>
            <EngagementChart percent={data.engagement ?? 0} />
          </section>
        </div>
      </div>
    </div>
  );
}
