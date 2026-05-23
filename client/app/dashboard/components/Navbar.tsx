"use client";

import {
  useCallback,
  useContext,
  useEffect,
  useRef,
  useState,
} from "react";
import { useRouter } from "next/navigation";
import {
  Bell,
  CheckCheck,
  CircleDot,
  LogOut,
  Menu,
  MessageCircle,
} from "lucide-react";
import API from "../../../lib/api";
import { AuthContext } from "../../../context/AuthContext";
import {
  emitNotificationsMarkAll,
  emitNotificationsMarkOne,
} from "../../../lib/socket";
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

function countUnread(list: Notification[]) {
  return list.filter((n) => !n.isRead).length;
}

export default function Navbar() {
  const router = useRouter();
  const { logout } = useContext(AuthContext);
  const [open, setOpen] = useState(false);
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [unread, setUnread] = useState(0);
  const panelRef = useRef<HTMLDivElement>(null);
  const bellRef = useRef<HTMLButtonElement>(null);

  const applyNotifications = useCallback((list: Notification[]) => {
    setNotifications(list);
    setUnread(countUnread(list));
  }, []);

  const load = useCallback(async () => {
    try {
      const res = await API.get("/notifications");
      applyNotifications(res.data);
    } catch {}
  }, [applyNotifications]);

  useEffect(() => {
    load();

    const onSocketNotification = (e: Event) => {
      const message = (e as CustomEvent<string | { message?: string }>)
        .detail;
      const text =
        typeof message === "string"
          ? message
          : message?.message ?? "New notification";

      setNotifications((prev) => {
        const next = [
          {
            id: Date.now(),
            message: text,
            isRead: false,
          },
          ...prev,
        ];
        setUnread(countUnread(next));
        return next;
      });
    };

    const onMarkAll = () => {
      setNotifications((prev) => {
        const next = prev.map((n) => ({ ...n, isRead: true }));
        setUnread(0);
        return next;
      });
    };

    const onMarkOne = (e: Event) => {
      const { id } = (e as CustomEvent<{ id: number }>).detail;
      setNotifications((prev) => {
        const next = prev.map((n) =>
          n.id === id ? { ...n, isRead: true } : n,
        );
        setUnread(countUnread(next));
        return next;
      });
    };

    const onRefresh = () => {
      load();
    };

    window.addEventListener(
      "socket:notification",
      onSocketNotification,
    );
    window.addEventListener("notifications:mark-all", onMarkAll);
    window.addEventListener("notifications:mark-one", onMarkOne);
    window.addEventListener("notifications:refresh", onRefresh);

    return () => {
      window.removeEventListener(
        "socket:notification",
        onSocketNotification,
      );
      window.removeEventListener("notifications:mark-all", onMarkAll);
      window.removeEventListener("notifications:mark-one", onMarkOne);
      window.removeEventListener("notifications:refresh", onRefresh);
    };
  }, [load]);

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
      await API.patch(`/notifications/${id}/read`);

      setNotifications((prev) => {
        const next = prev.map((n) =>
          n.id === id ? { ...n, isRead: true } : n,
        );
        setUnread(countUnread(next));
        return next;
      });

      emitNotificationsMarkOne(id);
    } catch {}
  };

  const markAllAsRead = async () => {
    try {
      await API.patch("/notifications/read-all");
      setNotifications((prev) => {
        const next = prev.map((n) => ({ ...n, isRead: true }));
        setUnread(0);
        return next;
      });
      emitNotificationsMarkAll();
    } catch {}
  };

  const handleLogout = () => {
    logout();
    router.push("/login");
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
            aria-label="Sign out"
            onClick={handleLogout}
            className="rounded-xl"
          >
            <LogOut
              className="size-[1.125rem] text-foreground/90"
              strokeWidth={2}
              aria-hidden="true"
            />
          </Button>

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

                {notifications.length > 0 && unread > 0 && (
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
