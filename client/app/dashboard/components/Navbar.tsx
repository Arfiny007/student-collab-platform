"use client";

import { useEffect, useState } from "react";
import API from "../../../lib/api";
import { io } from "socket.io-client";

export default function Navbar() {
  const [open, setOpen] = useState(false);
  const [notifications, setNotifications] = useState<any[]>([]);
  const [unread, setUnread] = useState(0);

  // 🔔 LOAD EXISTING NOTIFICATIONS
  useEffect(() => {
    const load = async () => {
      try {
        const res = await API.get("/notifications");

        setNotifications(res.data);
        setUnread(res.data.filter((n: any) => !n.isRead).length);
      } catch (err) {
        console.log("Not logged in or no notifications");
      }
    };

    load();
  }, []);

  // ⚡ REAL-TIME SOCKET
useEffect(() => {
  if (typeof window === "undefined") return; // ✅ fix SSR issue

  const userId = localStorage.getItem("userId");
  if (!userId) return;

  let socket: any;

  const connectSocket = async () => {
    const { io } = await import("socket.io-client"); // ✅ dynamic import (fix)

    socket = io("http://localhost:5000", {
      query: { userId },
      transports: ["websocket"], // ✅ more stable
    });

    socket.on("connect", () => {
      setOpen(true);
      console.log("Connected:", socket.id);
    });

    socket.on("notification", (msg: string) => {
      const newNotif = {
        id: Date.now(),
        message: msg,
        isRead: false,
      };

      setNotifications((prev) => [newNotif, ...prev]);
      setUnread((prev) => prev + 1);
    });

    socket.on("disconnect", () => {
      console.log("Disconnected");
    });
  };

  connectSocket();

  return () => {
    if (socket) socket.disconnect();
  };
}, []);

  // ✅ MARK AS READ
  const markAsRead = async (id: number) => {
    try {
      await API.patch(`/notifications/${id}`);

      setNotifications((prev) =>
        prev.map((n) =>
          n.id === id ? { ...n, isRead: true } : n
        )
      );

      setUnread((prev) => Math.max(prev - 1, 0));
    } catch (err) {
      console.log("Failed to mark as read");
    }
  };

  return (
    <div className="bg-white shadow px-6 py-3 flex justify-between items-center relative">

      <h1 className="text-xl font-bold text-gray-800">
        Student Collab 🚀
      </h1>

      {/* 🔔 NOTIFICATION BELL */}
      <div className="relative">
        <button
          onClick={() => setOpen(!open)}
          className="relative text-2xl"
        >
          🔔

          {/* RED DOT */}
          {unread > 0 && (
            <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs px-1 rounded-full">
              {unread}
            </span>
          )}
        </button>

        {/* DROPDOWN */}
        {open && (
          <div className="absolute right-0 mt-2 w-80 bg-white shadow-xl rounded-xl border max-h-96 overflow-y-auto z-50">

            <div className="p-3 font-semibold border-b">
              Notifications
            </div>

            {notifications.length === 0 && (
              <p className="p-4 text-sm text-gray-400">
                No notifications
              </p>
            )}

            {notifications.map((n) => (
              <div
                key={n.id}
                onClick={() => markAsRead(n.id)}
                className={`p-3 text-sm border-b cursor-pointer transition ${
                  n.isRead
                    ? "bg-white text-gray-500"
                    : "bg-blue-50 font-medium"
                } hover:bg-gray-100`}
              >
                {n.message}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}