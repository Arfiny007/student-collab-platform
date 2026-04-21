"use client";

export default function Sidebar() {
  return (
<div className="w-64 h-screen bg-white border-r p-6">
<h1 className="text-2xl font-bold mb-8 text-gray-800">🚀 Collab</h1>
      <ul className="space-y-4">
<li className="text-gray-600 hover:text-blue-600 cursor-pointer">Dashboard</li>        <li className="hover:text-blue-400 cursor-pointer">My Posts</li>
        <li className="hover:text-blue-400 cursor-pointer">Explore</li>
        <li className="text-gray-600 hover:text-blue-600 cursor-pointer">
  Profile
</li>
        <li className="hover:text-blue-400 cursor-pointer">Settings</li>
      </ul>
    </div>
  );
}