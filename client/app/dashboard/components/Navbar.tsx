"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import {
  Bell,
  CheckCheck,
  CircleDot,
  Menu,
  MessageCircle,
} from "lucide-react";
import API from "../../../lib/api";
import { getSocket } from "../../../lib/socket";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

type Notification = {
  id: number;
  message: string;
  isRead: boolean;
};

function formatBadgeCount(count: number) {
  if (count > 99) return "99+";
  return String(count);
}

export default function Navbar() {
  const [open, setOpen] = useState(false);
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [unread, setUnread] = useState(0);
  const panelRef = useRef<HTMLDivElement>(null);
  const bellRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    const load = async () => {
      try {
        const res = await API.get("/notifications");
        setNotifications(res.data);
        setUnread(
          res.data.filter((n: Notification) => !n.isRead).length,
        );
      } catch {}
    };

    load();

    const socket = getSocket();

    socket.on("notification", (msg: string) => {
      setNotifications((prev) => [
        {
          id: Date.now(),
          message: msg,
          isRead: false,
        },
        ...prev,
      ]);
      setUnread((prev) => prev + 1);
    });

    return () => {
      socket.off("notification");
    };
  }, []);

  useEffect(() => {
    if (!open) return;

    const onPointerDown = (e: MouseEvent) => {
      const target = e.target as Node;
      if (
        panelRef.current?.contains(target) ||
        bellRef.current?.contains(target)
      ) {
        return;
      }
      setOpen(false);
    };

    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpen(false);
    };

    document.addEventListener("mousedown", onPointerDown);
    document.addEventListener("keydown", onKeyDown);
    return () => {
      document.removeEventListener("mousedown", onPointerDown);
      document.removeEventListener("keydown", onKeyDown);
    };
  }, [open]);

  const markAsRead = async (id: number) => {
    try {
      await API.patch(`/notifications/${id}`);

      setNotifications((prev) =>
        prev.map((n) =>
          n.id === id ? { ...n, isRead: true } : n,
        ),
      );

      setUnread((prev) => Math.max(prev - 1, 0));
    } catch {}
  };

  const markAllAsRead = async () => {
    try {
      await API.patch("/notifications/read-all");
      setNotifications((prev) =>
        prev.map((n) => ({ ...n, isRead: true })),
      );
      setUnread(0);
    } catch {}
  };

  const openChat = useCallback(() => {
    window.dispatchEvent(new Event("open-chat"));
  }, []);

  const toggleSidebar = useCallback(() => {
    window.dispatchEvent(new Event("toggle-sidebar"));
  }, []);

  return (
    <header
      className={cn(
        "sticky top-0 z-50 glass-panel border-b border-border/80",
        "shadow-sm backdrop-saturate-150",
      )}
    >
      <div className="flex items-center justify-between gap-4 px-4 py-3 sm:px-6 lg:px-8">
        <div className="flex min-w-0 items-center gap-3">
          <Button
            type="button"
            variant="ghost"
            size="icon-sm"
            className="shrink-0 lg:hidden"
            aria-label="Open navigation menu"
            onClick={toggleSidebar}
          >
            <Menu className="size-[1.125rem]" aria-hidden="true" />
          </Button>

          <div className="flex min-w-0 items-center gap-2.5">
            <span
              className={cn(
                "hidden size-9 shrink-0 items-center justify-center rounded-lg sm:flex",
                "bg-gradient-brand text-brand-foreground shadow-glow-brand",
              )}
              aria-hidden="true"
            >
              <CircleDot className="size-4" strokeWidth={2.25} />
            </span>
            <div className="min-w-0">
              <p className="hidden text-caption text-muted-foreground sm:block">
                Welcome back
              </p>
              <h1 className="truncate text-title sm:text-display sm:leading-tight">
                <span className="text-gradient-brand">ClassCircle</span>
              </h1>
            </div>
          </div>
        </div>

        <div className="flex shrink-0 items-center gap-1.5 sm:gap-2 pr-14 sm:pr-16 lg:pr-20">
          <Button
            type="button"
            variant="glass"
            size="icon"
            aria-label="Open messages"
            onClick={openChat}
            className="rounded-xl"
          >
            <MessageCircle
              className="size-[1.125rem] text-foreground/90"
              strokeWidth={2}
              aria-hidden="true"
            />
          </Button>

          <div className="relative">
            <Button
              ref={bellRef}
              type="button"
              variant="glass"
              size="icon"
              aria-label={
                unread > 0
                  ? `Notifications, ${unread} unread`
                  : "Notifications"
              }
              aria-expanded={open}
              aria-haspopup="true"
              onClick={() => setOpen((prev) => !prev)}
              className="rounded-xl"
            >
              <Bell
                className={cn(
                  "size-[1.125rem] transition-transform duration-[var(--duration-fast)] ease-[var(--ease-out-expo)]",
                  open && "scale-105 text-primary",
                )}
                strokeWidth={2}
                aria-hidden="true"
              />
              {unread > 0 && (
                <Badge
                  variant="destructive"
                  className={cn(
                    "absolute -top-1 -right-1 min-w-5 px-1.5 py-0 text-[0.65rem] font-semibold leading-none",
                    "ring-2 ring-background shadow-sm",
                  )}
                >
                  {formatBadgeCount(unread)}
                </Badge>
              )}
            </Button>

            {open && (
              <div
                ref={panelRef}
                role="menu"
                aria-label="Notifications"
                className={cn(
                  "absolute right-0 top-[calc(100%+0.5rem)] w-[min(100vw-2rem,24rem)]",
                  "glass-panel overflow-hidden rounded-2xl border border-border/80",
                  "shadow-elevated-lg animate-scale-in",
                  "z-[1000]",
                )}
              >
                <div className="flex items-center justify-between gap-3 border-b border-border/80 px-4 py-3">
                  <div>
                    <p className="text-title">Notifications</p>
                    <p className="text-caption text-muted-foreground">
                      {unread > 0
                        ? `${unread} unread`
                        : "You're all caught up"}
                    </p>
                  </div>
                  {unread > 0 && (
                    <Badge variant="highlight" className="shrink-0">
                      New
                    </Badge>
                  )}
                </div>

                <div className="max-h-[min(420px,60vh)] overflow-y-auto">
                  {notifications.length === 0 ? (
                    <p className="px-4 py-8 text-center text-body text-muted-foreground">
                      No notifications yet
                    </p>
                  ) : (
                    notifications.map((n) => (
                      <button
                        key={n.id}
                        type="button"
                        role="menuitem"
                        onClick={() => markAsRead(n.id)}
                        className={cn(
                          "w-full border-b border-border/60 px-4 py-3 text-left text-body",
                          "transition-colors duration-[var(--duration-fast)] ease-[var(--ease-out-expo)]",
                          "hover:bg-muted/60 focus-visible:bg-muted/60 focus-visible:outline-none",
                          !n.isRead && "bg-primary/5",
                        )}
                      >
                        <span
                          className={cn(
                            "line-clamp-2",
                            !n.isRead
                              ? "font-medium text-foreground"
                              : "text-muted-foreground",
                          )}
                        >
                          {n.message}
                        </span>
                      </button>
                    ))
                  )}
                </div>

                {notifications.length > 0 && (
                  <div className="border-t border-border/80 p-2">
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      className="w-full justify-center gap-2 text-primary"
                      onClick={markAllAsRead}
                    >
                      <CheckCheck
                        className="size-4"
                        aria-hidden="true"
                      />
                      Mark all as read
                    </Button>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  );
}
