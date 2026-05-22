"use client";

import {
  useEffect,
  useState,
} from "react";

import API from "../../../lib/api";

import {
  getSocket,
} from "../../../lib/socket";

export default function Navbar() {
  const [
    open,
    setOpen,
  ] =
    useState(
      false,
    );

  const [
    notifications,
    setNotifications,
  ] =
    useState<
      any[]
    >([]);

  const [
    unread,
    setUnread,
  ] =
    useState(
      0,
    );

  useEffect(() => {
    const load =
      async () => {
        try {
          const res =
            await API.get(
              "/notifications",
            );

          setNotifications(
            res.data,
          );

          setUnread(
            res.data.filter(
              (
                n: any,
              ) =>
                !n.isRead,
            ).length,
          );
        } catch {}
      };

    load();

    const socket =
      getSocket();

    socket.on(
      "notification",
      (
        msg,
      ) => {
        setNotifications(
          (
            prev,
          ) => [
            {
              id:
                Date.now(),
              message:
                msg,
              isRead:
                false,
            },
            ...prev,
          ],
        );

        setUnread(
          (
            prev,
          ) =>
            prev +
            1,
        );
      },
    );

    return () => {
      socket.off(
        "notification",
      );
    };
  }, []);

  const markAsRead =
    async (
      id: number,
    ) => {
      try {
        await API.patch(
          `/notifications/${id}`,
        );

        setNotifications(
          (
            prev,
          ) =>
            prev.map(
              (
                n,
              ) =>
                n.id ===
                id
                  ? {
                      ...n,
                      isRead:
                        true,
                    }
                  : n,
            ),
        );

        setUnread(
          (
            prev,
          ) =>
            Math.max(
              prev -
                1,
              0,
            ),
        );
      } catch {}
    };



  return (
    <div className="bg-white dark:bg-gray-900 shadow px-8 py-4 flex justify-between items-center">

      <h1 className="text-xl font-bold">
        Student Collab 🚀
      </h1>

      <div className="flex items-center gap-8 mr-20">

        <button
          onClick={() =>
            window.dispatchEvent(
              new Event(
                "open-chat",
              ),
            )
          }
          className="text-2xl hover:scale-110 transition"
        >
          💬
        </button>

        <div className="relative">

          <button
            onClick={() =>
              setOpen(
                !open,
              )
            }
            className="text-2xl relative"
          >
            🔔

            {unread >
              0 && (
              <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs px-2 rounded-full">
                {
                  unread
                }
              </span>
            )}

          </button>

          {open && (
            <div className="absolute right-0 top-14 w-96 bg-white dark:bg-gray-900 rounded-3xl shadow-2xl border z-[1000] max-h-[500px] overflow-y-auto">

              <div className="p-4 font-bold border-b">
                Notifications
              </div>

              {notifications.map(
                (
                  n,
                ) => (
                  <div
                    key={
                      n.id
                    }
                    onClick={() =>
                      markAsRead(
                        n.id,
                      )
                    }
                    className="p-4 cursor-pointer border-b hover:bg-gray-50 dark:hover:bg-gray-800"
                  >
                    {
                      n.message
                    }
                  </div>
                  
                ),
              )}
              <button
  onClick={() =>
    API.patch(
      "/notifications/read-all",
    )
  }

  className="p-3 text-blue-600"
>
  Mark all as read
</button>
            </div>
          )}

        </div>

      </div>

    </div>
  );
}