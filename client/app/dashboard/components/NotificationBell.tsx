"use client";

import { useEffect, useState } from "react";
import { io } from "socket.io-client";
import API from "../../../lib/api";
import toast from "react-hot-toast";

export default function NotificationBell() {
  const [notifications, setNotifications] = useState<any[]>([]);
  const [open, setOpen] = useState(false);

  useEffect(() => {
  const userId = localStorage.getItem("userId");

  let socket: any;

  // ✅ Load existing notifications
  API.get("/notifications")
    .then((res) => {
      setNotifications(res.data);
    })
    .catch(() => console.log("Failed to load"));

  // ✅ Connect socket
  socket = io("http://localhost:5000", {
    query: { userId },
  });

  socket.on("notification", (msg: string) => {
    const newNotif = {
      id: Date.now(),
      message: msg,
      isRead: false,
    };

    setNotifications((prev) => [newNotif, ...prev]);
    toast.success(msg);
  });

  return () => {
    if (socket) socket.disconnect();
  };
}, []);

const markAsRead = async (id: number) => {
  await API.patch(`/notifications/${id}/read`);

  setNotifications((prev) =>
    prev.map((n) =>
      n.id === id ? { ...n, isRead: true } : n
    )
  );
};

const unreadCount = notifications.filter((n) => !n.isRead).length;

  return (
  <div className="relative">
    
    {/* Bell */}
    <div
      onClick={() => setOpen(!open)}
      className="cursor-pointer text-xl relative"
    >
      🔔

      {/* Unread count */}
      {unreadCount > 0 && (
        <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs px-2 rounded-full">
          {unreadCount}
        </span>
      )}
    </div>

    {/* Dropdown */}
    {open && (
      <div className="absolute right-0 mt-3 w-72 bg-white shadow-lg rounded-xl p-4 border z-50">
        <h4 className="font-semibold mb-2">Notifications</h4>

        {notifications.length === 0 && (
          <p className="text-sm text-gray-500">No notifications</p>
        )}

        {notifications.map((n) => (
          <div
            key={n.id}
            onClick={() => markAsRead(n.id)}
            className={`text-sm border-b py-2 cursor-pointer ${
              n.isRead
                ? "text-gray-400"
                : "text-gray-800 font-medium"
            }`}
          >
            {n.message}
          </div>
        ))}
      </div>
    )}
  </div>
);
}