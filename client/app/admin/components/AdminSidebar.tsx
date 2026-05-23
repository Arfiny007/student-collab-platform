"use client";

import { useEffect, useState } from "react";
import { usePathname, useRouter } from "next/navigation";
import {
  BarChart3,
  LayoutDashboard,
  Shield,
  Users,
  X,
  Flag,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { fetchCurrentUser } from "@/lib/adminApi";

const NAV = [
  {
    href: "/admin",
    label: "Overview",
    icon: LayoutDashboard,
    adminOnly: false,
  },
  {
    href: "/admin/moderation",
    label: "Reports",
    icon: Flag,
    adminOnly: false,
  },
  {
    href: "/admin/users",
    label: "Users",
    icon: Users,
    adminOnly: true,
  },
  {
    href: "/admin/analytics",
    label: "Analytics",
    icon: BarChart3,
    adminOnly: false,
  },
] as const;

function isActive(pathname: string, href: string) {
  if (href === "/admin") {
    return pathname === "/admin";
  }
  return (
    pathname === href ||
    pathname.startsWith(`${href}/`)
  );
}

export default function AdminSidebar() {
  const router = useRouter();
  const pathname = usePathname();
  const [mobileOpen, setMobileOpen] =
    useState(false);
  const [role, setRole] = useState<string>();

  useEffect(() => {
    fetchCurrentUser()
      .then((u) => setRole(u.role))
      .catch(() => {});
  }, []);

  useEffect(() => {
    setMobileOpen(false);
  }, [pathname]);

  useEffect(() => {
    const onToggle = () =>
      setMobileOpen((p) => !p);
    window.addEventListener(
      "toggle-admin-sidebar",
      onToggle,
    );
    return () =>
      window.removeEventListener(
        "toggle-admin-sidebar",
        onToggle,
      );
  }, []);

  useEffect(() => {
    if (!mobileOpen) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape")
        setMobileOpen(false);
    };
    document.addEventListener(
      "keydown",
      onKey,
    );
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener(
        "keydown",
        onKey,
      );
      document.body.style.overflow = "";
    };
  }, [mobileOpen]);

  const items = NAV.filter(
    (item) =>
      !item.adminOnly ||
      role === "admin",
  );

  const navigate = (href: string) => {
    setMobileOpen(false);
    router.push(href);
  };

  return (
    <>
      {mobileOpen && (
        <button
          type="button"
          aria-label="Close admin menu"
          className="fixed inset-0 z-[55] bg-background/50 backdrop-blur-[2px] lg:hidden"
          onClick={() => setMobileOpen(false)}
        />
      )}

      <aside
        aria-label="Admin navigation"
        className={cn(
          "fixed inset-y-0 left-0 z-[60] flex h-screen w-72 shrink-0 flex-col",
          "border-r border-sidebar-border bg-sidebar/90 glass-panel",
          "transition-[transform] duration-[var(--duration-normal)] ease-[var(--ease-out-expo)]",
          "lg:sticky lg:top-0 lg:z-auto lg:translate-x-0",
          mobileOpen
            ? "translate-x-0"
            : "-translate-x-full lg:translate-x-0",
        )}
      >
        <div className="flex items-center justify-between border-b border-sidebar-border/80 px-5 py-5">
          <div className="flex items-center gap-3">
            <span
              className={cn(
                "flex size-10 items-center justify-center rounded-xl",
                "bg-gradient-brand text-brand-foreground shadow-glow-brand",
              )}
              aria-hidden
            >
              <Shield className="size-5" />
            </span>
            <div>
              <p className="text-caption font-medium uppercase tracking-wider text-muted-foreground">
                Control center
              </p>
              <h1 className="text-title text-gradient-brand">
                Admin
              </h1>
            </div>
          </div>
          <button
            type="button"
            aria-label="Close menu"
            className="rounded-lg p-2 text-muted-foreground hover:bg-muted lg:hidden"
            onClick={() => setMobileOpen(false)}
          >
            <X className="size-4" />
          </button>
        </div>

        <nav className="flex-1 overflow-y-auto px-3 py-4">
          <ul className="space-y-1">
            {items.map(
              ({
                href,
                label,
                icon: Icon,
              }) => {
                const active =
                  isActive(
                    pathname,
                    href,
                  );
                return (
                  <li key={href}>
                    <button
                      type="button"
                      onClick={() =>
                        navigate(href)
                      }
                      aria-current={
                        active
                          ? "page"
                          : undefined
                      }
                      className={cn(
                        "flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-left text-body font-medium",
                        "transition-[background,color] duration-[var(--duration-fast)]",
                        active
                          ? "bg-sidebar-accent text-sidebar-primary"
                          : "text-sidebar-foreground/85 hover:bg-sidebar-accent/60",
                      )}
                    >
                      <Icon
                        className="size-[1.125rem] shrink-0"
                        aria-hidden
                      />
                      {label}
                    </button>
                  </li>
                );
              },
            )}
          </ul>
        </nav>

        <div className="border-t border-sidebar-border/80 px-5 py-4">
          <p className="text-caption capitalize text-muted-foreground">
            Signed in as {role ?? "staff"}
          </p>
        </div>
      </aside>
    </>
  );
}
