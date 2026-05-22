"use client";

import { useEffect, useState } from "react";
import { usePathname, useRouter } from "next/navigation";
import {
  BarChart3,
  Bookmark,
  CircleDot,
  Compass,
  Home,
  MessageCircle,
  User,
  X,
} from "lucide-react";
import { cn } from "@/lib/utils";

const NAV_ITEMS = [
  { href: "/dashboard", label: "Feed", icon: Home },
  { href: "/explore", label: "Explore", icon: Compass },
  { href: "/saved", label: "Saved", icon: Bookmark },
  { href: "/analytics", label: "Analytics", icon: BarChart3 },
  { href: "/profile", label: "Profile", icon: User },
  { href: "/messages", label: "Messages", icon: MessageCircle },
] as const;

function isActiveRoute(pathname: string, href: string) {
  if (href === "/dashboard") {
    return pathname === "/dashboard";
  }
  return pathname === href || pathname.startsWith(`${href}/`);
}

export default function Sidebar() {
  const router = useRouter();
  const pathname = usePathname();
  const [mobileOpen, setMobileOpen] = useState(false);

  useEffect(() => {
    const onToggle = () => setMobileOpen((prev) => !prev);
    window.addEventListener("toggle-sidebar", onToggle);
    return () => window.removeEventListener("toggle-sidebar", onToggle);
  }, []);

  useEffect(() => {
    setMobileOpen(false);
  }, [pathname]);

  useEffect(() => {
    if (!mobileOpen) return;
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") setMobileOpen(false);
    };
    document.addEventListener("keydown", onKeyDown);
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", onKeyDown);
      document.body.style.overflow = "";
    };
  }, [mobileOpen]);

  const navigate = (href: string) => {
    setMobileOpen(false);
    router.push(href);
  };

  return (
    <>
      {mobileOpen && (
        <button
          type="button"
          aria-label="Close navigation menu"
          className={cn(
            "fixed inset-0 z-[55] bg-background/50 backdrop-blur-[2px]",
            "transition-opacity duration-[var(--duration-normal)] ease-[var(--ease-out-expo)]",
            "lg:hidden",
          )}
          onClick={() => setMobileOpen(false)}
        />
      )}

      <aside
        aria-label="Main navigation"
        className={cn(
          "fixed inset-y-0 left-0 z-[60] flex h-screen w-72 shrink-0 flex-col",
          "border-r border-sidebar-border bg-sidebar/95 glass-panel",
          "bg-gradient-subtle shadow-elevated-lg",
          "transition-[transform,box-shadow] duration-[var(--duration-normal)] ease-[var(--ease-out-expo)]",
          "lg:sticky lg:top-0 lg:z-auto lg:translate-x-0",
          mobileOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0",
        )}
      >
        <div className="flex items-center justify-between gap-3 border-b border-sidebar-border/80 px-6 py-5">
          <div className="flex min-w-0 items-center gap-3">
            <span
              className={cn(
                "flex size-10 shrink-0 items-center justify-center rounded-xl",
                "bg-gradient-brand text-brand-foreground shadow-glow-brand",
              )}
              aria-hidden="true"
            >
              <CircleDot className="size-5" strokeWidth={2.25} />
            </span>
            <div className="min-w-0">
              <p className="text-caption font-medium uppercase tracking-wider text-muted-foreground">
                Workspace
              </p>
              <h1 className="truncate text-title text-gradient-brand">
                ClassCircle
              </h1>
            </div>
          </div>

          <button
            type="button"
            aria-label="Close menu"
            onClick={() => setMobileOpen(false)}
            className={cn(
              "flex size-8 shrink-0 items-center justify-center rounded-lg",
              "text-muted-foreground transition-colors duration-[var(--duration-fast)]",
              "hover:bg-sidebar-accent hover:text-sidebar-foreground",
              "focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring",
              "lg:hidden",
            )}
          >
            <X className="size-4" aria-hidden="true" />
          </button>
        </div>

        <nav className="flex-1 overflow-y-auto px-4 py-5">
          <p className="mb-3 px-3 text-caption font-medium uppercase tracking-wider text-muted-foreground">
            Menu
          </p>
          <ul className="stagger-fade space-y-1">
            {NAV_ITEMS.map(({ href, label, icon: Icon }) => {
              const active = isActiveRoute(pathname, href);
              return (
                <li key={href}>
                  <button
                    type="button"
                    onClick={() => navigate(href)}
                    aria-current={active ? "page" : undefined}
                    className={cn(
                      "group relative flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-left",
                      "text-body font-medium transition-[color,background,transform,box-shadow]",
                      "duration-[var(--duration-fast)] ease-[var(--ease-out-expo)]",
                      "focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring",
                      active
                        ? "bg-sidebar-accent text-sidebar-primary shadow-sm"
                        : "text-sidebar-foreground/85 hover:bg-sidebar-accent/60 hover:text-sidebar-foreground",
                    )}
                  >
                    <span
                      className={cn(
                        "absolute left-0 top-1/2 h-6 w-1 -translate-y-1/2 rounded-r-full bg-sidebar-primary",
                        "transition-[opacity,transform] duration-[var(--duration-fast)] ease-[var(--ease-out-expo)]",
                        active
                          ? "scale-y-100 opacity-100"
                          : "scale-y-0 opacity-0 group-hover:scale-y-75 group-hover:opacity-40",
                      )}
                      aria-hidden="true"
                    />
                    <span
                      className={cn(
                        "flex size-9 shrink-0 items-center justify-center rounded-lg transition-[background,color,transform]",
                        "duration-[var(--duration-fast)] ease-[var(--ease-out-expo)]",
                        active
                          ? "bg-sidebar-primary/15 text-sidebar-primary"
                          : "bg-sidebar-accent/40 text-muted-foreground group-hover:bg-sidebar-accent group-hover:text-sidebar-foreground group-hover:translate-x-0.5",
                      )}
                    >
                      <Icon
                        className="size-[1.125rem]"
                        strokeWidth={active ? 2.25 : 2}
                        aria-hidden="true"
                      />
                    </span>
                    <span className="truncate">{label}</span>
                  </button>
                </li>
              );
            })}
          </ul>
        </nav>

        <div className="border-t border-sidebar-border/80 px-6 py-4">
          <p className="text-caption text-muted-foreground">
            Premium campus collaboration
          </p>
        </div>
      </aside>
    </>
  );
}
