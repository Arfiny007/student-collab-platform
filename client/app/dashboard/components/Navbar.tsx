"use client";

import NotificationBell from "./NotificationBell";

export default function Navbar() {
  return (
<div className="flex justify-between items-center bg-white px-6 py-4 border-b">
          <h2 className="text-xl font-semibold">Dashboard</h2>

      <div className="flex items-center gap-4">
        <NotificationBell />
        <div className="w-8 h-8 bg-blue-500 rounded-full"></div>
      </div>
    </div>
  );
}