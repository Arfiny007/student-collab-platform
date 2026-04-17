"use client";
import { useEffect, useState } from "react";
import API from "../../lib/api";

export default function Dashboard() {
  const [posts, setPosts] = useState([]);

  useEffect(() => {
    API.get("/posts").then((res) => setPosts(res.data));
  }, []);

  return (
    <div className="p-6">
      <h1 className="text-2xl mb-4">Posts</h1>
      {posts.map((p: any) => (
        <div key={p.id} className="border p-3 mb-2">
          <h2 className="font-bold">{p.title}</h2>
          <p>{p.content}</p>
        </div>
      ))}
    </div>
  );
}