"use client";

import {
  useEffect,
  useState,
} from "react";

import API from "../../../lib/api";

export default function StoriesBar() {
  const [users, setUsers] =
    useState<any[]>([]);

  useEffect(() => {
    API.get(
      "/users/search?q=",
    ).then(
      (res) =>
        setUsers(
          res.data.slice(
            0,
            12,
          ),
        ),
    );
  }, []);

  return (
    <div className="bg-white dark:bg-gray-900 rounded-3xl p-5 shadow mb-6 overflow-x-auto">

      <div className="flex gap-5">

        {users.map(
          (u) => (
            <div
              key={u.id}
              className="flex flex-col items-center min-w-[70px]"
            >

              <img
                src={
                  u.avatar
                    ? `${process.env.NEXT_PUBLIC_API_URL}/${u.avatar}`
                    : "https://placehold.co/100"
                }
                className="w-16 h-16 rounded-full ring-4 ring-purple-500 object-cover"
              />

              <p className="text-xs mt-2 truncate max-w-[70px]">
                {u.username}
              </p>

            </div>
          ),
        )}

      </div>

    </div>
  );
}