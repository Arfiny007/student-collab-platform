"use client";

import {
  useState,
} from "react";

import API from "../../../lib/api";
import { useRouter } from "next/navigation";

export default function SearchBar({
  setSearch,
}: any) {
  const router = useRouter();

  const [users, setUsers] =
    useState<any[]>([]);

  const searchUsers =
    async (value: string) => {
      setSearch(value);

      if (!value) {
        setUsers([]);
        return;
      }

      const res =
        await API.get(
          `/users/search?q=${value}`,
        );

      setUsers(res.data);
    };

  return (
    <div className="relative mb-4">

      <input
        placeholder="Search posts or people..."
        className="w-full p-3 border rounded-xl"
        onChange={(e) =>
          searchUsers(
            e.target.value,
          )
        }
      />

      {users.length > 0 && (
        <div className="absolute w-full bg-white rounded-xl shadow-xl z-50 mt-2">

          {users.map(
            (user) => (
              <div
                key={user.id}
                onClick={() =>
                  router.push(
                    `/profile/${user.id}`,
                  )
                }
                className="p-3 hover:bg-gray-100 cursor-pointer"
              >
                {
                  user.username
                }
              </div>
            ),
          )}

        </div>
      )}

    </div>
  );
}