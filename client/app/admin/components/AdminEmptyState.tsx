"use client";

import { cn } from "@/lib/utils";
import type { LucideIcon } from "lucide-react";

export default function AdminEmptyState({
  icon: Icon,
  title,
  description,
  action,
}: {
  icon: LucideIcon;
  title: string;
  description: string;
  action?: React.ReactNode;
}) {
  return (
    <div
      className={cn(
        "glass-panel flex flex-col items-center justify-center rounded-2xl border border-dashed border-border/80",
        "px-6 py-14 text-center animate-fade-in motion-reduce:animate-none",
      )}
    >
      <span
        className={cn(
          "mb-4 flex size-14 items-center justify-center rounded-2xl",
          "bg-muted/60 text-muted-foreground",
        )}
        aria-hidden
      >
        <Icon className="size-6" />
      </span>
      <h3 className="text-title text-foreground">{title}</h3>
      <p className="mt-2 max-w-sm text-body text-muted-foreground">
        {description}
      </p>
      {action && <div className="mt-6">{action}</div>}
    </div>
  );
}
