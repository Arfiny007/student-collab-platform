"use client";

import {
  useRouter,
} from "next/navigation";

export default function Sidebar() {
  const router =
    useRouter();

  return (
    <div className="w-64 h-screen bg-white border-r p-6">

      <h1 className="text-2xl font-bold mb-8 bg-gradient-to-r from-blue-500 to-purple-600 bg-clip-text text-transparent">
        🚀 Collab
      </h1>

      <ul className="space-y-5">

        <li
          onClick={() =>
            router.push(
              "/dashboard",
            )
          }
          className="cursor-pointer hover:text-blue-600"
        >
          Feed
        </li>

        <li
          onClick={() =>
            router.push(
              "/profile",
            )
          }
          className="cursor-pointer hover:text-blue-600"
        >
          Profile
        </li>

        <li
          onClick={() =>
            router.push(
              "/messages",
            )
          }
          className="cursor-pointer hover:text-blue-600"
        >
          💬 Messages
        </li>

      </ul>

    </div>
  );
}