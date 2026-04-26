"use client";

import { useEffect, useState } from "react";
import { io } from "socket.io-client";
import API from "../../../lib/api";

export default function NotificationBell() {
  const [messages, setMessages] = useState<string[]>([]);

  useEffect(() => {
    const userId = localStorage.getItem("userId");

    const loadNotifications = async () => {
      try {
        const res = await API.get("/notifications");

        const oldMessages = res.data.map((n: any) => n.message);
        setMessages(oldMessages);
      } catch (err) {
        console.error("Failed to load notifications");
      }
    };

    loadNotifications();

    // ✅ REALTIME SOCKET
    const socket = io("http://localhost:5000", {
      query: { userId },
    });

    socket.on("notification", (msg: string) => {
      setMessages((prev) => [msg, ...prev]);
    });

    return () => {
      socket.disconnect();
    };
  }, []);

  return (
    <div className="fixed top-5 right-5 bg-white shadow-lg p-4 rounded-xl w-72">
      <h3 className="font-bold mb-2">🔔 Notifications</h3>

      {messages.length === 0 && (
        <p className="text-gray-400 text-sm">No notifications</p>
      )}

      {messages.map((msg, index) => (
        <p key={index} className="text-sm border-b py-1">
          {msg}
        </p>
      ))}
    </div>
  );
}