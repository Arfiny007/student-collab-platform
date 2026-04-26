"use client";

import NotificationBell from "../dashboard/components/NotificationBell";

export default function MainLayout({ children }: any) {
  return (
    <div className="flex h-screen bg-gradient-to-br from-gray-100 to-gray-200">

      {/* LEFT SIDEBAR */}
      <div className="w-64 bg-white/70 backdrop-blur-lg shadow-lg p-5 flex flex-col">
        <h1 className="text-2xl font-bold mb-6 text-blue-600">
          StudentHub
        </h1>

        <nav className="flex flex-col gap-4 text-gray-700">
          <a href="/feed" className="hover:text-blue-600">🏠 Feed</a>
          <a href="/profile" className="hover:text-blue-600">👤 Profile</a>
          <a href="/chat" className="hover:text-blue-600">💬 Messages</a>
        </nav>
      </div>

      {/* CENTER FEED */}
      <div className="flex-1 overflow-y-auto p-6">
        {children}
      </div>

      {/* RIGHT PANEL */}
      <div className="w-80 p-5">
        <NotificationBell />
      </div>
    </div>
  );
}