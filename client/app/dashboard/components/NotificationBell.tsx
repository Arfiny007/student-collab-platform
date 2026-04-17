"use client";

import { useEffect, useState } from "react";
import { io, Socket } from "socket.io-client";

export default function NotificationBell() {
  const [messages, setMessages] = useState<string[]>([]);

  useEffect(() => {
    const userId = localStorage.getItem("userId");

    const socket: Socket = io("http://localhost:5000", {
      query: { userId },
    });

    socket.on("connect", () => {
      console.log("✅ Connected:", socket.id);
    });

    socket.on("notification", (msg: string) => {
      setMessages((prev) => [msg, ...prev]);
    });

    // ✅ CLEANUP FUNCTION (IMPORTANT)
    return () => {
      socket.disconnect();
    };
  }, []);

  return (
    <div className="fixed top-4 right-4 bg-white shadow p-4 rounded w-64">
      <h3 className="font-bold mb-2">🔔 Notifications</h3>
      {messages.length === 0 && <p>No notifications</p>}
      {messages.map((m, i) => (
        <div key={i} className="text-sm border-b py-1">
          {m}
        </div>
      ))}
    </div>
  );
}