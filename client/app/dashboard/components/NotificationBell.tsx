"use client";

import {
  useEffect,
  useState,
} from "react";

import API from "../../../lib/api";

export default function NotificationBell() {
  const [
    messages,
    setMessages,
  ] = useState<
    string[]
  >([]);

  const [
    loading,
    setLoading,
  ] =
    useState(
      true,
    );

  useEffect(() => {
    const load =
      async () => {
        try {
          const res =
            await API.get(
              "/notifications",
            );

          setMessages(
            res.data.map(
              (
                n: any,
              ) =>
                n.message,
            ),
          );
        } catch {
          console.error(
            "notification load failed",
          );
        } finally {
          setLoading(
            false,
          );
        }
      };

    load();
  }, []);

  if (
    loading
  ) {
    return null;
  }

  return (
    <div className="fixed top-5 right-5 bg-white shadow-lg p-4 rounded-xl w-72">

      <h3 className="font-bold mb-2">
        🔔 Notifications
      </h3>

      {messages.length ===
        0 && (
        <p className="text-gray-400 text-sm">
          No notifications
        </p>
      )}

      {messages.map(
        (
          msg,
          index,
        ) => (
          <p
            key={
              index
            }
            className="text-sm border-b py-1"
          >
            {msg}
          </p>
        ),
      )}

    </div>
  );
}