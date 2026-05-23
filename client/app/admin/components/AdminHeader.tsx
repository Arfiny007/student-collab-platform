"use client";

import { Menu } from "lucide-react";
import { cn } from "@/lib/utils";

export default function AdminHeader({
  title,
  subtitle,
}: {
  title: string;
  subtitle?: string;
}) {
  return (
    <header
      className={cn(
        "sticky top-0 z-40 border-b border-border/60",
        "bg-background/70 backdrop-blur-xl",
      )}
    >
      <div className="flex items-center gap-4 px-4 py-4 sm:px-6 lg:px-8">
        <button
          type="button"
          aria-label="Open admin menu"
          className={cn(
            "flex size-10 items-center justify-center rounded-xl lg:hidden",
            "border border-border/60 bg-card/80 text-foreground",
          )}
          onClick={() =>
            window.dispatchEvent(
              new Event(
                "toggle-admin-sidebar",
              ),
            )
          }
        >
          <Menu className="size-5" />
        </button>
        <div className="min-w-0 flex-1">
          <h1 className="truncate text-title text-foreground">
            {title}
          </h1>
          {subtitle && (
            <p className="truncate text-body text-muted-foreground">
              {subtitle}
            </p>
          )}
        </div>
      </div>
    </header>
  );
}
