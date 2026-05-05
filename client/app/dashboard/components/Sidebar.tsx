"use client";

import {
  useRouter,
} from "next/navigation";

export default function Sidebar() {
  const router =
    useRouter();

  return (
    <div className="w-72 h-screen bg-white dark:bg-gray-900 border-r p-8 transition-all">

      <h1 className="text-3xl font-bold mb-10 bg-gradient-to-r from-blue-500 to-purple-600 bg-clip-text text-transparent">
        🚀 Collab
      </h1>

      <ul className="space-y-6 text-lg">

        <li
          onClick={() =>
            router.push(
              "/dashboard",
            )
          }
          className="cursor-pointer hover:translate-x-2 transition"
        >
          🏠 Feed
        </li>

        <li
          onClick={() =>
            router.push(
              "/explore",
            )
          }
          className="cursor-pointer hover:translate-x-2 transition"
        >
          🔥 Explore
        </li>

        <li
          onClick={() =>
            router.push(
              "/saved",
            )
          }
          className="cursor-pointer hover:translate-x-2 transition"
        >
          🔖 Saved
        </li>

        <li
          onClick={() =>
            router.push(
              "/analytics",
            )
          }
          className="cursor-pointer hover:translate-x-2 transition"
        >
          📊 Analytics
        </li>

        <li
          onClick={() =>
            router.push(
              "/profile",
            )
          }
          className="cursor-pointer hover:translate-x-2 transition"
        >
          👤 Profile
        </li>

        <li
          onClick={() =>
            router.push(
              "/messages",
            )
          }
          className="cursor-pointer hover:translate-x-2 transition"
        >
          💬 Messages
        </li>

      </ul>

    </div>
  );
}