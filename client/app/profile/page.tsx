"use client";

import { useEffect, useState } from "react";
import API from "../../lib/api";

export default function Profile() {
  const [user, setUser] = useState<any>(null);

  useEffect(() => {
    API.get("/users/me").then((res) => {
      setUser(res.data);
    });
  }, []);

  if (!user) return <p>Loading...</p>;

  return (
    <div className="p-10">
      <h1 className="text-2xl font-bold mb-4">👤 Profile</h1>

      <div className="bg-white p-6 rounded-xl shadow w-[400px]">
        <p><b>Email:</b> {user.email}</p>
<p><b>Username:</b> {user.username}</p>
<p><b>Phone:</b> {user.phone}</p>
      </div>
    </div>
  );
}