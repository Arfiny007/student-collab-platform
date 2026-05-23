"use client";

import {
  useEffect,
  useRef,
  useState,
} from "react";
import {
  Bell,
  BellOff,
  CheckCheck,
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

function NotificationSkeleton() {
  return (
    <div className="space-y-2 px-4 py-3" aria-hidden="true">
      {[0, 1, 2].map((i) => (
        <div
          key={i}
          className="h-12 rounded-xl bg-muted/50 animate-shimmer motion-reduce:animate-none"
        />
      ))}
    </div>
  );
}

export default function NotificationBell() {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [unread, setUnread] = useState(0);
  const [loading, setLoading] = useState(true);
  const listRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const load = async () => {
      try {
        const res = await API.get("/notifications");
        setNotifications(res.data);
        setUnread(
          res.data.filter((n: Notification) => !n.isRead).length,
        );
      } catch {
        console.error("notification load failed");
      } finally {
        setLoading(false);
      }
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

  const markAsRead = async (id: number) => {
    try {
      await API.patch(`/notifications/${id}`);

      setNotifications((prev) =>
        prev.map((n) =>
          n.id === id ? { ...n, isRead: true } : n,
        ),
      );

      setUnread((prev) => Math.max(prev - 1, 0));
    } catch {
      console.error("mark notification read failed");
    }
  };

  const markAllAsRead = async () => {
    try {
      await API.patch("/notifications/read-all");
      setNotifications((prev) =>
        prev.map((n) => ({ ...n, isRead: true })),
      );
      setUnread(0);
    } catch {
      console.error("mark all notifications read failed");
    }
  };

  if (loading) {
    return (
      <div
        className={cn(
          "w-full glass-panel rounded-2xl border border-border/80 shadow-elevated-lg overflow-hidden",
        )}
        aria-busy="true"
        aria-label="Loading notifications"
      >
        <div className="border-b border-border/80 px-4 py-3">
          <div className="h-5 w-32 rounded-md bg-muted/60 animate-shimmer motion-reduce:animate-none" />
        </div>
        <NotificationSkeleton />
      </div>
    );
  }

  return (
    <div
      className={cn(
        "sticky top-4 w-full glass-panel rounded-2xl border border-border/80",
        "shadow-elevated-lg overflow-hidden animate-fade-in",
      )}
    >
      <div className="flex items-center justify-between gap-3 border-b border-border/80 px-4 py-3">
        <div className="flex min-w-0 items-center gap-2.5">
          <span
            className={cn(
              "relative flex size-9 shrink-0 items-center justify-center rounded-xl",
              "bg-primary/10 text-primary",
            )}
            aria-hidden="true"
          >
            <Bell className="size-4" strokeWidth={2} />
            {unread > 0 && (
              <span
                className={cn(
                  "absolute -top-0.5 -right-0.5 size-2.5 rounded-full bg-destructive",
                  "ring-2 ring-background animate-pulse motion-reduce:animate-none",
                )}
              />
            )}
          </span>
          <div className="min-w-0">
            <h3 className="text-title">Notifications</h3>
            <p className="text-caption text-muted-foreground">
              {unread > 0
                ? `${unread} unread`
                : "You're all caught up"}
            </p>
          </div>
        </div>

        {unread > 0 && (
          <Badge
            variant="destructive"
            className="shrink-0 min-w-5 px-1.5 py-0 text-[0.65rem] font-semibold leading-none ring-2 ring-background"
            aria-live="polite"
          >
            {formatBadgeCount(unread)}
          </Badge>
        )}
      </div>

      <div
        ref={listRef}
        role="list"
        aria-label="Notification list"
        className="max-h-[min(420px,50vh)] overflow-y-auto overscroll-contain"
      >
        {notifications.length === 0 ? (
          <div className="flex flex-col items-center px-6 py-10 text-center">
            <span
              className={cn(
                "mb-3 flex size-12 items-center justify-center rounded-2xl",
                "bg-muted/80 text-muted-foreground",
              )}
              aria-hidden="true"
            >
              <BellOff className="size-5" strokeWidth={2} />
            </span>
            <p className="text-title">No notifications yet</p>
            <p className="mt-1 text-body text-muted-foreground">
              Activity from your network will appear here
            </p>
          </div>
        ) : (
          notifications.map((n) => (
            <button
              key={n.id}
              type="button"
              role="listitem"
              onClick={() => {
                if (!n.isRead) {
                  markAsRead(n.id);
                }
              }}
              className={cn(
                "w-full border-b border-border/60 px-4 py-3 text-left text-body",
                "transition-colors duration-[var(--duration-fast)] ease-[var(--ease-out-expo)]",
                "hover:bg-muted/60 focus-visible:bg-muted/60 focus-visible:outline-none",
                !n.isRead && "bg-primary/5",
              )}
            >
              <div className="flex items-start gap-2.5">
                {!n.isRead && (
                  <span
                    className="mt-1.5 size-1.5 shrink-0 rounded-full bg-primary"
                    aria-hidden="true"
                  />
                )}
                <span
                  className={cn(
                    "line-clamp-3 flex-1",
                    !n.isRead
                      ? "font-medium text-foreground"
                      : "text-muted-foreground",
                  )}
                >
                  {n.message}
                </span>
              </div>
            </button>
          ))
        )}
      </div>

      {notifications.length > 0 && unread > 0 && (
        <div className="border-t border-border/80 p-2">
          <Button
            type="button"
            variant="ghost"
            size="sm"
            className="w-full justify-center gap-2 text-primary"
            onClick={markAllAsRead}
          >
            <CheckCheck className="size-4" aria-hidden="true" />
            Mark all as read
          </Button>
        </div>
      )}
    </div>
  );
}
