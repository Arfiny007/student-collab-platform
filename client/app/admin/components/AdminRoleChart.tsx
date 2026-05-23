"use client";

import { cn } from "@/lib/utils";

const ROLE_COLORS: Record<string, string> = {
  user: "bg-chart-3/80",
  teacher: "bg-chart-2/80",
  moderator: "bg-chart-4/80",
  admin: "bg-chart-1/80",
};

export default function AdminRoleChart({
  breakdown,
}: {
  breakdown: { role: string; count: string }[];
}) {
  const items = breakdown.map((r) => ({
    role: r.role,
    count: Number(r.count) || 0,
  }));
  const total = items.reduce(
    (s, i) => s + i.count,
    0,
  );

  if (total === 0) {
    return (
      <p className="text-body text-muted-foreground">
        No user role data available.
      </p>
    );
  }

  return (
    <div className="space-y-4">
      <div
        className="flex h-3 overflow-hidden rounded-full bg-muted/50"
        role="img"
        aria-label="User roles distribution"
      >
        {items.map((item) => (
          <div
            key={item.role}
            className={cn(
              "h-full transition-[width] duration-[var(--duration-slow)] ease-[var(--ease-out-expo)] motion-reduce:transition-none",
              ROLE_COLORS[item.role] ||
                "bg-muted-foreground/40",
            )}
            style={{
              width: `${(item.count / total) * 100}%`,
            }}
            title={`${item.role}: ${item.count}`}
          />
        ))}
      </div>
      <ul className="grid gap-2 sm:grid-cols-2">
        {items.map((item) => (
          <li
            key={item.role}
            className="flex items-center justify-between rounded-xl bg-muted/30 px-3 py-2"
          >
            <span className="flex items-center gap-2 text-sm capitalize text-foreground">
              <span
                className={cn(
                  "size-2.5 rounded-full",
                  ROLE_COLORS[item.role] ||
                    "bg-muted-foreground",
                )}
                aria-hidden
              />
              {item.role}
            </span>
            <span className="text-sm font-semibold tabular-nums text-foreground">
              {item.count}
            </span>
          </li>
        ))}
      </ul>
    </div>
  );
}
