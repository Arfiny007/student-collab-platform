"use client";

export default function SearchBar({ setSearch }: any) {
  return (
    <input
      placeholder="Search posts..."
      className="w-full p-3 border rounded-lg mb-4"
      onChange={(e) => setSearch(e.target.value)}
    />
  );
}