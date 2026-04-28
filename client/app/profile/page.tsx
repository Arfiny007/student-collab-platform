"use client";

import { useEffect, useState } from "react";
import API from "../../lib/api";

export default function Profile() {
  const [user, setUser] = useState<any>({});
  const [followers, setFollowers] = useState(0);
  const [following, setFollowing] = useState(0);

  useEffect(() => {
    const load = async () => {
      const id = localStorage.getItem("userId");

      const res = await API.get(`/users/${id}`);
      const f1 = await API.get(`/follow/followers/${id}`);
      const f2 = await API.get(`/follow/following/${id}`);

      setUser(res.data);
      setFollowers(f1.data);
      setFollowing(f2.data);
    };

    load();
  }, []);

  return (
    <div className="max-w-xl mx-auto bg-white p-6 rounded-xl shadow">
      <h1 className="text-2xl font-bold">{user.email}</h1>

      <div className="flex gap-4 mt-3">
        <p>Followers: {followers}</p>
        <p>Following: {following}</p>
      </div>
    </div>
  );
}